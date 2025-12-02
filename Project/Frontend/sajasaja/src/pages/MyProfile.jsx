// 파일 위치: src/pages/MyProfile.jsx
import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { api, setInterceptor } from "../assets/setIntercepter"; // api 인스턴스 import

// 🔥 은행 리스트 (파일은 public/images/banklogo/*.svg 기준)
const bankOptions = [
  { id: "shinhan", name: "신한", logo: "/images/banklogo/shinhan.svg" },
  { id: "kb", name: "국민", logo: "/images/banklogo/kb.svg" },
  { id: "nh", name: "농협", logo: "/images/banklogo/nh.svg" },
  { id: "suhyup", name: "수협", logo: "/images/banklogo/suhyup.svg" },
  { id: "woori", name: "우리", logo: "/images/banklogo/woori.svg" },
  { id: "citibank", name: "한국씨티", logo: "/images/banklogo/citibank.svg" },
  { id: "kbank", name: "케이뱅크", logo: "/images/banklogo/kbank.svg" },
  { id: "kdbsanup", name: "산업", logo: "/images/banklogo/kdbsanup.svg" },
  { id: "ibk", name: "기업", logo: "/images/banklogo/ibk.svg" },
  { id: "mg", name: "새마을", logo: "/images/banklogo/mg.svg" },
  { id: "shinhyup", name: "신협", logo: "/images/banklogo/shinhyup.svg" },
  { id: "gwangju", name: "광주", logo: "/images/banklogo/gwangju.svg" },
  { id: "busan", name: "부산", logo: "/images/banklogo/busan.svg" },
  { id: "post", name: "우체국", logo: "/images/banklogo/post.svg" },
  { id: "kakao", name: "카카오뱅크", logo: "/images/banklogo/kakao.svg" },
  { id: "toss", name: "토스뱅크", logo: "/images/banklogo/toss.svg" },
  { id: "sbi", name: "SBI저축", logo: "/images/banklogo/sbi.svg" },
  { id: "imbank", name: "전북/제주", logo: "/images/banklogo/imbank.svg" },
];

const styles = {
  pageWrapper: {
    maxWidth: "1200px",
    margin: "80px auto",
    padding: "0 20px",
    color: "#000000ff",
  },
  title: {
    fontSize: "18px",
    fontWeight: "800",
    marginBottom: "15px",
    paddingLeft: "79px",
  },
  card: {
    width: "900px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "48px 72px 56px",
    border: "1px solid #eee",
  },
  profileRow: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    marginBottom: "40px",
  },
  profileImgWrapper: {
    width: "135px",
    height: "135px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  profileEditButton: {
    marginLeft: "-30px",
    marginBottom: "-110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
  },

  inputRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },

  input: {
    width: "100%",
    height: "39px",
    borderRadius: "6px",
    border: "1.5px solid #e3e3e3",
    padding: "0 16px",
    fontSize: "12px",
    outline: "none",
    fontWeight: "600",
    boxSizing: "border-box",
  },

  disabledInput: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
    color: "#999999",
    cursor: "not-allowed",
  },

  smallButton: {
    position: "absolute",
    top: 5,
    bottom: 5,
    right: 5,
    flexShrink: 0,
    height: "25px",
    padding: "0 10px",
    minWidth: "70px",
    borderRadius: "10px",
    border: "1px solid #ffffff",
    fontSize: "11px",
    color: "#ffffff",
    fontWeight: "500",
    backgroundColor: "#bfbfbf",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  smallHelper: {
    fontSize: "12px",
    color: "#979797",
  },

  footerButtons: {
    marginTop: "34px",
    display: "flex",
    gap: "10px",
  },
  cancelButton: {
    flex: 1,
    height: "44px",
    borderRadius: "8px",
    border: "1px solid #000000ff",
    backgroundColor: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },
  submitButton: {
    flex: 1,
    height: "44px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#000000ff",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },

  // 은행 드롭다운 관련
  bankSelectBox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    padding: 0,
    backgroundColor: "transparent",
    border: "none",
    height: "24px",
  },
  bankLogo: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  bankName: {
    fontSize: "12px",
    fontWeight: "600",
  },
  bankDropdown: {
    position: "absolute",
    top: "44px",
    left: "12px",
    width: "220px",
    maxHeight: "260px",
    overflowY: "auto",
    borderRadius: "12px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    zIndex: 10,
  },
  bankDropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    cursor: "pointer",
  },
};

function MyProfile() {
  const navigate = useNavigate();

  // 사용자 닉네임 가져오기
  const userNickname = localStorage.getItem("user_nickname");

  const [form, setForm] = useState({
    name: "",
    nickname: "",
    phone: "",
    email: "",
    password: "",
    bank: "shinhan",
    accountNumber: "",
  });

  // 초기값 저장 (중복체크 비교용)
  const [originalNickname, setOriginalNickname] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const [profileImage, setProfileImage] = useState(null); // 미리보기용 URL
  const [imgFile, setImgFile] = useState(null); // 실제 전송할 파일 객체

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [bankOpen, setBankOpen] = useState(false);

  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(true);

  const [emailMessage, setEmailMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const selectedBank = bankOptions.find((b) => b.id === form.bank) || bankOptions[0];
  const defaultProfile = "/images/profile.png";

  // ✅ 1. 초기 데이터 로드 (API 연동)
  useEffect(() => {
    const fetchUserData = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token || !userNickname || !setInterceptor(token)) {
            // 인증 정보가 없으면 로그인 페이지로
            navigate('/login');
            return;
        }

        try {
            // 현재 백엔드에는 내 전체 정보(이메일, 계좌 포함)를 불러오는 전용 API가 명확하지 않습니다.
            // 우선 프로필 조회 API를 사용하되, 상세 정보가 없다면 빈 값으로 처리합니다.
            const response = await api.put(`/api/mypage/user`);
            
            // ProfileResponseDto 혹은 UserResponseDto 구조에 따라 데이터 접근
            // (백엔드에서 보내주는 구조 확인 필요: response.data.profile 인지 response.data 인지)
            const data = response.data.profile || response.data; 

            setForm(prev => ({
                ...prev,
                email: data.email || "", 
                nickname: data.nickname || "",
                // 아래 정보들은 ProfileResponseDto에 없을 수 있음 -> 백엔드 추가 구현 권장
                password: data.password,
                phone: data.phone || undefined, 
                accountBank: data.accountBank || "shinhan",
                account: data.account || ""
            }));

            // 변경 감지를 위한 초기값 저장
            setOriginalNickname(data.nickname || "");
            setOriginalEmail(data.email || "");
            setProfileImage(data.profileImg); // 이미지 URL

        } catch (error) {
            console.error("유저 정보 로드 실패:", error);
            // 에러 시 처리 로직 (예: 로그인 만료 등)
        }
    };
    fetchUserData();
  }, [userNickname, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // 닉네임 변경 감지
    if (name === "nickname") {
      const trimmed = value.trim();
      if (trimmed === originalNickname) {
        setIsNicknameValid(true);
        setNicknameMessage("");
      } else {
        setIsNicknameValid(null); // 중복확인 필요 상태
        setNicknameMessage("");
      }
    }

    // 이메일 변경 감지
    if (name === "email") {
      const trimmed = value.trim();
      setEmailError("");
      setEmailMessage("");
      if (trimmed === originalEmail) {
        setIsEmailValid(true);
      } else {
        setIsEmailValid(null);
      }
    }
  };

  // ✅ 2. 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setImgFile(file); // 전송할 파일 상태 저장

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result); 
    };
    reader.readAsDataURL(file);
  };

  // ✅ 3. 닉네임 중복확인 (API 연동)
  const handleNicknameCheck = async () => {
    const nickname = (form.nickname || "").trim();

    if (!nickname) {
      setNicknameMessage("닉네임을 입력해주세요.");
      setIsNicknameValid(false);
      return;
    }

    if (nickname === originalNickname) {
      setNicknameMessage("현재 사용 중인 닉네임입니다.");
      setIsNicknameValid(true);
      return;
    }

    try {
        // 백엔드: 중복이면 true, 사용가능하면 false 반환
        const response = await api.get(`/api/check/nickname`, { params: { value: nickname } });
        if (response.data === true) {
            setNicknameMessage("이미 사용중인 닉네임입니다.");
            setIsNicknameValid(false);
        } else {
            setNicknameMessage("사용가능한 닉네임입니다.");
            setIsNicknameValid(true);
        }
    } catch (error) {
        console.error("닉네임 중복확인 오류:", error);
        setNicknameMessage("확인 중 오류가 발생했습니다.");
    }
  };

  // ✅ 4. 이메일 중복확인 (API 연동)
  const handleEmailCheck = async () => {
    const email = (form.email || "").trim();

    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
      setIsEmailValid(false);
      return;
    }

    // 형식 체크
    const hasAt = email.includes("@");
    const allowedDomains = [".com", ".net", ".ac.kr"];
    const hasValidDomain = allowedDomains.some((domain) => email.endsWith(domain));

    if (!hasAt || !hasValidDomain) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
      setEmailMessage("");
      setIsEmailValid(false);
      return;
    }

    if (email === originalEmail) {
      setEmailError("");
      setEmailMessage("현재 사용 중인 이메일입니다.");
      setIsEmailValid(true);
      return;
    }

    try {
        // 백엔드: 중복이면 true, 사용가능하면 false
        const response = await api.get(`/api/check/email`, { params: { value: email } });
        if (response.data === true) {
            setEmailError("");
            setEmailMessage("이미 사용중인 이메일입니다.");
            setIsEmailValid(true);
        } else {
            setEmailError("");
            setEmailMessage("사용가능한 이메일입니다.");
            setIsEmailValid(true);
        }
    } catch (error) {
        console.error("이메일 중복확인 오류:", error);
        setEmailMessage("확인 중 오류가 발생했습니다.");
    }
  };

  // ✅ 5. 최종 수정 요청 (API 연동)
  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    // 닉네임 확인
    if (isNicknameValid !== true) {
      if (!nicknameMessage) setNicknameMessage("닉네임 중복확인을 해주세요.");
      hasError = true;
    }

    // 이메일 확인
    if (isEmailValid !== true) {
      if (!emailMessage) setEmailMessage("이메일 중복확인을 해주세요.");
      hasError = true;
    }

    // 비밀번호 확인 (입력된 경우만 검사)
    if (form.password && form.password.length < 8) {
        setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
        hasError = true;
    }
    if (form.password !== form.passwordConfirm) {
        setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
        hasError = true;
    }

    if (hasError) return;

    try {
        // FormData 생성 (Multipart/form-data 요청)
        const formData = new FormData();

        // JSON 데이터 구성 (UserRequestDto 구조에 맞춤)
        const requestData = {
            nickname: form.nickname,
            email: form.email,
            // 비밀번호는 비어있으면 보내지 않거나, 백엔드에서 null 체크하므로 undefined로 처리
            password: form.password || undefined, 
            accountBank: form.bank,
            account: form.accountNumber
        };
        
        // JSON 객체를 Blob으로 변환하여 'user' 파트에 추가
        const jsonBlob = new Blob([JSON.stringify(requestData)], { type: "application/json" });
        formData.append("user", jsonBlob);

        // 이미지 파일이 있다면 'image' 파트에 추가
        if (imgFile) {
            formData.append("image", imgFile);
        }

        // PUT 요청 전송
        const response = await api.put("/api/mypage/user", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 200 || response.status === 201) {
            alert("정보가 저장되었습니다.");
            
            // 닉네임이 변경되었다면 로컬 스토리지도 업데이트
            if (form.nickname !== originalNickname) {
                localStorage.setItem("user_nickname", form.nickname);
            }
            navigate("/mypage");
        }
    } catch (error) {
        console.error("정보 수정 실패:", error);
        alert("정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div style={styles.pageWrapper}>
      <h1 style={styles.title}>내 정보 수정</h1>

      <div style={styles.card}>
        {/* 프로필 이미지 영역 */}
        <div style={styles.profileRow}>
          <div style={styles.profileImgWrapper}>
            <img 
                src={profileImage || defaultProfile} 
                style={styles.profileImg} 
                alt="profile" 
                onError={(e) => e.target.src = defaultProfile} 
            />
          </div>

          <label style={styles.profileEditButton}>
            <img
              src="/images/profileedit.svg"
              alt="edit"
              style={{ width: "21px", height: "21px" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* 폼 영역 */}
        <form style={styles.form} onSubmit={handleSubmit}>
          {/* 이름 (변경 불가) */}
          <div style={styles.field}>
            <label style={styles.label}>이름</label>
            <input
              name="name"
              style={{ ...styles.input, ...styles.disabledInput }}
              value={form.name}
              readOnly
            />
            <span style={styles.smallHelper}>변경 불가한 항목입니다.</span>
          </div>

          {/* 닉네임 */}
          <div style={styles.field}>
            <label style={styles.label}>닉네임</label>
            <div style={styles.inputRow}>
              <input
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                style={styles.input}
                placeholder="간편하게 작성하세요"
                maxLength={10}
              />
              <button
                type="button"
                style={styles.smallButton}
                onClick={handleNicknameCheck}
              >
                중복확인
              </button>
            </div>
            {nicknameMessage && (
              <span
                style={{
                  fontSize: "12px",
                  color: isNicknameValid === true ? "#2E7D32" : "#D32F2F",
                }}
              >
                {nicknameMessage}
              </span>
            )}
          </div>

          {/* 전화번호 (변경 불가) */}
          <div style={styles.field}>
            <label style={styles.label}>전화번호</label>
            <input
              name="phone"
              style={{ ...styles.input, ...styles.disabledInput }}
              value={form.phone}
              readOnly
            />
            <span style={styles.smallHelper}>변경 불가한 항목입니다.</span>
          </div>

          {/* 이메일 */}
          <div style={styles.field}>
            <label style={styles.label}>아이디(이메일)</label>
            <div style={styles.inputRow}>
              <input
                name="email"
                style={styles.input}
                value={form.email}
                onChange={handleChange}
                placeholder="ID@example.com"
              />
              <button
                type="button"
                style={styles.smallButton}
                onClick={handleEmailCheck}
              >
                중복확인
              </button>
            </div>
            {emailError && (
              <span style={{ fontSize: "12px", color: "#D32F2F" }}>
                {emailError}
              </span>
            )}
            {emailMessage && (
              <span
                style={{
                  fontSize: "12px",
                  color: isEmailValid === true ? "#2E7D32" : "#D32F2F",
                  display: "block",
                  marginTop: emailError ? "2px" : "4px",
                }}
              >
                {emailMessage}
              </span>
            )}
          </div>

          {/* 비밀번호 */}
          <div style={styles.field}>
            <label style={styles.label}>비밀번호</label>
            <input
              type="password"
              name="password"
              style={styles.input}
              value={form.password}
              onChange={(e) => {
                handleChange(e);
                const value = e.target.value;
                if (value && value.length < 8) {
                  setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
                } else {
                  setPasswordError("");
                }
                if (form.passwordConfirm) {
                    setPasswordMatchMessage(
                        value === form.passwordConfirm ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."
                    );
                }
              }}
              placeholder="변경할 경우에만 입력하세요"
            />
            {passwordError && (
              <span style={{ fontSize: "12px", color: "#D32F2F" }}>
                {passwordError}
              </span>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div style={styles.field}>
            <label style={styles.label}>비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              style={styles.input}
              value={form.passwordConfirm}
              onChange={(e) => {
                handleChange(e);
                const value = e.target.value;
                setPasswordMatchMessage(
                    value === form.password ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."
                );
              }}
            />
            {passwordMatchMessage && (
              <span
                style={{
                  fontSize: "12px",
                  color:
                    passwordMatchMessage === "비밀번호가 일치합니다."
                      ? "#2E7D32"
                      : "#D32F2F",
                }}
              >
                {passwordMatchMessage}
              </span>
            )}
          </div>

          {/* 계좌 */}
          <div style={styles.field}>
            <label style={styles.label}>계좌</label>
            <div style={{ display: "flex", gap: "8px", width: "100%" }}>
              <div
                style={{
                  padding: "0 16px",
                  minWidth: "90px",
                  height: "39px",
                  borderRadius: "6px",
                  border: "1.5px solid #e3e3e3",
                  backgroundColor: "#f5f5f5",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                }}
              >
                {form.name}
              </div>

              <div
                style={{
                  flex: 1,
                  height: "39px",
                  borderRadius: "6px",
                  border: "1.5px solid #e3e3e3",
                  padding: "0 12px",
                  boxSizing: "border-box",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  position: "relative",
                }}
              >
                <div
                  style={styles.bankSelectBox}
                  onClick={() => setBankOpen((prev) => !prev)}
                >
                  <img
                    src={selectedBank.logo}
                    alt={selectedBank.name}
                    style={styles.bankLogo}
                  />
                  <span style={styles.bankName}>{selectedBank.name}</span>
                  <img
                    src="/images/undertriangle.svg"
                    alt="arrow"
                    style={{ width: "7px", height: "7px", marginLeft: "3px" }}
                  />
                </div>

                <input
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    color: "#444",
                    fontSize: "12px",
                    boxSizing: "border-box",
                  }}
                  placeholder="예) 110-123-123456"
                />

                {bankOpen && (
                  <div style={styles.bankDropdown}>
                    {bankOptions.map((bank) => (
                      <div
                        key={bank.id}
                        style={styles.bankDropdownItem}
                        onClick={() => {
                          setForm((prev) => ({ ...prev, bank: bank.id }));
                          setBankOpen(false);
                        }}
                      >
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          style={styles.bankLogo}
                        />
                        <span style={styles.bankName}>{bank.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span style={styles.smallHelper}>
              본인 명의의 계좌만 사용할 수 있습니다.
            </span>
          </div>

          <div style={styles.footerButtons}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={handleCancel}
            >
              취소
            </button>
            <button type="submit" style={styles.submitButton}>
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MyProfile;