// src/pages/EditMyDelivery.jsx

import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

/* ===========================
    공통 레이아웃 & 스타일
=========================== */
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

  &::placeholder {
    color: #aaa;
  }

  &:read-only {
    background-color: #f6f6f6;
    border-color: #eee;
  }
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

  input {
    width: 16px;
    height: 16px;
  }
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

  input {
    width: 90px;
    text-align: center;
  }
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
  input:checked {
    border-color: #ff7e00;
  }
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

  li {
    font-size: 11px;
    color: #777;
    margin-bottom: 3px;
  }
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

const EditMyDelivery = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // mydelivery에서 navigate("/editdelivery", { state: { address } }) 로 넘겨준 값
  const prev = location.state?.address || {};

  console.log(prev)

  // prev 안에 어떤 키를 쓸지는 네가 실제로 넘기는 데이터 구조에 맞춰야 해
  // 여기서는 예시로 name/label/zip/road/detail/phone/entranceMethod 등을 쓴다고 가정
  const [labelName, setLabelName] = useState(prev.name || ""); // 배송지명
  const [isDefault, setIsDefault] = useState(!!prev.isDefault);  // 기본배송지 여부
  const [receiver, setReceiver] = useState(prev.recipient || "");     // 받는 분

  // 연락처: 예시로 prev.phone 을 "010-1234-5678" 이런 식으로 받는다고 가정
  const fullPhone = prev.phone || "";
  let initialP1 = "010";
  let initialP2 = "";
  let initialP3 = "";

  if (fullPhone.includes("-")) {
    const parts = fullPhone.split("-");
    if (parts[0]) initialP1 = parts[0];
    if (parts[1]) initialP2 = parts[1].replace(/\D/g, "");
    if (parts[2]) initialP3 = parts[2].replace(/\D/g, "");
  }

  const [phone, setPhone] = useState({
    p1: initialP1,
    p2: initialP2,
    p3: initialP3,
  });

  const [zipCode, setZipCode] = useState(prev.zipCode || "");
  const [roadAddr, setRoadAddr] = useState(prev.street || "");
  const [detailAddr, setDetailAddr] = useState(prev.detail || "");

  const [entranceMethod, setEntranceMethod] = useState(prev.entranceAccess || "PASSWORD");
  const [entranceDetail, setEntranceDetail] = useState(prev.entranceDetail   || "");

  const [agree, setAgree] = useState(false); // 수정 시에도 다시 동의 받으려면 false 유지

  const isEmpty = (v) => !v || v.trim() === "";

  const handleEntranceChange = (method) => {
    setEntranceMethod(method);
    if (method === "FREE") {
      setEntranceDetail("");
    }
  };

  const getEntranceLabel = () => {
    switch (entranceMethod) {
      case "PASSWORD":
        return "공동현관 비밀번호";
      case "CALL":
        return "경비실 호출 방법";
      case "OTHER":
        return "기타 상세 내용";
      default:
        return "";
    }
  };

  const getEntrancePlaceholder = () => {
    switch (entranceMethod) {
      case "PASSWORD":
        return "공동현관 비밀번호를 입력해주세요.";
      case "CALL":
        return "경비실 호출 방법을 입력해주세요.";
      case "OTHER":
        return "기타 상세 내용을 입력해주세요.";
      default:
        return "";
    }
  };

  const handleZipSearch = () => {
    alert("우편번호 검색 기능을 연동하세요.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수값 검증
    if (isEmpty(labelName)) {
      alert("배송지 명을 입력해주세요.");
      return;
    }
    if (isEmpty(receiver)) {
      alert("받는 분을 입력해주세요.");
      return;
    }
    if (isEmpty(phone.p2) || isEmpty(phone.p3)) {
      alert("연락처를 모두 입력해주세요.");
      return;
    }
    if (isEmpty(zipCode)) {
      alert("우편번호를 입력해주세요.");
      return;
    }
    if (isEmpty(detailAddr)) {
      alert("상세주소를 입력해주세요.");
      return;
    }
    if (entranceMethod !== "FREE" && isEmpty(entranceDetail)) {
      alert(`${getEntranceLabel()}를 입력해주세요.`);
      return;
    }

    // 여기서 수정된 데이터 서버로 보내거나, 상위 상태 업데이트 등 처리
    const updated = {
      ...prev,
      label: labelName,
      isDefault,
      name: receiver,
      phone: `${phone.p1}-${phone.p2}-${phone.p3}`,
      zip: zipCode,
      road: roadAddr,
      detailAddr,
      entranceMethod,
      entranceDetail,
    };
    console.log("수정된 배송지:", updated);

    alert("배송지가 수정되었습니다.");
    navigate("/mydelivery");
  };

  return (
    <Container>
      <PageTitle>배송지 수정</PageTitle>

      <form onSubmit={handleSubmit}>
        {/* 배송지 정보 */}
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
                  setPhone({
                    ...phone,
                    p2: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
              <span>-</span>
              <StyledInput
                maxLength={4}
                value={phone.p3}
                onChange={(e) =>
                  setPhone({
                    ...phone,
                    p3: e.target.value.replace(/\D/g, ""),
                  })
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

        {/* 배송지 요청사항 */}
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
                  checked={entranceMethod === "PASSWORD"}
                  onChange={() => handleEntranceChange("PASSWORD")}
                />
                비밀번호
              </RadioLabel>

              <RadioLabel>
                <input
                  type="radio"
                  checked={entranceMethod === "CALL"}
                  onChange={() => handleEntranceChange("CALL")}
                />
                경비실 호출
              </RadioLabel>

              <RadioLabel>
                <input
                  type="radio"
                  checked={entranceMethod === "FREE"}
                  onChange={() => handleEntranceChange("FREE")}
                />
                자유출입가능
              </RadioLabel>

              <RadioLabel>
                <input
                  type="radio"
                  checked={entranceMethod === "OTHER"}
                  onChange={() => handleEntranceChange("OTHER")}
                />
                기타사항
              </RadioLabel>
            </RadioGroup>

            {entranceMethod !== "FREE" && (
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
        </Section>

        <ButtonRow>
          <CancelButton type="button" onClick={() => navigate(-1)}>
            취소
          </CancelButton>
          <SubmitButton>확인</SubmitButton>
        </ButtonRow>
      </form>
    </Container>
  );
};

export default EditMyDelivery;
