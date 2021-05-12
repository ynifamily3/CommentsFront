(function () {
  console.log("안녕하세요 !");
  const target = document.getElementById("comments-service-roco");
  function getSaved3rdAuth() {
    try {
      return JSON.parse(
        window.localStorage.getItem("comments-service-roco-auth")
      );
    } catch (e) {
      console.log("comments-service:", e);
      window.localStorage.removeItem("comments-service-roco-auth");
      return null;
    }
  }

  function persist3rdAuth(auth) {
    try {
      return JSON.parse(
        window.localStorage.setItem(
          "comments-service-roco-auth",
          JSON.stringify(auth)
        )
      );
    } catch (e) {
      console.log("comments-service:", e);
      window.localStorage.removeItem("comments-service-roco-auth");
      return null;
    }
  }

  function hnd({ data, origin, source }) {
    console.log("클라이언트(3rd)가 메시지를 수신받음.", data, origin);
    const allowedOrigin = [
      "http://localhost:3000",
      "http://localhost:8081",
      "https://roco.moe",
      "https://auth.roco.moe",
    ];
    if (!allowedOrigin.includes(origin)) {
      return;
    }
    const iframe = document.getElementById("comments-service-roco-iframe");
    // 높이 조정 명령
    if ("height" in data) {
      console.log("높이 조정 명령");
      iframe.style.height = `${data.height}px`;
    }
    // persist 3rd auth state 명령
    if ("auth" in data) {
      console.log("persist 3rd auth state 명령");
      persist3rdAuth(data.auth);
    }
    // request 3rd auth state 명령
    if ("requestAuth" in data && data.requestAuth === true) {
      console.log("request 3rd auth state 명령", "전송해 줍니다.");
      source.postMessage(
        { type: "persistedAuth", payload: getSaved3rdAuth() },
        origin
      );
    }
  }
  window.addEventListener("message", hnd, false);
  target.innerHTML = `<iframe
  src="https://roco.moe/${window["comments_service_roco_service_name"]}/${
    window["comments_service_roco_sequence"]
  }?origin=${window.encodeURIComponent(window.origin)}"
  width="100%"
  height="100px"
  style="display: block; border: none"
  id="comments-service-roco-iframe"
></iframe>`;
})();
