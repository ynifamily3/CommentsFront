import { getOrigin } from "./getOrigin";

function sendMessageTo3rdService(message: any) {
  const origin = getOrigin();
  if (origin) window.parent.postMessage(message, origin);
}

export { sendMessageTo3rdService };
