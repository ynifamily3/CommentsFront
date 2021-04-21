import styled from "styled-components";

const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  align-self: center;
  padding-left: 1em;
  padding-right: 1em;
  background-color: #faffd3;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 10vw;
  font-family: "Noto Sans KR", sans-serif;
  text-align: center;
`;

const Description = styled.h2`
  font-family: "Noto Sans KR", sans-serif;
`;

const Ul = styled.ul`
  list-style-type: none;
  padding: 0;
`;
const Li = styled.li`
  font-family: "Noto Sans KR", sans-serif;
  padding: 1em;
`;

function Branding() {
  return (
    <Wrapper>
      <Title>Comments Service</Title>
      <Description>댓글 기능을 통한 양방향 의사소통</Description>
      <Ul>
        <Li>간단명료한 디자인</Li>
        <Li>소셜 로그인 인증</Li>
        <Li>사진 첨부</Li>
        <Li>(예정) 댓글 관리</Li>
      </Ul>
      <Description>데모</Description>
      <a href="/swordmaster/1" title="Comments Service 예제" target="_blank">
        https://roco.moe/swordmaster/1
      </a>
    </Wrapper>
  );
}

export default Branding;
