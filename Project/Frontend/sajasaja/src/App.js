import React from 'react';
import { Routes, Route, BrowserRouter as Router} from 'react-router-dom';

import GlobalStyle from './styles/GlobalStyle';
import Header from './components/Header';

import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import FindPassword from './pages/FindPassword';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
