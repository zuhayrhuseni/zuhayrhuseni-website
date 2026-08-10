"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

const railSections = [
  ["01", "now", "Now"],
  ["02", "experience", "Experience"],
  ["03", "work", "Selected work"],
  ["04", "project", "Project"],
  ["05", "education", "Education"],
  ["06", "stack", "Stack"],
  ["07", "contact", "Contact"],
] as const;

export function ScrollRail() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("now");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: [0, 0.1, 0.35] },
    );
    railSections.forEach(([, id]) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <aside className="scroll-rail" aria-label="Page sections">
      <span className="scroll-percent">{Math.round(progress).toString().padStart(2, "0")}%</span>
      <div className="scroll-track" aria-hidden="true"><i style={{ height: `${progress}%` }} /></div>
      <ol>
        {railSections.map(([index, id, label]) => (
          <li key={id} data-active={active === id ? "true" : "false"}>
            <a href={`#${id}`} aria-label={`Go to ${label}`}><span>{index}</span></a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

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
  const sampleRef = useRef<SVGGElement>(null);
  const sampleTextRef = useRef<SVGTextElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
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
    const x = Math.min(992, Math.max(8, ((event.clientX - rect.left) / rect.width) * 1000));
    pointer.current = { x, active: true };
    const path = pathRef.current;
    const sample = sampleRef.current;
    if (path && sample) {
      const point = path.getPointAtLength((x / 1000) * path.getTotalLength());
      sample.style.opacity = "1";
      sample.style.transform = `translate(${point.x}px, ${point.y}px)`;
      if (sampleTextRef.current) sampleTextRef.current.textContent = `${Math.round(point.y * 3.2)} ms`;
      if (liveRef.current) liveRef.current.textContent = `SAMPLE / X ${Math.round(x).toString().padStart(4, "0")}`;
    }
  };

  const stopTracking = () => {
    pointer.current.active = false;
    if (sampleRef.current) sampleRef.current.style.opacity = "0";
    if (liveRef.current) liveRef.current.textContent = "LIVE / MOVE TO SAMPLE";
  };

  return (
    <div className="signal-shell" data-magnetic data-cursor="SCRUB">
      <div className="signal-readout" aria-hidden="true">
        <span>TRACE / ZH-01</span>
        <span ref={liveRef}>LIVE / MOVE TO SAMPLE</span>
      </div>
      <svg
        ref={svgRef}
        className="signal-trace"
        viewBox="0 0 1000 260"
        role="img"
        aria-label="A live signal trace that responds to pointer movement"
        onPointerMove={trackPointer}
        onPointerLeave={stopTracking}
      >
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="1000" height="260" fill="url(#hero-grid)" className="trace-grid" />
        <line x1="0" y1="132" x2="1000" y2="132" className="trace-axis" />
        <path ref={pathRef} className="trace-line" d="" />
        <g ref={sampleRef} className="trace-sample" aria-hidden="true">
          <line x1="0" y1="-145" x2="0" y2="125" />
          <rect x="11" y="-37" width="94" height="28" />
          <text ref={sampleTextRef} x="20" y="-19">000 ms</text>
          <rect className="trace-sample-point" x="-5" y="-5" width="10" height="10" />
        </g>
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
