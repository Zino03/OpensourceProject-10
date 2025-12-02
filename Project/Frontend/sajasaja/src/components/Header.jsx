import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
  margin-left: 125px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 60px; 

  nav { 
    display: flex; 
    gap: 24px; 
  }
  nav a { 
    text-decoration: none; 
    font-weight: 700; 
    font-size: 13px; 
    color: #000;
  }
`;

const LoginSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; 
  a { 
    text-decoration: none; 
    font-weight: 500; 
    font-size: 11px; 
    color: #555; 
  }
  img { 
    height: 16px; 
    margin-top: 4px;
  }
`

const LogoutButton = styled.span`
  font-weight: 400;
  font-size: 11px;
  color: #555;
  cursor: pointer;
  &:hover { color: #000; }
`;

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 토큰 삭제
    setIsLoggedIn(false); // 상태 변경
    window.location.href = '/';  // 메인으로 이동
  };

  return (
    <HeaderWrapper>
      <HeaderContent>
        <LogoSection href="/">
          <img src="/images/sajasaja.png" alt="SajaSaja Logo" style={{height: 30}}/> 
          <img src="/images/LogoText.png" alt="SajaSaja LogoText" style={{height: 20}}/> 
        </LogoSection>

        <RightSection>
          <nav>
            <a href="/">공동 구매</a>
            <a href="/nearby">내 주변 공구</a>
            {isLoggedIn ? (
            <a href="/write">공구 등록</a>
            ) : (
              <a href="/login">공구 등록</a>)}
          </nav>
          <LoginSection>
            {isLoggedIn ? (
              <>
                <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                <a href="/mypage" style={{fontWeight: 600}}>마이페이지</a>
                <a href="/mypage"><img src="/images/filledprofile.svg" alt="profile"/></a>
              </>
            ) : (
              <>
                <a href="/login" style={{fontWeight: 400}}>로그인</a>
                <a href="/login"><img src="/images/lineprofile.svg" alt="profile"/></a>
              </>
            )}
          </LoginSection>
        </RightSection>
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;