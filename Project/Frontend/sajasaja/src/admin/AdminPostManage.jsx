import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PostManageModal from "./modal/PostManageModal";
import CustomSelect from "../components/CustomSelect";
import { api, setInterceptor } from "../assets/setIntercepter";
import { formatDate } from "../assets/utils";

const SearchBar = styled.div`
  display: flex;
  overflow: visible;
  margin-bottom: 16px;
  gap: 18px;

  input {
    width: calc(100% - 80px - 20px);
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 11px;
    &:focus {
      outline: none;
    }
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

  th {
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

  th:nth-child(2),
  td:nth-child(2) {
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
    color: #ff5a5a;
  }
  &.approve {
    background-color: #fff;
    color: #44824a;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  font-size: 11px;

  button {
    cursor: pointer;
    padding: 4px 8px;
    background: none;
    border: none;
    font-size: 11px;
    
    &:disabled {
        color: #ccc;
        cursor: default;
    }

    &.active {
      font-weight: 700;
      color: #000;
    }
  }
`;

const NoResult = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 0;
  color: #888;
  font-size: 14px;
`;

// 백엔드 process 값과 매핑: -1(전체), 0(대기), 1(승인), 4(반려)
const statusOptions = [
  { value: -1, label: "전체" },
  { value: 0, label: "대기" },
  { value: 1, label: "승인" },
  { value: 4, label: "반려" },
];

const AdminPostManage = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // 필터 및 검색 상태
  const [filterStatus, setFilterStatus] = useState(-1); // 기본값 전체(-1)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  // 페이지네이션 상태
  const [page, setPage] = useState(0); // 현재 페이지 (0부터 시작)
  const [totalPages, setTotalPages] = useState(0);

  // 데이터 로드 (페이지, 필터, 검색어 변경 시 실행)
  useEffect(() => {
    loadData();
  }, [page, filterStatus, searchQuery]);

  const loadData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/";
      return;
    }

    setInterceptor(token);

    try {
      const response = await api.get("/api/admin/posts", {
        params: {
            page: page,
            size: 15,
            process: filterStatus, // -1, 0, 1, 4
            searchQuery: searchQuery // 검색어
        }
      });

      console.log("데이터 로드:", response.data);
      
      // 배열 데이터 설정
      setPosts(response.data.posts || []);
      setTotalPages(response.data.totalPages || 0);
      
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      if (err.response && err.response.status === 403) {
          alert("관리자 권한이 없습니다.");
      }
    }
  };

  const handleSearch = () => {
      setSearchQuery(searchInput);
      setPage(0); // 검색 시 1페이지로 초기화
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFilterChange = (e) => {
      setFilterStatus(parseInt(e.target.value));
      setPage(0); // 필터 변경 시 1페이지로 초기화
  };

  const handleManageClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleModalAction = async (actionType, postId) => {
    let processValue = 0;
    if (actionType === "approve") processValue = 1;
    else if (actionType === "companion") processValue = 4; // 백엔드에서 반려 코드는 4
    else return;

    try {
      const response = await api.patch(`/api/admin/post/${postId}`, null, {
        params: { process: processValue }
      });

      if (response.status === 200) {
        alert("처리가 완료되었습니다.");
        setIsModalOpen(false);
        loadData(); // 목록 새로고침
      }
    } catch (err) {
      console.error("처리 실패:", err);
      alert(err.response?.data?.message || "오류가 발생했습니다.");
    }
  };

  // 페이지네이션 버튼 렌더링 로직 (5개씩 끊어서 보여주기)
  const renderPagination = () => {
      const pageGroupSize = 5;
      const currentGroup = Math.floor(page / pageGroupSize);
      const startPage = currentGroup * pageGroupSize;
      const endPage = Math.min(startPage + pageGroupSize, totalPages);
      
      const pages = [];
      for (let i = startPage; i < endPage; i++) {
          pages.push(
              <button 
                  key={i} 
                  onClick={() => setPage(i)}
                  className={page === i ? 'active' : ''}
              >
                  {i + 1}
              </button>
          );
      }
      return pages;
  };

  // 상태 표시 헬퍼 함수
  const getStatusInfo = (status) => {
      // status: 0(대기), 1~3(승인/진행중), 4(반려)
      if (status === 1 || status === 2 || status === 3) return { class: "approve", text: "승인" };
      if (status === 4) return { class: "companion", text: "반려" };
      return { class: "waiting", text: "대기" };
  };

  return (
    <>
      <SearchBar>
        <input
          type="text"
          placeholder="공구 제목 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {/* CustomSelect 대신 네이티브 select 사용 (이벤트 핸들링 간소화) */}
        <select 
            value={filterStatus} 
            onChange={handleFilterChange}
            style={{ width: "80px", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "11px" }}
        >
            {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
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
          {posts && posts.length > 0 ? (
            posts.map((post, i) => {
              const statusInfo = getStatusInfo(post.process); // DTO의 process 필드 사용
              return (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.title}</td>
                    <td>{post.hostNickname}</td>
                    <td>{formatDate(post.endAt)}</td>
                    <td>{formatDate(post.createdAt)}</td>
                    <td>
                      <StatusButton
                        className={statusInfo.class}
                        onClick={() => handleManageClick(post)}
                      >
                        {statusInfo.text}
                      </StatusButton>
                    </td>
                  </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">
                <NoResult>검색 결과가 없습니다.</NoResult>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 페이지네이션 */}
      <Pagination>
        <button onClick={() => setPage(0)} disabled={page === 0}>&lt;&lt;</button>
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>&lt;</button>
        
        {renderPagination()}
        
        <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>&gt;</button>
        <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>&gt;&gt;</button>
      </Pagination>

      {isModalOpen && selectedPost && (
        <PostManageModal
          post={selectedPost}
          onClose={handleCloseModal}
          onAction={handleModalAction}
          style={{ transition: "all 1s" }}
        />
      )}
    </>
  );
};

export default AdminPostManage;