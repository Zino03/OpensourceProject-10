import React from 'react';
import styled from 'styled-components';

// 배경 오버레이 (화면 전체를 덮음)
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4); // 반투명 검은색
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; // 다른 요소보다 위에 뜨도록
`;

// 모달 창 (하얀색 박스)
const ModalContainer = styled.div`
  background-color: #fff;
  width: 320px;        // 너비
  padding: 30px 20px 20px; // 상, 좌우, 하 패딩
  border-radius: 16px; // 둥근 모서리
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

// 메시지 텍스트
const Message = styled.p`
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 24px;
  white-space: pre-wrap; // 줄바꿈(\n) 적용
`;

// 확인 버튼
const ConfirmButton = styled.button`
  width: 100%;
  height: 44px;
  background-color: #FF7E00; // 메인 컬러
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e67100; // 호버 시 약간 어둡게
  }
`;

const BasicModal = ({ isOpen, onClose, message, buttonText = "확인" }) => {
  if (!isOpen) return null; // 열려있지 않으면 렌더링 안 함

  // 오버레이 클릭 시 닫히게 하려면 Overlay에 onClick={onClose} 추가
  // 모달 내부 클릭 시 닫히지 않게 e.stopPropagation() 사용
  return (
    <Overlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Message>{message}</Message>
        <ConfirmButton onClick={onClose}>{buttonText}</ConfirmButton>
      </ModalContainer>
    </Overlay>
  );
};

export default BasicModal;