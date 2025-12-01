import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCamera } from "react-icons/fa";
import AddressFindModal from './modal/AddressFindModal';
import RegisterModal from './modal/RegisterModal';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.31.28:8080', // 백엔드 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

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

  &:hover {
    background-color: #f9f9f9;
    border-color: #ccc;
  }

  input {
    display: none;
  }
`;

// 경고 문구 스타일
const WarningText = styled.span`
  margin-top: 8px;
  font-size: 10px;
  color: #D32F2F;
  font-weight: 500;
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
  align-items: center;
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
    accent-color: #FF7E00; 
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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgFile, setImageFile] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  
  const [isDelivery, setIsDelivery] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(''); // 배송비

  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState(''); 
  const [isAddressOpen, setIsAddressOpen] = useState(false); 
  
  const [contact, setContact] = useState(''); // 연락수단
  const [deadLine, setDeadLine] = useState(''); // 마감일자 (ex: 20251130)

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

  // 이미지 처리
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
    }
  };

  // 주소
  const handleAddressComplete = (selectedAddress) => {
    setAddress(selectedAddress);
    setIsAddressOpen(false);
  };

  // 전화번호 처리
  const handleContactChange = (e) => {
    // 숫자 이외의 문자는 모두 제거
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    
    // 11자리까지만 업데이트
    if (value.length <= 11) {
      setContact(value);
    }
  };

  // 유효성 검사
  const handleRegisterClick = () => {
    if (!title || !selectedCategory || !quantity || !price || !content || !imgFile) {
      alert("모든 필수 항목(이미지 포함)을 입력해주세요.");
      setIsConfirmModalOpen(false);
      return;
      }
      handleFinalSubmit();
    }
    
    const handleFinalSubmit = async () => {
    try {
      // 날짜 포맷 변환 (YYYYMMDD -> ISO Date)
      let formattedDate = new Date().toISOString(); // 기본값: 오늘
      if (deadLine && deadLine.length === 8) {
        const y = deadLine.substring(0, 4);
        const m = deadLine.substring(4, 6);
        const d = deadLine.substring(6, 8);
        const dateObj = new Date(`${y}-${m}-${d}T23:59:59`); // 해당일 마지막 시간으로 설정
        formattedDate = dateObj.toISOString();
      }

      // JSON 객체 생성
      const requestData = {
        post: {
          contact: contact,
          price: Number(price),
          quantity: Number(quantity),
          isDeliveryAvailable: isDelivery,
          endAt: formattedDate,
          deliveryFee: isDelivery ? Number(deliveryFee) : 0,
          pickupAddress: {
            id: 0, // 신규
            street: `${address} ${detailAddress}`,
            latitude: 0, 
            longitude: 0 
          },
          title: title,
          content: content,
          category: categoryMap[selectedCategory] || 'all'
        },
        quantity: Number(quantity)
      };

      // FormData 생성
      const formData = new FormData();
      formData.append('file', imgFile); // 이미지
      
      // JSON 데이터를 Blob으로 감싸서 추가 (백엔드 @RequestPart("request") 대응)
      const jsonBlob = new Blob([JSON.stringify(requestData)], {
        type: 'application/json'
      });
      formData.append('request', jsonBlob);

      // API 요청
      const token = localStorage.getItem('accessToken'); // 토큰 가져오기
      
      const response = await api.post('/api/group-buying', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("공구 등록이 완료되었습니다!");
        setIsConfirmModalOpen(false);
        window.location.href = '/'; // 메인으로 이동
      }

    } catch (error) {
      console.error("등록 에러:", error);
      alert("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsConfirmModalOpen(false);
    }
  };



  return (
    <Container>
      <PageTitle>공구 등록</PageTitle>

      <ImageSectionWrapper>
        <ImageUploadBox>
          <FaCamera size={24} color="#ccc" />
          <span>이미지 등록</span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </ImageUploadBox>
        <WarningText>공동구매 상품 사진을 1개 이상 첨부해주세요</WarningText>
      </ImageSectionWrapper>

      <FormSection>
        <Label>제목</Label>
        <InputArea>
          <StyledInput type="text" placeholder="제목을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)} />
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

      <FormSection>
        <Label>수량</Label>
        <InputArea>
          <SplitRow>
            <SplitItem>
              <StyledInput 
                type="number" 
                placeholder="총 수량을 입력해주세요." 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </SplitItem>

            <SplitItem>
              <SubLabel>가격</SubLabel>
              <div style={{ width: '100%' }}>
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
        </InputArea>
      </FormSection>

      <FormSection $alignTop>
        <Label $alignTop>내용</Label>
        <InputArea>
          <StyledTextArea placeholder="내용을 입력해주세요." 
            value={content}
            onChange={(e) => setContent(e.target.value)}/>
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
              <StyledInput type="text" placeholder="전화번호" 
                style={{ width: '290px' }} 
                value={contact}
                onChange={handleContactChange}
                maxLength={11}/>
            </ComplexRow>
          </InputArea>
          
          <div style={{width: '300px', display: 'flex', alignItems: 'center', gap: '10px'}}>
          <SubLabel style={{ width: '60px', marginRight: 0 }}>마감 일자</SubLabel>
          <InputArea>
            <ComplexRow>
            <StyledInput 
              type="text" 
              placeholder="ex)20210304"
              style={{ flex: 1 }}
              value={deadLine}
              onChange={(e) => setDeadLine(e.target.value)}
              />
            </ComplexRow>
          </InputArea>
          </div>
      </FormSection>

      <SubmitButton onClick={() => setIsConfirmModalOpen(true)}>등록하기</SubmitButton>

      <AddressFindModal 
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        onComplete={handleAddressComplete}
      />

      <RegisterModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)} 
        onConfirm={handleRegisterClick} 
      />
    </Container>
  );
};

export default GroupPurchaseRegister;