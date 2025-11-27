import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
  width: 900px;
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

// 입력 컨트롤 스타일
const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  &:focus { outline: none;}
  box-sizing: border-box;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  &:focus { outline: none;}
  &::placeholder { color: #999; }
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
  background-color: #E0E0E0;
  color: #333;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  &:hover { background-color: #d5d5d5; }
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
  &:hover { background-color: #333; }
`;

// 택배사 목록
const COURIERS = ['CJ대한통운', '우체국택배', '한진택배', '롯데택배', '로젠택배', 'GS25편의점', 'CU편의점'];

const InvoiceModal = ({ isOpen, onClose, participants, onSave }) => {
  // 로컬 상태 입력값 관리 (초기값은 부모에게서 받은 participants)
  const [deliveryData, setDeliveryData] = useState([]);

  // 모달이 열릴 때마다 데이터 동기화
  useEffect(() => {
    if (isOpen) {
      // 기존 participants 데이터를 복사해서 state에 넣음
      // invoice 정보가 없으면 빈 문자열로 초기화
      setDeliveryData(participants.map(p => ({
        id: p.id,
        name: p.name,
        nickname: p.nickname,
        address: p.address,
        courier: p.invoice?.courier || '',
        invoiceNum: p.invoice?.number || ''
      })));
    }
  }, [isOpen, participants]);

  if (!isOpen) return null;

  // 입력값 변경 핸들러
  const handleChange = (id, field, value) => {
    setDeliveryData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    // 부모 컴포넌트의 저장 함수 호출
    onSave(deliveryData);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>배송 정보 입력</Title>
        <TableWrapper>
          <Table>
            <colgroup>
              <col style={{ width: '100px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: '140px' }} />
              <col style={{ width: '200px' }} /> 
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
                  <td style={{ textAlign: 'left', lineHeight: '1.4' }}>{row.address}</td>
                  <td>
                    <StyledSelect 
                      value={row.courier} 
                      onChange={(e) => handleChange(row.id, 'courier', e.target.value)}
                    >
                      <option value="">선택</option>
                      {COURIERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </StyledSelect>
                  </td>
                  <td>
                    <StyledInput 
                      type="text" 
                      value={row.invoiceNum} 
                      placeholder="송장번호 입력"
                      onChange={(e) => handleChange(row.id, 'invoiceNum', e.target.value.replace(/[^0-9]/g, ''))} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        <ButtonGroup>
          <CloseButton onClick={onClose}>닫기</CloseButton>
          <SaveButton onClick={handleSave}>배송 정보 저장</SaveButton>
        </ButtonGroup>

      </ModalContainer>
    </Overlay>
  );
};

export default InvoiceModal;