  // 파일명: OrderDetail_OrderReceived.jsx
  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import CancelModal from "./modal/CancelModal";
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

  const arrowColors = ["#000000ff", "#828282", "#828282", "#828282", "#ffffffff"];

  const orderCounts = {
    received: 4,
    payment: 4,
    preparing: 4,
    shipping: 3,
    delivered: 4,
    cancelled: 4,
  };

  /* 현재 페이지는 "주문 접수"라고 가정 (1번 단계 active) */
  const steps = [
    { id: 1, label: "주문 접수", value: orderCounts.received, active: true, path: "/order-detail" },
    { id: 2, label: "결제 완료", value: orderCounts.payment, path: "/received" },
    { id: 3, label: "상품 준비 중", value: orderCounts.preparing, path: "/preparing" },
    { id: 4, label: "배송 중", value: orderCounts.shipping, path: "/shipping" },
    { id: 5, label: "배송완료", value: orderCounts.delivered, path: "/delivered" },
    { id: 6, label: "주문 취소", value: orderCounts.cancelled, path: "/cancelled" },
  ];

  /* ============================================
      🔥 메인 컴포넌트 (주문 접수 리스트)
  =============================================== */
  function OrderDetailOrderReceived() {
    const navigate = useNavigate();

    // 🔥 주문 리스트 (백엔드에서 가져올 것)
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    // 🔥 모달 on/off + 어떤 주문을 취소할지
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    /* ===========================
        1. 페이지 진입 시 주문 목록 불러오기
          - status=0: 주문 접수
    ============================ */
    useEffect(() => {
      // 다른 페이지들처럼 interceptor 설정(토큰/401 처리 등)
      setInterceptor(navigate);

      const fetchOrders = async () => {
        try {
          setLoading(true);
          setErrorMsg("");

          const res = await api.get("/api/mypage/orders", {
            params: {
              status: 0, // 🔥 0 = 주문 접수
              page: 0,
            },
          });

          console.log("📡 /api/mypage/orders 응답:", res.data);

          // 👉 응답 형태에 따라 파싱
          // 1) Page 형태: { content: [...] }
          // 2) data 안에 들어있는 경우: { data: { content: [...] } }
          const rawList =
            res.data?.content ||
            res.data?.data?.content ||
            res.data?.data ||
            res.data;

          if (!Array.isArray(rawList)) {
            console.warn("예상과 다른 응답 형식:", rawList);
            setOrders([]);
            return;
          }

          // 🔥 백엔드 DTO 필드명에 맞게 매핑
          //   아래는 예시야. 실제 필드명 보고 조금만 수정하면 됨.
          //   예: id, postTitle, hostNickname, quantity, createdAt, totalPrice ...
          const mapped = rawList.map((o) => {
            const buyerId = o.id; // 주문(구매) ID (UserController에서 buyerId로 쓰는 것)
            const productName = o.postTitle || o.title || "상품명 없음";
            const hostNickname = o.hostNickname || o.host || "주최자";
            const qty = o.quantity ?? o.count ?? 0;
            const orderedDate =
              (o.createdAt || o.orderedAt || "").split("T")[0] || "";
            const totalPrice =
              o.totalPrice ?? o.amount ?? o.price ?? 0;

            return {
              id: buyerId,
              name: productName,
              host: hostNickname,
              hostNickname, // 프로필 페이지 이동 시 사용
              quantity: qty,
              date: orderedDate,
              total: `${Number(totalPrice).toLocaleString()} 원`,
            };
          });

          setOrders(mapped);
        } catch (err) {
          console.error(err);
          setErrorMsg("주문 내역을 불러오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [navigate]);

    /* ===========================
        2. 취소 모달 열기 / 닫기
    ============================ */
    const openCancelModal = (order) => {
      setSelectedOrder(order);
      setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
      setIsCancelModalOpen(false);
      setSelectedOrder(null);
    };

    /* ===========================
        3. 실제 주문 취소 API 호출
          - PATCH /api/mypage/order/{buyerId}/cancel
    ============================ */
    const handleConfirmCancel = async () => {
      if (!selectedOrder) return;

      try {
        // 🔥 백엔드 UserController 기준 (buyerId 사용)
        await api.patch(`/api/mypage/order/${selectedOrder.id}/cancel`);

        // 화면에서도 해당 주문 제거 or 다시 조회
        setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));

        closeCancelModal();
      } catch (err) {
        console.error(err);
        alert("주문 취소 중 오류가 발생했습니다.");
      }
    };

    return (
      <div style={styles.orderPage}>
        {/* 🔥 상단 주문 단계 + svg 화살표 */}
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

        {/* ============================
            주문 내역 테이블
        ============================ */}
        <div style={styles.orderListWrapper}>
          <div style={styles.orderListHeader}>
            <h2 style={styles.orderListTitle}>주문 내역</h2>
            <span style={styles.orderListNotice}>
              상품 준비가 시작되면 주문 취소가 어렵습니다.
            </span>
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
                <th style={styles.th}>주문취소</th>
                <th style={styles.th}>문의하기</th>
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
                    주문 접수 상태의 주문이 없습니다.
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
                      // ✅ 주최자 닉네임으로 유저 프로필 이동
                      onClick={() =>
                        navigate(`/user/${order.hostNickname || order.host}`)
                      }
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
                        onClick={() => openCancelModal(order)}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 🔥 주문 취소 모달 */}
        <CancelModal
          isOpen={isCancelModalOpen}
          onClose={closeCancelModal}
          onConfirm={handleConfirmCancel}
        />
      </div>
    );
  }

  export default OrderDetailOrderReceived;
