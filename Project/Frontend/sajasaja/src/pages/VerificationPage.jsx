import React, { useState } from 'react';
import styled from 'styled-components';
import { RiKakaoTalkFill } from "react-icons/ri"; // 카카오톡 아이콘

// 본인 인증 전체 폼
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const VerificationWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 60px 48px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 12px;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }
`;

// 카카오 인증 버튼
const KakaoButton = styled.button`
  width: 100%;
  padding: 18px 0;
  background-color: #FEE500;
  color: #3C1E1E;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #FDD835; /* 호버 시 약간 진하게 */
  }
`;

const VerificationPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');

  return (
    <>
      <PageWrapper>
        <VerificationWrapper>
          <Title>본인인증</Title>

          <InputGroup>
            <Label>이름</Label>
            <Input type="text" placeholder="ex) 홍길동" value={name} onChange={(e) => setName(e.target.value)} />
          </InputGroup>

          <InputGroup>
            <Label>휴대폰 번호</Label>
            <Input type="tel" placeholder="ex) 01012345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </InputGroup>

          <InputGroup>
            <Label>생년월일</Label>
            <Input type="text" placeholder="ex) 20251212" value={birth} onChange={(e) => setBirth(e.target.value)} />
          </InputGroup>

          <KakaoButton>
            <RiKakaoTalkFill size={24} /> {/* 카카오톡 아이콘 */}
            인증하기
          </KakaoButton>

        </VerificationWrapper>
      </PageWrapper>
    </>
  );
};

export default VerificationPage;