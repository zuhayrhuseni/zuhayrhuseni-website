"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

const signalModes = [
  { label: "Build", detail: "Turn ambiguous requirements into working systems." },
  { label: "Observe", detail: "Make behavior visible through traces, logs, and tests." },
  { label: "Adapt", detail: "Learn the domain, follow the evidence, and revise quickly." },
  { label: "Ship", detail: "Deliver reliable tools that shorten the path to an answer." },
] as const;

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
        const dx = Math.max(-8, Math.min(8, (event.clientX - rect.left - rect.width / 2) * 0.1));
        const dy = Math.max(-8, Math.min(8, (event.clientY - rect.top - rect.height / 2) * 0.1));
        active.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        node.dataset.state = "active";
        node.dataset.label = active.dataset.cursor ?? "OPEN";
      } else {
        node.dataset.state = "idle";
        node.dataset.label = "";
      }
    };

    const hide = () => {
      node.dataset.state = "hidden";
      if (active) active.style.transform = "";
    };

    const show = () => {
      node.dataset.state = "idle";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      if (active) active.style.transform = "";
    };
  }, []);

  return <div ref={cursor} className="cursor-reticle" aria-hidden="true" />;
}

export function SignalTrace() {
  const pathRef = useRef<SVGPathElement>(null);
  const sampleRef = useRef<SVGGElement>(null);
  const pointer = useRef({ x: 375, active: false });
  const [mode, setMode] = useState(1);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let phase = 0;

    const draw = () => {
      phase += reduced ? 0 : 0.01;
      const points = Array.from({ length: 101 }, (_, index) => {
        const x = index * 10;
        const base = 128 + Math.sin(index * 0.2 + phase) * 18 + Math.sin(index * 0.057) * 15;
        const distance = Math.abs(x - pointer.current.x);
        const influence = pointer.current.active ? Math.exp(-(distance * distance) / 10000) : 0;
        const response = Math.sin(index * 0.65 + phase * 3) * 30 * influence;
        return [x, base + response] as const;
      });

      path.setAttribute("d", points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" "));

      const sample = sampleRef.current;
      if (sample) {
        const point = path.getPointAtLength((pointer.current.x / 1000) * path.getTotalLength());
        sample.style.transform = `translate(${point.x}px, ${point.y}px)`;
      }

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  const setPosition = (x: number, active = true) => {
    const safeX = Math.min(992, Math.max(8, x));
    pointer.current = { x: safeX, active };
    setMode(Math.min(signalModes.length - 1, Math.floor((safeX / 1000) * signalModes.length)));
  };

  const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition(((event.clientX - rect.left) / rect.width) * 1000);
  };

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? signalModes.length - 1
        : Math.min(signalModes.length - 1, Math.max(0, mode + (event.key === "ArrowRight" ? 1 : -1)));
    setPosition(((next + 0.5) / signalModes.length) * 1000);
  };

  return (
    <div className="signal-shell" data-magnetic data-cursor="EXPLORE">
      <div className="signal-readout">
        <span>SYSTEM PRACTICE / 04 MODES</span>
        <span>MODE / {signalModes[mode].label.toUpperCase()}</span>
      </div>
      <div
        className="signal-viewport"
        role="slider"
        tabIndex={0}
        aria-label="Explore Zuhayr's engineering approach"
        aria-valuemin={1}
        aria-valuemax={signalModes.length}
        aria-valuenow={mode + 1}
        aria-valuetext={`${signalModes[mode].label}: ${signalModes[mode].detail}`}
        onPointerMove={trackPointer}
        onPointerEnter={trackPointer}
        onPointerLeave={() => { pointer.current.active = false; }}
        onKeyDown={handleKey}
      >
        <svg className="signal-trace" viewBox="0 0 1000 260" role="img" aria-label="An interactive signal representing build, observe, adapt, and ship">
          <defs>
            <pattern id="hero-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="1000" height="260" fill="url(#hero-grid)" className="trace-grid" />
          <line x1="0" y1="128" x2="1000" y2="128" className="trace-axis" />
          <path ref={pathRef} className="trace-line" d="" />
          <g ref={sampleRef} className="trace-sample" aria-hidden="true">
            <line x1="0" y1="-125" x2="0" y2="125" />
            <circle r="6" />
          </g>
        </svg>
      </div>
      <div className="signal-mode-copy" aria-live="polite">
        <strong>{signalModes[mode].label}</strong>
        <span>{signalModes[mode].detail}</span>
      </div>
      <div className="signal-scale" aria-hidden="true">
        {signalModes.map((item, index) => <span key={item.label} data-active={mode === index ? "true" : "false"}>{item.label}</span>)}
      </div>
    </div>
  );
}
