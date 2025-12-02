import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 카드 스타일
const CardWrapper = styled.div`
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eee;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
  border: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;   /* ⭐ 비율 유지하면서 꽉 채우고, 넘치는 부분은 잘림 */
    display: block;
  }
`;

// '마감임박' 태그 (이미지 위에 표시)
const StatusTag = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 5px 10px;
  background-color: #D32F2F;
  color: white;
  font-size: 10px;
  font-weight: 500;
  border-radius: 5px;
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
`;

const Quantity = styled.div`
  text-align: right;
`;

const Deadline = styled.div`
  text-align: right;
`;

// 카드 컴포넌트
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const { 
    id, 
    title, 
    price, 
    image,
    quantity,
    currentQuantity,
    endAt,
    category,
    type,
  } = product;

  const handleCardClick = () => {
    navigate(`/products/${id}`);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  return (
    <CardWrapper onClick={handleCardClick}>
      <ImageContainer>
        {type === 2 && (
          <StatusTag>마감 임박</StatusTag>
        )}
        <img 
          src={image || "/images/im.png"} 
          alt={title}
        />
      </ImageContainer>

      <InfoContainer>
        <Title>{title}</Title>
        <BottomInfo>
          <DetailsContainer>
            <BottomContainer>
              수량 <Quantity>{currentQuantity}/{quantity}</Quantity>
            </BottomContainer>
            <BottomContainer>
              기간 <Deadline>~{formatDate(endAt)}</Deadline>
            </BottomContainer>
          </DetailsContainer>
          <Price>{Number(price).toLocaleString()}원</Price>
        </BottomInfo>
      </InfoContainer>
    </CardWrapper>
  );
};

export default ProductCard;