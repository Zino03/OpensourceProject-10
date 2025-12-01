import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from "../assets/setIntercepter"; 

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
  &::placeholder { color: #aaa; }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  &:focus { outline: none; }
`;

const CheckButton = styled.button`
  position: absolute;
  top: 5px;
  bottom: 5px;
  right: 5px;
  background-color: ${props => props.disabled ? '#E0E0E0' : '#CFCFCF'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 11px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  white-space: nowrap;
  &:hover {
    background-color: ${props => props.disabled ? '#E0E0E0' : '#BEBEBE'};
  }
`;

const ValidationMessage = styled.p`
  font-size: 11px;
  margin-top: 8px;
  font-weight: 500;
  &.success { color: #4CAF50; }
  &.error { color: #D32F2F; }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background-color: ${props => props.disabled ? '#999' : '#000'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-top: 20px;
  &:hover {
    opacity: ${props => props.disabled ? '1' : '0.9'};
  }
`;

const JoinPage = () => {
  // 상태 관리
  const [username, setUsername] = useState('');
  const [tel, setTel] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 검증 상태
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  // 로딩 상태 (중복체크/가입 중 버튼 비활성화)
  const [isLoading, setIsLoading] = useState(false);

  // 메시지 상태
  const [telMessage, setTelMessage] = useState(null);
  const [nicknameMessage, setNicknameMessage] = useState(null);
  const [emailMessage, setEmailMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);

  // 1. 전화번호 처리
  const handleTelChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    if (value.length <= 11) setTel(value);
  };

  useEffect(() => {
    if (tel.length === 0) {
      setTelMessage(null);
      return;
    }
    if (tel.length === 11) {
      const phoneRegex = /^010\d{8}$/;
      if (phoneRegex.test(tel)) {
        setTelMessage({ text: "올바른 형식입니다.", type: "success" });
      } else {
        setTelMessage({ text: "010으로 시작하는 번호를 입력해주세요.", type: "error" });
      }
    } else {
      setTelMessage({ text: "전화번호 11자리를 입력해주세요.", type: "error" });
    }
  }, [tel]);

  

  // // 전화번호 중복 확인 (Path Variable 방식)
  // const checkTel = async () => {
  //   if (!tel) {
  //     alert("닉네임을 입력해주세요.");
  //     return;
  //   }
    
  //   setIsLoading(true);
  //   try {
  //     const response = await api.get(`/api/user/${tel}`);
  //     if (response.status === 200) {
  //       setTelMessage({ text: "사용 가능한 전화번호입니다.", type: "success" });
  //       setIsTelVerified(true);
  //     }

  //   } catch (error) {
  //     // 중복이거나 에러인 경우
  //     if (error.response && (error.response.status === 409 || error.response.status === 400)) {
  //       setTelMessage({ text: "이미 사용 중인 전화번호입니다.", type: "error" });
  //     } else {
  //       const msg = error.response?.data?.message || "중복 확인 중 오류가 발생했습니다.";
  //       setTelMessage({ text: msg, type: "error" });
  //     }
  //     setIsTelVerified(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // 2. 닉네임 변경 시 재검증 유도
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    setIsNicknameVerified(false); 
    setNicknameMessage(null);
  };

  // 닉네임 중복 확인 (Path Variable 방식)
  const checkNickname = async () => {
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.get(`/api/user/${nickname}`);
      if (response.status === 200) {
        setNicknameMessage({ text: "사용 가능한 닉네임입니다.", type: "success" });
        setIsNicknameVerified(true);
      }

    } catch (error) {
      // 중복이거나 에러인 경우
      if (error.response && (error.response.status === 409 || error.response.status === 400)) {
        setNicknameMessage({ text: "이미 사용 중인 닉네임입니다.", type: "error" });
      } else {
        const msg = error.response?.data?.message || "중복 확인 중 오류가 발생했습니다.";
        setNicknameMessage({ text: msg, type: "error" });
      }
      setIsNicknameVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 이메일 변경 시 재검증 유도
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailVerified(false);
    setEmailMessage(null);
  };

  // 이메일 중복 확인 (API 호출)
  const checkEmail = async () => {
    const emailRegex = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.(com|net|ac\.kr|co\.kr)$/i;
    if (!emailRegex.test(email)) {
      setEmailMessage({ text: "올바른 이메일 형식이 아닙니다.", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      // [API] 백엔드 중복 확인 경로 확인 필요
      const response = await api.post('/auth/check/email', { email });

      if (response.status === 200) {
        setEmailMessage({ text: "사용 가능한 이메일입니다.", type: "success" });
        setIsEmailVerified(true);
      }
    } catch (error) {
       if (error.response && error.response.status === 409) {
        setEmailMessage({ text: "이미 가입된 이메일입니다.", type: "error" });
      } else {
        const msg = error.response?.data?.message || "사용할 수 없는 이메일입니다.";
        setEmailMessage({ text: msg, type: "error" });
      }
      setIsEmailVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. 비밀번호 유효성 체크
  useEffect(() => {
    if (!password) {
      setPasswordMessage(null);
      return;
    }
    // 예시: 8자 이상, 영문/숫자/특수문자 포함 권장 로직 추가 가능
    if (password.length < 8) {
      setPasswordMessage({ text: "비밀번호는 최소 8자 이상이어야 합니다.", type: "error" });
    } else {
      setPasswordMessage({ text: "사용 가능한 비밀번호입니다.", type: "success" });
    }
  }, [password]);

  // 5. 비밀번호 확인
  useEffect(() => {
    if (!confirmPassword) {
      setConfirmMessage(null);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmMessage({ text: "비밀번호가 일치하지 않습니다.", type: "error" });
    } else {
      setConfirmMessage({ text: "비밀번호가 일치합니다.", type: "success" });
    }
  }, [password, confirmPassword]);

  // 6. 최종 가입 요청
  const handleJoin = async () => {
    // 유효성 검사
    if (!username || !tel || !nickname || !email || !password || !confirmPassword) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (!isNicknameVerified) {
      alert('닉네임 중복 확인이 필요합니다.');
      return;
    }
    if (!isEmailVerified) {
      alert('이메일 중복 확인이 필요합니다.');
      return;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/signup', {
        email: email,
        password: password,
        passwordck: confirmPassword, // 백엔드 필드명 확인 (passwordCk or confirmPassword?)
        name: username, 
        nickname: nickname,
        phone: tel,
      });

      // 회원가입 후 자동 로그인 처리 (토큰이 온다면)
      const token = response.data.accessToken || response.data.token; 
      if (token) {
        localStorage.setItem('accessToken', token); // 자동 로그인
        alert("회원가입이 완료되었습니다!");
        window.location.href = '/'; 
      } else {
        // 토큰이 안 오면 로그인 페이지로 이동
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        window.location.href = '/login';
      }

    } catch (error) {
      console.error('회원가입 실패:', error);
      if (error.response) {
         alert(`회원가입 실패: ${error.response.data.message || '입력 정보를 확인해주세요.'}`);
      } else {
        alert("서버와 연결할 수 없습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <SignupWrapper>
        <Title>회원가입</Title>

        <InputGroup>
          <Label>이름</Label>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </InputGroup>

        <InputGroup>
          <Label>전화번호</Label>
          <Input 
            type="text" // number type은 maxlength가 안먹힘
            placeholder="ex) 01012345678" 
            value={tel} 
            onChange={handleTelChange} 
            maxLength={11}
          />
          {telMessage && (
            <ValidationMessage className={telMessage.type}>
              {telMessage.text}
            </ValidationMessage>
          )}
        </InputGroup>

        <InputGroup>
          <Label>닉네임</Label>
          <InputWithButton>
            <Input 
              type="text" 
              value={nickname} 
              onChange={handleNicknameChange} 
              placeholder="닉네임을 입력하세요"
            />
            <CheckButton onClick={checkNickname} disabled={isLoading || !nickname}>
              중복확인
            </CheckButton>
          </InputWithButton>
          {nicknameMessage && (
            <ValidationMessage className={nicknameMessage.type}>
              {nicknameMessage.text}
            </ValidationMessage>
          )}
        </InputGroup>

        <InputGroup>
          <Label>아이디(이메일)</Label>
          <InputWithButton>
            <Input 
              type="email" 
              placeholder="ex) ID@example.com" 
              value={email} 
              onChange={handleEmailChange} 
            />
            <CheckButton onClick={checkEmail} disabled={isLoading || !email}>
              중복확인
            </CheckButton>
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

        <SubmitButton onClick={handleJoin} disabled={isLoading}>
        </SubmitButton>

      </SignupWrapper>
    </PageWrapper>
  );
};

export default JoinPage;