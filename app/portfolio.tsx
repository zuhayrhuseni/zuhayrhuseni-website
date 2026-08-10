"use client";

/* eslint-disable @next/next/no-img-element -- local company marks are tiny, dimensioned, and vinext has no image optimizer */

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  coursework,
  education,
  experiences,
  identity,
  metrics,
  paypal,
  project,
  selectedWork,
  skillGroups,
} from "./content";

function useReducedMotion() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function SignalRule({ label }: { label: string }) {
  return (
    <div className="signal-rule" aria-hidden="true">
      <svg viewBox="0 0 1200 34" preserveAspectRatio="none">
        <path d="M0 17 H300 L316 6 L332 28 L348 13 L365 17 H1200" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

function SectionHeader({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <header className="section-header reveal">
      <p className="section-index">{index} / {label}</p>
      <h2>{title}</h2>
    </header>
  );
}

function CountMetric({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const node = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = node.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      element.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    let tween: { kill: () => void } | null = null;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        const { default: gsap } = await import("gsap");
        const counter = { value: 0 };
        tween = gsap.to(counter, {
          value,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
          },
        });
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [prefix, suffix, value]);

  return <span ref={node}>{prefix}0{suffix}</span>;
}

function BrandMark({ logo, alt, monogram }: { logo?: string; alt?: string; monogram?: string }) {
  if (logo) return <img className="brand-mark" src={logo} alt={alt ?? ""} width="72" height="72" />;
  return <span className="brand-monogram" aria-label={alt}>{monogram}</span>;
}

function ArchitectureFigure() {
  return (
    <figure className="architecture-stage reveal" aria-labelledby="architecture-caption">
      <div className="architecture-figure instrument-card">
        <div className="figure-topline">
          <span>SAR PIPELINE / SYSTEM VIEW</span>
          <span className="status-light">AUTHENTICATED</span>
        </div>
        <div className="architecture-grid">
          <div className="arch-column sources" data-arch="source">
            <span className="arch-label">Sources</span>
            <div className="arch-node">Transaction</div>
            <div className="arch-node">Account</div>
            <div className="arch-node">Payment</div>
          </div>
          <div className="arch-flow" data-arch="flow"><span>encrypted</span></div>
          <div className="arch-boundary" data-arch="service">
            <span className="arch-label">Spring Boot / GCP</span>
            <div className="arch-node emphasis">Ingest service</div>
            <div className="arch-node">Case service</div>
            <div className="arch-auth">S2S auth boundary</div>
          </div>
          <div className="arch-flow" data-arch="flow"><span>policy</span></div>
          <div className="arch-column rules" data-arch="rules">
            <span className="arch-label">Rule branches</span>
            <div className="arch-node">Jurisdiction A</div>
            <div className="arch-node">Jurisdiction B</div>
            <div className="arch-node">Jurisdiction C</div>
          </div>
        </div>
        <div className="architecture-legend">
          <span><i className="legend-encrypted" /> encrypted data</span>
          <span><i className="legend-auth" /> service authentication</span>
          <span><i className="legend-rule" /> regulatory rule</span>
        </div>
      </div>
      <figcaption id="architecture-caption">
        FIG 01 / Transaction, account, and payment records cross an encrypted service boundary before jurisdiction-specific SAR rules branch downstream.
      </figcaption>
    </figure>
  );
}

function ExperienceTabs() {
  const [activeId, setActiveId] = useState(experiences[0].id);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const active = experiences.find((experience) => experience.id === activeId) ?? experiences[0];

  const selectByIndex = (index: number) => {
    const safeIndex = (index + experiences.length) % experiences.length;
    setActiveId(experiences[safeIndex].id);
    buttons.current[safeIndex]?.focus();
  };

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectByIndex(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectByIndex(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectByIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectByIndex(experiences.length - 1);
    }
  };

  return (
    <div className="experience-console reveal">
      <div className="tab-list" role="tablist" aria-label="Career history">
        {experiences.map((experience, index) => (
          <button
            key={experience.id}
            ref={(node) => { buttons.current[index] = node; }}
            id={`tab-${experience.id}`}
            role="tab"
            aria-selected={activeId === experience.id}
            aria-controls={`panel-${experience.id}`}
            tabIndex={activeId === experience.id ? 0 : -1}
            onClick={() => setActiveId(experience.id)}
            onKeyDown={(event) => handleKey(event, index)}
            data-magnetic
            data-cursor="VIEW"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {experience.company}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={active.id}
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="experience-panel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="experience-meta">
            <a href={active.url} target="_blank" rel="noreferrer" data-magnetic data-cursor="VISIT" aria-label={`Visit ${active.company}`}>
              <BrandMark logo={active.logo} alt={active.logoAlt ?? active.company} monogram={active.monogram} />
            </a>
            <p>{active.period}</p>
            <p>{active.location}</p>
            {active.status === "needs-details" && <span className="needs-detail">Input needed</span>}
          </div>
          <div className="experience-copy">
            <p className="company-line">
              <a href={active.url} target="_blank" rel="noreferrer">{active.company} ↗</a>
            </p>
            <h3>{active.role}</h3>
            <p className="experience-summary">{active.summary}</p>
            <ul>
              {active.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
            <div className="inline-stack" aria-label="Tools used">
              {active.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}

function CliFigure() {
  const [mode, setMode] = useState<"before" | "after">("after");
  return (
    <figure className="instrument-card cli-figure reveal" aria-labelledby="cli-caption">
      <div className="figure-topline">
        <span>TEST DATA / REQUEST PATH</span>
        <div className="segment-control" aria-label="Compare test-data provisioning" role="group">
          {(["before", "after"] as const).map((item) => (
            <button key={item} aria-pressed={mode === item} onClick={() => setMode(item)} data-magnetic data-cursor="SWITCH">
              {item}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className={`cli-state ${mode}`}
          initial={{ opacity: 0, x: mode === "after" ? 15 : -15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: mode === "after" ? -15 : 15 }}
          transition={{ duration: 0.2 }}
        >
          {mode === "before" ? (
            <>
              <div className="time-axis"><span>DAY 0</span><span>DAY 2</span><span>DAY 4+</span></div>
              <div className="team-lane"><span>Engineer</span><i /><b>request</b></div>
              <div className="team-lane"><span>Platform team</span><i /><b>handoff</b></div>
              <div className="team-lane"><span>Data team</span><i /><b>setup</b></div>
            </>
          ) : (
            <>
              <div className="terminal-line"><span>$</span> testdata create --cards 2 --bank US --identity custom</div>
              <div className="provision-flow">
                <span>request</span><i /><span>synthetic profile</span><i /><span>ready</span>
              </div>
              <div className="after-time">&lt; 3 MIN <small>typical workflow</small></div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <figcaption id="cli-caption">FIG 02 / A multi-team provisioning request becomes one authenticated command and a usable end-to-end test profile.</figcaption>
    </figure>
  );
}

function AgentTopology() {
  return (
    <figure className="instrument-card topology-figure reveal" aria-labelledby="topology-caption">
      <div className="figure-topline"><span>AGENT HARNESS / AUTH TOPOLOGY</span><span>ORG-WIDE</span></div>
      <div className="topology-grid">
        <div className="topology-input">
          <div>Claude Code</div>
          <div>Claude Desktop</div>
        </div>
        <div className="topology-link" aria-hidden="true" />
        <div className="harness-node">
          <strong>Agent harness</strong>
          <span>tokenization</span>
          <span>service auth</span>
        </div>
        <div className="topology-link" aria-hidden="true" />
        <div className="topology-output">
          <div>MCP / debug</div>
          <div>MCP / code</div>
          <div>MCP / workflow</div>
        </div>
      </div>
      <figcaption id="topology-caption">FIG 03 / A shared tokenization and authentication layer gives two agent clients controlled access to protected internal MCP services.</figcaption>
    </figure>
  );
}

function NetworkPlot() {
  const [sample, setSample] = useState<{ x: number; y: number } | null>({ x: 490, y: 112 });
  const firstTrace = useRef<SVGPathElement>(null);
  const traces = useMemo(() => [
    { name: "A", color: "trace-a", d: "M45 142 C95 130 115 77 164 92 S232 159 290 117 S371 62 430 83 S518 150 575 101 S672 59 725 88 S806 148 875 72" },
    { name: "B", color: "trace-b", d: "M45 122 C105 91 140 139 190 113 S278 59 325 96 S402 153 470 111 S559 74 613 116 S716 147 768 108 S836 83 875 99" },
    { name: "C", color: "trace-c", d: "M45 159 C105 147 138 114 196 137 S294 175 346 125 S444 96 507 137 S605 164 659 119 S758 91 810 130 S851 146 875 125" },
    { name: "D", color: "trace-d", d: "M45 98 C89 115 133 49 183 75 S280 130 334 82 S432 56 480 92 S573 119 633 75 S724 49 782 77 S846 112 875 56" },
  ], []);

  const moveSample = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(875, Math.max(45, ((event.clientX - rect.left) / rect.width) * 920));
    const path = firstTrace.current;
    if (!path) return;
    const point = path.getPointAtLength(((x - 45) / 830) * path.getTotalLength());
    setSample({ x: point.x, y: point.y });
  };

  const nudgeSample = (event: KeyboardEvent<HTMLElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const x = event.key === "Home"
      ? 45
      : event.key === "End"
        ? 875
        : Math.min(875, Math.max(45, (sample?.x ?? 490) + (event.key === "ArrowRight" ? 28 : -28)));
    const path = firstTrace.current;
    if (!path) return;
    const point = path.getPointAtLength(((x - 45) / 830) * path.getTotalLength());
    setSample({ x: point.x, y: point.y });
  };

  return (
    <figure className="instrument-card network-figure reveal" aria-labelledby="network-caption" data-magnetic data-cursor="SCRUB">
      <div className="figure-topline"><span>5G / NORMALIZED THROUGHPUT</span><span>4 INTERFACES</span></div>
      <div
        className="plot-interaction"
        role="slider"
        tabIndex={0}
        aria-label="Sample the normalized 5G throughput plot"
        aria-valuemin={0}
        aria-valuemax={60}
        aria-valuenow={Math.round((((sample?.x ?? 45) - 45) / 830) * 60)}
        aria-valuetext={`Run ${Math.round((((sample?.x ?? 45) - 45) / 830) * 60)}`}
        onKeyDown={nudgeSample}
        onPointerMove={moveSample}
      >
      <svg viewBox="0 0 920 240" role="img" aria-label="Normalized throughput traces for four 5G open-air interfaces">
        <defs>
          <pattern id="plot-grid" width="55" height="36" patternUnits="userSpaceOnUse">
            <path d="M 55 0 L 0 0 0 36" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect x="45" y="24" width="830" height="180" fill="url(#plot-grid)" className="plot-grid" />
        <line x1="45" y1="204" x2="875" y2="204" className="plot-axis" />
        <line x1="45" y1="24" x2="45" y2="204" className="plot-axis" />
        {traces.map((trace, index) => <path ref={index === 0 ? firstTrace : undefined} key={trace.name} d={trace.d} className={`plot-line ${trace.color}`} />)}
        {sample && (
          <g className="plot-sample" aria-hidden="true">
            <line x1={sample.x} y1="24" x2={sample.x} y2="204" />
            <rect x={Math.min(sample.x + 10, 750)} y={Math.max(30, sample.y - 44)} width="116" height="34" />
            <text x={Math.min(sample.x + 20, 760)} y={Math.max(51, sample.y - 23)}>RUN {Math.round(((sample.x - 45) / 830) * 60).toString().padStart(2, "0")}</text>
            <rect className="plot-sample-point" x={sample.x - 5} y={sample.y - 5} width="10" height="10" />
          </g>
        )}
        <g className="plot-labels">
          <text x="8" y="31">HIGH</text><text x="14" y="207">LOW</text>
          <text x="45" y="228">RUN 00</text><text x="815" y="228">RUN 60</text>
        </g>
      </svg>
      </div>
      <div className="plot-legend">
        {traces.map((trace) => <span key={trace.name}><i className={trace.color} />Interface {trace.name}</span>)}
      </div>
      <figcaption id="network-caption">FIG 04 / Four normalized interface traces show the live comparison method; exact benchmark values were not supplied and are intentionally not invented here.</figcaption>
    </figure>
  );
}

const queryStages = [
  ["INGEST", "Scrapers", "multi-source"],
  ["STORE", "SQLite", "normalized"],
  ["QUERY", "Plain language", "request"],
  ["OPTIMIZE", "SQL", "generated"],
  ["RESULTS", "Listings", "ranked"],
] as const;

function QueryPipeline() {
  const [active, setActive] = useState(2);

  const scrub = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = Math.min(queryStages.length - 1, Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * queryStages.length)));
    setActive(next);
  };

  return (
    <div className="query-pipeline" onPointerMove={scrub}>
      <div className="query-stages" aria-label="Housing search data pipeline">
        {queryStages.map(([label, title, detail], index) => (
          <button key={label} type="button" aria-pressed={active === index} onFocus={() => setActive(index)} onClick={() => setActive(index)}>
            <span>{label}</span><strong>{title}</strong><small>{detail}</small>
          </button>
        ))}
      </div>
      <div className="query-route" aria-hidden="true"><i style={{ width: `${((active + 0.5) / queryStages.length) * 100}%` }} /></div>
      <div className="query-capabilities" aria-label="Project capabilities">
        <span>Authentication</span><span>Favorites</span><span>Comparisons</span><span>Commute-time visualization</span>
      </div>
    </div>
  );
}

function StackMatrix() {
  const [active, setActive] = useState(skillGroups[0].id);
  const group = skillGroups.find((item) => item.id === active) ?? skillGroups[0];
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next += 1;
    else if (event.key === "ArrowLeft") next -= 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = skillGroups.length - 1;
    else return;
    event.preventDefault();
    next = (next + skillGroups.length) % skillGroups.length;
    setActive(skillGroups[next].id);
    buttons.current[next]?.focus();
  };

  return (
    <div className="stack-console instrument-card reveal">
      <div className="figure-topline"><span>STACK MATRIX / ACTIVE SET</span><span>{group.skills.length.toString().padStart(2, "0")} ITEMS</span></div>
      <div className="stack-tabs" role="tablist" aria-label="Technical skill groups">
        {skillGroups.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => { buttons.current[index] = node; }}
            role="tab"
            id={`stack-tab-${item.id}`}
            aria-controls={`stack-panel-${item.id}`}
            aria-selected={active === item.id}
            tabIndex={active === item.id ? 0 : -1}
            onClick={() => setActive(item.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            data-magnetic
            data-cursor="FILTER"
          >{item.label}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={group.id}
          id={`stack-panel-${group.id}`}
          className="stack-panel"
          role="tabpanel"
          aria-labelledby={`stack-tab-${group.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          {group.skills.map((skill, index) => (
            <div className="stack-row" key={skill}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{skill}</strong>
              <i style={{ width: `${52 + ((index * 17) % 43)}%` }} aria-hidden="true" />
              <small>ACTIVE</small>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      <p className="stack-caption">FIG 05 / Tools are grouped by the work they support, not ranked by an invented proficiency score. Bars are register marks, not ratings.</p>
    </div>
  );
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${identity.email}`;
    }
  };

  return (
    <button className="copy-email" onClick={copy} data-magnetic data-cursor="COPY">
      <span>{identity.email}</span>
      <b aria-live="polite">{copied ? "COPIED" : "COPY"}</b>
    </button>
  );
}

export function Portfolio() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false;
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    const raf = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(raf);
    };

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      frame = requestAnimationFrame(raf);
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void start(), { timeout: 1200 })
      : window.setTimeout(() => void start(), 0);

    return () => {
      cancelled = true;
      if (window.requestIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false;
    let cleanup = () => {};

    const start = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
      gsap.fromTo(
        ".signal-shell",
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out" },
      );

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(element, { y: 26, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<SVGPathElement>(".plot-line").forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: { trigger: ".network-figure", start: "top 78%", once: true },
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".architecture-stage",
            start: "top top",
            end: "+=1150",
            pin: ".architecture-figure",
            scrub: 0.7,
          },
        });
        const nodes = gsap.utils.toArray<HTMLElement>("[data-arch]");
        gsap.set(nodes, { opacity: 0.22, y: 10 });
        timeline.to(nodes, { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 });
      });
      });
      cleanup = () => context.revert();
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void start(), { timeout: 900 })
      : window.setTimeout(() => void start(), 0);

    return () => {
      cancelled = true;
      if (window.requestIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup();
    };
  }, [reducedMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <SignalRule label="TRACE / 01" />

        <section className="section now-section" id="now" aria-labelledby="now-title">
          <SectionHeader index="01" label="NOW" title="Secure data paths for global compliance." />
          <div className="now-grid reveal">
            <div className="now-company">
              <a href={paypal.url} target="_blank" rel="noreferrer" data-magnetic data-cursor="VISIT">
                <BrandMark logo={paypal.logo} alt="PayPal" />
              </a>
              <p>{paypal.period}<br />{paypal.location}</p>
            </div>
            <div className="now-copy">
              <p className="company-line"><a href={paypal.url} target="_blank" rel="noreferrer">{paypal.company} ↗</a></p>
              <h3>{paypal.role}</h3>
              <p>{paypal.summary}</p>
              <ul>{paypal.work.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
          <ArchitectureFigure />
        </section>

        <SignalRule label="TRACE / 02" />

        <section className="section" id="experience" aria-labelledby="experience-title">
          <SectionHeader index="02" label="EXPERIENCE" title="Work across the stack, close to the consequence." />
          <ExperienceTabs />
        </section>

        <section className="metric-band" aria-label="Measured outcomes">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric reveal">
              <strong><CountMetric value={metric.value} prefix={metric.prefix} suffix={metric.suffix} /></strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </section>

        <SignalRule label="TRACE / 03" />

        <section className="section work-section" id="work" aria-labelledby="work-title">
          <SectionHeader index="03" label="SELECTED WORK" title="Tools that shorten the distance to an answer." />
          <article className="work-intro reveal">
            <p>03.1 / INTERNAL DEVELOPER TOOLING</p>
            <div><h3>{selectedWork.cli.title}</h3><p>{selectedWork.cli.body}</p></div>
          </article>
          <CliFigure />
          <article className="work-intro reveal">
            <p>03.2 / AGENT INFRASTRUCTURE</p>
            <div><h3>{selectedWork.harness.title}</h3><p>{selectedWork.harness.body}</p></div>
          </article>
          <AgentTopology />
          <article className="work-intro reveal">
            <p>03.3 / NETWORK RESEARCH</p>
            <div><h3>{selectedWork.network.title}</h3><p>{selectedWork.network.body}</p></div>
          </article>
          <NetworkPlot />
        </section>

        <section className="section project-section" id="project" aria-labelledby="project-title">
          <SectionHeader index="04" label="PROJECT" title="A common query layer for fragmented housing data." />
          <article className="project-card reveal">
            <div className="project-topline"><span>{project.period}</span><a href={project.url} target="_blank" rel="noreferrer" data-magnetic data-cursor="GITHUB">OPEN REPOSITORIES ↗</a></div>
            <div className="project-main">
              <div><p>ONESTOP / 01</p><h3 id="project-title">{project.name}</h3></div>
              <div><strong>{project.thesis}</strong><p>{project.description}</p></div>
            </div>
            <QueryPipeline />
            <div className="inline-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          </article>
        </section>

        <section className="section education-section" id="education" aria-labelledby="education-title">
          <SectionHeader index="05" label="EDUCATION" title="Systems foundations, now extended into machine learning." />
          <div className="education-grid">
            {education.map((item, index) => (
              <a key={item.school} className="education-card reveal" href={item.url} target="_blank" rel="noreferrer" data-magnetic data-cursor="VISIT">
                <div className="education-logo"><img src={item.logo} alt="" width="180" height="50" /></div>
                <span>0{index + 1}</span>
                <h3>{item.school}</h3>
                <p>{item.degree}</p>
                <p>{item.period}</p>
                <small>{item.detail}</small>
              </a>
            ))}
          </div>
          <div className="coursework reveal">
            <p>COURSEWORK / SELECTED</p>
            <div>{coursework.map((course, index) => <span key={course}><i>{String(index + 1).padStart(2, "0")}</i>{course}</span>)}</div>
          </div>
        </section>

        <SignalRule label="TRACE / 06" />

        <section className="section stack-section" id="stack" aria-labelledby="stack-title">
          <SectionHeader index="06" label="STACK" title="The active tool register." />
          <StackMatrix />
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-grid-overlay" aria-hidden="true" />
          <p className="section-index">07 / CONTACT</p>
          <h2 id="contact-title">Have a difficult system?<br />Let&apos;s find the signal<span className="signal-period">.</span></h2>
          <CopyEmailButton />
          <div className="contact-links">
            <a href={identity.linkedin} target="_blank" rel="noreferrer" data-magnetic data-cursor="OPEN">LinkedIn ↗</a>
            <a href={identity.github} target="_blank" rel="noreferrer" data-magnetic data-cursor="OPEN">GitHub ↗</a>
            <a href={identity.resume} download data-magnetic data-cursor="PDF">Resume PDF ↓</a>
            <a href={`tel:${identity.phone.replace(/[^+\d]/g, "")}`} data-magnetic data-cursor="CALL">{identity.phone}</a>
          </div>
          <footer><span>ZUHAYR HUSENI / SOFTWARE ENGINEER</span><span>SAN FRANCISCO BAY AREA / 2026</span></footer>
        </section>
    </MotionConfig>
  );
}
