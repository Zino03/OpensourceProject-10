import React from "react";
import styled from "styled-components";
import { FaCheck, FaEyeSlash } from "react-icons/fa";
import { api, setInterceptor } from "../../assets/setIntercepter";

// 게시물 모달
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 모달 컨테이너
const ModalContainer = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

// 공통 버튼 스타일
const ModalButton = styled.button`
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &.black-btn {
    background-color: #000;
    color: white;
    &:hover {
      background-color: #333;
    }
  }

  &.cancel-btn {
    background-color: #e0e0e0;
    color: #333;
    margin-top: 8px;
    &:hover {
      background-color: #d0d0d0;
    }
  }
`;

// props: onClose (모달 닫기), onAction (각 액션 처리), post (선택된 게시물 정보)
const PostManageModal = ({ onClose, onAction, post }) => {
  const handleStatusChange = async (process) => {
    // 부모 컴포넌트의 데이터를 업데이트

    const token = localStorage.getItem("accessToken");

    if (!token) {
      window.location.href = "/";
    }

    setInterceptor(token);

    try {
      const response = await api.patch(
        `/api/admin/post/${post.id}?process=${process}`
      );

      console.log(response.data);
    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(`${err.response.data.message || "알 수 없는 오류"}`);
      } else {
        // 네트워크 오류 등
        alert("서버와 연결할 수 없습니다.");
      }
    }

    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>게시물 관리</ModalTitle>

        <ModalButton
          className="black-btn"
          onClick={() => handleStatusChange(1)}
        >
          <FaCheck /> 승인
        </ModalButton>

        <ModalButton
          className="black-btn"
          onClick={() => handleStatusChange(4)}
        >
          <FaEyeSlash /> 반려
        </ModalButton>

        <ModalButton className="cancel-btn" onClick={onClose}>
          취소
        </ModalButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PostManageModal;
