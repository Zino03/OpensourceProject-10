import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SearchBar = styled.div`
  display: flex;
  overflow: visible;
  margin-bottom: 24px;
  gap: 18px;

  input {
    width: 80%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 12px;
    &:focus { outline: none; }
  }
  
  select {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 12px;
    cursor: pointer;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 

  th, td {
    padding: 12px;
    border-bottom: 1px solid #eee;
    text-align: center;
  }
  
  th {
    background-color: #f9f9f9;
    font-weight: 600;
  }

  th:nth-child(2), td:nth-child(2) {
    width: 20%;
  }
`;

const StatusButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  
  &.waiting {
    background-color: #FFF5E0;
    color: #555;
  }
  &.rejected {
    background-color: #FFF5E0;
    color: #FF5A5A;
  }
  &.complete {
    background-color: #FFF5E0;
    color: #44824A;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;

  span {
    cursor: pointer;
    padding: 0 8px;
    &.active {
      font-weight: 600;
    }
  }
`;

const mockPayments = [
  { id: 1, title: '닭가슴살 공구', writer: '변진호', amount: '20000', deadline: '2025.11.20', date: '2025.11.10', status: 'waiting' },
  { id: 2, title: '딸기 공구', writer: '변진호', amount: '400000', deadline: '2025.11.20', date: '2025.11.13', status: 'rejected' },
  { id: 3, title: '피자 공구', writer: '변진호', amount: '28900', deadline: '2025.11.20', date: '2025.11.13', status: 'complete' },
];


const AdminPaymentManage = () => {
  const navigate = useNavigate();

  const handleDetailClick = (id) => {
     navigate(`/admin/payment/${id}`);
  };

  // 콘텐츠 렌더링
  return (
    <>
      <SearchBar>
        <input type="text" placeholder="검색" />
        <select>
          <option value="all">전체</option>
          <option value="waiting">대기</option>
          <option value="rejected">취소</option>
          <option value="completed">완료</option>
        </select>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <th>공구 ID</th>
            <th>공구 제목</th>
            <th>작성자</th>
            <th>총 결제 금액</th>
            <th>마감일</th>
            <th>작성일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {mockPayments.map((payment) => (
            <tr key={payment.id}
              onClick={() => handleDetailClick(payment.id)}>
              <td>{payment.id}</td>
              <td>{payment.title}</td>
              <td>{payment.writer}</td>
              <td>{payment.amount}원</td>
              <td>{payment.deadline}</td>
              <td>{payment.date}</td>
              <td>
                <StatusButton className={payment.status}>
                  {payment.status === 'waiting' ? '대기' : payment.status === 'rejected' ? '취소' : '완료'}
                </StatusButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <span>&lt;&lt;</span>
        <span>&lt;</span>
        <span className="active">1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>&gt;</span>
        <span>&gt;&gt;</span>
      </Pagination>
    </>
  );
};

export default AdminPaymentManage;