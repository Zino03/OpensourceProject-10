import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 로그인 전체 폼
const LoginWrapper = styled.div`
  width: 100%;
  max-width: 350px;
  margin: 80px auto;
  
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 중앙 로고
const LoginLogo = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: #2C3E50;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;

  img { height: 70px; }
`;

const InputField = styled.div`
  width: 100%;
  margin-bottom: 16px;
  
  label {
    font-size: 12px;
    font-weight: 600;
    color: #555;
    margin-left: 4px;
  }
  
  input {
    width: 100%;
    padding: 8px 16px;
    margin-top: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
    box-sizing: border-box;
}
`;

// 체크박스, 비밀번호 찾기
const OptionsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 12px;

  label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #555;
    cursor: pointer;
  }

  a {
    color: #555;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

// 버튼 영역
const ButtonWrapper = styled.div`
  width: 80%;
  display: flex;
  gap: 60px;
  
  button {
    background-color: #FF7E00; 
    flex: 1; 
    padding: 8px 0;
    font-size: 12px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #ddd;
  }
`;

const LoginSignupButton = styled.button`
  background-color: #FF7E00; 
  color: #fff;
`;

const LoginPage = () => {
  const navigate = useNavigate();

  // 회원가입 버튼
  const JoinClick = () => {
    navigate(`/join`);
  };

  return (
    <>
      <LoginWrapper>
        <LoginLogo>
          <img src="/images/sajasaja.png" alt="SajaSaja Logo" /> 
          SajaSaja
        </LoginLogo>

        <InputField>
          <label htmlFor="email">ID (Email)</label>
          <input type="email" id="email" />
        </InputField>

        <InputField>
          <label htmlFor="password">PW (Password)</label>
          <input type="password" id="password" />
        </InputField>

        <OptionsWrapper>
          <label>
            <input type="checkbox" />
            자동 로그인
          </label>
          <a href="/find-password">비밀번호 찾기</a>
        </OptionsWrapper>

        <ButtonWrapper>
          <LoginSignupButton>LOGIN</LoginSignupButton>
          <LoginSignupButton onClick={JoinClick}>SIGN UP</LoginSignupButton>
        </ButtonWrapper>
      </LoginWrapper>
    </>
  );
};

export default LoginPage;