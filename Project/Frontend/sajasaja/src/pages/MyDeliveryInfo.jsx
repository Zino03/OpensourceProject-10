// 파일명: MyDeliveryList.jsx

import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ===========================
   스타일 정의
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

/* 테이블 헤더 */

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

/* 각 배송지 행 wrapper */

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

/* ===========================
   주소(중요 수정!)
=========================== */

const AddressCell = styled.div`
  font-size: 12px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: flex-start;   /* ← 왼쪽 정렬 */
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

/* 연락처 */

const PhoneCell = styled(Cell)`
  justify-content: center;  /* 가운데 */
  font-size: 13px;
`;

/* 관리 버튼 */

const ActionsCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;       /* 가운데 */
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
   더미 데이터
=========================== */

const initialAddresses = [
  {
    id: 1,
    name: "최*우",
    label: "집",
    zip: "12345",
    road: "도로명: 충북 청주시 가나구 다라로 123(삼성동, 사자아파트)***** 123동 1234호",
    entranceTitle: "공동현관 출입방법",
    entranceDetail: "자유출입가능",
    phoneMasked: "010-*****-5709",
    isDefault: true,
  },
  {
    id: 2,
    name: "최*우",
    label: "기숙사",
    zip: "12345",
    road: "도로명: 충북 청주시 가나구 다라로 123(삼성동, 사자아파트)***** 123동 1234호",
    entranceTitle: "공동현관 출입방법",
    entranceDetail: "자유출입가능",
    phoneMasked: "010-*****-5709",
    isDefault: false,
  },
];

/* ===========================
   컴포넌트
=========================== */

const MyDeliveryList = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(initialAddresses);

  const handleNew = () => navigate("/newdelivery");

  const handleEdit = (id) => {
    console.log("edit", id);
  };

  const handleDelete = (id) => {
    if (window.confirm("해당 배송지를 삭제하시겠습니까?")) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSetDefault = (id) => {
  setAddresses((prev) => {
    const updated = prev.map((addr) =>
      addr.id === id
        ? { ...addr, isDefault: true }
        : { ...addr, isDefault: false }
    );

    // 🔥 기본배송지를 가장 위로 이동시키는 정렬
    return updated.sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return 0;
    });
  });
};


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

      {addresses.map((addr) => (
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
                <SmallButton onClick={() => handleEdit(addr.id)}>수정</SmallButton>

                {!addr.isDefault && (
                  <SmallButton onClick={() => handleDelete(addr.id)}>삭제</SmallButton>
                )}
              </ActionTopRow>

              {!addr.isDefault && (
                <ActionBottomRow>
                  <SmallButton 
                  style={{ width: "110px" }}   // ← 원하는 너비로 조절
                  onClick={() => handleSetDefault(addr.id)}>
                    기본배송지 설정
                    
                  </SmallButton>
                </ActionBottomRow>
              )}
            </ActionsCell>
          </AddressRowGrid>
        </AddressRowWrapper>
      ))}
    </PageWrapper>
  );
};

export default MyDeliveryList;
