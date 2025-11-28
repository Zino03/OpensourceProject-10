import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px 100px;
  color: #333;
`;

// 섹션 스타일
const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
`;

// 지도
const MapWrapper = styled.div`
  width: 100%;
  height: 200px;
  background-color: #eee;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-image: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/preview_map.png'); /* 예시 지도 */
  background-size: cover;
  background-position: center;
  border: 1px solid #ddd;
`;

const MapOverlayButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #FF7E00;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
`;

const WarningText = styled.p`
  color: #FF7E00;
  font-size: 12px;
  text-align: right;
  margin-top: 8px;
  font-weight: 500;
`;

// 폼 레이아웃
const FormRow = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const RequiredDot = styled.span`
  color: #FF3B30;
  margin-left: 4px;
`;

const InputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 인풋 공통 스타일
const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  box-sizing: border-box;
  outline: none;
  
  &::placeholder { color: #aaa; }
  
  &:read-only {
    background-color: #F4F4F4;
    cursor: default;
    border: 1px solid #eee;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  outline: none;
  cursor: pointer;
  color: #333;
  appearance: none;
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E") no-repeat right 14px center;
`;

// 기본 배송지
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #FF7E00;
  color: white;
  font-size: 10px;
  padding: 0 8px;
  border-radius: 6px;
  margin-left: 8px;
  font-weight: 500;
  height: 22px;
`;

// 연락처 인풋 그룹
const PhoneGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  input { 
    width: 80px; 
    text-align: center; 
  }
`;

// 주소 표시 박스 
const AddressDisplayBox = styled.div`
  background-color: #F4F4F4;
  border: none;
  border-radius: 6px;
  padding: 16px 20px;
  font-size: 12px;
  
  div {
    display: flex;
    gap: 12px;
  }
  
  .tag {
    color: #888;
    width: 40px;
    font-weight: 500;
    flex-shrink: 0;
  }
`;

// 라디오 버튼 그룹
const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;

  input {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #bbb;
    border-radius: 50%;
    position: relative;
    margin: 0;

    &:checked {
      border-color: #666;
    }

    &:checked::after {
      content: '';
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 10px; height: 10px;
      background-color: #666;
      border-radius: 50%;
    }
  }
`;

// 주문 상품 테이블
const ProductTable = styled.div`
  width: 100%;
  border-top: 1px solid #333;
  border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.div`
  display: flex;
  background-color: #fff;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 0;
  font-size: 14px;
`;

// 테이블 컬럼 비율 조정
const ColInfo = styled.div` 
  flex: 5; /* 정보 영역을 넓게 */
  padding-left: 20px; 
  display: flex; 
  align-items: center; 
  gap: 20px; 
`;
const ColQty = styled.div` flex: 1; text-align: center; display: flex; justify-content: center; `;
const ColPrice = styled.div` flex: 1; text-align: center; font-weight: 500;`;

const ProductImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid #eee;
  border-radius: 6px;
`;

// 수량 조절기
const MiniStepper = styled.div`
  display: flex;
  border: 1px solid #ddd;
  
  button {
    width: 28px; height: 28px;
    border: none; background: #fff; cursor: pointer;
    &:hover { background: #f9f9f9; }
  }
  input {
    width: 34px; height: 28px;
    border: none; border-left: 1px solid #ddd; border-right: 1px solid #ddd;
    text-align: center; font-size: 13px; color: #333;
  }
`;

// 결제 정보 박스
const PaymentInfoBox = styled.div`
  border-top: 1px solid #333;
  border-bottom: 1px solid #ddd;
  padding: 24px 0;
`;

const PaymentRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;

  &:last-child { margin-bottom: 0; } 

  &.total {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #eee;
    font-size: 16px;
    font-weight: 600;
    align-items: center;
  }

  .price {
    font-weight: 500;
  }
  
  .total-price {
    font-size: 20px;
    color: #FF7E00;
    font-weight: 700;
  }
`;

const OrderButton = styled.button`
  width: 150px;
  background-color: #000; /* 완전 검정 */
  color: #fff;
  border: none;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  display: block;
  margin: 20px auto 0;
  
  &:hover { opacity: 0.9; }
`;


const OrderPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); 

  // 수령 방식 확인
  const receiveMethod = state?.method || 'delivery';
  const isDelivery = receiveMethod === 'delivery';
  
  const productData = state?.product || {
    title: '애니 피완크 미니 프레첼 스낵 150g',
    price: 890,
    shippingCost: 3000,
    image: 'https://via.placeholder.com/80'
  };
  
  // 수량 (이전 페이지에서 받거나 기본값 1)
  const [quantity, setQuantity] = useState(state?.quantity || 1);

  // 입력 상태
  const [receiver, setReceiver] = useState('최지우');
  const [phone, setPhone] = useState({ p1: '010', p2: '1**4', p3: '1**4' });
  const [entranceMethod, setEntranceMethod] = useState('password'); 
  const [entranceDetail, setEntranceDetail] = useState('1****6');

  // 금액 계산
  const safePrice = Number(String(productData.price).replace(/[^\d]/g, ''));
  const safeShippingCost = Number(String(productData.shippingCost).replace(/[^\d]/g, ''));
  const safeQuantity = Number(quantity);
  const totalProductPrice = safePrice * safeQuantity;
  const finalPrice = totalProductPrice + safeShippingCost;

  const handleQtyChange = (val) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleOrder = () => {
    navigate('/payment', { 
      state: { 
        product: productData,
        quantity: quantity,
        totalPrice: finalPrice,
        receiver: receiver,
      } 
    });
  };

  return (
    <Container>
      {isDelivery ? (
        <>
          <Section>
            <SectionTitle>배송정보</SectionTitle>
            <Label>배송지 선택 <Badge>기본 배송지</Badge></Label>
            <FormRow>
                <InputArea>
                  <StyledSelect>
                    <option>집</option>
                    <option>회사</option>
                    <option>신규 입력</option>
                  </StyledSelect>
                </InputArea>
            </FormRow>
            {/* 기존 배송 입력 폼들 */}
            <Label>받는 분 <RequiredDot>•</RequiredDot></Label>
            <FormRow>
              <InputArea>
                <StyledInput type="text" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
              </InputArea>
            </FormRow>

            <Label>연락처 <RequiredDot>•</RequiredDot></Label>
            <FormRow>
              <InputArea>
                <PhoneGroup>
                  <StyledInput value={phone.p1} onChange={(e) => setPhone({...phone, p1: e.target.value})} />
                  <span>-</span>
                  <StyledInput value={phone.p2} onChange={(e) => setPhone({...phone, p2: e.target.value})} />
                  <span>-</span>
                  <StyledInput value={phone.p3} onChange={(e) => setPhone({...phone, p3: e.target.value})} />
                </PhoneGroup>
              </InputArea>
            </FormRow>

            <Label>주소 <RequiredDot>•</RequiredDot></Label>
            <FormRow>
              <InputArea>
                <StyledInput type="text" value="(12345)" readOnly style={{ width: '100px' }} />
                <AddressDisplayBox>
                  <div><span className="tag">도로명</span> <span className="text">충북 청주시 가나구 다라로 123...</span></div>
                  <div style={{marginTop: '4px'}}><span className="tag">지 번</span> <span className="text">충북 청주시 가나구 삼성동 123...</span></div>
                </AddressDisplayBox>
                <StyledInput type="text" placeholder="상세주소 입력" value="101동 101호" />
              </InputArea>
            </FormRow>
          </Section>

          <Section>
            <SectionTitle>배송 요청사항</SectionTitle>
            <Label>공동현관 출입방법 <RequiredDot>•</RequiredDot></Label>
            <FormRow>
              <InputArea>
                <RadioGroup>
                  <RadioLabel>
                    <input type="radio" name="entrance" checked={entranceMethod === 'password'} onChange={() => setEntranceMethod('password')} />
                    비밀번호
                  </RadioLabel>
                  <RadioLabel>
                    <input type="radio" name="entrance" checked={entranceMethod === 'security'} onChange={() => setEntranceMethod('security')} />
                    경비실호출
                  </RadioLabel>
                  <RadioLabel>
                    <input type="radio" name="entrance" checked={entranceMethod === 'free'} onChange={() => setEntranceMethod('free')} />
                    자유출입가능
                  </RadioLabel>
                  <RadioLabel>
                    <input type="radio" name="entrance" checked={entranceMethod === 'etc'} onChange={() => setEntranceMethod('etc')} />
                    기타사항
                  </RadioLabel>
                </RadioGroup>
                <StyledInput type="text" placeholder="공동현관 비밀번호 입력" value={entranceDetail} onChange={(e) => setEntranceDetail(e.target.value)} />
              </InputArea>
            </FormRow>
          </Section>
        </>
      ) : (
        <Section>
          <SectionTitle>수령 장소</SectionTitle>
          <MapWrapper>
            <MapOverlayButton>지도보기</MapOverlayButton>
          </MapWrapper>
          <WarningText>수령장소를 확인해주세요!</WarningText>
        </Section>
      )}

      {/* 주문 상품 */}
      <Section>
        <SectionTitle>주문 상품</SectionTitle>
        <ProductTable>
          <TableHeader>
            <div style={{flex: 5}}>상품정보</div>
            <div style={{flex: 1}}>수량</div>
            <div style={{flex: 1}}>총가격</div>
          </TableHeader>
          <TableRow>
            <ColInfo>
              <ProductImg src={productData.image} alt="상품" />
              <div>
                <div style={{fontWeight: '700', fontSize: '15px', marginBottom: '6px', color: '#000'}}>{productData.title}</div>
                <div style={{fontSize: '13px', color: '#666'}}>{productData.price.toLocaleString()} 원</div>
              </div>
            </ColInfo>
            <ColQty>
              <MiniStepper>
                <button onClick={() => handleQtyChange(quantity - 1)}>-</button>
                <input type="text" value={quantity} readOnly />
                <button onClick={() => handleQtyChange(quantity + 1)}>+</button>
              </MiniStepper>
            </ColQty>
            <ColPrice>
              {totalProductPrice.toLocaleString()} 원
            </ColPrice>
          </TableRow>
        </ProductTable>
      </Section>

      {/* 결제 정보 */}
      <Section>
        <SectionTitle>결제 정보</SectionTitle>
        <PaymentInfoBox>
          <PaymentRow>
            <span>상품금액</span>
            <span className="price">{totalProductPrice.toLocaleString()} 원</span>
          </PaymentRow>
          <PaymentRow>
            <span>배송비</span>
            <span className="price">{productData.shippingCost.toLocaleString()} 원</span>
          </PaymentRow>
          
          <PaymentRow className="total">
            <span>최종 결제 금액</span>
            <span className="total-price">{finalPrice.toLocaleString()} 원</span>
          </PaymentRow>
        </PaymentInfoBox>
      </Section>

      <OrderButton onClick={handleOrder}>주문하기</OrderButton>

    </Container>
  );
};

export default OrderPage;