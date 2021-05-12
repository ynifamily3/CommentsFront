import { useEffect, useState } from "react";
import { AuthState } from "../entity/AuthType";
import { sendMessageTo3rdService } from "../util/postMessage";

function useSavedAuth() {
  const [status, setStatus] = useState<
    "IDLE" | "PENDING" | "RESOLVED" | "REJECTED"
  >("IDLE");
  const [auth, setAuth] = useState<AuthState>({
    authMethod: null,
    authValue: null,
  });
  useEffect(() => {
    // iFrame내의(자사 서비스) 저장데이터
    try {
      const storageData = window.localStorage.getItem(
        "comments-service-roco-auth"
      );
      if (!storageData) {
        // 3rd 사이트의 localStorage의 값을 가져오라고 '명령'한다.
        setStatus("PENDING");
        sendMessageTo3rdService({
          requestAuth: true,
        });
      } else {
        setStatus("RESOLVED");
        setAuth(JSON.parse(storageData));
      }
    } catch (e) {
      setStatus("PENDING");
      sendMessageTo3rdService({
        requestAuth: true,
      });
    }
  }, []);

  // 3rd 서비스가 요청한 값을 가져왔을 경우
  useEffect(() => {
    function receiveMessage(
      event: MessageEvent<{ type: string; payload: AuthState }>
    ) {
      if (status === "IDLE") {
        return;
      }
      // 허용 리스트
      const allowedOrigin = [
        "http://localhost:3000",
        "http://localhost:8081",
        "http://roco.moe",
        "https://auth.roco.moe",
      ];
      if (!allowedOrigin.includes(event.origin)) {
        return;
      }
      if (event.data.type === "persistedAuth") {
        // 성공적으로 전달받음.
        console.log("성공적으로 전달받음.");
        setStatus("RESOLVED");
        setAuth(event.data.payload);
      }
    }
    window.addEventListener("message", receiveMessage, false);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [status]);
  return { status, auth };
}

export { useSavedAuth };
