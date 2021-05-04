import { useLayoutEffect } from "react";

function useSendHeight(deps: React.DependencyList | undefined) {
  useLayoutEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramsGet = urlParams.get("origin");
    if (!paramsGet) return;
    const origin = window.decodeURIComponent(paramsGet);
    window.parent.postMessage(
      { height: window.document.body.scrollHeight + 12 },
      origin
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useSendHeight;
