// 파일명: UserPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, setInterceptor } from "../assets/setIntercepter";

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
    width: "32px",
    fontWeight: "800",
  },
  labelValue: {
    color: "#000000",
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
  const { nickname } = useParams();

  const [activeTab, setActiveTab] = useState("ongoing");
  const [user, setUser] = useState(null);
  const [ongoingList, setOngoingList] = useState([]);
  const [closedList, setClosedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // 네가 써둔 방식 유지 (토큰 기반)
    const token = localStorage.getItem("accessToken");
    setInterceptor(token);

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await api.get(`/api/user/${nickname}`);
        console.log("📡 /api/user 응답:", res.data);

        // 응답 구조: { profile: { ... } } 라고 했으니까
        const profile = res.data.profile || res.data;
        console.log("🔍 profile 객체:", profile);

        // 🔹 프로필 정보
        setUser(profile);

        // 🔹 공구 리스트 매핑 함수
        const mapPost = (p) => {
          // status가 없을 수도 있어서 안전하게 처리
          let statusLabel = "";
          if (p.status === 2) statusLabel = "마감임박";
          else if (p.status === 3) statusLabel = "마감";

          return {
            id: p.id,
            title: p.title,
            thumbnail: p.image, // "/uploads/post/..." 형태
            quantity:
              p.currentQuantity != null && p.quantity != null
                ? `${p.currentQuantity}/${p.quantity}`
                : p.quantity != null
                ? `${p.quantity}`
                : "",
            period: p.endAt ? p.endAt.split("T")[0] : "",
            status: p.status,
            statusLabel,
            price: p.price,
          };
        };

        const activePosts = profile.activePosts || [];
        const closedPosts = profile.closedPosts || [];

        setOngoingList(activePosts.map(mapPost));
        setClosedList(closedPosts.map(mapPost));
      } catch (err) {
        console.error(err);
        setErrorMsg("유저 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (nickname) {
      fetchData();
    }
  }, [nickname, navigate]);

  const listToShow = activeTab === "ongoing" ? ongoingList : closedList;

  const handleItemClick = (id) => {
    navigate(`/products/${id}`);
  };

  const handleReport = () => {
    navigate("/userreport", {
      state: {
        reportedUserName: nickname,
      },
    });
  };

  // 🔹 프로필 이미지: profileImg 사용
  const avatarSrc =
    user?.profileImg && user.profileImg !== ""
      ? user.profileImg
      : "/images/profilecircle.svg";

  // 🔹 매너점수 텍스트
  const mannerScoreText =
    user?.mannerScore != null ? `${user.mannerScore}점` : "-";

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* 상단 프로필 카드 */}
        <section style={styles.profileCard}>
          <div style={styles.profileLeft}>
            <div style={styles.avatar}>
              {!loading && <img src={avatarSrc} alt="프로필" />}
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.nicknameRow}>
                <span style={styles.nickname}>
                  {loading
                    ? "프로필 불러오는 중..."
                    : user?.nickname ?? nickname}
                </span>
                {!loading && user && (
                  <span style={styles.ratingBadge}>{mannerScoreText}</span>
                )}
              </div>
              <span style={styles.username}>
                {loading ? "" : user?.name ?? ""}
              </span>
              {errorMsg && (
                <span style={{ fontSize: 12, color: "#D32F2F" }}>
                  {errorMsg}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            style={styles.reportButton}
            onClick={handleReport}
          >
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
            {loading ? (
              <div style={styles.emptyText}>불러오는 중입니다...</div>
            ) : listToShow.length === 0 ? (
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
                  onClick={() => handleItemClick(item.id)}
                >
                  <div style={styles.thumb}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={styles.thumbImg}
                    />
                  </div>

                  <div style={styles.itemInfo}>
                    <div style={styles.itemHeaderRow}>
                      <span style={styles.itemTitle}>{item.title}</span>
                      {item.statusLabel && (
                        <span style={styles.dangerBadge}>
                          {item.statusLabel}
                        </span>
                      )}
                    </div>

                    <div style={styles.labelRow}>
                      <span style={styles.label}>수량</span>
                      <span style={styles.labelValue}>{item.quantity}</span>
                    </div>
                    <div style={styles.labelRow}>
                      <span style={styles.label}>기간</span>
                      <span style={styles.labelValue}>{item.period}</span>
                    </div>
                  </div>

                  <div style={styles.priceBox}>
                    {item.price != null
                      ? `${item.price.toLocaleString()} 원`
                      : "-"}
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
