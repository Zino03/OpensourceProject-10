import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // 달력
import { ko } from 'date-fns/locale'; // 한글 설정

// 한글 로케일 등록
registerLocale('ko', ko);

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
  width: 800px;
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
  overflow-y: visible;
  margin-bottom: 20px;
  flex: 1;
  padding-right: 100px;
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

const DatePickerWrapper = styled.div`
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .custom-datepicker {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #FF7E36;
    }
  }
`;

const ReceiveModal = ({ isOpen, onClose, participants, onSave }) => {
  // 로컬 상태 입력값 관리 (초기값은 부모에게서 받은 participants)
  const [RData, setRData] = useState([]);

  // 모달이 열릴 때마다 데이터 동기화
  useEffect(() => {
    if (isOpen) {
      // 기존 participants 데이터를 복사해서 state에 넣음
      // pickup 정보가 없으면 빈 문자열로 초기화
      setRData(participants.map(p => ({
        id: p.id,
        name: p.name,
        nickname: p.nickname,
        receiveDate: p.receive?.receiveDate || '',
        receiveTime: p.receive?.receiveTime || ''
      })));
    }
  }, [isOpen, participants]);

  if (!isOpen) return null;

  // 입력값 변경 핸들러
  const handleDateChange = (id, date) => {
    setRData(prev => prev.map(item => 
      item.id === id ? { ...item, receiveDate: date } : item
    ));
  };

  const handleTimeChange = (id, time) => {
    setRData(prev => prev.map(item => 
      item.id === id ? { ...item, receiveTime: time } : item
    ));
  };

  const handleSave = () => {
    // 저장할 때는 다시 문자열 포맷(YYYY-MM-DD, HH:mm)으로 변환하여 부모에게 전달
    const formattedData = RData.map(item => {
      const dateStr = item.receiveDate 
        ? item.receiveDate.toISOString().split('T')[0] // "2025-11-20"
        : '';
      
      const timeStr = item.receiveTime 
        ? item.receiveTime.toTimeString().split(' ')[0].substring(0, 5) // "14:30"
        : '';

      return {
        ...item,
        receiveDate: dateStr,
        receiveTime: timeStr
      };
    });

    onSave(formattedData);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>수령 일자 입력</Title>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>성명</th>
                <th>닉네임</th>
                <th>수령일</th>
                <th>수령 시간</th>
              </tr>
            </thead>
            <tbody>
              {RData.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.nickname}</td>
                  <td>
                    <DatePickerWrapper>
                      <DatePicker
                        locale={ko} // 한글 달력
                        selected={row.receiveDate}
                        onChange={(date) => handleDateChange(row.id, date)}
                        dateFormat="yyyy-MM-dd" // 표시 형식
                        placeholderText="날짜 선택"
                        className="custom-datepicker"
                      />
                    </DatePickerWrapper>
                  </td>
                  <td>
                    <DatePickerWrapper>
                      <DatePicker
                        selected={row.receiveTime}
                        onChange={(time) => handleTimeChange(row.id, time)}
                        showTimeSelect
                        showTimeSelectOnly // 시간만 선택 모드
                        timeIntervals={30} // 30분 단위
                        timeCaption="시간"
                        dateFormat="HH:mm" // 표시 형식
                        placeholderText="시간 선택"
                        className="custom-datepicker"
                      />
                    </DatePickerWrapper>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        <ButtonGroup>
          <CloseButton onClick={onClose}>닫기</CloseButton>
          <SaveButton onClick={handleSave}>저장</SaveButton>
        </ButtonGroup>

      </ModalContainer>
    </Overlay>
  );
};

export default ReceiveModal;