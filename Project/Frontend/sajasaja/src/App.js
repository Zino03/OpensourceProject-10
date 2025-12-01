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

import OrderDetailOrderReceived from './pages/OrderDetailOrderReceived.jsx';
import OrderDetailPaymentReceived from './pages/OrderDetailPaymentReceived.jsx';
import OrderDetailPreparing from './pages/OrderDetailPreparing.jsx';
import OrderDetailShipping from './pages/OrderDetailShipping.jsx';
import OrderDetailDelivered from './pages/OrderDetailDelivered.jsx';
import OrderDetailCancelled from './pages/OrderDetailCancelled.jsx';
import OrderDetailPage from './pages/OrderDetailPage';

import Mypage from './pages/Mypage';
import MyProfile from './pages/MyProfile.jsx';
import UserPage from './pages/UserPage.jsx';
import NewDeliveryInfo from './pages/NewDeliveryInfo.jsx';
import MyDeliveryInfo from './pages/MyDeliveryInfo.jsx';
import EditMyDelivery from './pages/EditMyDelivery.jsx';
import MyGroupPerchase from './pages/MyGroupPerchase.jsx';

import UserReport from './pages/UserReport.jsx';
import NotificationReport from './pages/NotificationReport.jsx';
import ReviewReport from './pages/ReviewReport.jsx';


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

          <Route path="/order-detail" element={<OrderDetailOrderReceived />} />
          <Route path="/received" element={<OrderDetailPaymentReceived />} />
          <Route path="/preparing" element={<OrderDetailPreparing />} />
          <Route path="/shipping" element={<OrderDetailShipping />} />
          <Route path="/delivered" element={<OrderDetailDelivered />} />
          <Route path="/cancelled" element={<OrderDetailCancelled />} />
          <Route path="/orderpage" element={<OrderDetailPage />} />

          <Route path="/mypage" element={<Mypage />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/newdelivery" element={<NewDeliveryInfo />} />
          <Route path="/mydelivery" element={<MyDeliveryInfo />} />
          <Route path="/editdelivery" element={<EditMyDelivery/>} />
          <Route path="/mygroupperchase" element={<MyGroupPerchase/>} />

          <Route path="/userreport" element={<UserReport/>} />
          <Route path="/notificationreport" element={<NotificationReport />} />
          <Route path="/reviewreport" element={<ReviewReport/>} />

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
