import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

// 왼쪽 사이드바
const Sidebar = styled.div`
  width: 250px;
  border-right: 1px solid #eee;
  padding: 8px 24px;
  margin: 0 20px;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const MenuGroup = styled.div`
  margin-top: 24px;
`;

const MenuTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
`;

// NavLink 사용
const MenuItem = styled(NavLink)`
  display: block;
  font-size: 12px;
  color: #555;
  padding: 4px 0;
  cursor: pointer;
  text-decoration: none;

  &.active {
    color: #2c3e50;
    font-weight: 600;
  }
  &:hover {
    color: #2c3e50;
  }
`;

const AdminSidebar = () => {
  return (
    <Sidebar>
      <MenuGroup>
        <MenuTitle>신고 관리</MenuTitle>
        <MenuItem to="/admin/report-user">사용자 신고</MenuItem>
        <MenuItem to="/admin/report-review">후기 신고</MenuItem>
        <MenuItem to="/admin/report-notice">공지 신고</MenuItem>
      </MenuGroup>

      <MenuGroup>
        <MenuTitle>결제 및 정산 관리</MenuTitle>
        <MenuItem to="/admin/payment">결제 및 정산</MenuItem>
      </MenuGroup>

      <MenuGroup>
        <MenuTitle>게시글 관리</MenuTitle>
        <MenuItem to="/admin/posts">게시글</MenuItem>
      </MenuGroup>
    </Sidebar>
  );
};

export default AdminSidebar;
