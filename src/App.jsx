import { useMemo, useState } from "react";
import { itineraryData } from "./itineraryData";

const POINT_DESCRIPTIONS = {
  "Oia lanes": ["Oia 的白牆巷弄是 Santorini 最有代表性的散步區，清晨和傍晚光線最好，也比較能避開一日遊人潮。巷子很窄，拍照時要留通道給住戶和旅客。", "Die Gassen von Oia sind der klassische Santorini-Spaziergang mit weißen Häusern und Blicken auf die Caldera. Morgens und am späten Nachmittag ist es ruhiger und das Licht ist am schönsten."],
  "Blue Domes": ["藍頂教堂是 Oia 最經典的拍照畫面之一，實際拍攝點多在窄巷和住宅旁。建議停留拍照即可，不要擋住私人門口或翻越圍欄。", "Die blauen Kuppeln gehören zu den bekanntesten Motiven in Oia. Die Aussichtspunkte liegen oft in schmalen Gassen nahe privaten Häusern, daher kurz fotografieren und Durchgänge freihalten."],
  "Maritime Museum": ["Oia Maritime Museum 收藏 Santorini 航海、船模、老照片和船長家族相關資料；如果只看外觀，也適合作為理解 Oia 航海歷史的小停靠點。", "Das Maritime Museum in Oia zeigt Schifffahrtsgeschichte, Modelle und alte Fotos. Auch von außen ist es ein guter kurzer Stopp, um Oias maritime Vergangenheit einzuordnen."],
  "Oia Castle": ["Oia Castle 是看夕陽的熱門位置，可以俯瞰 Ammoudi Bay 和白色屋群。10 月人潮少於夏季，但仍建議日落前提早到。", "Die Burgruine von Oia ist einer der beliebtesten Sonnenuntergangspunkte mit Blick auf Ammoudi Bay und die weißen Häuser. Auch im Oktober lohnt frühes Kommen."],
  "Archaeological Site of Akrotiri": ["Akrotiri 是火山灰保存下來的青銅時代聚落，常被稱為愛琴海版 Pompeii。室內遺址很適合家庭參觀，可以看到街道、房屋和古代生活痕跡。", "Akrotiri ist eine bronzezeitliche Siedlung, die unter Vulkanasche erhalten blieb. Die überdachte Ausgrabung zeigt Straßen, Häuser und Spuren des Alltagslebens."],
  "Red Beach viewpoint": ["Red Beach 以紅色火山岩和深色海岸聞名，最適合在 viewpoint 拍照。這一帶有落石風險，不建議越過警示線或久留在岩壁下。", "Red Beach ist für rote Vulkanfelsen und die dunkle Küste bekannt. Der Aussichtspunkt reicht für Fotos; wegen Steinschlaggefahr nicht unter den Felsen bleiben."],
  "Firostefani": ["Firostefani 在 Fira 北側，沿 caldera 步道可以看到比較安靜的懸崖海景，是從 Fira 散步到 Imerovigli 的漂亮中段。", "Firostefani liegt nördlich von Fira und bietet ruhigere Caldera-Blicke. Es ist ein schöner Abschnitt auf dem Spazierweg Richtung Imerovigli."],
  "Three Bells of Fira": ["Three Bells of Fira 是 Santorini 常見明信片角度之一，藍頂、白色鐘樓和海景同框。停留時間不用長，適合順路拍照。", "Three Bells of Fira ist ein klassisches Fotomotiv mit blauer Kuppel, weißem Glockenturm und Meerblick. Ein kurzer Stopp genügt."],
  "Imerovigli": ["Imerovigli 地勢較高，被稱為 Santorini 的陽台，景色比 Fira 更安靜開闊。風大時要注意懸崖邊步道。", "Imerovigli liegt höher und gilt als Balkon Santorinis. Die Aussicht ist weit und ruhiger als in Fira; bei Wind an den Klippen vorsichtig sein."],
  "Skaros Rock viewpoint": ["Skaros Rock 是 Imerovigli 外側的火山岩岬角，視野很好但路面不完全平整。若風大或體力不足，到 viewpoint 看景即可。", "Skaros Rock ist ein Felsvorsprung bei Imerovigli mit weitem Blick. Bei Wind oder wenig Zeit reicht der Aussichtspunkt."],
  "Mykonos Town": ["Mykonos Town 是島上最適合步行的核心區，白牆、彩色窗框和迷宮般小巷集中在這裡。白天適合逛街，傍晚適合接 Little Venice 和風車。", "Mykonos Town ist der begehbare Kern der Insel mit weißen Häusern, farbigen Fenstern und verwinkelten Gassen. Tagsüber gut zum Bummeln, abends ideal Richtung Little Venice."],
  "Mykonos Town / Chora": ["Chora 是 Mykonos Town 的傳統名稱，巷弄密集、轉角很多，很適合慢慢走。建議用 landmark 導航，避免在小巷裡一直繞。", "Chora ist der traditionelle Name von Mykonos Town. Die engen Gassen sind schön, aber verwinkelt; am besten mit markanten Punkten navigieren."],
  "Paraportiani Church": ["Paraportiani Church 是 Mykonos 最有名的白色教堂，由多個小禮拜堂組成，外型像雕塑。外觀拍照即可，注意不要攀爬建築。", "Die Paraportiani-Kirche ist Mykonos' berühmteste weiße Kirche und wirkt fast skulptural. Von außen anschauen und nicht auf das Gebäude steigen."],
  "Little Venice": ["Little Venice 的房屋緊貼海邊，是 Mykonos 看海、拍夕陽和晚餐氣氛最好的區域之一。靠海座位通常較貴，預算餐可在內街解決。", "Little Venice liegt direkt am Wasser und ist einer der schönsten Orte für Meerblick und Sonnenuntergang. Plätze am Wasser sind oft teurer."],
  "Windmills of Mykonos": ["Mykonos 風車是島上代表地標，從 Fabrika 或 Little Venice 走過去很順。傍晚逆光漂亮，但風通常很大。", "Die Windmühlen sind ein Wahrzeichen von Mykonos und gut zu Fuß von Fabrika oder Little Venice erreichbar. Abends schönes Licht, oft windig."],
  "Matogianni Street": ["Matogianni Street 是 Mykonos Town 的主要逛街街道，集中精品、紀念品、咖啡店和餐廳。晚上熱鬧，適合作為晚餐前後散步線。", "Die Matogianni Street ist die zentrale Einkaufsstraße mit Boutiquen, Souvenirs, Cafés und Restaurants. Abends lebhaft und gut zum Bummeln."],
  "Delos": ["Delos 是 Mykonos 外海的小島，也是希臘神話中 Apollo 和 Artemis 的出生地。若風浪停航，就要改成 Mykonos Town 或海灘輕鬆日。", "Delos ist eine kleine Insel vor Mykonos und in der Mythologie Geburtsort von Apollo und Artemis. Bei Wind können Boote ausfallen."],
  "Archaeological Site of Delos": ["Delos 遺址是 UNESCO 世界遺產，可看到神殿、街道、住宅和商業區，是了解古代愛琴海宗教與貿易的重要地點。", "Die Ausgrabung von Delos ist UNESCO-Welterbe mit Tempeln, Straßen, Häusern und Handelsbereichen, wichtig für Religion und Handel der antiken Ägäis."],
  "Terrace of the Lions": ["Terrace of the Lions 是 Delos 最具代表性的景點，石獅原本守護通往聖湖的道路。現場多為複製品，原件在博物館保存。", "Die Terrasse der Löwen ist eines der bekanntesten Motive auf Delos. Die Löwen bewachten einst den Weg zum heiligen See; vor Ort stehen meist Kopien."],
  "House of Dionysus": ["House of Dionysus 以馬賽克地板聞名，可以看到古代富裕住宅的格局和神話題材裝飾。", "Das House of Dionysus ist für Mosaikböden bekannt und zeigt, wie wohlhabende Häuser auf Delos gestaltet waren."],
  "Ornos Beach": ["Ornos Beach 是 Mykonos 較容易抵達、設施完整的海灘，適合 Delos 取消時作為輕鬆備案。10 月底水上活動和餐廳營業需再確認。", "Ornos Beach ist gut erreichbar und relativ gut ausgestattet. Ende Oktober Öffnungszeiten von Lokalen und Aktivitäten vorher prüfen."],
  "Agios Ioannis Beach": ["Agios Ioannis Beach 比 Ornos 安靜，視野開闊，適合想避開 Mykonos Town 人潮時短暫休息。", "Agios Ioannis Beach ist ruhiger als Ornos und bietet weite Blicke, gut für eine entspannte Pause abseits von Mykonos Town."],
  "Acropolis South Slope Entrance": ["Acropolis South Slope Entrance 靠近 Acropolis Museum，適合把 Theatre of Dionysus、Odeon 和衛城主區串在一起。免費日建議很早到。", "Der Südeingang der Akropolis liegt nahe dem Museum und passt gut für Theatre of Dionysus, Odeon und den Hauptbereich. An freien Tagen früh kommen."],
  "Theatre of Dionysus": ["Theatre of Dionysus 被認為是古希臘戲劇的重要發源地，位在衛城南坡。現場可看到階梯座位和舞台區遺跡。", "Das Theatre of Dionysus gilt als wichtiger Ursprung des griechischen Theaters. Auf der Südseite der Akropolis sieht man Sitzreihen und Bühnenreste."],
  "Odeon of Herodes Atticus": ["Odeon of Herodes Atticus 是羅馬時期劇場，保存狀態壯觀，至今仍會作為演出場地使用。從南坡往上走時很容易順路看到。", "Das Odeon des Herodes Atticus ist ein beeindruckendes römisches Theater und wird bis heute für Aufführungen genutzt."],
  "Propylaea": ["Propylaea 是進入 Acropolis 主區的 monumental gate，通過後會看到 Parthenon 視野展開。人多時這裡容易壅塞。", "Die Propylaia bilden das monumentale Eingangstor zur Akropolis. Danach öffnet sich der Blick auf den Parthenon; bei Andrang eng."],
  "Parthenon": ["Parthenon 是 Acropolis 的核心神廟，供奉雅典娜，也是雅典最重要的古典建築象徵。現場常有修復工程，拍照角度要稍微繞一下。", "Der Parthenon ist der zentrale Tempel der Akropolis und Symbol des klassischen Athens. Wegen Restaurierung sind manche Blickwinkel eingeschränkt."],
  "Erechtheion": ["Erechtheion 以 Caryatids 女像柱聞名，建築比 Parthenon 小但細節很精緻。現場女像柱為複製品，原件多在博物館保存。", "Das Erechtheion ist für die Karyatiden bekannt. Es ist kleiner als der Parthenon, aber sehr detailreich; vor Ort stehen Kopien."],
  "Areopagus Hill": ["Areopagus Hill 在 Acropolis 附近，是拍衛城和城市景觀的熱門岩丘。石面可能滑，尤其雨後要小心。", "Der Areopag-Hügel nahe der Akropolis bietet schöne Stadt- und Akropolisblicke. Der Fels kann rutschig sein."],
  "Acropolis Museum": ["Acropolis Museum 展示衛城出土文物，動線清楚、冷氣和休息空間也適合家庭。參觀完遺址後進館，脈絡會更完整。", "Das Akropolismuseum zeigt Funde der Akropolis und ist gut strukturiert. Nach dem Besuch der Ausgrabung versteht man die Zusammenhänge besser."],
  "Plaka": ["Plaka 是雅典老城區，街道、餐廳和小店集中，適合安排午餐和散步。靠近主要景點，價格可能比外圍略高。", "Plaka ist die Altstadt Athens mit Gassen, Restaurants und kleinen Läden. Gut für Mittagessen und Spaziergänge, aber teils touristischer."],
  "Anafiotika": ["Anafiotika 是 Plaka 上方的小區，白牆窄巷有島嶼感，但多為住宅區，適合安靜通過和拍照。", "Anafiotika oberhalb von Plaka wirkt mit weißen Gassen fast wie eine Insel. Es ist ein Wohngebiet, daher ruhig und respektvoll bleiben."],
  "Syntagma Square": ["Syntagma Square 是雅典市中心重要廣場，靠近國會和地鐵。可順路看衛兵交接，節日或遊行時可能有管制。", "Der Syntagma-Platz ist ein zentraler Platz nahe Parlament und Metro. Wachwechsel möglich; an Feiertagen kann es Sperrungen geben."],
  "National Garden": ["National Garden 在 Syntagma 旁，是市中心少數大片綠地，適合在博物館和古蹟後讓腳休息。", "Der National Garden neben Syntagma ist eine ruhige Grünfläche im Zentrum, ideal für eine Pause nach Museen und Ruinen."],
  "Ancient Agora of Athens": ["Ancient Agora 是古雅典公共生活中心，政治、商業和哲學討論都在這裡發生。園區比衛城平緩，適合慢慢走。", "Die antike Agora war Zentrum des öffentlichen Lebens in Athen: Politik, Handel und Philosophie. Das Gelände ist flacher und gut zu gehen."],
  "Temple of Hephaestus": ["Temple of Hephaestus 是希臘保存最完整的古神廟之一，位在 Ancient Agora 內，外觀比例非常漂亮。", "Der Tempel des Hephaistos ist einer der am besten erhaltenen griechischen Tempel und liegt in der antiken Agora."],
  "Stoa of Attalos": ["Stoa of Attalos 是重建的古代柱廊，內部作為 Agora Museum，適合看小型文物並理解古市集生活。", "Die Stoa des Attalos ist eine rekonstruierte Säulenhalle und beherbergt das Agora-Museum mit Funden aus dem antiken Alltag."],
  "Monastiraki Flea Market": ["Monastiraki Flea Market 集中紀念品、皮革、古物和街頭小吃，適合最後採買。週末更熱鬧，人多時注意隨身物品。", "Der Monastiraki-Flohmarkt bietet Souvenirs, Lederwaren, Antiquitäten und Snacks. Am Wochenende lebhafter; auf Wertsachen achten."],
  "National Archaeological Museum": ["National Archaeological Museum 是希臘最重要的考古博物館之一，收藏範圍大，若時間有限可優先看青銅器、雕塑和邁錫尼展品。", "Das Nationale Archäologische Museum ist eines der wichtigsten Museen Griechenlands. Bei wenig Zeit Bronze, Skulpturen und mykenische Funde priorisieren."],
  "Benaki Museum": ["Benaki Museum 展示希臘歷史和藝術脈絡，位置比 National Archaeological Museum 更靠近 Syntagma/Kolonaki，適合想少移動的備案。", "Das Benaki Museum zeigt griechische Geschichte und Kunst und liegt näher bei Syntagma/Kolonaki, gut als weniger aufwendige Alternative."],
  "Ermou Street": ["Ermou Street 是雅典主要購物街，連接 Syntagma 和 Monastiraki。適合最後補買衣物、藥妝或紀念品。", "Die Ermou Street ist Athens zentrale Einkaufsstraße zwischen Syntagma und Monastiraki, gut für letzte Einkäufe."],
};

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

function routeItems(block) {
  const ordered = String(block?.html || "").match(/<ol>[\s\S]*?<\/ol>/);
  return listItems(ordered ? ordered[0] : block?.html);
}

function planBlockForDay(day) {
  return day.blocks.find(isPlanBlock) ||
    day.blocks.find((block) => /行程|順序|晚餐|散步|小逛/i.test(block.title || "") && routeItems(block).length >= 2) ||
    day.blocks.find((block) => !/票價|來源|預訂|查詢|餐廳/i.test(block.title || "") && routeItems(block).length >= 2);
}

function htmlPieces(html) {
  const pieces = [];
  let index = 0;
  String(html || "").replace(/<(li|p)>(.*?)<\/\1>/g, (match, tag, content) => {
    const textValue = stripHtml(content);
    if (textValue) pieces.push({ html: match, text: textValue, tag, index });
    index += 1;
    return "";
  });
  return pieces;
}

function stripActionWords(textValue) {
  return stripHtml(textValue)
    .replace(/^\d+[.)、]\s*/, "")
    .replace(/^\d{1,2}:\d{2}(?:-\d{1,2}:\d{2})?\s*/, "")
    .replace(/^(抵達|前往|回到|回|搭|到|從|入住|前往|經由|步行到|下午休息或|早點休息，準備|Check-in|Check-out|Boat to|Boat back to|Bus to|Walk to)\s*/i, "")
    .replace(/^(公車或\s*SeaBus\s*到|SeaBus\s*到|KTEL\s*Bus\s*到)\s*/i, "")
    .replace(/(出發|清晨散步|外觀拍照|外觀|拍照|看日落|補拍夕陽|晚餐散步|午餐與散步|最後購物|輕鬆收尾|二選一|步行|散步|短逛|外圍|休息|check-in|check-out|寄行李|或直接出發|巷弄)$/i, "")
    .replace(/，.*$/, "")
    .replace(/。.*$/, "")
    .trim();
}

function pointName(raw) {
  let name = stripActionWords(raw)
    .replace(/^[，,\s]+/, "")
    .replace(/^(前往|抵達|到|從|回到|回)\s*/i, "")
    .replace(/^(午餐|晚餐|早餐)[:：]\s*/i, "")
    .replace(/\s*(午餐|晚餐|早餐).*$/i, "")
    .replace(/\s*(或|or)\s*$/i, "")
    .trim();
  if (/Finders Ermou/i.test(name)) return "Athens / Finders Ermou Suites";
  if (/Synathens/i.test(name)) return "Athens / Synathens Syntagma";
  if (/Just Blue/i.test(name)) return "Oia / Just Blue";
  if (/White Concept/i.test(name)) return "Fira / White Concept Caves";
  if (/Christy Suites/i.test(name)) return "Mykonos / Christy Suites";
  if (/\bJTR\b|Santorini Airport/i.test(name)) return "JTR";
  if (/\bATH\b|Athens International Airport/i.test(name)) return "ATH";
  if (/Athinios Port/i.test(name)) return "Athinios Port";
  if (/Mykonos New Port|Tourlos/i.test(name)) return "Mykonos New Port";
  if (/Fira Bus Station/i.test(name)) return "Fira Bus Station";
  return name || raw;
}

function splitPointCandidates(raw) {
  if (/休息|準備/.test(raw) && !/Beach|Garden|Square|Plaka|Fira|Oia|Mykonos|Athens|Syntagma|National/.test(raw)) return [];
  const cleaned = stripActionWords(raw);
  if (!cleaned) return [];
  const normalized = cleaned
    .replace(/\s+或\s+/g, " / ")
    .replace(/\s+or\s+/gi, " / ")
    .replace(/\s*->\s*/g, " / ");
  const keepTogether = /Mykonos Town\s*\/\s*Chora|Metro Line|Blue Line|Green Line/i.test(normalized);
  const shouldSplit = !keepTogether && (
    normalized.includes(" / ") ||
    /Temple of Hephaestus|Stoa of Attalos|Blue Domes|Maritime Museum|Windmills|Little Venice|National Garden|Benaki Museum|Agios Ioannis|Ornos Beach/.test(normalized)
  );
  const parts = shouldSplit ? normalized.split(/\s*\/\s*/) : [normalized];
  return parts
    .map((part) => pointName(part))
    .map((part) => part.replace(/^(午餐|晚餐|早餐)[:：]\s*/i, "").trim())
    .filter((part) => !/^(Metro Line|M1|M3|Blue Line|Green Line|KTEL|SeaBus|Bus)/i.test(part))
    .filter(Boolean);
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

function aliasWords(point) {
  const seed = point.name;
  const words = keywords(seed);
  const aliases = {
    JTR: ["Santorini Airport", "10:55", "airport transfer"],
    ATH: ["Athens Airport", "M3", "Sky Express"],
    "Athinios Port": ["Santorini Athinios Port", "08:10", "Seajets"],
    "Mykonos New Port": ["Tourlos", "New Port", "SeaBus"],
    "Fira Bus Station": ["Fira Bus Station", "KTEL"],
    "Oia / Just Blue": ["Just Blue", "airport transfer", "Oia"],
    "Fira / White Concept Caves": ["White Concept Caves", "Fira 84700"],
    "Mykonos / Christy Suites": ["Christy Suites", "Agios Antonios", "Fabrika"],
    "Athens / Finders Ermou Suites": ["Finders Ermou Suites", "Ermou"],
    "Athens / Synathens Syntagma": ["Synathens Syntagma", "Apollonos 5"],
    "Oia lanes": ["Oia"],
    "Maritime Museum": ["Maritime Museum"],
  };
  return [...new Set([...words, ...(aliases[point.name] || [])])];
}

function pointDescription(point) {
  const direct = POINT_DESCRIPTIONS[point.name];
  if (direct) return direct;
  return null;
}

function relevantPieces(block, point, usedKeys) {
  const words = aliasWords(point);
  const dePieces = htmlPieces(block.htmlDe);
  return htmlPieces(block.html).map((piece) => ({ piece, dePiece: dePieces[piece.index] || piece })).filter(({ piece }) => {
    const key = `${block.title}:${piece.text}`;
    if (usedKeys.has(key)) return false;
    return words.some((word) => piece.text.includes(word));
  });
}

function pointInfo(day, point, index, usedKeys) {
  const blocks = day.blocks.filter((block) => !isPlanBlock(block));
  const snippets = [];
  const snippetsDe = [];
  blocks.forEach((block) => {
    relevantPieces(block, point, usedKeys).forEach(({ piece, dePiece }) => {
      const key = `${block.title}:${piece.text}`;
      usedKeys.add(key);
      snippets.push(piece.html);
      snippetsDe.push(dePiece.html);
    });
  });
  if (!snippets.length && index === 0) {
    const firstTransport = blocks.find((block) => /交通|航班|船|入住|Check/i.test(block.title) || ["transport", "ferry", "hotel", "tip"].includes(block.type));
    const piece = firstTransport ? htmlPieces(firstTransport.html)[0] : null;
    if (piece) {
      const dePiece = htmlPieces(firstTransport.htmlDe)[piece.index] || piece;
      usedKeys.add(`${firstTransport.title}:${piece.text}`);
      snippets.push(piece.html);
      snippetsDe.push(dePiece.html);
    }
  }
  if (!snippets.length && /餐|food|lunch|dinner|午餐|晚餐|早餐/i.test(point.raw)) {
    const foodBlock = blocks.find((block) => block.type === "food");
    const piece = foodBlock ? htmlPieces(foodBlock.html).find((item) => !usedKeys.has(`${foodBlock.title}:${item.text}`)) : null;
    if (piece) {
      const dePiece = htmlPieces(foodBlock.htmlDe)[piece.index] || piece;
      usedKeys.add(`${foodBlock.title}:${piece.text}`);
      snippets.push(piece.html);
      snippetsDe.push(dePiece.html);
    }
  }
  if (!snippets.length) {
    const description = pointDescription(point);
    if (description) {
      snippets.push(`<p>${description[0]}</p>`);
      snippetsDe.push(`<p>${description[1]}</p>`);
    }
  }
  if (!snippets.length) {
    snippets.push(`<p>${point.raw}</p>`);
    snippetsDe.push(`<p>${point.raw}</p>`);
  }
  const wrap = (items) => items.some((item) => item.startsWith("<li>"))
    ? `<ul>${items.map((item) => item.startsWith("<li>") ? item : `<li>${stripHtml(item)}</li>`).join("")}</ul>`
    : items.join("");
  return [{ html: wrap(snippets), htmlDe: wrap(snippetsDe) }];
}

function itineraryPoints(day) {
  const plan = planBlockForDay(day);
  const items = plan ? routeItems(plan) : [];
  const sourceItems = items.length ? items : day.blocks.map((block) => block.title);
  const usedNames = new Set();
  const usedKeys = new Set();
  const points = [];
  sourceItems.forEach((item) => {
    splitPointCandidates(item).forEach((name) => {
      const normalized = name.toLowerCase();
      if (usedNames.has(normalized)) return;
      usedNames.add(normalized);
      const point = { raw: item, name, icon: pointIcon(`${name} ${item}`) };
      points.push({ ...point, blocks: pointInfo(day, point, points.length, usedKeys) });
    });
  });
  return points;
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

function overviewTitle(section, lang) {
  const zhMap = {
    "確定住宿與交通": "住宿與交通",
    "重要注意事項": "注意事項",
    "主要來源與複查連結": "參考資訊",
  };
  const deMap = {
    "確定住宿與交通": "Unterkünfte und Verkehr",
    "重要注意事項": "Hinweise",
    "主要來源與複查連結": "Referenzen",
  };
  if (lang === "de") return deMap[section.title] || section.titleDe;
  return zhMap[section.title] || section.title;
}

function Overview({ lang }) {
  const country = itineraryData.countryInfo;
  const [primarySection, ...otherSections] = itineraryData.infoSections;
  return (
    <main className="overview-grid">
      {primarySection && (
        <section className="overview-panel">
          <div className="panel-label"><Icon name="calendar" />{overviewTitle(primarySection, lang)}</div>
          <Html html={lang === "de" ? primarySection.htmlDe : primarySection.html} />
        </section>
      )}
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
      {otherSections.map((section) => (
        <section className="overview-panel" key={section.title}>
          <div className="panel-label"><Icon name="calendar" />{overviewTitle(section, lang)}</div>
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
