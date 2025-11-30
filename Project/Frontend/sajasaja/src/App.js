import React from 'react';
import { Routes, Route, useLocation} from 'react-router-dom';

import GlobalStyle from './styles/GlobalStyle';
import Header from './components/Header';
import Footer from './components/Footer';

import ProductsPage from './pages/ProductsPage';
import GroupPurchaseDetail from './pages/GroupPurchaseDetail';
import GroupPurchaseRegister from './pages/GroupPurchaseRegister';
import NearbyGroupPurchase from "./pages/NearbyGroupPurchase";

import LoginPage from './pages/LoginPage';
import FindPassword from './pages/FindPassword';
import JoinPage from './pages/JoinPage';
import VerificationPage from './pages/VerificationPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

import OrderPage from './pages/OrderPage';
import PaymentPage from './pages/PaymentPage';

import AdminPage from './admin/AdminPages';
import AdminUserReport from './admin/AdminUserReport'
import AdminReviewReport from './admin/AdminReviewReport'
import AdminNoticeReport from './admin/AdminNoticeReport'
import AdminPaymentManage from './admin/AdminPaymentManage';
import AdminPostManage from './admin/AdminPostManage';
import OrderCompletePage from './pages/OrderCompletePage';

import OrderDetail_OrderReceived from './pages/OrderDetail_OrderReceived';
import OrderDetail_PaymentReceived from './pages/OrderDetail_PaymentReceived.jsx';
import OrderDetail_Preparing from './pages/OrderDetail_Preparing';
import OrderDetail_Shipping from './pages/OrderDetail_Shipping.jsx';
import OrderDetail_Delivered from './pages/OrderDetail_Delivered';
import OrderDetail_Cancelled from './pages/OrderDetail_Cancelled';

import Mypage from './pages/Mypage';
import MyProfile from './pages/MyProfile.jsx';


function App() {
  const location = useLocation(); // 현재 경로 정보
  // Footer 숨길 페이지들
  const hideFooterPaths = ['/nearby'];
  const isFooterHidden = 
    hideFooterPaths.includes(location.pathname) || location.pathname.startsWith('/admin'); 

  // 반대로 뒤집어서 showFooter 결정
  const showFooter = !isFooterHidden;

  return (
    <>
      <GlobalStyle/>
      <div>
        <Header/>
        <Routes>
          <Route path="/" element={<ProductsPage/>} />
          <Route path="/products/:id" element={<GroupPurchaseDetail />} />
          <Route path="/order" element={<OrderPage/>} />
          <Route path="/payment" element={<PaymentPage/>} />
          <Route path="/order-complete" element={<OrderCompletePage/>} />

          <Route path="/order-detail" element={<OrderDetail_OrderReceived />} />
          <Route path="/received" element={<OrderDetail_PaymentReceived />} />
          <Route path="/preparing" element={<OrderDetail_Preparing />} />
          <Route path="/shipping" element={<OrderDetail_Shipping />} />
          <Route path="/delivered" element={<OrderDetail_Delivered />} />
          <Route path="/cancelled" element={<OrderDetail_Cancelled />} />

          <Route path="/mypage" element={<Mypage />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/terms" element={<TermsOfUsePage/>} />
          <Route path="/privacy" element={<PrivacyPolicyPage/>} />

          <Route path="/write" element={<GroupPurchaseRegister/>} />
          <Route path="/nearby" element={<NearbyGroupPurchase/>} />

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
        {showFooter && <Footer/>}
      </div>
    </>
  );
}

export default App;
