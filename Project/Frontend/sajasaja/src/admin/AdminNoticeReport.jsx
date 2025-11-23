import React from 'react';
import styled from 'styled-components';

const SearchBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;

  input {
    width: 400px;
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

const mockReports = [
  { id: 1, reporter: '김서연', target: '변진호', content: '옥상으로 따라왕', date: '2025.11.10', status: 'waiting' },
  { id: 2, reporter: '최지우', target: '변진호', content: '지금 모여주세요', date: '2025.11.13', status: 'rejected' },
  { id: 2, reporter: '최지우', target: '변진호', content: '내일 볼까요 말까요', date: '2025.11.13', status: 'complete' },
];


const AdminNoticePage = () => {
  // 콘텐츠 렌더링
  return (
    <>
      <SearchBar>
        <input type="text" placeholder="검색" />
        <select>
          <option value="all">전체</option>
          <option value="waiting">대기</option>
          <option value="rejected">반려</option>
          <option value="completed">제재</option>
        </select>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <th>신고 ID</th>
            <th>신고자</th>
            <th>신고 대상</th>
            <th>공지 내용</th>
            <th>접수일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {mockReports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.reporter}</td>
              <td>{report.target}</td>
              <td>{report.content}</td>
              <td>{report.date}</td>
              <td>
                <StatusButton className={report.status}>
                  {report.status === 'waiting' ? '대기' : report.status === 'rejected' ? '반려' : '제재'}
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

export default AdminNoticePage;   