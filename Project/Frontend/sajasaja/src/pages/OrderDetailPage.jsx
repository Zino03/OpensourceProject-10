// 파일명: OrderDetailPage.jsx
import React from "react";

/* ==========================================
   🔧 더미 주문 데이터 (레이아웃 확인용)
   - 나중에 백엔드 응답으로 교체
========================================== */
const mockOrder = {
  recipient: "최지우",
  addressStreet: "충북 청주시 가나구 다라로 123(삼성동, 사자아파트) 123동 1234호",
  addressPhone: "010-8239-5709",
  entranceAccess: "FREE", // FREE / PASSWORD / CALL / OTHER
  entranceDetail: "#1234#",
  postId: 10,
  postImg: "/images/sample-product.png",
  postTitle: "애니 퍼콘 미니 프레첼 스낵 150g",
  endAt: "2025-11-30T00:00:00",
  hostName: "변호조",
  hostNickname: "사자사자",
  deliveryFee: 0,
  pickupAddress:
    "충북 청주시 가나구 다라로 123(삼성동, 사자아파트)****, 123동 1234호",
  createdAt: "2025-11-12T10:00:00",
  courier: "대한통운",
  trackingNumber: "1234567890123",
  price: 2670,
  quantity: 3,
  isDelivery: true, // 🔥 true = 1번(배송), false = 2번(수령)
  status: 0,
  receivedAt: null,
  virtualAccount: "1234567890",
  virtualAccountBank: "농협",
  buyerName: "최지우",
  buyerPhone: "010-1234-5678",
  email: "example@email.com",
};

/* ==========================================
   🔧 유틸 함수
========================================== */
function formatPrice(num) {
  if (num == null) return "-";
  return num.toLocaleString("ko-KR");
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatEndAtForProduct(endAt) {
  if (!endAt) return "";
  const d = new Date(endAt);
  if (Number.isNaN(d.getTime())) return "";
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `~ ${yy}. ${mm}. ${dd}`;
}

function mapEntranceAccess(code) {
  switch (code) {
    case "FREE":
      return "자유출입가능";
    case "PASSWORD":
      return "공동현관 비밀번호";
    case "CALL":
      return "현관 호출";
    case "OTHER":
      return "기타";
    default:
      return "-";
  }
}

/* ==========================================
   🔧 스타일 (시안 최대한 동일)
========================================== */
const styles = {
  page: {
    width: "100%",
    backgroundColor: "#ffffff",
  },
  inner: {
    maxWidth: "1040px",
    margin: "80px auto 120px",
    padding: "0 40px",
    boxSizing: "border-box",
    color: "#222",
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui",
    fontSize: "13px",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: "12px",
    borderBottom: "2px solid #000000",
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: 700,
  },
  orderDate: {
    fontSize: "13px",
    color: "#555",
  },

  section: {
    marginTop: "36px",
  },
  sectionHeader: {
    marginBottom: "8px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "8px",
  },
  sectionDivider: {
    height: "1px",
    backgroundColor: "#f0f0f0",
  },

  infoBlock: {
    marginTop: "18px",
  },
  infoRow: {
    display: "flex",
    marginBottom: "4px",
  },
  infoLabel: {
    width: "80px",
    color: "#777",
  },
  infoValue: {
    flex: 1,
    whiteSpace: "pre-line",
  },

  // 상품 정보
  productRow: {
    display: "flex",
    alignItems: "flex-start",
    marginTop: "18px",
  },
  productLeft: {
    display: "flex",
    flex: 1,
  },
  productImageBox: {
    width: "140px",
    height: "180px",
    border: "1px solid #eeeeee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: "30px",
  },
  productImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "cover",
  },
  productTextBox: {
    fontSize: "13px",
    lineHeight: 1.7,
  },
  productName: {
    marginBottom: "4px",
  },
  productMeta: {
    color: "#777",
  },
  productPrice: {
    marginTop: "12px",
  },

  productRight: {
    width: "260px",
    marginLeft: "40px",
    fontSize: "13px",
  },
  productRightTitle: {
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "8px",
  },

  // 결제 정보
  paymentRow: {
    display: "flex",
    marginTop: "18px",
  },
  paymentLeft: {
    flex: 1,
  },
  paymentRight: {
    width: "260px",
    marginLeft: "40px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
    paddingTop: "6px",
    borderTop: "1px solid #eeeeee",
    fontWeight: 700,
    fontSize: "14px",
  },

  noticeText: {
    marginTop: "18px",
    fontSize: "11px",
    lineHeight: 1.8,
    whiteSpace: "pre-line",
    color: "#444",
  },
};

/* ==========================================
   🔥 메인 컴포넌트
========================================== */
const OrderDetailPage = () => {
  // 지금은 mockOrder 사용 (백엔드 붙을 때 교체)
  const order = mockOrder;
  const isDelivery = order.isDelivery;

  const productTotal = (order.price || 0) * (order.quantity || 0);
  const deliveryFee = order.deliveryFee || 0;
  const totalAmount = productTotal + deliveryFee;

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* 상단 타이틀 + 날짜 + 굵은 선 */}
        <div style={styles.titleRow}>
          <h1 style={styles.pageTitle}>주문 상세</h1>
          <span style={styles.orderDate}>{formatDate(order.createdAt)}</span>
        </div>

        {/* 1. 배송지 정보 / 수령 정보 */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>
              {isDelivery ? "배송지 정보" : "수령 정보"}
            </div>
            <div style={styles.sectionDivider} />
          </div>

          <div style={styles.infoBlock}>
            {isDelivery ? (
              <>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>받는 사람</div>
                  <div style={styles.infoValue}>{order.recipient}</div>
                </div>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>주소</div>
                  <div style={styles.infoValue}>{order.addressStreet}</div>
                </div>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>연락처</div>
                  <div style={styles.infoValue}>{order.addressPhone}</div>
                </div>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>공동현관\n출입방법</div>
                  <div style={styles.infoValue}>
                    {mapEntranceAccess(order.entranceAccess)}
                  </div>
                </div>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>공동현관\n비밀번호</div>
                  <div style={styles.infoValue}>
                    {order.entranceDetail || "-"}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>수령지</div>
                  <div style={styles.infoValue}>{order.pickupAddress}</div>
                </div>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>수령일자</div>
                  <div style={styles.infoValue}>
                    {formatDate(order.receivedAt || order.endAt)}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* 2. 상품 정보 */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>상품 정보</div>
            <div style={styles.sectionDivider} />
          </div>

          <div style={styles.productRow}>
            {/* 왼쪽: 상품 */}
            <div style={styles.productLeft}>
              <div style={styles.productImageBox}>
                <img
                  src={order.postImg}
                  alt={order.postTitle}
                  style={styles.productImage}
                />
              </div>
              <div style={styles.productTextBox}>
                <div style={styles.productName}>{order.postTitle}</div>
                <div style={styles.productMeta}>
                  {formatEndAtForProduct(order.endAt)}
                </div>
                <div style={styles.productMeta}>{order.quantity}개</div>
                <div style={styles.productPrice}>
                  {formatPrice(order.price)} 원
                </div>
              </div>
            </div>

            {/* 오른쪽: 배송 정보 (배달일 때만) */}
            {isDelivery && (
              <div style={styles.productRight}>
                <div style={styles.productRightTitle}>배송 정보</div>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>택배사</div>
                  <div style={styles.infoValue}>{order.courier || "-"}</div>
                </div>
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>송장번호</div>
                  <div style={styles.infoValue}>
                    {order.trackingNumber || "-"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. 주최자 정보 */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>주최자 정보</div>
            <div style={styles.sectionDivider} />
          </div>

          <div style={styles.infoBlock}>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>이름</div>
              <div style={styles.infoValue}>{order.hostName}</div>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>닉네임</div>
              <div style={styles.infoValue}>{order.hostNickname}</div>
            </div>
          </div>
        </section>

        {/* 4. 결제 정보 */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>결제 정보</div>
            <div style={styles.sectionDivider} />
          </div>

          <div style={styles.paymentRow}>
            {/* 왼쪽: 결제/계좌/수령방식 */}
            <div style={styles.paymentLeft}>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>결제방법</div>
                <div style={styles.infoValue}>무통장입금</div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>가상계좌</div>
                <div style={styles.infoValue}>
                  {order.virtualAccountBank} {order.virtualAccount}
                </div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>수령방식</div>
                <div style={styles.infoValue}>
                  {isDelivery ? "배달" : "직접수령"}
                </div>
              </div>
            </div>

            {/* 오른쪽: 금액/TOTAL */}
            <div style={styles.paymentRight}>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>주문금액</div>
                <div style={styles.infoValue}>{formatPrice(productTotal)}</div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>배송비</div>
                <div style={styles.infoValue}>{formatPrice(deliveryFee)}</div>
              </div>
              <div style={styles.totalRow}>
                <span>TOTAL</span>
                <span>{formatPrice(totalAmount)} 원</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 주문자 정보 */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>주문자 정보</div>
            <div style={styles.sectionDivider} />
          </div>

          <div style={styles.infoBlock}>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>이름</div>
              <div style={styles.infoValue}>{order.buyerName}</div>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>전화번호</div>
              <div style={styles.infoValue}>{order.buyerPhone}</div>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>이메일</div>
              <div style={styles.infoValue}>{order.email}</div>
            </div>
          </div>
        </section>

        {/* 6. 공동 구매 시 유의사항 */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>공동 구매 시 유의사항</div>
            <div style={styles.sectionDivider} />
          </div>

          <p style={styles.noticeText}>
            공동구매 진행 및 입금사항은 공지사항을 통해 안내되며,
            공지 미확인으로 인한 불이익에 대해서는 책임지지 않습니다.
            {"\n\n"}
            목표 수량이 충족되지 않을 경우 공동구매는 자동 취소되며, 결제 금액은 전액 환불됩니다.
            목표 수량이 빠르게 충족될 경우, 공동구매는 예정 기간과 관계없이 조기 마감될 수 있습니다.
            {"\n\n"}
            입금 기한 내 미입금 시 주문은 자동 취소됩니다.
            상품 준비가 시작된 이후에는 주문 취소가 불가능합니다.
            상품 특성에 따라 개봉 이후에는 주문 취소 및 반품이 제한될 수 있습니다.
            {"\n\n"}
            직접 수령을 선택한 경우 판매자와 직접 소통하여 수령 일정을 조율해야 합니다.
            배송을 선택한 경우 배송 과정에서 발생하는 분실·파손 등과 관련된 문제는 구매자 책임으로 처리됩니다.
          </p>
        </section>
      </div>
    </div>
  );
};

export default OrderDetailPage;
