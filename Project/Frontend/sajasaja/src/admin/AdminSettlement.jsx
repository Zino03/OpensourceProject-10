import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AiOutlineExclamationCircle } from "react-icons/ai";

// 전체 컨테이너
const Container = styled.div`
  width: 100%;
  margin-top: -10px;
`;

// 섹션 구분 
const Section = styled.div`
  margin-bottom: 20px;
  position: relative
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
`;

const DateInfo = styled.div`
  text-align: right;
  font-size: 11px;
  position: absolute;
  top: 0; 
  right: 0;
  transform: translateY(2px);
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 12px;
  position: relative
`;

const Label = styled.div`
  width: 140px;
  font-weight: 500;
  color: #333;
`;

const Value = styled.div`
  flex: 1;
  color: #222;
`;

// 구분선
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 20px 0 0 0;
`;

const ParticipantButton = styled.button`
  padding: 10px 18px;
  background-color: #FF7E36;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  position: absolute;
  right: 0;
  
  &:hover {
    opacity: 0.9;
  }
`;

// 하단 액션바 (경고문구 + 버튼들)
const FooterAction = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WarningBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WarningText = styled.div`
  color: #FF7E36;
  font-size: 12px;
  font-weight: 600;
`;

const ActionButton = styled.button`
  padding: 10px 18px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;

  background-color: ${props => props.gray ? '#bbb' : '#FF7E36'};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

const AdminSettlement = () => {
  const navigate = useNavigate();

  const data = {
    id: 1023,
    title: '포도맛 젤리 10개',
    organizer: '사자사자',
    paymentDeadline: '2025-11-13 23:59 까지',
    purchaseDeadline: '2025-11-30 23:59 까지',
    totalAmount: 28000,
    headCount: 4,
    perPersonAmount: 7000,
    bank: '국민은행',
    accountNumber: '9483-9923-324803',
    accountHolder: '변진호'
  };

  return (
    <Container>
      <Section>
        <SectionTitle>공구 정보</SectionTitle>
        <DateInfo>
          <div>결제 마감 일시 : {data.paymentDeadline}</div>
          <div>공구 마감 일시 : {data.purchaseDeadline}</div>
        </DateInfo>
        <InfoRow>
          <Label>공구 ID :</Label>
          <Value>{data.id}</Value>
        </InfoRow>
        <InfoRow>
          <Label>공구 제목 :</Label>
          <Value>{data.title}</Value>
        </InfoRow>
        <InfoRow>
          <Label>주최자 :</Label>
          <Value>{data.organizer}</Value>
          <ParticipantButton>참여자 명단</ParticipantButton>
        </InfoRow>
        <Divider />
      </Section>

      {/* 2. 정산 금액 섹션 */}
      <Section>
        <SectionTitle>정산 금액</SectionTitle>
        
        <InfoRow>
          <Label>총 결제 금액 :</Label>
          <Value>{data.totalAmount.toLocaleString()}원</Value>
        </InfoRow>
        <InfoRow>
          <Label>정산 인원 :</Label>
          <Value>{data.headCount}명</Value>
        </InfoRow>
        <InfoRow>
          <Label>인당 결제 금액 :</Label>
          <Value>{data.perPersonAmount.toLocaleString()}원</Value>
        </InfoRow>

        <Divider />
      </Section>

      {/* 3. 계좌 정보 섹션 */}
      <Section>
        <SectionTitle>계좌 정보 (주최자)</SectionTitle>
        
        <InfoRow>
          <Label>은행명 :</Label>
          <Value>{data.bank}</Value>
        </InfoRow>
        <InfoRow>
          <Label>계좌번호 :</Label>
          <Value>{data.accountNumber}</Value>
        </InfoRow>
        <InfoRow>
          <Label>예금주 :</Label>
          <Value>{data.accountHolder}</Value>
        </InfoRow>

        <Divider />
      </Section>

      {/* 4. 하단 액션 영역 */}
      <FooterAction>
        <WarningBox>
          <AiOutlineExclamationCircle size={32} color="red" />
          <WarningText>
            처리를 완료하면 되돌릴 수 없습니다.<br />
            금액과 계좌 정보를 다시 한번 확인해 주세요.
          </WarningText>
        </WarningBox>

        <div style={{ display: 'flex', gap: '10px' }}>
          <ActionButton gray onClick={() => navigate(-1)}>닫기</ActionButton>
          <ActionButton>환불처리</ActionButton>
          <ActionButton>정산처리</ActionButton>
        </div>
      </FooterAction>
    </Container>
  );
};

export default AdminSettlement;