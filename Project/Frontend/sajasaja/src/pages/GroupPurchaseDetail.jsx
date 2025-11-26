import React, { useState } from 'react';
import styled from 'styled-components';
import PurchaseModal from './modal/PurchaseModal';

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 100px;
`;

const CategoryTag = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
  
  span {
    margin-right: 5px;
    cursor: pointer;
    &:hover { color: #333; }
  }
`;

// 이미지 및 공구 정보 (화면이 작아지면 세로 정렬)
const TopSection = styled.div`
  display: flex;
  gap: 60px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
`;

// 좌측: 이미지 영역
const ImageArea = styled.div`
  width: 400px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MainImageWrapper = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Badge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #FF3B30; 
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 20px;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ThumbnailList = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Thumbnail = styled.div`
  width: 60px;
  height: 60px;
  border: 1px solid ${props => props.active ? '#FF7E36' : '#eee'};
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 우측: 정보 영역
const InfoArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
`;

const ProductTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
`;

// 진행률 바
const ProgressSection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
`;

const CurrentCount = styled.div`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.percent}%;
  background-color: #FF7E36;
`;

// 상세 정보 리스트
const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 12px;
  margin-bottom: 30px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  width: 100px;
  font-weight: 700;
`;

const Value = styled.div`
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimeBadge = styled.span`
  background-color: #FFF5E0;
  color: #FF7E36;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
`;

// 주최자 정보
const OrganizerRow = styled(DetailRow)`
  margin-top: 10px;
`;

const OrganizerBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #eee;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #fff;
`;

const ProfileIcon = styled.div`
  font-size: 18px;
`;

const OrganizerName = styled.span`
  font-weight: 600;
`;

const MannerLabel = styled.span`
  font-size: 12px;
  color: #888;
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
`;

const ContactButtonSmall = styled.button`
  background-color: #FF7E36;
  color: white;
  border: none;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;
  font-weight: 500;
`;


// 가격 및 구매 버튼 영역
const BottomArea = styled.div`
  margin-top: auto;
`;

const PriceArea = styled.div`
  text-align: right;
  margin-bottom: 20px;
`;

const PriceText = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

const PurchaseButton = styled.button`
  width: 100%;
  background-color: #FF7E36;
  color: #fff;
  border: none;
  padding: 10px 0;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;

  &:hover { opacity: 0.9; }
`;

const TabMenu = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 50px;
  top: 0;
`;

const TabItem = styled.div`
  width: 120px;
  text-align: center;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.active ? '#FF7E36' : '#555'};
  border-bottom: 3px solid ${props => props.active ? '#FF7E36' : 'transparent'};
  cursor: pointer;
  
  &:hover {
    color: #FF7E36;
  }
`;

const Section = styled.div`
  margin-bottom: 80px;
`;

const SectionHeader = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #999;
`;

const DescriptionBox = styled.div`
  white-space: pre-wrap;
  line-height: 1.8;
  color: #444;
  font-size: 13px;
  word-break: break-all;
`;

// 지도
const MapPlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background-color: #f0f0f0;
  background-position: center;
  border-radius: 0;
  position: relative;
`;

const MapOverlayButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #FF7E36;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
`;

const GroupPurchaseDetail = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product = {
    title: '애니 피완크 미니 프레첼 스낵 150g',
    currentCount: 87,
    goalCount: 100,
    startDate: '2025. 11. 16',
    endDate: '2025. 11. 30',
    daysLeft: 3,
    shipping: '배송 가능',
    shippingCost: '3,000원',
    organizer: '사자사자',
    mannerScore: 65,
    price: 890,
    description: `texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttext
texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttext
texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttext`
  };

  const progressPercent = Math.min((product.currentCount / product.goalCount) * 100, 100);

  return (
    <Container>
      <CategoryTag>
        <span>식품</span> &gt;
      </CategoryTag>

      <TopSection>
        <ImageArea>
          <MainImageWrapper>
            <Badge>마감임박</Badge>
            <MainImage alt="상품 이미지" />
          </MainImageWrapper>
          <ThumbnailList>
            <Thumbnail active={true}>
               <img alt="썸네일" />
            </Thumbnail>
          </ThumbnailList>
        </ImageArea>

        <InfoArea>
          <ProductTitle>{product.title}</ProductTitle>

          <ProgressSection>
            <ProgressLabel>현재 주문된 수량</ProgressLabel>
            <CurrentCount>{product.currentCount}</CurrentCount>
            <ProgressBarContainer>
              <ProgressBarFill percent={progressPercent} />
            </ProgressBarContainer>
          </ProgressSection>

          <DetailList>
            <DetailRow>
              <Label>모집기간</Label>
              <Value>
                {product.startDate} ~ {product.endDate} 
                <TimeBadge>{product.daysLeft}일 남음</TimeBadge>
              </Value>
            </DetailRow>
            <DetailRow>
              <Label>목표수량</Label>
              <Value>{product.goalCount}</Value>
            </DetailRow>
            <DetailRow>
              <Label>배송정보</Label>
              <Value>
                {product.shipping} <span style={{color:'#ddd', margin: '0 8px'}}>|</span> {product.shippingCost}
              </Value>
            </DetailRow>
            
            <OrganizerRow>
              <Label>주최자</Label>
              <OrganizerBadge>
                <ProfileIcon>🦁</ProfileIcon>
                <OrganizerName>{product.organizer}</OrganizerName>
                <MannerLabel>매너점수 {product.mannerScore}점</MannerLabel>
                <ContactButtonSmall>연락하기</ContactButtonSmall>
              </OrganizerBadge>
            </OrganizerRow>
          </DetailList>

          <BottomArea>
            <PriceArea>
              <PriceText>{product.price.toLocaleString()} 원</PriceText>
            </PriceArea>
            <PurchaseButton onClick={() => setIsModalOpen(true)}>공동구매 시작하기</PurchaseButton>
          </BottomArea>
        </InfoArea>
      </TopSection>

      <TabMenu>
        <TabItem active={activeTab === 'info'} onClick={() => setActiveTab('info')}>상품 정보</TabItem>
        <TabItem active={activeTab === 'notice'} onClick={() => setActiveTab('notice')}>공지</TabItem>
        <TabItem active={activeTab === 'review'} onClick={() => setActiveTab('review')}>후기</TabItem>
      </TabMenu>

      <Section>
        <SectionHeader>상품 정보</SectionHeader>
        <DescriptionBox>
          {product.description}
        </DescriptionBox>
      </Section>

      <Section>
        <SectionHeader>수령장소</SectionHeader>
        <MapPlaceholder>
          <MapOverlayButton>지도보기</MapOverlayButton>
        </MapPlaceholder>
      </Section>

    <PurchaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product} 
      />

    </Container>
  );
};

export default GroupPurchaseDetail;