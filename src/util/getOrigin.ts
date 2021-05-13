function getOrigin() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramsGet = urlParams.get("origin");
  if (!paramsGet) return null;
  const origin = window.decodeURIComponent(paramsGet);
  return origin;
}

export { getOrigin };
