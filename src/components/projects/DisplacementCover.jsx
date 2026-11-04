"use client";

import { useEffect, useRef } from "react";

/**
 * Displacement hover for a project cover.
 *
 * Hovering the card sweeps a second screenshot of the same product in over
 * the cover. The edge of the sweep is a noise field that spreads outward from
 * the pointer, and the pixels along that edge are pushed sideways by the
 * noise — the classic liquid-displacement transition — with a sliver of RGB
 * split right at the front. While the pointer rests on the card the image
 * keeps a faint, slow wobble under it, so it feels like a surface rather than
 * a picture.
 *
 * Built directly on WebGL1: one full-screen triangle pair, two textures and a
 * fragment shader. A library for this would weigh more than the effect.
 *
 * Cost discipline, because this sits on the home page:
 *
 *  - Nothing exists until the first hover. No canvas, no context, no image
 *    requests. A touch visitor, or anyone who never points at a project,
 *    pays nothing at all.
 *  - The textures are next/image renditions sized to the canvas, not the
 *    original PNGs.
 *  - The render loop runs only while something is moving and stops the
 *    moment the transition settles back to rest.
 *  - Fine pointers only, never under reduced motion, and if WebGL is missing
 *    the static cover is simply all there is.
 *
 * The static `next/image` cover always stays underneath. The canvas is only
 * visible while the effect is in progress, so the page never depends on it.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uRes;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform vec2 uMouse;
uniform float uProgress;
uniform float uHover;
uniform float uTime;

/* object-fit: cover, anchored to the top — what the static cover does. */
vec2 cover(vec2 uv, vec2 size) {
  float rs = uRes.x / uRes.y;
  float ri = size.x / size.y;
  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  vec2 o = rs > ri ? vec2(0.0) : vec2((1.0 - s.x) * 0.5, 0.0);
  return uv * s + o;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float a = 0.5;
  float r = 0.0;
  for (int i = 0; i < 4; i++) {
    r += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return r;
}

void main() {
  /* Image space: origin at the top-left, like the DOM. */
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  float aspect = uRes.x / uRes.y;

  float d = distance(vec2(uv.x * aspect, uv.y), vec2(uMouse.x * aspect, uMouse.y));
  float n = fbm(uv * 3.2 + vec2(uTime * 0.05, -uTime * 0.035));

  /* The sweep: a noisy front travelling out from the pointer as progress
     rises. The constants are solved, not tuned by eye: the noise term spans
     ±0.3, so at progress 0 the largest t is 0 (nothing of B shows), and at
     progress 1 the smallest t — the far corner of a 16:10 frame, d ≈ 1.89 —
     is 0.31, past the 0.3-wide band (nothing of A is left). */
  float t = uProgress * 2.8 - d - (n - 0.5) * 0.6 - 0.3;
  float mask = smoothstep(0.0, 0.3, t);
  float edge = mask * (1.0 - mask) * 4.0;

  /* Displacement: strong along the front, faint under a resting pointer. */
  float lens = (1.0 - smoothstep(0.0, 0.5, d)) * uHover;
  vec2 push = vec2(n - 0.5, fract(n * 7.13) - 0.5);
  vec2 offset = push * (0.16 * edge + 0.018 * lens);

  vec4 a = texture2D(uA, cover(uv + offset, uSizeA));
  vec2 ub = cover(uv - offset, uSizeB);
  float split = 0.006 * edge;
  vec4 b = vec4(
    texture2D(uB, ub + vec2(split, 0.0)).r,
    texture2D(uB, ub).g,
    texture2D(uB, ub - vec2(split, 0.0)).b,
    1.0
  );

  gl_FragColor = mix(a, b, mask);
}`;

/* next/image's default device sizes; the texture asks for the smallest that
   covers the canvas, so it is sharp without being the 700KB original. */
const WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048];
const optimised = (src, needed) => {
  const w = WIDTHS.find((width) => width >= needed) ?? WIDTHS.at(-1);
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
};

const damp = (rate, dt) => 1 - Math.exp(-rate * dt);

export function DisplacementCover({ src, hoverSrc, children }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !src || !hoverSrc) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* The card's stretched link sits on top of the cover, so pointer events
       are taken from the whole card and mapped into the cover's box. */
    const host = wrap.closest("[data-displace-host]") ?? wrap;

    let gl = null;
    let canvas = null;
    let uniforms = null;
    let ready = false;
    let raf = 0;
    let last = 0;
    let resizeObserver = null;
    const textures = [];
    const s = { progress: 0, hover: 0, mx: 0.5, my: 0.5, time: 0 };
    const target = { hover: 0, mx: 0.5, my: 0.5 };

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };

    const size = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
    };

    const loadTexture = (url, unit, sizeUniform) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          const texture = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.uniform2f(sizeUniform, image.naturalWidth, image.naturalHeight);
          textures.push(texture);
          resolve();
        };
        image.onerror = reject;
        image.src = url;
      });

    const init = () => {
      canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.className =
        "pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-0";
      gl = canvas.getContext("webgl", { antialias: false, alpha: false });
      if (!gl) return false;

      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return false;
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const aPos = gl.getAttribLocation(program, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      uniforms = Object.fromEntries(
        ["uA", "uB", "uRes", "uSizeA", "uSizeB", "uMouse", "uProgress", "uHover", "uTime"].map(
          (name) => [name, gl.getUniformLocation(program, name)],
        ),
      );
      gl.uniform1i(uniforms.uA, 0);
      gl.uniform1i(uniforms.uB, 1);

      wrap.appendChild(canvas);
      size();
      resizeObserver = new ResizeObserver(size);
      resizeObserver.observe(wrap);

      const needed = canvas.width;
      Promise.all([
        loadTexture(optimised(src, needed), 0, uniforms.uSizeA),
        loadTexture(optimised(hoverSrc, needed), 1, uniforms.uSizeB),
      ])
        .then(() => {
          ready = true;
          kick();
        })
        .catch(() => {});
      return true;
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      s.hover += (target.hover - s.hover) * damp(6, dt);
      /* Slow in, quicker out: the sweep is the effect, so it takes ~1.2s to
         cross the frame; letting go should not make anyone wait. */
      s.progress += (target.hover - s.progress) * damp(target.hover ? 1.5 : 2.6, dt);
      s.mx += (target.mx - s.mx) * damp(10, dt);
      s.my += (target.my - s.my) * damp(10, dt);
      s.time += dt;

      gl.uniform2f(uniforms.uMouse, s.mx, s.my);
      gl.uniform1f(uniforms.uProgress, s.progress);
      gl.uniform1f(uniforms.uHover, s.hover);
      gl.uniform1f(uniforms.uTime, s.time);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      /* Shown only while it differs from the static cover underneath. */
      canvas.style.opacity = s.progress > 0.002 || target.hover ? "1" : "0";

      const settled =
        !target.hover && s.progress < 0.002 && s.hover < 0.002;
      raf = settled ? 0 : requestAnimationFrame(frame);
    };

    const kick = () => {
      if (raf || !ready) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const toLocal = (event) => {
      const rect = wrap.getBoundingClientRect();
      target.mx = (event.clientX - rect.left) / rect.width;
      target.my = (event.clientY - rect.top) / rect.height;
    };

    let failed = false;
    const onEnter = (event) => {
      if (failed) return;
      if (!gl && !init()) {
        failed = true;
        canvas?.remove();
        return;
      }
      toLocal(event);
      s.mx = target.mx;
      s.my = target.my;
      target.hover = 1;
      kick();
    };
    const onMove = (event) => {
      if (!gl) return;
      toLocal(event);
      kick();
    };
    const onLeave = () => {
      target.hover = 0;
      kick();
    };

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      if (gl) {
        for (const texture of textures) gl.deleteTexture(texture);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
      canvas?.remove();
    };
  }, [src, hoverSrc]);

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-md">
      {children}
    </div>
  );
}
