import axios, { CancelToken } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { CombinedStatus } from "../entity/hooks/useApi";
import { ApiStatus } from "../entity/repo/ApiResponse";

const cancelToken = axios.CancelToken;

function useApi<ApiResultType, Payload>(
  repoFunc: (
    payload: Payload,
    cancelToken: CancelToken
  ) => Promise<ApiResultType>
) {
  const _repoFunc = useRef(repoFunc);
  const _payload = useRef<Payload>();
  const [flag, setFlag] = useState(-1);
  const [statusData, setStatusData] = useState<CombinedStatus<ApiResultType>>({
    status: ApiStatus.IDLE,
    data: null,
  });

  useEffect(() => {
    const source = cancelToken.source();
    if (flag === -1) {
      return;
    }

    setStatusData((statusData) => {
      return { status: ApiStatus.PENDING, data: statusData.data };
    });

    (async () => {
      if (_payload.current) {
        try {
          const data = await _repoFunc.current(_payload.current, source.token);
          setStatusData({
            status: ApiStatus.SUCCESS,
            data,
          });
        } catch (error) {
          setStatusData({
            status: ApiStatus.FAILURE,
            data: null,
          });
          console.log(error);
        }
      } else {
        console.warn("payload 없음.");
      }
    })();

    return () => {
      // 컴포넌트 detach시 접속 종료
      source.cancel();
    };
  }, [flag, _payload, _repoFunc]);

  const call = useCallback((newPayload: Payload) => {
    _payload.current = newPayload;
    setFlag((r) => (r + 1) % 2);
  }, []);

  const status = statusData.status;
  const data = statusData.data;
  return { call, status, data };
}

export { useApi };
