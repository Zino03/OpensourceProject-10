import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import ReportProcessModal from './modal/ReportProcessModal';

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
    padding: 16px 8px;
    background-color: #f9f9f9;
    font-weight: 600;
    border-bottom: 1px solid #eee;
    text-align: center;
  }
  
  td {
    padding: 8px;
    border-bottom: 1px solid #eee;
    text-align: center;
  }

  th:nth-child(4), td:nth-child(4) {
    width: 30%;
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

const mockReports = [
  { id: 1, reporter: '김서연', target: '변진호', content: '옥상으로 따라왕', date: '2025.11.10', status: 'waiting' },
  { id: 2, reporter: '최지우', target: '변진호', content: '지금 모여주세요', date: '2025.11.13', status: 'rejected' },
  { id: 3, reporter: '최지우', target: '변진호', content: '내일 볼까요 말까요', date: '2025.11.13', status: 'completed' },
  { id: 4, reporter: '김서연', target: '변진호', content: '옥상으로 따라왕', date: '2025.11.10', status: 'waiting' },
  { id: 5, reporter: '최지우', target: '변진호', content: '지금 모여주세요', date: '2025.11.13', status: 'rejected' },
  { id: 6, reporter: '최지우', target: '변진호', content: '내일 볼까요 말까요', date: '2025.11.13', status: 'completed' },
  { id: 7, reporter: '김서연', target: '변진호', content: '옥상으로 따라왕', date: '2025.11.10', status: 'waiting' },
  { id: 8, reporter: '최지우', target: '변진호', content: '지금 모여주세요', date: '2025.11.13', status: 'rejected' },
  { id: 9, reporter: '최지우', target: '변진호', content: '내일 볼까요 말까요', date: '2025.11.13', status: 'completed' },
  { id: 10, reporter: '최지우', target: '변진호', content: '내일 볼까요 말까요', date: '2025.11.13', status: 'completed' },
];


const AdminReviewPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);  
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
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
  
    const filteredReview = useMemo(() => {
      return mockReports.filter((review) => {
        // 상태 필터링
        const statusMatch = filterStatus === 'all' || review.status === filterStatus;
  
        // 검색어 필터링 (모든 필드 검사)
        // 데이터 객체의 값들(Values)만 뽑아서 배열로 만든 뒤, 하나라도 검색어를 포함하는지 확인
        const searchMatch = Object.values(review).some((val) => 
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
        <select
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}>
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
            <th>신고 제목</th>
            <th>접수일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
        {filteredReview.length > 0 ? (
            filteredReview.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.reporter}</td>
                <td>{review.target}</td>
                <td>{review.content}</td>
                <td>{review.date}</td>
                <td>
                <StatusButton className={review.status} onClick={() => handleOpenModal(review)}>
                  {review.status === 'waiting' ? '대기' : review.status === 'rejected' ? '반려' : '제재'}
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

      {isModalOpen && selectedReport && (
        <ReportProcessModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          type="review"
          data={selectedReport} 
        />
      )}
    </>
  );
};

export default AdminReviewPage;   