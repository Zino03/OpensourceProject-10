import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import PostManageModal from './modal/PostManageModal';
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
    border-radius: 5px;
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

  th:nth-child(2), td:nth-child(2) {
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
  &.companion {
    background-color: #fff;
    color: #FF5A5A;
  }
  &.approve {
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

const mockPosts = [
  { id: 1, title: '닭가슴살 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.10', status: 'waiting' },
  { id: 2, title: '딸기 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.13', status: 'approve' },
  { id: 3, title: '피자 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.13', status: 'waiting' },
  { id: 4, title: '노트북 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.13', status: 'companion' },
];

const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'waiting', label: '대기' },
    { value: 'approve', label: '승인' },
    { value: 'companion', label: '반려' },
  ];

const AdminPaymentManage = () => {
  const [posts, setPosts] = useState(mockPosts); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); 

  const handleManageClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleModalAction = (actionType, postId) => {
    console.log(`Action: ${actionType}, Post ID: ${postId}`);
    
    // 임시
    let newStatus = '대기';
    switch(actionType) {
      case 'approve': newStatus = '승인'; break;
      case 'companion': newStatus = '반려'; break;
      default: return;
    }

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, status: newStatus } : post
      )
    );
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

  const filteredPost = useMemo(() => {
    return mockPosts.filter((post) => {
      // 상태 필터링
      const statusMatch = filterStatus === 'all' || post.status === filterStatus;

      // 검색어 필터링 (모든 필드 검사)
      // 데이터 객체의 값들(Values)만 뽑아서 배열로 만든 뒤, 하나라도 검색어를 포함하는지 확인
      const searchMatch = Object.values(post).some((val) => 
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
            <th>공구 ID</th>
            <th>공구 제목</th>
            <th>작성자</th>
            <th>마감일</th>
            <th>작성일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
        {filteredPost.length > 0 ? (
            filteredPost.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.writer}</td>
                <td>{post.deadline}</td>
                <td>{post.date}</td>
                <td>
                <StatusButton className={post.status} onClick={() => handleManageClick(post)}>
                  {post.status === 'approve' ? '승인' : post.status === 'companion' ? '반려' : '대기'}
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
      {isModalOpen && selectedPost && (
        <PostManageModal 
          post={selectedPost}
          onClose={handleCloseModal}
          onAction={handleModalAction}
        />
      )}
    </>
  );
};

export default AdminPaymentManage;