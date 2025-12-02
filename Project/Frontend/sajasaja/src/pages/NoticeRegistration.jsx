// 파일명: NoticeRegistration.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Modal = styled.div`
  width: 520px;
  max-width: 90%;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
`;

const Header = styled.div`
  padding: 14px 24px;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
`;

const Body = styled.div`
  padding: 24px 24px 20px;
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const TextAreaWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 220px;
  padding: 12px 14px;
  border: none;
  resize: none;
  outline: none;
  font-size: 13px;
  line-height: 1.6;
  box-sizing: border-box;
  color: #333;

  &::placeholder {
    color: #c0c0c0;
  }
`;

const Footer = styled.div`
  padding: 16px 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  min-width: 96px;
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #f2f2f2;
  color: #555;

  &:hover {
    background-color: #e5e5e5;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #ff7e00;
  color: #ffffff;

  &:hover {
    opacity: 0.9;
  }
`;

const NoticeRegistration = ({
  isOpen,
  defaultValue = "",
  onClose,
  onSubmit,
}) => {
  const [content, setContent] = useState(defaultValue);

  useEffect(() => {
    // 모달이 열릴 때마다 기본값 동기화
    if (isOpen) setContent(defaultValue);
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      alert("공지할 내용을 입력해주세요.");
      return;
    }
    if (onSubmit) onSubmit(trimmed);
  };

  return (
    <Overlay>
      <Modal>
        <Header>공지 등록하기</Header>

        <Body>
          <Label>내용</Label>
          <TextAreaWrapper>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공지할 내용을 등록해주세요."
            />
          </TextAreaWrapper>
        </Body>

        <Footer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SubmitButton onClick={handleSubmit}>등록하기</SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default NoticeRegistration;
