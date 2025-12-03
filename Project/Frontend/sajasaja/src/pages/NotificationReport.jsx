import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReportComplete from "./modal/ReportComplete";
import { api } from "../assets/setIntercepter"; // ✅ API 연동

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inner: {
    width: "100%",
    maxWidth: "1120px",
    padding: "40px 24px 80px",
    boxSizing: "border-box",
    margin: "0 auto",
  },
  title: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "32px",
    maxWidth: "900px",
    margin: "0 auto 32px auto",
  },
  form: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  required: {
    color: "#D32F2F",
    marginLeft: "4px",
    fontSize: "12px",
    fontWeight: 500,
  },
  inputBase: {
    width: "100%",
    height: "44px",
    borderRadius: "4px",
    border: "1px solid #dedede",
    padding: "0 12px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
  readOnlyInput: {
    backgroundColor: "#f8f8f8",
    cursor: "default",
  },
  inputWrapper: {
    position: "relative",
  },
  rightIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  select: {
    width: "100%",
    height: "44px",
    borderRadius: "4px",
    border: "1px solid #dedede",
    padding: "0 36px 0 12px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    appearance: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    minHeight: "260px",
    borderRadius: "4px",
    border: "1px solid #dedede",
    padding: "12px",
    fontSize: "13px",
    boxSizing: "border-box",
    resize: "none",
    outline: "none",
  },
  textareaPlaceholder: {
    fontSize: "12px",
    color: "#b0b0b0",
    lineHeight: 1.6,
  },
  redNotice: {
    marginTop: "-15px",
    fontSize: "12px",
    color: "#D32F2F",
  },
  buttonRow: {
    marginTop: "32px",
    display: "flex",
    gap: "12px",
  },
  btnBase: {
    flex: 1,
    height: "48px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    border: "1px solid #000000",
  },
  btnCancel: {
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  btnSubmit: {
    backgroundColor: "#000000",
    color: "#ffffff",
  },
};

const NotificationReport = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 이전 페이지에서 데이터 받기

  // 이전 페이지(공지 상세보기)에서 넘어온 state 값
  const noticeId = location.state?.id;
  const noticeTitle = location.state?.title || "공지사항 정보 없음";

  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");

  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  // 잘못된 접근 처리 (noticeId가 없는 경우)
  useEffect(() => {
    if (!noticeId) {
      alert("잘못된 접근입니다. 공지사항을 통해 접속해주세요.");
      navigate(-1);
    }
  }, [noticeId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!reason) {
      alert("신고사유를 선택해주세요.");
      return;
    }
    if (detail.trim().length < 20) {
      alert("신고 내용은 최소 20자 이상 작성해주세요.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      // ✅ 백엔드 API 연동 부분 수정
      // API Spec: POST /api/report/NOTICE
      // Body: { title, content, reportedId }
      // content에는 신고 사유(reason)와 상세 내용(detail)을 합쳐서 전송
      
      const reportReasonText = {
        spam: "스팸/광고",
        abuse: "욕설·비방/혐오 표현",
        fraud: "사기 의심/거래 관련 문제",
        "false-info": "허위 정보",
        obscene: "음란물/불건전 내용",
        copyright: "저작권 침해",
        other: "기타",
      };

      await api.post(`/api/report/NOTICE`, {
        title: title,
        content: `[${reportReasonText[reason] || reason}] ${detail}`, // 사유와 내용을 합쳐서 전송
        reportedId: noticeId, // 신고 대상 공지 ID
      });

      // 신고 완료 모달 열기
      setIsCompleteOpen(true);
    } catch (error) {
      console.error("신고 실패:", error);
      const errorMsg =
        error.response?.data?.message || "신고 접수 중 오류가 발생했습니다.";
      alert(errorMsg);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <h1 style={styles.title}>신고하기 (공지)</h1>

        <form style={styles.form} onSubmit={handleSubmit}>
          {/* 신고 공지 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>신고 공지</label>
            <input
              type="text"
              value={noticeTitle}
              readOnly
              style={{ ...styles.inputBase, ...styles.readOnlyInput }}
            />
          </div>

          {/* 제목 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              제목 <span style={styles.required}>(필수)</span>
            </label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="제목을 입력해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.inputBase}
              />
            </div>
          </div>

          {/* 신고사유 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              신고사유 <span style={styles.required}>(필수)</span>
            </label>
            <div style={styles.inputWrapper}>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={styles.select}
              >
                <option value="">선택</option>
                <option value="spam">스팸/광고</option>
                <option value="abuse">욕설·비방/혐오 표현</option>
                <option value="fraud">사기 의심/거래 관련 문제</option>
                <option value="false-info">허위 정보</option>
                <option value="obscene">음란물/불건전 내용</option>
                <option value="copyright">저작권 침해</option>
                <option value="other">기타 (직접 작성)</option>
              </select>

              <div style={styles.rightIcon}>
                <img
                  src="/images/undertriangle.svg"
                  alt="open"
                  style={{ width: 10, height: 10 }}
                />
              </div>
            </div>
          </div>

          {/* 신고 내용 */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              신고 내용 상세 기재 <span style={styles.required}>(필수)</span>
            </label>
            <div style={{ position: "relative" }}>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                style={styles.textarea}
              />
              {detail.length === 0 && (
                <div
                  style={{
                    ...styles.textareaPlaceholder,
                    position: "absolute",
                    top: 12,
                    left: 12,
                    pointerEvents: "none",
                    whiteSpace: "pre-line",
                  }}
                >
                  신고 사유를 자세히 기재해 주세요.
                  {"\n"}허위 또는 장난 신고는 제재의 원인이 될 수 있습니다.
                  {"\n\n"}최소 글자 수 20자 이상
                </div>
              )}
            </div>
          </div>

          <div style={styles.redNotice}>* 20자 이상 작성하여야 합니다.</div>

          {/* 버튼 */}
          <div style={styles.buttonRow}>
            <button
              type="button"
              style={{ ...styles.btnBase, ...styles.btnCancel }}
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              type="submit"
              style={{ ...styles.btnBase, ...styles.btnSubmit }}
            >
              신고하기
            </button>
          </div>
        </form>
      </div>

      {/* 신고 완료 모달 */}
      <ReportComplete
        isOpen={isCompleteOpen}
        onClose={() => {
          setIsCompleteOpen(false);
          navigate(-1); // 모달 닫으면 이전 페이지로 이동
        }}
      />
    </div>
  );
};

export default NotificationReport;