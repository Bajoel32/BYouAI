"use client";

import { useEffect, useRef } from "react";

/**
 * A single oscilloscope beam: a glowing dot that sweeps right-to-left in the
 * band just under the navbar, bobbing up and down and leaving a fading
 * phosphor trail. Pauses when offscreen or the tab is hidden; renders one
 * frozen sweep when the user prefers reduced motion.
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

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let x = 0; // beam x — decreases (right → left)
    const trail: Array<{ x: number; y: number }> = [];
    const TRAIL = 68;
    const SPEED = 0.3; // widths per second

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Vertical position of the beam — sharp triangle waves so the trail reads
    // as a jagged zig-zag, sitting just under the navbar.
    const tri = (u: number) => 2 * Math.abs(2 * (u - Math.floor(u + 0.5))) - 1;
    const yAt = (px: number, t: number) => {
      const centerY = Math.min(h * 0.62, 88);
      const amp = Math.min(h * 0.16, 20);
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
      ctx.lineWidth = 1.5;
      ctx.shadowColor = `rgb(${ACCENT})`;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
      ctx.stroke();

      // Bright head + halo.
      ctx.shadowBlur = 16;
      ctx.fillStyle = `rgb(${ACCENT})`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(${ACCENT}, 0.22)`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 7, 0, Math.PI * 2);
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
      if (trail.length > TRAIL) trail.shift();

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
      for (let i = 0; i < TRAIL; i++) {
        const px = w * 0.06 + (w * 0.62 * i) / TRAIL;
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
