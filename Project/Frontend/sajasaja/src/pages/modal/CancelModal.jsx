// src/pages/modal/CancelModal.jsx

import React from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  width: 360px;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
`;

const MessageArea = styled.div`
  padding: 20px 24px 18px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #222;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #f0f0f0;
`;

const ButtonArea = styled.div`
  display: flex;
  padding: 12px 14px 16px;
  gap: 8px;
`;

const BaseButton = styled.button`
  flex: 1;
  height: 36px;
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
`;

const GhostButton = styled(BaseButton)`
  border: 1px solid #d5d5d5;
  background-color: #ffffff;
  color: #333;
`;

const BlackButton = styled(BaseButton)`
  border: none;
  background-color: #000000;
  color: #ffffff;
`;

/**
 * props:
 *  - isOpen: boolean (true일 때만 노출)
 *  - onClose: "돌아가기" 눌렀을 때 / 바깥 클릭 시
 *  - onConfirm: "주문 취소하기" 눌렀을 때
 */
const CancelModal = ({ order, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // 모달 바깥 영역 클릭 시 닫기
    if (e.target === e.currentTarget) {
      onClose && onClose();
    }
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <ModalBox>
        <MessageArea>주문 취소하시겠습니까?</MessageArea>
        <Divider />
        <ButtonArea>
          <GhostButton type="button" onClick={onClose}>
            돌아가기
          </GhostButton>
          <BlackButton type="button" onClick={() => onConfirm(order.id)}>
            주문 취소하기
          </BlackButton>
        </ButtonArea>
      </ModalBox>
    </Backdrop>
  );  
};

export default CancelModal;
