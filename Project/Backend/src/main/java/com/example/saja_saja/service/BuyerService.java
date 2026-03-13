package com.example.saja_saja.service;

import com.example.saja_saja.dto.buyer.*;
import com.example.saja_saja.dto.post.BuyerApplyRequestDto;
import com.example.saja_saja.dto.post.BuyerApplyResponseDto;
import com.example.saja_saja.dto.post.ReceivedAtRequestDto;
import com.example.saja_saja.dto.post.TrackingNumberRequestDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.Buyer;
import com.example.saja_saja.entity.post.BuyerRepository;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.entity.post.PostRepository;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.entity.user.UserAddress;
import com.example.saja_saja.entity.user.UserAddressRepository;
import com.example.saja_saja.entity.user.UserRepository;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BuyerService {

    private final BuyerRepository buyerRepository;
    private final UserAddressRepository userAddressRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // host가 자기 공구 만들 때 기본 수량으로 자동 신청할 때 사용
    public ResponseEntity save(Member member, long postId, int requestQuantity) {
        return this.save(member, postId, new BuyerApplyRequestDto("-","-",false, null, requestQuantity));
    }

    // 구매자/주최자 공구 신청
    @Transactional
    public ResponseEntity save(Member member, Long postId, BuyerApplyRequestDto req) {
        Optional<Post> optional = postRepository.findById(postId);

        if (optional.isEmpty()) {
            throw new BadRequestException("공동구매 게시글을 찾을 수 없습니다.", null);
        }

        if (member.getUser().getIsBanned().equals(Boolean.TRUE)) {
            throw new BadRequestException("이용이 정지된 사용자입니다.", null);
        }

        Post post = optional.get();

        // 이미 취소된 공구
        if (Boolean.TRUE.equals(post.getIsCanceled())) {
            throw new BadRequestException("이미 취소된 공동구매 게시글입니다.", null);
        }

        // 이미 참여한 경우
        Optional<Buyer> optionalB = buyerRepository.findByUserAndPostAndIsCanceled(member.getUser(), post, false);
        if (optionalB.isPresent()) {
            throw new BadRequestException("이미 참여한 공동구매입니다.", null);
        }

        if(member.getUser().getAccount() == null || member.getUser().getAccountBank() == null) {
            throw new BadRequestException("계좌를 등록한 후 주문해주세요.", null);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("body", req);

        // 게시글 상태 체크
        LocalDateTime now = LocalDateTime.now();
        switch (post.getStatus()) {
            case 0, 4 -> {
                // 대기/반려 상태에서는 host만 신청 가능
                if (!post.getHost().equals(member.getUser())) {
                    throw new BadRequestException("신청할 수 없는 게시글입니다.", body);
                }
            }
            case 1, 2 -> {
                // 진행/마감임박 상태에서 endAt 이후는 신청 불가
                if (now.isAfter(post.getEndAt())) {
                    throw new BadRequestException("마감된 게시글입니다.", body);
                }
            }
            case 3 -> throw new BadRequestException("마감된 게시글입니다.", body);
            default -> {
            }
        }

        int currentQuantity = post.getCurrentQuantity();
        int requestQuantity = req.getRequestQuantity();
        int targetQuantity = post.getQuantity();

        // 수량 초과 체크
        if (currentQuantity + requestQuantity > targetQuantity) {
            throw new BadRequestException(
                    "신청 수량이 초과되었습니다. (현재 " + currentQuantity + " / 신청 " + requestQuantity + " / 목표 " + targetQuantity + ")",
                    body
            );
        }

        boolean isDelivery = Boolean.TRUE.equals(req.getIsDelivery());

        // 배송 불가 공구인데 배송 신청한 경우
        if (Boolean.FALSE.equals(post.getIsDeliveryAvailable()) && isDelivery) {
            throw new BadRequestException("배송신청이 불가능한 게시글입니다.", body);
        }

        if(!member.getUser().equals(post.getHost()) && req.getIsDelivery().equals(Boolean.TRUE) && member.getUser().getAddresses().isEmpty()) {
            throw new BadRequestException("배송지를 등록한 후 주문해주세요.", null);
        }

        Buyer buyer = Buyer.builder()
                .user(member.getUser())
                .post(post)
                .price(post.getPrice()*requestQuantity)
                .isDelivery(isDelivery)
                .quantity(requestQuantity)
                .createdAt(LocalDateTime.now())
                .isPaid(0)
                .isCanceled(false)
                .status(0)
                .build();

        post.setLastPaymentEndAt(buyer.getCreatedAt().plusDays(7));

        // 배송일 경우 배송지 복사
        if (isDelivery) {
            if (req.getUserAddressId() == null) {
                throw new BadRequestException("배송지가 없습니다.", body);
            }
            Optional<UserAddress> userAddress = userAddressRepository.findByUserAndId(member.getUser(), req.getUserAddressId());

            if (userAddress.isEmpty()) {
                throw new BadRequestException("배송지를 찾을 수 없습니다.", body);
            }

            UserAddress newUserAddress = new UserAddress();
            BeanUtils.copyProperties(userAddress.get(), newUserAddress);
            newUserAddress.setId(null);
            newUserAddress = userAddressRepository.save(newUserAddress);
            buyer.setUserAddress(newUserAddress);
        }

        // 주최자가 자기 글에 신청하는 경우 → 결제완료/승인 처리
        if (post.getHost().equals(member.getUser())) {
            buyer.setIsPaid(1);
            buyer.setStatus(1);
            post.setCurrentPaidQuantity(requestQuantity);
        } else {
            buyer.setPayerName(req.getPayerName());
            buyer.setPayerEmail(req.getPayerEmail());
        }

        post.getBuyers().add(buyer);
        post.setCurrentQuantity(post.getCurrentQuantity() + buyer.getQuantity());
        if (!post.getStatus().equals(0) && targetQuantity - post.getCurrentQuantity() <= 5) {
            post.setStatus(2);
        }
        if (
                (post.getStatus().equals(1) || post.getStatus().equals(2))
                        && targetQuantity == post.getCurrentQuantity()
        ) {
            post.setStatus(3);
        }

        buyer = buyerRepository.save(buyer);

        BuyerApplyResponseDto responseDto = BuyerApplyResponseDto.of(buyer);

        return new ResponseEntity(responseDto, HttpStatus.OK);
    }

    // 구매 취소
    // canceledReason == 1 : 공구 취소에 의한 강제 취소
    // canceledReason != 1 : 개인 변심 등
    @Transactional
    public ResponseEntity cancel(User user, Long postId, int canceledReason) {
        Optional<Post> optionalP = postRepository.findById(postId);

        if (optionalP.isEmpty()) {
            throw new BadRequestException("공동구매 게시글을 찾을 수 없습니다.", null);
        }

        Post post = optionalP.get();

        // 취소된 공구에서 일반 취소는 불가 (공구 취소 사유만 허용)
        if (Boolean.TRUE.equals(post.getIsCanceled()) && canceledReason != 1) {
            throw new BadRequestException("이미 취소된 공동구매 게시글입니다.", null);
        }

        if (post.getStatus().equals(4)) { // 주최자취소는 admin에서 처리
            throw new BadRequestException("반려된 공동구매 게시글입니다.", null);
        }

        Optional<Buyer> optionalB = buyerRepository.findByUserAndPostAndIsCanceled(user, post, false);

        if (optionalB.isEmpty()) {
            optionalB = buyerRepository.findByUserAndPostAndIsCanceledOrderByIdDesc(user, post, true);
            if (optionalB.isEmpty()) {
                throw new BadRequestException("주문 정보를 찾을 수 없습니다.", null);
            }
            throw new BadRequestException("이미 취소된 주문입니다.", null);
        }

        Buyer buyer = optionalB.get();

        // 주최자는 공구 취소(사유 1)를 제외한 취소 불가
        if (user.equals(post.getHost()) && canceledReason != 1) {
            throw new BadRequestException("주최자는 취소할 수 없습니다.", null);
        }

        if (!post.getBuyers().contains(buyer)) {
            throw new BadRequestException("구매자만 취소할 수 있습니다.", null);
        }

        if (Boolean.TRUE.equals(buyer.getIsCanceled())) {
            throw new BadRequestException("이미 취소된 주문입니다.", null);
        }

        // 마감 이후에는 (공구 취소 사유 1 외) 취소 불가
//        if (post.getStatus().equals(3) && canceledReason != 1) {
        if (post.getStatus().equals(3) && post.getCurrentPaidQuantity().equals(post.getQuantity()) && canceledReason != 1) {
            throw new BadRequestException("취소할 수 있는 기간이 아닙니다.", null);
        }

        if(buyer.getIsCanceled().equals(Boolean.FALSE)) {
            buyer.setIsCanceled(true);
            buyer.setCanceledAt(LocalDateTime.now());
            buyer.setCanceledReason(canceledReason);
            buyer.setIsPaid(3); // 주문 취소
            buyer.setStatus(6);
        }

        post.setCurrentQuantity(post.getCurrentQuantity() - buyer.getQuantity());

        if (buyer.getIsPaid().equals(1)) {
            post.setCurrentPaidQuantity(post.getCurrentPaidQuantity() - buyer.getQuantity());
        }

        if (!post.getIsCanceled() && post.getQuantity() - post.getCurrentQuantity() <= 5) {
            post.setStatus(2);
        } else {
            post.setStatus(1);
        }



        Optional<Buyer> optionalLastBuyer = buyerRepository.findFirstByPostAndIsCanceledAndIsPaidOrderByIdDesc(post, false, 0);
        if (optionalLastBuyer.isEmpty()) {
            optionalLastBuyer = buyerRepository.findFirstByPostAndIsCanceledAndIsPaidOrderByIdDesc(post, false, 1);
        }
        Buyer lastBuyer = optionalLastBuyer.get();
        post.setLastPaymentEndAt(lastBuyer.getCreatedAt().plusDays(7));

        buyerRepository.save(buyer);
        postRepository.save(post);

        CanceledBuyerResponseDto data = CanceledBuyerResponseDto.of(buyer, post.getHost().getNickname());

        return new ResponseEntity(data, HttpStatus.OK);
    }

    // 주최자가 본인거 수량변경
    @Transactional
    public ResponseEntity update(Member member, long postId, int requestQuantity) {
        Optional<Post> optionalP = postRepository.findById(postId);

        if (optionalP.isEmpty()) {
            throw new BadRequestException("공동구매 게시글을 찾을 수 없습니다.", null);
        }

        if (member.getUser().getIsBanned().equals(Boolean.TRUE)) {
            throw new BadRequestException("이용이 정지된 사용자입니다.", null);
        }

        Post post = optionalP.get();

        Optional<Buyer> optionalB = buyerRepository.findByUserAndPostAndIsCanceled(member.getUser(), post, false);

        if (optionalB.isEmpty()) {
            throw new BadRequestException("구매 정보를 찾을 수 없습니다.", null);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("requestQuantity", requestQuantity);

        Buyer buyer = optionalB.get();

        if (Boolean.TRUE.equals(post.getIsCanceled())) {
            throw new BadRequestException("취소된 공동구매 게시글입니다.", null);
        }

        if (!member.getUser().equals(post.getHost())) {
            throw new BadRequestException("주최자만 수량을 변경할 수 있습니다.", body);
        }

        // 마감 이후 수량 변경 불가
//        if (post.getStatus().equals(3)) {
        if (post.getStatus().equals(3) && post.getCurrentPaidQuantity().equals(post.getQuantity())) {
            throw new BadRequestException("수량을 변경할 수 있는 기간이 아닙니다.", null);
        }

        // 반려된 공구
        if (post.getStatus().equals(4)) {
            throw new BadRequestException("반려된 공동구매 게시글입니다.", null);
        }

        if (requestQuantity <= 0) {
            throw new BadRequestException("수량은 1개 이상이어야 합니다.", body);
        }

        int oldQuantity = buyer.getQuantity();
        int newTotal = post.getCurrentQuantity() - oldQuantity + requestQuantity;

        // 목표 수량 초과 방지
        if (newTotal > post.getQuantity()) {
            throw new BadRequestException("목표 수량을 초과할 수 없습니다.", body);
        }

        buyer.setQuantity(requestQuantity);
        buyer.setPrice(post.getPrice()*requestQuantity);
        post.setCurrentQuantity(newTotal);
        post.setCurrentPaidQuantity(post.getCurrentPaidQuantity() - oldQuantity + requestQuantity);

        Integer quantity = post.getQuantity();
        Integer currentQuantity = post.getCurrentQuantity();

        if (quantity.equals(currentQuantity)) {
            post.setStatus(3);
        } else if (quantity - currentQuantity <= 5) {
            post.setStatus(2);
        } else {
            post.setStatus(1);
        }

        buyerRepository.save(buyer);
        postRepository.save(post);

        return new ResponseEntity(buyer, HttpStatus.OK);
    }

    // 주최자가 본인 공동구매 구매자들 리스트 조회
    public ResponseEntity buyerList(Member member, long postId) {
        Optional<Post> optional = postRepository.findById(postId);

        if (optional.isEmpty()) {
            throw new BadRequestException("공동구매 게시글을 찾을 수 없습니다.", null);
        }

        if (member.getUser().getIsBanned().equals(Boolean.TRUE)) {
            throw new BadRequestException("이용이 정지된 사용자입니다.", null);
        }

        Post post = optional.get();

        if (Boolean.TRUE.equals(post.getIsCanceled())) {
            throw new BadRequestException("취소된 공동구매 게시글입니다.", null);
        }

        if (!member.getUser().equals(post.getHost())) {
            throw new BadRequestException("구매자를 조회할 수 있는 권한이 없습니다.", null);
        }

        // 대기중/반려 상태에서는 조회 불가
        if (post.getStatus().equals(0)) {
            throw new BadRequestException("대기중인 공동구매 게시글입니다.", null);
        }

        if (post.getStatus().equals(4)) {
            throw new BadRequestException("반려된 공동구매 게시글입니다.", null);
        }

        List<BuyerListResponseDto> buyers = post.getBuyers()
                .stream()
                .filter(buyer -> !buyer.getUser().equals(post.getHost()) && buyer.getIsCanceled().equals(false)) // 주최자는 제외
                .map(buyer -> BuyerListResponseDto.of(buyer))
                .toList();

        return new ResponseEntity(buyers, HttpStatus.OK);
    }

    // 운송장 등록
    @Transactional
    public ResponseEntity trackingNumberUpdate(Member member, long postId, TrackingNumberRequestDto trackingNumberRequestDto) {
        Optional<Post> optionalP = postRepository.findById(postId);

        if (optionalP.isEmpty()) {
            throw new BadRequestException("공동구매 게시글을 찾을 수 없습니다.", null);
        }

        if (member.getUser().getIsBanned().equals(Boolean.TRUE)) {
            throw new BadRequestException("이용이 정지된 사용자입니다.", null);
        }

        Post post = optionalP.get();

        if (!member.getUser().equals(post.getHost())) {
            throw new BadRequestException("배송정보를 등록할 수 있는 권한이 없습니다.", null);
        }

        if (Boolean.TRUE.equals(post.getIsCanceled())) {
            throw new BadRequestException("취소된 공동구매 게시글입니다.", null);
        }

        Optional<User> optionalU = userRepository.findByNickname(trackingNumberRequestDto.getUserNickname());

        if (optionalU.isEmpty()) {
            throw new BadRequestException("등록되어 있지 않은 사용자입니다.", null);
        }

        User user = optionalU.get();

        Optional<Buyer> optionalB = buyerRepository.findByUserAndPostAndIsCanceled(user, post, false);

        if (optionalB.isEmpty()) {
            optionalB = buyerRepository.findByUserAndPostAndIsCanceledOrderByIdDesc(user, post, true);

            if(optionalB.isEmpty()) {
                throw new BadRequestException("해당 사용자의 구매 정보가 없습니다.", null);
            } else {
                throw new BadRequestException("취소된 사용자입니다.", null);
            }
        }

        // 배송 불가 공구는 배송정보 등록 불가
        if (Boolean.FALSE.equals(post.getIsDeliveryAvailable())) {
            throw new BadRequestException("배송이 불가능한 공동구매 게시글은 배송정보를 등록할 수 없습니다.", null);
        }

        if (post.getStatus().equals(0)) {
            throw new BadRequestException("대기중인 공동구매 게시글입니다.", null);
        }

        if (post.getStatus().equals(4)) {
            throw new BadRequestException("반려된 공동구매 게시글입니다.", null);
        }

        // 마감 이후부터만 등록 가능
//        if (!post.getStatus().equals(3)) {
        if (!(post.getStatus().equals(3) && post.getCurrentPaidQuantity().equals(post.getQuantity()))) {
            throw new BadRequestException("배송정보를 등록할 수 있는 기간이 아닙니다.", null);
        }

        Buyer buyer = optionalB.get();

        // 주최자, 취소된 구매자, 배송 신청 안 한 구매자는 등록 불가
        if (user.equals(post.getHost())
                || Boolean.TRUE.equals(buyer.getIsCanceled())
                || Boolean.FALSE.equals(buyer.getIsDelivery())) {
            throw new BadRequestException("배송정보를 등록할 수 있는 사용자가 아닙니다.", null);
        }

        // TODO: 주문 status가 상품 준비중일 때만 등록 가능??
        if (!buyer.getStatus().equals(2)) {
            throw new BadRequestException("배송정보를 등록할 수 있는 기간이 아닙니다.", null);
        }

        buyer.setCourier(trackingNumberRequestDto.getCourier());
        buyer.setTrackingNumber(trackingNumberRequestDto.getTrackingNumber());
        buyer.setStatus(3);

        buyerRepository.save(buyer);

        return new ResponseEntity(buyer, HttpStatus.OK);
    }

    // 수령일 등록
    @Transactional
    public ResponseEntity receivedAtUpdate(Member member, long postId, ReceivedAtRequestDto receivedAtRequestDto) {
        Optional<Post> optionalP = postRepository.findById(postId);

        if (optionalP.isEmpty()) {
            throw new BadRequestException("공동구매 게시글을 찾을 수 없습니다.", null);
        }

        if (member.getUser().getIsBanned().equals(Boolean.TRUE)) {
            throw new BadRequestException("이용이 정지된 사용자입니다.", null);
        }

        Post post = optionalP.get();

        if (!member.getUser().equals(post.getHost())) {
            throw new BadRequestException("수령일자를 등록할 수 있는 권한이 없습니다.", null);
        }

        if (Boolean.TRUE.equals(post.getIsCanceled())) {
            throw new BadRequestException("취소된 공동구매 게시글입니다.", null);
        }

        Optional<User> optionalU = userRepository.findByNickname(receivedAtRequestDto.getUserNickname());

        if (optionalU.isEmpty()) {
            throw new BadRequestException("등록되어 있지 않은 사용자입니다.", null);
        }

        User user = optionalU.get();

        Optional<Buyer> optionalB = buyerRepository.findByUserAndPostAndIsCanceled(user, post, false);

        if (optionalB.isEmpty()) {
            optionalB = buyerRepository.findByUserAndPostAndIsCanceledOrderByIdDesc(user, post, true);
            
            if(optionalB.isEmpty()) {
                throw new BadRequestException("해당 사용자의 구매 정보가 없습니다.", null);
            } else {
                throw new BadRequestException("취소된 사용자입니다.", null);
            }
        }

        if (post.getStatus().equals(0)) {
            throw new BadRequestException("대기중인 공동구매 게시글입니다.", null);
        }

        if (post.getStatus().equals(4)) {
            throw new BadRequestException("반려된 공동구매 게시글입니다.", null);
        }

        // 마감 이후부터만 등록 가능
//        if (!post.getStatus().equals(3)) {
        if (!(post.getStatus().equals(3) && post.getCurrentPaidQuantity().equals(post.getQuantity()))) {
            throw new BadRequestException("수령일자를 등록할 수 있는 기간이 아닙니다.", null);
        }

        Buyer buyer = optionalB.get();

        // 주최자, 취소된 구매자, 배송 신청한 구매자는 등록 불가
        if (user.equals(post.getHost())
                || Boolean.TRUE.equals(buyer.getIsCanceled())
                || Boolean.TRUE.equals(buyer.getIsDelivery())) {
            throw new BadRequestException("수령일자를 등록할 수 있는 사용자가 아닙니다.", null);
        }

        System.out.println(receivedAtRequestDto.getReceivedAt());

        buyer.setReceivedAt(receivedAtRequestDto.getReceivedAt());
        buyer.setStatus(4);

        buyerRepository.save(buyer);

        return new ResponseEntity(buyer, HttpStatus.OK);
    }


    // 0: 주문 접수, 1: 결제완료, 2: 상품 준비중, 3: 배송중, 4: 배송완료, 5: 구매확정 6: 주문 취소
    // 마이페이지에서 주문 내역 조회
    @Transactional
    public ResponseEntity orderList(Member member, Integer status, Pageable pageable) {
        try {
            User user = member.getUser();

            Page<Buyer> buyerPage;

            switch (status) {
                case 0: case 1: case 2: case 3: case 6:
                    buyerPage = buyerRepository.findAllByUserAndStatusAndPostHostNot(user, status, pageable);
                    break;
                case 4:
                    List<Integer> statuses = new ArrayList<>();
                    statuses.add(4);
                    statuses.add(5);
                    buyerPage = buyerRepository.findAllByUserAndStatusInAndPostHostNot(user, statuses, pageable);
                    break;
                default:
                    throw new BadRequestException("조회 불가한 status입니다.", null);
            }

            List<?> orders = null;
            Boolean hasMore = null;
            Page<?> orderListDto = null;

            if (status == 6) {
                orderListDto = buyerPage.map(
                        buyerEntity -> CanceledOrderListResponseDto.of(buyerEntity)
                );
            } else {
                orderListDto = buyerPage.map(
                        buyerEntity -> OrderListResponseDto.of(buyerEntity)
                );
            }

            List<Object[]> rawCounts = buyerRepository.countOrderStatusByUserAndPostHostNot(user);

            Map<Integer, Long> statusCounts = new HashMap<>();
            for (int i = 0; i <= 5; i++) {
                statusCounts.put(i, 0L);
            }

            for (Object[] row : rawCounts) {
                Integer dbStatus = (Integer) row[0];
                Long count = (Long) row[1];
                statusCounts.put(dbStatus, count);
            }

            orders = orderListDto.getContent();
            hasMore = orderListDto.hasNext();

            HashMap<String, Object> data = new HashMap<>();
            data.put("statusCounts", statusCounts);
            data.put("orders", orders);
            data.put("hasMore", hasMore);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("주문내역을 불러올 수 없습니다.");
        }
    }

    // 마이페이지에서 주문 상세 조회
    public ResponseEntity order(Member member, Long buyerId) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("주문 내역을 찾을 수 없습니다."));

        User buyerUser = buyer.getUser();
        if (!buyerUser.equals(member.getUser())) {
            throw new BadRequestException("본인의 주문만 조회할 수 있습니다.", null);
        }

        if (buyerUser.equals(buyer.getPost().getHost())) {
            throw new BadRequestException("주최 공동 구매 기록은 마이페이지에서 조회할 수 없습니다.", null);
        }

        try {
            OrderResponseDto order = OrderResponseDto.of(buyer);

            HashMap<String, Object> data = new HashMap<>();
            data.put("order", order);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("주문 상세를 불러올 수 없습니다.");
        }
    }

    // 구매확정
    @Transactional
    public ResponseEntity confirmPurchase(Member member, Long buyerId) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("주문 내역을 찾을 수 없습니다."));

        User buyerUser = buyer.getUser();
        if (!buyerUser.equals(member.getUser())) {
            throw new BadRequestException("본인의 주문만 구매 확정할 수 있습니다.", null);
        }

        if (buyerUser.equals(buyer.getPost().getHost())) {
            throw new BadRequestException("주최 공동 구매 기록은 구매 확정할 수 없습니다.", null);
        }

        if (buyer.getStatus() != 4) {
            throw new BadRequestException("수령 완료된 주문만 구매 확정할 수 있습니다.", null);
        }

        try {
            buyer.setStatus(5);

            HashMap<String, Object> data = new HashMap<>();
            data.put("buyerId", buyerId);
            data.put("status", buyer.getStatus());
            data.put("message", "구매 확정 되었습니다.");
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("구매 확정에 실패하였습니다.");
        }
    }

    @Transactional
//    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul") // 매일 0시 실행
    public void autoConfirmPurchases() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Buyer> buyersToConfirm = buyerRepository.findAllForAutoConfirm(sevenDaysAgo);

        for (Buyer buyer : buyersToConfirm) {
            buyer.setStatus(5);
        }
    }
}
