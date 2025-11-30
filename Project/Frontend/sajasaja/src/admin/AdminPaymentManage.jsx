import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';

const SearchBar = styled.div`
  display: flex;
  overflow: visible;
  margin-bottom: 16px;
  gap: 18px;

  input {
    width: 80%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 11px;
    &:focus { outline: none; }
  }
  
  select {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 11px;
    cursor: pointer;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;

  th{
    padding: 16px 20px;
    background-color: #f9f9f9;
    font-weight: 600;
    border-bottom: 1px solid #eee;
    text-align: center;
  }
  
  td {
    padding: 8px 20px;
    border-bottom: 1px solid #eee;
    text-align: center;
  }

  th:nth-child(2), td:nth-child(2) {
    width: 25%;
  }
`;

const StatusButton = styled.button`
  padding: 4px 12px;
  border: none;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  
  &.waiting {
    background-color: #fff;
    color: #555;
  }
  &.rejected {
    background-color: #fff;
    color: #FF5A5A;
  }
  &.completed {
    background-color: #fff;
    color: #44824A;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  font-size: 11px;

  span {
    cursor: pointer;
    padding: 0 8px;
    &.active {
      font-weight: 600;
    }
  }
`;

const NoResult = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 0;
  color: #888;
  font-size: 14px;
`

const mockPayments = [
  { id: 1, title: '닭가슴살 공구', depositor: '변진호', buyer: '김서연', amount: '20000', deadline: '2025.12.20', paymentDeadline: '2025.11.10', status: 'waiting' },
  { id: 2, title: '딸기 공구', depositor: '변진호', buyer: '김서연', amount: '400000', deadline: '2025.12.10', paymentDeadline: '2025.11.13', status: 'rejected' },
  { id: 3, title: '피자 공구', depositor: '변진호', buyer: '김서연', amount: '28900', deadline: '2025.01.20', paymentDeadline: '2025.11.13', status: 'completed' },
];

const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'waiting', label: '대기' },
    { value: 'completed', label: '완료' },
    { value: 'rejected', label: '취소' },
  ];

const AdminPaymentManage = () => {
  const navigate = useNavigate();

  const handleDetailClick = (id) => {
     navigate(`/admin/payment/${id}`);
  };

  const [searchInputValue, setSearchInputValue] = useState('');
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState(''); 
  const [filterStatus, setFilterStatus] = useState('all');

  // 엔터 감지
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setConfirmedSearchTerm(searchInputValue); 
    }
  };

  const filteredPayments = useMemo(() => {
    return mockPayments.filter((payment) => {
      // 상태 필터링
      const statusMatch = filterStatus === 'all' || payment.status === filterStatus;

      // 검색어 필터링 (모든 필드 검사)
      // 데이터 객체의 값들(Values)만 뽑아서 배열로 만든 뒤, 하나라도 검색어를 포함하는지 확인
      const searchMatch = Object.values(payment).some((val) => 
        String(val).toLowerCase().includes(confirmedSearchTerm.toLowerCase())
      );

      return statusMatch && searchMatch; // 두 조건 모두 만족해야 함
    });
  }, [confirmedSearchTerm, filterStatus]);

  // 콘텐츠 렌더링
  return (
    <>
      <SearchBar>
        <input type="text" placeholder="검색" 
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          onKeyDown={handleKeyDown}/>
        <CustomSelect
          value={filterStatus} 
          onChange={(val) => setFilterStatus(val)} 
          options={statusOptions}
          style={{width: "80px"}}>
        </CustomSelect>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>공구 제목</th>
            <th>입금자명</th>
            <th>구매자</th>
            <th>총 결제 금액</th>
            <th>마감일</th>
            <th>입금기한</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
        {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.title}</td>
                <td>{payment.depositor}</td>
                <td>{payment.buyer}</td>
                <td>{Number(payment.amount).toLocaleString()}원</td>
                <td>{payment.deadline}</td>
                <td>{payment.paymentDeadline}</td>
                <td>
                  <StatusButton 
                    className={payment.status} 
                    onClick={() => handleDetailClick(payment.id)}
                  >
                    {payment.status === 'waiting' ? '대기' 
                      : payment.status === 'rejected' ? '취소' 
                      : '완료'}
                  </StatusButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">
                <NoResult>검색 결과가 없습니다.</NoResult>
              </td>
            </tr>
          )}
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