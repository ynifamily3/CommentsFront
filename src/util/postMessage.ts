function sendMessageTo3rdService(message: any) {
  const urlParams = new URLSearchParams(window.location.search);
  const paramsGet = urlParams.get("origin");
  if (!paramsGet) return;
  const origin = window.decodeURIComponent(paramsGet);
  window.parent.postMessage(message, origin);
}

export { sendMessageTo3rdService };
