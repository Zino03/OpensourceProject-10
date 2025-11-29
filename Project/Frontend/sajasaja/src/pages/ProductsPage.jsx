import React, {useState, useEffect} from "react";
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';

const mockData = [ // 임시 데이터
  {
    id: 1,
    title: "애니 피욘크 미니 프레첼 스낵 150g",
    price: 7000,
    imageUrl: "",
    totalCount: 100,
    currentCount: 9,
    deadline: "2025-11-30",
    currentStatus: "진행중"
  },

  {
    id: 2,
    title: "제주 조생 감귤 10kg",
    price: 12900,
    imageUrl: "",
    totalCount: 10,
    currentCount: 3,
    deadline: "2025-11-30",
    currentStatus: "마감임박"
  },
  {
    id: 3,
    title: "애니 피욘크 미니 프레첼 스낵 150g",
    price: 7000,
    imageUrl: "",
    totalCount: 100,
    currentCount: 9,
    deadline: "2025-11-30",
    currentStatus: "진행중"
  },

  {
    id: 4,
    title: "제주 조생 감귤 10kg",
    price: 12900,
    imageUrl: "",
    totalCount: 10,
    currentCount: 3,
    deadline: "2025-11-30",
    currentStatus: "마감임박"
  },
  {
    id: 5,
    title: "애니 피욘크 미니 프레첼 스낵 150g",
    price: 7000,
    imageUrl: "",
    totalCount: 100,
    currentCount: 9,
    deadline: "2025-11-30",
    currentStatus: "진행중"
  },

  {
    id: 6,
    title: "제주 조생 감귤 10kg",
    price: 12900,
    imageUrl: "",
    totalCount: 10,
    currentCount: 3,
    deadline: "2025-11-30",
    currentStatus: "마감임박"
  }
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
  border: 1px solid #aaa;
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

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(mockData);
  },[])

  return (
    <>
      <FilterSection>
        <SearchBar>
          <select>
            <option>전체</option>
          </select>
          <input type="text" placeholder="공동 구매 게시물 검색" />
          <img src="/images/search.png" alt="search" /> 
        </SearchBar>
        <SubCategoryTags>
          <span>식품</span>
          <span>생활용품</span>
          <span>가전/전자기기</span>
          <span>뷰티/미용</span>
          <span>패션</span>
          <span>잡화/액세서리</span>
          <span>리빙/인테리어</span>
          <span>반려동물</span>
          <span>문구/취미</span>
          <span>스포츠</span>
          <span>유아/아동</span>
          <span>교육</span>
        </SubCategoryTags>
      </FilterSection>

      <ProductListContainer>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductListContainer>
    </>
  );
};

export default ProductsPage;