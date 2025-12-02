import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 30px;
`;

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const RequiredDot = styled.span`
  color: #FF3B30;
  margin-left: 4px;
`;

// 인풋 래퍼 (아이콘 배치를 위해 relative)
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  .icon {
    position: absolute;
    right: 14px;
    color: #999;
    font-size: 12px;
    pointer-events: none;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
  cursor: pointer;
  appearance: none;
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E") no-repeat right 14px center;
  background-color: #fff;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 40px 0 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: #aaa; }
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
  margin-top: 50px;

  &:hover { opacity: 0.9; }
`;

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // 이전 페이지 데이터(상품, 가격 등)

  // 입력 상태 관리
  const [paymentMethod, setPaymentMethod] = useState('virtual_account');
  const [depositor, setDepositor] = useState('최지우'); // 기본값 혹은 빈 값
  const [email, setEmail] = useState('a@a.com');

  const handleConfirm = () => {
    if (!depositor || !email) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    // 데이터
    const completeData = {
      date: new Date().toISOString().split('T')[0], // 오늘 날짜
      bank: '카카오뱅크',
      account: '3333-00-0000000',
      price: state?.totalPrice || 3890,
      deadline: '2025-11-20 23:59:59',
      productName: state?.product?.title || '상품명 미정',
      quantity: state?.quantity || 1,
      method: paymentMethod === 'virtual_account' ? '가상계좌' : '기타',
      depositor: depositor,
      email: email
    };

    navigate('/order-complete', { state: completeData }); 
  };

  return (
    <Container>
      <Title>결제 정보 입력</Title>

      <FormContainer>
        {/* 결제 방식 */}
        <FormGroup>
          <Label>결제방식 <RequiredDot>•</RequiredDot></Label>
          <StyledSelect 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="virtual_account">무통장입금</option>
          </StyledSelect>
        </FormGroup>

        {/* 입금자명 */}
        <FormGroup>
          <Label>입금자명 <RequiredDot>•</RequiredDot></Label>
          <InputWrapper>
            <StyledInput 
              type="text" 
              value={depositor} 
              onChange={(e) => setDepositor(e.target.value)} 
            />
            <FaPen className="icon" />
          </InputWrapper>
        </FormGroup>

        {/* 이메일 */}
        <FormGroup>
          <Label>이메일 <RequiredDot>•</RequiredDot></Label>
          <InputWrapper>
            <StyledInput 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <FaPen className="icon" />
          </InputWrapper>
        </FormGroup>
      </FormContainer>

      <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>

    </Container>
  );
};

export default PaymentPage;