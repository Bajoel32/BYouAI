"use client";

import { useEffect, useRef } from "react";

/**
 * A single oscilloscope beam: a glowing dot that sweeps right-to-left across
 * whatever band it's placed in, bobbing up and down and leaving a fading
 * phosphor trail. Fully fluid — amplitude, trail length and stroke weight all
 * scale to the container, so it fits any width/height it's given. Pauses when
 * offscreen or the tab is hidden; renders one frozen sweep when the user
 * prefers reduced motion.
 */
export function ScopeBackdrop({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ACCENT = "0, 196, 140";
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(v, hi));

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let x = 0; // beam x — decreases (right → left)
    let trailMax = 68; // points kept in the phosphor trail (scales with width)
    let weight = 1; // stroke/glow weight (scales with height)
    const trail: Array<{ x: number; y: number }> = [];
    const SPEED = 0.3; // widths per second

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Keep the trail's on-screen length and the stroke weight proportional to
      // the box, so the beam looks the same in a thin strip or a tall panel.
      trailMax = Math.round(clamp(w * 0.11, 40, 160));
      weight = clamp(h / 96, 0.7, 2.4);
      if (trail.length > trailMax) trail.splice(0, trail.length - trailMax);
    };

    // Vertical position of the beam — sharp triangle waves so the trail reads
    // as a jagged zig-zag. Centered in the box with amplitude a fixed fraction
    // of its height, so it fills whatever band it's dropped into.
    const tri = (u: number) => 2 * Math.abs(2 * (u - Math.floor(u + 0.5))) - 1;
    const yAt = (px: number, t: number) => {
      const centerY = h * 0.5;
      const amp = h * 0.34;
      const u = px / w;
      const a = tri(u * 6 + t * 0.55); // main zig-zag
      const b = tri(u * 17 - t * 0.9) * 0.35; // finer jitter
      return centerY + (a * 0.8 + b) * amp;
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      if (trail.length < 2) return;

      const tail = trail[0];
      const head = trail[trail.length - 1];

      const grad = ctx.createLinearGradient(tail.x, 0, head.x, 0);
      grad.addColorStop(0, `rgba(${ACCENT}, 0)`);
      grad.addColorStop(1, `rgba(${ACCENT}, 0.85)`);

      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
      ctx.miterLimit = 2;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5 * weight;
      ctx.shadowColor = `rgb(${ACCENT})`;
      ctx.shadowBlur = 4 * weight;
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
      ctx.stroke();

      // Bright head + halo.
      ctx.shadowBlur = 16 * weight;
      ctx.fillStyle = `rgb(${ACCENT})`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2.8 * weight, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(${ACCENT}, 0.22)`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 7 * weight, 0, Math.PI * 2);
      ctx.fill();
    };

    const step = (ms: number) => {
      if (!last) last = ms;
      const dt = Math.min((ms - last) / 1000, 0.05);
      last = ms;

      x -= SPEED * w * dt;
      if (x <= -6) {
        x = w + 6;
        trail.length = 0; // new sweep — don't streak back across
      }
      trail.push({ x, y: yAt(x, ms / 1000) });
      if (trail.length > trailMax) trail.shift();

      render();
    };

    const loop = (ms: number) => {
      step(ms);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const frozen = () => {
      trail.length = 0;
      const span = Math.max(2, trailMax);
      for (let i = 0; i < span; i++) {
        const px = (w * i) / (span - 1);
        trail.push({ x: px, y: yAt(px, 2) });
      }
      render();
    };

    resize();
    x = w + 6;

    const cleanups: Array<() => void> = [];
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) frozen();
    });
    ro.observe(canvas);
    cleanups.push(() => ro.disconnect());

    if (reduce) {
      frozen();
    } else {
      const io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0 },
      );
      io.observe(canvas);
      const onVisibility = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVisibility);
      cleanups.push(() => {
        stop();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
