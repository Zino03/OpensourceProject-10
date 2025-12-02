import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api, setInterceptor } from '../assets/setIntercepter';

/* ===========================
   스타일 정의 (기존 코드 유지)
=========================== */
const PageWrapper = styled.div`
  width: 100%;
  max-width: 1180px;
  margin: 60px auto 120px;
  padding: 0 40px;
  box-sizing: border-box;
  color: #222;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

const NewButton = styled.button`
  padding: 5px 20px;
  font-size: 12px;
  font-weight: 400;
  border-radius: 10px;
  border: none;
  background-color: #000;
  color: #fff;
  cursor: pointer;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 4.2fr 1.8fr 1.8fr;
  font-size: 13px;
  font-weight: 500;
  padding: 0 8px 10px 8px;
  border-bottom: 1px solid #e0e0e0;
`;

const HeaderCellLeft = styled.div`
  text-align: left;
`;

const HeaderCellCenter = styled.div`
  text-align: center;
`;

const AddressRowWrapper = styled.div`
  border-bottom: 1px solid #e5e5e5;
  padding: 22px 8px;
`;

const AddressRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 4.2fr 1.8fr 1.8fr;
  font-size: 13px;
  align-items: center;
  column-gap: 10px;
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
`;

const NameCell = styled(Cell)`
  justify-content: flex-start;
  font-weight: 500;
`;

const LabelCell = styled(Cell)`
  justify-content: flex-start;
  font-weight: 500;
`;

const AddressCell = styled.div`
  font-size: 12px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DefaultBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  padding: 0 8px;
  height: 22px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background-color: #ff7e00;
  color: #fff;
`;

const ZipLine = styled.p`
  margin: 0 0 2px 0;
`;

const RoadLine = styled.p`
  margin: 0 0 8px 0;
  color: #555;
`;

const InnerDivider = styled.div`
  width: 100%;
  max-width: 420px;
  height: 1px;
  background-color: #eeeeee;
  margin: 0 0 6px 0;
`;

const EntranceInfo = styled.div`
  font-size: 11px;
  color: #777;
  line-height: 1.4;
`;

const PhoneCell = styled(Cell)`
  justify-content: center;
  font-size: 13px;
`;

const ActionsCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const ActionTopRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 3px;
`;

const ActionBottomRow = styled.div`
  display: flex;
  justify-content: center;
`;

const SmallButton = styled.button`
  min-width: 54px;
  height: 25px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid #d3d3d3;
  background-color: #fff;
  font-size: 12px;
  cursor: pointer;
  color: #444;
`;

/* ===========================
   유틸리티 함수 (전화번호 마스킹)
=========================== */
const maskPhoneNumber = (phone) => {
  if (!phone) return "";
  // 010-1234-5678 -> 010-****-5678
  const parts = phone.split("-");
  if (parts.length === 3) {
    return `${parts[0]}-****-${parts[2]}`;
  }
  return phone;
};

/* ===========================
   컴포넌트
=========================== */

const MyDeliveryInfo = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 배송지 목록 조회 (GET)
  const fetchAddressList = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token || !setInterceptor(token)) {
       navigate('/login');
       return;
    }

    try {
      setLoading(true);
      const response = await api.get('/api/mypage/addresses');
      // 백엔드 응답 구조: { addresses: [ ... ] }
      const list = response.data.addresses || [];
      
      // 프론트엔드 구조로 매핑
      const mappedList = list.map(addr => ({
        id: addr.id,
        // 백엔드 DTO 필드명 확인 필요 (UserAddressResponseDto)
        // recipient: 받는 사람, name: 배송지명(집, 회사 등)
        name: addr.recipient || addr.name, // 화면의 '받는 사람' 컬럼
        label: addr.name,       // 화면의 '배송지명' 컬럼
        zip: addr.zipCode,
        road: `도로명: ${addr.street} ${addr.detail || ''}`,
        entranceTitle: "공동현관 출입방법",
        entranceDetail: addr.entranceDetail || addr.entranceAccess || "-",
        phoneMasked: maskPhoneNumber(addr.phone),
        isDefault: addr.isDefault,
        
        // 수정 페이지로 넘길 원본 데이터
        originalData: {
            name: addr.name,          // 배송지명
            recipient: addr.recipient,// 받는사람
            phone: addr.phone,
            zipCode: addr.zipCode,
            street: addr.street,
            detail: addr.detail,
            entranceAccess: addr.entranceAccess,
            entranceDetail: addr.entranceDetail,
            isDefault: addr.isDefault
        }
      }));

      // 기본 배송지가 상단에 오도록 정렬
      mappedList.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      
      setAddresses(mappedList);
    } catch (error) {
      console.error("배송지 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddressList();
  }, []);

  const handleNew = () => navigate("/newdelivery");

  // ✅ 수정 페이지로 이동 (데이터 전달)
  const handleEdit = (addr) => {
    navigate("/editdelivery", {
      state: {
        addressId: addr.id,
        ...addr.originalData 
      },
    });
  };

  // ✅ 배송지 삭제 (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("해당 배송지를 삭제하시겠습니까?")) {
      try {
        await api.delete(`/api/mypage/address/${id}`);
        alert("배송지가 삭제되었습니다.");
        fetchAddressList(); // 목록 갱신
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // ✅ 기본 배송지 설정 (PATCH)
  const handleSetDefault = async (id) => {
    try {
        // isDefault: true만 보내면 백엔드 로직(UserService)이 나머지를 false로 처리해줌
        await api.patch(`/api/mypage/address/${id}`, {
            isDefault: true
        });
        alert("기본 배송지로 설정되었습니다.");
        fetchAddressList(); // 목록 갱신
    } catch (error) {
        console.error("기본 배송지 설정 실패:", error);
        alert("설정 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
      return <div style={{padding:'50px', textAlign:'center'}}>로딩 중...</div>;
  }

  return (
    <PageWrapper>
      <TopBar>
        <PageTitle>배송지 관리</PageTitle>
        <NewButton onClick={handleNew}>새로운 배송지 등록</NewButton>
      </TopBar>

      <TableHeader>
        <HeaderCellLeft>받는 사람</HeaderCellLeft>
        <HeaderCellLeft>배송지명</HeaderCellLeft>
        <HeaderCellCenter>주소</HeaderCellCenter>
        <HeaderCellCenter>연락처</HeaderCellCenter>
        <HeaderCellCenter>관리</HeaderCellCenter>
      </TableHeader>

      {addresses.length === 0 ? (
          <div style={{padding:'50px', textAlign:'center', color:'#888', borderBottom:'1px solid #e5e5e5'}}>
              등록된 배송지가 없습니다.
          </div>
      ) : (
          addresses.map((addr) => (
            <AddressRowWrapper key={addr.id}>
              <AddressRowGrid>
                <NameCell>{addr.name}</NameCell>

                <LabelCell>{addr.label}</LabelCell>

                <AddressCell>
                  {addr.isDefault && <DefaultBadge>기본배송지</DefaultBadge>}

                  <ZipLine>({addr.zip})</ZipLine>
                  <RoadLine>{addr.road}</RoadLine>

                  <InnerDivider />

                  <EntranceInfo>
                    <div>{addr.entranceTitle}</div>
                    <div>{addr.entranceDetail}</div>
                  </EntranceInfo>
                </AddressCell>

                <PhoneCell>{addr.phoneMasked}</PhoneCell>

                <ActionsCell>
                  <ActionTopRow>
                    <SmallButton onClick={() => handleEdit(addr)}>수정</SmallButton>

                    {!addr.isDefault && (
                      <SmallButton onClick={() => handleDelete(addr.id)}>
                        삭제
                      </SmallButton>
                    )}
                  </ActionTopRow>

                  {!addr.isDefault && (
                    <ActionBottomRow>
                      <SmallButton
                        style={{ width: "110px" }}
                        onClick={() => handleSetDefault(addr.id)}
                      >
                        기본배송지 설정
                      </SmallButton>
                    </ActionBottomRow>
                  )}
                </ActionsCell>
              </AddressRowGrid>
            </AddressRowWrapper>
          ))
      )}
    </PageWrapper>
  );
};

export default MyDeliveryInfo;