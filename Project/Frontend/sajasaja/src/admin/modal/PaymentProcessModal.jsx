import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  width: 600px;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
`;

// 섹션 스타일
const Section = styled.div`
  margin-bottom: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  font-size: 11px;
`;

const Label = styled.div`
  width: 120px;
  color: #666;
  font-weight: 500;
`;

const Value = styled.div`
  flex: 1;
  font-weight: 400;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 8px 0;
`;

// 상품 정보 테이블 스타일
const ProductTable = styled.div`
  width: 100%;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
`;

const TableHeader = styled.div`
  display: flex;
  background-color: #f5f5f5;
  padding: 10px 0;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.div`
  display: flex;
  padding: 12px 0;
  font-size: 11px;
  text-align: center;
  align-items: center;
`;

const Col = styled.div`
  flex: ${props => props.width || 1};
  padding: 0 5px;
`;

// 버튼 영역
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  
  background-color: ${props => props.type === 'cancel' ? '#BDBDBD' : '#000'};
  color: #fff;

  &:hover {
    opacity: 0.9;
  }
`;

const PaymentProcessModal = ({ isOpen, onClose, data, onSave }) => {
  if (!isOpen || !data) return null;

  // 부모에서 받은 data: { id, title, depositor, buyer, amount, deadline, paymentDeadline, status }
  const detailData = {
    orderDate: '2025-11-12', 
    productName: data.title, 
    price: Number(data.amount) / 3, 
    quantity: 3,
    totalAmount: Number(data.amount),
    buyerName: data.buyer,
    phone: '010-1234-5678', 
    email: 'example@email.com', 
    paymentMethod: '무통장입금',
    virtualAccount: '농협 1234567890', 
    statusText: data.status === 'waiting' ? '결제 대기' : data.status === 'completed' ? '결제 완료' : '취소됨',
    depositDeadline: data.paymentDeadline
  };

  // 상태 변경 핸들러
  const handleStatusChange = (newStatus) => {
    // 부모 컴포넌트의 데이터를 업데이트
    onSave(data.id, { status: newStatus });
    alert(newStatus === 'waiting' ? '재입금 대기 상태로 변경되었습니다.' : '결제 완료 처리되었습니다.');
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>입금 관리</ModalTitle>
        <Section>
          <SectionTitle>상품 정보</SectionTitle>
          <ProductTable>
            <TableHeader>
              <Col width={4}>상품명</Col>
              <Col width={1.5}>단가</Col>
              <Col width={1}>수량</Col>
              <Col width={1.5}>금액</Col>
            </TableHeader>
            <TableRow>
              <Col width={4} style={{textAlign: 'left', paddingLeft: '15px'}}>{detailData.productName}</Col>
              <Col width={1.5}>{Math.round(detailData.price).toLocaleString()}</Col>
              <Col width={1}>{detailData.quantity}</Col>
              <Col width={1.5}>{detailData.totalAmount.toLocaleString()}</Col>
            </TableRow>
          </ProductTable>
        </Section>

        <Divider />

        <Section>
          <SectionTitle>구매자정보</SectionTitle>
          <InfoRow>
            <Label>구매자</Label>
            <Value>{detailData.buyerName}</Value>
          </InfoRow>
          <InfoRow>
            <Label>전화번호</Label>
            <Value>{detailData.phone}</Value>
          </InfoRow>
          <InfoRow>
            <Label>이메일</Label>
            <Value>{detailData.email}</Value>
          </InfoRow>
        </Section>

        <Divider />

        <Section>
          <SectionTitle>결제정보</SectionTitle>
          <InfoRow>
            <Label>결제방법</Label>
            <Value>{detailData.paymentMethod}</Value>
          </InfoRow>
          <InfoRow>
            <Label>가상계좌</Label>
            <Value>{detailData.virtualAccount}</Value>
          </InfoRow>
          <InfoRow>
            <Label>결제 상태</Label>
            <Value>{detailData.statusText}</Value>
          </InfoRow>
          <InfoRow>
            <Label>입금 기한</Label>
            <Value>{detailData.depositDeadline}</Value>
          </InfoRow>
        </Section>

        <ButtonGroup>
          <Button type="cancel" onClick={onClose}>닫기</Button>
          <Button onClick={() => handleStatusChange('waiting')}>재입금 대기</Button>
          <Button onClick={() => handleStatusChange('completed')}>결제 완료</Button>
        </ButtonGroup>

      </ModalContainer>
    </Overlay>
  );
};

export default PaymentProcessModal;