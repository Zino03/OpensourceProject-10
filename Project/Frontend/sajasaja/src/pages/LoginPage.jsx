import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api } from "../assets/setIntercepter";

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
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;

  img {
    height: 70px;
  }
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
    &:hover {
      text-decoration: underline;
    }
  }
`;

// 버튼 영역
const ButtonWrapper = styled.div`
  width: 80%;
  display: flex;
  gap: 60px;

  button {
    background-color: #ff7e00;
    border: 1px solid #ff7e00;
    flex: 1;
    padding: 8px 0;
    font-size: 12px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const LoginSignupButton = styled.button`
  background-color: #ff7e00;
  border: 1px solid #ff7e00;
  color: #fff;
`;

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      console.log(response);

      //  토큰 저장 로직
      // response.data.accessToken
      const token = response.data.token.accessToken;
      const nickname = response.data.userNickname;
      const role = response.data.role;

      if (token) {
        // 토큰을 로컬 스토리지에 저장 (자동 로그인을 위함)
        localStorage.setItem("accessToken", token);

      if (nickname) {
            localStorage.setItem("userNickname", nickname);
        }

        if (role) {
           localStorage.setItem("role", role);
        }

        // ✅ [수정] Role에 따른 페이지 이동 분기 처리
        if (role === "ADMIN") {
            alert("관리자 계정으로 로그인되었습니다.");
            window.location.href = "/admin"; // 관리자 페이지로 이동
        } else {
            window.location.href = "/"; // 일반 메인 페이지로 이동
        }
      } else {
        // 토큰이 없는 경우에도 이동이 필요하다면
        window.location.href = "/";
      }
    } catch (error) {
      console.error("로그인 실패:", error);

      if (error.response) {
        alert(`${error.response.data.message || "알 수 없는 오류"}`);
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
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputField>

        <InputField>
          <label htmlFor="password">PW (Password)</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputField>

        <OptionsWrapper>
          <label>
            <input
              type="checkbox"
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
            />
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
