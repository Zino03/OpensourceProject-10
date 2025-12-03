import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, setInterceptor } from "../assets/setIntercepter";

// --- 스타일 컴포넌트 (기존과 동일) ---
const styles = {
  page: { minHeight: "100vh", backgroundColor: "#ffffffff", display: "flex", flexDirection: "column", alignItems: "center" },
  inner: { width: "100%", maxWidth: "1040px", padding: "40px 24px 80px", boxSizing: "border-box" },
  profileCard: { backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e0e0e0", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", minHeight: "160px" },
  profileLeft: { display: "flex", alignItems: "center" },
  avatar: { width: "96px", height: "96px", borderRadius: "50%", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "24px", overflow: "hidden", backgroundColor: "#f7f7f7" },
  profileInfo: { display: "flex", flexDirection: "column", gap: "8px" },
  nicknameRow: { display: "flex", alignItems: "center", gap: "10px" },
  nickname: { fontSize: "20px", fontWeight: 600 },
  ratingBadge: { backgroundColor: "#FF7E00", color: "#fff", fontSize: "12px", padding: "2px 17px", borderRadius: "8px" },
  username: { fontSize: "14px", color: "#000000ff" },
  reportButton: { padding: "5px 15px", borderRadius: "6px", border: "none", backgroundColor: "#D32F2F", color: "#ffffffff", fontSize: "10px", cursor: "pointer", marginRight: "-33px", marginTop: "-170px" },
  sectionHeader: { marginBottom: "16px" },
  sectionTitle: { fontSize: "18px", fontWeight: 600 },
  tabRow: { display: "flex", gap: "24px", marginBottom: "16px", borderBottom: "1px solid #f0f0f0" },
  tab: (active) => ({ padding: "10px 0", fontSize: "15px", cursor: "pointer", position: "relative", color: active ? "#FF7E00" : "#999999", fontWeight: active ? 600 : 400 }),
  tabUnderline: { position: "absolute", left: 0, bottom: 0, width: "100%", height: "2px", backgroundColor: "#FF7E00" },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  itemCard: { display: "flex", alignItems: "center", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e0e0e0", padding: "14px 18px", cursor: "pointer" },
  thumb: { width: "120px", height: "120px", borderRadius: "8px", overflow: "hidden", marginRight: "18px", backgroundColor: "#f7f7f7", flexShrink: 0 },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  itemInfo: { flex: 1, display: "flex", flexDirection: "column", gap: "6px" },
  itemHeaderRow: { display: "flex", alignItems: "center", gap: "10px" },
  itemTitle: { fontSize: "15px", fontWeight: 500 },
  dangerBadge: { fontSize: "10px", color: "#ffffff", backgroundColor: "#D32F2F", padding: "3px 10px", borderRadius: "5px" },
  labelRow: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#333333" },
  label: { width: "32px", fontWeight: "800" },
  labelValue: { color: "#000000" },
  priceBox: { fontSize: "16px", fontWeight: 600, marginLeft: "24px", whiteSpace: "nowrap" },
  emptyText: { fontSize: "14px", color: "#999999", padding: "24px 4px" },
};

// 백엔드 서버 주소 (이미지 표시용)
const BACKEND_URL = "http://192.168.31.28:8080";

const UserPage = () => {
  const navigate = useNavigate();
  const { nickname } = useParams(); // URL 파라미터에서 닉네임 획득

  const [activeTab, setActiveTab] = useState("ongoing");
  const [user, setUser] = useState(null);
  const [ongoingList, setOngoingList] = useState([]);
  const [closedList, setClosedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMyPage, setIsMyPage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const myNickname = localStorage.getItem("userNickname");
    setInterceptor(token);

    // 내 페이지인지 확인
    if(nickname === myNickname) setIsMyPage(true);

    const fetchData = async () => {
      try {
        setLoading(true);
        // ✅ 유저 프로필 조회 API 호출
        const res = await api.get(`/api/user/${nickname}`);
        console.log("유저 조회 결과:", res.data);

        const profileData = res.data.profile; 
        setUser(profileData);

        // 게시글 목록 분류
        const activePosts = profileData.activePosts || [];
        const closedPosts = profileData.closedPosts || [];
        
        setOngoingList(activePosts.map(mapPostData));
        setClosedList(closedPosts.map(mapPostData));

      } catch (err) {
        console.error("유저 정보 조회 실패:", err);
        alert("존재하지 않는 사용자이거나 정보를 불러올 수 없습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (nickname) {
      fetchData();
    }
  }, [nickname, navigate]);

  // 데이터 매핑 헬퍼 함수
  const mapPostData = (p) => {
    let statusLabel = "";
    // 2: 마감임박, 3: 마감
    if (p.status === 2) statusLabel = "마감임박";
    else if (p.status === 3) statusLabel = "마감";

    return {
      id: p.id,
      title: p.title,
      thumbnail: p.image ? (p.image.startsWith('http') ? p.image : `${BACKEND_URL}${p.image}`) : "/images/sajasaja.png",
      quantity: `${p.currentQuantity}/${p.quantity}`,
      period: p.endAt ? p.endAt.substring(0, 10) : "",
      status: p.status,
      statusLabel,
      price: p.price,
    };
  };

  const listToShow = activeTab === "ongoing" ? ongoingList : closedList;

  const handleItemClick = (id) => {
    navigate(`/products/${id}`);
  };

  // ✅ 신고하기 버튼 클릭 -> UserReport 페이지로 이동 (데이터 전달)
  const handleReport = () => {
    navigate("/userreport", {
      state: {
        reportedUserName: nickname
      }
    });
  };

  // 프로필 이미지 처리
  const avatarSrc = user?.profileImg && user.profileImg !== ""
      ? (user.profileImg.startsWith('http') ? user.profileImg : `${BACKEND_URL}${user.profileImg}`)
      : "/images/profilecircle.svg";

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <section style={styles.profileCard}>
          <div style={styles.profileLeft}>
            <div style={styles.avatar}>
              {!loading && (
                <img
                  src={avatarSrc}
                  alt="프로필"
                />
              )}
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.nicknameRow}>
                <span style={styles.nickname}>
                  {loading ? "프로필 불러오는 중..." : user?.nickname ?? nickname}
                </span>
                {!loading && user && (
                  <span style={styles.ratingBadge}>{user.mannerScore || 0}점</span>
                )}
              </div>
              <span style={styles.username}>{user?.name}</span>
            </div>
          </div>

          {/* 본인이 아닐 때만 신고 버튼 표시 */}
          {!isMyPage && (
            <button type="button" style={styles.reportButton} onClick={handleReport}>
                신고하기
            </button>
          )}
        </section>

        <section>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>최근 공구 활동</h2>
          </div>
          <div style={styles.tabRow}>
            <div
              style={styles.tab(activeTab === "ongoing")}
              onClick={() => setActiveTab("ongoing")}
            >
              진행 중
              {activeTab === "ongoing" && (
                <div style={styles.tabUnderline} />
              )}
            </div>
            <div
              style={styles.tab(activeTab === "closed")}
              onClick={() => setActiveTab("closed")}
            >
              마감
              {activeTab === "closed" && (
                <div style={styles.tabUnderline} />
              )}
            </div>
          </div>

          <div style={styles.list}>
            {listToShow.length === 0 ? (
              <div style={styles.emptyText}>
                {activeTab === "ongoing" ? "진행 중인 공구가 없습니다." : "마감된 공구가 없습니다."}
              </div>
            ) : (
              listToShow.map((item) => (
                <div key={item.id} style={styles.itemCard} onClick={() => handleItemClick(item.id)}>
                  <div style={styles.thumb}>
                    <img src={item.thumbnail} alt={item.title} style={styles.thumbImg} onError={(e) => e.target.src="/images/sajasaja.png"} />
                  </div>
                  <div style={styles.itemInfo}>
                    <div style={styles.itemHeaderRow}>
                      <span style={styles.itemTitle}>{item.title}</span>
                      {item.statusLabel && <span style={styles.dangerBadge}>{item.statusLabel}</span>}
                    </div>
                    <div style={styles.labelRow}><span style={styles.label}>수량</span><span style={styles.labelValue}>{item.quantity}</span></div>
                    <div style={styles.labelRow}><span style={styles.label}>기간</span><span style={styles.labelValue}>{item.period}</span></div>
                  </div>
                  <div style={styles.priceBox}>{item.price.toLocaleString()} 원</div>
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