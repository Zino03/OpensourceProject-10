import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import PaymentProcessModal from "./modal/PaymentProcessModal";
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

  th:nth-child(2),
  td:nth-child(2) {
    width: 25%;
  }
`;

const StatusButton = styled.button`
  padding: 4px 12px;
  border: none;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;

  &.waiting {
    background-color: #fff;  color: #555;
  }
  &.rewaiting {
    background-color: #fff;  color: #555;
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

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    color: #888;

    &.active {
      font-weight: 700;
      color: #000;
      border-bottom: 1px solid #000;
    }

    &:disabled {
      cursor: default;
      color: #ccc;
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

// 필터 옵션 정의
const statusOptions = [
  { value: "all", label: "전체" },
  { value: "0,2", label: "대기" }, // 0: 입금대기, 2: 재입금대기
  { value: "1", label: "완료" }, // 1: 결제완료
  { value: "3", label: "취소" }, // 3: 주문취소
];

const ITEMS_PER_PAGE = 10; // 페이지당 항목 수

const AdminPaymentManage = () => {
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  // 검색 및 필터 상태
  const [searchInputValue, setSearchInputValue] = useState("");
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isModalOpen === false) {
      loadData();
    }
  }, [isModalOpen]);

  // 검색어나 필터가 변경되면 1페이지로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [confirmedSearchTerm, filterStatus]);

  const loadData = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트 등의 처리 필요
      // window.location.href = "/";
      return; 
    }

    setInterceptor(token);

    try {
      const response = await api.get("/api/admin/buyers");
      console.log("Fetched Data:", response.data);
      // 서버 응답 구조에 맞춰 데이터 설정 (여기서는 buyers 배열이라고 가정)
      setPayments(response.data.buyers || []); 
    } catch (err) {
      console.log(err);
      if (err.response) {
        alert(`${err.response.data.message || "알 수 없는 오류"}`);
      } else {
        alert("서버와 연결할 수 없습니다.");
      }
    }
  };

  const handleOpenModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const handleSavePayment = (id, updatedData) => {
    setPayments((prevPayment) =>
      prevPayment.map((payment) =>
        payment.id === id ? { ...payment, ...updatedData } : payment
      )
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setConfirmedSearchTerm(searchInputValue);
    }
  };

  // 0: 입금대기, 1: 결제완료, 2: 재입금대기, 3: 주문취소
  // CSS ClassName 반환 함수
  const getStatusClassName = (isPaid) => {
    switch (isPaid) {
      case 0: return "waiting";
      case 1: return "completed";
      case 2: return "rewaiting";
      case 3: return "rejected";
      default: return "";
    }
  };

  const getStatusText = (isPaid) => {
    switch (isPaid) {
      case 0: return "입금 대기";
      case 1: return "결제 완료";
      case 2: return "재입금 대기";
      case 3: return "주문 취소";
      default: return "-";
    }
  };

  // 필터링 및 검색 로직 (useMemo)
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // 1. 상태 필터링
      let statusMatch = true;
      if (filterStatus !== "all") {
        // "0,2" 처럼 콤마로 구분된 값을 배열로 변환하여 포함 여부 확인
        const targetStatuses = filterStatus.split(",").map(Number);
        statusMatch = targetStatuses.includes(payment.isPaid);
      }

      // 2. 검색어 필터링 (제목, 입금자, 구매자)
      const searchTerm = confirmedSearchTerm.toLowerCase();
      const titleMatch = payment.postTitle?.toLowerCase().includes(searchTerm);
      const payerMatch = payment.payerName?.toLowerCase().includes(searchTerm);
      const buyerMatch = payment.buyerNickname?.toLowerCase().includes(searchTerm);
      
      const searchMatch = !searchTerm || titleMatch || payerMatch || buyerMatch;

      return statusMatch && searchMatch;
    });
  }, [confirmedSearchTerm, filterStatus, payments]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [currentPage, filteredPayments]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 페이지 번호 그룹 생성 (예: 1, 2, 3, 4, 5)
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <SearchBar>
        <input
          type="text"
          placeholder="제목, 입금자명, 구매자명 검색"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <CustomSelect
          value={filterStatus}
          onChange={(val) => setFilterStatus(val)}
          options={statusOptions}
          style={{ width: "120px" }}
        />
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
          {currentItems.length > 0 ? (
            currentItems.map((payment, i) => (
              <tr key={payment.id || i}>
                {/* 전체 인덱스가 아니라 현재 페이지 기준 인덱스 표시를 원하면 아래 수식 조정 */}
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td>{payment.postTitle}</td>
                <td>{payment.payerName}</td>
                <td>{payment.buyerNickname}</td>
                <td>{Number(payment.buyerPrice).toLocaleString()}원</td>
                <td>{formatDate(payment.postEndAt)}</td>
                <td>{formatDate(payment.paymentEndAt)}</td>
                <td>
                  <StatusButton
                    className={getStatusClassName(payment.isPaid)}
                    onClick={() => handleOpenModal(payment)}
                  >
                    {getStatusText(payment.isPaid)}
                  </StatusButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">
                <NoResult>검색 결과가 없습니다.</NoResult>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 페이지네이션 UI */}
      {filteredPayments.length > 0 && (
        <Pagination>
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
            &lt;&lt;
          </button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </button>
          
          {renderPageNumbers()}

          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            &gt;
          </button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
            &gt;&gt;
          </button>
        </Pagination>
      )}

      {isModalOpen && selectedPayment && (
        <PaymentProcessModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          type="payment"
          data={selectedPayment}
          onSave={handleSavePayment}
        />
      )}
    </>
  );
};

export default AdminPaymentManage;