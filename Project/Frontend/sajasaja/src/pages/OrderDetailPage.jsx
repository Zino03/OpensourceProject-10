import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { api, BASE_URL } from "../assets/setIntercepter";

// 단계별 상태 정의 (화면 표시용)
const STATUS_STEPS = [
  { step: 1, label: "주문접수" }, // DB Status 0
  { step: 2, label: "결제완료" }, // DB Status 1
  { step: 3, label: "상품준비" }, // DB Status 2
  { step: 4, label: "배송중" },   // DB Status 3
  { step: 5, label: "배송완료" }, // DB Status 4 
  { step: 6, label: "구매확정" }, // DB Status 5
];

// --- Styled Components ---
const Page = styled.div`
  width: 100%;
  background-color: #ffffff;
`;

const Inner = styled.div`
  max-width: 900px;
  margin: 80px auto 120px;
  padding: 0 40px;
  box-sizing: border-box;
  color: #222;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui;
  font-size: 13px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 12px;
  border-bottom: 2px solid #000;
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
`;

const OrderDate = styled.span`
  font-size: 13px;
  color: #555;
`;

// 상태 표시바 스타일
const StatusContainer = styled.div`
  width: 100%;
  margin-bottom: 40px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
`;

const CancelBanner = styled.div`
  width: 100%;
  padding: 15px;
  background-color: #ffebee;
  color: #c62828;
  font-weight: 700;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 30px;
  font-size: 14px;
`;

const StepWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const StepLineBg = styled.div`
  position: absolute;
  top: 12px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #eee;
  z-index: 0;
`;

const StepLineFill = styled.div`
  position: absolute;
  top: 12px;
  left: 0;
  height: 2px;
  background-color: #ff7e00;
  z-index: 1;
  width: ${(props) => props.$width}%;
  transition: width 0.3s ease;
`;

const StepItem = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
`;

const StepCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => (props.$active ? "#ff7e00" : "#fff")};
  border: 2px solid ${(props) => (props.$active ? "#ff7e00" : "#ddd")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$active ? "#fff" : "#999")};
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 8px;
  transition: all 0.3s ease;
`;

const StepLabel = styled.span`
  font-size: 11px;
  font-weight: ${(props) => (props.$active ? "700" : "400")};
  color: ${(props) => (props.$active ? "#333" : "#aaa")};
`;

// 섹션 스타일
const Section = styled.section`
  margin-top: 36px;
`;

const SectionHeader = styled.div`
  margin-bottom: 8px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const SectionDivider = styled.div`
  height: 1px;
  background-color: #f0f0f0;
`;

const InfoBlock = styled.div`
  margin-top: 18px;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const InfoLabel = styled.div`
  width: 90px;
  color: #777;
  flex-shrink: 0;
`;

const InfoValue = styled.div`
  flex: 1;
  white-space: pre-line;
  word-break: break-all;
`;

// 상품 정보 스타일
const ProductRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 18px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ProductLeft = styled.div`
  display: flex;
  flex: 1;
`;

const ProductImageBox = styled.div`
  width: 120px;
  height: 120px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 20px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductTextBox = styled.div`
  font-size: 13px;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProductName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
`;

const ProductMeta = styled.div`
  color: #777;
  font-size: 12px;
`;

const ProductRight = styled.div`
  width: 260px;
  margin-left: 40px;
  font-size: 13px;
  @media (max-width: 600px) {
    width: 100%;
    margin-left: 0;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f9f9f9;
  }
`;

const ProductRightTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const PaymentRow = styled.div`
  display: flex;
  margin-top: 18px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const PaymentLeft = styled.div`
  flex: 1;
`;

const PaymentRight = styled.div`
  width: 260px;
  margin-left: 40px;
  @media (max-width: 600px) {
    width: 100%;
    margin-left: 0;
    margin-top: 20px;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
  font-weight: 700;
  font-size: 16px;
  color: #000;
`;

const NoticeText = styled.p`
  margin-top: 18px;
  font-size: 11px;
  line-height: 1.8;
  white-space: pre-line;
  color: #888;
`;

const formatPrice = (num) => (num ? num.toLocaleString("ko-KR") : "0");
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return dateString.substring(0, 10);
};
const mapEntranceAccess = (code) => {
  switch (code) {
    case "FREE": return "자유출입가능";
    case "PASSWORD": return "공동현관 비밀번호";
    case "CALL": return "현관 호출";
    case "OTHER": return "기타";
    default: return "-";
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/api/mypage/order/${id}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error("주문 상세 조회 실패:", error);
        alert("주문 정보를 불러오는데 실패했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, navigate]);

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>로딩 중...</div>;
  if (!order) return <div style={{ padding: "100px", textAlign: "center" }}>주문 정보가 없습니다.</div>;

  const isDelivery = order.isDelivery; // 배송 여부
  const totalAmount = (order.price * order.quantity) + (order.deliveryFee || 0);
  const currentStatus = order.status; // DB status 0~6

  // 🔹 DB Status -> Visual Step 매핑
  // 0(접수) -> 1
  // 1(결제) -> 2
  // 2(준비) -> 3
  // 3(배송중) -> 4
  // 4(완료), 5(확정) -> 5
  let visualStep = 1;
  if (currentStatus === 1) visualStep = 2;
  else if (currentStatus === 2) visualStep = 3;
  else if (currentStatus === 3) visualStep = 4;
  else if (currentStatus >= 4 && currentStatus <= 5) visualStep = 5;

  const progressPercent = ((visualStep - 1) / (STATUS_STEPS.length - 1)) * 100;

  return (
    <Page>
      <Inner>
        <TitleRow>
          <PageTitle>주문 상세</PageTitle>
          <OrderDate>주문일자: {formatDate(order.createdAt)}</OrderDate>
        </TitleRow>

        {/* 🔹 상태 진행 바 (취소된 경우 배너 표시) */}
        {currentStatus === 6 ? (
          <CancelBanner>🚫 취소된 주문입니다.</CancelBanner>
        ) : (
          <StatusContainer>
            <StepWrapper>
              <StepLineBg />
              <StepLineFill $width={progressPercent} />
              {STATUS_STEPS.map((s) => {
                const isActive = visualStep >= s.step;
                return (
                  <StepItem key={s.step}>
                    <StepCircle $active={isActive}>
                      {isActive ? "✔" : s.step}
                    </StepCircle>
                    <StepLabel $active={isActive}>{s.label}</StepLabel>
                  </StepItem>
                );
              })}
            </StepWrapper>
          </StatusContainer>
        )}

        {/* 1. 배송지 정보 / 수령 정보 */}
        <Section>
          <SectionHeader>
            <SectionTitle>{isDelivery ? "배송지 정보" : "수령 정보"}</SectionTitle>
            <SectionDivider />
          </SectionHeader>
          <InfoBlock>
            {isDelivery ? (
              <>
                <InfoRow><InfoLabel>받는 사람</InfoLabel><InfoValue>{order.recipient}</InfoValue></InfoRow>
                <InfoRow>
                  <InfoLabel>주소</InfoLabel>
                  <InfoValue>
                    {order.addressStreet} {order.addressDetail || ""}
                  </InfoValue>
                </InfoRow>
                <InfoRow><InfoLabel>연락처</InfoLabel><InfoValue>{order.addressPhone}</InfoValue></InfoRow>
                {order.entranceAccess && (
                  <>
                    <InfoRow>
                      <InfoLabel>공동현관</InfoLabel>
                      <InfoValue>{mapEntranceAccess(order.entranceAccess)}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>출입내용</InfoLabel>
                      <InfoValue>{order.entranceDetail || "-"}</InfoValue>
                    </InfoRow>
                  </>
                )}
              </>
            ) : (
              <>
                <InfoRow>
                  <InfoLabel>수령 장소</InfoLabel>
                  <InfoValue>{order.pickupAddress}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>수령 예정일</InfoLabel>
                  <InfoValue>
                    {order.receivedAt ? formatDate(order.receivedAt) : "미정"}
                  </InfoValue>
                </InfoRow>
              </>
            )}
          </InfoBlock>
        </Section>

        {/* 2. 상품 정보 */}
        <Section>
          <SectionHeader>
            <SectionTitle>상품 정보</SectionTitle>
            <SectionDivider />
          </SectionHeader>
          <ProductRow>
            <ProductLeft>
              <ProductImageBox>
                <ProductImage 
                  src={order.postImg ? `${BASE_URL}${order.postImg}` : "/images/sajasaja.png"} 
                  alt="상품" 
                  onError={(e) => e.target.src = "/images/sajasaja.png"}
                />
              </ProductImageBox>
              <ProductTextBox>
                <ProductName>{order.postTitle}</ProductName>
                <ProductMeta>마감일 : {formatDate(order.endAt)}</ProductMeta>
                <ProductMeta>수량 : {order.quantity}개</ProductMeta>
                <div style={{ marginTop: '8px', fontWeight: '600' }}>
                  {formatPrice(order.price)} 원
                </div>
              </ProductTextBox>
            </ProductLeft>

            {/* 🔹 배송 정보: 배송(isDelivery)이면서 상태가 배송중(3) 이상일 때만 표시 */}
            {isDelivery && currentStatus >= 3 && (
              <ProductRight>
                <ProductRightTitle>배송 현황</ProductRightTitle>
                <InfoRow>
                  <InfoLabel>택배사</InfoLabel>
                  <InfoValue>{order.courier || "등록 대기중"}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>송장번호</InfoLabel>
                  <InfoValue>{order.trackingNumber || "등록 대기중"}</InfoValue>
                </InfoRow>
              </ProductRight>
            )}
          </ProductRow>
        </Section>

        {/* 3. 주최자 정보 */}
        <Section>
          <SectionHeader>
            <SectionTitle>주최자 정보</SectionTitle>
            <SectionDivider />
          </SectionHeader>
          <InfoBlock>
            <InfoRow><InfoLabel>이름</InfoLabel><InfoValue>{order.hostName}</InfoValue></InfoRow>
            <InfoRow><InfoLabel>닉네임</InfoLabel><InfoValue>{order.hostNickname}</InfoValue></InfoRow>
          </InfoBlock>
        </Section>

        {/* 4. 결제 정보 */}
        <Section>
          <SectionHeader>
            <SectionTitle>결제 정보</SectionTitle>
            <SectionDivider />
          </SectionHeader>
          <PaymentRow>
            <PaymentLeft>
              <InfoRow><InfoLabel>결제방법</InfoLabel><InfoValue>무통장입금</InfoValue></InfoRow>
              <InfoRow>
                <InfoLabel>입금계좌</InfoLabel>
                <InfoValue>
                  {order.virtualAccountBank || "은행"} {order.virtualAccount || "-"}
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>수령방식</InfoLabel>
                <InfoValue>{isDelivery ? "택배 배송" : "직접 수령"}</InfoValue>
              </InfoRow>
            </PaymentLeft>
            <PaymentRight>
              <InfoRow>
                <InfoLabel>주문금액</InfoLabel>
                <InfoValue style={{textAlign: "right"}}>{formatPrice(order.price * order.quantity)} 원</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>배송비</InfoLabel>
                <InfoValue style={{textAlign: "right"}}>{formatPrice(order.deliveryFee)} 원</InfoValue>
              </InfoRow>
              <TotalRow>
                <span>총 결제금액</span>
                <span>{formatPrice(totalAmount)} 원</span>
              </TotalRow>
            </PaymentRight>
          </PaymentRow>
        </Section>

        {/* 5. 주문자 정보 */}
        <Section>
          <SectionHeader>
            <SectionTitle>주문자 정보</SectionTitle>
            <SectionDivider />
          </SectionHeader>
          <InfoBlock>
            <InfoRow><InfoLabel>이름</InfoLabel><InfoValue>{order.buyerName}</InfoValue></InfoRow>
            <InfoRow><InfoLabel>전화번호</InfoLabel><InfoValue>{order.buyerPhone}</InfoValue></InfoRow>
            <InfoRow><InfoLabel>이메일</InfoLabel><InfoValue>{order.email}</InfoValue></InfoRow>
          </InfoBlock>
        </Section>

        {/* 유의사항 */}
        <Section>
          <NoticeText>
            공동구매 진행 및 입금사항은 공지사항을 통해 안내되며, 공지 미확인으로 인한 불이익에 대해서는 책임지지 않습니다.
            {"\n\n"}
            입금 기한 내 미입금 시 주문은 자동 취소됩니다.
            상품 준비가 시작된 이후에는 주문 취소가 불가능합니다.
            배송을 선택한 경우 배송 과정에서 발생하는 분실·파손 등과 관련된 문제는 구매자 책임으로 처리됩니다.
          </NoticeText>
        </Section>
      </Inner>
    </Page>
  );
};

export default OrderDetailPage;