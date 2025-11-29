import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 카드 스타일
const CardWrapper = styled.div`
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eee;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// '마감임박' 태그 (이미지 위에 표시)
const StatusTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 10px;
  background-color: #FF3B30;
  color: white;
  font-size: 10px;
  font-weight: 500;
  border-radius: 10px;
`;

const InfoContainer = styled.div`
  padding: 10px;
`;

const Title = styled.h4`
  font-size: 13px;
  font-weight: 600;
  margin: 3px 0 12px 0;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
`;

// 가격 + 수량 + 마감일 영역
const BottomInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.div`
  font-size: 12px;
  font-weight: 700;
`;

// 수량
const DetailsContainer = styled.div`
  font-size: 10px;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`
const Quantity = styled.div`
  text-align: right;
`;

const Deadline = styled.div`
  text-align: right;
`;


// 카드 컴포넌트

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // 데이터 받기 (임시)
  const { 
    id, 
    title, 
    price, 
    imageUrl, 
    totalCount, 
    currentCount, 
    deadline, 
    currentStatus 
  } = product;

  const handleCardClick = () => {
    navigate(`/products/${id}`);
  };

  return (
    <CardWrapper onClick={handleCardClick}>
      <ImageContainer>
        {currentStatus === '마감임박' && <StatusTag>마감임박</StatusTag>}
        <img src="/images/im.png" alt={title} />
      </ImageContainer>

      <InfoContainer>
        <Title>{title}</Title>
        <BottomInfo>
          <DetailsContainer>
            <BottomContainer>
              수량 <Quantity>{currentCount}/{totalCount}</Quantity>
            </BottomContainer>
            <BottomContainer>
              기간 <Deadline>~{deadline}</Deadline>
            </BottomContainer>
          </DetailsContainer>
          <Price>{price.toLocaleString()}원</Price>
        </BottomInfo>
      </InfoContainer>
    </CardWrapper>
  );
};

export default ProductCard;