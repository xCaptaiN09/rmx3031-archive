/* Keep Hairline's engine isolated from the React page and mount one figure. */
window.hairline = (figure) => {
  const stage = document.getElementById("stage");
  if (!stage) throw new Error("Hairline silicon: #stage is missing.");
  HL.inject(document);
  stage.setAttribute("data-hairline", figure.name);
  const svg = HL.mk(
    "svg",
    { viewBox: "0 0 400 320", "aria-hidden": "true" },
    stage,
  );
  const read = { textContent: "rest" };
  const handle = figure.mount({ stage, svg, read }, figure.range[1]);
  const mark = svg.querySelector("[data-chip-mark]");
  if (mark) {
    HL.mk("text", { x: 0, y: -9, class: "chip-maker" }, mark).textContent =
      "MEDIATEK";
    HL.mk("text", { x: 0, y: 5, class: "chip-name" }, mark).textContent =
      "MT6893";
  }
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) handle.destroy();
  });
};
