import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaPlus, FaMinus, FaSyncAlt, FaCrosshairs, FaList } from "react-icons/fa";

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
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
`;

const SidebarHeader = styled.div`
  padding: 18px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #333;
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: #FF7E00;
  cursor: pointer;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const ItemCard = styled.div`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background-color: ${props => props.$active ? '#FFF5E0' : '#fff'};
  border-left: ${props => props.$active ? '4px solid #FF7E00' : '4px solid transparent'};

  &:hover {
    background-color: ${props => props.$active ? '#FFF5E0' : '#fafafa'};
  }
`;

const Thumbnail = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 6px;
  margin-right: 14px;
  flex-shrink: 0;
  overflow: hidden;
  background-color: #eee;

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
`;

const ItemTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px 0;
  line-height: 1.3;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ItemCount = styled.span`
  
`

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

const CountInfo = styled.span`
  font-size: 11px;
  color: #888;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
`;

// 지도 영역
const MapArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #e8e8e8;
`;

const MapBackground = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 마커 컨테이너
const MarkerContainer = styled.div`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  transform: translate(-50%, -100%);
  cursor: pointer;
  z-index: ${props => props.$isActive ? 100 : 1};

  &:hover {
    transform: translate(-50%, -110%) scale(1.1);
    z-index: 200;
  }
`;

// 실제 마커 이미지/아이콘
const MarkerPin = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 지도 컨트롤 컨테이너 (우측 상단)
const MapControls = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ControlGroup = styled.div`
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

const ControlBtn = styled.button`
  width: 40px;
  height: 40px;
  background-color: #fff;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #555;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:last-child { border-bottom: none; }
  &:hover { background-color: #f5f5f5; color: #333; }
  &:active { background-color: #e0e0e0; }
`;

const NearbyGroupPurchase = () => {
  const [selectedLocationKey, setSelectedLocationKey] = useState(null); // 선택된 '위치' 키
  
  // 더미 데이터 (위치 정보 pos가 같은 아이템을 일부러 포함)
  const mockItems = [
    { id: 1, title: '애니 피욘크 미니 프레첼 150g', price: 890, current: 87, total: 100, image: '', pos: { top: '40%', left: '45%' } },
    { id: 2, title: '제주 감귤 10kg 공구', price: 12900, current: 3, total: 10, image: '', pos: { top: '40%', left: '45%' } }, // id:1과 같은 위치
    { id: 3, title: '코스트코 베이글 1+1', price: 6500, current: 5, total: 8, image: '', pos: { top: '30%', left: '70%' } },
    { id: 4, title: '대파 한 단 나눔 공구', price: 1500, current: 2, total: 5, image: '', pos: { top: '70%', left: '30%' } },
    { id: 5, title: '생수 2L 6개입', price: 3000, current: 5, total: 10, image: '', pos: { top: '70%', left: '30%' } }, // id:4와 같은 위치
    { id: 6, title: '고구마 5kg', price: 15000, current: 1, total: 2, image: '', pos: { top: '70%', left: '30%' } }, // id:4와 같은 위치 (3개 중첩)
    { id: 7, title: '짱 멋진 가방', price: 50000, current: 1, total: 1, image: '', pos: { top: '55%', left: '60%' } },
  ];

  // 1. 데이터를 위치 기준으로 그룹화 (Memoization)
  const groupedItems = useMemo(() => {
    const groups = {};
    mockItems.forEach(item => {
      // 위치를 고유 키로 생성 (예: "40%-45%")
      const locationKey = `${item.pos.top}-${item.pos.left}`;
      if (!groups[locationKey]) {
        groups[locationKey] = {
          pos: item.pos,
          items: []
        };
      }
      groups[locationKey].items.push(item);
    });
    return groups;
  }, [mockItems]);

  // 사이드바에 표시할 아이템 필터링
  // 위치가 선택되어 있다면 그 위치 아이템만, 아니면 전체 표시
  const displayItems = selectedLocationKey 
    ? groupedItems[selectedLocationKey].items 
    : mockItems;

  const handleMarkerClick = (key) => {
    setSelectedLocationKey(key);
  };

  const handleReset = () => {
    setSelectedLocationKey(null);
  };

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <Title>
            {selectedLocationKey ? '선택된 지역 상품' : '내 주변 공구'} 
            <ItemCount>
              ({displayItems.length}건)
            </ItemCount>
          </Title>
          {selectedLocationKey && (
            <ResetButton onClick={handleReset}>전체 보기</ResetButton>
          )}
        </SidebarHeader>

        <ListContainer>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <ItemCard 
                key={item.id} 
                $active={false}
              >
                <Thumbnail>
                  <img src={item.image || "https://via.placeholder.com/70"} alt="thumb" />
                </Thumbnail>
                <InfoArea>
                  <ItemTitle>{item.title}</ItemTitle>
                  <PriceRow>
                    <Price>{item.price.toLocaleString()}원</Price>
                    <CountInfo>{item.current}/{item.total}</CountInfo>
                  </PriceRow>
                </InfoArea>
              </ItemCard>
            ))
          ) : (
            <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>상품이 없습니다.</div>
          )}
        </ListContainer>
      </Sidebar>

      <MapArea>
        <MapBackground/>

        <MapControls>
          <ControlGroup>
            <ControlBtn onClick={() => console.log("확대")}><FaPlus /></ControlBtn>
            <ControlBtn onClick={() => console.log("축소")}><FaMinus /></ControlBtn>
          </ControlGroup>
          <ControlGroup>
            <ControlBtn onClick={handleReset} title="전체보기"><FaList /></ControlBtn>
            <ControlBtn onClick={() => console.log("새로고침")}><FaSyncAlt /></ControlBtn>
            <ControlBtn onClick={() => console.log("현위치")}><FaCrosshairs /></ControlBtn>
          </ControlGroup>
        </MapControls>

        {Object.entries(groupedItems).map(([key, group]) => {
          const isGroup = group.items.length > 1; // 2개 이상이면 그룹
          const isActive = selectedLocationKey === key; // 현재 선택된 핀

          return (
            <MarkerContainer 
              key={key} 
              top={group.pos.top} 
              left={group.pos.left}
              $isActive={isActive}
              onClick={() => handleMarkerClick(key)}
            >
              <MarkerPin $isGroup={isGroup}>
                <img src="/images/marker.png" alt="marker" style={{height: "30px"}}/>
              </MarkerPin>
            </MarkerContainer>
          );
        })}
      </MapArea>
    </Container>
  );
};

export default NearbyGroupPurchase;