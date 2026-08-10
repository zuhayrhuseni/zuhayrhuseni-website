import { Portfolio } from "./portfolio";
import { hero, identity } from "./content";
import { CursorReticle, SignalTrace } from "./hero-interactions";

const navItems = [
  ["Now", "#now"],
  ["Experience", "#experience"],
  ["Work", "#work"],
  ["Stack", "#stack"],
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
        <span className="availability"><i /> SF BAY / 2026</span>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-kicker">{hero.eyebrow}</p>
            <h1 className="hero-title" id="hero-title">
              {hero.headline.split(" ").map((word, index) => <span key={`${word}-${index}`}><i>{word}</i></span>)}
            </h1>
            <div className="hero-bottom">
              <p className="hero-dek">{hero.dek}</p>
              <div className="hero-meta">
                <span>ROLE<br /><b>{identity.role}</b></span>
                <span>BASE<br /><b>{identity.location}</b></span>
                <span>STATUS<br /><b>{identity.citizenship}</b></span>
              </div>
            </div>
          </div>
          <SignalTrace />
        </section>
        <Portfolio />
      </main>
    </>
  );
}
