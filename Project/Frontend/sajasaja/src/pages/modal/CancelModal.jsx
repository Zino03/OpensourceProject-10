import React from "react";
import styled from "styled-components";

function OrderDetailOrderReceived() { 
  const navigate = useNavigate();

  // ... (orders, loading, errorMsg, counts 상태 생략)

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // ... (fetchOrders, openCancelModal, closeCancelModal 함수 생략)

  /* ===========================
      3. 실제 주문 취소 API 호출 (onConfirm에 연결됨)
         - PATCH /api/mypage/order/{buyerId}/cancel
    ============================ */
  const handleConfirmCancel = async () => {
    if (!selectedOrder) return;

    try {
      // ✅ API 호출
      await api.patch(`/api/mypage/order/${selectedOrder.id}/cancel`);

      // 취소 후 주문 목록 새로고침
      fetchOrders(); 

      closeCancelModal();
    } catch (err) {
      console.error("주문 취소 실패:", err);
      alert(err.response?.data?.message || "주문 취소 중 오류가 발생했습니다.");
    }
  };
}
export default CancelModal;