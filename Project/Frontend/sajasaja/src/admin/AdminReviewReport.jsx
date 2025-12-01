import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import ReportProcessModal from "./modal/ReportProcessModal";
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
    border-radius: 8px;
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

  th:nth-child(4),
  td:nth-child(4) {
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
    color: #ff5a5a;
  }
  &.completed {
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
`;

const mockReports = [
  {
    id: 1,
    reporter: "김서연",
    target: "변진호",
    content: "옥상으로 따라왕",
    date: "2025.11.10",
    status: "waiting",
  },
  {
    id: 2,
    reporter: "최지우",
    target: "변진호",
    content: "지금 모여주세요",
    date: "2025.11.13",
    status: "rejected",
  },
  {
    id: 3,
    reporter: "최지우",
    target: "변진호",
    content: "내일 볼까요 말까요",
    date: "2025.11.13",
    status: "completed",
  },
  {
    id: 4,
    reporter: "김서연",
    target: "변진호",
    content: "옥상으로 따라왕",
    date: "2025.11.10",
    status: "waiting",
  },
  {
    id: 5,
    reporter: "최지우",
    target: "변진호",
    content: "지금 모여주세요",
    date: "2025.11.13",
    status: "rejected",
  },
  {
    id: 6,
    reporter: "최지우",
    target: "변진호",
    content: "내일 볼까요 말까요",
    date: "2025.11.13",
    status: "completed",
  },
  {
    id: 7,
    reporter: "김서연",
    target: "변진호",
    content: "옥상으로 따라왕",
    date: "2025.11.10",
    status: "waiting",
  },
  {
    id: 8,
    reporter: "최지우",
    target: "변진호",
    content: "지금 모여주세요",
    date: "2025.11.13",
    status: "rejected",
  },
  {
    id: 9,
    reporter: "최지우",
    target: "변진호",
    content: "내일 볼까요 말까요",
    date: "2025.11.13",
    status: "completed",
  },
  {
    id: 10,
    reporter: "최지우",
    target: "변진호",
    content: "내일 볼까요 말까요",
    date: "2025.11.13",
    status: "completed",
  },
];

const statusOptions = [
  { value: "all", label: "전체" },
  { value: "waiting", label: "대기" },
  { value: "completed", label: "제재" },
  { value: "rejected", label: "반려" },
];

const AdminReviewPage = () => {
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isModalOpen === false) {
      loadData();
    }
  }, [isModalOpen]);

  const loadData = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      window.location.href = "/";
    }

    setInterceptor(token);

    try {
      const response = await api.get("/api/admin/reports/REVIEW");

      console.log(response.data);

      setReports(response.data.reports);
    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(`${err.response.data.message || "알 수 없는 오류"}`);
      } else {
        // 네트워크 오류 등
        alert("서버와 연결할 수 없습니다.");
      }
    }
  };

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const [searchInputValue, setSearchInputValue] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 엔터 감지
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setConfirmedSearchTerm(searchInputValue);
    }
  };

  const filteredReview = useMemo(() => {
    return reports.filter((review) => {
      // 상태 필터링
      const statusMatch =
        filterStatus === "all" || review.status === filterStatus;

      // 검색어 필터링 (모든 필드 검사)
      // 데이터 객체의 값들(Values)만 뽑아서 배열로 만든 뒤, 하나라도 검색어를 포함하는지 확인
      const searchMatch = Object.values(review).some((val) =>
        String(val).toLowerCase().includes(confirmedSearchTerm.toLowerCase())
      );

      return statusMatch && searchMatch; // 두 조건 모두 만족해야 함
    });
  }, [confirmedSearchTerm, filterStatus, reports]);

  // 콘텐츠 렌더링
  return (
    <>
      <SearchBar>
        <input
          type="text"
          placeholder="검색"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <CustomSelect
          value={filterStatus}
          onChange={(val) => setFilterStatus(val)}
          options={statusOptions}
          style={{ width: "80px" }}
        ></CustomSelect>
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
            filteredReview.map((review, i) => (
              <tr key={review.id}>
                <td>{i + 1}</td>
                <td>{review.reporterNickname}</td>
                <td>{review.reportedNickname}</td>
                <td>{review.title}</td>
                <td>{formatDate(review.reportedAt)}</td>
                <td>
                  <StatusButton
                    className={review.status}
                    onClick={() => handleOpenModal(review)}
                  >
                    {review.status === 0
                      ? "대기"
                      : review.status === 1
                      ? "반려"
                      : "제재"}
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
