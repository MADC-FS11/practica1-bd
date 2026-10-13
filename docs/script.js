(() => {
  "use strict";

  const config = window.MALU_CONFIG || {};
  const links = [
    ["repo-equipo", config.repositorioEquipo, "Ver repositorio"],
    ["repo-fork", config.forkAsignado, "Ver mi fork"]
  ];
  let configured = 0;
  links.forEach(([id, value, label]) => {
    const link = document.getElementById(id);
    try {
      const url = new URL(value);
      const segments = url.pathname.split("/").filter(Boolean);
      if (url.protocol !== "https:" || url.hostname !== "github.com" ||
          url.username || url.password || segments.length !== 2) return;
      link.href = url.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-disabled");
      link.replaceChildren(document.createTextNode(`${label} ↗`));
      configured += 1;
    } catch (_) {
      // Los enlaces se habilitan únicamente cuando se configuran URLs reales.
    }
  });
  document.getElementById("config-notice").hidden = configured === 2;

  const tablist = document.querySelector(".model-tabs");
  const tabs = Array.from(tablist.querySelectorAll("[role=tab]"));
  function selectTab(tab, focus = false) {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.getAttribute("aria-controls"));
      panel.hidden = !active;
      panel.setAttribute("role", "tabpanel");
      panel.tabIndex = 0;
    });
    if (focus) tab.focus();
  }
  tablist.hidden = false;
  tabs.forEach((tab) => tab.addEventListener("click", () => selectTab(tab)));
  tablist.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next], true);
    }
  });
  selectTab(tabs[0]);

  const dialog = document.getElementById("visor");
  const viewerImage = document.getElementById("visor-imagen");
  const scroller = dialog.querySelector(".viewer-scroll");
  const zoomOutput = document.getElementById("zoom-value");
  const zoomIn = document.getElementById("zoom-in");
  const zoomOut = document.getElementById("zoom-out");
  let zoom = 100;
  let returnFocus = null;
  let previousOverflow = "";
  function resizeImage() {
    viewerImage.style.width = `${Math.max(1, scroller.clientWidth) * zoom / 100}px`;
    viewerImage.style.height = "auto";
    zoomOutput.value = `${zoom} %`;
    zoomOut.disabled = zoom <= 100;
    zoomIn.disabled = zoom >= 400;
  }
  function changeZoom(amount) {
    zoom = Math.max(100, Math.min(400, zoom + amount));
    resizeImage();
  }
  document.querySelectorAll("[data-diagram]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (typeof dialog.showModal !== "function" || event.ctrlKey || event.metaKey ||
          event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      returnFocus = link;
      const original = link.querySelector("img");
      viewerImage.src = link.href;
      viewerImage.alt = original.alt;
      viewerImage.width = original.width;
      viewerImage.height = original.height;
      document.getElementById("visor-original").href = link.href;
      document.getElementById("visor-titulo").textContent = link.dataset.diagram === "eer"
        ? "Modelo EER" : "Diagrama relacional";
      zoom = 100;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
      scroller.scrollTo(0, 0);
      resizeImage();
      document.getElementById("cerrar-visor").focus();
    });
  });
  zoomIn.addEventListener("click", () => changeZoom(50));
  zoomOut.addEventListener("click", () => changeZoom(-50));
  document.getElementById("cerrar-visor").addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "+" || event.key === "=") { event.preventDefault(); changeZoom(50); }
    if (event.key === "-") { event.preventDefault(); changeZoom(-50); }
  });
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    if (returnFocus) returnFocus.focus();
  });
  window.addEventListener("resize", () => { if (dialog.open) resizeImage(); });
})();
