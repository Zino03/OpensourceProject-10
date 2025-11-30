import React, {useState, useEffect} from "react";
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import CustomSelectProduct from '../components/CustomSelectProduct';

const mockData = [ // 임시 데이터
  {
    id: 1,
    title: "애니 피욘크 미니 프레첼 스낵 150g",
    price: 7000,
    imageUrl: "",
    totalCount: 100,
    currentCount: 9,
    deadline: "2025-11-30",
    currentStatus: "마감",
    category: "식품",
    status: "dead",
  },

  {
    id: 2,
    title: "제주 조생 감귤 10kg",
    price: 12900,
    imageUrl: "",
    totalCount: 10,
    currentCount: 3,
    deadline: "2025-11-30",
    currentStatus: "마감 임박",
    category: "식품",
    status: "dead",
  },
  {
    id: 3,
    title: "짱 멋진 가방",
    price: 237000,
    imageUrl: "",
    totalCount: 100,
    currentCount: 9,
    deadline: "2025-11-30",
    currentStatus: "모집 중",
    category: "생활용품",
    status: "deadIm",
  },

  {
    id: 4,
    title: "제주 조생 감귤 10kg",
    price: 12900,
    imageUrl: "",
    totalCount: 10,
    currentCount: 3,
    deadline: "2025-11-30",
    currentStatus: "마감 임박",
    category: "반려동물",
    status: "deadIm",
  },
  {
    id: 5,
    title: "애니 피욘크 미니 프레첼 스낵 150g",
    price: 7000,
    imageUrl: "",
    totalCount: 100,
    currentCount: 9,
    deadline: "2025-11-30",
    currentStatus: "모집 중",
    category: "스포츠",
    status: "prog",
    
  },

  {
    id: 6,
    title: "제주 조생 감귤 10kg",
    price: 12900,
    imageUrl: "",
    totalCount: 10,
    currentCount: 3,
    deadline: "2025-11-30",
    currentStatus: "마감 임박",
    category: "기타",
    status: "prog",
  }
];

// 카테고리
const CATEGORIES = [
  "식품", "생활용품", "가전/전자기기", "뷰티/미용", 
  "패션", "잡화/액세서리", "리빙/인테리어", "반려동물", 
  "문구/취미", "스포츠", "유아/아동", "기타"
];

// 검색 및 필터
const FilterSection = styled.section`
  padding: 36px 200px;
  border-bottom: 1px solid #eee;
`;

// 검색창
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

  img { height: 20px; }
`;

// 검색창 아래 카테고리 목록
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
`;

// 상품 목록 
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
`

const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'prog', label: '모집 중' },
    { value: 'deadIm', label: '마감' },
    { value: 'dead', label: '마감 임박' },
  ];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState(""); 
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const handleSearch = () => {
    setConfirmedSearchTerm(searchInputValue); // 입력 검색어
  };

  // 검색 엔터 감지
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    let filtered = mockData;

    // 검색어 필터 (제목 기준)
    if (confirmedSearchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(confirmedSearchTerm.toLowerCase())
      );
    }

    // 모집 상태 필터
    if (selectedStatus !== "전체") {
      filtered = filtered.filter(item => item.currentStatus === selectedStatus);
    }

    // 카테고리 필터
    if (selectedCategory !== "전체") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setProducts(filtered);
  }, [confirmedSearchTerm, selectedStatus, selectedCategory]);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      // 이미 선택된 카테고리를 다시 누르면 -> (선택 해제)
      setSelectedCategory("전체");
    } else {
      // 다른 카테고리를 누르면 -> 해당 카테고리 선택
      setSelectedCategory(category);
    }
  };

  useEffect(() => {
    setProducts(mockData);
  },[])

  return (
    <>
      <FilterSection>
        <SearchBar>
          <CustomSelectProduct
            value={selectedStatus} 
            onChange={(val) => setSelectedStatus(val)} 
            options={statusOptions}>
          </CustomSelectProduct>
          <input type="text" placeholder="공동 구매 게시물 검색" 
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onKeyDown={handleKeyDown}/>
          <img src="/images/search.png" alt="search" onClick={handleSearch}/> 
        </SearchBar>
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
        {products.length > 0 ? (
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