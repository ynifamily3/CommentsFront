(function () {
  const target = document.getElementById("comments-service-roco");
  function hnd({ data, origin, source }) {
    if (origin !== "https://roco.moe") return;
    const iframe = document.getElementById("comments-service-roco-iframe");
    if ("height" in data) {
      iframe.style.height = `${data.height}px`;
    }
  }
  window.addEventListener("message", hnd, false);
  target.innerHTML = `<iframe
  src="https://roco.moe/swordmaster/1?origin=${window.encodeURIComponent(
    window.origin
  )}"
  width="100%"
  height="100px"
  style="display: block; border: none"
  id="comments-service-roco-iframe"
></iframe>`;
})();
