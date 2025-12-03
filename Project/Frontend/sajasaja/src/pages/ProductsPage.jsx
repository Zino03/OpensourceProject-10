import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import CustomSelectProduct from '../components/CustomSelectProduct';
import { api, setInterceptor } from "../assets/setIntercepter";

/* ===========================
   styled-components (기존 유지)
   =========================== */
const FilterSection = styled.section`
  padding: 36px 200px;
  border-bottom: 1px solid #eee;
`;

const SearchBar = styled.div`
  background-color: #fff; 
  display: flex;
  border: 1.5px solid #ccc;
  border-radius: 20px;
  padding: 8px 16px;

  select {
    border: none;
    font-size: 12px;
    font-weight: 500;
    margin-right: 16px;
    &:focus { outline: none; }
  }

  input {
    flex: 1;
    border: none;
    font-size: 12px;
    &::placeholder { color: #aaa; }
    &:focus { outline: none; }
  }

  img { height: 20px; cursor: pointer; }
`;

const SubCategoryTags = styled.div`
  display: flex;
  gap: 17px;
  margin-top: 10px;
  justify-content: center;
  font-weight: 500;
  span {
    padding: 6px 6px;
    border-radius: 12px;
    font-size: 11px;
    color: #555;
    cursor: pointer;
    &:hover { background-color: #FFF5E0; }
  }
`;

const CategoryTag = styled.span`
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  background-color: ${props => props.$isActive ? '#FFF5E0' : 'transparent'};
  font-weight: ${props => props.$isActive ? '700' : '400'};
  color: ${props => props.$isActive ? '#FF7E00' : '#555'};
`;

const ProductListContainer = styled.div`
  background-color: #fff;
  border-radius: 16px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  padding: 32px;
  margin: 0 125px;
`;

const NoResult = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 0;
  color: #888;
  font-size: 14px;
`;

const LoadingText = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 0;
  color: #FF7E00;
  font-size: 14px;
  font-weight: 600;
`;

/* ===========================
   상수 및 매핑 데이터
   =========================== */

// 카테고리 목록 (UI 표시용)
const CATEGORIES = [
  "전체", // "전체" 버튼을 명시적으로 추가하여 UX 개선
  "식품", "생활용품", "가전/전자기기", "뷰티/미용", 
  "패션", "잡화/액세서리", "리빙/인테리어", "반려동물", 
  "문구/취미", "스포츠", "유아/아동", "기타"
];

// 백엔드 전송용 매핑 (한글 -> 영어 Enum)
const CATEGORY_MAP = {
  '식품': 'FOOD', '생활용품': 'HOUSEHOLD', '가전/전자기기': 'ELECTRONICS',
  '뷰티/미용': 'BEAUTY', '패션': 'FASHION', '잡화/액세서리': 'ACCESSORY',
  '리빙/인테리어': 'LIVING', '반려동물': 'PET', '문구/취미': 'HOBBY',
  '스포츠': 'SPORTS', '유아/아동': 'KIDS', '기타': 'ETC',
};

// 프론트엔드 UI용 상태 옵션
const statusOptions = [
  { value: 'all', label: '전체' },
  { value: 'prog', label: '모집 중' },
  { value: 'deadIm', label: '마감 임박' },
  { value: 'dead', label: '마감' },
];

// 백엔드 전송용 상태 매핑 (UI value -> 백엔드 Enum)
// all일 경우 null로 처리하거나 아예 파라미터를 보내지 않음
const STATUS_MAP = {
  'prog': 1,   // 모집중
  'deadIm': 2, // 마감임박
  'dead': 3    // 마감
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  // 필터 상태 관리
  const [searchInputValue, setSearchInputValue] = useState(""); // 검색창 입력값
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState(""); // 실제 검색 실행값
  const [selectedStatus, setSelectedStatus] = useState("all"); 
  const [selectedCategory, setSelectedCategory] = useState("전체");

  useEffect(() => {
    const fetchProducts = async () => {
      // 1. 토큰 체크 (필요한 경우)
      const token = localStorage.getItem('accessToken');
      if (token) {
        setInterceptor(token);
      }
      
      setIsLoading(true);

      try {
        // 2. 쿼리 파라미터 구성 (핵심 로직)
        const params = {
          page: 0,
          size: 50, 
        };

        // 검색어: 값이 있을 때만 params에 추가
        if (confirmedSearchTerm && confirmedSearchTerm.trim() !== "") {
          params.query = confirmedSearchTerm.trim();
        }
        
        // 카테고리: '전체'가 아니고 맵핑값이 존재할 때만 추가
        if (selectedCategory !== "전체" && CATEGORY_MAP[selectedCategory]) {
          params.category = CATEGORY_MAP[selectedCategory];
        }
        
        // 상태: 'all'이 아니고 맵핑값이 존재할 때만 추가
        if (selectedStatus !== 'all' && STATUS_MAP[selectedStatus]) {
          params.type = STATUS_MAP[selectedStatus];
        }

        console.log("API 요청 파라미터:", params); // 디버깅용 로그

        // 3. API 호출
        const response = await api.get('/api/posts', { params });

        console.log("상품 목록 조회 결과:", response.data);

        // 4. 응답 데이터 처리
        // 백엔드 응답 구조(Page 객체인지 List인지)에 따라 유연하게 처리
        if (response.data && response.data.content) {
          setProducts(response.data.content);
        } else if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }

      } catch (error) {
        console.error("상품 목록 불러오기 실패:", error);
        setProducts([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    
    // 의존성 배열: 이 값들이 변할 때마다 API 재호출
  }, [confirmedSearchTerm, selectedStatus, selectedCategory]);

  // 검색 핸들러
  const handleSearch = () => {
    setConfirmedSearchTerm(searchInputValue); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 카테고리 클릭 핸들러 (토글 방식 or 단순 선택 방식)
  // 여기서는 단순 선택 방식으로 구현 ("전체"도 선택 가능하게)
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <FilterSection>
        <SearchBar>
          {/* 드롭다운: 모집중/마감임박 등 상태 필터 */}
          <CustomSelectProduct
            value={selectedStatus} 
            onChange={(val) => setSelectedStatus(val)} 
            options={statusOptions}
          />
          
          {/* 검색창 */}
          <input 
            type="text" 
            placeholder="공동 구매 게시물 검색" 
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <img src="/images/search.png" alt="search" onClick={handleSearch}/> 
        </SearchBar>
        
        {/* 카테고리 태그 목록 */}
        <SubCategoryTags>
          {CATEGORIES.map((category) => (
            <CategoryTag 
              key={category}
              $isActive={selectedCategory === category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </CategoryTag>
          ))}
        </SubCategoryTags>
      </FilterSection>

      <ProductListContainer>
        {isLoading ? (
          <LoadingText>상품을 불러오는 중입니다...</LoadingText>
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <NoResult>조건에 맞는 상품이 없습니다.</NoResult>
        )}
      </ProductListContainer>
    </>
  );
};

export default ProductsPage;