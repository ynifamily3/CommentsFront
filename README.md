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

# Source Comment

- Redux Thunk를 모의 구현하고자, 다음과 같이 액션을 받고 액션을 연쇄 실행 해 주는 Thunk 훅 정의

```tsx
export function useReducerWithThunk<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>
): [ReducerState<R>, DispatcherThunk<R>] {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getState = useCallback(() => state, [state]);
  const dispatchThunk = (action: ActionOrThunk<R>): void => {
    return isDispatchThunk(action)
      ? action(dispatch, getState)
      : dispatch(action);
  };
  return [state, dispatchThunk];
}
```

# 기본 사용 방법

본인의 사이트에 다음 태그를 삽입해 주시면 됩니다.

```html
<!-- 댓글 창을 표시할 부분에 다음 태그를 설치해 주세요. -->
<div id="comments-service-roco-iframe"></div>
<script type="text/javascript">
  var comments_service_roco_service_name = "본인의 서비스 이름";
  var comments_service_roco_sequence = "시퀀스 넘버";
</script>
<script type="text/javascript" src="https://roco.moe/comments.js"></script>
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

```
