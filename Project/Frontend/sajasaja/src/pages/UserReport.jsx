import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReportComplete from "./modal/ReportComplete";
import { api } from "../assets/setIntercepter"; 

// ... (스타일 컴포넌트 기존과 동일, 생략) ...
const styles = {
  page: { minHeight: "100vh", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center" },
  inner: { width: "100%", maxWidth: "1120px", padding: "40px 24px 80px", boxSizing: "border-box", margin: "0 auto" },
  title: { fontSize: "20px", fontWeight: 700, marginBottom: "32px", maxWidth: "900px", margin: "0 auto 32px auto" },
  form: { width: "100%", maxWidth: "900px", margin: "0 auto" },
  formGroup: { marginBottom: "20px" },
  label: { display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" },
  required: { color: "#D32F2F", marginLeft: "4px", fontSize: "12px", fontWeight: 500 },
  inputBase: { width: "100%", height: "44px", borderRadius: "4px", border: "1px solid #dedede", padding: "0 12px", fontSize: "14px", boxSizing: "border-box", outline: "none" },
  readOnlyInput: { backgroundColor: "#f8f8f8", cursor: "default" },
  inputWrapper: { position: "relative" },
  rightIcon: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" },
  select: { width: "100%", height: "44px", borderRadius: "4px", border: "1px solid #dedede", padding: "0 36px 0 12px", fontSize: "14px", boxSizing: "border-box", outline: "none", appearance: "none", backgroundColor: "#ffffff", cursor: "pointer" },
  textarea: { width: "100%", minHeight: "260px", borderRadius: "4px", border: "1px solid #dedede", padding: "12px", fontSize: "13px", boxSizing: "border-box", resize: "none", outline: "none" },
  textareaPlaceholder: { fontSize: "12px", color: "#b0b0b0", lineHeight: 1.6 },
  redNotice: { marginTop: "-15px", fontSize: "12px", color: "#D32F2F" },
  buttonRow: { marginTop: "32px", display: "flex", gap: "12px" },
  btnBase: { flex: 1, height: "48px", borderRadius: "4px", fontSize: "14px", cursor: "pointer", border: "1px solid #000000" },
  btnCancel: { backgroundColor: "#ffffff", color: "#000000" },
  btnSubmit: { backgroundColor: "#000000", color: "#ffffff" },
};

const UserReport = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 전달받은 신고 대상 정보
  const reportedNickname = location.state?.reportedNickname || "";
  // const reportedId = location.state?.reportedId; // 필요하다면 사용

  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  useEffect(() => {
    if (!reportedNickname) {
        alert("신고 대상을 찾을 수 없습니다.");
        navigate(-1);
    }
  }, [reportedNickname, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!reason) { alert("신고사유를 선택해주세요."); return; }
    if (detail.trim().length < 20) { alert("신고 내용은 최소 20자 이상 작성해주세요."); return; }

    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
    }

    try {
        const fullContent = `[사유: ${reason}] \n${detail}`;

        // ✅ 사용자 신고 API 호출 (USER 타입)
        await api.post(`/api/report/USER`, {
            title: title,
            content: fullContent,
            reportedNickname: reportedNickname // 닉네임 필수
            // reportedId: reportedId // (필요시)
        });

        setIsCompleteOpen(true);
    } catch (error) {
        console.error("신고 실패:", error);
        alert(error.response?.data?.message || "신고 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <h1 style={styles.title}>신고하기 (사용자)</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>신고 대상</label>
            <input type="text" value={reportedNickname} readOnly style={{ ...styles.inputBase, ...styles.readOnlyInput }} />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>제목 <span style={styles.required}>(필수)</span></label>
            <div style={styles.inputWrapper}>
              <input type="text" placeholder="제목을 입력해주세요." value={title} onChange={(e) => setTitle(e.target.value)} style={styles.inputBase} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>신고사유 <span style={styles.required}>(필수)</span></label>
            <div style={styles.inputWrapper}>
              <select value={reason} onChange={(e) => setReason(e.target.value)} style={styles.select}>
                <option value="">선택</option>
                <option value="부적절한 게시물">부적절한 게시물 작성</option>
                <option value="욕설/비방">욕설 및 비방</option>
                <option value="사기">사기 의심</option>
                <option value="기타">기타</option>
              </select>
              <div style={styles.rightIcon}>
                <img src="/images/undertriangle.svg" alt="open" style={{ width: 10, height: 10 }} />
              </div>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>신고 내용 상세 기재 <span style={styles.required}>(필수)</span></label>
            <div style={{ position: "relative" }}>
              <textarea value={detail} onChange={(e) => setDetail(e.target.value)} style={styles.textarea} />
              {detail.length === 0 && (
                 <div style={{ ...styles.textareaPlaceholder, position: "absolute", top: 12, left: 12, pointerEvents: "none", whiteSpace: "pre-line" }}>
                    신고 사유를 자세히 기재해 주세요.{"\n"}최소 글자 수 20자 이상
                 </div>
              )}
            </div>
          </div>
          <div style={styles.redNotice}>* 20자 이상 작성하여야 합니다.</div>

          <div style={styles.buttonRow}>
            <button type="button" style={{ ...styles.btnBase, ...styles.btnCancel }} onClick={() => navigate(-1)}>취소</button>
            <button type="submit" style={{ ...styles.btnBase, ...styles.btnSubmit }}>신고하기</button>
          </div>
        </form>
      </div>
      <ReportComplete isOpen={isCompleteOpen} onClose={() => { setIsCompleteOpen(false); navigate(-1); }} />
    </div>
  );
};

export default UserReport;