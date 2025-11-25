import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const PageContainer = styled.div`
  display: flex;
`;

// 오른쪽 컨텐츠표시
const ContentArea = styled.main`
  flex: 1;
  padding: 8px;
  overflow: auto;
  margin: 20px;
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