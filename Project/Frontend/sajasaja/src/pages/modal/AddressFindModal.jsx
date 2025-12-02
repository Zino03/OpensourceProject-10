// src/components/AddressFindModal.jsx
import React from 'react';
import styled from 'styled-components';
import DaumPostcode from 'react-daum-postcode';
import { FaTimes } from "react-icons/fa";
import { api } from "../../assets/setIntercepter"; //

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
  z-index: 9999;
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

const KAKAO_REST_API_KEY = '1182ee2a992f45fb1db2238604970e19';

const AddressFindModal = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  // handleComplete 함수를 비동기로 수정하고 Geocoding 로직 추가 
  const handleComplete = async (data) => {
    // 1. 도로명 주소만 사용
    const roadAddress = data.roadAddress; 
    
    let latitude = 0;
    let longitude = 0;

    if (roadAddress && KAKAO_REST_API_KEY !== '1182ee2a992f45fb1db2238604970e19') {
        try {
            const geocodingUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(roadAddress)}`;
            
            // 2. 카카오 Geocoding API 직접 호출
            const response = await api.get(geocodingUrl, {
                headers: {
                    // 카카오 REST API 키 사용 (자바스크립트 키 아님)
                    Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`, 
                },
            });

            if (response.data.documents && response.data.documents.length > 0) {
                const result = response.data.documents[0];
                // 카카오 API 응답에서 x는 경도(longitude), y는 위도(latitude)입니다.
                longitude = parseFloat(result.x); 
                latitude = parseFloat(result.y); 
            } else {
                console.warn("좌표 변환 결과를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("카카오 Geocoding API 호출 실패:", error);
            // 오류 발생 시 0, 0을 사용
        }
    }

    // 3. 주소, 위도, 경도를 부모 컴포넌트에 전달
    // onComplete(도로명 주소, 위도, 경도) 형식으로 호출
    onComplete(roadAddress, latitude, longitude);
    onClose(); 
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <DaumPostcode onComplete={handleComplete} />
      </ModalContainer>
    </Overlay>
  );
};

export default AddressFindModal;
