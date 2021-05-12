import { useLayoutEffect } from "react";
import { sendMessageTo3rdService } from "../util/postMessage";

// deps 변동시마다 높이값을 계산해서 서드파티에 보낸다.
function useSendHeight(deps: React.DependencyList | undefined) {
  useLayoutEffect(() => {
    sendMessageTo3rdService({ height: window.document.body.scrollHeight + 12 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useSendHeight;
