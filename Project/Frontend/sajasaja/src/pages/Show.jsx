// 파일명: OrderPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { api, setInterceptor } from "../assets/setIntercepter";

// --- Styled Components (기존과 동일 유지) ---
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px 100px;
  color: #333;
`;
const Section = styled.section`
  margin-bottom: 40px;
`;
const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
`;
const MapContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: #eee;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid #ddd;
`;
const WarningText = styled.p`
  color: #ff7e00;
  font-size: 12px;
  text-align: right;
  margin-top: 8px;
  font-weight: 500;
`;
const FormRow = styled.div`
  display: flex;
  margin-bottom: 20px;
`;
const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
`;
const RequiredDot = styled.span`
  color: #ff3b30;
  margin-left: 4px;
`;
const InputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  box-sizing: border-box;
  outline: none;
  &::placeholder { color: #aaa; }
  &:read-only { background-color: #f4f4f4; cursor: default; border: 1px solid #eee; }
`;
const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  outline: none;
  cursor: pointer;
  color: #333;
`;
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ff7e00;
  color: white;
  font-size: 10px;
  padding: 0 8px;
  border-radius: 6px;
  margin-left: 8px;
  font-weight: 500;
  height: 22px;
`;
const PhoneGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  input { width: 80px; text-align: center; }
`;
const AddressDisplayBox = styled.div`
  background-color: #f4f4f4;
  border: none;
  border-radius: 6px;
  padding: 16px 20px;
  font-size: 12px;
  div { display: flex; gap: 12px; }
  .tag { color: #888; width: 40px; font-weight: 500; flex-shrink: 0; }
`;
const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  align-items: center;
  flex-wrap: wrap;
`;
const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  input { margin: 0; }
`;
const ProductTable = styled.div`
  width: 100%;
  border-top: 1px solid #333;
  border-bottom: 1px solid #ddd;
`;
const TableHeaderComponent = styled.div`
  display: flex;
  background-color: #fff;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;
const TableRow = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 0;
  font-size: 14px;
`;
const ColInfo = styled.div`
  flex: 5;
  padding-left: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`;
const ColQty = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
`;
const ColPrice = styled.div`
  flex: 1;
  text-align: center;
  font-weight: 500;
`;
const ProductImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid #eee;
  border-radius: 6px;
`;
const MiniStepper = styled.div`
  display: flex;
  border: 1px solid #ddd;
  button {
    width: 28px; height: 28px; border: none; background: #fff; cursor: pointer;
    &:hover { background: #f9f9f9; }
    &:disabled { color: #ccc; cursor: not-allowed; }
  }
  input {
    width: 34px; height: 28px; border: none;
    border-left: 1px solid #ddd; border-right: 1px solid #ddd;
    text-align: center; font-size: 13px; color: #333;
  }
`;
const PaymentInfoBox = styled.div`
  border-top: 1px solid #333;
  border-bottom: 1px solid #ddd;
  padding: 24px 0;
`;
const PaymentRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  &:last-child { margin-bottom: 0; }
  &.total {
    margin-top: 24px; padding-top: 24px; border-top: 1px solid #eee;
    font-size: 16px; font-weight: 600; align-items: center;
  }
  .price { font-weight: 500; }
  .total-price { font-size: 20px; color: #ff7e00; font-weight: 700; }
`;
const OrderButton = styled.button`
  width: 150px; background-color: #000; color: #fff; border: none;
  padding: 16px 0; font-size: 14px; font-weight: 500; border-radius: 6px;
  cursor: pointer; display: block; margin: 20px auto 0;
  &:hover { opacity: 0.9; }
`;
const HostBox = styled.div`
  display: flex; align-items: center; gap: 16px; padding: 14px 16px;
  border-radius: 8px; border: 1px solid #eee; background-color: #fafafa;
`;
const HostAvatar = styled.img`
  width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd;
`;
const HostInfo = styled.div`
  display: flex; flex-direction: column; gap: 4px; font-size: 13px;
`;

const OrderPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // 1. 카카오맵 로더 (앱키 확인 필요)
  const [loadingMap, errorMap] = useKakaoLoader({
    appkey: "1182ee2a992f45fb1db2238604970e19", // 본인의 JavaScript 키가 맞는지 확인
    libraries: ["services"],
  });

  // 2. productData를 State로 관리 (새로고침 대비)
  // state가 없으면 초기값 null
  const [productData, setProductData] = useState(state?.product || null);

  const receiveMethod = state?.method || "delivery";
  const isDelivery = receiveMethod === "delivery";
  
  // postId 추출 (state에 없으면 productData에서 시도, 그래도 없으면 null)
  const postId = state?.postId || productData?.id || null;

  // 수량 및 사용자 정보 State
  const [quantity, setQuantity] = useState(state?.quantity || 1);
  const [receiver, setReceiver] = useState("");
  const [phone, setPhone] = useState({ p1: "010", p2: "", p3: "" });
  const [address, setAddress] = useState({ zipCode: "", street: "", detail: "" });
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [entranceMethod, setEntranceMethod] = useState("password");
  const [entranceDetail, setEntranceDetail] = useState("");
  const [sellerProfile, setSellerProfile] = useState(null);

  // 가격 계산 (안전하게 처리)
  const safePrice = productData ? Number(String(productData.price || 0).replace(/[^\d]/g, "")) : 0;
  const safeShippingCost = productData ? Number(String(productData.shippingCost || 0).replace(/[^\d]/g, "")) : 0;
  const maxAvailable = productData ? (productData.goalCount || 0) - (productData.currentCount || 0) : 0;
  
  const totalProductPrice = safePrice * quantity;
  const finalPrice = totalProductPrice + safeShippingCost;

  useEffect(() => {
    const fetchInitData = async () => {
      const token = localStorage.getItem("accessToken");
      const nickname = localStorage.getItem("userNickname");

      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      setInterceptor(token);

      try {
        // [추가] productData가 없다면(새로고침 등) 서버에서 다시 불러오기
        if (!productData && postId) {
            try {
                // 🔥 중요: 게시글 상세 조회 API (본인 서버 주소에 맞게 수정)
                const postRes = await api.get(`/api/posts/${postId}`);
                setProductData(postRes.data); 
            } catch (err) {
                console.error("게시글 정보 로드 실패:", err);
                alert("상품 정보를 불러올 수 없습니다.");
                navigate(-1);
                return;
            }
        }

        // 1) 사용자 주소 목록
        const addrResponse = await api.get("/api/mypage/addresses");
        const addresses = addrResponse.data.addresses || [];
        setUserAddresses(addresses);

        const defaultAddr = addresses.find((addr) => addr.isDefault);
        if (defaultAddr) {
          applyAddressToState(defaultAddr);
        } else {
          setReceiver(nickname || "");
        }

        // 2) 주최자 프로필
        if (postId) {
          const profileRes = await api.get(`/api/posts/${postId}/profile`);
          const profileData = profileRes.data.profile || profileRes.data;
          setSellerProfile(profileData);
        }
      } catch (error) {
        console.error("초기 정보 로드 실패:", error);
      }
    };

    fetchInitData();
  }, [navigate, postId, productData]); // productData 의존성 추가

  const applyAddressToState = (addr) => {
    setSelectedAddressId(addr.id);
    setReceiver(addr.recipient || "");
    if (addr.phone) {
      const parts = addr.phone.split("-");
      setPhone({
        p1: parts[0] || "010",
        p2: parts[1] || "",
        p3: parts[2] || "",
      });
    }
    setAddress({
      zipCode: addr.zipCode,
      street: addr.street,
      detail: addr.detail,
    });
    if (addr.entranceAccess) {
      const method = String(addr.entranceAccess).toLowerCase();
      let mappedMethod = "etc";
      if (method === "password") mappedMethod = "password";
      else if (method === "call") mappedMethod = "security";
      else if (method === "free") mappedMethod = "free";
      setEntranceMethod(mappedMethod);
      setEntranceDetail(addr.entranceDetail || "");
    }
  };

  const handleAddressSelect = (e) => {
    const val = e.target.value;
    setSelectedAddressId(val);
    if (val === "new") {
      setReceiver("");
      setPhone({ p1: "010", p2: "", p3: "" });
      setAddress({ zipCode: "", street: "", detail: "" });
      setEntranceMethod("password");
      setEntranceDetail("");
    } else {
      const selected = userAddresses.find((addr) => addr.id === Number(val));
      if (selected) applyAddressToState(selected);
    }
  };

  const handleQtyChange = (val) => {
    if (val < 1) return;
    if (val > maxAvailable) {
      alert(`구매 가능한 최대 수량은 ${maxAvailable}개 입니다.`);
      return;
    }
    setQuantity(val);
  };

  const handleOrder = () => {
    if (isDelivery && (!receiver || !phone.p2 || !phone.p3 || !address.street)) {
      alert("배송 정보를 모두 입력해주세요.");
      return;
    }

    navigate("/payment", {
      state: {
        product: productData,
        postId: postId,
        quantity: quantity,
        totalPrice: finalPrice,
        deliveryInfo: isDelivery
          ? {
              id: selectedAddressId === "new" ? null : selectedAddressId,
              receiver,
              phone: `${phone.p1}-${phone.p2}-${phone.p3}`,
              address: address,
              entrance: { method: entranceMethod, detail: entranceDetail },
            }
          : null,
        receiveMethod: receiveMethod,
      },
    });
  };

  // productData가 로딩되지 않았으면 로딩 표시
  if (!productData && !loadingMap) return <Container>상품 정보를 불러오는 중...</Container>;

  return (
    <Container>
      {/* 주최자 정보 */}
      {sellerProfile && (
        <Section>
          <SectionTitle>
            주최자 정보 <Badge>공동구매 주최자</Badge>
          </SectionTitle>
          <HostBox>
            <HostAvatar
              src={sellerProfile.profileImg || "/images/profile.png"}
              onError={(e) => (e.target.src = "/images/profile.png")}
            />
            <HostInfo>
              <div style={{ fontWeight: 600 }}>
                {sellerProfile.nickname || sellerProfile.name}
              </div>
              <div style={{ color: "#666" }}>
                매너 점수: <b>{sellerProfile.mannerScore ?? 0}</b>점
              </div>
              <div style={{ color: "#999", fontSize: "12px" }}>
                진행 중인 공구: {sellerProfile.activePosts?.length || 0}개
              </div>
            </HostInfo>
          </HostBox>
        </Section>
      )}

      {/* 배송/수령 선택에 따른 화면 */}
      {isDelivery ? (
        <>
          <Section>
            <SectionTitle>배송정보</SectionTitle>
            <Label>배송지 선택</Label>
            <FormRow>
              <InputArea>
                <StyledSelect onChange={handleAddressSelect} value={selectedAddressId}>
                  {userAddresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.name || addr.recipient} {addr.isDefault ? "(기본)" : ""}
                    </option>
                  ))}
                  <option value="new">신규 입력</option>
                </StyledSelect>
              </InputArea>
            </FormRow>
            {/* ... (입력 폼들은 기존 코드 유지, 생략 없이 사용하세요) ... */}
            {/* 여기는 위와 동일하게 입력 폼 유지하면 됩니다. 공간상 생략합니다. */}
             <Label>받는 분 <RequiredDot>•</RequiredDot></Label>
            <FormRow>
              <InputArea>
                <StyledInput
                  type="text"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </InputArea>
            </FormRow>

            <Label>연락처 <RequiredDot>•</RequiredDot></Label>
            <FormRow>
                <InputArea>
                <PhoneGroup>
                    <StyledInput value={phone.p1} onChange={(e) => setPhone({ ...phone, p1: e.target.value })} />
                    <span>-</span>
                    <StyledInput value={phone.p2} onChange={(e) => setPhone({ ...phone, p2: e.target.value })} />
                    <span>-</span>
                    <StyledInput value={phone.p3} onChange={(e) => setPhone({ ...phone, p3: e.target.value })} />
                </PhoneGroup>
                </InputArea>
            </FormRow>

            <Label>주소 <RequiredDot>•</RequiredDot></Label>
            <FormRow>
                <InputArea>
                <StyledInput type="text" value={address.zipCode} readOnly placeholder="우편번호" style={{ width: "100px" }} />
                {address.street ? (
                    <AddressDisplayBox>
                    <div><span className="tag">도로명</span><span className="text">{address.street}</span></div>
                    </AddressDisplayBox>
                ) : (
                    <div style={{ padding: "10px", color: "#999", fontSize: "12px" }}>주소를 선택하거나 입력해주세요.</div>
                )}
                <StyledInput
                    type="text"
                    placeholder="상세주소 입력"
                    value={address.detail}
                    onChange={(e) => setAddress({ ...address, detail: e.target.value })}
                />
                </InputArea>
            </FormRow>
          </Section>
          {/* 배송 요청사항 섹션 등... */}
        </>
      ) : (
        <Section>
          <SectionTitle>수령 장소</SectionTitle>
          <MapContainer>
            {loadingMap ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                지도 로딩 중...
              </div>
            ) : errorMap ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "red" }}>
                지도 에러 (API Key 확인)
              </div>
            ) : (
                /* productData가 있을 때만 렌더링 */
              productData && (
                <Map
                  center={{
                    lat: parseFloat(productData.latitude || 36.628583),
                    lng: parseFloat(productData.longitude || 127.457583),
                  }}
                  style={{ width: "100%", height: "100%" }}
                  level={3}
                >
                  <MapMarker
                    position={{
                      lat: parseFloat(productData.latitude || 36.628583),
                      lng: parseFloat(productData.longitude || 127.457583),
                    }}
                  >
                    <div style={{ padding: "5px", color: "#000", fontSize: "12px" }}>
                      수령 장소
                    </div>
                  </MapMarker>
                </Map>
              )
            )}
          </MapContainer>
          <WarningText>수령장소를 확인해주세요!</WarningText>
        </Section>
      )}

      {/* 주문 상품 섹션 */}
      {productData && (
        <Section>
            <SectionTitle>주문 상품</SectionTitle>
            <ProductTable>
            <TableHeaderComponent>
                <div style={{ flex: 5 }}>상품정보</div>
                <div style={{ flex: 1 }}>수량</div>
                <div style={{ flex: 1 }}>총가격</div>
            </TableHeaderComponent>
            <TableRow>
                <ColInfo>
                <ProductImg
                    src={productData.image} // ⚠️ 이미지 URL 확인 필수
                    alt="상품"
                    onError={(e) => (e.target.src = "/images/sajasaja.png")}
                />
                <div>
                    <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "6px", color: "#000" }}>
                    {productData.title}
                    </div>
                    <div style={{ fontSize: "13px", color: "#666" }}>
                    {Number(productData.price || 0).toLocaleString()} 원
                    </div>
                </div>
                </ColInfo>
                <ColQty>
                <MiniStepper>
                    <button onClick={() => handleQtyChange(quantity - 1)} disabled={quantity <= 1}>-</button>
                    <input type="text" value={quantity} readOnly />
                    <button onClick={() => handleQtyChange(quantity + 1)} disabled={maxAvailable > 0 ? quantity >= maxAvailable : false}>+</button>
                </MiniStepper>
                </ColQty>
                <ColPrice>{totalProductPrice.toLocaleString()} 원</ColPrice>
            </TableRow>
            </ProductTable>
        </Section>
      )}

      {/* 결제 정보 섹션 */}
      <Section>
        <SectionTitle>결제 정보</SectionTitle>
        <PaymentInfoBox>
          <PaymentRow>
            <span>상품금액</span>
            <span className="price">{totalProductPrice.toLocaleString()} 원</span>
          </PaymentRow>
          <PaymentRow>
            <span>배송비</span>
            <span className="price">{safeShippingCost.toLocaleString()} 원</span>
          </PaymentRow>
          <PaymentRow className="total">
            <span>최종 결제 금액</span>
            <span className="total-price">{finalPrice.toLocaleString()} 원</span>
          </PaymentRow>
        </PaymentInfoBox>
      </Section>

      <OrderButton onClick={handleOrder}>주문하기</OrderButton>
    </Container>
  );
};

export default OrderPage;