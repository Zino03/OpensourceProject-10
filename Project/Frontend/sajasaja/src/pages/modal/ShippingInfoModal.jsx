// 파일명: ShippingInfoModal.jsx
import React from "react";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  width: "280px",
  maxWidth: "90vw",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
  padding: "14px 18px 14px",
  boxSizing: "border-box",
  position: "relative",
  fontFamily:
    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
};

const headerTextStyle = {
  fontSize: "14px",
  fontWeight: 600,
  textAlign: "center",
};

const closeIconStyle = {
  position: "absolute",
  top: "10px",
  right: "12px",
  fontSize: "16px",
  cursor: "pointer",
  color: "#111",
  userSelect: "none",
};

const dividerStyle = {
  marginTop: "10px",
  marginBottom: "10px",
  height: "1px",
  backgroundColor: "#e5e5e5",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "6px",
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#111",
};

const valueStyle = {
  fontSize: "13px",
  color: "#333",
  marginLeft: "12px",
  textAlign: "right",
  wordBreak: "break-all",
};

function ShippingInfoModal({ carrierName, trackingNumber, onClose }) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      {/* 모달 박스 클릭 시 닫히지 않도록 */}
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* 상단 제목 + X 버튼 */}
        <div style={headerTextStyle}>배송정보</div>
        <div style={closeIconStyle} onClick={onClose}>
          ✕
        </div>

        {/* 구분선 */}
        <div style={dividerStyle} />

        {/* 택배사 */}
        <div style={rowStyle}>
          <div style={labelStyle}>택배사</div>
          <div style={valueStyle}>{carrierName || "-"}</div>
        </div>

        {/* 송장번호 */}
        <div style={rowStyle}>
          <div style={labelStyle}>송장번호</div>
          <div style={valueStyle}>{trackingNumber || "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default ShippingInfoModal;
