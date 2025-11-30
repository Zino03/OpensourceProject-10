import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  width: 400px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MessageSection = styled.div`
  padding: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
`;

const RedText = styled.span`
  color: #D32F2F;
  font-weight: 600;
`;

const ButtonSection = styled.div`
  background-color: #F8F9FA;
  padding: 12px;
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled.button`
  flex: 1;
  height: 40px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  ${({ isConfirm }) => 
    isConfirm 
      ? `
        background-color: #000;
        color: #fff;
        border: none;
      ` 
      : `
        background-color: #fff;
        color: #000;
        border: 1px solid #ddd;
      `
  }
`;

const RegisterModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <MessageSection>
          원활한 공동 구매 진행을 위해,<br />
          진행 중 발생하는 사항들은<br />
          <RedText>주최자께서 직접 확인하고 처리해 주시는 것을</RedText><br />
          원칙으로 합니다.<br />
          <RedText>(등록 후 수정은 불가능합니다.)</RedText>
        </MessageSection>
        
        <ButtonSection>
          <ModalButton onClick={onClose}>
            돌아가기
          </ModalButton>
          <ModalButton isConfirm onClick={onConfirm}>
            등록하기
          </ModalButton>
        </ButtonSection>
      </ModalContainer>
    </Overlay>
  );
};

export default RegisterModal;