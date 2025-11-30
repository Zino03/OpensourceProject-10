import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaMinus, FaSyncAlt } from "react-icons/fa";
import { Map,  CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk";

const Container = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  height: calc(100vh - 55px);
`;

// 사이드바 
const Sidebar = styled.div`
  width: 400px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
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

const ItemCount = styled.span`
  font-size: 12px;
  color: #888;
  margin-left: 8px
`

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const CardWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 12px;  
  padding: 20px;
  margin: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
`;

const CardTop = styled.div`
  display: flex;
  gap: 16px;
`;

const CardImage = styled.div`
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InfoHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin: 0;  
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardWriter = styled.span`
  font-size: 12px;
  color: #666;
`;

const InfoBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
`;

const MetaTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MetaLabel = styled.span`
  font-weight: 600;
  width: 36px;
`;

const CardPrice = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

// 구분선
const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 16px 0;
`;

// 하단 주소 영역
const CardAddress = styled.div`
  font-size: 13px;
  font-weight: 500;
  word-break: keep-all; 
`;

// 지도 영역
const MapArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #e8e8e8;
`;

// 실제 마커 이미지/아이콘
const MarkerPin = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .img { height: 30px }
`;

// 지도 컨트롤 컨테이너 (우측 상단)
const MapControls = styled.div`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
`;

const ControlGroup = styled.div`
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const ControlBtn = styled.button`
  width: 40px;
  height: 40px;
  background-color: #fff;
  border: none;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #555;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  position: relative;

  &:last-child { border-bottom: none; }
  &:hover { background-color: #f5f5f5; color: #333; }
  &:active { background-color: #e0e0e0; }

  &::after {
    content: attr(data-label);

    position: absolute;
    top: 50%;
    right: 120%; 
    transform: translateY(-50%);
    
    background-color: rgba(60, 60, 60, 0.5); 
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    padding: 6px 10px;
    border-radius: 20px;
    white-space: nowrap;
    pointer-events: none;
    
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
    visibility: visible;
  }
`;

const NoResult = styled.div`
  padding: 20px;
  text-align: center;
  color:'#999;
`

const NearbyGroupPurchase = () => {
  // 지도
  const [loading, error] = useKakaoLoader({
    appkey: '1182ee2a992f45fb1db2238604970e19',
    libraries: ["clusterer", "drawing", "services"],
  });

  const [selectedLocationKey, setSelectedLocationKey] = useState(null);
  const [map, setMap] = useState(null);

  // 더미 데이터
  const mockItems = [
    { id: 1, title: '애니 피욘크 미니 프레첼 150g', writer: '사자사자', price: 890, current: 87, total: 100, date: '2025-11-11', address: '충북 청주시 서원구 충대로 1 충북대학교 전자정보대학3관\n양성재 1층', lat: 36.628583, lng: 127.457583 },
    { id: 2, title: '제주 감귤 10kg 공구', writer: '사자사자', price: 890, current: 87, total: 100, date: '2025-11-11', address: '충북 청주시 서원구 충대로 1 충북대학교 전자정보대학3관\n양성재 1층', lat: 36.628583, lng: 127.457583 }, // 같은 위치
    { id: 3, title: '코스트코 베이글 1+1', writer: '사자사자', price: 890, current: 87, total: 100, date: '2025-11-11', address: '충북대 중문', lat: 36.629583, lng: 127.459583 },
    { id: 4, title: '대파 한 단 나눔 공구', writer: '사자사자', price: 890, current: 87, total: 100, date: '2025-11-11', address: '충북대 정문', lat: 36.632583, lng: 127.460583 },
    { id: 5, title: '생수 2L 6개입', writer: '사자사자', price: 890, current: 87, total: 100, date: '2025-11-11', address: '사창동 주민센터', lat: 36.634583, lng: 127.458583 },
    { id: 6, title: '고구마 5kg', writer: '사자사자', price: 890, current: 87, total: 100, date: '2025-11-11', address: '청주체육관', lat: 36.638583, lng: 127.475583 },
    { id: 7, title: '짱 멋진 가방', writer: '사자사자', price: 890, current: 87, total: 100, date: '2025-11-11', address: '충북대 후문', lat: 36.625583, lng: 127.455583 },
];

  // 현재 지도에 보이는 핀들
  const [visibleItems, setVisibleItems] = useState(mockItems);

  // 데이터를 위치 기준으로 그룹화
  const groupedItems = useMemo(() => {
    const groups = {};
    visibleItems.forEach(item => {
      // 위치를 고유 키로 생성
      const locationKey = `${item.lat}-${item.lng}`;
      if (!groups[locationKey]) {
        groups[locationKey] = {
          lat: item.lat,
          lng: item.lng,
          items: []
        };
      }
      groups[locationKey].items.push(item);
    });
    return groups;
  }, [visibleItems]);

  // 사이드바에 표시할 아이템 필터링
  // 위치가 선택되어 있다면 그 위치 아이템만, 아니면 전체 표시
  const displayItems = selectedLocationKey 
    ? groupedItems[selectedLocationKey].items || []
    : visibleItems;

  const handleMarkerClick = (key) => {
    setSelectedLocationKey(key);
  };

  useEffect(() => {
    if (map) handleRefresh();
  }, [map]);

  const handleZoomIn = () => map && map.setLevel(map.getLevel() - 1);
  const handleZoomOut = () => map && map.setLevel(map.getLevel() + 1);
  const handleRefresh = () => {
    if (!map) return;

    // 현재 지도의 영역(Bounds) 가져오기
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest(); // 남서쪽 좌표
    const ne = bounds.getNorthEast(); // 북동쪽 좌표

    // 영역 내에 있는 데이터만 필터링
    const newVisibleItems = mockItems.filter(item => {
      return (
        item.lat >= sw.getLat() && item.lat <= ne.getLat() &&
        item.lng >= sw.getLng() && item.lng <= ne.getLng()
      );
    });

    setVisibleItems(newVisibleItems);
    setSelectedLocationKey(null); // 필터링 후 선택 초기화
  };

  if (loading) return <div style={{width: "100%", height: "100vh", display:"flex", justifyContent:"center", alignItems:"center"}}>지도 로딩 중...</div>;
  if (error) return <div>지도를 불러오는데 실패했습니다.</div>;

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
        </SidebarHeader>

        <ListContainer>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <CardWrapper key={item.id} onClick={() => console.log('카드 클릭', item.id)}>
                <CardTop>
                  <CardImage>
                    <img src={item.image || "https://via.placeholder.com/90"} alt="상품" />
                  </CardImage>
                  
                  <CardInfo>
                    <InfoHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardWriter>{item.writer}</CardWriter>
                    </InfoHeader>
                    
                    <InfoBottom>
                      <MetaTable>
                        <MetaRow>
                          <MetaLabel>수량</MetaLabel>
                          <span>{item.current}/{item.total}</span>
                        </MetaRow>
                        <MetaRow>
                          <MetaLabel>기간</MetaLabel>
                          <span>{item.date}</span>
                        </MetaRow>
                      </MetaTable>
                      <CardPrice>{item.price.toLocaleString()} 원</CardPrice>
                    </InfoBottom>
                  </CardInfo>
                </CardTop>

                <Divider />

                <CardAddress>
                  {item.address.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </CardAddress>

              </CardWrapper>
            ))
          ) : (
            <NoResult>상품이 없습니다.</NoResult>
          )}
        </ListContainer>
      </Sidebar>

      <MapArea>
        <Map
          center={{ lat: 36.628583, lng: 127.457583 }} // 초기 중심 좌표
          style={{ width: "100%", height: "100%" }}
          level={3} // 확대 레벨
          onCreate={setMap} // 지도 객체 저장 
        >
          {Object.entries(groupedItems).map(([key, group]) => {
            const isActive = selectedLocationKey === key; 

            return (
              <CustomOverlayMap
                key={key}
                position={{ lat: group.lat, lng: group.lng }}
                yAnchor={1} // 마커의 아래쪽 끝이 좌표에 오도록 설정
              >
                <MarkerPin 
                  $isActive={isActive}
                  onClick={() => handleMarkerClick(key)}
                >
                  <img src="/images/marker.png" alt="marker" style={{height: "30px"}} />
                </MarkerPin>
              </CustomOverlayMap>
            );
          })}
        </Map>

        <MapControls>
          <ControlGroup>
            <ControlBtn data-label="확대" onClick={handleZoomIn}><FaPlus /></ControlBtn>
            <ControlBtn data-label="축소" onClick={handleZoomOut}><FaMinus /></ControlBtn>
          </ControlGroup>
          <ControlGroup>
            <ControlBtn data-label="새로고침" onClick={handleRefresh}><FaSyncAlt /></ControlBtn>
          </ControlGroup>
        </MapControls>
      </MapArea>
    </Container>
  );
};

export default NearbyGroupPurchase;