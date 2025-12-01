// 파일명: UserPage.jsx
import React, { useState } from "react";
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
    maxWidth: "1040px",
    padding: "40px 24px 80px",
    boxSizing: "border-box",
  },

  /* ===== 프로필 카드 ===== */
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    padding: "24px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
    minHeight: "160px",
  },
  profileLeft: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    border: "1px solid #e0e0e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "24px",
    overflow: "hidden",
    backgroundColor: "#f7f7f7",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  nicknameRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  nickname: {
    fontSize: "20px",
    fontWeight: 600,
  },
  ratingBadge: {
    backgroundColor: "#FF7E00",
    color: "#fff",
    fontSize: "12px",
    padding: "2px 17px",
    borderRadius: "8px",
  },
  username: {
    fontSize: "14px",
    color: "#000000ff",
  },
  reportButton: {
    padding: "5px 15px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#D32F2F",
    color: "#ffffffff",
    fontSize: "10px",
    cursor: "pointer",
    marginRight: "-33px",
    marginTop: "-170px",
  },

  /* ===== 최근 공구 활동 ===== */
  sectionHeader: {
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 600,
  },
  tabRow: {
    display: "flex",
    gap: "24px",
    marginBottom: "16px",
    borderBottom: "1px solid #f0f0f0",
  },
  tab: (active) => ({
    padding: "10px 0",
    fontSize: "15px",
    cursor: "pointer",
    position: "relative",
    color: active ? "#FF7E00" : "#999999",
    fontWeight: active ? 600 : 400,
  }),
  tabUnderline: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "2px",
    backgroundColor: "#FF7E00",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  /* ===== 공구 카드 ===== */
  itemCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    padding: "14px 18px",
    cursor: "pointer",
  },
  thumb: {
    width: "120px",
    height: "120px",
    borderRadius: "8px",
    overflow: "hidden",
    marginRight: "18px",
    backgroundColor: "#f7f7f7",
    flexShrink: 0,
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  itemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  itemHeaderRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  itemTitle: {
    fontSize: "15px",
    fontWeight: 500,
  },
  dangerBadge: {
    fontSize: "10px",
    color: "#ffffff",
    backgroundColor: "#D32F2F",
    padding: "3px 10px",
    borderRadius: "5px",
  },
  labelRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#333333",
  },
  label: {
    width: "32px", // "수량", "기간" 정렬
    fontWeight: "800",
  },
  labelValue: {
    color: "#000000",
  },
  dateText: {
    fontSize: "12px",
    color: "#999999",
  },
  priceBox: {
    fontSize: "16px",
    fontWeight: 600,
    marginLeft: "24px",
    whiteSpace: "nowrap",
  },
  emptyText: {
    fontSize: "14px",
    color: "#999999",
    padding: "24px 4px",
  },
};

const UserPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ongoing"); // "ongoing" | "closed"

  // 유저 정보 (예시)
  const user = {
    nickname: "양념게장맛있어",
    rating: "4.67점",
    name: "최지우",
    avatar: "/images/profilecircle.svg",
  };

  // 진행 중 공구 리스트 (예시)
  const ongoingList = [
    {
      id: 1,
      title: "[아이앤비] 섬유유연제 건조기 시트 80매",
      quantity: "0/100",
      period: "~25-12-06",
      statusLabel: "마감임박",
      price: 5400,
      thumbnail: "/images/sample-product.png",
    },
    {
      id: 2,
      title: "[아이앤비] 섬유유연제 건조기 시트 80매",
      quantity: "0/100",
      period: "~25-12-06",
      statusLabel: "마감임박",
      price: 5400,
      thumbnail: "/images/sample-product.png",
    },
  ];

  const closedList = []; // 마감 탭 예시 (비워둠)

  const listToShow = activeTab === "ongoing" ? ongoingList : closedList;

  // ✅ 공구 카드 클릭 시 /products 로 이동
  const handleItemClick = () => {
    navigate("/products/1");
  };

  const handleReport = () => {
    alert("신고하기 클릭");
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* 상단 프로필 카드 */}
        <section style={styles.profileCard}>
          <div style={styles.profileLeft}>
            <div style={styles.avatar}>
              <img
                src={user.avatar}
                alt="프로필"
                style={styles.avatarImg}
                onError={(e) => {
                  e.currentTarget.src = "/images/filledprofile.svg";
                }}
              />
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.nicknameRow}>
                <span style={styles.nickname}>{user.nickname}</span>
                <span style={styles.ratingBadge}>{user.rating}</span>
              </div>
              <span style={styles.username}>{user.name}</span>
            </div>
          </div>

          <button type="button" style={styles.reportButton} onClick={handleReport}>
            신고하기
          </button>
        </section>

        {/* 최근 공구 활동 */}
        <section>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>최근 공구 활동</h2>
          </div>

          {/* 탭 */}
          <div style={styles.tabRow}>
            <div
              style={styles.tab(activeTab === "ongoing")}
              onClick={() => setActiveTab("ongoing")}
            >
              진행 중
              {activeTab === "ongoing" && <div style={styles.tabUnderline} />}
            </div>
            <div
              style={styles.tab(activeTab === "closed")}
              onClick={() => setActiveTab("closed")}
            >
              마감
              {activeTab === "closed" && <div style={styles.tabUnderline} />}
            </div>
          </div>

          {/* 공구 리스트 */}
          <div style={styles.list}>
            {listToShow.length === 0 ? (
              <div style={styles.emptyText}>
                {activeTab === "ongoing"
                  ? "진행 중인 공구가 없습니다."
                  : "마감된 공구가 없습니다."}
              </div>
            ) : (
              listToShow.map((item) => (
                <div
                  key={item.id}
                  style={styles.itemCard}
                  onClick={handleItemClick}
                >
                  <div style={styles.thumb}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={styles.thumbImg}
                      onError={(e) => {
                        e.currentTarget.src = "/images/sample-product-fallback.png";
                      }}
                    />
                  </div>

                  <div style={styles.itemInfo}>
                    {/* 제목 + 마감임박 배지 */}
                    <div style={styles.itemHeaderRow}>
                      <span style={styles.itemTitle}>{item.title}</span>
                      {item.statusLabel && (
                        <span style={styles.dangerBadge}>{item.statusLabel}</span>
                      )}
                    </div>

                    {/* 수량, 기간 */}
                    <div style={styles.labelRow}>
                      <span style={styles.label}>수량</span>
                      <span style={styles.labelValue}>{item.quantity}</span>
                    </div>
                    <div style={styles.labelRow}>
                      <span style={styles.label}>기간</span>
                      <span style={styles.labelValue}>{item.period}</span>
                    </div>
                  </div>

                  {/* 가격 */}
                  <div style={styles.priceBox}>
                    {item.price.toLocaleString()} 원
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserPage;
