import React from 'react';
import styled from 'styled-components';
import DaumPostcode from 'react-daum-postcode';
import { FaTimes } from "react-icons/fa";
import { api } from "../../assets/setIntercepter"; 

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

// 카카오 REST API 키 (여기에 본인의 REST API 키를 입력하세요)
const KAKAO_REST_API_KEY = '1182ee2a992f45fb1db2238604970e19'; 

const AddressFind = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  const handleComplete = async (data) => {
    // 1. 우편번호와 도로명 주소 추출
    const zonecode = data.zonecode; 
    const roadAddress = data.roadAddress; 
    
    let latitude = 0;
    let longitude = 0;

    // 2. 카카오 Geocoding API 호출 (좌표 변환)
    if (roadAddress && KAKAO_REST_API_KEY) {
        try {
            const geocodingUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(roadAddress)}`;
            
            const response = await api.get(geocodingUrl, {
                headers: {
                    // 변수로 선언된 키를 사용하도록 수정
                    Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`, 
                },
            });

            if (response.data.documents && response.data.documents.length > 0) {
                const result = response.data.documents[0];
                longitude = parseFloat(result.x); 
                latitude = parseFloat(result.y); 
            } else {
                console.warn("좌표 변환 결과를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("카카오 Geocoding API 호출 실패:", error);
        }
    }

    // 3. 부모 컴포넌트에 데이터 전달 (객체 형태로 전달)
    // NewDeliveryInfo에서 data.address, data.zonecode로 쓰기 편하게 구성
    onComplete({
        address: roadAddress,
        zonecode: zonecode,
        latitude: latitude,
        longitude: longitude
    });
    
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

export default AddressFind;