import React from 'react';
import styled from 'styled-components';
import { FaUserCircle } from "react-icons/fa";

// 상단 헤더
const HeaderWrapper = styled.header`
  width: 100%; 
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 12px 0;
`;
const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px; 
`;

const LogoSection = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  
  img { height: 30px; }
  h2 { 
    font-size: 20px;
    font-weight: 800;
    color: #2C3E50;
    margin: 0;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px; 

  nav { 
    display: flex; 
    gap: 24px; 
  }
  nav a { 
    text-decoration: none; 
    color: #333; 
    font-weight: 700; 
    font-size: 13px; 
  }
  
  .user-menu { 
    display: flex; 
    gap: 12px; 
    align-items: center; 
  }
  .user-menu a { 
    text-decoration: none; 
    color: #555; 
    font-size: 12px; 
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <LogoSection href="/">
          <img src="/images/sajasaja.png" alt="SajaSaja Logo" /> 
          <h2>SajaSaja</h2>
        </LogoSection>

        <RightSection>
          <nav>
            <a href="/">공동 구매</a>
            <a href="/nearby">내 주변 공구</a>
            <a href="/write">공구 등록</a>
            <a href="/">이용가이드</a>
          </nav>
          <div className="user-menu">
            <a href="/login">로그인</a>
            <FaUserCircle size={24} color="#555" />
          </div>
        </RightSection>
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;