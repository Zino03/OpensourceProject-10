//배송정보 보는 모달
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
  position: sticky;
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

const DeliveryInfoModal = ({ isOpen, onClose, participants, onSave }) => {
  const [deliveryData, setDeliveryData] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // 기존 participants 데이터를 복사해서 state에 넣음
      // invoice 정보가 없으면 빈 문자열로 초기화
      setDeliveryData(
        participants.map((p) => ({
          id: p.id,
          name: p.name,
          nickname: p.nickname,
          address: p.address,
          req: `${p.entrance.acess} ${p.entrance.detail}`, //TODO: FREE 자유출입 형식 변경
          tel: p.phone,
        }))
      );

      console.log(participants)
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
              <col style={{ width: "100px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "140px" }} />
              <col style={{ width: "200px" }} />
            </colgroup>

            <thead>
              <tr>
                <th>성명</th>
                <th>닉네임</th>
                <th>배송지</th>
                <th>요청사항</th>
                <th>연락처</th>
              </tr>
            </thead>
            <tbody>
              {deliveryData.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.nickname}</td>
                  <td style={{ textAlign: "left" }}>{row.address}</td>
                  <td>{row.req}</td>
                  <td>{row.tel}</td>
                </tr>
              ))}
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
