// 파일명: OrderDetail_PaymentCompleted.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

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

  //숫자랑 화살표 사이 갭
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

  /* 비활성 숫자 */
  stepNumber: {
    fontSize: "60px",
    fontWeight: 401,
    color: "#b0b0b0",
    lineHeight: 1,
    fontFamily: "Pretendard",
  },

  /* 활성 숫자 */
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

  /* 표, 뒤 코드는 동일 */
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

  th: { //표 헤더 내용 스타일 수정
    padding: "20px 8px",
    textAlign: "center",
    fontWeight: 500,
    color: "#555",
    fontSize: "13.5px",
  },

  td: { //표 바디 내용 스타일 수정
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

  btnOutline: { //버튼 스타일 수정
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

  btnFilled: { //버튼 스타일 수정
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
    index 순서대로: 
    1→2, 2→3, 3→4, 4→5, 5→6
=============================================== */
const arrowColors = ["#828282", "#828282", "#828282", "#000000ff", "#ffffffff"]; // 화살표 색상 변경

/* 단계별 주문 개수 */
const orderCounts = {
  received: 4,
  payment: 4,
  preparing: 4,
  shipping: 3,
  delivered: 4,
  cancelled: 4,
};

/* 현재 활성 단계 = 결제 완료 */
const steps = [
  { id: 1, label: "주문 접수", value: orderCounts.received, path: "/order-detail" },
  { id: 2, label: "결제 완료", value: orderCounts.payment, path: "/received" },
  { id: 3, label: "상품 준비 중", value: orderCounts.preparing, path: "/preparing" },
  { id: 4, label: "배송 중", value: orderCounts.shipping, active: true, path: "/shipping" },
  { id: 5, label: "배송완료", value: orderCounts.delivered, path: "/delivered" },
  { id: 6, label: "주문 취소", value: orderCounts.cancelled, path: "/cancelled" },
];

/* 주문 리스트 */
const orders = [
  { id: 1, name: "애니 피오르크 미니 프레첼 스낵 150g", host: "사자사자", quantity: 1, date: "2025-11-12", total: "7,000 원" },
  { id: 2, name: "비로드슴 실온 닭가슴살 7종 10팩 골라담기", host: "빈지노", quantity: 2, date: "2025-05-20", total: "12,400 원" },
  { id: 3, name: "연평도 자연 간장게장 100% 알베기 암꽃게 ...", host: "간장게장맛있어요요요", quantity: 2, date: "2025-01-13", total: "23,600 원" },
];

/* ============================================
    🔥 메인 컴포넌트
=============================================== */
function OrderDetail_PaymentCompleted() {
  const navigate = useNavigate();

  return (
    <div style={styles.orderPage}>
      
      {/* 🔥 상단 주문 단계 + SVG 화살표 */}
      <div style={styles.orderSteps}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              style={styles.orderStep}
              onClick={() => step.path && navigate(step.path)}
            >
              <div style={step.active ? styles.stepNumberActive : styles.stepNumber}>
                {step.value}
              </div>
              <div style={styles.stepLabel}>{step.label}</div>
            </div>

            {/* 마지막 단계 전까지 화살표 출력 */}
            {index < steps.length - 1 && (
              <ArrowIcon color={arrowColors[index]} />
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

        <table style={styles.orderTable}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.th}>상품명</th>
              <th style={styles.th}>주최자정보</th>
              <th style={styles.th}>수량</th>
              <th style={styles.th}>주문일</th>
              <th style={styles.th}>주문금액</th>
              <th style={styles.th}>배송정보</th>
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

                <td style={{...styles.td, minWidth: "100px"}}>{order.host}</td>
                <td style={styles.td}>{order.quantity}</td>
                <td style={styles.td}>{order.date}</td>
                <td style={styles.td}>{order.total}</td>

                <td style={styles.td}>
                    <button type="button" style={styles.btnOutline}>
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
    </div>
  );
}

export default OrderDetail_PaymentCompleted;
