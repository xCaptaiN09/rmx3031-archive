/* A thin SoC with peripheral connectors and cursor-driven signal traces. */
const {
  Cam,
  clamp,
  disposer,
  facing,
  fit,
  flatDot,
  lerp,
  mk,
  open,
  place,
  pointer,
  prism,
  proj,
  put,
  reducedMotion,
  register,
  rings,
  solid,
  spring,
  stepS,
  unproj,
} = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer(),
    scale = 1.92;
  const C = Cam(45, 0.5, scale);
  fit(
    C,
    [
      [-84, -42, 0],
      [84, 42, 0],
      [-42, 84, 0],
      [42, -84, 0],
    ],
    200,
    166,
  );
  const P = proj(C),
    front = facing(C);
  const g = mk("g", {}, svg),
    routes = [],
    pins = [];
  let radius = value,
    over = null;

  // Each side has eight contacts, fanning out to individual board vias.
  for (let side = 0; side < 4; side++)
    for (let i = 0; i < 8; i++) {
      const t = -28 + i * 8;
      const map = (a, b) => (side === 0 ? [a, b] : side === 1 ? [-a, b] : side === 2 ? [b, a] : [b, -a]);
      const points = [
        [52, t],
        [59, t],
        [70, t * 1.5],
        [84, t * 1.5],
      ].map(([a, b]) => P(...map(a, b), 0));
      const lengths = [0];
      for (let k = 1; k < points.length; k++)
        lengths.push(
          lengths[k - 1] + Math.hypot(points[k][0] - points[k - 1][0], points[k][1] - points[k - 1][1]),
        );
      const trace = mk("path", { d: open(points), class: "lo nf" }, g);
      const current = mk("path", { class: "hi nf", "data-current": "" }, g);
      const via = flatDot(g, C, 0.7, "dot off");
      place(via, points.at(-1));
      routes.push({ points, lengths, trace, current, via, sp: spring(0), last: "" });
      const [x, y] = map(43.5, t);
      pins.push(side < 2 ? [x - 8.5, y - 1.8, x + 8.5, y + 1.8] : [x - 1.8, y - 8.5, x + 1.8, y + 8.5]);
    }
  for (const bounds of pins) {
    const [ring, inner] = rings(...bounds, 0.65, 0.5);
    put(solid(g), prism(P, front, ring, inner, 0, 1.8));
  }

  const [baseRing, baseInner] = rings(-36, -36, 36, 36, 2, 0.7);
  put(solid(g), prism(P, front, baseRing, baseInner, 1.5, 3));
  const chip = solid(g);
  const [body, bodyInner] = rings(-35, -35, 35, 35, 2.2, 0.8);
  put(chip, prism(P, front, body, bodyInner, 3, 7));
  const pinOne = flatDot(g, C, 1.2, "dot m");
  place(pinOne, P(-26, -26, 7.2));
  const origin = P(0, 0, 7.2),
    x = P(1, 0, 7.2),
    y = P(0, 1, 7.2);
  mk(
    "g",
    {
      "data-chip-mark": "",
      transform: `matrix(${x[0] - origin[0]} ${x[1] - origin[1]} ${y[0] - origin[0]} ${y[1] - origin[1]} ${origin[0]} ${origin[1]})`,
    },
    g,
  );

  function along(route, distance) {
    const { points, lengths } = route;
    for (let i = 1; i < points.length; i++) {
      if (distance > lengths[i]) continue;
      const t = clamp((distance - lengths[i - 1]) / (lengths[i] - lengths[i - 1]), 0, 1);
      return [lerp(points[i - 1][0], points[i][0], t), lerp(points[i - 1][1], points[i][1], t)];
    }
    return points.at(-1);
  }

  function distance(route, p) {
    let nearest = Infinity;
    for (let i = 1; i < route.points.length; i++) {
      const a = route.points[i - 1],
        b = route.points[i];
      const dx = b[0] - a[0],
        dy = b[1] - a[1];
      const t = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy), 0, 1);
      nearest = Math.min(nearest, Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy));
    }
    return nearest;
  }

  const loop = register(stage, (dt, now) => {
    let moving = false,
      lit = false;
    const still = reducedMotion();
    routes.forEach((route, i) => {
      if (stepS(route.sp, dt)) moving = true;
      const strength = clamp(route.sp.x, 0, 1),
        total = route.lengths.at(-1);
      const head = (still ? 0.62 : (now / 1150 + i * 0.137) % 1) * total;
      const tail = Math.max(0, head - 13 * strength);
      const points = [along(route, tail)];
      for (let j = 1; j < route.lengths.length - 1; j++)
        if (route.lengths[j] > tail && route.lengths[j] < head) points.push(route.points[j]);
      points.push(along(route, head));
      const path = strength > 0.015 ? open(points) : "";
      if (path !== route.last) {
        route.current.setAttribute("d", path);
        route.last = path;
        route.trace.classList.toggle("sil", strength > 0.2);
        route.via.setAttribute("class", strength > 0.5 ? "dot m" : "dot off");
      }
      if (strength > 0.015) lit = true;
    });
    return moving || (lit && !still);
  });
  bag.add(loop.unregister);

  function retarget() {
    const ranked = over
      ? routes.map((route, i) => ({ i, d: distance(route, over) })).sort((a, b) => a.d - b.d)
      : [];
    const onChip =
      over &&
      (() => {
        const [x, y] = unproj(C, over[0], over[1], 7);
        return Math.abs(x) <= 36 && Math.abs(y) <= 36;
      })();
    routes.forEach((route, i) => {
      const rank = ranked.findIndex((entry) => entry.i === i);
      route.sp.t =
        rank >= 0 && rank < 3 ? (onChip ? 0.9 - rank * 0.22 : clamp(1 - ranked[rank].d / radius, 0, 1)) : 0;
    });
    const active = routes.some((route) => route.sp.t > 0);
    chip.sil.classList.toggle("hi", !active);
    read.textContent = active ? `signal ${String(ranked[0].i + 1).padStart(2, "0")}` : "rest";
    loop.wake();
  }

  bag.add(
    pointer(stage, {
      move: (p) => {
        over = p;
        retarget();
      },
      leave: () => {
        over = null;
        retarget();
      },
    }),
  );
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => {
      radius = clamp(v, 18, 48);
      retarget();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "silicon",
  means: "A thin SoC with 32 connectors; signals travel along the circuit traces nearest the pointer.",
  rules: [1, 3, 4, 6, 7, 8, 9],
  range: [18, 32, 48],
  tour: [[275, 126], [200, 150], [120, 213], null],
  mount,
});
