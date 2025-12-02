import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api } from '../assets/setIntercepter'; // api 인스턴스

/* ===========================
   공통 레이아웃 (기존 스타일 유지)
=========================== */
// ... (Container, PageTitle, Section, LabelRow 등 스타일 컴포넌트는 그대로 사용) ...
const Container = styled.div`
  width: 100%;
  max-width: 1040px;
  margin: 60px auto 100px;
  padding: 0 24px;
  box-sizing: border-box;
  color: #222;
`;
const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 30px;
`;
const Section = styled.section`
  margin-bottom: 40px;
`;
const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
`;
const LabelRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
`;
const Label = styled.span``;
const RequiredDot = styled.span`
  color: #ff3b30;
  margin-left: 4px;
`;
const InputArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const StyledInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  box-sizing: border-box;
  &::placeholder { color: #aaa; }
  &:read-only { background-color: #f6f6f6; border-color: #eee; }
`;
const DeliveryNameInput = styled(StyledInput)`
  max-width: 280px;
`;
const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  input { width: 16px; height: 16px; }
`;
const ZipRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const ZipInput = styled(StyledInput)`
  max-width: 150px;
  background-color: #f6f6f6;
  border-color: #eee;
`;
const ZipButton = styled.button`
  height: 44px;
  padding: 0 18px;
  border: 1px solid #ff7e00;
  border-radius: 6px;
  background: #fff;
  color: #ff7e00;
  font-size: 13px;
  cursor: pointer;
`;
const PhoneRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  input { width: 90px; text-align: center; }
`;
const AddressBox = styled.div`
  background-color: #f6f6f6;
  border: 1px solid #eee;
  padding: 14px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
`;
const AddressText = styled.p`
  margin: 0;
`;
const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
`;
const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 12px;
  input {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #bbb;
    border-radius: 50%;
    margin: 0;
    position: relative;
  }
  input:checked { border-color: #ff7e00; }
  input:checked::after {
    content: "";
    position: absolute;
    width: 9px;
    height: 9px;
    background-color: #ff7e00;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
const NoticeWrapper = styled.div`
  margin-top: 24px;
`;
const NoticeTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
`;
const NoticeList = styled.ul`
  padding-left: 18px;
  list-style: disc;
  margin: 0 0 8px 0;
  li { font-size: 11px; color: #777; margin-bottom: 3px; }
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 40px;
`;
const BaseButton = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
`;
const CancelButton = styled(BaseButton)`
  border: 1px solid #ddd;
  background-color: #fff;
  color: #666;
`;
const SubmitButton = styled(BaseButton)`
  border: none;
  background-color: #000;
  color: #fff;
`;

/* ===========================
   메인 컴포넌트
=========================== */

const NewDeliveryInfo = () => {
  const navigate = useNavigate();

  // 상태값
  const [labelName, setLabelName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [receiver, setReceiver] = useState("");

  const [phone, setPhone] = useState({
    p1: "010",
    p2: "",
    p3: "",
  });

  const [zipCode, setZipCode] = useState("");
  const [roadAddr, setRoadAddr] = useState("");
  const [detailAddr, setDetailAddr] = useState("");

  // 공동현관 출입방법 (프론트엔드 키값)
  const [entranceMethod, setEntranceMethod] = useState("password"); 
  const [entranceDetail, setEntranceDetail] = useState("");

  const [agree, setAgree] = useState(false);

  const isEmpty = (v) => !v || v.trim() === "";

  const handleEntranceChange = (method) => {
    setEntranceMethod(method);
    if (method === "free") {
      setEntranceDetail("");
    }
  };

  // 백엔드 Enum 값 매핑 함수
  const getEntranceAccessEnum = (method) => {
    switch (method) {
        case "password": return "PASSWORD";
        case "security": return "SECURITY_OFFICE";
        case "free": return "FREE";
        case "etc": return "ETC";
        default: return "ETC";
    }
  };

  const getEntranceLabel = () => {
    switch (entranceMethod) {
      case "password": return "공동현관 비밀번호";
      case "security": return "경비실 호출 방법";
      case "etc": return "기타 상세 내용";
      default: return "";
    }
  };

  const getEntrancePlaceholder = () => {
    switch (entranceMethod) {
      case "password": return "공동현관 비밀번호를 입력해주세요.";
      case "security": return "경비실 호출 방법을 입력해주세요.";
      case "etc": return "기타 상세 내용을 입력해주세요.";
      default: return "";
    }
  };

  const handleZipSearch = () => {
    // TODO: 다음 주소 API 연동 필요
    // 임시로 테스트용 주소 입력
    setZipCode("12345");
    setRoadAddr("충북 청주시 서원구 충대로 1");
    alert("임시 주소가 입력되었습니다. (실제 주소 API 연동 필요)");
  };

  // ✅ [수정됨] 배송지 등록 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 필수값 검증
    if (isEmpty(labelName)) { alert("배송지 명을 입력해주세요."); return; }
    if (isEmpty(receiver)) { alert("받는 분을 입력해주세요."); return; }
    if (isEmpty(phone.p2) || isEmpty(phone.p3)) { alert("연락처를 모두 입력해주세요."); return; }
    if (isEmpty(zipCode)) { alert("우편번호를 입력해주세요."); return; }
    if (isEmpty(detailAddr)) { alert("상세주소를 입력해주세요."); return; }
    if (entranceMethod !== "free" && isEmpty(entranceDetail)) {
      alert(`${getEntranceLabel()}를 입력해주세요.`);
      return;
    }
    if (!agree) { alert("개인정보 수집 및 이용에 동의해주세요."); return; }

    // 2. 데이터 가공 (UserAddressRequestDto 구조)
    const requestData = {
        name: labelName,          // 배송지명
        recipient: receiver,      // 받는 사람
        phone: `${phone.p1}-${phone.p2}-${phone.p3}`, // 전화번호 (010-1234-5678)
        zipCode: zipCode,         // 우편번호
        street: roadAddr,         // 도로명 주소
        detail: detailAddr,       // 상세 주소
        entranceAccess: getEntranceAccessEnum(entranceMethod), // 출입방법 Enum
        entranceDetail: entranceDetail, // 출입방법 상세
        isDefault: isDefault      // 기본 배송지 여부
    };

    try {
        // 3. POST 요청 전송
        const response = await api.post("/api/mypage/address", requestData);

        if (response.status === 200 || response.status === 201) {
            alert("배송지가 등록되었습니다.");
            navigate("/mydelivery");
        }
    } catch (error) {
        console.error("배송지 등록 실패:", error);
        // 백엔드 유효성 검사 에러 메시지 처리
        if (error.response && error.response.data) {
             const errorData = error.response.data;
             // 예: { "valid_phone": "...", "message": "..." }
             if(errorData.message) {
                 alert(errorData.message);
             } else {
                 alert("입력 정보를 확인해주세요.");
             }
        } else {
            alert("배송지 등록 중 오류가 발생했습니다.");
        }
    }
  };

  return (
    <Container>
      <PageTitle>배송지 등록</PageTitle>

      <form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>배송지 정보</SectionTitle>

          <LabelRow>
            <Label>배송지 명</Label>
            <RequiredDot>*</RequiredDot>
          </LabelRow>
          <InputArea>
            <ZipRow>
              <DeliveryNameInput
                placeholder="최대 10자"
                maxLength={10}
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
              />
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                />
                기본 배송지 설정
              </CheckboxLabel>
            </ZipRow>
          </InputArea>

          <LabelRow style={{ marginTop: "20px" }}>
            <Label>받는 분</Label>
            <RequiredDot>*</RequiredDot>
          </LabelRow>
          <InputArea>
            <StyledInput
              placeholder="최대 10자"
              maxLength={10}
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
          </InputArea>

          <LabelRow style={{ marginTop: "20px" }}>
            <Label>연락처</Label>
            <RequiredDot>*</RequiredDot>
          </LabelRow>
          <InputArea>
            <PhoneRow>
              <StyledInput value={phone.p1} readOnly />
              <span>-</span>
              <StyledInput
                maxLength={4}
                value={phone.p2}
                onChange={(e) =>
                  setPhone({ ...phone, p2: e.target.value.replace(/\D/g, "") })
                }
              />
              <span>-</span>
              <StyledInput
                maxLength={4}
                value={phone.p3}
                onChange={(e) =>
                  setPhone({ ...phone, p3: e.target.value.replace(/\D/g, "") })
                }
              />
            </PhoneRow>
          </InputArea>

          <LabelRow style={{ marginTop: "20px" }}>
            <Label>주소</Label>
            <RequiredDot>*</RequiredDot>
          </LabelRow>

          <InputArea>
            <ZipRow>
              <ZipInput
                placeholder="우편번호"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                readOnly // 우편번호는 검색 버튼으로만 입력
              />
              <ZipButton type="button" onClick={handleZipSearch}>
                우편번호
              </ZipButton>
            </ZipRow>

            <AddressBox>
              <AddressText>
                <strong>도로명</strong>{" "}
                {roadAddr || "도로명 주소를 입력해주세요."}
              </AddressText>
            </AddressBox>

            <StyledInput
              placeholder="상세주소 입력"
              value={detailAddr}
              onChange={(e) => setDetailAddr(e.target.value)}
            />
          </InputArea>
        </Section>

        <Section>
          <SectionTitle>배송지 요청사항</SectionTitle>

          <LabelRow>
            <Label>공동현관 출입방법</Label>
            <RequiredDot>*</RequiredDot>
          </LabelRow>

          <InputArea>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  checked={entranceMethod === "password"}
                  onChange={() => handleEntranceChange("password")}
                />
                비밀번호
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  checked={entranceMethod === "security"}
                  onChange={() => handleEntranceChange("security")}
                />
                경비실 호출
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  checked={entranceMethod === "free"}
                  onChange={() => handleEntranceChange("free")}
                />
                자유출입가능
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  checked={entranceMethod === "etc"}
                  onChange={() => handleEntranceChange("etc")}
                />
                기타사항
              </RadioLabel>
            </RadioGroup>

            {entranceMethod !== "free" && (
              <>
                <LabelRow style={{ marginTop: "10px" }}>
                  <Label>{getEntranceLabel()}</Label>
                  <RequiredDot>*</RequiredDot>
                </LabelRow>
                <StyledInput
                  placeholder={getEntrancePlaceholder()}
                  value={entranceDetail}
                  onChange={(e) => setEntranceDetail(e.target.value)}
                />
              </>
            )}
          </InputArea>

          <NoticeWrapper>
            <NoticeTitle>개인정보 수집 이용안내</NoticeTitle>
            <NoticeList>
              <li>개인정보 수집 목적: 상품구매 시 배송처리</li>
              <li>수집 항목: 배송지명, 수령인정보(받는분, 연락처, 주소, 공동현관 출입방법)</li>
              <li>보유 및 이용기간: 정보 삭제 또는 회원 탈퇴 시까지</li>
              <li>확인 버튼을 누르지 않을 경우 배송지 정보가 저장되지 않습니다.</li>
            </NoticeList>

            <CheckboxLabel>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              위 개인정보 수집 및 이용에 동의합니다.
            </CheckboxLabel>
          </NoticeWrapper>
        </Section>

        <ButtonRow>
          <CancelButton type="button" onClick={() => navigate(-1)}>
            취소
          </CancelButton>
          <SubmitButton type="submit">확인</SubmitButton>
        </ButtonRow>
      </form>
    </Container>
  );
};

export default NewDeliveryInfo;