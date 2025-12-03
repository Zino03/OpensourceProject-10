// 파일명: OrderDetail_Delivered.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationPurchase from "./modal/ConfirmationPurchase";
import ReviewModal from "./modal/ReviewModal";
import { api, setInterceptor } from "../assets/setIntercepter";

/* ============================================
    🔥 SVG 화살표 아이콘 (색 변경 가능)
=============================================== */
const ArrowIcon = ({ color = "#b0b0b0" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    style={{ marginTop: "22px" }}
  >
    <path
      d="M8 4l8 8-8 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const styles = {
  orderPage: {
    maxWidth: "1200px",
    margin: "60px auto",
    color: "#222",
  },
  orderSteps: {
    display: "flex",
    alignItems: "flex-start",
    gap: "52px",
    marginBottom: "50px",
    justifyContent: "center",
  },
  orderStep: {
    textAlign: "center",
    cursor: "pointer",
  },
  stepNumber: {
    fontSize: "60px",
    fontWeight: 401,
    color: "#b0b0b0",
    lineHeight: 1,
    fontFamily: "Pretendard",
  },
  stepNumberActive: {
    fontSize: "60px",
    fontWeight: 401,
    color: "#000",
    lineHeight: 1,
    fontFamily: "Pretendard",
  },
  stepLabel: {
    fontSize: "13px",
    marginTop: "8px",
    color: "#555",
  },
  orderListWrapper: {
    marginTop: "20px",
  },
  orderListHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "77%",
    margin: "0 auto",
    borderBottom: "1px solid #000",
    paddingBottom: "8px",
  },
  orderListTitle: {
    fontSize: "16px",
    fontWeight: 900,
  },
  orderTable: {
    width: "77%",
    margin: "0 auto",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  tableHeadRow: {
    borderBottom: "1px solid #000",
  },
  th: {
    padding: "20px 8px",
    textAlign: "center",
    fontWeight: 500,
    color: "#555",
    fontSize: "13.5px",
  },
  td: {
    padding: "10px 8px",
    textAlign: "center",
    fontSize: "11.5px",
  },
  bodyRow: {
    borderBottom: "1px solid #f1f1f1",
  },
  lastBodyRow: {
    borderBottom: "1px solid #e1e1e1",
  },
  productName: {
    maxWidth: "200px",
    whiteSpace: "nowrap",
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  orderActions: {
    display: "flex",
    gap: "8px",
  },
  btnConfirmDefault: {
    minWidth: "90px",
    padding: "4px 14px",
    fontSize: "11px",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#fff",
    border: "1px solid #000",
    color: "#000",
  },
  btnConfirmDone: {
    minWidth: "90px",
    padding: "4px 14px",
    fontSize: "11px",
    borderRadius: "6px",
    cursor: "default",
    backgroundColor: "#e0e0e0",
    border: "1px solid #e0e0e0",
    color: "#000",
  },
  btnFilled: {
    minWidth: "90px",
    padding: "4px 14px",
    fontSize: "11px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid #000000ff",
    backgroundColor: "#000000ff",
    color: "#fff",
  },
};

/* ============================================
    🔥 화살표 색상 배열 및 STATUS_MAP
=============================================== */
const arrowColors = ["#828282", "#828282", "#828282", "#828282", "#ffffffff"];

// 백엔드 Status Code
const STATUS_MAP = {
    0: { label: "주문 접수", path: "/order-received" },
    1: { label: "결제 완료", path: "/order-payment-received" },
    2: { label: "상품 준비 중", path: "/order-preparing" },
    3: { label: "배송 중", path: "/order-shipping" },
    4: { label: "배송 완료", path: "/order-delivered" }, 
    6: { label: "주문 취소", path: "/order-cancelled" },
};

function OrderDetailDelivered() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [counts, setCounts] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });

  // 구매확정 모달
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderToConfirm, setSelectedOrderToConfirm] = useState(null);

  // 후기 모달
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);
  
  const activeStatus = 4; // 🔥 현재 페이지의 상태: 배송 완료 (Status 4와 5를 함께 조회)

  /* ===========================
     1. 주문 목록 및 카운트 불러오기
  ============================ */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // GET /api/mypage/orders?status=4 호출
      const res = await api.get("/api/mypage/orders", {
        params: {
          status: activeStatus,
          page: 0,
        },
      });

      const { orders: rawOrders, statusCounts } = res.data; //

      if (statusCounts) {
          setCounts(statusCounts);
      }
      
      if (!Array.isArray(rawOrders)) {
        setOrders([]);
        return;
      }

      // OrderListResponseDto 필드에 맞게 매핑
      const mapped = rawOrders.map((o) => ({
          id: o.id,
          name: o.postTitle || "상품명 없음",
          host: o.hostNickname || "주최자",
          hostNickname: o.hostNickname,
          quantity: o.quantity ?? 0,
          date: (o.createdAt || "").split("T")[0] || "",
          total: `${Number(o.price ?? 0).toLocaleString()} 원`,
          confirmed: o.status === 5, // Status 5면 구매확정 완료
          imageUrl: "/images/products/sample.png", 
      }));

      setOrders(mapped);
    } catch (err) {
      console.error("주문 내역 조회 실패:", err);
      setErrorMsg(err.response?.data?.message || "주문 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 인증 오류 수정: navigate 대신 실제 토큰을 setInterceptor에 전달
    const token = localStorage.getItem("accessToken");
    
    if (!token || token === 'undefined') {
        navigate('/login'); 
        return;
    }
    
    setInterceptor(token);
    fetchOrders();
  }, [navigate]);

  /* ===========================
     2. 구매 확정 로직 (API 연동)
  ============================ */
  const handleConfirmPurchase = async () => {
    if (!selectedOrderToConfirm) return;

    try {
      // PATCH /mypage/order/{buyerId}/confirm 호출
      await api.patch(`/api/mypage/order/${selectedOrderToConfirm.id}/confirm`);

      // 성공 후 목록 새로고침
      fetchOrders(); 

      setShowModal(false);
      setSelectedOrderToConfirm(null);
    } catch (err) {
      console.error("구매 확정 실패:", err);
      alert(err.response?.data?.message || "구매 확정 중 오류가 발생했습니다.");
    }
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setSelectedOrderToConfirm(null);
  };

  /* ===========================
     3. 후기 작성 로직 (API 연동)
  ============================ */
  // 후기 모달 열기
  const handleOpenReviewModal = (order) => {
    setReviewOrder(order);
    setShowReviewModal(true);
  };

  // 후기 모달 닫기
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setReviewOrder(null);
  };

  // 후기 등록 API 호출
  const handleSubmitReview = async (orderId, rating, reviewText) => {
    try {
        const body = {
            content: reviewText,
            rating: rating,
        };

        // POST /mypage/order/{buyerId}/review 호출
        await api.post(`/api/mypage/order/${orderId}/review`, body);

        alert("후기가 성공적으로 등록되었습니다.");
        
        // 후기 등록 후 상태가 변경될 수 있으므로 목록 새로고침
        fetchOrders(); 

        handleCloseReviewModal();
    } catch (err) {
        console.error("후기 등록 실패:", err);
        alert(err.response?.data?.message || "후기 등록 중 오류가 발생했습니다.");
    }
  };

  // 동적 steps 배열 생성 (Status 4와 5를 '배송 완료'로 통합하여 표시)
  const steps = [
      { id: 0, label: STATUS_MAP[0].label, value: counts[0] || 0, active: false, path: STATUS_MAP[0].path },
      { id: 1, label: STATUS_MAP[1].label, value: counts[1] || 0, active: false, path: STATUS_MAP[1].path },
      { id: 2, label: STATUS_MAP[2].label, value: counts[2] || 0, active: false, path: STATUS_MAP[2].path },
      { id: 3, label: STATUS_MAP[3].label, value: counts[3] || 0, active: false, path: STATUS_MAP[3].path },
      { id: 4, label: STATUS_MAP[4].label, value: (counts[4] || 0) + (counts[5] || 0), active: true, path: STATUS_MAP[4].path }, 
      { id: 6, label: STATUS_MAP[6].label, value: counts[6] || 0, active: false, path: STATUS_MAP[6].path },
  ];

  return (
    <div style={styles.orderPage}>
      {/* 🔥 상단 주문 단계 */}
      <div style={styles.orderSteps}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              style={styles.orderStep}
              onClick={() => step.path && navigate(step.path)}
            >
              <div
                style={step.id === activeStatus ? styles.stepNumberActive : styles.stepNumber}
              >
                {step.value}
              </div>
              <div style={styles.stepLabel}>{step.label}</div>
            </div>

            {index < steps.length - 1 && (
              <ArrowIcon color={step.id === activeStatus ? arrowColors[index] : arrowColors[index + 1]} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ============================
          주문 내역 테이블
      ============================ */}
      <div style={styles.orderListWrapper}>
        <div style={styles.orderListHeader}>
          <h2 style={styles.orderListTitle}>주문 내역</h2>
        </div>
        
        {errorMsg && (
          <div
            style={{
              width: "77%",
              margin: "10px auto",
              fontSize: "12px",
              color: "#D32F2F",
            }}
          >
            {errorMsg}
          </div>
        )}

        <table style={styles.orderTable}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.th}>상품명</th>
              <th style={styles.th}>주최자정보</th>
              <th style={styles.th}>수량</th>
              <th style={styles.th}>주문일</th>
              <th style={styles.th}>결제금액</th>
              <th style={styles.th}>구매확정</th>
              <th style={styles.th}>후기</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td style={styles.td} colSpan={7}>
                  주문 내역을 불러오는 중입니다...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan={7}>
                  배송 완료된 주문이 없습니다.
                </td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr
                  key={order.id}
                  style={
                    idx === orders.length - 1
                      ? styles.lastBodyRow
                      : styles.bodyRow
                  }
                >
                  <td
                    style={{
                      ...styles.td,
                      ...styles.productName,
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/orderpage/${order.id}`)}
                  >
                    {order.name}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      minWidth: "100px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/user/${order.hostNickname || order.host}`)}
                  >
                    {order.host}
                  </td>
                  <td style={styles.td}>{order.quantity}</td>
                  <td style={styles.td}>{order.date}</td>
                  <td style={styles.td}>{order.total}</td>

                  {/* 구매확정 버튼 */}
                  <td style={styles.td}>
                    <button
                      type="button"
                      style={
                        order.confirmed
                          ? styles.btnConfirmDone
                          : styles.btnConfirmDefault
                      }
                      onClick={() => {
                        if (order.confirmed) return;
                        setSelectedOrderToConfirm(order);
                        setShowModal(true);
                      }}
                    >
                      {order.confirmed ? "확정 완료" : "구매확정"}
                    </button>
                  </td>

                  {/* 후기 작성 버튼 */}
                  <td style={styles.td}>
                    <button
                      type="button"
                      style={styles.btnFilled}
                      onClick={() => handleOpenReviewModal(order)}
                    >
                      후기 작성
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 구매확정 모달 */}
      {showModal && (
        <ConfirmationPurchase
          onCancel={handleCancelModal}
          onConfirm={handleConfirmPurchase}
        />
      )}

      {/* 후기 작성 모달 */}
      {showReviewModal && reviewOrder && (
        <ReviewModal
          orderId={reviewOrder.id}
          productName={reviewOrder.name}
          host={reviewOrder.host}
          price={reviewOrder.total}
          imageUrl={reviewOrder.imageUrl}
          onClose={handleCloseReviewModal}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}

export default OrderDetailDelivered;