import { useMemo, useState } from "react";
import { itineraryData } from "./itineraryData";

const typeIcon = { transport: "M", hotel: "H", sights: "P", food: "F", ferry: "S", tip: "i" };

function IconText({ children, className = "" }) {
  return <span className={className} aria-hidden="true">{children}</span>;
}

function Html({ html }) {
  return <div className="rich-text" dangerouslySetInnerHTML={{ __html: html }} />;
}

function text(item, lang) {
  if (Array.isArray(item)) return lang === "de" ? item[1] : item[0];
  if (item && typeof item === "object") return lang === "de" ? item.de : item.zh;
  return item;
}

function Block({ block, lang, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const icon = typeIcon[block.type] || "i";
  return (
    <section className={`accordion block-${block.type}`}>
      <button className="accordion-trigger" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="block-icon">{icon}</span>
        <span>{lang === "de" ? block.titleDe : block.title}</span>
        <IconText className={open ? "chevron open" : "chevron"}>v</IconText>
      </button>
      {open && <Html html={lang === "de" ? block.htmlDe : block.html} />}
    </section>
  );
}

function Overview({ lang }) {
  const country = itineraryData.countryInfo;
  return (
    <main className="overview-grid">
      <section className="overview-panel intro-panel">
        <div className="panel-label"><IconText>i</IconText>{lang === "de" ? "Reiseüberblick" : "行程總覽"}</div>
        {itineraryData.intro.map((item, index) => <Html key={index} html={text(item, lang)} />)}
      </section>
      {country && (
        <section className="overview-panel country-panel">
          <div className="panel-label"><IconText>M</IconText>{text(country.name, lang)}</div>
          <div className="country-table">
            {country.rows.map((row) => (
              <div className="country-row" key={row[0]}>
                <span>{lang === "de" ? row[1] : row[0]}</span>
                <Html html={text(row[2], lang)} />
              </div>
            ))}
          </div>
          <ul className="note-list">{country.notes.map((note, index) => <li key={index}>{text(note, lang)}</li>)}</ul>
        </section>
      )}
      {itineraryData.infoSections.map((section) => (
        <section className="overview-panel wide-panel" key={section.title}>
          <div className="panel-label"><IconText>D</IconText>{lang === "de" ? section.titleDe : section.title}</div>
          <Html html={lang === "de" ? section.htmlDe : section.html} />
        </section>
      ))}
    </main>
  );
}

function DayDetail({ day, index, lang }) {
  return (
    <article className="day-detail">
      <header className="day-detail-head">
        <div>
          <span className="day-kicker">{lang === "de" ? `TAG ${index + 1}` : `DAY ${index + 1}`}</span>
          <h2>{lang === "de" ? day.titleDe : day.title}</h2>
        </div>
        <div className="date-pill">{day.date} {day.weekday}</div>
      </header>
      <div className="accordion-stack">
        {day.blocks.map((block, blockIndex) => <Block key={`${block.title}-${blockIndex}`} block={block} lang={lang} defaultOpen={blockIndex < 2} />)}
      </div>
    </article>
  );
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("trip-lang") || "zh");
  const [active, setActive] = useState("overview");
  const activeDay = useMemo(() => itineraryData.days[Number(active)], [active]);

  function changeLang(nextLang) {
    setLang(nextLang);
    localStorage.setItem("trip-lang", nextLang);
    document.documentElement.lang = nextLang === "de" ? "de" : "zh-TW";
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <nav className="topbar">
          <div className="brand-mark"><IconText>A</IconText>{lang === "de" ? "Reiseplan" : "旅行行程"}</div>
          <div className="language-switch" aria-label="Language switch">
            <IconText>文</IconText>
            <button className={lang === "zh" ? "active" : ""} type="button" onClick={() => changeLang("zh")}>中文</button>
            <button className={lang === "de" ? "active" : ""} type="button" onClick={() => changeLang("de")}>Deutsch</button>
          </div>
        </nav>
        <div className="hero-copy">
          <p>{lang === "de" ? "Familienreise" : "Family Travel"}</p>
          <h1>{lang === "de" ? itineraryData.titleDe : itineraryData.title}</h1>
          <div className="city-tags">{itineraryData.cities.map((city) => <span key={city.name}>{lang === "de" ? city.labelDe : city.label}</span>)}</div>
        </div>
      </header>

      <div className="layout">
        <aside className="timeline" aria-label="Itinerary timeline">
          <button className={active === "overview" ? "timeline-item active" : "timeline-item"} type="button" onClick={() => setActive("overview")}>
            <span className="timeline-dot">i</span>
            <span><strong>{lang === "de" ? "Übersicht" : "總覽"}</strong><small>{lang === "de" ? "Reiseinfos" : "行程資訊"}</small></span>
          </button>
          {itineraryData.days.map((day, index) => (
            <button className={active === String(index) ? "timeline-item active" : "timeline-item"} type="button" key={`${day.date}-${day.title}`} onClick={() => setActive(String(index))}>
              <span className="timeline-dot">{index + 1}</span>
              <span><strong>{day.date}</strong><small>{lang === "de" ? day.cityDe : day.city}</small></span>
            </button>
          ))}
        </aside>

        <section className="content-stage">
          {active === "overview" ? <Overview lang={lang} /> : <DayDetail day={activeDay} index={Number(active)} lang={lang} />}
        </section>
      </div>
    </div>
  );
}
