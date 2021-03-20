import {
  Reducer,
  ReducerAction,
  ReducerState,
  useCallback,
  useReducer,
} from "react";

// 현 state를 get 하는 함수
export type StateGetter<A extends Reducer<any, any>> = () => ReducerState<A>;

// (dispatch, state) => void 전형적인 리듀서 함수
export type DispatchThunk<A extends Reducer<any, any>> = (
  dispatch: (value: ReducerAction<A>) => void,
  state: StateGetter<A>
) => void;

// (action) => void 액션을 받고 내부적으로 액션을 실행하는(?) 디스패처
export type DispatcherThunk<A extends Reducer<any, any>> = (
  action: ReducerAction<A> | DispatchThunk<A>
) => void;

export type ActionOrThunk<A extends Reducer<any, any>> =
  | ReducerAction<A>
  | DispatchThunk<A>;

function isDispatchThunk<R extends Reducer<any, any>>(
  action: ReducerAction<R> | DispatchThunk<R>
): action is DispatchThunk<R> {
  return typeof action === "function";
}

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
