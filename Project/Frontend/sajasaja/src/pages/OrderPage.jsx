import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [loading, error] = useKakaoLoader({
    appkey: "1182ee2a992f45fb1db2238604970e19",
    libraries: ["services"],
  });

  const receiveMethod = state?.method || 'delivery';
  const isDelivery = receiveMethod === 'delivery';
  const productData = state?.product || {};

  const postId = state?.postId || productData.id;
  const maxAvailable = (productData.goalCount || 0) - (productData.currentCount || 0);

  const [quantity, setQuantity] = useState(state?.quantity || 1);
  const [receiver, setReceiver] = useState('');
  const [phone, setPhone] = useState({ p1: '010', p2: '', p3: '' });

  const [address, setAddress] = useState({ zipCode: '', street: '', detail: '' }); // ✅ FIXED
  const [userAddresses, setUserAddresses] = useState([]); 
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [entranceMethod, setEntranceMethod] = useState('password');
  const [entranceDetail, setEntranceDetail] = useState('');

  // 지도 상태
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [map, setMap] = useState(null);

  const [sellerProfile, setSellerProfile] = useState(null);

  const safePrice = Number(String(productData.price || 0).replace(/[^\d]/g, ''));
  const safeShippingCost = Number(String(productData.shippingCost || 0).replace(/[^\d]/g, ''));
  const totalProductPrice = safePrice * quantity;
  const finalPrice = totalProductPrice + safeShippingCost;


  // ---------------------------------------------------------
  //                 INITIAL FETCH (SAFE VERSION)
  // ---------------------------------------------------------
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
        // 1) 사용자 주소 로드
        const addrResponse = await api.get("/api/mypage/addresses");

        // ✅ FIXED: 응답을 무조건 배열로 강제
        const addresses = Array.isArray(addrResponse?.data?.addresses)
          ? addrResponse.data.addresses
          : [];

        setUserAddresses(addresses);

        // 2) 기본 주소 적용
        const defaultAddr = addresses.find((addr) => addr.isDefault);

        if (defaultAddr) {
          applyAddressToState(defaultAddr);
        } else {
          setReceiver(nickname || "");
        }

        // 3) 주최자 프로필 + 좌표 불러오기
        if (postId) {
          const profileRes = await api.get(`/api/posts/${postId}/profile`);
          const profileData = profileRes.data.profile || profileRes.data;
          setSellerProfile(profileData);

          const postRes = await api.get(`/api/posts/${postId}`);
          const postData = postRes.data.post;

          if (postData.pickupAddress) {
            setLatitude(postData.pickupAddress.latitude);
            setLongitude(postData.pickupAddress.longitude);
          }
        }
      } catch (err) {
        console.error("초기 정보 로드 실패:", err);
      }
    };

    fetchInitData();
  }, [navigate, postId]);


  // ---------------------------------------------------------
  //                       ADDRESS APPLY
  // ---------------------------------------------------------
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
      zipCode: addr.zipCode || "",
      street: addr.street || "",
      detail: addr.detail || "",
    });

    if (addr.entranceAccess) {
      const method = String(addr.entranceAccess).toLowerCase();

      let mapped = "etc";
      if (method === "password") mapped = "password";
      else if (method === "call") mapped = "security";
      else if (method === "free") mapped = "free";

      setEntranceMethod(mapped);
      setEntranceDetail(addr.entranceDetail || "");
    }
  };


  // ---------------------------------------------------------
  //                  ADDRESS SELECT HANDLER
  // ---------------------------------------------------------
  const handleAddressSelect = (e) => {
    const val = e.target.value;

    setSelectedAddressId(val);

    if (val === "new") {
      setReceiver("");
      setPhone({ p1: "010", p2: "", p3: "" });
      setAddress({ zipCode: "", street: "", detail: "" });
      setEntranceMethod("password");
      setEntranceDetail("");
      return;
    }

    const selected = (userAddresses || []).find(
      (addr) => addr.id === Number(val)
    );

    if (selected) applyAddressToState(selected);
  };


  // ---------------------------------------------------------
  //                      QTY CHANGE
  // ---------------------------------------------------------
  const handleQtyChange = (val) => {
    if (val < 1) return;

    if (val > maxAvailable) {
      alert(`구매 가능한 최대 수량은 ${maxAvailable}개 입니다.`);
      return;
    }

    setQuantity(val);
  };


  // ---------------------------------------------------------
  //                      ORDER BUTTON
  // ---------------------------------------------------------
  const handleOrder = () => {
    if (
      isDelivery &&
      (!receiver || !phone.p2 || !phone.p3 || !address.street)
    ) {
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


  // ---------------------------------------------------------
  //                JSX RETURN (map 처리만 수정)
  // ---------------------------------------------------------
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
              alt="주최자 프로필"
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

      {/* 배송 정보 */}
      {isDelivery ? (
        <>
          <Section>
            <SectionTitle>배송정보</SectionTitle>
            <Label>배송지 선택</Label>

            <FormRow>
              <InputArea>
                <StyledSelect
                  onChange={handleAddressSelect}
                  value={selectedAddressId}
                >
                  {(userAddresses || []).map((addr) => (        // ✅ FIXED
                    <option key={addr.id} value={addr.id}>
                      {addr.name || addr.recipient}{" "}
                      {addr.isDefault ? "(기본)" : ""}
                    </option>
                  ))}
                  <option value="new">신규 입력</option>
                </StyledSelect>
              </InputArea>
            </FormRow>

            {/* 받는 사람 */}
            <Label>
              받는 분 <RequiredDot>•</RequiredDot>
            </Label>
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

            {/* 연락처 */}
            <Label>
              연락처 <RequiredDot>•</RequiredDot>
            </Label>
            <FormRow>
              <InputArea>
                <PhoneGroup>
                  <StyledInput
                    value={phone.p1}
                    onChange={(e) =>
                      setPhone({ ...phone, p1: e.target.value })
                    }
                  />
                  <span>-</span>
                  <StyledInput
                    value={phone.p2}
                    onChange={(e) =>
                      setPhone({ ...phone, p2: e.target.value })
                    }
                  />
                  <span>-</span>
                  <StyledInput
                    value={phone.p3}
                    onChange={(e) =>
                      setPhone({ ...phone, p3: e.target.value })
                    }
                  />
                </PhoneGroup>
              </InputArea>
            </FormRow>

            {/* 주소 */}
            <Label>
              주소 <RequiredDot>•</RequiredDot>
            </Label>

            <FormRow>
              <InputArea>
                <StyledInput
                  type="text"
                  value={address.zipCode}
                  readOnly
                  placeholder="우편번호"
                  style={{ width: "100px" }}
                />

                {address.street ? (
                  <AddressDisplayBox>
                    <div>
                      <span className="tag">도로명</span>
                      <span className="text">{address.street}</span>
                    </div>
                  </AddressDisplayBox>
                ) : (
                  <div
                    style={{
                      padding: "10px",
                      color: "#999",
                      fontSize: "12px",
                    }}
                  >
                    주소를 선택하거나 입력해주세요.
                  </div>
                )}

                <StyledInput
                  type="text"
                  placeholder="상세주소 입력"
                  value={address.detail}
                  onChange={(e) =>
                    setAddress({ ...address, detail: e.target.value })
                  }
                />
              </InputArea>
            </FormRow>
          </Section>

          {/* 출입방법 */}
          <Section>
            <SectionTitle>배송 요청사항</SectionTitle>
            <Label>
              공동현관 출입방법 <RequiredDot>•</RequiredDot>
            </Label>

            <FormRow>
              <InputArea>
                <RadioGroup>
                  {["password", "security", "free", "etc"].map((method) => (
                    <RadioLabel key={method}>
                      <input
                        type="radio"
                        name="entrance"
                        checked={entranceMethod === method}
                        onChange={() => setEntranceMethod(method)}
                      />
                      {method === "password"
                        ? "비밀번호"
                        : method === "security"
                        ? "경비실호출"
                        : method === "free"
                        ? "자유출입"
                        : "기타"}
                    </RadioLabel>
                  ))}
                </RadioGroup>

                <StyledInput
                  type="text"
                  placeholder={
                    entranceMethod === "password"
                      ? "공동현관 비밀번호 입력"
                      : "상세 내용 입력"
                  }
                  value={entranceDetail}
                  onChange={(e) => setEntranceDetail(e.target.value)}
                  disabled={entranceMethod === "free"}
                />
              </InputArea>
            </FormRow>
          </Section>
        </>
      ) : (
        // 직접수령 (map)
        <Section>
          <SectionHeader>수령장소</SectionHeader>

          {loading ? (
            <div>지도를 불러오는 중...</div>
          ) : error ? (
            <div>지도 로딩 실패</div>
          ) : (
            <MapContainer>
              <Map
                center={{ lat: latitude, lng: longitude }}
                style={{ width: "100%", height: "100%" }}
                level={3}
                onCreate={setMap}
              >
                <CustomOverlayMap
                  position={{ lat: latitude, lng: longitude }}
                  yAnchor={1}
                  zIndex={999}
                >
                  <MarkerPin>
                    <img
                      src="/images/marker.png"
                      alt="marker"
                      style={{ height: "30px" }}
                    />
                  </MarkerPin>
                </CustomOverlayMap>
              </Map>
            </MapContainer>
          )}
        </Section>
      )}

      {/* 주문 상품 */}
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
                src={productData.image}
                alt="상품"
                onError={(e) => (e.target.src = "/images/sajasaja.png")}
              />

              <div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    marginBottom: "6px",
                    color: "#000",
                  }}
                >
                  {productData.title}
                </div>
                <div style={{ fontSize: "13px", color: "#666" }}>
                  {productData.price?.toLocaleString()} 원
                </div>
              </div>
            </ColInfo>

            <ColQty>
              <MiniStepper>
                <button
                  onClick={() => handleQtyChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>

                <input type="text" value={quantity} readOnly />

                <button
                  onClick={() => handleQtyChange(quantity + 1)}
                  disabled={maxAvailable > 0 ? quantity >= maxAvailable : false}
                >
                  +
                </button>
              </MiniStepper>
            </ColQty>

            <ColPrice>{totalProductPrice.toLocaleString()} 원</ColPrice>
          </TableRow>
        </ProductTable>
      </Section>

      {/* 결제 정보 */}
      <Section>
        <SectionTitle>결제 정보</SectionTitle>

        <PaymentInfoBox>
          <PaymentRow>
            <span>상품금액</span>
            <span className="price">
              {totalProductPrice.toLocaleString()} 원
            </span>
          </PaymentRow>

          <PaymentRow>
            <span>배송비</span>
            <span className="price">
              {productData.shippingCost?.toLocaleString()} 원
            </span>
          </PaymentRow>

          <PaymentRow className="total">
            <span>최종 결제 금액</span>
            <span className="total-price">
              {finalPrice.toLocaleString()} 원
            </span>
          </PaymentRow>
        </PaymentInfoBox>
      </Section>

      <OrderButton onClick={handleOrder}>주문하기</OrderButton>
    </Container>
  );
};

export default OrderPage;