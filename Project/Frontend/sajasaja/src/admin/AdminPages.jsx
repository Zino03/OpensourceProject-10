import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const PageContainer = styled.div`
  display: flex;
`;

// 오른쪽 컨텐츠표시
const ContentArea = styled.main`
  flex: 1;
  padding: 10px 20px;
  overflow: auto;

  /* 기본: 오른쪽 마진을 화면 너비의 8%로 */
  margin: 20px 8vw 20px 20px;

  @media (max-width: 1600px) {
    margin-right: 70px; /* 최대값 느낌 */
  }

  @media (max-width: 1500px) {
    margin-right: 50px; /* 최대값 느낌 */
  }

  @media (max-width: 1400px) {
    margin-right: 50px; /* 최대값 느낌 */
  }

  @media (max-width: 1000px) {
    margin-right: 30px; /* 최대값 느낌 */
  }

  @media (max-width: 800px) {
    margin-right: 20px;
    padding: 10px 20px; /* 패딩도 같이 조금 줄이면 보기 좋음 */
  }
`;

const AdminPage = () => {
  return (
    <PageContainer>
      <AdminSidebar />

      <ContentArea>
        <Outlet />
      </ContentArea>
    </PageContainer>
  );
};

export default AdminPage;
