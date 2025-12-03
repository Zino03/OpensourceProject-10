import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes } from "react-icons/fa"; 
import { useNavigate } from 'react-router-dom';

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
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  width: 400px;
  border-radius: 16px;
  padding: 30px 30px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  &:hover { opacity: 0.9; }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const SectionHeader = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  font-size: 12px;
`;

const Label = styled.div`
  width: 100px;
  color: #333;
  font-weight: 500;
`;

const Value = styled.div`
  flex: 1;
  color: #333;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 18px 0;
  width: 100%;
`;

// 컨트롤 영역 (수량, 라디오버튼)
const ControlRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  font-size: 12px;
`;

// 수량
const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Stepper = styled.div`
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const StepButton = styled.button`
  background-color: #fff;
  border: none;
  width: 32px;
  height: 32px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { background-color: #f5f5f5; }
  &:active { background-color: #eee; }
`;

const StepInput = styled.input`
  width: 56px;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  font-size: 12px;
  font-weight: 500; 
  text-align: center;

  &::-webkit-inner-spin-button, 
  &::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
  &:focus { outline: none; }
`;

const StockLimitText = styled.span`
  font-size: 11px;
  color: #888;
`;

// 라디오 버튼 그룹
const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.disabled ? '#ccc' : '#333'};
  font-size: 12px;

  input {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid ${props => props.disabled ? '#eee' : '#ddd'};
    border-radius: 50%;
    margin: 0;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    position: relative;
    background-color: ${props => props.disabled ? '#f9f9f9' : 'transparent'};

    &:checked {
      border-color: #666;
    }

    &:checked::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      background-color: #666;
      border-radius: 50%;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #FF7E36;
  color: #fff;
  border: none;
  padding: 16px 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    opacity: 0.9;
  }
`;

// ✅ postId 추가 (GroupPurchaseDetail에서 넘겨준 값)
const PurchaseModal = ({ isOpen, onClose, product, postId }) => {
  const navigate = useNavigate(); 
  const [quantity, setQuantity] = useState(1);
  const [receiveMethod, setReceiveMethod] = useState('pickup');

  const isDeliveryAvailable = product?.shipping?.includes('가능') && !product?.shipping?.includes('불');
  const maxQuantity = product.goalCount - product.currentCount;

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setReceiveMethod('pickup');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 버튼 핸들러
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) setQuantity(prev => prev + 1);
    else alert(`최대 ${maxQuantity}개까지만 구매 가능합니다.`);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    
    if (val === '') {
      setQuantity('');
      return;
    }

    const numVal = Number(val);
    
    if (isNaN(numVal) || numVal < 1) return;

    if (numVal > maxQuantity) {
      alert(`최대 ${maxQuantity}개까지만 구매 가능합니다.`);
      setQuantity(maxQuantity);
    } else {
      setQuantity(numVal);
    }
  };

  const handleBlur = () => {
    if (quantity === '' || quantity < 1) {
      setQuantity(1);
    }
  };

  const handleSubmit = () => {
    // ✅ OrderPage로 넘어갈 때 postId를 state에 담아서 보냅니다.
    navigate('/order', { 
      state: { 
        product: product, 
        quantity: quantity, 
        method: receiveMethod,
        postId: postId 
      } 
    });
    
    onClose();
  }

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title>주문</Title>
        <Divider /> 
        <SectionHeader>상품 정보</SectionHeader>
        
        <InfoRow>
          <Label>상품명</Label>
          <Value>{product.title}</Value>
        </InfoRow>
        <InfoRow>
          <Label>상품금액</Label>
          <Value>{product.price.toLocaleString()} 원</Value>
        </InfoRow>
        <InfoRow>
          <Label>배송비</Label>
          <Value>0 원</Value>
        </InfoRow>

        <Divider />

        <ControlRow>
          <Label>구매수량</Label>
          <StepperContainer>
            <Stepper>
              <StepButton onClick={handleDecrease}>-</StepButton>
              <StepInput
                type="number" 
                value={quantity} 
                onChange={handleInputChange}
                onBlur={handleBlur}/>
              <StepButton onClick={handleIncrease}>+</StepButton>
            </Stepper>
            <StockLimitText>(구매 가능 수량: {maxQuantity}개)</StockLimitText>
          </StepperContainer>
        </ControlRow>

        <ControlRow>
          <Label>수령방식</Label>
          <RadioGroup>
            <RadioLabel disabled={!isDeliveryAvailable}>
              <input 
                type="radio" 
                name="receive" 
                value="delivery" 
                checked={receiveMethod === 'delivery'}
                onChange={(e) => setReceiveMethod(e.target.value)}
                disabled={!isDeliveryAvailable}
              />
              배송 {isDeliveryAvailable ? '' : '(불가)'}
            </RadioLabel>
            <RadioLabel>
              <input 
                type="radio" 
                name="receive" 
                value="pickup" 
                checked={receiveMethod === 'pickup'}
                onChange={(e) => setReceiveMethod(e.target.value)}
              />
              직접수령
            </RadioLabel>
          </RadioGroup>
        </ControlRow>

        <SubmitButton onClick={handleSubmit}>공동구매 시작하기</SubmitButton>
      </ModalContainer>
    </Overlay>
  );
};

export default PurchaseModal;