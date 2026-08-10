"use client";

import { useEffect, useRef, type PointerEvent } from "react";

export function CursorReticle() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || !cursor.current) return;

    document.documentElement.classList.add("has-custom-cursor");
    const node = cursor.current;
    let active: HTMLElement | null = null;

    const move = (event: globalThis.PointerEvent) => {
      node.style.setProperty("--cursor-x", `${event.clientX}px`);
      node.style.setProperty("--cursor-y", `${event.clientY}px`);
      const next = (event.target as HTMLElement).closest<HTMLElement>("[data-magnetic]");

      if (active && active !== next) active.style.transform = "";
      active = next;

      if (active) {
        const rect = active.getBoundingClientRect();
        const dx = Math.max(-10, Math.min(10, (event.clientX - rect.left - rect.width / 2) * 0.12));
        const dy = Math.max(-10, Math.min(10, (event.clientY - rect.top - rect.height / 2) * 0.12));
        active.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        node.dataset.state = "active";
        node.dataset.label = active.dataset.cursor ?? "OPEN";
      } else {
        node.dataset.state = "idle";
        node.dataset.label = "";
      }
    };

    const leave = () => {
      node.dataset.state = "hidden";
      if (active) active.style.transform = "";
    };
    const enter = () => {
      node.dataset.state = "idle";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      if (active) active.style.transform = "";
    };
  }, []);

  return <div ref={cursor} className="cursor-reticle" aria-hidden="true" />;
}

export function SignalTrace() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pointer = useRef({ x: -1000, active: false });

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let phase = 0;

    const draw = () => {
      phase += reduced ? 0 : 0.012;
      const points = Array.from({ length: 101 }, (_, index) => {
        const x = index * 10;
        const base = 132 + Math.sin(index * 0.24 + phase) * 13 + Math.sin(index * 0.065) * 18;
        const distance = Math.abs(x - pointer.current.x);
        const influence = pointer.current.active ? Math.exp(-(distance * distance) / 8200) : 0;
        const perturbation = Math.sin(index * 0.72 + phase * 4) * 44 * influence;
        return [x, base + perturbation] as const;
      });

      path.setAttribute(
        "d",
        points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" "),
      );
      if (!reduced) frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  const trackPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((event.clientX - rect.left) / rect.width) * 1000,
      active: true,
    };
  };

  return (
    <div className="signal-shell" data-magnetic data-cursor="SCRUB">
      <div className="signal-readout" aria-hidden="true">
        <span>TRACE / ZH-01</span>
        <span>LIVE</span>
      </div>
      <svg
        ref={svgRef}
        className="signal-trace"
        viewBox="0 0 1000 260"
        role="img"
        aria-label="A live signal trace that responds to pointer movement"
        onPointerMove={trackPointer}
        onPointerLeave={() => { pointer.current.active = false; }}
      >
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="1000" height="260" fill="url(#hero-grid)" className="trace-grid" />
        <line x1="0" y1="132" x2="1000" y2="132" className="trace-axis" />
        <path ref={pathRef} className="trace-line" d="" />
        <g className="trace-markers" aria-hidden="true">
          <circle cx="170" cy="109" r="4" />
          <circle cx="480" cy="126" r="4" />
          <circle cx="815" cy="146" r="4" />
        </g>
      </svg>
      <div className="signal-scale" aria-hidden="true">
        <span>00:00</span><span>MEASURE</span><span>OBSERVE</span><span>RESOLVE</span><span>NOW</span>
      </div>
    </div>
  );
}
