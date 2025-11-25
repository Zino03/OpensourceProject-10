import React, { useState } from 'react';
import styled from 'styled-components';
import PostManageModal from './modal/PostManageModal';

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

  &.companion {
    background-color: #FFF5E0;
    color: #FF5A5A;
  }
  &.approve {
    background-color: #FFF5E0;
    color: #44824A;
  }
  &.waiting {
    background-color: #FFF5E0;
    color: #555;
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

const mockPosts = [
  { id: 1, title: '닭가슴살 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.10', status: 'waiting' },
  { id: 2, title: '딸기 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.13', status: 'approve' },
  { id: 3, title: '피자 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.13', status: 'waiting' },
  { id: 4, title: '노트북 공구', writer: '변진호', deadline: '2025.11.20', date: '2025.11.13', status: 'companion' },
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

  // 콘텐츠 렌더링
  return (
    <>
      <SearchBar>
        <input type="text" placeholder="검색" />
        <select>
          <option value="all">전체</option>
          <option value="approve">승인</option>
          <option value="companion">반려</option>
          <option value="waiting">대기</option>
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
          {mockPosts.map((post) => (
            <tr key={post.id}
              onClick={() => handleManageClick(post)}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.writer}</td>
              <td>{post.deadline}</td>
              <td>{post.date}</td>
              <td>
                <StatusButton className={post.status}>
                  {post.status === 'approve' ? '승인' : post.status === 'companion' ? '반려' : '대기'}
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