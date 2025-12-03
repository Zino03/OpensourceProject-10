import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate 추가
import { FaPlus, FaMinus, FaSyncAlt } from "react-icons/fa";
import { Map, CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk";
import { api, BASE_URL } from "../assets/setIntercepter";

const Container = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  height: calc(100vh - 55px);
`;

const Sidebar = styled.div`
  width: 400px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    display: none;
  }
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
  margin-left: 8px;
`;

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const CardWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  margin: 10px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #ff7e00;
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
  gap: 8px;
`;

const MetaLabel = styled.span`
  font-weight: 600;
  color: #888;
`;

const CardPrice = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #ff7e00;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 16px 0;
`;

const CardAddress = styled.div`
  font-size: 12px;
  color: #555;
  font-weight: 500;
  word-break: keep-all;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MapArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #e8e8e8;
`;

const MarkerPin = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: ${(props) => (props.$isActive ? 999 : 1)};

  img {
    height: ${(props) => (props.$isActive ? "40px" : "30px")};
    transition: all 0.2s ease;
    filter: ${(props) =>
      props.$isActive ? "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" : "none"};
  }
`;

const MapControls = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
`;

const ControlGroup = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f9f9f9;
    color: #333;
  }
  &:active {
    background-color: #eee;
  }
`;

const RefreshBtn = styled(ControlBtn)`
  border-radius: 50%;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  width: 40px;
  height: 40px;
`;

const NoResult = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

const NearbyGroupPurchase = () => {
  const navigate = useNavigate(); // ✅ 네비게이션 훅 사용

  const [loading, error] = useKakaoLoader({
    appkey: "1182ee2a992f45fb1db2238604970e19",
    libraries: ["clusterer", "drawing", "services"],
  });

  const [map, setMap] = useState(null);
  const [posts, setPosts] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [selectedLocationKey, setSelectedLocationKey] = useState(null);

  const groupedItems = useMemo(() => {
    const groups = {};
    visibleItems.forEach((item) => {
      if (!item.lat || !item.lng) return;

      const locationKey = `${item.lat}-${item.lng}`;
      if (!groups[locationKey]) {
        groups[locationKey] = {
          lat: item.lat,
          lng: item.lng,
          items: [],
        };
      }
      groups[locationKey].items.push(item);
    });
    return groups;
  }, [visibleItems]);

  const displayItems = selectedLocationKey
    ? groupedItems[selectedLocationKey]?.items || []
    : visibleItems;

  const handleMarkerClick = (key) => {
    setSelectedLocationKey(key === selectedLocationKey ? null : key);
  };

  const fetchPosts = async (lat, lng) => {
    try {
      const response = await api.get("/api/posts/map", {
        params: {
          lat: lat,
          lon: lng,
          page: 0,
          size: 50,
        },
      });

      console.log("Map Data:", response.data);

      const rawData = response.data.content || response.data || [];

      const mappedData = rawData.map((post) => {
        const addressObj = post.address || {};

        return {
          id: post.id,
          title: post.title,
          writer: post.nickname || "익명",
          price: post.price,
          current: post.currentQuantity,
          total: post.quantity,
          date: post.endAt ? post.endAt.substring(0, 10) : "-",
          address: addressObj.street || "주소 정보 없음",
          lat: addressObj.latitude,
          lng: addressObj.longitude,
          image: post.image
            ? post.image.startsWith("http")
              ? post.image
              : `${BASE_URL}${post.image}`
            : null,
        };
      });

      setPosts(mappedData);

      if (map) {
        filterVisibleItems(map, mappedData);
      } else {
        setVisibleItems(mappedData);
      }
    } catch (err) {
      console.error("지도 데이터 조회 실패:", err);
    }
  };

  const filterVisibleItems = (mapInstance, allPosts) => {
    if (!mapInstance) return;

    const bounds = mapInstance.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const newVisibleItems = allPosts.filter((item) => {
      if (!item.lat || !item.lng) return false;

      return (
        item.lat >= sw.getLat() &&
        item.lat <= ne.getLat() &&
        item.lng >= sw.getLng() &&
        item.lng <= ne.getLng()
      );
    });

    setVisibleItems(newVisibleItems);
    setSelectedLocationKey(null);
  };

  useEffect(() => {
    if (map) {
      const center = map.getCenter();
      fetchPosts(center.getLat(), center.getLng());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const handleRefresh = () => {
    if (!map) return;
    const center = map.getCenter();
    fetchPosts(center.getLat(), center.getLng());
  };

  const handleZoomIn = () => map && map.setLevel(map.getLevel() - 1);
  const handleZoomOut = () => map && map.setLevel(map.getLevel() + 1);

  if (loading)
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        지도 로딩 중...
      </div>
    );
  if (error) return <div>지도를 불러오는데 실패했습니다.</div>;

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <Title>
            {selectedLocationKey ? "선택된 지역" : "주변 공구 목록"}
            <ItemCount>({displayItems.length})</ItemCount>
          </Title>
        </SidebarHeader>

        <ListContainer>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <CardWrapper
                key={item.id}
                // ✅ 클릭 시 상세 페이지로 이동
                onClick={() => navigate(`/products/${item.id}`)}
              >
                <CardTop>
                  <CardImage>
                    <img
                      src={item.image || "/images/sajasaja.png"}
                      alt="상품"
                      onError={(e) => (e.target.src = "/images/sajasaja.png")}
                    />
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
                          <span>
                            {item.current} / {item.total}
                          </span>
                        </MetaRow>
                        <MetaRow>
                          <MetaLabel>마감</MetaLabel>
                          <span>{item.date}</span>
                        </MetaRow>
                      </MetaTable>
                      <CardPrice>{item.price.toLocaleString()}원</CardPrice>
                    </InfoBottom>
                  </CardInfo>
                </CardTop>

                <Divider />

                <CardAddress>
                  <img
                    src="/images/marker.png"
                    alt="pin"
                    style={{ width: "12px" }}
                  />
                  {item.address}
                </CardAddress>
              </CardWrapper>
            ))
          ) : (
            <NoResult>
              {selectedLocationKey
                ? "선택한 위치에 공구가 없습니다."
                : "현재 지도 영역에 공구가 없습니다.\n지도를 움직이거나 '이 위치에서 검색'을 눌러보세요."}
            </NoResult>
          )}
        </ListContainer>
      </Sidebar>

      <MapArea>
        <Map
          center={{ lat: 36.628583, lng: 127.457583 }}
          style={{ width: "100%", height: "100%" }}
          level={4}
          onCreate={setMap}
          onDragEnd={(map) => filterVisibleItems(map, posts)}
          onZoomChanged={(map) => filterVisibleItems(map, posts)}
        >
          {Object.entries(groupedItems).map(([key, group]) => {
            const isActive = selectedLocationKey === key;
            return (
              <CustomOverlayMap
                key={key}
                position={{ lat: group.lat, lng: group.lng }}
                yAnchor={1}
                zIndex={isActive ? 999 : 1}
              >
                <MarkerPin
                  $isActive={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkerClick(key);
                  }}
                >
                  <img src="/images/marker.png" alt="marker" />
                  {group.items.length > 1 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        background: "red",
                        color: "white",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        fontSize: "11px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {group.items.length}
                    </span>
                  )}
                </MarkerPin>
              </CustomOverlayMap>
            );
          })}
        </Map>

        <MapControls>
          <ControlGroup>
            <ControlBtn onClick={handleZoomIn}>
              <FaPlus />
            </ControlBtn>
            <ControlBtn onClick={handleZoomOut}>
              <FaMinus />
            </ControlBtn>
          </ControlGroup>
          <RefreshBtn onClick={handleRefresh}>
            <FaSyncAlt />
          </RefreshBtn>
        </MapControls>
      </MapArea>
    </Container>
  );
};

export default NearbyGroupPurchase;
