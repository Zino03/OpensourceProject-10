import React, { useState }from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.31.28:8080', // 백엔드 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    border: 1px solid #FF7E00;
    flex: 1; 
    padding: 8px 0;
    font-size: 12px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const LoginSignupButton = styled.button`
  background-color: #FF7E00; 
  border: 1px solid #FF7E00;
  color: #fff;
`;

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false); // 자동 로그인 체크 여부

  const handleLogin = async () => {
    // 유효성 검사
    if (!email) {
      alert("아이디(이메일)를 입력해주세요.");
      return;
    }
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      // POST 요청 보내기
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      //  토큰 저장 로직
      // response.data.accessToken
      const token = response.data.accessToken || response.data.token; 

      if (token) {
        // 토큰을 로컬 스토리지에 저장 (자동 로그인을 위함)
        localStorage.setItem('accessToken', token);
        
        // 로그인 성공 시 메인 페이지로 이동
        window.location.href = '/'; 
      } else {
        // 토큰이 없는 경우에도 이동이 필요하다면
        window.location.href = '/';
      }

    } catch (error) {
      console.error('로그인 실패:', error);
      
      if (error.response) {
        // 서버가 에러 응답을 보낸 경우 (401, 404 등)
        if (error.response.status === 401) {
          alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        } else {
          alert(`로그인 오류: ${error.response.data.message || '알 수 없는 오류'}`);
        }
      } else {
        // 네트워크 오류 등
        alert("서버와 연결할 수 없습니다.");
      }
    }
  };

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
          <input type="email" id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </InputField>

        <InputField>
          <label htmlFor="password">PW (Password)</label>
          <input type="password" id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </InputField>

        <OptionsWrapper>
          <label>
            <input type="checkbox" 
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}/>
            자동 로그인
          </label>
          <a href="/find-password">비밀번호 찾기</a>
        </OptionsWrapper>

        <ButtonWrapper>
          <LoginSignupButton onClick={handleLogin}>LOGIN</LoginSignupButton>
          <LoginSignupButton onClick={JoinClick}>SIGN UP</LoginSignupButton>
        </ButtonWrapper>
      </LoginWrapper>
    </>
  );
};

export default LoginPage;