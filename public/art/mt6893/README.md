# MT6893 illustration

`silicon.js` is the authored Hairline figure. `index.html` mounts it in an isolated,
lazy-loaded frame; the host sets the archive palette. The figure has no external
requests, perpetual animation or runtime package dependencies.

The geometry depicts a thin SoC with 32 peripheral connectors and individual
circuit traces. Up to three nearby traces carry moving signal segments in response
to the pointer. The package stays fixed. Signals settle on pointer leave; the loop
sleeps at rest and offscreen. Reduced motion uses static highlights.

The host adds the requested `MEDIATEK` / `MT6893` top-face marking to
the figure's projected anchor.
This product label is separate from Hairline's text-free geometry preview.

`kernel.js` is the unchanged MIT-licensed engine from
[lucasmarkes/hairline](https://github.com/lucasmarkes/hairline/tree/main/skills/hairline-create).
Its embedded SHA-256 is checked by the upstream validator. Keep the engine and
`LICENSE` together. Do not format or modify the engine.

Build and validate a standalone preview with the upstream Hairline skill's
`build.mjs`, `validate.mjs` and `look.mjs`, passing `silicon.js` as the figure.
Use `--answer 300,126 --edge 100,215` for the visual check. The answering pose
contains intentional continuous signal motion while the pointer is present.

The archive includes only the illustration, without the skill's preview controls.
