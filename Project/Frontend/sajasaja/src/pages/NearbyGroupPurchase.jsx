import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaPlus, FaMinus, FaSyncAlt, FaCrosshairs } from "react-icons/fa"; // 아이콘 추가

const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;
`;

// 사이드바 
const Sidebar = styled.div`
  width: 350px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 18px;
  border-bottom: 1px solid #333;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

// 리스트 스크롤 영역
const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
`;

// 개별 아이템 카드
const ItemCard = styled.div`
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  
  background-color: ${props => props.active ? '#FFF5E0' : '#fff'};

  &:hover {
    background-color: ${props => props.active ? '#FFF5E0' : '#f9f9f9'};
  }
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-right: 16px;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px 0;
`;

const ItemTitle = styled.h3`
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 4px 0;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Price = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #FF7E00;
`;

const MetaInfo = styled.div`
  text-align: right;
  font-size: 11px;
  color: #888;
`;

// 지도 영역
const MapArea = styled.div`
  flex: 1;
  background-color: #f0f0f0;
  position: relative;
  overflow: hidden;
  
  background-size: cover;
  background-position: center;
`;

// 지도 위 마커
const Marker = styled.div`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transform: translate(-50%, -100%); 
  transition: transform 0.2s;

  img {height: 30px; }
  &:hover {
    transform: translate(-50%, -110%) scale(1.1);
    z-index: 100;
  }
`;

// 지도 컨트롤 버튼
const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  cursor: pointer;

  &:hover { background-color: #f9f9f9; }
  &:active { background-color: #eee; }
`;

// 확대/축소 그룹
const ZoomControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;

  button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 0;
    background-color: #fff;
    
    &:first-child { border-bottom: 1px solid #eee; }
    &:hover { background-color: #f9f9f9; }
    &:active { background-color: #eee; }
  }
`;

const NearbyGroupPurchase = () => {
  const [selectedId, setSelectedId] = useState(1);

  const handleZoomIn = () => console.log('확대');
  const handleZoomOut = () => console.log('축소');
  const handleRefresh = () => console.log('새로고침');
  const handleCurrentLocation = () => console.log('현위치');

  // 더미 데이터
  const mockItems = [
    {
      id: 1,
      title: '애니 피완크 미니 프레첼 스낵 150g',
      price: 890,
      current: 87,
      total: 100,
      deadline: '25. 11. 30',
      image: 'https://via.placeholder.com/80',
      pos: { top: '40%', left: '45%' } // 지도상 가상 위치
    },
    {
      id: 2,
      title: '애니 피완크 미니 프레첼 스낵 150g',
      price: 890,
      current: 87,
      total: 100,
      deadline: '25. 11. 30',
      image: 'https://via.placeholder.com/80',
      pos: { top: '55%', left: '60%' }
    },
    {
      id: 3,
      title: '애니 피완크 미니 프레첼 스낵 150g',
      price: 890,
      current: 87,
      total: 100,
      deadline: '25. 11. 30',
      image: 'https://via.placeholder.com/80',
      pos: { top: '30%', left: '70%' }
    },
    {
      id: 4,
      title: '애니 피완크 미니 프레첼 스낵 150g',
      price: 890,
      current: 87,
      total: 100,
      deadline: '25. 11. 30',
      image: 'https://via.placeholder.com/80',
      pos: { top: '70%', left: '30%' }
    },
    // 스크롤 테스트용 데이터 추가
    { id: 5, title: '제주 감귤 10kg', price: 12000, current: 5, total: 10, deadline: '25. 12. 01', image: 'https://via.placeholder.com/80', pos: { top: '20%', left: '20%' } },
    { id: 6, title: '코스트코 베이글', price: 6000, current: 1, total: 2, deadline: '25. 12. 05', image: 'https://via.placeholder.com/80', pos: { top: '80%', left: '80%' } },
  ];

  return (
    <Container>
      {/* 좌측 사이드바 (리스트) */}
      <Sidebar>
        <SidebarHeader>
          <Title>내 주변 공구</Title>
        </SidebarHeader>

        <ListContainer>
          {mockItems.map((item) => (
            <ItemCard 
              key={item.id} 
              active={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <Thumbnail>
                <img src={item.image} alt="썸네일" />
              </Thumbnail>
              
              <InfoArea>
                <div>
                  <ItemTitle>{item.title}</ItemTitle>
                  <Price>{item.price.toLocaleString()} 원</Price>
                </div>
                <MetaInfo>
                  <div>수량 : {item.current}/{item.total}</div>
                  <div>~{item.deadline}</div>
                </MetaInfo>
              </InfoArea>
            </ItemCard>
          ))}
        </ListContainer>
      </Sidebar>

      {/* 우측 지도 영역 */}
      <MapArea>
        <img src="/images/getTileMap.png" alt="marker" />
        {mockItems.map((item) => (
          <Marker 
            key={item.id} 
            top={item.pos.top} 
            left={item.pos.left}
            onClick={() => setSelectedId(item.id)}
            title={item.title}
          >
            <img src="/images/marker.png" alt="marker" />
          </Marker>
        ))}
        {/*FaPlus, FaMinus, FaSyncAlt, FaCrosshairs */}
        <ZoomControlGroup>
          <FaPlus/>
          <FaMinus/>
        </ZoomControlGroup>
        <ControlButton>
          <FaSyncAlt/>
          <FaCrosshairs/>
        </ControlButton>
      </MapArea>
    </Container>
  );
};

export default NearbyGroupPurchase;