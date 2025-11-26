import React from 'react';
import styled from 'styled-components';
import DaumPostcode from 'react-daum-postcode';
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
`;

const ModalContainer = styled.div`
  background-color: #fff;
  width: 500px;
  border-radius: 12px;
  padding: 50px 20px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
`;


const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  top: 15px;
  right: 15px;
  &:hover { color: #333; }
`;

const AddressFindModal = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    onComplete(fullAddress);
    onClose(); 
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        
        <DaumPostcode 
          onComplete={handleComplete}
        />
      </ModalContainer>
    </Overlay>
  );
};

export default AddressFindModal;