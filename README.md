# CommentsFront

<p align="left">
  <img src="https://img.shields.io/badge/Maintained%3F-Yes-green?style=for-the-badge">
  <img src="https://img.shields.io/github/license/ynifamily3/CommentsFront?style=for-the-badge">
  <img src="https://img.shields.io/github/stars/ynifamily3/CommentsFront?style=for-the-badge">
  <img src="https://img.shields.io/github/forks/ynifamily3/CommentsFront?color=teal&style=for-the-badge">
  <img src="https://img.shields.io/github/issues/ynifamily3/CommentsFront?color=violet&style=for-the-badge">
</p>

간편한 소셜 로그인으로 누구든지 댓글을 달고 볼 수 있는 서비스입니다.

누구나 `embed`해서 사용 가능할 정도로 사용법이 직관적입니다.

(데모: [https://roco.moe/test/test](https://roco.moe/test/test)) 

# 시스템 구성도
![시스템 구성도](https://user-images.githubusercontent.com/13795765/114708042-dd00b180-9d65-11eb-9fc5-1af7b805bc37.png)


# 기본 사용 방법

```html
<iframe
      src="https://roco.moe/{서비스 이용자 ID}/{자유형식 구분자(게시물 ID 등)}"
      width="100%"
      height="1000px"
      style="display: block; border: none"
    />
```

본인의 홈페이지에 위의 스크립트를 삽입하면 다음과 같은 댓글 창이 표시됩니다.
![image](https://user-images.githubusercontent.com/13795765/112972886-b6e6e900-918b-11eb-887e-c365f925d6c4.png)


네이버 아이디로 로그인 등 소셜 로그인을 진행합니다.

![image](https://user-images.githubusercontent.com/13795765/112972919-bea68d80-918b-11eb-80db-4271f7dd9b1c.png)
![image](https://user-images.githubusercontent.com/13795765/112972939-c36b4180-918b-11eb-830b-711a0b9a33e2.png)
![image](https://user-images.githubusercontent.com/13795765/112972956-c82ff580-918b-11eb-8f05-1bd051795e85.png)


위와 같이 로그인이 되었다면 댓글을 달 수 있습니다.

![image](https://user-images.githubusercontent.com/13795765/112973017-d4b44e00-918b-11eb-9f65-905f19da3ff9.png)

```html
