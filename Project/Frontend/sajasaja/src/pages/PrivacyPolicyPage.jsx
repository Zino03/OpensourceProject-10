import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 전체 폼
const FormWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 40px auto;
  position: relative;
  
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #6A6A6A;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 40px;
  color: #000;

  width: 100%;
  text-align: center;
`;

const Section = styled.div`
  font-size: 14px;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.7;
  }
`

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // 이전 페이지로 이동
  };

    return (
      <FormWrapper>
        <CloseButton onClick={handleClose} aria-label="닫기">
          <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M18 6L6 18M6 6L18 18" 
            stroke="#6A6A6A" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        </CloseButton>
        <Title>개인정보 처리방침</Title>
        <Section>
          사자사자는 『개인정보보호법』 등 관련 법령상의 개인정보 보호규정을 준수하며, 『개인정보보호법』에 의거한 개인정보처리방침을 통하여 이용자가 제공한 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치가 취해지고 있는지를 알려드립니다.<br/>
          본 개인정보처리방침은 관련 법률 및 지침의 변경 등에 따라 수시로 변경될 수 있으며, 변경될 경우 이용자가 쉽게 알아볼 수 있도록 사자사자가 제공하는 제반 서비스의 공지사항을 통해 게시됩니다.
        </Section>
        <Section>
          1. 개인정보의 수집 및 이용목적 
          ① 회사는 원활한 서비스(사자사자) 제공을 위해 필요한 최소한의 개인정보만을 이용자의 동의 하에 수집하고 있습니다. 
          ※ 개인정보란 생존하는 개인에 관한 정보로서 특정 개인을 식별하거나 식별할 수 있는 모든 정보. 
          (1) 회사는 회원가입, 주문, 고객상담 등 각종 서비스의 제공을 위해 아래와 같이 이용자의 개인정보를 수집합니다.
        </Section>
      </FormWrapper>
    )
}

export default PrivacyPolicyPage;

