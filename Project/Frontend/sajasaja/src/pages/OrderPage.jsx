import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { api, setInterceptor } from '../assets/setIntercepter'; 

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px 100px;
  color: #333;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: #eee;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
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
  z-index: 10;
`;

const WarningText = styled.p`
  color: #FF7E00;
  font-size: 12px;
  text-align: right;
  margin-top: 8px;
  font-weight: 500;
`;

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

const PhoneGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  input { 
    width: 80px; 
    text-align: center; 
  }
`;

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

const ProductTable = styled.div`
  width: 100%;
  border-top: 1px solid #333;
  border-bottom: 1px solid #ddd;
`;

const TableHeaderComponent = styled.div`
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

const ColInfo = styled.div` 
  flex: 5; 
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

const MiniStepper = styled.div`
  display: flex;
  border: 1px solid #ddd;
  
  button {
    width: 28px; height: 28px;
    border: none; background: #fff; cursor: pointer;
    &:hover { background: #f9f9f9; }
    &:disabled { color: #ccc; cursor: not-allowed; }
  }
  input {
    width: 34px; height: 28px;
    border: none; border-left: 1px solid #ddd; border-right: 1px solid #ddd;
    text-align: center; font-size: 13px; color: #333;
  }
`;

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
  background-color: #000; 
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

  const [loadingMap, errorMap] = useKakaoLoader({
    appkey: "1182ee2a992f45fb1db2238604970e19", 
    libraries: ["services"],
  });

  const receiveMethod = state?.method || 'delivery';
  const isDelivery = receiveMethod === 'delivery';
  
  // 전달받은 상품 데이터
  const productData = state?.product || {
    title: '상품 정보 없음',
    price: 0,
    shippingCost: 0,
    image: 'https://via.placeholder.com/80',
    latitude: 36.628583,
    longitude: 127.457583,
    goalCount: 999, // 기본값
    currentCount: 0
  };
  
  // ✅ 남은 수량 계산 (재고 제한)
  const maxAvailable = (productData.goalCount || 0) - (productData.currentCount || 0);
  
  const [quantity, setQuantity] = useState(state?.quantity || 1);

  // 사용자 정보 & 배송지 State
  const [receiver, setReceiver] = useState('');
  const [phone, setPhone] = useState({ p1: '', p2: '', p3: '' });
  const [address, setAddress] = useState({
    zipCode: '',
    street: '',
    detail: ''
  });
  const [userAddresses, setUserAddresses] = useState([]); 
  const [selectedAddressId, setSelectedAddressId] = useState('new'); 

  const [entranceMethod, setEntranceMethod] = useState('password'); 
  const [entranceDetail, setEntranceDetail] = useState('');

  const safePrice = Number(String(productData.price).replace(/[^\d]/g, ''));
  const safeShippingCost = Number(String(productData.shippingCost).replace(/[^\d]/g, ''));
  const safeQuantity = Number(quantity);
  const totalProductPrice = safePrice * safeQuantity;
  const finalPrice = totalProductPrice + safeShippingCost;

  // ✅ 데이터 로드 & 기본 배송지 설정
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      setInterceptor(token);

      try {
        // 2. 주소 목록
        const addrResponse = await api.get("/api/mypage/addresses");
        const addresses = addrResponse.data.addresses || []; 
        setUserAddresses(addresses);
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // 주소 객체를 state에 적용하는 함수
  const applyAddressToState = (addr) => {
      setSelectedAddressId(addr.id);
      setReceiver(addr.recipient || "");
      
      if (addr.phone) {
          const parts = addr.phone.split('-');
          setPhone({
              p1: parts[0] || '010',
              p2: parts[1] || '',
              p3: parts[2] || ''
          });
      }

      setAddress({
          zipCode: addr.zipCode,
          street: addr.street,
          detail: addr.detail
      });
      
      if(addr.entranceAccess) {
           const method = addr.entranceAccess.toLowerCase();
           setEntranceMethod(method === 'call' ? 'security' : method === 'other' ? 'etc' : method);
           setEntranceDetail(addr.entranceDetail || '');
      }
  };

  const handleAddressSelect = (e) => {
      const val = e.target.value;
      setSelectedAddressId(val);

      if (val === 'new') {
          // 신규 입력: 초기화
          setReceiver('');
          setPhone({ p1: '010', p2: '', p3: '' });
          setAddress({ zipCode: '', street: '', detail: '' });
          setEntranceMethod('password');
          setEntranceDetail('');
      } else {
          const selected = userAddresses.find(addr => addr.id === Number(val));
          if (selected) {
              applyAddressToState(selected);
          }
      }
  };

  // ✅ 수량 변경 핸들러 (최대 수량 제한 적용)
  const handleQtyChange = (val) => {
    if (val < 1) return;
    if (val > maxAvailable) {
        alert(`구매 가능한 최대 수량은 ${maxAvailable}개 입니다.`);
        return;
    }
    setQuantity(val);
  };

  const handleOrder = () => {
    if (isDelivery && (!receiver || !phone.p2 || !phone.p3 || !address.street)) {
        alert("배송 정보를 모두 입력해주세요.");
        return;
    }

    navigate('/payment', { 
      state: { 
        product: productData,
        quantity: quantity,
        totalPrice: finalPrice,
        deliveryInfo: isDelivery ? {
            receiver,
            phone: `${phone.p1}-${phone.p2}-${phone.p3}`,
            address: address,
            entrance: { method: entranceMethod, detail: entranceDetail }
        } : null,
        receiveMethod: receiveMethod 
      } 
    });
  };

  return (
    <Container>
      {isDelivery ? (
        <>
          <Section>
            <SectionTitle>배송정보</SectionTitle>
            <Label>배송지 선택 {selectedAddressId !== 'new' && <Badge>등록된 배송지</Badge>}</Label>
            <FormRow>
                <InputArea>
                  <StyledSelect onChange={handleAddressSelect} value={selectedAddressId}>
                    {userAddresses.map(addr => (
                        <option key={addr.id} value={addr.id}>
                            {addr.name || addr.recipient} {addr.isDefault ? '(기본)' : ''}
                        </option>
                    ))}
                    <option value="new">신규 입력</option>
                  </StyledSelect>
                </InputArea>
            </FormRow>

            <Label>받는 분 <RequiredDot>•</RequiredDot></Label>
            <FormRow>
              <InputArea>
                <StyledInput 
                    type="text" 
                    value={receiver} 
                    onChange={(e) => setReceiver(e.target.value)} 
                    placeholder="이름을 입력하세요"
                />
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
                <StyledInput type="text" value={address.zipCode} readOnly placeholder="우편번호" style={{ width: '100px' }} />
                {address.street ? (
                    <AddressDisplayBox>
                    <div><span className="tag">도로명</span> <span className="text">{address.street}</span></div>
                    </AddressDisplayBox>
                ) : (
                    <div style={{padding: '10px', color: '#999', fontSize: '12px'}}>주소를 선택하거나 입력해주세요.</div>
                )}
                <StyledInput 
                    type="text" 
                    placeholder="상세주소 입력" 
                    value={address.detail} 
                    onChange={(e) => setAddress({...address, detail: e.target.value})} 
                />
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
                <StyledInput 
                    type="text" 
                    placeholder={entranceMethod === 'password' ? "공동현관 비밀번호 입력" : "상세 내용 입력"} 
                    value={entranceDetail} 
                    onChange={(e) => setEntranceDetail(e.target.value)} 
                    disabled={entranceMethod === 'free'}
                />
              </InputArea>
            </FormRow>
          </Section>
        </>
      ) : (
        <Section>
          <SectionTitle>수령 장소</SectionTitle>
          <MapContainer>
            {loadingMap ? (
               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>지도 로딩 중...</div>
            ) : errorMap ? (
               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'red' }}>지도 에러</div>
            ) : (
               <Map
                 center={{ 
                   lat: parseFloat(productData.latitude || 36.628583), 
                   lng: parseFloat(productData.longitude || 127.457583) 
                 }}
                 style={{ width: "100%", height: "100%" }}
                 level={3}
               >
                 <MapMarker 
                   position={{ 
                     lat: parseFloat(productData.latitude || 36.628583), 
                     lng: parseFloat(productData.longitude || 127.457583) 
                   }} 
                 >
                     <div style={{padding:"5px", color:"#000", fontSize:"12px"}}>수령 장소</div>
                 </MapMarker>
               </Map>
            )}
          </MapContainer>
          <WarningText>수령장소를 확인해주세요!</WarningText>
        </Section>
      )}

      {/* 주문 상품 */}
      <Section>
        <SectionTitle>주문 상품</SectionTitle>
        <ProductTable>
          <TableHeaderComponent>
            <div style={{flex: 5}}>상품정보</div>
            <div style={{flex: 1}}>수량</div>
            <div style={{flex: 1}}>총가격</div>
          </TableHeaderComponent>
          <TableRow>
            <ColInfo>
              <ProductImg src={productData.image} alt="상품" onError={(e)=>e.target.src="/images/sajasaja.png"} />
              <div>
                <div style={{fontWeight: '700', fontSize: '15px', marginBottom: '6px', color: '#000'}}>{productData.title}</div>
                <div style={{fontSize: '13px', color: '#666'}}>{productData.price.toLocaleString()} 원</div>
                {/* 남은 수량 표시 (선택사항) */}
                <div style={{fontSize: '11px', color: '#FF7E00', marginTop: '4px'}}>
                    (구매 가능 수량: {maxAvailable}개)
                </div>
              </div>
            </ColInfo>
            <ColQty>
              <MiniStepper>
                <button 
                    onClick={() => handleQtyChange(quantity - 1)}
                    disabled={quantity <= 1}
                >-</button>
                <input type="text" value={quantity} readOnly />
                <button 
                    onClick={() => handleQtyChange(quantity + 1)}
                    disabled={quantity >= maxAvailable}
                >+</button>
              </MiniStepper>
            </ColQty>
            <ColPrice>
              {totalProductPrice.toLocaleString()} 원
            </ColPrice>
          </TableRow>
        </ProductTable>
      </Section>

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