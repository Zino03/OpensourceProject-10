import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from "react-router-dom"; // useParams 추가
import { FaRegBell } from "react-icons/fa";
import PurchaseModal from './modal/PurchaseModal';
import InvoiceModal from './modal/InvoiceModal';
import ReceiveModal from './modal/ReceiveModal';
import DeliveryInfoModal from './modal/DeliveryInfoModal';
import { api, setInterceptor } from "../assets/setIntercepter"; // api 임포트

const BACKEND_URL = "http://192.168.31.28:8080"; // 백엔드 주소

// --- Styled Components (기존 스타일 유지) ---
const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 100px;
`;

const CancelButton = styled.button`
  background-color: #e0e0e0;
  border: none;
  color: #000000ff;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #D32F2F;
    color: #fff;
  }
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

const TopSection = styled.div`
  display: flex;
  gap: 60px;
  margin-bottom: 40px;

  @media (max-width: 750px) {
    flex-direction: column;
    gap: 40px;
  }
`;

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
  display: none;
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
  cursor: pointer;
`;

const ProfileIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;

const OrganizerName = styled.span`
  font-weight: 600;
`;

const MannerLabel = styled.span`
  font-size: 12px;
  color: #FF7E00;
  background-color: #FFF5E0;
  padding: 2px 6px;
  border-radius: 4px;
`;

const ContactButton = styled.button`
  background-color: #ffffffff;
  color: #333;
  border: 1px solid #000000ff;
  font-size: 12px;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

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
  color: ${props => props.$active ? '#000000ff' : '#555'};
  border-bottom: 1px solid ${props => props.$active ? '#000000ff' : 'transparent'};
  cursor: pointer;
  &:hover { opacity: 0.9; }
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
  const { id } = useParams(); // URL에서 공구 ID 가져오기
  const navigate = useNavigate();

  // ✅ State 정의
  const [post, setPost] = useState(null); // 공구 상세 정보
  const [notices, setNotices] = useState([]); // 공지사항
  const [reviews, setReviews] = useState([]); // 후기
  const [participants, setParticipants] = useState([]); // 참여자 목록 (주최자용)
  const [isLoading, setIsLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false); // 주최자 여부

  const [activeTab, setActiveTab] = useState('info');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 수량 관리
  const [quantity, setQuantity] = useState(1);
  const [currentCount, setCurrentCount] = useState(0);

  // 모달 관리
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiveDateModalOpen, setIsReceiveDateModalOpen] = useState(false);
  const [isDeliveryInfoModalOpen, setIsDeliveryInfoModalOpen] = useState(false);
  const [participantFilter, setParticipantFilter] = useState('delivery');

  // ✅ 데이터 로드
  useEffect(() => {
    const fetchPostDetail = async () => {
      const token = localStorage.getItem('accessToken');
      const myNickname = localStorage.getItem('user_nickname');

      if (!setInterceptor(token)) {
         // 로그인 안된 상태 등 처리 (필요 시)
      }

      try {
        setIsLoading(true);
        // 1. 공구 상세 정보 조회
        const response = await api.get(`/api/posts/${id}`);
        const postData = response.data.post;

        setPost(postData);
        setNotices(postData.notices || []);
        setReviews(postData.reviews || []);
        setCurrentCount(postData.currentQuantity || 0);

        // 주최자 확인
        if (postData.host && postData.host.nickname === myNickname) {
           setIsOrganizer(true);
           
           // 2. 주최자라면 참여자 명단 조회
           const buyersResponse = await api.get(`/api/posts/${id}/buyers`);
           // buyersResponse.data.buyers 가 리스트라고 가정 (DTO 확인 필요)
           const buyers = buyersResponse.data.buyers || [];
           
           // 참여자 데이터 매핑
           const mappedBuyers = buyers.map(b => ({
               id: b.buyerId,
               name: b.name,
               nickname: b.nickname,
               amount: `${b.totalPrice?.toLocaleString()}원`,
               address: b.address ? `(${b.address.zipCode}) ${b.address.street} ${b.address.detail}` : "주소 정보 없음",
               status: b.isPaid === 1 ? '결제 완료' : '결제 대기', // isPaid 매핑 (0:대기, 1:완료 등, 백엔드 로직 확인 필요)
               date: b.receivedAt ? b.receivedAt.substring(0,10) : '-',
               invoice: b.trackingNumber ? { number: b.trackingNumber } : null,
               pickup: b.receivedAt ? { receiveDate: b.receivedAt } : null,
               receive: b.address ? 'delivery' : 'pickup', // 주소가 있으면 배송, 없으면 픽업으로 가정 (혹은 백엔드 필드 확인)
               phone: b.phone
           }));
           setParticipants(mappedBuyers);
        }

      } catch (error) {
        console.error("공구 상세 정보 로드 실패:", error);
        alert("정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
        fetchPostDetail();
    }
  }, [id]);

  // D-Day 계산 헬퍼
  const getDaysLeft = (endDateStr) => {
    if (!endDateStr) return 0;
    const today = new Date();
    const end = new Date(endDateStr);
    const diff = end - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (isLoading || !post) return <div style={{padding:'50px', textAlign:'center'}}>로딩 중...</div>;

  // ✅ 화면 표시용 데이터 가공
  const product = {
    title: post.title,
    currentCount: post.currentQuantity,
    goalCount: post.quantity,
    startDate: post.createdAt ? post.createdAt.substring(0, 10) : '',
    endDate: post.endAt ? post.endAt.substring(0, 10) : '',
    daysLeft: getDaysLeft(post.endAt),
    shipping: post.isDeliveryAvailable ? '배송 가능' : '배송 불가',
    shippingCost: post.deliveryFee ? `${post.deliveryFee.toLocaleString()}원` : '무료',
    organizer: post.host?.nickname || '알 수 없음',
    organizerProfileImage: post.host?.profileImg ? `${BACKEND_URL}${post.host.profileImg}` : "/images/profile.png",
    price: post.price,
    imageUrl: post.image ? `${BACKEND_URL}${post.image}` : '/images/sajasaja.png',
    description: post.content,
  };

  // 필터링된 참여자 목록
  const filteredParticipants = participants.filter(p => p.receive === participantFilter);

  const handleCancelClick = async () => {
    const confirmed = window.confirm('정말 이 공구를 취소하시겠습니까? (주최자 전용)');
    if (confirmed) {
      try {
          await api.post(`/api/posts/${id}/cancel`);
          alert("공구가 취소되었습니다.");
          navigate("/mygroupperchase");
      } catch (error) {
          console.error("취소 실패:", error);
          alert("취소 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  // 수량 변경 시 호출 (현재는 UI만 변경, 실제 로직은 필요 시 API 호출)
  const handleApplyQuantity = () => {
    // 단순히 계산된 수량을 보여주는 용도라면 state update
    // 만약 내 구매 수량을 변경하는 것이라면 API 호출 필요 (/api/post/{id}/host-quantity 등)
    setCurrentCount(post.currentQuantity + (quantity)); 
  };

  const progressPercent = Math.min((currentCount / product.goalCount) * 100, 100);

  // ✅ 송장 번호 저장 핸들러
  const handleInvoiceSave = async (updatedData) => {
      // updatedData: [{id, courier, invoiceNum}, ...]
      try {
          for (const item of updatedData) {
              if(item.invoiceNum) {
                  await api.post(`/api/posts/${id}/tracking`, {
                      buyerId: item.id,
                      trackingNumber: item.invoiceNum,
                      carrier: item.courier || "대한통운" // 택배사 정보가 없다면 기본값
                  });
              }
          }
          alert('송장 정보가 저장되었습니다.');
          window.location.reload(); // 새로고침하여 데이터 갱신
      } catch(err) {
          console.error(err);
          alert("송장 등록 실패");
      }
  };

  // ✅ 수령 일자 저장 핸들러
  const handleReceiveDateSave = async (updatedData) => {
      try {
           for (const item of updatedData) {
              if(item.receiveDate) {
                  // receivedAt 포맷 맞추기 (YYYY-MM-DDTHH:mm:ss)
                  const dateStr = `${item.receiveDate}T${item.receiveTime || '00:00'}:00`;
                  await api.post(`/api/posts/${id}/received-at`, {
                      buyerId: item.id,
                      receivedAt: dateStr
                  });
              }
          }
          alert('수령 일자가 저장되었습니다.');
          window.location.reload();
      } catch(err) {
          console.error(err);
          alert("수령 일자 등록 실패");
      }
  };

  return (
    <Container>
      <CategoryTag>
        <span>{post.category || '카테고리'}</span> &gt;
      </CategoryTag>

      <TopSection>
        <ImageArea>
          <MainImageWrapper>
            {product.daysLeft <= 3 && <div style={{position:'absolute', top:10, right:10, background:'red', color:'white', padding:'5px 10px', borderRadius:'15px', fontSize:'12px'}}>마감임박</div>}
            <MainImage src={product.imageUrl} alt="상품 이미지" onError={(e) => e.target.src="/images/sajasaja.png"}/>
          </MainImageWrapper>
        </ImageArea>

        <InfoArea>
          <ProductTitleRow>
            <ProductTitle>{product.title}</ProductTitle>
            {isOrganizer && (
                <CancelButton onClick={handleCancelClick}>
                  공구취소
                </CancelButton>
            )}
          </ProductTitleRow>

          <ProgressSection>
            <ProgressLabel>현재 주문된 수량</ProgressLabel>
            <CurrentCount>{currentCount} / {product.goalCount}</CurrentCount>
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
              <OrganizerLeft onClick={() => { /* 유저 페이지 이동 로직 */ }}>
                <ProfileIcon
                  src={product.organizerProfileImage}
                  alt="profile"
                  onError={(e) => e.target.src="/images/filledprofile.svg"}
                />
                <OrganizerName>{product.organizer}</OrganizerName>
                {/* 매너온도는 ProfileResponseDto를 따로 불러오거나 PostResponseDto에 포함되어야 함 */}
                {/* <MannerLabel>3.2점</MannerLabel> */}
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
              {/* 단순히 수량 변경을 시뮬레이션 하는 버튼 */}
              <ChangeQtyButton onClick={handleApplyQuantity}>
               적용
              </ChangeQtyButton>
            </QuantityArea>
            <PriceArea>
              <PriceText>{(product.price * quantity).toLocaleString()} 원</PriceText>
            </PriceArea>
          </BottomArea>
          
          {/* 일반 참여자용 구매 버튼 (주최자가 아닐 때 표시) */}
          {!isOrganizer && (
             <div style={{marginTop: '20px'}}>
                 <button 
                    style={{width: '100%', background: '#FF7E00', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'}}
                    onClick={() => setIsModalOpen(true)}
                 >
                    공구 참여하기
                 </button>
             </div>
          )}

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

      {/* --- 탭 내용 --- */}
      {activeTab === 'info' && (
        <>
          <Section>
            <SectionHeader>상품 정보</SectionHeader>
            <DescriptionBox>{product.description}</DescriptionBox>
          </Section>
          <Section>
            <SectionHeader>수령장소</SectionHeader>
            {post.pickupAddress && (
                 <div style={{padding: '20px', background: '#f9f9f9', borderRadius: '8px'}}>
                     <p><strong>주소:</strong> {post.pickupAddress.street}</p>
                     {/* 지도 컴포넌트가 있다면 lat, lon으로 표시 */}
                 </div>
            )}
            <MapPlaceholder>
              <MapOverlayButton>지도보기</MapOverlayButton>
            </MapPlaceholder>
          </Section>
        </>
      )}

      {activeTab === 'notice' && (
        <Section>
          <SectionHeader>공지</SectionHeader>
          {notices.length > 0 ? (
            <CommentList>
                {notices.map((notice, idx) => (
                <CommentItem key={notice.id || idx}>
                    <CommentHeader>
                    <UserInfo>
                        <UserIcon src="/images/filledprofile.svg" alt="user" />
                        <UserName>공지사항 {idx + 1}</UserName>
                    </UserInfo>
                    </CommentHeader>
                    <CommentContent>{notice.content}</CommentContent>
                    <CommentDate>{notice.createdAt ? notice.createdAt.substring(0,10) : ''}</CommentDate>
                </CommentItem>
                ))}
            </CommentList>
          ) : (
              <div style={{padding: '20px', color: '#999', textAlign: 'center'}}>등록된 공지사항이 없습니다.</div>
          )}
        </Section>
      )}

      {activeTab === 'review' && (
        <Section>
          <SectionHeader>후기</SectionHeader>
          {reviews.length > 0 ? (
              <CommentList>
                {reviews.map((review, idx) => (
                  <CommentItem key={review.id || idx}>
                    <CommentHeader>
                      <UserInfo>
                        <UserIcon src="/images/filledprofile.svg" alt="user"/>
                        <UserName>{review.nickname || '익명'}</UserName>
                        <RatingText>별점 {review.score}점</RatingText>
                      </UserInfo>
                    </CommentHeader>
                    <CommentContent>{review.content}</CommentContent>
                    <CommentDate>{review.createdAt ? review.createdAt.substring(0,10) : ''}</CommentDate>
                  </CommentItem>
                ))}
              </CommentList>
          ) : (
               <div style={{padding: '20px', color: '#999', textAlign: 'center'}}>등록된 후기가 없습니다.</div>
          )}
        </Section>
      )}

      {/* 주최자 관리 탭 */}
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
            
            <ParticipantTable>
                <thead>
                  <tr>
                    <th>성명</th>
                    <th>닉네임</th>
                    <th>결제 금액</th>
                    <th>결제 상태</th>
                    {participantFilter === 'delivery' ? (
                         <>
                           <th>수령 일자</th>
                           <th>송장 등록</th>
                         </>
                    ) : (
                         <>
                           <th>수령 일자</th>
                           <th>수령 일자 등록</th>
                         </>
                    )}
                  </tr>
                </thead>
                <tbody onClick={() => setIsDeliveryInfoModalOpen(true)}>
                  {filteredParticipants.length > 0 ? filteredParticipants.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.name}</td>
                        <td>{p.nickname}</td>
                        <td>{p.amount}</td>
                        <td>{p.status}</td>
                        <td>{p.date}</td>
                        <td>
                           {participantFilter === 'delivery' ? (
                                p.invoice ? <RegisterStatusBadge $isRegistered={true}>등록 완료</RegisterStatusBadge>
                                          : <RegisterStatusBadge $isRegistered={false}>미등록</RegisterStatusBadge>
                           ) : (
                                p.pickup ? <RegisterStatusBadge $isRegistered={true}>등록 완료</RegisterStatusBadge>
                                         : <RegisterStatusBadge $isRegistered={false}>미등록</RegisterStatusBadge>
                           )}
                        </td>
                      </tr>
                  )) : (
                      <tr><td colSpan="6" style={{padding:'30px', color:'#999'}}>참여자가 없습니다.</td></tr>
                  )}
                </tbody>
              </ParticipantTable>
          </Section>
        )}
      
      {/* --- 모달 컴포넌트들 --- */}
      <PurchaseModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={{ ...product, quantity }} // 선택된 수량 전달
          postId={id} // API 호출용 ID 전달
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