// 파일명: OrderDetail_Cancelled.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, setInterceptor } from "../assets/setIntercepter";

/* ============================================
    🔥 SVG 화살표 아이콘 (기존 코드 유지)
=============================================== */
const ArrowIcon = ({ color = "#b0b0b0" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    style={{ marginTop: "22px" }}
  >
       {" "}
    <path
      d="M8 4l8 8-8 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
     {" "}
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
};

const arrowColors = ["#000000ff", "#828282", "#ffffffff"];

// 백엔드 Status Code
const STATUS_MAP = {
  0: { label: "주문 접수", path: "/order-detail" },
  1: { label: "결제 완료", path: "/received" },
  2: { label: "상품 준비 중", path: "/preparing" },
  3: { label: "배송 중", path: "/shipping" },
  4: { label: "배송 완료", path: "/delivered" },
  6: { label: "주문 취소", path: "/cancelled" },
};

/* ============================================
    🔥 메인 컴포넌트
=============================================== */
function OrderDetail_Cancelled() {
  // ✅ 컴포넌트 이름 변경
  const navigate = useNavigate();

  // 🔥 주문 리스트
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 동적 주문 수량
  const [counts, setCounts] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });

  const activeStatus = 6; // 🔥 현재 페이지의 상태: 주문 취소

  /* ===========================
     1. 주문 목록 및 카운트 불러오기
     - status=6: 주문 취소
  ============================ */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // GET /api/mypage/orders?status=6 호출
      const res = await api.get("/api/mypage/orders", {
        params: {
          status: activeStatus, // 6 = 주문 취소
          page: 0,
        },
      });

      console.log(res);

      const { orders: rawOrders, statusCounts } = res.data; //

      if (statusCounts) {
        setCounts(statusCounts);
      }

      if (!Array.isArray(rawOrders)) {
        setOrders([]);
        return;
      }

      // CanceledOrderListResponseDto 필드에 맞게 매핑
      const mapped = rawOrders.map((o) => {
        const orderedDate = (o.createdAt || "").split("T")[0] || "";
        const canceledDate = (o.canceledAt || "").split("T")[0] || "";

        // 취소 사유 매핑 (백엔드에서 CanceledOrderListResponseDto의 canceledReason 필드를 사용한다고 가정)
        let reasonText = "알 수 없음";
        switch (o.canceledReason) {
          case 0:
            reasonText = "단순변심";
            break;
          case 1:
            reasonText = "공동구매 취소";
            break;
          case 2:
            reasonText = "결제 기한 초과";
            break;
          default:
            reasonText = o.canceledReasonText || "기타 사유"; // 없는 경우 대비
        }

        return {
          id: o.id,
          name: o.postTitle || "상품명 없음",
          host: o.hostNickname || "주최자",
          hostNickname: o.hostNickname,
          quantity: o.quantity ?? 0,
          date: orderedDate,
          canceledDate: canceledDate, // 취소일
          reason: reasonText, // 취소 사유
        };
      });

      setOrders(mapped);
    } catch (err) {
      console.error("주문 내역 조회 실패:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "주문 내역을 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🔥 인증 오류 수정: navigate 대신 실제 토큰을 setInterceptor에 전달
    const token = localStorage.getItem("accessToken");

    if (!token || token === "undefined") {
      navigate("/login");
      return;
    }

    setInterceptor(token);
    fetchOrders();
  }, [navigate]);

  // 동적 steps 배열 생성 (Status 4와 5를 '배송 완료'로 통합하여 표시)
  const steps = [
    {
      id: 0,
      label: STATUS_MAP[0].label,
      value: counts[0] || 0,
      active: false,
      path: STATUS_MAP[0].path,
    },
    {
      id: 1,
      label: STATUS_MAP[1].label,
      value: counts[1] || 0,
      active: false,
      path: STATUS_MAP[1].path,
    },
    {
      id: 2,
      label: STATUS_MAP[2].label,
      value: counts[2] || 0,
      active: false,
      path: STATUS_MAP[2].path,
    },
    {
      id: 3,
      label: STATUS_MAP[3].label,
      value: counts[3] || 0,
      active: false,
      path: STATUS_MAP[3].path,
    },
    {
      id: 4,
      label: STATUS_MAP[4].label,
      value: (counts[4] || 0) + (counts[5] || 0),
      active: false,
      path: STATUS_MAP[4].path,
    },
    {
      id: 6,
      label: STATUS_MAP[6].label,
      value: counts[6] || 0,
      active: true,
      path: STATUS_MAP[6].path,
    }, // 활성 상태
  ];

  return (
    <div style={styles.orderPage}>
      {/* 상단 단계 */}
      <div style={styles.orderSteps}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              style={styles.orderStep}
              onClick={() => step.path && navigate(step.path)}
            >
              <div
                style={
                  step.id === activeStatus
                    ? styles.stepNumberActive
                    : styles.stepNumber
                }
              >
                {step.value}
              </div>
              <div style={styles.stepLabel}>{step.label}</div>
            </div>

            {/* 마지막 단계 전까지 화살표 출력 */}
            {index < steps.length - 2 && (
              <ArrowIcon
                color={
                  step.id === activeStatus ? arrowColors[0] : arrowColors[1]
                }
              />
            )}
            {index == steps.length - 2 && <ArrowIcon color={arrowColors[2]} />}
          </React.Fragment>
        ))}
      </div>

      {/* 주문 내역 테이블 */}
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
              <th style={styles.th}>취소일</th> {/* 🔥 변경된 헤더 */}
              <th style={styles.th}>취소사유</th> {/* 🔥 변경된 헤더 */}
              <th style={styles.th}></th> {/* 문의하기 버튼 자리 비워둠 */}
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
                  취소된 주문이 없습니다.
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
                      cursor: "pointer", // 취소된 주문도 상세 페이지 이동 가능하도록 설정
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
                    onClick={() =>
                      navigate(`/user/${order.hostNickname || order.host}`)
                    }
                  >
                    {order.host}
                  </td>
                  <td style={styles.td}>{order.quantity}</td>
                  <td style={styles.td}>{order.date}</td>

                  {/* 🔥 취소일 및 취소 사유 */}
                  <td style={styles.td}>{order.canceledDate}</td>
                  <td style={styles.td}>{order.reason}</td>

                  {/* 문의하기 버튼 자리 (비워둠) */}
                  <td style={styles.td}>
                    <div style={{ height: "28px" }}></div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderDetail_Cancelled;
