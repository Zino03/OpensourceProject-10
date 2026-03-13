// 배송정보 보는 모달
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Overlay = styled.div`
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

const ModalContainer = styled.div`
  background-color: #fff;
  width: 1000px;
  border-radius: 6px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  flex-shrink: 0;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 20px;
  flex: 1;
  padding-right: 12px;
`;

// 테이블 스타일
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: center;
  table-layout: fixed;
  white-space: pre-wrap;

  th {
    background-color: #fff;
    padding: 16px;
    font-weight: 500;
    position: sticky;
    top: 0;
    box-shadow: inset 0 -1px 0 #333;
    box-sizing: border-box;
  }

  td {
    padding: 16px 8px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
    word-break: break-all;
    box-sizing: border-box;
  }
`;

// 하단 버튼 그룹
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CloseButton = styled.button`
  padding: 12px 30px;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background-color: #d5d5d5;
  }
`;

// 🔹 entrance 한글 매핑
const ENTRANCE_LABELS = {
  PASSWORD: "공동현관 비밀번호",
  CALL: "경비실 호출",
  OTHER: "기타",
  FREE: "", // 화면에서 숨김
};

// 🔹 entrance 포맷팅 함수
const formatEntrance = (entrance) => {
  if (!entrance) return "";

  const access = entrance.acess; // 백에서 acess로 오고 있다 해서 그대로 씀
  const detail = entrance.detail || "";
  const label = ENTRANCE_LABELS[access] || "";

  // FREE → 라벨 없이 detail만 노출 (예: "자유 출입")
  if (access === "FREE") {
    return detail.trim();
  }

  // 그 외 → "공동현관 비밀번호 1234#", "경비실 호출 인터폰 눌러주세요" 이런 식
  return `${label} ${detail}`.trim();
};

const DeliveryInfoModal = ({ isOpen, onClose, participants }) => {
  const [deliveryData, setDeliveryData] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setDeliveryData(
        (participants || []).map((p) => ({
          id: p.id,
          name: p.name,
          nickname: p.nickname,
          reception: p.reception, // 받는 분
          address: p.address,
          req: formatEntrance(p.entrance),
          tel: p.phone,
        }))
      );
      console.log("배송 모달 participants:", participants);
    }
  }, [isOpen, participants]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>배송 정보</Title>
        <TableWrapper>
          <Table>
            <colgroup>
              <col style={{ width: "80px" }} />   {/* 성명 */}
              <col style={{ width: "80px" }} />   {/* 닉네임 */}
              <col style={{ width: "100px" }} />  {/* 받는분 */}
              <col style={{ width: "260px" }} />  {/* 배송지 */}
              <col style={{ width: "220px" }} />  {/* 요청사항 */}
              <col style={{ width: "150px" }} />  {/* 연락처 */}
            </colgroup>

            <thead>
              <tr>
                <th>성명</th>
                <th>닉네임</th>
                <th>받는분</th>
                <th>배송지</th>
                <th>요청사항</th>
                <th>연락처</th>
              </tr>
            </thead>
            <tbody>
              {deliveryData.length > 0 ? (
                deliveryData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.nickname}</td>
                    <td>{row.reception}</td>
                    <td style={{ textAlign: "left" }}>{row.address}</td>
                    <td>{row.req}</td>
                    <td>{row.tel}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: "20px", color: "#999" }}>
                    배송 정보가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>

        <ButtonGroup>
          <CloseButton onClick={onClose}>닫기</CloseButton>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

export default DeliveryInfoModal;
