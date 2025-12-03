// 파일명: MyGroupPurchase.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, BASE_URL, setInterceptor } from "../assets/setIntercepter";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inner: {
    width: "100%",
    maxWidth: "1120px",
    padding: "40px 24px 80px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "24px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: (disabled) => ({
    display: "flex",
    alignItems: "center",
    padding: "18px 20px",
    borderBottom: "1px solid #f0f0f0",
    cursor: disabled ? "default" : "pointer",
    filter: disabled ? "grayscale(0.8)" : "none",
    opacity: disabled ? 0.7 : 1,
  }),
  thumb: {
    width: "120px",
    height: "120px",
    borderRadius: "8px",
    overflow: "hidden",
    marginRight: "18px",
    flexShrink: 0,
    backgroundColor: "#f7f7f7",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  productTitle: {
    fontSize: "15px",
    fontWeight: 500,
  },
  badge: (type) => {
    const map = {
      waiting: { bg: "#fbcda4ff", color: "#ffffffff" },
      ongoing: { bg: "#ffb347", color: "#fff" },
      closing: { bg: "#ff9800", color: "#fff" },
      closed: { bg: "#ff7e00", color: "#fff" },
      rejected: { bg: "#828282ff", color: "#fff" },
      cancelled: { bg: "#000", color: "#fff" },
    };
    const { bg, color } = map[type] || map.waiting;
    return {
      backgroundColor: bg,
      color,
      fontSize: "10px",
      padding: "3px 17px",
      borderRadius: "6px",
      fontWeight: "650",
    };
  },
  labelBlock: {
    marginTop: "6px",
    fontSize: "12px",
    color: "#333",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  labelRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  label: {
    width: "32px",
    fontWeight: 800,
  },
  labelValue: {
    color: "#000",
  },
  priceBox: {
    minWidth: "190px",
    marginLeft: "24px",
    textAlign: "right",
    fontSize: "13px",
  },
  price: {
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "16px",
  },
  settleRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    fontSize: "13px",
  },
  settleLabel: {
    color: "#555",
    fontWeight: 650,
  },
  settleAmount: {
    color: "#999",
  },
  emptyBox: {
    padding: "40px 0",
    textAlign: "center",
    color: "#888",
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
};

const MyGroupPurchase = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const ENDPOINT = "/api/mypage/posts"; // ⭐ 백엔드에서 제공하는 실제 엔드포인트로 수정

  const statusMapping = (status) => {
    switch (status) {
      case 0:
        return { label: "대기", type: "waiting", disabled: false };
      case 1:
        return { label: "진행중", type: "ongoing", disabled: false };
      case 2:
        return { label: "마감임박", type: "closing", disabled: false };
      case 3:
        return { label: "마감", type: "closed", disabled: false };
      case 4:
        return { label: "반려", type: "rejected", disabled: true };
      case 5:
        return { label: "공구취소", type: "cancelled", disabled: true };
      default:
        return { label: "대기", type: "waiting", disabled: false };
    }
  };

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || !setInterceptor(token)) {
        navigate("/login");
        return;
      }

      setLoading(true);
      const res = await api.get(ENDPOINT);

      console.log(res.data);

      const raw = Array.isArray(res.data) ? res.data : res.data.content || [];

      const mapped = raw.map((item) => {
        const s = statusMapping(item.status);

        return {
          id: item.id,
          title: item.title,
          thumbnail: `${BASE_URL}${item.image}`,
          endDate: item.endAt?.slice(0, 10), // yyyy-MM-dd
          price: item.price,
          qtyCurrent: item.currentQuantity,
          qtyTotal: item.quantity,
          settleAmount: item.receivedPrice,
          statusLabel: s.label,
          statusType: s.type,
          disabled: s.disabled,
        };
      });

      console.log(mapped);

      setGroups(mapped);
    } catch (err) {
      console.error("MY공구 조회 실패:", err);
      alert("내가 주최한 공구 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleClickGroup = (g) => {
    if (g.disabled) return;
    navigate(`/products/${g.id}`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <h1 style={styles.title}>MY공구</h1>

        {loading ? (
          <div style={styles.emptyBox}>로딩 중...</div>
        ) : groups.length === 0 ? (
          <div style={styles.emptyBox}>내가 주최한 공동구매가 없습니다.</div>
        ) : (
          <div style={styles.list}>
            {groups.map((g) => (
              <div
                key={g.id}
                style={styles.card(g.disabled)}
                onClick={() => handleClickGroup(g)}
              >
                <div style={styles.thumb}>
                  <img
                    src={g.thumbnail || "/images/sample-product.png"}
                    alt=""
                    style={styles.thumbImg}
                  />
                </div>

                <div style={styles.info}>
                  <div style={styles.titleRow}>
                    <span style={styles.productTitle}>{g.title}</span>
                    <span style={styles.badge(g.statusType)}>
                      {g.statusLabel}
                    </span>
                  </div>

                  <div style={styles.labelBlock}>
                    <div style={styles.labelRow}>
                      <span style={styles.label}>수량</span>
                      <span style={styles.labelValue}>
                        {g.qtyCurrent}/{g.qtyTotal}
                      </span>
                    </div>

                    <div style={styles.labelRow}>
                      <span style={styles.label}>기간</span>
                      <span style={styles.labelValue}>~{g.endDate}</span>
                    </div>
                  </div>
                </div>

                <div style={styles.priceBox}>
                  <div style={styles.price}>{g.price.toLocaleString()} 원</div>

                  <div style={styles.settleRow}>
                    <span style={styles.settleLabel}>정산예정금액</span>
                    <span style={styles.settleAmount}>
                      {g.settleAmount.toLocaleString()} 원
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGroupPurchase;
