package com.example.saja_saja.service.admin;

import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminBuyerService {

    // TODO: 결제 정산 list
    public ResponseEntity getBuyerList(Member member, Integer process) {
        try {
            if (member.getRole() != Role.ADMIN) {
                throw new AccessDeniedException("관리자 권한이 없습니다.");
            }
            return null;
        } catch (AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("구매자 정보를 불러올 수 없습니다.");
        }
    }

    // TODO: 결제 정산 update
}
