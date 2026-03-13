// 파일명: ReviewModal.jsx
import React, { useEffect, useState } from "react";

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
  width: "520px",
  maxWidth: "95vw",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
  overflow: "hidden",
  fontFamily:
    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
};

/* 상단 회색 헤더 */
const headerStyle = {
  backgroundColor: "#f4f4f4",
  padding: "12px 16px",
  position: "relative",
  textAlign: "center",
  fontSize: "15px",
  fontWeight: 600,
};

const closeIconStyle = {
  position: "absolute",
  top: "10px",
  right: "16px",
  fontSize: "18px",
  cursor: "pointer",
  color: "#333",
  userSelect: "none",
};

const contentStyle = {
  padding: "16px 20px 12px",
};

const productRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "12px",
};

const productInfoLeft = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flex: 1,
};

const productImageStyle = {
  width: "72px",
  height: "72px",
  borderRadius: "6px",
  objectFit: "cover",
  backgroundColor: "#f3f3f3",
};

const productTextBox = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const productNameStyle = {
  fontSize: "14px",
  fontWeight: 600,
};

const productHostLabel = {
  fontSize: "12px",
  color: "#777",
};

const productHostValue = {
  fontSize: "12px",
  color: "#333",
  marginLeft: "6px",
};

const priceStyle = {
  fontSize: "14px",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const dividerStyle = {
  height: "1px",
  backgroundColor: "#e5e5e5",
  margin: "8px 0 14px",
};

/* 공동구매 만족도 */
const sectionLabelStyle = {
  fontSize: "13px",
  fontWeight: 600,
  marginBottom: "6px",
};

const starsRowStyle = {
  display: "flex",
  gap: "4px",
  marginBottom: "14px",
};

const starStyle = (active) => ({
  fontSize: "20px",
  cursor: "pointer",
  color: active ? "#FFB400" : "#d0d0d0",
});

/* 후기 입력 */
const textareaStyle = {
  width: "100%",
  height: "150px",
  resize: "none",
  borderRadius: "10px",
  border: "1px solid #e0e0e0",
  padding: "10px 12px",
  fontSize: "13px",
  boxSizing: "border-box",
  outline: "none",
  fontFamily:
    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
};

const warningTextStyle = {
  marginTop: "6px",
  fontSize: "11px",
  color: "#D32F2F",
  textAlign: "left",
};

/* 하단 버튼 영역 */
const footerWrapperStyle = {
  borderTop: "1px solid #f0f0f0",
  backgroundColor: "#fafafa",
  padding: "10px 16px",
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
};

const cancelButtonStyle = {
  minWidth: "90px",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid #d0d0d0",
  backgroundColor: "#fff",
  fontSize: "13px",
  cursor: "pointer",
};

const submitButtonStyle = {
  minWidth: "90px",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid #FF7E00",
  backgroundColor: "#FF7E00",
  color: "#fff",
  fontSize: "13px",
  cursor: "pointer",
};

function ReviewModal({
  orderId,
  productName,
  host,
  price,
  imageUrl,
  onClose,
  onSubmit,
}) {
  const [rating, setRating] = useState(0); // 1~5
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert("공동구매 만족도 별점을 선택해주세요.");
      return;
    }
    if (reviewText.trim().length < 10) {
      alert("후기를 최소 10자 이상 입력해주세요.");
      return;
    }
    onSubmit(orderId, rating, reviewText);
  };

  const renderStars = () =>
    [1, 2, 3, 4, 5].map((num) => (
      <span
        key={num}
        style={starStyle(num <= rating)}
        onClick={() => setRating(num)}
      >
        ★
      </span>
    ));

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* 상단 헤더 */}
        <div style={headerStyle}>
          후기 작성
          <span style={closeIconStyle} onClick={onClose}>
            ✕
          </span>
        </div>

        {/* 내용 */}
        <div style={contentStyle}>
          {/* 상품 정보 영역 */}
          <div style={productRowStyle}>
            <div style={productInfoLeft}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={productName}
                  style={productImageStyle}
                />
              ) : (
                <div style={productImageStyle} />
              )}

              <div style={productTextBox}>
                <div style={productNameStyle}>{productName}</div>
                <div>
                  <span style={productHostLabel}>주최자</span>
                  <span style={productHostValue}>{host || "-"}</span>
                </div>
              </div>
            </div>

            <div style={priceStyle}>{price || ""}</div>
          </div>

          <div style={dividerStyle} />

          {/* 공동구매 만족도 */}
          <div>
            <div style={sectionLabelStyle}>공동구매 만족도</div>
            <div style={starsRowStyle}>{renderStars()}</div>
          </div>

          {/* 후기 입력창 */}
          <div>
            <textarea
              style={textareaStyle}
              placeholder="후기를 입력해주세요! (최소 10자)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div style={warningTextStyle}>
              허위 후기 작성 시 불이익이 있을 수 있습니다. 후기는 주최자의 매너
              점수에 적용됩니다.
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div style={footerWrapperStyle}>
          <button type="button" style={cancelButtonStyle} onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            style={submitButtonStyle}
            onClick={handleSubmit}
          >
            후기 등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
