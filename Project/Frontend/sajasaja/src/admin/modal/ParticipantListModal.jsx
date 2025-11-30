import React from 'react';
import styled from 'styled-components';
import { FaTimes } from "react-icons/fa";

// 모달 배경 
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 모달 컨테이너
const ModalContainer = styled.div`
  background-color: #fff;
  width: 650px;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

// 헤더 영역 (제목 + 닫기 버튼)
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #000;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    opacity: 0.8;
  }
`;

// 테이블 영역
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  font-size: 12px;
  text-align: center;

  th {
    padding: 12px;
    font-weight: 600;
    color: #444;
    border-bottom: 1px solid #999;
  }

  td {
    padding: 14px 12px;
    color: #333;
    border-bottom: 1px solid #eee;
  }
  
  tr:last-child td {
    border-bottom: 1px solid #999;
  }
`;

// 하단 요약 정보 박스
const SummaryBox = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
`;

// 요약 정보 컬럼
const SummaryColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 10px;
  font-size: 11px;

  &:not(:last-child) {
    border-right: 1px solid #eee;
  }
  
  &:first-child { padding-left: 0; }
  &:last-child { padding-right: 0; }
`;

// 요약 정보 행
const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-weight: 500;
`;

const Value = styled.span`
  color: #000;
  font-weight: 500;
`;


// 샘플 데이터
const mockParticipants = [
  { name: '변진호(주최자)', amount: '7000원', status: '결제 완료', date: '2025-11-06 14:00', confirm: '2025-11-30 23:59' },
  { name: '최지우', amount: '7000원', status: '결제 완료', date: '2025-11-06 14:00', confirm: '2025-11-30 23:59' },
  { name: '김서연', amount: '7000원', status: '결제 대기', date: '-', confirm: '2025-11-25 23:59' },
  { name: '조수빈', amount: '7000원', status: '결제 대기', date: '-', confirm: '2025-11-20 23:59' },
];

const ParticipantListModal = ({ onClose }) => {
  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        
        <ModalHeader>
          <Title>공구 참여 명단</Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <Table>
          <thead>
            <tr>
              <th>성명</th>
              <th>결제 금액</th>
              <th>결제 상태</th>
              <th>결제 일시</th>
              <th>구매 확정</th>
            </tr>
          </thead>
          <tbody>
            {mockParticipants.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.amount}</td>
                <td>{user.status}</td>
                <td>{user.date}</td>
                <td>{user.confirm}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <SummaryBox>
          <SummaryColumn>
            <SummaryRow>
              <Label>공구 참여자 수 </Label>
              <Value>4명</Value>
            </SummaryRow>
            <SummaryRow>
              <Label>결제 완료 </Label>
              <Value>2명</Value>
            </SummaryRow>
            <SummaryRow>
              <Label>결제 대기 </Label>
              <Value>2명</Value>
            </SummaryRow>
          </SummaryColumn>

          <SummaryColumn>
            <SummaryRow>
              <Label>총 결제 금액 </Label>
              <Value>28000원</Value>
            </SummaryRow>
            <SummaryRow>
              <Label>정산 완료 금액 </Label>
              <Value>14000원</Value>
            </SummaryRow>
            <SummaryRow>
              <Label>미정산 금액 </Label>
              <Value>14000원</Value>
            </SummaryRow>
          </SummaryColumn>

          <SummaryColumn>
            <SummaryRow>
              <Label>결제 마감 일시 </Label>
              <Value>2025-11-13 23:59 까지</Value>
            </SummaryRow>
            <SummaryRow>
              <Label>공구 마감 일시 </Label>
              <Value>2025-11-30 23:59 까지</Value>
            </SummaryRow>
          </SummaryColumn>
        </SummaryBox>

      </ModalContainer>
    </Overlay>
  );
};

export default ParticipantListModal;