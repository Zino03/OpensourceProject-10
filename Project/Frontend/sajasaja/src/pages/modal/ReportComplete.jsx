// 파일명: ReportComplete.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    width: "320px",
    maxWidth: "90%",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "24px 24px 20px",
    boxSizing: "border-box",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    position: "relative",
    textAlign: "center",
  },
  messageLine: {
    fontSize: "14px",
    color: "#222222",
    lineHeight: 1.6,
  },
  messageWrapper: {
    margin: "18px 0 24px",
  },
  confirmButton: {
    width: "100%",
    height: "40px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#000000",
    color: "#ffffff",
    fontSize: "13px",
    cursor: "pointer",
  },
};

const ReportComplete = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // 닫기 버튼
  const handleClose = () => {
    if (onClose) onClose();
  };

  // 확인 버튼 → 메인으로 이동
  const handleConfirm = () => {
    if (onClose) onClose();
    navigate("/"); // 메인 페이지 이동
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.messageWrapper}>
          <div style={styles.messageLine}>신고가 접수되었습니다.</div>
          <div style={styles.messageLine}>의견 감사합니다.</div>
        </div>

        <button
          type="button"
          style={styles.confirmButton}
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default ReportComplete;
