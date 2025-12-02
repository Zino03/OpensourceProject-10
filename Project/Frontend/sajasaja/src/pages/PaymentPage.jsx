import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import { api, setInterceptor } from '../assets/setIntercepter'; 

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
  
  &:disabled {
    background-color: #f9f9f9;
    color: #555;
    cursor: default;
  }
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
  const { state } = useLocation(); 
  
  // 이전 페이지(OrderPage)에서 넘어온 데이터 확인
  const targetPostId = state?.postId || state?.product?.id;

  const [paymentMethod] = useState('virtual_account');
  const [depositor, setDepositor] = useState(''); // ✅ 기본값 빈 문자열 (자동입력 제거됨)
  const [email, setEmail] = useState('');

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
        // 내 정보 불러오기
        const response = await api.get("/api/users/profile");
        const userData = response.data;
        
        // ✅ 입금자명 자동 세팅 제거 (setDepositor 주석 처리 또는 삭제)
        // setDepositor(userData.name || ""); 
        
        // 이메일만 자동 세팅
        setEmail(userData.email || "");
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
        // 에러 발생 시(백엔드 API 미구현 등)에도 빈 값으로 유지되어 수동 입력 가능
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleConfirm = async () => {
    if (!depositor || !email) {
      alert('입금자명과 이메일을 모두 입력해주세요.');
      return;
    }

    if (!targetPostId) {
        alert("잘못된 접근입니다. (상품 ID 없음)");
        navigate(-1);
        return;
    }

    try {
        const isDelivery = state?.receiveMethod === 'delivery';
        let addressId = state?.deliveryInfo?.id; 

        // 1. 신규 배송지 입력인 경우 (ID가 없거나 'new')
        if (isDelivery && (!addressId || addressId === 'new')) {
            const deliveryInfo = state.deliveryInfo;
            const accessMap = { 'password': 'PASSWORD', 'security': 'CALL', 'free': 'FREE', 'etc': 'OTHER' };
            
            const addrRes = await api.post('/api/mypage/address', {
                name: '배송지',
                recipient: deliveryInfo.receiver,
                phone: deliveryInfo.phone,
                zipCode: Number(deliveryInfo.address.zipCode),
                street: deliveryInfo.address.street,
                detail: deliveryInfo.address.detail,
                entranceAccess: accessMap[deliveryInfo.entrance.method] || 'OTHER',
                entranceDetail: deliveryInfo.entrance.method === 'free' ? '자유 출입' : deliveryInfo.entrance.detail,
                isDefault: false
            });
            
            if (addrRes.data && addrRes.data.address) {
                addressId = addrRes.data.address.id;
            }
        }

        // 2. 주문 요청 데이터
        const requestData = {
            payerName: depositor, // 사용자가 입력한 값 사용
            payerEmail: email,
            isDelivery: isDelivery,
            userAddressId: isDelivery ? Number(addressId) : null,
            requestQuantity: Number(state.quantity)
        };

        console.log("주문 전송 데이터:", requestData);

        // 3. 주문 API 호출
        const response = await api.post(`/api/posts/${targetPostId}/buyers`, requestData);

        // 4. 완료 페이지로 이동
        const now = new Date();
        now.setDate(now.getDate() + 7);
        const deadlineStr = now.toISOString().split('T')[0] + " 23:59:59";

        navigate('/order-complete', { 
            state: {
                ...response.data, 
                deadline: deadlineStr, 
                productName: state.product.title,
                quantity: state.quantity,
                depositor: depositor,
                email: email,
                price: state.totalPrice,
                date: new Date().toISOString().split('T')[0]
            } 
        });

    } catch (error) {
        console.error("주문 실패:", error);
        const errorData = error.response?.data;
        const errorMsg = errorData?.message || "주문 처리 중 오류가 발생했습니다.";
        
        if (errorMsg.includes("계좌를 등록한 후")) {
            alert("환불 계좌가 등록되어 있지 않습니다.\n[마이페이지 > 내 정보 수정]에서 계좌를 등록해주세요.");
            navigate("/myprofile");
        } else {
            alert(errorMsg);
        }
    }
  };

  return (
    <Container>
      <Title>결제 정보 입력</Title>

      <FormContainer>
        {/* 결제 방식 (고정) */}
        <FormGroup>
          <Label>결제방식 <RequiredDot>•</RequiredDot></Label>
          <StyledSelect value={paymentMethod} disabled>
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
              placeholder="입금자명을 입력해주세요"
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
              placeholder="이메일을 입력해주세요"
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