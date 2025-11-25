import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  width: 600px;
  border-radius: 12px;
  padding: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

// 정보 영역
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 12px;
`;

const Label = styled.div`
  width: 100px;
  font-weight: 500;
  flex-shrink: 0;
`;

const Value = styled.div`
  flex: 1;
  color: #333;
`;

// 사유 박스
// 긴 텍스트 줄바꿈 처리
const LongText = styled(Value)`
  white-space: pre-wrap;
  word-break: break-all;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 20px 0;
  width: 100%;
`;

// 처리 영역
const ProcessArea = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
`;

// 드롭다운 컨트롤
const ControlColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledSelect = styled.select`
  width: 80%;
  padding: 10px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #FF7E36;
  }
`;

// 사유 입력
const InputColumn = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #000;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 60px;
  padding: 12px;
  font-size: 11px;
  border: 1px solid #eee;
  border-radius: 8px;
  resize: none;
  font-family: inherit;

  &::placeholder {
    color: #999;
  }
`;

// 하단 버튼 그룹
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;

  background-color: ${props => props.primary ? '#FF7E36' : '#bbb'};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

// 처리 대기 상태 옵션
const STATUS_OPTIONS = {
  user: [
    { value: 'waiting', label: '처리 대기' },
    { value: 'dismiss', label: '조치 없음(신고 기각)' },
    { value: 'sanction', label: '사용자 제재' },
  ],
  review: [ // 후기, 공지 공통
    { value: 'waiting', label: '처리 대기' },
    { value: 'keep', label: '유지' },
    { value: 'hide', label: '숨김' },
    { value: 'delete', label: '삭제' },
  ]
};

// props: isOpen(모달상태), onClose(닫기함수), type('user' | 'review' | 'notice'), data(신고정보)
const ReportProcessModal = ({ isOpen, onClose, type = 'user', data }) => {
  // 상태 관리
  const [processStatus, setProcessStatus] = useState('waiting'); // 처리 상태
  const [reason, setReason] = useState('');                      // 제재 사유

  if (!isOpen) return null;

  // type에 따라 보여줄 드롭다운 옵션 결정
  const currentStatusOptions = (type === 'user') ? STATUS_OPTIONS.user : STATUS_OPTIONS.review;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <InfoSection>
          <InfoRow>
            <Label>신고 대상 :</Label>
            <Value>{data?.target || '사자사자'}</Value>
          </InfoRow>
          <InfoRow>
            <Label>신고자 :</Label>
            <Value>{data?.reporter || '최지우'}</Value>
          </InfoRow>

          <Divider style={{ margin: '5px 0' }} />

          <InfoRow>
            <Label>신고 제목 :</Label>
            <Value>{data?.title || '사자사자 유지님에게 사기를 당했습니다.'}</Value>
          </InfoRow>
          <InfoRow>
            <Label>신고 사유 :</Label>
            <LongText>
              {data?.reason || 'ㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌㅌ'}
            </LongText>
          </InfoRow>
        </InfoSection>

        <Divider />

        <ProcessArea>
          <ControlColumn>
              <StyledSelect 
                value={processStatus} 
                onChange={(e) => setProcessStatus(e.target.value)}
              >
                {currentStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </StyledSelect>
          </ControlColumn>

          <InputColumn>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              <InputLabel style={{ width: '100px', paddingTop: '5px' }}>제재 사유 :</InputLabel>
              <StyledTextArea 
                placeholder="내용을 입력해주세요." 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </InputColumn>

        </ProcessArea>
        <ButtonGroup>
          <ActionButton onClick={onClose}>닫기</ActionButton>
          <ActionButton primary onClick={() => {alert('처리되었습니다.'); onClose();}} >처리하기</ActionButton>
        </ButtonGroup>

      </ModalContainer>
    </Overlay>
  );
};

export default ReportProcessModal;