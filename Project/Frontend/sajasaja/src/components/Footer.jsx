// Footer.jsx
import React from 'react';
import styled from 'styled-components';

/*
  🔹 Footer 전체 영역 컨테이너
  - 페이지 맨 아래에 위치하는 영역
  - 상하/좌우 여백만 담당하고, 선(border-top)은 여기서 제거!
*/
const FooterContainer = styled.footer`
  padding: 0 200px;   /* 위아래 20px, 좌우 여백 */
  margin-top: auto;      /* flex 레이아웃에서 푸터를 맨 아래로 밀어내는 용도 */
`;

/*
  🔹 선만 담당하는 래퍼
  - 이 컴포넌트의 width를 조절하면 "선 길이만" 따로 조정 가능
  - 예) width: 100%;      → 화면 전체 너비만큼 선
       width: 1200px;     → 가운데 정렬된 1200px짜리 선
*/
const LineWrapper = styled.div`
  width: 100%;               /* 선 길이 조정하는 곳 (예: 1200px, 900px 등) */
  margin: 0 auto 10px;       /* 가운데 정렬 + 아래로 10px 간격 */
  border-top: 1px solid #e0e0e0;
`;

/*
  🔹 실제 내용이 들어가는 래퍼
  - 여기서는 선(border-top)을 제거해서,
    선 길이와 내용 너비를 서로 독립적으로 조정할 수 있게 함
*/
const ContentWrapper = styled.div`
  width: 100%;
  max-width: 950px;
  margin: 0 auto;        
  overflow-x: hidden;

  /* 🔥 이제 여기에는 border-top 없음! */
  /* padding-top 도 선 대신 LineWrapper에서 margin-bottom으로 처리 */

  display: flex;
  flex-direction: column;
  gap: 8px;             /* 위아래 요소 간 간격 */
`;

/*
  로고 영역
  - 로고 이미지 2개(아이콘 + 텍스트)를 좌우로 배치
*/
const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;             /* 로고 이미지들 사이 간격 */
`;

const LinkMenu = styled.div`
  display: flex;
  gap: 15px;
  font-size: 11px;
  color: #888;
  font-weight: 500;

  /* a 태그 기본 스타일 커스터마이징 */
  a {
    text-decoration: none;  /* 밑줄 제거 */
    color: #888;
    cursor: pointer;

    &:hover {
      color: #555;          /* hover 시 살짝 더 진한 회색 */
    }
  }
`;

/*
  🔹 하단 설명 문구
  - 작은 글씨
  - 줄 간격 조금 넉넉하게
  - 긴 문장은 줄바꿈 시 단어 단위로 끊기도록 word-break 설정
*/
const Description = styled.p`
  font-size: 10.5px;
  color: #aaa;
  line-height: 1.6;
  margin: 0;
  word-break: keep-all;  /* 한국어 문장이 단어 단위로 잘리게 */
`;

/*
  🔹 Footer 컴포넌트 본체
  - 로고 영역
  - 약관 링크
  - 하단 안내 문구
*/
const Footer = () => {
  return (
    <FooterContainer>
      {/* ✅ 선만 따로 그리는 영역
          👉 위에서 설정한 LineWrapper width로 선 길이만 조절할 수 있음 */}
      <LineWrapper />

      <ContentWrapper>
        {/* 로고 영역 */}
        <LogoArea>
          <img
            src="/images/FLogo.png"
            alt="SajaSaja Logo"
            style={{ height: 25 }}
          />
          <img
            src="/images/FLogoText.png"
            alt="SajaSaja LogoText"
            style={{ height: 15 }}
          />
        </LogoArea>

        {/* 이용약관 링크 */}
        <LinkMenu>
          <a href="/terms">이용약관</a>
        </LinkMenu>

        {/* 하단 안내 문구 */}
        <Description>
          ‘사자사자’는 통신판매중개자로서 통신판매의 당사자가 아니며, 입점업체가 등록한 상품,
          상품정보 및 거래에 대하여 ‘사자사자’는 일체 책임을 지지 않습니다.
        </Description>
      </ContentWrapper>
    </FooterContainer>
  );
};

export default Footer;
