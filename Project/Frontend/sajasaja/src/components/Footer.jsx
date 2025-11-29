import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 20px 150px;
  border-top: 1px solid #eee;
  margin-top: auto; 
`;

const ContentWrapper = styled.div`
  max-width: 1100px;
  overflow-x : hidden;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 로고 영역
const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

// 링크 메뉴 (이용약관 | 개인정보처리방침)
const LinkMenu = styled.div`
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #888;

  a {
    text-decoration: none;
    color: #888;
    cursor: pointer;
    &:hover { color: #555; }
  }

  span {
    color: #ddd; 
  }
`;

// 설명 텍스트 (작은 글씨)
const Description = styled.p`
  font-size: 12px;
  color: #aaa;
  line-height: 1.6;
  margin: 0;
  word-break: keep-all; 
`;

const Footer = () => {
  return (
    <FooterContainer>
      <ContentWrapper>
        <LogoArea>
          <img src="/images/FLogo.png" alt="SajaSaja Logo" style={{height: 30}}/> 
          <img src="/images/FLogoText.png" alt="SajaSaja LogoText" style={{height: 20}} /> 
        </LogoArea>

        <LinkMenu>
          <a href="#">이용약관</a>
          <span>|</span>
          <a href="#" style={{fontWeight: 'bold'}}>개인정보처리방침</a>
        </LinkMenu>

        <Description>
          ‘사자사자’는 통신판매중개자로서 통신판매의 당사자가 아니며, 입점업체가 등록한 상품, 상품정보 및 거래에 대하여 ‘사자사자’는 일체 책임을 지지 않습니다.
        </Description>
      </ContentWrapper>
    </FooterContainer>
  );
};

export default Footer;
