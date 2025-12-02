// 파일명 예시: src/pages/GroupPurchaseRegister.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCamera } from "react-icons/fa";
import AddressFindModal from './modal/AddressFindModal';
import RegisterModal from './modal/RegisterModal';
import { useNavigate } from "react-router-dom";
import { api } from '../assets/setIntercepter';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px 100px; 
`;

const PageTitle = styled.h2`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 30px;
`;

const ImageSectionWrapper = styled.div`
  width: 200px;
  margin: 0 auto 40px; 
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

// 이미지 업로드 박스
const ImageUploadBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 10px;
  cursor: pointer;
  color: #999;
  gap: 10px;
  font-size: 12px;
  background-color: #fff;
  overflow: hidden;

  &:hover {
    background-color: #f9f9f9;
    border-color: #ccc;
  }

  input {
    display: none;
  }
`;

// 폼 섹션
const FormSection = styled.div`
  display: flex;
  margin-bottom: 30px;
  align-items: ${props => props.$alignTop ? 'flex-start' : 'center'};
`;

const Label = styled.div`
  width: 150px;
  font-weight: 500;
  font-size: 12px;
  flex-shrink: 0;
  padding-top: ${props => props.$alignTop ? '10px' : '0'};
`;

const InputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// 인풋 스타일
const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  &::placeholder { color: #aaa; }
  &:focus { outline: none; }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

// 카테고리
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  width: 100%;
`;

const CategoryButton = styled.button`
  padding: 8px;
  border-radius: 10px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  background-color: ${props => props.$active ? '#FF7E00' : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#666'};
  font-weight: ${props => props.$active ? '500' : '400'};

  &:hover {
    background-color: ${props => props.$active ? '#FF7E00' : '#f5f5f5'};
  }
`;

// 수량, 가격 등 (좌우로 나뉘는 부분)
const SplitRow = styled.div`
  display: flex;
  gap: 60px; 
  align-items: flex-start;
`;

const SplitItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
`;

const SubLabel = styled.span`
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  margin-right: 20px;
`;

// 가격 밑에 계산된 힌트 텍스트
const PriceHint = styled.div`
  font-size: 10px;
  color: #666;
  text-align: right;
  margin-top: 6px;
`;

// 내용 입력 텍스트박스
const StyledTextArea = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 12px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  
  &::placeholder { color: #aaa; }
  &:focus { outline: none; }
`;

// 주소 및 택배
const ComplexRow = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 8px;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;

  input {
    width: 16px;
    height: 16px;
  }
`;

// 하단 등록 버튼
const SubmitButton = styled.button`
  display: block;
  width: 120px;
  padding: 12px 0;
  margin: 40px auto 0;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const GroupPurchaseRegister = () => {
  const navigate = useNavigate(); // ✅ 컴포넌트 안에서 호출

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantity, setQuantity] = useState('');      // 총 수량
  const [myQuantity, setMyQuantity] = useState('');  // 내 수량
  const [price, setPrice] = useState('');
  
  const [isDelivery, setIsDelivery] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0); 

  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState(''); 
  const [isAddressOpen, setIsAddressOpen] = useState(false); 
  
  const [contact, setContact] = useState('');
  const [deadLine, setDeadLine] = useState('');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // 카테고리 매핑 (한글 -> 영어)
  const categoryMap = {
    '식품': 'FOOD', '생활용품': 'HOUSEHOLD', '가전/전자기기': 'ELECTRONICS',
    '뷰티/케어': 'BEAUTY', '패션': 'FASHION', '잡화/액세서리': 'ACCESSORY',
    '리빙/인테리어': 'LIVING', '반려동물': 'PET', '문구/취미': 'HOBBY',
    '스포츠': 'SPORTS', '유아/아동': 'KIDS', '기타': 'ETC'
  };
  const categories = Object.keys(categoryMap);
  const unitPrice = (quantity && price) ? Math.floor(Number(price) / Number(quantity)) : 0;

  // 이미지 처리 + 미리보기
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleAddressComplete = (selectedAddress, lat, lon) => {
    setAddress(selectedAddress);
    setLatitude(lat);
    setLongitude(lon);
    setIsAddressOpen(false);
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    if (value.length <= 11) {
      setContact(value);
    }
  };

  // 🔹 모달에서 "등록하기" 눌렀을 때 실행될 함수
  const handleRegisterClick = () => {
    if (!title || !selectedCategory || !quantity || !myQuantity || !price || !content || !imgFile) {
      alert("모든 필수 항목(이미지 포함)을 입력해주세요.");
      setIsConfirmModalOpen(false);
      return;
    }
    handleFinalSubmit();
  };
    
  const handleFinalSubmit = async () => {
    try {
      // 1. 날짜 객체 생성 (기본값: 현재 시간)
      let dateObj = new Date();
      
      // 마감일 입력값이 있을 경우 (예: 20240520)
      if (deadLine && deadLine.length === 8) {
        const y = deadLine.substring(0, 4);
        const m = deadLine.substring(4, 6);
        const d = deadLine.substring(6, 8);
        // 해당 날짜의 23시 59분 59초로 설정
        dateObj = new Date(`${y}-${m}-${d}T23:59:59`);
      }

      // 2. ⭐️ [핵심 수정] 로컬 시간대 기준 ISO 문자열 생성 (Z 제거)
      // 한국 시간(KST) 등 사용자 로컬 시간대를 유지하기 위해 오프셋을 적용합니다.
      const offset = dateObj.getTimezoneOffset() * 60000;
      const localDate = new Date(dateObj.getTime() - offset);
      const formattedDate = localDate.toISOString().slice(0, 19); //

      const requestData = {
        post: {
          contact: contact,
          price: Number(price),
          quantity: Number(quantity),
          isDeliveryAvailable: isDelivery,
          endAt: formattedDate,
          deliveryFee: isDelivery ? Number(deliveryFee) : 0,
          pickupAddress: {
            street: `${address},${detailAddress}`,
            latitude: latitude, 
            longitude: longitude
          },
          title: title,
          content: content,
          category: categoryMap[selectedCategory] || 'ETC'
        },
        quantity: Number(myQuantity)
      };

      const formData = new FormData();
      formData.append('image', imgFile);
      
      const jsonBlob = new Blob([JSON.stringify(requestData)], {
        type: 'application/json'
      });
      formData.append('post', jsonBlob);

      const token = localStorage.getItem('accessToken');
      
      const response = await api.post('/api/posts', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': undefined,
        },
      });

      if (response.status === 200 || response.status === 201) {
        // console.log(response.data)

        alert("공구 등록이 완료되었습니다!");
        setIsConfirmModalOpen(false);

        // ✅ 여기서 MY공구 페이지로 이동
        navigate('/');
      }

    } catch (error) {
      console.error("등록 에러:", error.response.data);
      alert(error.response.data.message);
      // alert("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <Container>
      <PageTitle>공구 등록</PageTitle>

      <ImageSectionWrapper>
        <ImageUploadBox>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="미리보기"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <>
              <FaCamera size={24} color="#ccc" />
              <span>이미지 등록</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </ImageUploadBox>
      </ImageSectionWrapper>

      <FormSection>
        <Label>제목</Label>
        <InputArea>
          <StyledInput
            type="text"
            placeholder="제목을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputArea>
      </FormSection>

      <FormSection>
        <Label>카테고리</Label>
        <InputArea>
          <CategoryGrid>
            {categories.map((cat) => (
              <CategoryButton 
                key={cat} 
                $active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </CategoryButton>
            ))}
          </CategoryGrid>
        </InputArea>
      </FormSection>

      {/* 수량/가격 영역 */}
      <FormSection $alignTop>
        <Label $alignTop>수량</Label>
        <InputArea>
          {/* 윗줄: 총수량 + 가격 */}
          <SplitRow>
            {/* 총수량 */}
            <SplitItem>
              <SubLabel style={{ marginRight: '10px' }}>총수량</SubLabel>
              <StyledInput
                type="number"
                placeholder="총 수량을 입력해주세요."
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </SplitItem>

            {/* 가격 */}
            <SplitItem style={{ width: '300px', flex: '0 0 300px' }}>
              <SubLabel style={{ width: '60px', marginRight: 0 }}>가격</SubLabel>
              <div style={{ flex: 1 }}>
                <StyledInput
                  type="number"
                  placeholder="총 금액을 입력해주세요."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                {unitPrice > 0 && (
                  <PriceHint>1개당 가격: {unitPrice.toLocaleString()}원</PriceHint>
                )}
              </div>
            </SplitItem>
          </SplitRow>

          {/* 내 수량 */}
          <div style={{ marginTop: '14px', width: '290px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <SubLabel style={{ marginRight: '10px' }}>내수량</SubLabel>
              <StyledInput
                type="number"
                placeholder="내가 구매할 수량을 입력해주세요."
                value={myQuantity}
                onChange={(e) => setMyQuantity(e.target.value)}
              />
            </div>
          </div>
        </InputArea>
      </FormSection>

      <FormSection $alignTop>
        <Label $alignTop>내용</Label>
        <InputArea>
          <StyledTextArea
            placeholder="내용을 입력해주세요." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </InputArea>
      </FormSection>

      <FormSection $alignTop>
        <Label $alignTop>수령장소</Label>
        <InputArea>
          <ComplexRow>
            <StyledInput 
              type="text" 
              placeholder="주소 찾기" 
              readOnly 
              style={{ flex: 1, cursor: 'pointer' }}
              value={address}
              onClick={() => setIsAddressOpen(true)} 
            />
            
            <div style={{ width: '300px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <SubLabel style={{ width: '60px', marginRight: 0 }}>택배거래</SubLabel>
              <CheckboxLabel>
                <input  
                  type="checkbox" 
                  checked={isDelivery} 
                  onChange={(e) => setIsDelivery(e.target.checked)} 
                />
                택배 가능
              </CheckboxLabel>
            </div>
          </ComplexRow>

          <ComplexRow>
            <StyledInput 
              type="text" 
              placeholder="상세 주소"
              style={{ flex: 1 }}
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
            />
            
            <div style={{ width: '300px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <SubLabel style={{ width: '60px', marginRight: 0 }}>배송비</SubLabel>
              <StyledInput 
                type="text"   
                placeholder="배송비 입력" 
                disabled={!isDelivery}
                style={{ flex: 1 }}
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
              />
            </div>
          </ComplexRow>
        </InputArea>
      </FormSection>

      <FormSection>
        <Label>연락수단</Label>
        <InputArea>
          <ComplexRow>
            <StyledInput
              type="text"
              placeholder="전화번호" 
              style={{ width: '290px' }} 
              value={contact}
              onChange={handleContactChange}
              maxLength={11}
            />
          </ComplexRow>
        </InputArea>
          
        <div style={{width: '300px', display: 'flex', alignItems: 'center', gap: '10px'}}>
          <SubLabel style={{ width: '60px', marginRight: 0 }}>마감 일자</SubLabel>
          <InputArea>
            <ComplexRow>
              <StyledInput 
                type="text" 
                placeholder="ex) 2005-01-13"
                style={{ flex: 1 }}
                value={deadLine}
                onChange={(e) => setDeadLine(e.target.value)}
              />
            </ComplexRow>
          </InputArea>
        </div>
      </FormSection>

      {/* 페이지 하단 검정색 등록 버튼 → 모달 오픈 */}
      <SubmitButton onClick={() => setIsConfirmModalOpen(true)}>
        등록하기
      </SubmitButton>

      {/* 주소 찾기 모달 */}
      <AddressFindModal 
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        onComplete={handleAddressComplete}
      />

      {/* 안내 + 최종 등록 모달 */}
      <RegisterModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)} 
        onConfirm={handleRegisterClick} 
      />
    </Container>
  );
};

export default GroupPurchaseRegister;
