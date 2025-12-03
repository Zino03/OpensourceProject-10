// InvoiceModal.jsx
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
  z-index: 999;
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

// 테이블 감싸는 래퍼
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
    z-index: 1;
  }

  td {
    padding: 16px 8px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
    word-break: break-all;
    box-sizing: border-box;
  }
`;

// 입력 컨트롤 스타일
const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  box-sizing: border-box;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #999;
  }
  box-sizing: border-box;
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

const SaveButton = styled.button`
  padding: 12px 30px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`;

// 택배사 목록
const COURIERS = [
  "CJ대한통운",
  "우체국택배",
  "한진택배",
  "롯데택배",
  "로젠택배",
  "GS25편의점",
  "CU편의점",
];

/**
 * props
 * - isOpen: 모달 열림 여부
 * - onClose: 닫기 버튼/바깥 영역 클릭 시 실행
 * - participants: [
 *     {
 *       id,
 *       name,
 *       nickname,
 *       address,
 *       invoice?: { courier, number }
 *     }
 *   ]
 * - onSave: (deliveryData) => Promise  (백엔드 연동은 부모에서)
 */
const InvoiceModal = ({ isOpen, onClose, participants, onSave }) => {
  const [deliveryData, setDeliveryData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // 모달 열릴 때마다 participants 기반으로 로컬 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setDeliveryData(
        (participants || []).map((p) => ({
          id: p.id,
          name: p.name,
          nickname: p.nickname,
          address: p.address,
          courier: p.invoice?.courier || "",
          invoiceNum: p.invoice?.number || "",
        }))
      );
      setIsSaving(false);
    }
  }, [isOpen, participants]);

  if (!isOpen) return null;

  // 입력값 변경
  const handleChange = (id, field, value) => {
    setDeliveryData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // 저장 버튼 클릭 → 부모 onSave 호출 (백엔드 연동)
  const handleSave = async () => {
    if (!onSave) return;

    try {
      setIsSaving(true);
      await onSave(deliveryData); // 부모에서 API 호출 + 성공 시 모달 닫기 등 처리
    } catch (e) {
      console.error(e);
      alert("송장 정보 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Overlay onClick={isSaving ? undefined : onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>배송 정보 입력</Title>

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
                <th>택배사</th>
                <th>송장번호</th>
              </tr>
            </thead>

            <tbody>
              {deliveryData.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.nickname}</td>
                  <td style={{ textAlign: "left" }}>{row.address}</td>
                  <td>
                    <StyledSelect
                      defaultValue={deliveryData.courier}
                      value={row.courier}
                      onChange={(e) =>
                        handleChange(row.id, "courier", e.target.value)
                      }
                      disabled={isSaving}
                    >
                      <option value="">선택</option>
                      {COURIERS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </StyledSelect>
                  </td>
                  <td>
                    <StyledInput
                      type="text"
                      value={row.invoiceNum}
                      placeholder="송장번호 입력"
                      onChange={(e) =>
                        handleChange(
                          row.id,
                          "invoiceNum",
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                      disabled={isSaving}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        <ButtonGroup>
          <CloseButton onClick={onClose} disabled={isSaving}>
            닫기
          </CloseButton>
          <SaveButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? "저장 중..." : "저장"}
          </SaveButton>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

export default InvoiceModal;
