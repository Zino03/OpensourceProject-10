import React from 'react';
import styled from 'styled-components';

const SearchBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 12px;

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 12px;
    &:focus { outline: none; }
  }
  
  select {
    padding: 12px;
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

  th:nth-child(4), td:nth-child(4) {
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
  
  &.hide {
    background-color: #FFF5E0;
    color: #555;
  }
  &.close {
    background-color: #FFF5E0;
    color: #FF5A5A;
  }
  &.progress {
    background-color: #FFF5E0;
    color: #44824A;
  }
  &.waiting {
    background-color: #FFF5E0;
    color: #000;
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

const mockReports = [
  { id: 1, title: '닭가슴살 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.10', status: 'waiting' },
  { id: 2, title: '딸기 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.13', status: 'progress' },
  { id: 3, title: '피자 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.13', status: 'hide' },
  { id: 4, title: '노트북 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.13', status: 'close' },
];


const AdminPaymentManage = () => {
  // 콘텐츠 렌더링
  return (
    <>
      <SearchBar>
        <input type="text" placeholder="검색" />
        <select>
          <option value="all">전체</option>
          <option value="progress">진행중</option>
          <option value="close">마감</option>
          <option value="hide">숨김</option>
          <option value="waiting">승인 대기</option>
        </select>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <th>공구 ID</th>
            <th>공구 제목</th>
            <th>작성자</th>
            <th>마감일</th>
            <th>작성일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {mockReports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.title}</td>
              <td>{report.writer}</td>
              <td>{report.deadline}</td>
              <td>{report.date}</td>
              <td>
                <StatusButton className={report.status}>
                  {report.status === 'progress' ? '진행중' : report.status === 'close' ? '마감' : report.status === 'hide' ? '숨김' : '승인 대기'}
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