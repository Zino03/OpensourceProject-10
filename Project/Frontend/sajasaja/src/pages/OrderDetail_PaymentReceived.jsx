// 파일명: OrderDetail_PaymentReceived.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CancelModal from "./modal/CancelModal"; // 🔥 모달 import

/* ============================================
    🔥 SVG 화살표 아이콘
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

/* ============================================
    🔥 스타일
=============================================== */
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
  tableHeadRow: { borderBottom: "1px solid #000" },
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
  bodyRow: { borderBottom: "1px solid #f1f1f1" },
  lastBodyRow: { borderBottom: "1px solid #e1e1e1" },
  productName: {
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "left",
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
  },
};

/* ============================================
    🔥 화살표 색상
=============================================== */
const arrowColors = ["#828282", "#000000ff", "#828282", "#828282", "#ffffffff"];

/* 단계별 주문 수 */
const orderCounts = {
  received: 4,
  payment: 4,
  preparing: 4,
  shipping: 3,
  delivered: 4,
  cancelled: 4,
};

/* 현재 단계 = 결제 완료 */
const steps = [
  { id: 1, label: "주문 접수", value: orderCounts.received, path: "/order-detail" },
  { id: 2, label: "결제 완료", value: orderCounts.payment, active: true, path: "/received" },
  { id: 3, label: "상품 준비 중", value: orderCounts.preparing, path: "/preparing" },
  { id: 4, label: "배송 중", value: orderCounts.shipping, path: "/shipping" },
  { id: 5, label: "배송완료", value: orderCounts.delivered, path: "/delivered" },
  { id: 6, label: "주문 취소", value: orderCounts.cancelled, path: "/cancelled" },
];

/* 주문 리스트 */
const orders = [
  { id: 1, name: "애니 피오르크 미니 프레첼 스낵 150g", host: "사자사자", quantity: 1, date: "2025-11-12", total: "7,000 원" },
  { id: 2, name: "비로드슴 실온 닭가슴살 7종 10팩 골라담기", host: "빈지노", quantity: 2, date: "2025-05-20", total: "12,400 원" },
  { id: 3, name: "연평도 자연 간장게장 100% 알베기 암꽃게 ...", host: "간장게장맛있어요요요", quantity: 2, date: "2025-01-13", total: "23,600 원" },
  { id: 4, name: "[아이앤비] 섬유유연제 건조기", host: "김우민호", quantity: 1, date: "2025-01-07", total: "5,200 원" },
];

/* ============================================
    🔥 메인 컴포넌트
=============================================== */
function OrderDetail_PaymentReceived() {
  const navigate = useNavigate();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedOrder(null);
  };

  const handleConfirmCancel = () => {
    console.log("취소된 주문:", selectedOrder);
    navigate("/cancelled");

    setIsCancelModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div style={styles.orderPage}>
      {/* 🔥 상단 단계 */}
      <div style={styles.orderSteps}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div style={styles.orderStep} onClick={() => navigate(step.path)}>
              <div style={step.active ? styles.stepNumberActive : styles.stepNumber}>
                {step.value}
              </div>
              <div style={styles.stepLabel}>{step.label}</div>
            </div>

            {index < steps.length - 1 && <ArrowIcon color={arrowColors[index]} />}
          </React.Fragment>
        ))}
      </div>

      {/* 🔥 테이블 */}
      <div style={styles.orderListWrapper}>
        <div style={styles.orderListHeader}>
          <h2 style={styles.orderListTitle}>주문 내역</h2>
          <span style={styles.orderListNotice}>
            상품 준비가 시작되면 주문 취소가 어렵습니다.
          </span>
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
            {orders.map((order, idx) => (
              <tr
                key={order.id}
                style={idx === orders.length - 1 ? styles.lastBodyRow : styles.bodyRow}
              >
                <td
                  style={{ ...styles.td, ...styles.productName, cursor: "pointer" }}
                  onClick={() => navigate(`/products/${order.id}`)}
                >
                  {order.name}
                </td>

                <td style={{ ...styles.td, minWidth: "100px" }}>{order.host}</td>
                <td style={styles.td}>{order.quantity}</td>
                <td style={styles.td}>{order.date}</td>
                <td style={styles.td}>{order.total}</td>

                <td style={styles.td}>
                  <button
                    type="button"
                    style={styles.btnOutline}
                    onClick={() => openCancelModal(order)} // 🔥 모달 열기
                  >
                    주문 취소
                  </button>
                </td>

                <td style={styles.td}>
                  <button type="button" style={styles.btnFilled}>
                    문의하기
                  </button>
                </td>
              </tr>
            ))}
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
    </div>
  );
}

export default OrderDetail_PaymentReceived;
