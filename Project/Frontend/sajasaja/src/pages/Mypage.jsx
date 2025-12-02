// 파일명: MyPage.jsx (수정됨)

import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
// api, setInterceptor 임포트
import { api, setInterceptor } from "../assets/setIntercepter"; 

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
// ... (styles 구현 생략)
// ... (스타일 코드는 변경하지 않았습니다.)
  divider: {
    height: "1px",
    backgroundColor: "#e0e0e0", 
  },
};

const MyPage = () => {
  const navigate = useNavigate();
  
  // State 추가: 사용자 정보를 저장
  const [memberInfo, setMemberInfo] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  // ⭐️ FIX: 사용되는 모든 상수를 컴포넌트 스코프 내부에 정의했습니다. (no-undef 해결)
  const userNickname = localStorage.getItem("user_nickname"); // 🚨 로그인 시 닉네임을 저장해야 합니다.
  const defaultProfileCircle = "/images/profilecircle.svg";
  const defaultProfileFilled = "/images/filledprofile.svg";

  //  useEffect: 컴포넌트 마운트 시 사용자 정보 fetch
  useEffect(() => {
    const fetchMemberInfo = async () => {
      const token = localStorage.getItem('accessToken');
      
      // 1. 필수 인증 확인
      if (!token || !userNickname || !setInterceptor(token)) { 
          setIsLoading(false);
          console.error("인증 토큰 또는 닉네임 없음. 로그인이 필요합니다.");
          navigate('/login'); 
          return;
      } 
      
      setIsLoading(true);
      try {
        // '/api/user/{nickname}' 엔드포인트는 ProfileResponseDto를 반환합니다.
        const response = await api.get(`/api/user/${userNickname}`);

        setMemberInfo(response.data);
      } catch (error) {
        console.error("프로필 정보 조회 실패:", error);
        if (error.response && error.response.status === 401) {
            navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberInfo();
  }, [navigate, userNickname]); // userNickname을 의존성 배열에 추가하여 ESLint 경고 방지

  const handleClick = (path) => {
    navigate(path);
  };
  
  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.inner}>
          <h1 style={styles.title}>마이페이지</h1>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: '#FF7E00', fontWeight: '600' }}>정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  // ⭐️ FIX: 로드된 데이터로 사용할 변수를 계산합니다. (no-unused-vars 제거)
  const nickname = memberInfo?.nickname || "사용자";
  const username = memberInfo?.name || "이름 정보 없음";
  
  // 매너 점수 (ProfileResponseDto에 mannerScore가 Double 타입으로 존재)
  // FIX: mannerScore 변수를 JSX에서 사용하도록 수정하여 경고 제거
  const mannerScore = memberInfo?.mannerScore !== undefined && memberInfo.mannerScore !== -1.0 
      ? memberInfo.mannerScore.toFixed(2) : "N/A";
  
  // 프로필 이미지 (FIX: profileImage 변수를 JSX에서 사용하도록 수정하여 경고 제거)
  const profileImage = memberInfo?.profileImg || defaultProfileCircle;


  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* 상단 타이틀 */}
        <h1 style={styles.title}>마이페이지</h1>

        {/* 프로필 카드 */}
        <section style={styles.profileCard}>
          <div style={styles.avatar}>
            {/* ⭐️ FIX: profileImage 변수 사용 */}
            <img
              src={profileImage} // ⭐️ 수정: 계산된 profileImage 사용
              alt="프로필"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                // ⭐️ FIX: defaultProfileFilled 변수 사용
                e.currentTarget.src = defaultProfileFilled;
              }}
            />
          </div>

          <div style={styles.profileInfo}>
            <div style={styles.nicknameRow}>
              <span style={styles.nickname}>{nickname}</span>
              {/* ⭐️ FIX: mannerScore 변수 사용 */}
              <span style={styles.ratingBadge}>{mannerScore}점</span> 
            </div>
            <span style={styles.username}>{username}</span>
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
            onClick={() => handleClick("/mypage/orders")} 
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
        </section>
      </div>
    </div>
  );
};

export default MyPage;