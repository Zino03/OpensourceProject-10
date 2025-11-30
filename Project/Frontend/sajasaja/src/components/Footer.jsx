// Footer.jsx
import React from 'react';
import styled from 'styled-components';

/*
  🔹 Footer 전체 영역 컨테이너
  - 페이지 맨 아래에 위치하는 영역
  - 상하/좌우 여백만 담당하고, 선(border-top)은 여기서 제거!
*/
const FooterContainer = styled.footer`
  padding: 20px 150px;   /* 위아래 20px, 좌우 150px 여백 */
  margin-top: auto;      /* flex 레이아웃에서 푸터를 맨 아래로 밀어내는 용도 */
`;

/*
  🔹 실제 내용이 들어가는 래퍼
  - 가운데 정렬 (max-width 1100px + margin: 0 auto)
  - 여기서부터 선(border-top)을 그려서
    "콘텐츠 영역까지만 선이 보이게" 설정
*/
const ContentWrapper = styled.div`
  max-width: 1100px;     
  margin: 0 auto;        
  overflow-x: hidden;

  /* 🔥 선 길이를 이 영역 너비(max 1100px)로 제한 */
  border-top: 1px solid #eee;

  /* 선과 내용이 딱 붙어 보이지 않도록 위 여백 */
  padding-top: 20px;

  display: flex;
  flex-direction: column;
  gap: 10px;             /* 위아래 요소 간 간격 */
`;

/*
  🔹 로고 영역
  - 로고 이미지 2개(아이콘 + 텍스트)를 좌우로 배치
*/
const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;             /* 로고 이미지들 사이 간격 */
`;

/*
  🔹 이용약관 / 개인정보처리방침 링크 영역
  - 텍스트 링크와 구분용 '|' 를 가로 방향으로 배치
*/
const LinkMenu = styled.div`
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #888;

  /* a 태그 기본 스타일 커스터마이징 */
  a {
    text-decoration: none;  /* 밑줄 제거 */
    color: #888;
    cursor: pointer;

    &:hover {
      color: #555;          /* hover 시 살짝 더 진한 회색 */
    }
  }

  /* '|' 구분선 색상 살짝 연하게 */
  span {
    color: #ddd;
  }
`;

/*
  🔹 하단 설명 문구
  - 작은 글씨
  - 줄 간격 조금 넉넉하게
  - 긴 문장은 줄바꿈 시 단어 단위로 끊기도록 word-break 설정
*/
const Description = styled.p`
  font-size: 12px;
  color: #aaa;
  line-height: 1.6;
  margin: 0;
  word-break: keep-all;  /* 한국어 문장이 단어 단위로 잘리게 */
`;

/*
  🔹 Footer 컴포넌트 본체
  - 로고 영역
  - 약관/개인정보 처리방침 링크
  - 하단 안내 문구
*/
const Footer = () => {
  return (
    <FooterContainer>
      <ContentWrapper>
        {/* 로고 영역 */}
        <LogoArea>
          {/* 
            /public/images/FLogo.png
            /public/images/FLogoText.png
            에 이미지가 있어야 정상적으로 표시됨!
          */}
          <img
            src="/images/FLogo.png"
            alt="SajaSaja Logo"
            style={{ height: 30 }}
          />
          <img
            src="/images/FLogoText.png"
            alt="SajaSaja LogoText"
            style={{ height: 20 }}
          />
        </LogoArea>

        {/* 이용약관 / 개인정보처리방침 링크 */}
        <LinkMenu>
          <a href="/terms">이용약관</a>
          <span>|</span>
          <a href="/privacy">개인정보처리방침</a>
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
