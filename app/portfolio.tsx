"use client";

/* eslint-disable @next/next/no-img-element -- local company marks are small, fixed-size assets */

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  about,
  education,
  experiences,
  identity,
  project,
  type Experience,
  type ExperienceHighlight,
} from "./content";

const reveal = {
  initial: false,
};

function SectionTitle({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <motion.header className="section-header" {...reveal}>
      <p className="section-index">{index} / {label}</p>
      <h2>{title}</h2>
    </motion.header>
  );
}

function BrandMark({ experience }: { experience: Experience }) {
  if (experience.logo) {
    return <img className="brand-mark" src={experience.logo} alt={experience.logoAlt ?? experience.company} width="56" height="56" />;
  }
  return <span className="brand-monogram" aria-label={experience.company}>{experience.monogram}</span>;
}

function RoleDiagram({ company, highlight }: { company: string; highlight: ExperienceHighlight }) {
  return (
    <div className="role-diagram" aria-label={`${highlight.title} workflow`}>
      <div className="diagram-topline">
        <span>{company} / {highlight.title}</span>
        <span>HOVER OR FOCUS A WORK ITEM</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={highlight.id}
          className="diagram-flow"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {highlight.diagram.map((step, index) => (
            <div className="diagram-step-wrap" key={step}>
              <div className="diagram-step">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </div>
              {index < highlight.diagram.length - 1 && <i className="diagram-connector" aria-hidden="true" />}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      <p className="diagram-note">{highlight.outcome ?? "A simplified system view based on the work described above; no production data is shown."}</p>
    </div>
  );
}

function ExperienceSection() {
  const [activeRole, setActiveRole] = useState(0);
  const [activeHighlight, setActiveHighlight] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const experience = experiences[activeRole];
  const highlight = experience.highlights[Math.min(activeHighlight, experience.highlights.length - 1)];

  const selectRole = (index: number, focus = false) => {
    const next = (index + experiences.length) % experiences.length;
    setActiveRole(next);
    setActiveHighlight(0);
    if (focus) tabRefs.current[next]?.focus();
  };

  const handleRoleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectRole(index + 1, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectRole(index - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectRole(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      selectRole(experiences.length - 1, true);
    }
  };

  return (
    <section className="section experience-section" id="experience" aria-labelledby="experience-title">
      <SectionTitle index="02" label="EXPERIENCE" title="Experience." />
      <motion.div className="role-tabs" role="tablist" aria-label="Professional experience" {...reveal}>
        {experiences.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => { tabRefs.current[index] = node; }}
            id={`role-tab-${item.id}`}
            role="tab"
            aria-selected={activeRole === index}
            aria-controls={`role-panel-${item.id}`}
            tabIndex={activeRole === index ? 0 : -1}
            onClick={() => selectRole(index)}
            onKeyDown={(event) => handleRoleKey(event, index)}
            data-magnetic
            data-cursor="VIEW"
          >
            <BrandMark experience={item} />
            <span>{item.company}</span>
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.article
          key={experience.id}
          className="role-panel"
          id={`role-panel-${experience.id}`}
          role="tabpanel"
          aria-labelledby={`role-tab-${experience.id}`}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24 }}
        >
          <header className="role-heading">
            <a href={experience.url} target="_blank" rel="noreferrer" className="role-company-mark" data-magnetic data-cursor="VISIT">
              <BrandMark experience={experience} />
            </a>
            <div>
              <h3>{experience.role}</h3>
              <p>{experience.period} <span>·</span> {experience.location}</p>
            </div>
          </header>
          <p className="role-summary">{experience.summary}</p>

          <div className="work-ledger" aria-label={`${experience.company} work highlights`}>
            <div className="ledger-head"><span>Work</span><span>Tools used here</span></div>
            {experience.highlights.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="work-row"
                aria-pressed={activeHighlight === index}
                onClick={() => setActiveHighlight(index)}
                onFocus={() => setActiveHighlight(index)}
                onPointerEnter={() => setActiveHighlight(index)}
              >
                <span className="work-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="work-copy">
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                  {item.outcome && <em>{item.outcome}</em>}
                </span>
                <span className="work-tools">
                  {item.tools.map((tool) => <span key={tool}>{tool}</span>)}
                </span>
                <i aria-hidden="true">→</i>
              </button>
            ))}
          </div>

          <RoleDiagram company={experience.company} highlight={highlight} />
        </motion.article>
      </AnimatePresence>
    </section>
  );
}

function EducationSection() {
  return (
    <section className="section education-section" id="education" aria-labelledby="education-title">
      <SectionTitle index="03" label="EDUCATION" title="Education." />
      <div className="education-list">
        {education.map((item, index) => (
          <motion.a
            key={item.school}
            className="education-row"
            href={item.url}
            target="_blank"
            rel="noreferrer"
            data-magnetic
            data-cursor="VISIT"
            {...reveal}
          >
            <span className="education-number">0{index + 1}</span>
            <span className="education-logo"><img src={item.logo} alt="" width="84" height="54" /></span>
            <span className="education-copy">
              <strong>{item.school}</strong>
              <span>{item.degree}</span>
              <small>{item.detail}</small>
            </span>
            <span className="education-period">{item.period}</span>
            <i aria-hidden="true">↗</i>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function ProjectSection() {
  const [active, setActive] = useState(1);

  return (
    <section className="section project-section" id="project" aria-labelledby="project-title">
      <SectionTitle index="04" label="PROJECT" title={project.title} />
      <motion.div className="project-grid" {...reveal}>
        <div className="project-copy">
          <p className="project-period">{project.period}</p>
          <h3 id="project-title">{project.name}</h3>
          <p>{project.description}</p>
          <a href={project.url} target="_blank" rel="noreferrer" className="text-link" data-magnetic data-cursor="GITHUB">View GitHub <span aria-hidden="true">↗</span></a>
          <div className="project-facts">
            {[...project.tools, ...project.capabilities].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>

        <div className="project-pipeline">
          <div className="pipeline-steps" aria-label="Housing search data pipeline">
            {project.stages.map((stage, index) => (
              <button
                key={stage.title}
                type="button"
                aria-pressed={active === index}
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage.title}</strong>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={project.stages[active].title}
              className="pipeline-detail"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <span>{String(active + 1).padStart(2, "0")} / {project.stages[active].title}</span>
              {project.stages[active].detail}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
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
    <button className="contact-email" onClick={copy} data-magnetic data-cursor="COPY">
      <span>{identity.email}</span>
      <b aria-live="polite">{copied ? "COPIED" : "COPY"}</b>
    </button>
  );
}

export function Portfolio() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="section about-section" id="about" aria-labelledby="about-title">
        <SectionTitle index="01" label="ABOUT" title={about.title} />
        <motion.div className="about-grid" {...reveal}>
          <div className="about-narrative">
            {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="additional-experience">
              {about.additional.label}: <a href={about.additional.url} target="_blank" rel="noreferrer">{about.additional.company} ↗</a>
            </p>
          </div>
          <div className="interest-list">
            <p>Professional interests</p>
            {about.interests.map((interest, index) => <span key={interest}><i>{String(index + 1).padStart(2, "0")}</i>{interest}</span>)}
          </div>
          <div className="personal-list">
            <p>Outside work</p>
            {about.personal.map((interest) => <span key={interest}>{interest}</span>)}
          </div>
        </motion.div>
      </section>

      <ExperienceSection />
      <EducationSection />
      <ProjectSection />

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-inner">
          <p className="section-index">05 / CONTACT</p>
          <h2 id="contact-title">Let&apos;s build what&apos;s next<span className="signal-period">.</span></h2>
          <CopyEmailButton />
          <nav className="contact-links" aria-label="Contact links">
            <a href={`mailto:${identity.email}`} data-magnetic data-cursor="EMAIL">Email <span>↗</span></a>
            <a href={identity.linkedin} target="_blank" rel="noreferrer" data-magnetic data-cursor="OPEN">LinkedIn <span>↗</span></a>
            <a href={identity.github} target="_blank" rel="noreferrer" data-magnetic data-cursor="OPEN">GitHub <span>↗</span></a>
            <a href={identity.resume} target="_blank" rel="noreferrer" data-magnetic data-cursor="PDF">Résumé PDF <span>↗</span></a>
          </nav>
          <footer><span>Zuhayr Huseni · Software Engineer</span><span>{identity.location} · 2026</span></footer>
        </div>
      </section>
    </MotionConfig>
  );
}
