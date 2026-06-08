# Putting HTML in orbit with canvas

Description: A practical look at the experimental HTML-in-Canvas API using orbital mechanics, three-body controls, and DOM-based HUDs as the test case.

Slug: putting-html-in-orbit-with-canvas

Date: 2026-06-07

Author: Justin Avery

Tags: canvas, WebGL, HTML, orbital mechanics

Social draft: HTML-in-Canvas is a useful bridge for scientific and spatial interfaces: keep the pixels fast, but let labels, controls, search, accessibility, and copy/paste stay in real DOM. I wrote up the pattern with a small orbital mechanics demo.

---

Canvas is where the web goes when the DOM starts to feel too high level. That is why it is such a natural fit for orbital mechanics: thousands of pixels need to move every frame, trails need to fade, bodies need to sweep through curved paths, and a tiny change in velocity can turn a neat orbit into a chaotic three-body experiment.

The problem starts the moment the simulation needs a real interface.

Planet labels should be searchable. A mission panel should use proper form controls. A time slider should be keyboard accessible. A probe readout should be selectable so someone can copy the values into a notebook. You can build all of that by hand in canvas, but then you are rebuilding things the browser already gives you.

That is the interesting promise of the experimental [HTML-in-Canvas API](https://developer.chrome.com/blog/html-in-canvas-origin-trial). Instead of choosing between DOM semantics and canvas performance, you can draw real DOM content into a 2D canvas or a WebGL/WebGPU texture, then keep the DOM node spatially synchronized with the pixels the user sees.

The short version:

- Let canvas do the stars, trails, shader effects, and moving bodies.
- Let HTML do the controls, labels, selection, accessibility, forms, find-in-page, and browser integrations.
- Use the new API to make both layers occupy the same visual space.

As of the Chrome Developers write-up, the feature is experimental and in an origin trial for Chrome 148 through 150. For local testing, the current guidance is Chrome Canary 149 or later with `chrome://flags/#canvas-draw-element` enabled.

## Why orbital mechanics is a good test

A planetary interface is a useful stress test because it has several kinds of UI at once:

- Continuous animation: bodies move every frame.
- Scientific readouts: values change and need to stay legible.
- Direct manipulation: sliders and toggles alter the simulation.
- Spatial labels: annotations need to follow objects through the scene.
- Accessibility pressure: the interface should not become a silent bitmap.

Without HTML-in-Canvas, teams often pick one of two imperfect approaches.

The first is a pure canvas interface. It renders fast, but every text box, slider, tooltip, focus state, hit target, and accessibility node has to be custom. That is a lot of code, and it is easy to end up with an impressive visual tool that is hostile to screen readers, browser search, copy/paste, zoom, translation, and extensions.

The second is a DOM overlay. This keeps the browser features, but the DOM is not really inside the rendered scene. It sits above the canvas. That can be fine for a fixed dashboard, but it becomes awkward when the UI should be part of the world: a label printed on a planet, a panel attached to a satellite, or a telemetry display mapped onto a rotating control surface in a WebGL scene.

HTML-in-Canvas is aimed at the gap between those two approaches.

## Runnable demo

The demo runs today in normal browsers using a DOM overlay fallback. In a browser with the HTML-in-Canvas API enabled, the same control panel can be drawn through the canvas path.

[Open the runnable orbital demo](/demos/html-in-canvas-orbits)

Try changing the star mass, nudging the giant planet, and increasing the time scale. Small changes should cause visible orbital changes, which is exactly the kind of interactive canvas workload where native HTML controls are valuable.

## The core pattern

The API starts by putting DOM inside the canvas element and opting into layout for that subtree:

```html
<canvas id="orbit-canvas" layoutsubtree>
  <form id="orbit-panel">
    <label for="star-mass">Star mass</label>
    <input id="star-mass" type="range" min="0.6" max="2.2" step="0.05" value="1.2">
  </form>
</canvas>
```

The `layoutsubtree` attribute is the important piece. In supporting browsers, the canvas children still participate in layout, hit testing, and accessibility, but their normal rendering is not shown until you draw them into the canvas.

For a 2D canvas, the rendering loop has three jobs:

1. Draw the simulation.
2. Draw the DOM element with `drawElementImage()`.
3. Apply the returned transform to the DOM element so clicks, focus, hover, selection, and accessibility line up with the pixels.

```js
const canvas = document.querySelector("#orbit-canvas");
const ctx = canvas.getContext("2d");
const panel = document.querySelector("#orbit-panel");

canvas.addEventListener("paint", () => {
  ctx.reset();
  drawOrbitScene(ctx);

  const transform = ctx.drawElementImage(panel, 24, 24);
  panel.style.transform = transform.toString();
});
```

The animation loop can stay focused on simulation state:

```js
function frame() {
  stepOrbits();
  canvas.requestPaint();
  requestAnimationFrame(frame);
}
```

That transform sync is not optional. It is what tells the browser where the real DOM node lives after you have painted it into the canvas coordinate system. If the visual position and DOM position drift apart, interaction becomes a lie: the user clicks one place, but the browser thinks the control is somewhere else.

## Make it resilient while the API is experimental

This feature is still early, so the demo uses a small feature check and falls back to a normal overlay when needed:

```js
const supportsHtmlInCanvas =
  typeof ctx.drawElementImage === "function" &&
  typeof canvas.requestPaint === "function";

if (!supportsHtmlInCanvas) {
  panel.classList.add("panel--fallback");
  document.querySelector(".lab").append(panel);
}
```

That fallback is not just politeness. It also keeps the article demo useful in stable browsers while making the upgrade path obvious. You can build the interface once as real HTML, use it as an overlay today, and draw it into canvas when the feature is available.

## The orbital loop

The simulation itself does not need to know whether the controls are an overlay or rendered into the canvas. It just reads normal form values.

Here is the simplified version of the loop from the demo:

```js
function tick(now) {
  const elapsed = Math.min(0.04, (now - lastTime) / 1000);
  const timeScale = Number(timeScaleInput.value);
  lastTime = now;

  for (let i = 0; i < 3; i += 1) {
    stepSimulation(elapsed * timeScale * 0.33);
  }

  updateReadouts();

  if (supportsHtmlInCanvas) {
    canvas.requestPaint();
  } else {
    render();
  }

  requestAnimationFrame(tick);
}
```

That separation is the design win. Physics code stays physics-shaped. UI code stays DOM-shaped. The bridge is the render path.

The gravity step uses a softened Newtonian attraction between each pair of bodies:

```js
function accelerations() {
  const values = bodies.map(() => ({ x: 0, y: 0 }));

  for (let i = 0; i < bodies.length; i += 1) {
    for (let j = i + 1; j < bodies.length; j += 1) {
      const a = bodies[i];
      const b = bodies[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distanceSquared = dx * dx + dy * dy + softening;
      const distance = Math.sqrt(distanceSquared);
      const factor = G / (distanceSquared * distance);

      values[i].x += dx * factor * b.mass;
      values[i].y += dy * factor * b.mass;
      values[j].x -= dx * factor * a.mass;
      values[j].y -= dy * factor * a.mass;
    }
  }

  return values;
}
```

This is not trying to be NASA-grade numerics. It is the kind of small, legible model that belongs in an article demo. For production scientific tools, you would likely use a better integrator, domain-specific units, and tighter error handling. The browser-facing point remains the same: the controls can stay as HTML while the simulation stays in canvas.

## What becomes possible

Once real DOM can be drawn into canvas, the interesting interfaces are the ones where the DOM is not just a floating settings panel.

For planets and orbital mechanics, that might mean:

- A searchable mission manifest drawn onto a spacecraft console.
- Real form controls mapped onto a 3D observatory dashboard.
- Accessible labels attached to moving bodies in a WebGL scene.
- Copyable telemetry readouts inside a shader-distorted glass panel.
- A translatable orbital textbook page rendered onto a 3D book or display.

The important shift is that these are not screenshots of HTML. They are browser-managed elements that can still participate in the wider web platform.

## Taking it into WebGL and Three.js

The 2D API is the easiest way to understand the model, but orbital scenes often end up in WebGL: textured planets, particle fields, post-processing, or WebXR.

At the lower level, the WICG explainer describes WebGL and WebGPU equivalents: `texElementImage2D` for WebGL and `copyElementImageToTexture` for WebGPU.

In Three.js, the experimental support is exposed through `HTMLTexture`, which creates a texture from an HTML element:

```js
const telemetry = document.querySelector("#planet-telemetry");

const texture = new THREE.HTMLTexture(telemetry);
const material = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true,
});

const geometry = new THREE.PlaneGeometry(1.6, 0.9);
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 1.4, -2);
scene.add(mesh);
```

That opens up a cleaner pattern for spatial UI. A planet can have a label plane that uses real HTML. A cockpit display can be a DOM form. An in-scene terminal can support native text selection and copy/paste.

For WebGL and WebGPU, synchronization is more involved than the 2D case because the browser cannot infer where your shader eventually places the texture. You need to provide the transform that maps the element into screen space, then use `canvas.getElementTransform(...)` to compute the CSS transform for hit testing.

Conceptually, the matrix chain is:

```txt
screen-space transform = viewport * model-view-projection * element-normalization
```

That is the part to be careful with in 3D. It is also where a library should eventually hide most of the bookkeeping.

## Practical rules

If you start experimenting with this API, I would keep a few constraints in mind:

- Treat the API as experimental. Keep feature detection and a fallback path.
- Keep canvas children same-origin. Cross-origin embedded content is deliberately constrained for security and privacy.
- Keep DOM elements as direct canvas children when using `drawElementImage()`.
- Do canvas grid sizing properly. Match the backing canvas to the device pixel ratio to avoid blurry text.
- Keep the DOM source authoritative. Do not duplicate state into a custom canvas UI model unless you have to.
- Be selective. A full scrolling document inside canvas may have different performance characteristics from a static HUD or small set of labels.

The best first use case is not "put the whole app inside canvas". It is "stop reimplementing browser UI inside a graphics engine".

## Where I would use it first

For an orbital mechanics tool, I would start with three layers:

1. A canvas or WebGL layer for bodies, trails, fields, and effects.
2. HTML-in-Canvas panels for in-scene controls and telemetry.
3. Normal document HTML for article text, long explanations, tables, and navigation.

That gives you a practical split. The simulation can be visually rich, the controls can stay native, and the page can still behave like the web.

This is what makes HTML-in-Canvas worth watching. It is not just a way to draw prettier buttons into a canvas. It is a way to let complex visual applications keep the parts of the browser that users already rely on.

## Sources

- [Chrome Developers: Introducing the HTML-in-Canvas API origin trial](https://developer.chrome.com/blog/html-in-canvas-origin-trial)
- [WICG HTML-in-Canvas explainer](https://github.com/WICG/html-in-canvas)
- [Three.js HTMLTexture documentation](https://threejs.org/docs/pages/HTMLTexture.html)
