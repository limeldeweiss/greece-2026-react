import { useMemo, useState } from "react";
import { itineraryData } from "./itineraryData";

const sectionDefs = [
  { key: "plan", zh: "行程", de: "Route", icon: "route" },
  { key: "sights", zh: "景點", de: "Sehenswürdigkeiten", icon: "pin" },
  { key: "transport", zh: "交通", de: "Verkehr", icon: "train" },
  { key: "food", zh: "餐廳", de: "Restaurants", icon: "food" },
];

function Icon({ name, className = "" }) {
  const paths = {
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 10v6" /><path d="M12 7.5v.1" /></>,
    map: <><path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" /><path d="M9 3v15" /><path d="M15 6v15" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M4 10h16" /></>,
    route: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 6h4a4 4 0 010 8h-1a4 4 0 000 8h7" /></>,
    pin: <><path d="M12 21s7-5.1 7-12a7 7 0 10-14 0c0 6.9 7 12 7 12z" /><circle cx="12" cy="9" r="2.4" /></>,
    train: <><rect x="6" y="3" width="12" height="14" rx="3" /><path d="M8 17l-2 4" /><path d="M16 17l2 4" /><path d="M9 7h6" /><path d="M9 12h.1" /><path d="M15 12h.1" /></>,
    food: <><path d="M7 3v8" /><path d="M5 3v4" /><path d="M9 3v4" /><path d="M7 11v10" /><path d="M17 3v18" /><path d="M14 3h3a3 3 0 013 3v5h-6V3z" /></>,
    chevron: <path d="M7 10l5 5 5-5" />,
  };
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.info}
    </svg>
  );
}

function Html({ html }) {
  return <div className="rich-text" dangerouslySetInnerHTML={{ __html: html }} />;
}

function text(item, lang) {
  if (Array.isArray(item)) return lang === "de" ? item[1] : item[0];
  if (item && typeof item === "object") return lang === "de" ? item.de : item.zh;
  return item;
}

function destinationTitle(day, lang) {
  const title = day.title || "";
  const city = day.city || "";
  if (/Oia\s*->\s*Fira|White Concept|入住\s*Fira|Fira/.test(title)) return "Fira";
  if (/入住\s*Oia|Oia 第二晚|Athens\s*->\s*Santorini|Oia/.test(title)) return "Oia";
  if (/Santorini\s*->\s*Mykonos|Mykonos|米克諾斯/.test(title)) return "Mykonos";
  if (/Mykonos\s*->\s*Athens|Athens|雅典/.test(title)) return "Athens";
  if (/Santorini|聖托里尼/.test(title)) return "Santorini";
  return lang === "de" ? day.cityDe || city : city;
}

function sectionKey(block) {
  const title = block.title || "";
  if (/餐廳|晚餐|午餐|早餐|小吃|food/i.test(title) || block.type === "food") return "food";
  if (/景點|介紹|Acropolis|Delos|Akrotiri|Oia|Fira|Mykonos/i.test(title) || block.type === "sights") return "sights";
  if (/交通|航班|船|Ferry|Seajets|票價|入住|Check/i.test(title) || ["transport", "ferry", "hotel"].includes(block.type)) return "transport";
  return "plan";
}

function groupedSections(day) {
  return sectionDefs.map((section) => ({
    ...section,
    blocks: day.blocks.filter((block) => sectionKey(block) === section.key),
  }));
}

function SectionBlock({ section, lang, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const label = lang === "de" ? section.de : section.zh;
  return (
    <section className={`accordion section-${section.key}`}>
      <button className="accordion-trigger" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="block-icon"><Icon name={section.icon} /></span>
        <span>{label}</span>
        <Icon name="chevron" className={open ? "chevron open" : "chevron"} />
      </button>
      {open && (
        <div className="section-content">
          {section.blocks.length ? section.blocks.map((block, index) => (
            <div className="section-block" key={`${section.key}-${block.title}-${index}`}>
              <h3>{lang === "de" ? block.titleDe : block.title}</h3>
              <Html html={lang === "de" ? block.htmlDe : block.html} />
            </div>
          )) : <p className="empty-note">{lang === "de" ? "Keine Angaben." : "這天沒有特別補充。"}</p>}
        </div>
      )}
    </section>
  );
}

function Overview({ lang }) {
  const country = itineraryData.countryInfo;
  return (
    <main className="overview-grid">
      <section className="overview-panel intro-panel">
        <div className="panel-label"><Icon name="info" />{lang === "de" ? "Reiseüberblick" : "行程總覽"}</div>
        {itineraryData.intro.map((item, index) => <Html key={index} html={text(item, lang)} />)}
      </section>
      {country && (
        <section className="overview-panel country-panel">
          <div className="panel-label"><Icon name="map" />{text(country.name, lang)}</div>
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
          <div className="panel-label"><Icon name="calendar" />{lang === "de" ? section.titleDe : section.title}</div>
          <Html html={lang === "de" ? section.htmlDe : section.html} />
        </section>
      ))}
    </main>
  );
}

function DayDetail({ day, index, lang }) {
  const sections = groupedSections(day);
  return (
    <article className="day-detail">
      <header className="day-detail-head">
        <div>
          <span className="day-kicker">{lang === "de" ? `TAG ${index + 1}` : `DAY ${index + 1}`}</span>
          <h2>{destinationTitle(day, lang)}</h2>
        </div>
        <div className="date-pill">{day.date} {day.weekday}</div>
      </header>
      <div className="accordion-stack">
        {sections.map((section, sectionIndex) => <SectionBlock key={section.key} section={section} lang={lang} defaultOpen={sectionIndex < 2} />)}
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
          <div className="language-switch" aria-label="Language switch">
            <button className={lang === "zh" ? "active" : ""} type="button" onClick={() => changeLang("zh")}>中文</button>
            <button className={lang === "de" ? "active" : ""} type="button" onClick={() => changeLang("de")}>Deutsch</button>
          </div>
        </nav>
        <div className="hero-copy">
          <h1>{lang === "de" ? itineraryData.titleDe : itineraryData.title}</h1>
          <div className="city-tags">{itineraryData.cities.map((city) => <span key={city.name}>{lang === "de" ? city.labelDe : city.label}</span>)}</div>
        </div>
      </header>

      <div className="layout">
        <aside className="timeline" aria-label="Itinerary timeline">
          <button className={active === "overview" ? "timeline-item active" : "timeline-item"} type="button" onClick={() => setActive("overview")}>
            <span className="timeline-dot"><Icon name="info" /></span>
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
