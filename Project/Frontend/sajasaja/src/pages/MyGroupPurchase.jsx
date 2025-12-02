// 파일명: MyGroupPerchase.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#ffffffff",
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
    cursor: "pointer",
    filter: disabled ? "grayscale(0.9)" : "none",
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

  // 가운데 영역
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
      waiting: { bg: "#ffe0b3", color: "#ff7e00" }, // 대기
      ongoing: { bg: "#ffb347", color: "#ffffff" }, // 진행중
      closed: { bg: "#ff7e00", color: "#ffffff" }, // 마감
      rejected: { bg: "#b0b0b0", color: "#ffffff" }, // 반려
      cancelled: { bg: "#000000", color: "#ffffff" }, // 공구취소
    };
    const { bg, color } = map[type] || map.waiting;
    return {
      backgroundColor: bg,
      color,
      fontSize: "10px",
      padding: "3px 17px",
      borderRadius: "6px",
      whiteSpace: "nowrap",
      fontWeight: "650",
    };
  },

  labelBlock: {
    marginTop: "6px",
    fontSize: "12px",
    color: "#333333",
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
    fontWeight: 850, // 수량 / 기간 굵게
  },
  labelValue: {
    color: "#000000",
  },

  // 오른쪽 금액 영역
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

  // 🔥 정산 라인 (한 줄)
  settleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",  // ← 핵심!
    marginTop: "4px",
    gap: "15px",
  },
  settleLabel: {
    color: "#555555",
    fontSize: "13px",
    fontWeight: "650",
  },
  settleAmount: {
    color: "#999999",
    fontSize: "13px",
  },
};

const groups = [
  {
    id: 1,
    title: "[아이앤비] 섬유유연제 건조기 시트 80매",
    statusLabel: "대기",
    statusType: "waiting",
    qtyCurrent: 0,
    qtyTotal: 100,
    endDate: "~25-12-06",
    price: 5400,
    settleAmount: 0,
    disabled: false,
  },
  {
    id: 2,
    title: "[아이앤비] 섬유유연제 건조기 시트 80매",
    statusLabel: "진행중",
    statusType: "ongoing",
    qtyCurrent: 87,
    qtyTotal: 100,
    endDate: "~25-12-06",
    price: 5400,
    settleAmount: 56000,
    disabled: false,
  },
  {
    id: 3,
    title: "[아이앤비] 섬유유연제 건조기 시트 80매",
    statusLabel: "마감",
    statusType: "closed",
    qtyCurrent: 100,
    qtyTotal: 100,
    endDate: "~25-12-06",
    price: 5400,
    settleAmount: 56000,
    disabled: false,
  },
  {
    id: 4,
    title: "[아이앤비] 섬유유연제 건조기 시트 80매",
    statusLabel: "반려",
    statusType: "rejected",
    qtyCurrent: 87,
    qtyTotal: 100,
    endDate: "~25-12-06",
    price: 5400,
    settleAmount: 56000,
    disabled: true,
  },
  {
    id: 5,
    title: "[아이앤비] 섬유유연제 건조기 시트 80매",
    statusLabel: "공구취소",
    statusType: "cancelled",
    qtyCurrent: 87,
    qtyTotal: 100,
    endDate: "~25-12-06",
    price: 5400,
    settleAmount: 56000,
    disabled: true,
  },
];

const MyGroupPurchase = () => {
  const navigate = useNavigate();

  const handleClickGroup = (id) => {
    // 전체 카드 클릭 시 → 공구 상세로 이동 (현재는 /products/1로 통일)
    navigate("/products/1");
    // 필요하면 나중에: navigate(`/products/${id}`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <h1 style={styles.title}>MY공구</h1>

        <div style={styles.list}>
          {groups.map((g) => (
            <div
              key={g.id}
              style={styles.card(g.disabled)}
              onClick={() => handleClickGroup(g.id)}
            >
              <div style={styles.thumb}>
                <img
                  src="/images/sample-product.png" // 썸네일 이미지 경로 맞게 수정
                  alt={g.title}
                  style={styles.thumbImg}
                  // onError={(e) => {
                  //   e.currentTarget.src = "/images/sample-product-fallback.png";
                  // }}
                />
              </div>

              <div style={styles.info}>
                <div style={styles.titleRow}>
                  <span style={styles.productTitle}>{g.title}</span>
                  <span style={styles.badge(g.statusType)}>{g.statusLabel}</span>
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
                    <span style={styles.labelValue}>{g.endDate}</span>
                  </div>
                </div>
              </div>

              <div style={styles.priceBox}>
                <div style={styles.price}>
                  {g.price.toLocaleString()} 원
                </div>
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
      </div>
    </div>
  );
};

export default MyGroupPurchase;
