import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api } from "../assets/setIntercepter";

// 비밀번호 찾기 전체 폼
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

// Column으로 정렬
const FindPwWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
`;

// 비밀번호 찾기 타이틀
const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
`;

// 입력창
const InputGroup = styled.div`
  margin-bottom: 24px;
  width: 100%;

  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 12px;
    box-sizing: border-box;

    &::placeholder {
      color: #ccc;
    }
    &:focus {
      outline: none;
    }
  }
`;

// 에러 메시지
const ErrorMessage = styled.p`
  font-size: 10px;
  color: #ff5a5a;
  font-weight: 600;
  margin-top: -12px;
  margin-bottom: 24px;

  &::before {
    content: "*";
    margin-right: 4px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;
  align-items: center;
`;

// 공통 버튼 스타일
const Button = styled.button`
  width: 100%;
  padding: 8px 0;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
`;

// Input 아래 버튼
const BackButton = styled(Button)`
  background-color: #ff7e00;
  color: white;
`;

const FindButton = styled(Button)`
  background-color: #cfcfcf;
  color: white;
`;

const FindPassword = () => {
  const navigate = useNavigate();

  // 입력값 상태 관리
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 에러 메시지 표시
  const [showError, setShowError] = useState(false);

  const handleFind = async () => {
    // 1. 유효성 검사
    console.log(name, email);

    if (!name || !email) {
      setShowError(true);
      return;
    }

    try {
      // 2. 서버 통신 (import한 api 인스턴스 사용)
      // 경로는 백엔드 설정에 맞춰 수정하세요. 예: /api/member/findPw
      const response = await api.post("/auth/findpw", {
        name: name,
        email: email,
      });

      console.log("전송 성공:", response.data);

      // 3. 성공 처리
      setShowError(false);
      alert(
        "입력하신 이메일로 비밀번호 재설정 링크(혹은 임시비밀번호)를 보냈습니다."
      );
      navigate("/login"); // 로그인 페이지로 이동
    } catch (err) {
      console.error("전송 실패:", err.response.data);
      // 4. 실패 처리
      setShowError(true); // 에러 메시지 표시
    }
  };

  return (
    <>
      <PageWrapper>
        <FindPwWrapper>
          <Title>비밀번호 찾기</Title>

          <InputGroup>
            <label>이름</label>
            <input
              type="text"
              placeholder="ex) 홍길동"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (showError) setShowError(false); // 입력 시 에러 끔
              }}
            />
          </InputGroup>

          <InputGroup>
            <label>가입한 이메일</label>
            <input
              type="email"
              placeholder="ex) ID@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (showError) setShowError(false); // 입력 시 에러 끔
              }}
            />
          </InputGroup>

          {showError && (
            <ErrorMessage>해당하는 이메일이 존재하지 않습니다!</ErrorMessage>
          )}

          <ButtonGroup>
            <BackButton onClick={handleFind}>찾기</BackButton>
            <FindButton onClick={() => navigate("/login")}>
              로그인 화면으로 돌아가기
            </FindButton>
          </ButtonGroup>
        </FindPwWrapper>
      </PageWrapper>
    </>
  );
};

export default FindPassword;
