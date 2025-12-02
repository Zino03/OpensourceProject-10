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

  // state가 없을 경우를 대비한 기본값
  const orderData = state || {
    date: new Date().toISOString().split('T')[0],
    price: 0,
    deadline: '-',
    productName: '상품 정보 없음',
    quantity: 0,
    method: '무통장입금',
    depositor: '-',
    email: '-',
    virtualAccountBank: '은행 정보 없음',
    virtualAccount: '-'
  };

  const handleHome = () => {
    navigate('/'); 
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

      <Section>
        <SectionTitle>입금 정보</SectionTitle>
        <InfoRow>
          <Label>계좌번호</Label>
          <Value>
            {/* 백엔드 응답 필드명에 맞춰 수정 필요 (예: virtualAccountBank) */}
            {orderData.virtualAccountBank || "카카오뱅크"} {orderData.virtualAccount || "3333-00-0000000"}
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>결제금액</Label>
          <Value style={{ fontWeight: '700', color: '#000' }}>
            {Number(orderData.price).toLocaleString()} 원
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>입금유효기간</Label>
          <Value>{orderData.deadline}</Value>
        </InfoRow>
      </Section>

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
        <br />
        <InfoRow>
          <Label>결제방식</Label>
          <Value>무통장입금</Value>
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