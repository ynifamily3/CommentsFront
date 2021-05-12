function sendMessageTo3rdService(message: any) {
  const urlParams = new URLSearchParams(window.location.search);
  const paramsGet = urlParams.get("origin");
  if (!paramsGet) return;
  const origin = window.decodeURIComponent(paramsGet);
  console.log(origin, "에게 메시지를 보냅니다.", message);
  window.parent.postMessage(message, origin);
  console.log(origin, "에게 메시지를 보냈습니다.");
}

export { sendMessageTo3rdService };
