import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCamera } from "react-icons/fa";
import AddressFindModal from './modal/AddressFindModal';

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

// 이미지 업로드 박스
const ImageUploadBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 auto 40px;
  cursor: pointer;
  color: #999;
  gap: 10px;
  font-size: 12px;

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
  align-items: flex-start;
`;

const Label = styled.div`
  width: 150px;
  font-weight: 500;
  font-size: 12px;
  padding-top: 12px;
  flex-shrink: 0;
`;

const InputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// 인풋 스타일
const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  background-color: ${props => props.active ? '#FF7E00' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#666'};
  font-weight: ${props => props.active ? '500' : '400'};

  &:hover {
    background-color: ${props => props.active ? '#FF7E00' : '#f5f5f5'};
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
  align-items: flex-start;
  position: relative;
`;

const SubLabel = styled.span`
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  margin-right: 20px;
  margin-top: 8px;
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
  border-radius: 4px;
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
    accent-color: #FF7E00; /* 체크박스 색상 */
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
  background-color: #FF7E00;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const GroupPurchaseRegister = () => {
  // 상태 관리
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isDelivery, setIsDelivery] = useState(true);

  // 주소 관리
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState(''); 
  const [isAddressOpen, setIsAddressOpen] = useState(false); 

  const handleAddressComplete = (selectedAddress) => {
    setAddress(selectedAddress);
  };

  // 카테고리 목록
  const categories = [
    '식품', '생활용품', '가전/전자기기', '뷰티/케어', '패션', '잡화/액세서리',
    '리빙/인테리어', '반려동물', '문구/취미', '스포츠', '교육', '유아/아동'
  ];

  // 1개당 가격 계산
  const unitPrice = (quantity && price) ? Math.floor(Number(price) / Number(quantity)) : 0;

  return (
    <Container>
      <PageTitle>공구 등록</PageTitle>

      <ImageUploadBox>
        <FaCamera size={24} color="#ccc" />
        <span>이미지 등록</span>
        <input type="file" accept="image/*" />
      </ImageUploadBox>

      <FormSection>
        <Label>제목</Label>
        <InputArea>
          <StyledInput type="text" placeholder="제목을 입력해주세요." />
        </InputArea>
      </FormSection>

      <FormSection>
        <Label>카테고리</Label>
        <InputArea>
          <CategoryGrid>
            {categories.map((cat) => (
              <CategoryButton 
                key={cat} 
                active={selectedCategory === cat}
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

      <FormSection>
        <Label>내용</Label>
        <InputArea>
          <StyledTextArea placeholder="내용을 입력해주세요." />
        </InputArea>
      </FormSection>

      <FormSection>
        <Label>수령장소</Label>
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
              />
            </div>
          </ComplexRow>
        </InputArea>
      </FormSection>

      <FormSection>
        <Label>연락수단</Label>
        <InputArea>
          <StyledInput type="text" placeholder="전화번호" style={{ marginBottom: '8px' }} />
          <StyledInput type="text" placeholder="오픈채팅" />
        </InputArea>
      </FormSection>

      <SubmitButton>등록하기</SubmitButton>

      <AddressFindModal 
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        onComplete={handleAddressComplete}
      />

    </Container>
  );
};

export default GroupPurchaseRegister;