// 파일 위치: src/pages/MyProfile.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, BASE_URL, setInterceptor } from "../assets/setIntercepter";

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
  const location = useLocation();

  // 초기 상태를 모두 빈 문자열로 설정하여 uncontrolled -> controlled 에러 방지
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    phone: "",
    email: "",
    password: "",
    passwordConfirm: "",
    bank: "shinhan",
    accountNumber: "",
  });

  const [originalNickname, setOriginalNickname] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [imgFile, setImgFile] = useState(null);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [bankOpen, setBankOpen] = useState(false);

  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(true);

  const [emailMessage, setEmailMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const selectedBank =
    bankOptions.find((b) => b.id === form.bank) || bankOptions[0];
  const defaultProfile = "/images/filledprofile.svg";

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !setInterceptor(token)) {
        navigate("/login");
        return;
      }

      try {
        // PUT 요청으로 데이터 조회 (빈 JSON 전송)
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify({})], {
          type: "application/json",
        });
        formData.append("user", jsonBlob);

        const response = await api.get("/api/mypage/user", {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log(response);

        // 백엔드 데이터 구조에 맞춰 추출 (응답 자체가 객체)
        const data = response.data.profile;
        console.log(data);

        // null 체크를 하여 빈 문자열 할당 (에러 해결 핵심)
        setForm((prev) => ({
          ...prev,
          name: data.name || prev.name || "사용자",
          nickname: data.nickname || "",
          email: data.email || "",
          phone: data.phone || "",
          bank: data.accountBank || "shinhan",
          accountNumber: data.account || "",
          password: "",
          passwordConfirm: "",
        }));

        setOriginalNickname(data.nickname || "");
        setOriginalEmail(data.email || "");
        if (data.profileImg) {
          setProfileImage(`${BASE_URL}${data.profileImg}`);
        }
      } catch (error) {
        console.error("유저 정보 로드 실패:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "nickname") {
      const trimmed = value.trim();
      if (trimmed === originalNickname) {
        setIsNicknameValid(true);
        setNicknameMessage("");
      } else {
        setIsNicknameValid(null);
        setNicknameMessage("");
      }
    }

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

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setImgFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

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
      const response = await api.get(`/api/check/nickname`, {
        params: { value: nickname },
      });
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

  const handleEmailCheck = async () => {
    const email = (form.email || "").trim();

    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
      setIsEmailValid(false);
      return;
    }

    const hasAt = email.includes("@");
    const allowedDomains = [".com", ".net", ".co.kr", ".ac.kr"];
    const hasValidDomain = allowedDomains.some((domain) =>
      email.endsWith(domain)
    );

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
      const response = await api.get(`/api/check/email`, {
        params: { value: email },
      });
      if (response.data === true) {
        setEmailError("");
        setEmailMessage("이미 사용중인 이메일입니다.");
        setIsEmailValid(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (isNicknameValid !== true) {
      if (!nicknameMessage) setNicknameMessage("닉네임 중복확인을 해주세요.");
      hasError = true;
    }

    if (isEmailValid !== true) {
      if (!emailMessage) setEmailMessage("이메일 중복확인을 해주세요.");
      hasError = true;
    }

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
      const formData = new FormData();
      const requestData = {
        nickname: form.nickname,
        email: form.email,
        password: form.password || undefined,
        accountBank: form.bank,
        account: form.accountNumber,
      };

      const jsonBlob = new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      });
      formData.append("user", jsonBlob);

      if (imgFile) {
        formData.append("image", imgFile);
      }

      const response = await api.patch("/api/mypage/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("정보가 저장되었습니다.");
        if (form.nickname !== originalNickname) {
          localStorage.setItem("userNickname", form.nickname);
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
        <div style={styles.profileRow}>
          <div style={styles.profileImgWrapper}>
            <img
              src={`${profileImage}` || defaultProfile}
              style={styles.profileImg}
              alt="profile"
              onError={(e) => (e.target.src = defaultProfile)}
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

        <form style={styles.form} onSubmit={handleSubmit}>
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

          <div style={styles.field}>
            <label style={styles.label}>전화번호</label>
            <input
              name="phone"
              style={{ ...styles.input, ...styles.disabledInput }}
              value={form.phone}
              readOnly
              placeholder="예) 01012345678"
            />
            <span style={styles.smallHelper}>변경 불가한 항목입니다.</span>
          </div>

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
                    value === form.passwordConfirm
                      ? "비밀번호가 일치합니다."
                      : "비밀번호가 일치하지 않습니다."
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
                  value === form.password
                    ? "비밀번호가 일치합니다."
                    : "비밀번호가 일치하지 않습니다."
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
                    style={{
                      width: "7px",
                      height: "7px",
                      marginLeft: "3px",
                    }}
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
