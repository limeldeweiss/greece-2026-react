import { useMemo, useState } from "react";
import { itineraryData } from "./itineraryData";

function Icon({ name, className = "" }) {
  const paths = {
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 10v6" /><path d="M12 7.5v.1" /></>,
    map: <><path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" /><path d="M9 3v15" /><path d="M15 6v15" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M4 10h16" /></>,
    route: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 6h4a4 4 0 010 8h-1a4 4 0 000 8h7" /></>,
    pin: <><path d="M12 21s7-5.1 7-12a7 7 0 10-14 0c0 6.9 7 12 7 12z" /><circle cx="12" cy="9" r="2.4" /></>,
    train: <><rect x="6" y="3" width="12" height="14" rx="3" /><path d="M8 17l-2 4" /><path d="M16 17l2 4" /><path d="M9 7h6" /><path d="M9 12h.1" /><path d="M15 12h.1" /></>,
    airport: <><path d="M10.5 4.5l3 15" /><path d="M12 4l7 7-2 1-5-3-5 3-2-1 7-7z" /><path d="M9 19l3-2 3 2" /></>,
    port: <><path d="M12 3v18" /><path d="M8 7h8" /><path d="M6 21c2-2 4-2 6 0 2-2 4-2 6 0" /><path d="M5 13h14l-2 5H7l-2-5z" /></>,
    hotel: <><path d="M4 20V7a2 2 0 012-2h8a2 2 0 012 2v13" /><path d="M8 20v-6h8v6" /><path d="M8 9h.1" /><path d="M12 9h.1" /></>,
    luggage: <><rect x="7" y="7" width="10" height="13" rx="2" /><path d="M10 7V5a2 2 0 014 0v2" /><path d="M10 20v1" /><path d="M14 20v1" /></>,
    restroom: <><circle cx="8" cy="5" r="2" /><path d="M8 8v10" /><path d="M5 12h6" /><circle cx="16" cy="5" r="2" /><path d="M14 8h4l1 7h-6l1-7z" /><path d="M16 15v3" /></>,
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

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
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

function isPlanBlock(block) {
  const title = block.title || "";
  return /建議行程|建議順序|行程安排|Empfohlene Route|Empfehlung/i.test(title);
}

function listItems(html) {
  const items = [];
  String(html || "").replace(/<li>(.*?)<\/li>/g, (_match, item) => {
    items.push(stripHtml(item));
    return "";
  });
  return items;
}

function pointName(raw) {
  let name = stripHtml(raw)
    .replace(/^\d+[.)、]\s*/, "")
    .replace(/^(抵達|前往|回到|回|搭|到|從|入住|Check-in|Check-out|寄行李或|寄行李|午餐：|晚餐：|早餐：)\s*/i, "")
    .replace(/，.*$/, "")
    .replace(/。.*$/, "")
    .trim();
  if (/JTR|Santorini Airport/i.test(name)) return "JTR";
  if (/ATH|Athens International Airport/i.test(name)) return "ATH";
  if (/Athinios Port/i.test(name)) return "Athinios Port";
  if (/Mykonos New Port|Tourlos/i.test(name)) return "Mykonos New Port";
  if (/Fira Bus Station/i.test(name)) return "Fira Bus Station";
  if (/Just Blue/i.test(name)) return "Oia / Just Blue";
  if (/White Concept/i.test(name)) return "Fira / White Concept Caves";
  if (/Christy Suites/i.test(name)) return "Mykonos / Christy Suites";
  if (/Finders Ermou/i.test(name)) return "Athens / Finders Ermou Suites";
  if (/Synathens/i.test(name)) return "Athens / Synathens Syntagma";
  return name || raw;
}

function pointIcon(name) {
  if (/airport|\bATH\b|\bJTR\b|\bJMK\b/i.test(name)) return "airport";
  if (/port|harbour|碼頭|ferry|boat|seabus|Athinios|Tourlos|Old Port/i.test(name)) return "port";
  if (/station|metro|bus|M1|M3|KTEL|車站|公車|地鐵/i.test(name)) return "train";
  if (/hotel|suite|cave|Just Blue|Christy|Finders|Synathens|住宿|check-in|check-out/i.test(name)) return "hotel";
  if (/luggage|寄物|寄行李/i.test(name)) return "luggage";
  if (/toilet|restroom|廁所/i.test(name)) return "restroom";
  if (/餐|gyros|cafe|restaurant|tavern|lunch|dinner|午餐|晚餐|早餐/i.test(name)) return "food";
  return "pin";
}

function keywords(textValue) {
  return stripHtml(textValue)
    .split(/[\s/、,，：:()（）+>-]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 3 && !/^(and|the|with|from|到|或|再|約|可以)$/.test(item))
    .slice(0, 8);
}

function relatedBlocks(day, point, index) {
  const words = keywords(point.name);
  const blocks = day.blocks.filter((block) => !isPlanBlock(block));
  const matched = blocks.filter((block) => {
    const haystack = `${block.title} ${stripHtml(block.html)}`;
    return words.some((word) => haystack.includes(word));
  });
  if (matched.length) return matched;
  if (index === 0) return blocks.filter((block) => /交通|航班|船|入住|Check/i.test(block.title) || ["transport", "ferry", "hotel", "tip"].includes(block.type)).slice(0, 2);
  if (/餐|food|lunch|dinner|午餐|晚餐/i.test(point.raw)) return blocks.filter((block) => block.type === "food").slice(0, 1);
  return blocks.filter((block) => ["sights", "tip"].includes(block.type)).slice(0, 1);
}

function itineraryPoints(day) {
  const plan = day.blocks.find(isPlanBlock);
  const items = plan ? listItems(plan.html) : [];
  const sourceItems = items.length ? items : day.blocks.map((block) => block.title);
  return sourceItems.map((item, index) => {
    const name = pointName(item);
    const point = { raw: item, name, icon: pointIcon(`${name} ${item}`) };
    return { ...point, blocks: relatedBlocks(day, point, index) };
  });
}

function TripPoint({ point, index, lang }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="trip-point">
      <button className="point-head" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="point-number">{index + 1}</span>
        <span className="point-icon"><Icon name={point.icon} /></span>
        <span className="point-title">{point.name}</span>
        <Icon name="chevron" className={open ? "chevron open" : "chevron"} />
      </button>
      {open && (
        <div className="point-info">
          <div className="info-label"><Icon name="info" />{lang === "de" ? "Info" : "資訊"}</div>
          {point.blocks.length ? point.blocks.map((block, blockIndex) => (
            <div className="info-block" key={`${point.name}-${block.title}-${blockIndex}`}>
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
  const points = itineraryPoints(day);
  return (
    <article className="day-detail">
      <header className="day-detail-head">
        <div>
          <span className="day-kicker">{lang === "de" ? `TAG ${index + 1}` : `DAY ${index + 1}`}</span>
          <h2>{destinationTitle(day, lang)}</h2>
        </div>
        <div className="date-pill">{day.date} {day.weekday}</div>
      </header>
      <div className="point-timeline">
        {points.map((point, pointIndex) => <TripPoint key={`${point.name}-${pointIndex}`} point={point} index={pointIndex} lang={lang} />)}
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
