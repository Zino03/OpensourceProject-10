import { FaRegBell } from "react-icons/fa";
import PurchaseModal from './modal/PurchaseModal';
import InvoiceModal from './modal/InvoiceModal';
import ReceiveModal from './modal/ReceiveModal';
import DeliveryInfoModal from './modal/DeliveryInfoModal';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

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
  margin-bottom: 40px;

  @media (max-width: 750px) {
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
  aspect-ratio: 4 / 4;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  border: 1px solid #f2f2f2;
`;

const Badge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #D32F2F; 
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
  margin-top: 12px;
  display: none; /* 현재 디자인에는 썸네일이 없어서 숨김 */
`;

const Thumbnail = styled.div`
  width: 60px;
  height: 60px;
  border: 1px solid ${props => props.$active ? '#FF7E00' : '#eee'};
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

const ProductTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const ProductTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
`;

const ProgressSection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
`;

const ProgressLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const CurrentCount = styled.div`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.$percent}%;
  background-color: #FF7E00;
`;

// 상세 정보 리스트
const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 12px;
  margin-bottom: 0;
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
  color: #FF7E00;
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
  padding: 10px 14px;
  border-radius: 8px;
  background-color: #fff;
  width: 100%;
  justify-content: space-between;
`;

const OrganizerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const ContactButton = styled.button`
  background-color: #f7f7f7;
  color: #333;
  border: 1px solid #ddd;
  font-size: 12px;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

// 가격 및 구매 버튼 영역 (하단 수량/가격 줄)
const BottomArea = styled.div`
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
  }
`;

const QuantityArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
`;

const QuantityLabel = styled.span`
  color: #333;
`;

const QuantityBox = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
`;

const QtyButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background-color: #f7f7f7;
  font-size: 16px;
  cursor: pointer;
`;

const QtyValue = styled.div`
  min-width: 40px;
  text-align: center;
  font-size: 14px;
  background-color: #fff;
`;

const ChangeQtyButton = styled.button`
  background-color: #FF7E00;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:hover { opacity: 0.9; }
`;

const PriceArea = styled.div`
  text-align: right;
`;

const PriceText = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

// 아래 탭 & 공통 영역 --------------------------
const PurchaseButton = styled.button`
  width: 100%;
  background-color: #FF7E00;
  color: #fff;
  border: none;
  padding: 10px 0;
  border-radius: 6px;
  font-size: 16px;
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
  width: 80px;
  text-align: center;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$active ? '#FF7E00' : '#555'};
  border-bottom: 1px solid ${props => props.$active ? '#FF7E00' : 'transparent'};
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
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
  background-color: #FF7E00;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentItem = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #eee;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserIcon = styled.img`
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const RatingText = styled.span`
  font-size: 11px;
  color: #666;
  margin-left: 4px;
`;

const ReportButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover { color: #D32F2F; }
`;

const CommentContent = styled.div`
  font-size: 12px;
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-all;
`;

const CommentDate = styled.div`
  text-align: right;
  font-size: 13px;
  color: #999;
`;

const ManageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ManageTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const ManageButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ManageButton = styled.button`
  background-color: #000;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

const RegisterStatusBadge = styled.span`
  display: inline-block;
  font-size: 10px;
  padding: 6px 10px;
  border-radius: 20px;
  color: ${props => props.$isRegistered ? '#00902F' : '#888'};
  background-color: ${props => props.$isRegistered ? '#E3FCEF' : '#F0F0F0'};
`;

const ParticipantTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: center;

  th {
    padding: 16px;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    font-weight: 600;
  }

  td {
    padding: 16px 10px;
    border-bottom: 1px solid #eee;
  }
`;

const FilterButton = styled.button`
  background-color: #fff;
  border: 1px solid ${props => props.$active ? '#FF7E00' : '#000'};
  color: ${props => props.$active ? '#FF7E00' : '#000'};
  padding: 2px 12px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    border-color: #FF7E00;
    color: #FF7E00;
  }
`;

const GroupPurchaseDetail = () => {
  const navigate = useNavigate();
  const product = {
    title: '애니 피욘크 미니 프레첼 스낵 150g',
    currentCount: 87,
    goalCount: 100,
    startDate: '2025. 11. 16',
    endDate: '2025. 11. 30',
    daysLeft: 3,
    shipping: '배송 가능',
    shippingCost: '3,000원',
    organizer: '사자사자',
    mannerScore: 3.5,
    price: 890,
    imageUrl: '/images/sample_pretzel.png', // 👉 실제 이미지 경로로 바꿔 써
    description: 'text'
  };

  // 임시 데이터: 공지사항
  const notices = [
    { id: 1, writer: '사자사자', content: 'texttextxt', date: '2025. 11. 18' },
    { id: 2, writer: '사자사자', content: '공지사항 내용입니다. 배송 관련 변동사항이 있습니다.', date: '2025. 11. 18' },
  ];

  // 임시 데이터: 후기
  const reviews = [
    { id: 1, writer: '과메기', rating: '별점 5점', content: '맛있고 최고예요 공구 열어주셔서 감사합니다 너무 좋아요 짱짱!!', date: '2025. 11. 18' },
    { id: 2, writer: '가라사대', rating: '별점 5점', content: '맛있고 최고예요 공구 열어주셔서 감사합니다 너무 좋아요 짱짱!! 맛있고 최고예요 공구 열어주셔서 감사합니다 너무 좋아요 짱짱!!', date: '2025. 11. 18' },
    { id: 3, writer: '과메기', rating: '별점 5점', content: '맛있고 최고예요 공구 열어주셔서 감사합니다 너무 좋아요 짱짱!!', date: '2025. 11. 18' },
  ];

  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: '변진호(주최자)',
      nickname: '사자사자',
      amount: '7,000원',
      address: '(12345)\n도로명: 충북 청주시 가나구 다라로 123(삼성동, 사자아파트)****\n지   번: 충북 청주시 가나구 삼성동 123 ****',
      status: '결제 완료',
      date: '2025-11-06',
      invoice: null,
      pickup: null,
      receive: 'pickup'
    },
    {
      id: 2,
      name: '최지우',
      nickname: '직접수령',
      amount: '7,000원',
      address: '(12345)\n도로명: 충북 청주시 가나구 다라로 123(삼성동, 사자아파트)****\n지   번: 충북 청주시 가나구 삼성동 123 ****',
      status: '결제 완료',
      date: '2025-11-06',
      invoice: null,
      pickup: null,
      receive: 'pickup'
    },
    {
      id: 3,
      name: '김서연',
      nickname: '너도하자',
      amount: '7,000원',
      address: '(12345)\n도로명: 충북 청주시 가나구 다라로 123(삼성동, 사자아파트)****\n지   번: 충북 청주시 가나구 삼성동 123 ****',
      status: '결제 대기',
      date: '-',
      invoice: null,
      pickup: null,
      receive: 'pickup'
    },

    // ✅ 배송 수령 데이터 (값만 넣도록 수정)
    {
      id: 4,
      name: '조수빈',
      nickname: '휴학',
      amount: '7,000원',
      address: '충북 청주시 가나구 다라로 123(삼성동, 사자아파트) 123동 1234호',
      status: '결제 대기',
      date: '-',
      invoice: null,
      pickup: null,
      receive: 'delivery',
      receiver: '최지우',
      req: '자유출입가능',          // 값만
      entranceMethod: '자유출입가능',
      entrancePassword: '#1234#',
      tel: '010-8239-5709'
    },
    {
      id: 5,
      name: '최지우',
      nickname: '배송수령',
      amount: '7,000원',
      address: '충북 청주시 가나구 다라로 123(삼성동, 사자아파트) 123동 1234호',
      status: '결제 완료',
      date: '2025-11-06',
      invoice: null,
      pickup: null,
      receive: 'delivery',
      receiver: '최지우',
      req: '자유출입가능',
      entranceMethod: '자유출입가능',
      entrancePassword: '#1234#',
      tel: '010-8239-5709'
    },
    {
      id: 6,
      name: '김서연',
      nickname: '너도하자',
      amount: '7,000원',
      address: '충북 청주시 가나구 다라로 123(삼성동, 사자아파트) 123동 1234호',
      status: '결제 대기',
      date: '-',
      invoice: null,
      pickup: null,
      receive: 'delivery',
      receiver: '최지우',
      req: '자유출입가능',
      entranceMethod: '자유출입가능',
      entrancePassword: '#1234#',
      tel: '010-8239-5709'
    },
    {
      id: 7,
      name: '조수빈',
      nickname: '휴학',
      amount: '7,000원',
      address: '충북 청주시 가나구 다라로 123(삼성동, 사자아파트) 123동 1234호',
      status: '결제 대기',
      date: '-',
      invoice: null,
      pickup: null,
      receive: 'delivery',
      receiver: '최지우',
      req: '자유출입가능',
      entranceMethod: '자유출입가능',
      entrancePassword: '#1234#',
      tel: '010-8239-5709'
    },
  ]);

  const [activeTab, setActiveTab] = useState('info');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 수량 상태
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  // 송장 번호 등록 모달
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  // 수령 일자 등록 모달
  const [isReceiveDateModalOpen, setIsReceiveDateModalOpen] = useState(false);
  // 배송 정보 모달
  const [isDeliveryInfoModalOpen, setIsDeliveryInfoModalOpen] = useState(false);

  // 배송, 직접 수령 구분
  const [participantFilter, setParticipantFilter] = useState('delivery');
  // 필터에 맞는 참여자만
  const filteredParticipants = participants.filter(p => p.receive === participantFilter);
  
  // 주최자 여부 확인
  const isOrganizer = true;

  const handleInvoiceSave = (updatedData) => {
    // updatedData는 모달에서 넘어온 배열
    setParticipants(prev => prev.map(p => {
      const update = updatedData.find(item => item.id === p.id);
      if (update && update.courier && update.invoiceNum) {
        return { ...p, invoice: { courier: update.courier, number: update.invoiceNum } };
      }
      return p;
    }));
    alert('배송 정보가 저장되었습니다.');
  };

  const handleReceiveDateSave = (updatedData) => {
    // updatedData는 모달에서 넘어온 배열
    setParticipants(prev => prev.map(p => {
      const update = updatedData.find(item => item.id === p.id);
      if (update && update.receiveDate && update.receiveTime) {
        return { ...p, pickup: { receiveDate: update.receiveDate, receiveTime: update.receiveTime } };
      }
      return p;
    }));
    alert('배송 정보가 저장되었습니다.');
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
            {/* 필요하면 마감 뱃지 다시 사용 */}
            {/* <Badge>마감임박</Badge> */}
            <MainImage src={product.imageUrl} alt="상품 이미지" />
          </MainImageWrapper>
          <ThumbnailList>
            <Thumbnail $active={true}>
              <img src={product.imageUrl} alt="썸네일" />
            </Thumbnail>
          </ThumbnailList>
        </ImageArea>

        <InfoArea>
          <ProductTitleRow>
            <ProductTitle>{product.title}</ProductTitle>
          </ProductTitleRow>

          <ProgressSection>
            <ProgressLabel>현재 주문된 수량</ProgressLabel>
            <CurrentCount>{product.currentCount}</CurrentCount>
            <ProgressBarContainer>
              <ProgressBarFill $percent={progressPercent} />
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
                <OrganizerLeft>
                  <ProfileIcon>🦁</ProfileIcon>
                  <OrganizerName>{product.organizer}</OrganizerName>
                  <MannerLabel> {product.mannerScore}</MannerLabel>
                </OrganizerLeft>
                <ContactButton>문의하기</ContactButton>
              </OrganizerBadge>
            </OrganizerRow>
          </DetailList>

          <BottomArea>
            <QuantityArea>
              <QuantityLabel>구매 수량</QuantityLabel>
              <QuantityBox>
                <QtyButton onClick={handleDecrease}>-</QtyButton>
                <QtyValue>{quantity}</QtyValue>
                <QtyButton onClick={handleIncrease}>+</QtyButton>
              </QuantityBox>
              <ChangeQtyButton onClick={() => setIsModalOpen(true)}>수량변경하기</ChangeQtyButton>
            </QuantityArea>
            <PriceArea>
              <PriceText>{(product.price * quantity).toLocaleString()} 원</PriceText>
            </PriceArea>
          </BottomArea>
        </InfoArea>
      </TopSection>

      <TabMenu>
        <TabItem $active={activeTab === 'info'} onClick={() => setActiveTab('info')}>상품 정보</TabItem>
        <TabItem $active={activeTab === 'notice'} onClick={() => setActiveTab('notice')}>공지</TabItem>
        <TabItem $active={activeTab === 'review'} onClick={() => setActiveTab('review')}>후기</TabItem>
        {isOrganizer && (
          <TabItem $active={activeTab === 'manage'} onClick={() => setActiveTab('manage')}>구매자 관리</TabItem>
        )}
      </TabMenu>

      {activeTab === 'info' && (
        <>
          <Section>
            <SectionHeader>상품 정보</SectionHeader>
            <DescriptionBox>{product.description}</DescriptionBox>
          </Section>
          <Section>
            <SectionHeader>수령장소</SectionHeader>
            <MapPlaceholder>
              <MapOverlayButton>지도보기</MapOverlayButton>
            </MapPlaceholder>
          </Section>
        </>
      )}

      {activeTab === 'notice' && (
        <Section>
          <SectionHeader>공지</SectionHeader>
          <CommentList>
            {notices.map(notice => (
              <CommentItem key={notice.id}>
                <CommentHeader>
                  <UserInfo>
                    <UserIcon src="/images/filledprofile.svg" alt="user" />
                    <UserName>{notice.writer}</UserName>
                  </UserInfo>
                  <ReportButton onClick={() => navigate("/notificationreport")}>
                    <FaRegBell /> 신고
                  </ReportButton>
                </CommentHeader>
                <CommentContent>{notice.content}</CommentContent>
                <CommentDate>{notice.date}</CommentDate>
              </CommentItem>
            ))}
          </CommentList>
        </Section>
      )}

      {activeTab === 'review' && (
        <Section>
          <SectionHeader>후기</SectionHeader>
          <CommentList>
            {reviews.map(review => (
              <CommentItem key={review.id}>
                <CommentHeader>
                  <UserInfo>
                    <UserIcon src="/images/filledprofile.svg" alt="user"/>
                    <UserName>{review.writer}</UserName>
                    <RatingText>{review.rating}</RatingText>
                  </UserInfo>
                  <ReportButton onClick={() => navigate("/reviewreport")}>
                    <FaRegBell /> 신고
                  </ReportButton>
                </CommentHeader>
                <CommentContent>{review.content}</CommentContent>
                <CommentDate>{review.date}</CommentDate>
              </CommentItem>
            ))}
          </CommentList>
        </Section>
      )}

      {isOrganizer && activeTab === 'manage' && (
      <Section>
            <ManageHeader>
              <TitleGroup>
                <ManageTitle>공구 참여 명단</ManageTitle>
                  <FilterButton 
                    $active={participantFilter === 'delivery'}
                    onClick={() => {setParticipantFilter('delivery')}}>
                    배송 수령
                  </FilterButton>

                  <FilterButton 
                    $active={participantFilter === 'pickup'}
                    onClick={() => {setParticipantFilter('pickup')}}>
                    직접 수령
                  </FilterButton>
                </TitleGroup>
              {participantFilter === 'delivery' ? (
                <ManageButtonGroup>
                  <ManageButton onClick={() => setIsDeliveryInfoModalOpen(true)}>배송 정보</ManageButton>
                  <ManageButton onClick={() => setIsInvoiceModalOpen(true)}>송장번호 등록</ManageButton>
                </ManageButtonGroup>
            ) : (<ManageButton onClick={() => setIsReceiveDateModalOpen(true)}>수령일자 등록</ManageButton>)}
            </ManageHeader>
            
            {participantFilter === 'delivery' ? (
              <ParticipantTable>
                <thead>
                  <tr>
                    <th>성명</th>
                    <th>닉네임</th>
                    <th>결제 금액</th>
                    <th>결제 상태</th>
                    <th>수령 일자</th>
                    <th>송장 등록</th>
                  </tr>
                </thead>
                <tbody onClick={() => setIsDeliveryInfoModalOpen(true)}>
                  {filteredParticipants.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.name}</td>
                        <td>{p.nickname}</td>
                        <td>{p.amount}</td>
                        <td>{p.status}</td>
                        <td>{p.date}</td>
                        <td>
                          {p.invoice ? (
                            <RegisterStatusBadge $isRegistered={true}>등록 완료</RegisterStatusBadge>
                          ) : (
                            <RegisterStatusBadge $isRegistered={false}>미등록</RegisterStatusBadge>
                          )}
                        </td>
                      </tr>
                      )
                    )}
                </tbody>
              </ParticipantTable>
            ) : (
              <ParticipantTable>
              <thead>
                <tr>
                  <th>성명</th>
                  <th>닉네임</th>
                  <th>결제 금액</th>
                  <th>결제 상태</th>
                  <th>수령 일자</th>
                  <th>수령 일자 등록</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.name}</td>
                    <td>{p.nickname}</td>
                    <td>{p.amount}</td>
                    <td>{p.status}</td>
                    <td>{p.pickup ? p.pickup.receiveDate : '-'}</td>
                    <td>
                      {p.pickup ? (
                        <RegisterStatusBadge $isRegistered={true}>등록 완료</RegisterStatusBadge>
                      ) : (
                        <RegisterStatusBadge $isRegistered={false}>미등록</RegisterStatusBadge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </ParticipantTable>
            )
          }
          </Section>
        )}
      
      <PurchaseModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={{ ...product, quantity }} 
        />

      <InvoiceModal 
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          participants={filteredParticipants} 
          onSave={handleInvoiceSave}
        />

      <ReceiveModal 
          isOpen={isReceiveDateModalOpen}
          onClose={() => setIsReceiveDateModalOpen(false)}
          participants={filteredParticipants} 
          onSave={handleReceiveDateSave}
        />

      <DeliveryInfoModal 
          isOpen={isDeliveryInfoModalOpen}
          onClose={() => setIsDeliveryInfoModalOpen(false)}
          participants={filteredParticipants} 
        />

    </Container>
    );
  };

export default GroupPurchaseDetail;
