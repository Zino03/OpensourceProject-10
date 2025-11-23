import React from 'react';
import { Routes, Route, BrowserRouter as Router} from 'react-router-dom';

import GlobalStyle from './styles/GlobalStyle';
import Header from './components/Header';

import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import FindPassword from './pages/FindPassword';
import JoinPage from './pages/JoinPage';
import VerificationPage from './pages/VerificationPage';

import AdminPage from './admin/AdminPages';
import AdminUserReport from './admin/AdminUserReport'
import AdminReviewReport from './admin/AdminReviewReport'
import AdminNoticeReport from './admin/AdminNoticeReport'
import AdminPaymentManage from './admin/AdminPaymentManage';
import AdminPostManage from './admin/AdminPostManage';

function App() {
  return (
    <Router>
      <GlobalStyle/>
      <div>
        <Header/>
        <Routes>
          <Route path="/" element={<ProductsPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/find-password" element={<FindPassword/>} />
          <Route path="/join" element={<JoinPage/>} />
          <Route path="/verification" element={<VerificationPage/>} />

          <Route path="/admin" element={<AdminPage/>}>
            <Route index element={<AdminUserReport/>} />
  
            <Route path="report-user" element={<AdminUserReport/>} />
            <Route path="report-review" element={<AdminReviewReport/>} /> 
            <Route path="report-notice" element={<AdminNoticeReport/>} />
            <Route path="payment" element={<AdminPaymentManage/>} />
            <Route path="posts" element={<AdminPostManage/>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
