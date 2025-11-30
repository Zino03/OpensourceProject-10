import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 회원가입 전체 폼
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const SignupWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  padding: 48px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
`;

// 입력창과 버튼을 감싸는 컨테이너
const InputWithButton = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;
`;

const Input = styled.input`
  flex: 1;
  width:100%;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 12px;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus { outline: none; }
`;

const CheckButton = styled.button`
  position: absolute;
  top: 5px;
  bottom: 5px;
  right: 5px;
  background-color: #CFCFCF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #BEBEBE;
  }
`;

// 유효성 검사 메시지
const ValidationMessage = styled.p`
  font-size: 11px;
  margin-top: 8px;
  font-weight: 500;
  
  &.success {
    color: #4CAF50; 
  }
  &.error {
    color: #FF5A5A; 
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 8px 16px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

const JoinPage = () => {
  const navigate = useNavigate();
  
    // 가입하기 버튼
    const Join = () => {
      // 모든 필수 입력 항목이 채워져 있는지 확인
      if (!username || !tel || !nickname || !email || !password || !confirmPassword) {
        alert('모든 항목을 작성해주세요.');
        return;
      }
      
      if (!isNicknameVerified) {
        alert('닉네임 중복 확인을 해주세요.');
        return;
      }
      if (!isEmailVerified) {
          alert('이메일 중복 확인을 해주세요.');
          return;
      }

      navigate(`/`);
    };

  // 상태 관리
  const [username, setUsername] = useState('');
  const [tel, setTel] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // 유효성 검사 메시지
  const [telMessage, setTelMessage] = useState(null);
  const [nicknameMessage, setNicknameMessage] = useState(null);
  const [emailMessage, setEmailMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);

  // 중복 확인 필수
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 전화번호 처리
  const handleTelChange = (e) => {
    // 숫자 이외의 문자는 모두 제거
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    
    // 11자리까지만 업데이트
    if (value.length <= 11) {
      setTel(value);
    }
  };

  // 전화번호가 변경될 때마다 실행 (11자리가 찼을 때 검사)
  useEffect(() => {
    if (tel.length === 0) {
      setTelMessage(null);
      return;
    }

    // 11자리가 되었을 때 검사 수행
    if (tel.length === 11) {
      const phoneRegex = /^010\d{8}$/;

      if (phoneRegex.test(tel)) {
        setTelMessage({ text: "사용 가능한 전화번호입니다.", type: "success" });
      } else {
        setTelMessage({ text: "010으로 시작하는 올바른 휴대폰 번호를 입력해주세요.", type: "error" });
      }
    } else {
      // 11자리가 아닐 때 메시지 초기화
      setTelMessage(null);
    }
  }, [tel]);


  // 닉네임 중복 확인
  const checkNickname = () => {
    const isCheckNickname = nickname === "사자사자"; // 테스트

    if(isCheckNickname){
      setNicknameMessage({ text: "이미 사용 중인 닉네임입니다.", type: "error" });
      setIsNicknameVerified(false);
    }
    else{
      setNicknameMessage({ text: "사용 가능한 닉네임입니다.", type: "success" });
      setIsNicknameVerified(true);
    }
  }
  
  // 이메일 중복 확인 (com, net, ac.kr)
  const checkEmail = () => {
    const emailRegex = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.(com|net|ac\.kr)$/i; // 이메일 형식 체크
    if (!emailRegex.test(email)) {
      setEmailMessage({ text: "올바른 이메일 형식이 아닙니다.", type: "error" });
      return;
    }

    const isCheckEmail = email === "test@example.com"; // 테스트

    if(isCheckEmail){
      setEmailMessage({ text: "이미 가입된 이메일입니다.", type: "error" });
      setIsEmailVerified(false);
    }
    else{
      setEmailMessage({ text: "사용 가능한 이메일입니다.", type: "success" });
      setIsEmailVerified(true);
    }
  }

  // 비밀번호 유효성 체크
  useEffect(() => {
    if (!password) {
      setPasswordMessage(null); // 입력이 없으면 메시지 숨김
      return;
    }

    if (password.length < 8) {
      setPasswordMessage({ text: "비밀번호는 최소 8자 이상이어야 합니다.", type: "error" });
    } else {
      setPasswordMessage({ text: "사용 가능한 비밀번호입니다.", type: "success" });
    }
  }, [password]);

  // 비밀번호 확인
  useEffect(() => {
    if (!confirmPassword) {
      setConfirmMessage(null); // 입력이 없으면 메시지 숨김
      return;
    }

    if (password !== confirmPassword) {
      setConfirmMessage({ text: "비밀번호가 일치하지 않습니다.", type: "error" });
    } else {
      setConfirmMessage({ text: "비밀번호가 일치합니다.", type: "success" });
    }
  }, [password, confirmPassword]);

  return (
    <>
      <PageWrapper>
        <SignupWrapper>
          <Title>회원가입</Title>

          <InputGroup>
            <Label>이름</Label>
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </InputGroup>

          <InputGroup>
            <Label>전화번호</Label>
            <Input type="number" placeholder="ex) 01012345678" value={tel} onChange={handleTelChange} maxLength={11}/>
            {telMessage && ( // 메시지가 있을 때만 표시
              <ValidationMessage className={telMessage.type}>
                {telMessage.text}
              </ValidationMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>닉네임</Label>
            <InputWithButton>
              <Input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
              <CheckButton onClick={checkNickname}>중복확인</CheckButton>
            </InputWithButton>
            {nicknameMessage && ( // 메시지가 있을 때만 표시
              <ValidationMessage className={nicknameMessage.type}>
                {nicknameMessage.text}
              </ValidationMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>아이디(이메일)</Label>
            <InputWithButton>
              <Input type="email" placeholder="ex) ID@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <CheckButton onClick={checkEmail}>중복확인</CheckButton>
            </InputWithButton>
            {emailMessage && (
              <ValidationMessage className={emailMessage.type}>
                {emailMessage.text}
              </ValidationMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>비밀번호</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {passwordMessage && (
              <ValidationMessage className={passwordMessage.type}>
                {passwordMessage.text}
              </ValidationMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>비밀번호 확인</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {confirmMessage && (
              <ValidationMessage className={confirmMessage.type}>
                {confirmMessage.text}
              </ValidationMessage>
            )}
          </InputGroup>

          <SubmitButton onClick={Join}>가입하기</SubmitButton>

        </SignupWrapper>
      </PageWrapper>
    </>
  );
};

export default JoinPage;