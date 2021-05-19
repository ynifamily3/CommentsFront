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

(데모: [https://roco.moe/swordmaster/1](https://roco.moe/swordmaster/1))

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
<div id="comments-service-roco"></div>
<script type="text/javascript">
  var comments_service_roco_service_name = "본인의 서비스 이름";
  var comments_service_roco_sequence = "시퀀스 넘버";
</script>
<script type="text/javascript" src="https://roco.moe/comments.js"></script>
```

본인의 홈페이지에 위의 스크립트를 삽입하면 그 위치에 댓글 창이 표시됩니다.

# 의존 그래프

- https://github.com/pahen/madge

```bash
 madge ./src/index.tsx -i ~/Pictures/test.png
```

![의존 그래프](https://user-images.githubusercontent.com/13795765/118137940-bb681800-b440-11eb-9463-418b8158c1c0.png)

# 리소스

- [Google Fonts](https://fonts.google.com/specimen/Noto+Sans+KR)
- [XEIcon](https://xpressengine.github.io/XEIcon/library-2.3.3.html)
