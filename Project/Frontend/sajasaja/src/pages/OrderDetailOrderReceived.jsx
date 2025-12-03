// 파일명: OrderDetailOrderReceived.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CancelModal from "./modal/CancelModal";
import ContactModal from "./modal/ContactModal"; // ContactModal import 확인
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
  orderListNotice: {
    fontSize: "12px",
    color: "#D32F2F",
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
  btnOutline: {
    minWidth: "90px",
    padding: "4px 14px",
    fontSize: "11px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid #000",
    backgroundColor: "#fff",
    color: "#444",
    margin: "0 -8px 0 -4px",
  },
  btnFilled: {
    minWidth: "90px",
    padding: "4px 14px",
    fontSize: "11px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid #FF7E00",
    backgroundColor: "#FF7E00",
    color: "#fff",
    margin: "0 -4px 0 -8px",
  },
};

const arrowColors = ["#000000ff", "#828282", "#ffffffff"];

const STATUS_MAP = {
  0: { label: "주문 접수", path: "/order-detail" },
  1: { label: "결제 완료", path: "/received" },
  2: { label: "상품 준비 중", path: "/preparing" },
  3: { label: "배송 중", path: "/shipping" },
  4: { label: "배송 완료", path: "/delivered" },
  6: { label: "주문 취소", path: "/cancelled" },
};

function OrderDetailOrderReceived() {
  const navigate = useNavigate();

  // 주문 리스트 상태
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 동적 주문 수량 상태
  const [counts, setCounts] = useState({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
  });

  // 취소 모달 관련 상태
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔥 [추가] 연락처 모달 관련 상태
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [targetContact, setTargetContact] = useState("");

  const activeStatus = 0; // 현재 페이지: 주문 접수(0)

  // ⚠️ [수정] 불필요하고 에러를 유발하던 fetchPostDetail 함수는 제거했습니다.

  /* ===================================
       🔥 1. 주문 목록 불러오기
  =================================== */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/mypage/orders", {
        params: { status: activeStatus, page: 0 },
      });

      const { orders: rawOrders, statusCounts } = res.data;

      if (statusCounts) setCounts(statusCounts);

      if (!Array.isArray(rawOrders)) {
        setOrders([]);
        return;
      }

      // status=0만 필터링
      const activeOrders = rawOrders.filter((o) => o.status === 0);

      // 데이터 매핑
      const mapped = activeOrders.map((o) => {
        const orderedDate = (o.createdAt || "").split("T")[0] || "";
        const totalPrice = o.price ?? 0;

        return {
          id: o.id, 
          postId: o.postId, // 🔥 [중요] postId가 있어야 연락처 조회가 가능합니다.
          name: o.postTitle,
          host: o.hostNickname,
          quantity: o.quantity,
          status: o.status,
          date: orderedDate,
          total: `${Number(totalPrice).toLocaleString()} 원`,
        };
      });

      setOrders(mapped);
    } catch (err) {
      console.error("주문 내역 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || token === "undefined") {
      navigate("/login");
      return;
    }
    setInterceptor(token);
    fetchOrders();
  }, [navigate]);

  /* ===================================
       🔥 2. 취소 모달 핸들러
  =================================== */
  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedOrder(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrder) return;
    try {
      const payload = { status: 5 };
      await api.patch(
        `/api/mypage/order/${selectedOrder.id}/cancel`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("주문이 취소되었습니다.");
      closeCancelModal();
      fetchOrders();
    } catch (err) {
      console.error("주문 취소 실패:", err);
      alert("주문 취소 중 오류가 발생했습니다.");
    }
  };

  /* ===================================
       🔥 3. [연락처 모달 연결] 핸들러
  =================================== */
  const handleContactClick = async (postId) => {
    try {
      // 1. 해당 주문의 게시글 ID로 상세 정보를 조회합니다.
      const response = await api.get(`/api/posts/${postId}`);
      
      // 2. 받아온 정보에서 연락처(contact)를 꺼냅니다.
      const contactInfo = response.data.post.contact;
      
      // 3. 모달 상태를 업데이트하여 띄웁니다.
      setTargetContact(contactInfo);
      setIsContactModalOpen(true);
    } catch (error) {
      console.error("연락처 정보 조회 실패:", error);
      alert("연락처 정보를 불러오는데 실패했습니다.");
    }
  };

  /* ===================================
       🔥 STEP UI 데이터
  =================================== */
  const steps = [
    { id: 0, label: STATUS_MAP[0].label, value: counts[0] || 0, path: STATUS_MAP[0].path },
    { id: 1, label: STATUS_MAP[1].label, value: counts[1] || 0, path: STATUS_MAP[1].path },
    { id: 2, label: STATUS_MAP[2].label, value: counts[2] || 0, path: STATUS_MAP[2].path },
    { id: 3, label: STATUS_MAP[3].label, value: counts[3] || 0, path: STATUS_MAP[3].path },
    { id: 4, label: STATUS_MAP[4].label, value: (counts[4] || 0) + (counts[5] || 0), path: STATUS_MAP[4].path },
    { id: 6, label: STATUS_MAP[6].label, value: counts[6] || 0, path: STATUS_MAP[6].path },
  ];

  return (
    <div style={styles.orderPage}>
      {/* 상단 주문 단계 */}
      <div style={styles.orderSteps}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div style={styles.orderStep} onClick={() => step.path && navigate(step.path)}>
              <div style={step.id === activeStatus ? styles.stepNumberActive : styles.stepNumber}>
                {step.value}
              </div>
              <div style={styles.stepLabel}>{step.label}</div>
            </div>
            {index < steps.length - 2 && <ArrowIcon color={step.id === activeStatus ? arrowColors[0] : arrowColors[1]} />}
            {index === steps.length - 2 && <ArrowIcon color={arrowColors[2]} />}
          </React.Fragment>
        ))}
      </div>

      {/* 주문 테이블 */}
      <div style={styles.orderListWrapper}>
        <div style={styles.orderListHeader}>
          <h2 style={styles.orderListTitle}>주문 내역</h2>
          <span style={styles.orderListNotice}>상품 준비가 시작되면 주문 취소가 어렵습니다.</span>
        </div>

        <table style={styles.orderTable}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.th}>상품명</th>
              <th style={styles.th}>주최자정보</th>
              <th style={styles.th}>수량</th>
              <th style={styles.th}>주문일</th>
              <th style={styles.th}>결제금액</th>
              <th style={styles.th}>주문취소</th>
              <th style={styles.th}>문의하기</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={styles.td} colSpan={7}>주문 내역을 불러오는 중입니다...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td style={styles.td} colSpan={7}>주문 접수 상태의 주문이 없습니다.</td></tr>
            ) : (
              orders.map((order, idx) => (
                <tr key={order.id} style={idx === orders.length - 1 ? styles.lastBodyRow : styles.bodyRow}>
                  <td
                    style={{ ...styles.td, ...styles.productName, cursor: "pointer" }}
                    onClick={() => navigate(`/orderpage/${order.id}`)}
                  >
                    {order.name}
                  </td>
                  <td style={{ ...styles.td, cursor: "pointer" }} onClick={() => navigate(`/user/${order.host}`)}>
                    {order.host}
                  </td>
                  <td style={styles.td}>{order.quantity}</td>
                  <td style={styles.td}>{order.date}</td>
                  <td style={styles.td}>{order.total}</td>
                  <td style={styles.td}>
                    <button type="button" style={styles.btnOutline} onClick={() => openCancelModal(order)}>
                      주문 취소
                    </button>
                  </td>
                  {/* 🔥 문의하기 버튼: 클릭 시 handleContactClick 실행 */}
                  <td style={styles.td}>
                    <button 
                      type="button" 
                      style={styles.btnFilled} 
                      onClick={() => handleContactClick(order.postId)}
                    >
                      문의하기
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 취소 모달 */}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={handleConfirmCancel}
        order={selectedOrder}
      />
      
      {/* 🔥 연락처 모달 */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contact={targetContact}
      />
    </div>
  );
}

export default OrderDetailOrderReceived;