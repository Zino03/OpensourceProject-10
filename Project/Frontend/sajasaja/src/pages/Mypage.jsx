// 파일명: MyPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

/* 👉 오른쪽 화살표 아이콘 */
const ChevronRight = ({ size = 18, color = "#c8c8c8" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M9 6l6 6-6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
  title: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "10px", //블럭 사이 간격
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: "16px 16px 0 0",
    border: "1px solid #e0e0e0",
    padding: "20px 40px",
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    height: "160px", // 원하는 세로 높이
  },
  avatar: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "24px",
    overflow: "hidden", // 이미지 넘침 방지
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "-8px",
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

  // 메뉴 리스트
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: "0 0 16px 16px",
    border: "1px solid #e0e0e0",
    overflow: "hidden",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 24px",
    fontSize: "15px",
    cursor: "pointer",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e0e0e0", // ✅ # 추가해서 선 다시 보이도록 수정
  },
};

const MyPage = () => {
  const navigate = useNavigate();

  // ✅ 1) 여기서 "사용자가 업로드한 프로필 사진"을 가져온다고 가정
  const userProfileImage = localStorage.getItem("user_profile_img");
  // ↑ 내 정보 수정 페이지에서 업로드 후 여기에 setItem 해둔다고 가정

  // ✅ 2) 기본 프로필 이미지 (public/images 안에 있어야 함)
  const defaultProfileCircle = "/images/profilecircle.svg";
  const defaultProfileFilled = "/images/filledprofile.svg";

  // ✅ 3) 최종 사용할 이미지 (업로드 > 기본 circle > 기본 filled)
  const profileImageSrc = userProfileImage || defaultProfileCircle;

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* 상단 타이틀 */}
        <h1 style={styles.title}>마이페이지</h1>

        {/* 프로필 카드 */}
        <section style={styles.profileCard}>
          <div style={styles.avatar}>
            {/* ✅ 업로드된 이미지 OR 기본 SVG 표시 */}
            <img
              src={profileImageSrc}
              alt="프로필"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                // 이미지 로드 실패 시 filledprofile로 교체
                e.currentTarget.src = defaultProfileFilled;
              }}
            />
          </div>

          <div style={styles.profileInfo}>
            <div style={styles.nicknameRow}>
              <span style={styles.nickname}>간장게장맛있어</span>
              <span style={styles.ratingBadge}>4.67점</span>
            </div>
            <span style={styles.username}>최지우</span>
          </div>
        </section>

        {/* 메뉴 리스트 */}
        <section style={styles.menuCard}>
  <div
    style={styles.menuItem}
    onClick={() => handleClick("/myprofile")}
  >
    <span>프로필 수정</span>
    <ChevronRight />
  </div>
  <div style={styles.divider} />

  <div
    style={styles.menuItem}
    onClick={() => handleClick("/mygroupperchase")}
  >
    <span>MY 공구</span>
    <ChevronRight />
  </div>
  <div style={styles.divider} />

  <div
    style={styles.menuItem}
    onClick={() => handleClick("/order-detail")}
  >
    <span>주문 내역</span>
    <ChevronRight />
  </div>
  <div style={styles.divider} />

  <div
    style={styles.menuItem}
    onClick={() => handleClick("/mydelivery")}
  >
    <span>배송지 관리</span>
    <ChevronRight />
  </div>
  {/* ❌ 마지막 divider 삭제 */}
</section>

      </div>
    </div>
  );
};

export default MyPage;
