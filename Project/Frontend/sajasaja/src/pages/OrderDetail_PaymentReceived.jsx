// 파일명: OrderDetail_PaymentCompleted.jsx
import React from "react";

const styles = {
  orderPage: {
    maxWidth: "1200px",
    margin: "60px auto",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Noto Sans KR", system-ui, sans-serif',
    color: "#222",
  },
  orderSteps: {
    display: "flex",
    alignItems: "flex-start",
    gap: "28px",
    marginBottom: "50px",
  },
  orderStep: {
    textAlign: "center",
  },
  stepNumber: {
    fontSize: "40px",
    fontWeight: 300,
    color: "#b0b0b0",
    lineHeight: 1,
  },
  stepNumberActive: {
    fontSize: "40px",
    fontWeight: 700,
    color: "#000",
    lineHeight: 1,
  },
  stepLabel: {
    fontSize: "13px",
    marginTop: "8px",
    color: "#555",
  },
  stepArrow: {
    fontSize: "20px",
    color: "#b0b0b0",
    marginTop: "8px",
  },
  orderListWrapper: {
    marginTop: "20px",
  },
  orderListHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "14px",
  },
  orderListTitle: {
    fontSize: "16px",
    fontWeight: 700,
  },
  orderListNotice: {
    fontSize: "12px",
    color: "#D32F2F",
  },
  orderTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  tableHeadRow: {
    borderBottom: "1px solid #e1e1e1",
  },
  th: {
    padding: "14px 10px",
    textAlign: "left",
    fontWeight: 600,
    color: "#555",
  },
  td: {
    padding: "14px 10px",
    textAlign: "left",
  },
  bodyRow: {
    borderBottom: "1px solid #f1f1f1",
  },
  lastBodyRow: {
    borderBottom: "1px solid #e1e1e1",
  },
  productName: {
    maxWidth: "280px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  orderActions: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-start",
  },
  btnOutline: {
    minWidth: "90px",
    padding: "6px 14px",
    fontSize: "12px",
    borderRadius: "20px",
    cursor: "pointer",
    border: "1px solid #000000ff",
    backgroundColor: "#ffffffff",
    color: "#444",
    transition: "all 0.15s ease-in-out",
  },
  btnFilled: {
    minWidth: "90px",
    padding: "6px 14px",
    fontSize: "12px",
    borderRadius: "20px",
    cursor: "pointer",
    border: "1px solid #FF7E00",
    backgroundColor: "#FF7E00",
    color: "#fff",
    transition: "all 0.15s ease-in-out",
  },
};

// 2번째 단계(결제 완료)만 active=true
const steps = [
  { id: 1, label: "주문 접수", value: 4 },
  { id: 2, label: "결제 완료", value: 4, active: true },
  { id: 3, label: "상품 준비 중", value: 4 },
  { id: 4, label: "배송 중", value: 3 },
  { id: 5, label: "배송완료", value: 4 },
  { id: 6, label: "주문 취소", value: 4 },
];

// 더미 주문 데이터
const orders = [
  {
    id: 1,
    name: "애니 피오르크 미니 프레첼 스낵 150g",
    host: "사자사자",
    quantity: 1,
    date: "2025-11-12",
    total: "7,000 원",
  },
  {
    id: 2,
    name: "비로드슴 실온 닭가슴살 7종 10팩 골라담기",
    host: "빈지노",
    quantity: 2,
    date: "2025-05-20",
    total: "12,400 원",
  },
  {
    id: 3,
    name: "연평도 자연 간장게장 100% 알베기 암꽃게 ...",
    host: "간장게장맛있어",
    quantity: 2,
    date: "2025-01-13",
    total: "23,600 원",
  },
  {
    id: 4,
    name: "[아이앤비] 섬유유연제 건조기",
    host: "김우민호",
    quantity: 1,
    date: "2025-01-07",
    total: "5,200 원",
  },
];

function OrderDetail_PaymentCompleted() {
  return (
    <div style={styles.orderPage}>
      {/* 상단 단계 표시 */}
      <div style={styles.orderSteps}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div style={styles.orderStep}>
              <div
                style={
                  step.active ? styles.stepNumberActive : styles.stepNumber
                }
              >
                {step.value}
              </div>
              <div style={styles.stepLabel}>{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div style={styles.stepArrow}>&gt;</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 주문 내역 테이블 */}
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
              <th style={styles.th}>주최자 정보</th>
              <th style={styles.th}>수량</th>
              <th style={styles.th}>주문 일</th>
              <th style={styles.th}>주문 금액</th>
              <th style={styles.th}>주문 취소</th>
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
                <td style={{ ...styles.td, ...styles.productName }}>
                  {order.name}
                </td>
                <td style={styles.td}>{order.host}</td>
                <td style={styles.td}>{order.quantity}</td>
                <td style={styles.td}>{order.date}</td>
                <td style={styles.td}>{order.total}</td>
                <td style={styles.td}>
                  <div style={styles.orderActions}>
                    <button type="button" style={styles.btnOutline}>
                      주문 취소
                    </button>
                    <button type="button" style={styles.btnFilled}>
                      문의하기
                    </button>
                  </div>
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
