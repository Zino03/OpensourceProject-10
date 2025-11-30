// 파일: src/components/ConfirmationPurchase.jsx
import React from "react";

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    width: "360px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontFamily: "Pretendard",
  },
  messageBox: {
    padding: "24px 20px 20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#222",
    lineHeight: 1.5,
  },
  divider: {
    height: "1px",
    backgroundColor: "#f0f0f0",
  },
  buttonRow: {
    display: "flex",
  },
  buttonBase: {
    flex: 1,
    height: "44px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
  },
  cancelButton: {
    border: "1px solid #000",
    backgroundColor: "#fff",
    color: "#000",
  },
  confirmButton: {
    border: "1px solid #000",
    backgroundColor: "#000",
    color: "#fff",
  },
};

function ConfirmationPurchase({ onCancel, onConfirm }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.messageBox}>
          <div>구매 확정 시 환불 및 반품이 불가합니다.</div>
          <div>계속 진행하시겠습니까?</div>
        </div>

        <div style={styles.divider} />

        <div style={styles.buttonRow}>
          <button
            type="button"
            style={{ ...styles.buttonBase, ...styles.cancelButton }}
            onClick={onCancel}
          >
            취소하기
          </button>

          <button
            type="button"
            style={{ ...styles.buttonBase, ...styles.confirmButton }}
            onClick={onConfirm}
          >
            구매 확정
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPurchase;
