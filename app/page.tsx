import { Portfolio } from "./portfolio";
import { hero, identity } from "./content";
import { CursorReticle, SignalTrace } from "./hero-interactions";

const navItems = [
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Education", "#education"],
  ["Project", "#project"],
  ["Contact", "#contact"],
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <CursorReticle />
      <header className="site-header">
        <a href="#top" className="wordmark" data-magnetic data-cursor="TOP" aria-label="ZH, Zuhayr Huseni, back to top">
          <span>ZH</span><b>Zuhayr Huseni</b>
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map(([label, href]) => <a key={href} href={href} data-magnetic data-cursor="GO">{label}</a>)}
        </nav>
        <a className="header-resume" href={identity.resume} target="_blank" rel="noreferrer" data-magnetic data-cursor="PDF">Résumé ↗</a>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 className="hero-title" id="hero-title">
              {hero.headline.replace(/\.$/, "")}<b className="signal-period">.</b>
            </h1>
            <p className="hero-dek">{hero.dek}</p>
            <a className="text-link hero-link" href="#experience" data-magnetic data-cursor="GO">View experience <span aria-hidden="true">→</span></a>
          </div>
          <SignalTrace />
        </section>
        <Portfolio />
      </main>
    </>
  );
}
