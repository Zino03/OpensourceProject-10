import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingBag } from "react-icons/fa";

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 30px 20px 100px;
  display: flex;
  flex-direction: column;
`;

// 상단 완료 메시지 영역
const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  text-align: center;
`;

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 30px;
`;

const IconWrapper = styled.div`
  font-size: 60px;
  margin-bottom: 20px;
  
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ThankYouMessage = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const OrderDate = styled.span`
  font-size: 12px;
  color: #888;
`;

// 정보 섹션
const Section = styled.div`
  margin-bottom: 10px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-top: 10px;
  border-top: 1px solid #eee;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
`;

const Label = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Value = styled.span`
  font-size: 12px;
  color: #555;
  text-align: right;
`;

// 하단 버튼
const ConfirmButton = styled.button`
  width: 160px;
  height: 40px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin: 20px auto 0;
  align-self: center;

  &:hover { opacity: 0.9; }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 0;
  width: 100%;
`;

const OrderCompletePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const orderData = state || {
    date: '2025-11-13',
    bank: '**은행',
    account: '1234567812345678',
    price: 3890,
    deadline: '2025-11-20 23:59:59',
    productName: '애니 피완크 미니 프레첼 스낵 150g',
    quantity: 1,
    method: '무통장입금',
    depositor: '최지우',
    email: 'a@A.com'
  };

  const handleHome = () => {
    navigate('/'); // 메인으로 이동
  };

  return (
    <Container>
      <Header>
        <PageTitle>주문 완료</PageTitle>
        <IconWrapper>
          <FaShoppingBag />
        </IconWrapper>
        <ThankYouMessage>공동 구매에 참여해주셔서 감사합니다</ThankYouMessage>
        <OrderDate>주문 일자 {orderData.date}</OrderDate>
      </Header>

      {/* 입금 정보 */}
      <Section>
        <SectionTitle>입금 정보</SectionTitle>
        <InfoRow>
          <Label>계좌번호</Label>
          <Value>{orderData.bank} {orderData.account}</Value>
        </InfoRow>
        <InfoRow>
          <Label>결제금액</Label>
          <Value style={{ fontWeight: '700', color: '#000' }}>
            {orderData.price.toLocaleString()} 원
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>입금유효기간</Label>
          <Value>{orderData.deadline}</Value>
        </InfoRow>
      </Section>

      {/* 주문 정보 */}
      <Section>
        <SectionTitle>주문 정보</SectionTitle>
        <InfoRow>
          <Label>상품명</Label>
          <Value>{orderData.productName}</Value>
        </InfoRow>
        <InfoRow>
          <Label>구매수량</Label>
          <Value>{orderData.quantity}개</Value>
        </InfoRow>
        <br /> {/* 시각적 분리를 위한 공백 */}
        <InfoRow>
          <Label>결제방식</Label>
          <Value>{orderData.method}</Value>
        </InfoRow>
        <InfoRow>
          <Label>입금자명</Label>
          <Value>{orderData.depositor}</Value>
        </InfoRow>
        <InfoRow>
          <Label>이메일</Label>
          <Value>{orderData.email}</Value>
        </InfoRow>
      </Section>

      <Divider/>

      <ConfirmButton onClick={handleHome}>확인</ConfirmButton>

    </Container>
  );
};

export default OrderCompletePage;