// 파일명: OrderDetail_Shipping.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShippingInfoModal from "./modal/ShippingInfoModal.jsx"; // ✅ 경로 확인!

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

/* ============================================
    🔥 화살표 색상 배열
=============================================== */
const arrowColors = ["#828282", "#828282", "#828282", "#000000ff", "#ffffffff"];

const orderCounts = {
  received: 4,
  payment: 4,
  preparing: 4,
  shipping: 3,
  delivered: 4,
  cancelled: 4,
};

const steps = [
  { id: 1, label: "주문 접수", value: orderCounts.received, path: "/order-detail" },
  { id: 2, label: "결제 완료", value: orderCounts.payment, path: "/received" },
  { id: 3, label: "상품 준비 중", value: orderCounts.preparing, path: "/preparing" },
  { id: 4, label: "배송 중", value: orderCounts.shipping, active: true, path: "/shipping" },
  { id: 5, label: "배송완료", value: orderCounts.delivered, path: "/delivered" },
  { id: 6, label: "주문 취소", value: orderCounts.cancelled, path: "/cancelled" },
];

const orders = [
  {
    id: 1,
    name: "애니 피오르크 미니 프레첼 스낵 150g",
    host: "사자사자",
    quantity: 1,
    date: "2025-11-12",
    total: "7,000 원",
    carrierName: "대한통운",
    trackingNumber: "1234567890123",
  },
  {
    id: 2,
    name: "비로드슴 실온 닭가슴살 7종 10팩 골라담기",
    host: "빈지노",
    quantity: 2,
    date: "2025-05-20",
    total: "12,400 원",
    carrierName: "한진택배",
    trackingNumber: "5556667778889",
  },
  {
    id: 3,
    name: "연평도 자연 간장게장 100% 알베기 암꽃게 ...",
    host: "간장게장맛있어요요요",
    quantity: 2,
    date: "2025-01-13",
    total: "23,600 원",
    carrierName: "롯데택배",
    trackingNumber: "9990001112223",
  },
];

function OrderDetail_Shipping() {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenShippingModal = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseShippingModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div style={styles.orderPage}>
      {/* 상단 단계 표시 */}
      <div style={styles.orderSteps}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              style={styles.orderStep}
              onClick={() => step.path && navigate(step.path)}
            >
              <div
                style={step.active ? styles.stepNumberActive : styles.stepNumber}
              >
                {step.value}
              </div>
              <div style={styles.stepLabel}>{step.label}</div>
            </div>

            {index < steps.length - 1 && (
              <ArrowIcon color={arrowColors[index]} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 주문 내역 테이블 */}
      <div style={styles.orderListWrapper}>
        <div style={styles.orderListHeader}>
          <h2 style={styles.orderListTitle}>주문 내역</h2>
        </div>

        <table style={styles.orderTable}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.th}>상품명</th>
              <th style={styles.th}>주최자정보</th>
              <th style={styles.th}>수량</th>
              <th style={styles.th}>주문일</th>
              <th style={styles.th}>결제금액</th>
              <th style={styles.th}>배송정보</th>
              <th style={styles.th}>문의하기</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, idx) => (
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
                  onClick={() => navigate(`/products/${order.id}`)}
                >
                  {order.name}
                </td>

                <td
                  style={{
                    ...styles.td,
                    minWidth: "100px",
                    cursor: "pointer",          // 마우스 올렸을 때 손모양
                  }}
                  onClick={() => navigate("/userpage")}  // ✅ 여기서 사용자 프로필로 이동
                >
                  {order.host}
                </td>
                <td style={styles.td}>{order.quantity}</td>
                <td style={styles.td}>{order.date}</td>
                <td style={styles.td}>{order.total}</td>

                <td style={styles.td}>
                  <button
                    type="button"
                    style={styles.btnOutline}
                    onClick={() => handleOpenShippingModal(order)}
                  >
                    배송 정보
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

      {/* 배송정보 모달 */}
      {selectedOrder && (
        <ShippingInfoModal
          carrierName={selectedOrder.carrierName}
          trackingNumber={selectedOrder.trackingNumber}
          productName={selectedOrder.name}
          onClose={handleCloseShippingModal}
        />
      )}
    </div>
  );
}

export default OrderDetail_Shipping;
