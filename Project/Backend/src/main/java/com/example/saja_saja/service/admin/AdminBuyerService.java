package com.example.saja_saja.service.admin;

import com.example.saja_saja.dto.buyer.AdminBuyerResponseDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.Role;
import com.example.saja_saja.entity.post.Buyer;
import com.example.saja_saja.entity.post.BuyerRepository;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminBuyerService {
    private final BuyerRepository buyerRepository;

    public ResponseEntity getBuyerList(Member member, Integer process, Pageable pageable) {
        if (member.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("관리자 권한이 없습니다.");
        }

        try {
            Page<Buyer> buyerPage;

            switch (process) {
                case -1:    // 전체 리스트
                    buyerPage = buyerRepository.findAll(pageable);
                    break;
                case 0:     // 대기 (입금대기, 재입금대기)
                    List<Integer> isPaids = new ArrayList<>();
                    isPaids.add(0);
                    isPaids.add(2);
                    buyerPage = buyerRepository.findAllByIsPaidIn(isPaids, pageable);
                    break;
                // 1: 완료, 3: (주문)취소
                case 1: case 3:
                    buyerPage = buyerRepository.findAllByIsPaid(process, pageable);
                    break;
                default:
                    throw new BadRequestException("조회 불가한 process 값입니다.", null);
            }

            Page<AdminBuyerResponseDto> buyerDtoPage = buyerPage.map(
                    buyerEntity -> AdminBuyerResponseDto.of(buyerEntity)
            );

            List<AdminBuyerResponseDto> buyers = buyerDtoPage.getContent();
            boolean hasMore = buyerDtoPage.hasNext();

            HashMap<String, Object> data = new HashMap<>();
            data.put("buyers", buyers);
            data.put("hasMore", hasMore);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("구매자 정보를 불러올 수 없습니다.");
        }
    }

    // TODO: 결제 정산 update
    @Transactional
    public ResponseEntity processBuyer(Member member, Long buyerId, Integer process) {
        if (member.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("관리자 권한이 없습니다.");
        }

        try {
            Buyer buyer = buyerRepository.findById(buyerId)
                    .orElseThrow(() -> new ResourceNotFoundException("주문 내역을 찾을 수 없습니다."));

            if (buyer.getIsPaid() != 0 || buyer.getIsPaid() != 2 || buyer.getIsCanceled()) {
                throw new BadRequestException("대기 중인 주문 내역만 처리 가능합니다.", null);
            }

            switch (process) {
                case 1:     // 입금 완료
                    buyer.setIsPaid(process);
                    buyer.setStatus(1);
                    buyer.getPost().setCurrentPaidQuantity(buyer.getPost().getCurrentPaidQuantity() + buyer.getQuantity());
                    break;
                case 2:     // 재입금 대기
                    buyer.setIsPaid(process);
                    break;
                default:
                    throw new BadRequestException("처리 불가한 process값입니다.", null);
            }

            AdminBuyerResponseDto buyerDto = AdminBuyerResponseDto.of(buyer);

            HashMap<String, Object> data = new HashMap<>();
            data.put("buyer", buyerDto);
            return  new ResponseEntity<>(data, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("결제 처리에 실패하였습니다.");
        }
    }
}
