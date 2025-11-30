// 파일 위치: src/pages/MyProfile.jsx
import React, { useState } from "react";

const styles = {
  pageWrapper: {
    maxWidth: "1200px",
    margin: "80px auto",
    padding: "0 20px",
    color: "#000000ff",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "15px",
    paddingLeft: "79px",
  },
  card: { //전체 박스 스타일 수정
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
    backgroundColor: "#ffffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  profileEditIcon: {
    position: "absolute",
    right: "4px",
    bottom: "4px",
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  fontweight: "600",
  boxSizing: "border-box",
},

smallButton: {
  position: "absolute",
  top: 5,
  bottom: 5,
  right:5,
  flexShrink: 0,
  height: "25px",
  padding: "0 10px",
  minWidth: "100px",
  borderRadius: "10px",
  border: "1px solid #ffffffff",
  fontSize: "11px",
  color: "#ffffffff", 
  fontWeight: "500",
  backgroundColor: "#bfbfbf",
  cursor: "pointer",
  whiteSpace: "nowrap",
},
  smallHelper: {
    fontSize: "12px",
    color: "#D32F2F",
  },
  grayHelper: {
    fontSize: "12px",
    color: "#999",
  },
  

  accountBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  bankBadge: {
    width: "50px",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 10px",
    borderRadius: "999px",
    backgroundColor: "#f5f6fa", 
    fontSize: "12px",
  },
  bankLogoCircle: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "#0052a4",
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
};

function MyProfile() {
  const [form, setForm] = useState({
    name: "신형근",
    nickname: "",
    phone: "",
    email: "",
    password: "",
    passwordConfirm: "",
    accountNumber: "",
    depositor: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("정보가 저장되었습니다.");
  };

  const handleCancel = () => {
    window.history.back();
  };

  const defaultProfile = "/images/profilecircle.svg";

  return (
    <div style={styles.pageWrapper}>
      <h1 style={styles.title}>내 정보 수정</h1>

      <div style={styles.card}>
        {/* 프로필 */}
        <div style={styles.profileRow}>
          <div style={styles.profileImgWrapper}>
            <img
              src={profileImage || defaultProfile}
              alt="프로필"
              style={styles.profileImg}
            />
          </div>
        </div>

        {/* 폼 */}
        <form style={styles.form} onSubmit={handleSubmit}>

          {/* 이름 */}
          <div style={styles.field}>
            <label style={styles.label}>이름</label>
            <input
              name="name"
              style={styles.input}
              value={form.name}
              onChange={handleChange}
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
            >
              중복확인
            </button>
          </div>
        </div>


          {/* 전화번호 */}
          <div style={styles.field}>
            <label style={styles.label}>전화번호</label>
            <input
              name="phone"
              style={styles.input}
              value={form.phone}
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>

          {/* 비밀번호 */}
          <div style={styles.field}>
            <label style={styles.label}>비밀번호</label>
            <input
              type="password"
              name="password"
              style={styles.input}
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div style={styles.field}>
            <label style={styles.label}>비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              style={styles.input}
              value={form.passwordConfirm}
              onChange={handleChange}
            />
          </div>

          {/* 계좌 */}
          <div style={styles.field}>
            <label style={styles.label}>계좌</label>
            <div style={styles.accountBox}>
              <div style={styles.bankBadge}>
                <span style={styles.bankLogoCircle} />
                <span>신한</span>
              </div>
              <input
                name="accountNumber"
                style={styles.input}
                value={form.accountNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 예금주 */}
          <div style={styles.field}>
            <label style={styles.label}>예금주</label>
            <input
              name="depositor"
              style={styles.input}
              value={form.depositor}
              onChange={handleChange}
            />
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
