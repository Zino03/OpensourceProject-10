import React from 'react';
import styled from 'styled-components';
import { FaTimes } from "react-icons/fa";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background-color: #fff;
  width: 360px;
  border-radius: 12px;
  padding: 30px 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 18px;
  color: #888;
  cursor: pointer;
  &:hover { color: #333; }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
`;

const Description = styled.p`
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
`;

const ContactText = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #f8f9fa;
  border: 1px solid #eee;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
  word-break: break-all;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const ActionButton = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
  
  &.copy {
    background-color: #333;
    color: #fff;
  }
  
  &.link {
    background-color: #fee500; /* 카카오톡 스타일 노란색 */
    color: #000;
  }

  &:hover { opacity: 0.9; }
`;

const ContactModal = ({ isOpen, onClose, contact }) => {
  if (!isOpen) return null;

  // 연락처가 http나 https로 시작하면 링크로 간주
  const isLink = contact && (contact.startsWith('http://') || contact.startsWith('https://'));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact);
      alert("연락처가 복사되었습니다.");
    } catch (err) {
      alert("복사에 실패했습니다. 직접 복사해주세요.");
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <Title>주최자 연락처</Title>
        
        <Description>
            궁금한 점이 있다면 주최자에게 문의해보세요.
        </Description>

        <ContactText>
          {contact || "등록된 연락처가 없습니다."}
        </ContactText>

        {contact && (
            <ButtonGroup>
            <ActionButton className="copy" onClick={handleCopy}>
                복사하기
            </ActionButton>
            {isLink && (
                <ActionButton className="link" onClick={() => window.open(contact, '_blank')}>
                바로가기
                </ActionButton>
            )}
            </ButtonGroup>
        )}
      </ModalBox>
    </Overlay>
  );
};

export default ContactModal;