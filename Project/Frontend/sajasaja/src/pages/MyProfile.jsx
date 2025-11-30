// 파일 위치: src/pages/MyProfile.jsx
import React, { useState } from "react";

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
    position: "relative", // 🔥 프로필 수정 아이콘 포지셔닝 위해 추가
  },
  profileImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  profileEditButton: {
    marginLeft: "-30px", // 원 오른쪽으로 이동
    marginBottom: "-110px", // 밑으로 살짝 내리기 (조절 가능)
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
  // 🔹 기본 폼 값
  const [form, setForm] = useState({
    name: "최지우",
    nickname: "간장게장",
    phone: "01012345678",
    email: "example@example.com",
    password: "********",
    passwordConfirm: "********",
    bank: "shinhan",
    accountNumber: "110-123-123456",
  });

  // 🔹 최초에 가지고 있던 닉네임 (내 정보 수정 페이지 들어왔을 때 닉네임)
  //    - 실제 서비스에서는 API로 받아온 user.nickname을 여기에 넣어주면 됨
  const [originalNickname] = useState("간장게장");

  const [profileImage, setProfileImage] = useState(null);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [bankOpen, setBankOpen] = useState(false);

  const [nicknameMessage, setNicknameMessage] = useState("");
  // ✅ 초기값을 true로 : "처음 들어왔을 때 원래 닉네임은 이미 사용 가능하다고 간주"
  const [isNicknameValid, setIsNicknameValid] = useState(true); // true / false / null

  const selectedBank =
    bankOptions.find((b) => b.id === form.bank) || bankOptions[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // 🔥 닉네임 입력이 바뀔 때의 처리
    if (name === "nickname") {
      const trimmed = value.trim();

      // 1) 원래 닉네임 그대로면 → 이미 검증된 것으로 취급
      if (trimmed === originalNickname) {
        setIsNicknameValid(true);
        setNicknameMessage(""); // 굳이 메시지 안 띄워도 됨
      } else {
        // 2) 새 닉네임이면 → 다시 중복확인 받아야 하므로 상태 초기화
        setIsNicknameValid(null);
        setNicknameMessage(""); // "닉네임 중복확인을 해주세요."는 제출 시에만 띄움
      }
    }
  };

  // 🔥 프로필 이미지 변경
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 닉네임 중복확인
  const handleNicknameCheck = () => {
    const nickname = (form.nickname || "").trim();

    if (!nickname) {
      setNicknameMessage("닉네임을 입력해주세요.");
      setIsNicknameValid(false);
      return;
    }

    // 🔥 현재 닉네임이 "원래 내 닉네임"인 경우
    // → 굳이 서버에 물어볼 필요 없이 그냥 사용 가능 처리
    if (nickname === originalNickname) {
      setNicknameMessage("현재 사용 중인 닉네임입니다.");
      setIsNicknameValid(true);
      return;
    }

    // 실제로는 서버에서 체크하지만, 여기서는 하드코딩 예시
    const usedNicknames = ["간장게장", "사자사자"];

    // 🔥 위에서 originalNickname인 경우는 이미 return 했으니,
    //    여기서는 "내가 아닌 다른 사람"의 닉네임이라고 가정
    if (usedNicknames.includes(nickname)) {
      setNicknameMessage("이미 사용중인 닉네임입니다.");
      setIsNicknameValid(false);
    } else {
      setNicknameMessage("사용가능한 닉네임입니다.");
      setIsNicknameValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;

    // 🔥 닉네임 중복확인 관련 검증
    // - isNicknameValid === true 인 경우만 통과
    // - (원래 닉네임이면 isNicknameValid가 true로 유지되기 때문에 막히지 않음)
    if (isNicknameValid !== true) {
      if (!nicknameMessage) {
        setNicknameMessage("닉네임 중복확인을 해주세요.");
      }
      hasError = true;
    }

    // 이메일 검사
    const email = (form.email || "").trim();
    const hasAt = email.includes("@");
    const allowedDomains = [".com", ".net", ".co.kr"];
    const hasValidDomain = allowedDomains.some((domain) =>
      email.endsWith(domain)
    );

    if (!hasAt || !hasValidDomain) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
      hasError = true;
    } else {
      setEmailError("");
    }

    // 비밀번호 길이
    if (!form.password || form.password.length < 8) {
      setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    // 비밀번호 일치
    if (form.password !== form.passwordConfirm) {
      setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
      hasError = true;
    } else {
      setPasswordMatchMessage("비밀번호가 일치합니다.");
    }

    if (hasError) return;

    alert("정보가 저장되었습니다.");
  };

  const handleCancel = () => {
    window.history.back();
  };

  const defaultProfile = "/images/profile.png";

  return (
    <div style={styles.pageWrapper}>
      <h1 style={styles.title}>내 정보 수정</h1>

      <div style={styles.card}>
        {/* 프로필 */}
        <div style={styles.profileRow}>
          <div style={styles.profileImgWrapper}>
            <img src={profileImage || defaultProfile} style={styles.profileImg} />
          </div>

          {/* 프로필 수정 버튼 */}
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

        {/* 폼 */}
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
              placeholder="예) 01012345678"
            />
            <span style={styles.smallHelper}>변경 불가한 항목입니다.</span>
          </div>

          {/* 이메일 */}
          <div style={styles.field}>
            <label style={styles.label}>아이디(이메일)</label>
            <input
              name="email"
              style={styles.input}
              value={form.email}
              onChange={(e) => {
                setEmailError("");
                handleChange(e);
              }}
              placeholder="ID@example.com"
            />

          {emailError && (
              <span style={{ fontSize: "12px", color: "#D32F2F" }}>
                {emailError}
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
                if (!value || value.length < 8) {
                  setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
                } else {
                  setPasswordError("");
                }

                if (form.passwordConfirm !== "") {
                  if (value === form.passwordConfirm && value.length >= 8) {
                    setPasswordMatchMessage("비밀번호가 일치합니다.");
                  } else {
                    setPasswordMatchMessage(
                      "비밀번호가 일치하지 않습니다."
                    );
                  }
                }
              }}
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

                if (value === form.password && value.length >= 8) {
                  setPasswordMatchMessage("비밀번호가 일치합니다.");
                } else {
                  setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
                }
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
              {/* 왼쪽: 계좌주 이름 (변경 불가) */}
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

              {/* 오른쪽: 은행 선택 + 계좌번호 */}
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
                {/* 은행 선택 */}
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

                {/* 계좌번호 입력 */}
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

                {/* 드롭다운 리스트 */}
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

          {/* 버튼 */}
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
