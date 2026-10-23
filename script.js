const data = window.WEDDING || { tables: [], photos: [] };
const galleryRoot = document.getElementById("gallery-root");
const hall = document.getElementById("hall");
const tableList = document.getElementById("table-list");
const resultBox = document.getElementById("search-result");
const queryInput = document.getElementById("seat-query");
const clearButton = document.getElementById("search-clear");
const form = document.getElementById("seat-form");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s\u3000]+/g, "")
    .replace(/[．·・,，。]/g, "");
}

function extractId(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const fromPath = text.match(/\/(?:folders|d)\/([a-zA-Z0-9_-]+)/);
  if (fromPath) return fromPath[1];
  const fromQuery = text.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (fromQuery) return fromQuery[1];
  if (/^[a-zA-Z0-9_-]{10,}$/.test(text)) return text;
  return "";
}

function isHttpUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isDriveValue(value) {
  const text = String(value || "");
  return /drive\.google\.com|docs\.google\.com/i.test(text) || /^[a-zA-Z0-9_-]{10,}$/.test(text.trim());
}

function photoEntries() {
  return (data.photos || [])
    .map((item) => {
      if (typeof item === "string") return { url: item, caption: "" };
      return { url: item.url || item.src || item.link || "", caption: item.caption || item.name || "" };
    })
    .filter((item) => item.url);
}

function imageCandidates(entry) {
  const id = extractId(entry.url);
  if (id && isDriveValue(entry.url)) {
    const safeId = encodeURIComponent(id);
    return [
      `https://lh3.googleusercontent.com/d/${safeId}=w1600`,
      `https://drive.google.com/thumbnail?id=${safeId}&sz=w1600`,
      `https://drive.google.com/uc?export=view&id=${safeId}`,
    ];
  }
  return isHttpUrl(entry.url) ? [entry.url] : [];
}

function guestBlob(guest) {
  return normalize([guest.name, guest.title, guest.diet, ...(guest.aliases || [])].filter(Boolean).join(" "));
}

function guestLabel(guest) {
  const name = guest.name || "";
  return guest.count > 1 ? `${name}（${guest.count} 位）` : name;
}

function guestExtra(guest) {
  const nameKey = normalize(guest.name);
  const parts = [];
  [guest.title, ...(guest.aliases || [])].filter(Boolean).forEach((part) => {
    const key = normalize(part);
    if (!key || key === nameKey) return;
    const alreadyShown = parts.some((existing) => {
      const existingKey = normalize(existing);
      return existingKey.includes(key) || key.includes(existingKey);
    });
    if (!alreadyShown) parts.push(part);
  });
  return parts.join(" · ");
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function tick() {
  const weddingDate = data.dateISO ? new Date(data.dateISO) : null;
  const diff = weddingDate ? Math.max(0, weddingDate.getTime() - Date.now()) : 0;
  document.getElementById("days").textContent = pad(Math.floor(diff / 86400000));
  document.getElementById("hours").textContent = pad(Math.floor((diff % 86400000) / 3600000));
  document.getElementById("minutes").textContent = pad(Math.floor((diff % 3600000) / 60000));
  document.getElementById("seconds").textContent = pad(Math.floor((diff % 60000) / 1000));
}

function renderDay() {
  const grid = document.getElementById("info-grid");
  if (!grid) return;
  const card = el("article", "info-card");
  card.append(el("p", "info-label", "婚禮"));
  const row = el("div", "info-row");
  row.append(el("p", "", data.dateLabel || ""));
  if (data.timeLabel) row.append(el("p", "", data.timeLabel));
  else if (data.weekday) row.append(el("p", "", data.weekday));
  card.append(row);
  if (data.venue) card.append(el("p", "info-place", data.venue));
  if (data.timeLabel && data.weekday) card.append(el("p", "info-place", data.weekday));
  grid.replaceChildren(card);
  renderTimeline();
}

function renderTimeline() {
  const root = document.getElementById("timeline");
  if (!root) return;
  const stops = data.schedule || [];
  root.replaceChildren();
  root.hidden = !stops.length;
  stops.forEach((stop) => {
    const station = el("article", "station");
    station.append(el("p", "station-stop", stop.stop || ""));
    station.append(el("h3", "", stop.title || ""));
    if (stop.place) station.append(el("p", "station-place", stop.place));
    const events = el("ol", "events");
    (stop.events || []).forEach((item) => {
      const li = document.createElement("li");
      if (item.time) li.append(el("p", "event-time", item.time));
      li.append(el("p", "event-title", item.title || ""));
      if (item.note) li.append(el("p", "event-note", item.note));
      if (item.stages?.length) {
        const details = document.createElement("details");
        details.className = "event-details";
        const summary = document.createElement("summary");
        summary.textContent = item.stagesTitle || "查看階段";
        details.append(summary);
        const list = el("ul", "stage-list");
        item.stages.forEach((stage) => list.append(el("li", "", stage)));
        details.append(list);
        li.append(details);
      }
      if (item.link?.href) {
        const link = el("a", "doc-link", item.link.label || "開啟");
        link.href = item.link.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        li.append(link);
      }
      events.append(li);
    });
    station.append(events);
    root.append(station);
  });
}

function fillHero() {
  const nameA = data.partnerA || "J";
  const nameB = data.partnerB || "L";
  document.getElementById("name-a").textContent = nameA;
  document.getElementById("name-b").textContent = nameB;
  document.getElementById("hero-date").textContent = data.dateLabel || "";
  const meta = [data.weekday, data.timeLabel, data.venue].filter(Boolean).join(" · ");
  const sub = document.getElementById("hero-sub");
  sub.textContent = meta;
  sub.hidden = !meta;
  document.title = `${nameA} & ${nameB} · 1024`;
  document.getElementById("sample-note").hidden = !data.sampleSeating;
  tick();
}

function renderGuide() {
  const guide = el("div", "gallery-guide");
  guide.append(
    el("h3", "", "接上 Google Drive 相簿"),
    el("p", "", "把資料夾設成「知道連結的任何人」都能檢視，再把連結貼到 wedding-data.js。")
  );
  const steps = document.createElement("ol");
  [
    "在 Google Drive 建立資料夾並上傳婚照。",
    "按「共用」，一般存取權改成知道連結的任何人，身分為檢視者。",
    "把資料夾連結貼到 driveFolder。若嵌入相簿沒有出現照片，改把每一張照片的連結放到 photos。",
  ].forEach((step) => steps.append(el("li", "", step)));
  guide.append(steps);
  return guide;
}

function renderFolder(folderId) {
  const shell = el("div", "drive-shell");
  const frame = document.createElement("iframe");
  frame.className = "drive-frame";
  frame.title = "Google Drive 婚照";
  frame.loading = "lazy";
  frame.referrerPolicy = "no-referrer-when-downgrade";
  frame.src = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#grid`;
  shell.append(frame);
  return shell;
}

function renderPhoto(entry) {
  const candidates = imageCandidates(entry);
  const figure = el("figure", "photo");
  const button = document.createElement("button");
  button.type = "button";
  const caption = entry.caption || "婚照";
  button.setAttribute("aria-label", `放大${caption}`);
  if (!candidates.length) {
    figure.classList.add("is-broken");
    figure.append(button);
    return figure;
  }
  const image = document.createElement("img");
  image.alt = caption;
  image.loading = "lazy";
  image.dataset.i = "0";
  image.src = candidates[0];
  image.addEventListener("error", () => {
    const next = Number(image.dataset.i || 0) + 1;
    if (next < candidates.length) {
      image.dataset.i = String(next);
      image.src = candidates[next];
      return;
    }
    figure.classList.add("is-broken");
  });
  button.append(image);
  button.addEventListener("click", () => {
    if (figure.classList.contains("is-broken")) return;
    lightboxImg.src = image.currentSrc || image.src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = entry.caption || "";
    lightbox.showModal();
  });
  figure.append(button);
  if (entry.caption) figure.append(el("figcaption", "", entry.caption));
  return figure;
}

function renderGallery() {
  galleryRoot.replaceChildren();
  const photos = photoEntries();
  const folderId = extractId(data.driveFolder);
  const tools = el("div", "gallery-tools");

  if (photos.length) {
    const grid = el("div", "photo-grid");
    photos.forEach((entry) => grid.append(renderPhoto(entry)));
    galleryRoot.append(grid);
  }

  if (folderId) {
    if (!photos.length) galleryRoot.append(renderFolder(folderId));
    const link = el("a", "drive-link", "在 Google Drive 開啟相簿");
    link.href = `https://drive.google.com/drive/folders/${encodeURIComponent(folderId)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    tools.append(link);
    galleryRoot.append(tools);
    return;
  }

  if (!photos.length) galleryRoot.append(renderGuide());
}

function tableCaption(table) {
  return table.label ? `第 ${table.id} 桌　${table.label}` : `第 ${table.id} 桌`;
}

function searchSummary(matches) {
  const groups = [];
  matches.forEach(({ guest, table }) => {
    const key = normalize(guest.name);
    let group = groups.find((item) => item.key === key);
    if (!group) {
      group = { key, name: guestLabel(guest), places: [] };
      groups.push(group);
    }
    const place = tableCaption(table);
    if (!group.places.includes(place)) group.places.push(place);
  });
  return groups.map((group) => (
    group.places.length > 1
      ? `${group.name} 有 ${group.places.length} 位：${group.places.join("、")}。`
      : `${group.name} 在${group.places[0]}。`
  )).join("\n");
}

function renderSeating() {
  hall.replaceChildren();
  tableList.replaceChildren();
  hall.append(el("p", "hall-label", "喜宴"));
  const map = el("div", "table-map");

  (data.tables || []).forEach((table) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `table-dot${table.label === "主桌" ? " is-main" : ""}`;
    dot.dataset.table = table.id;
    dot.setAttribute("aria-label", tableCaption(table));
    dot.append(el("span", "table-index", String(table.id)));
    if (table.label) dot.append(el("span", "table-note", table.label));
    dot.addEventListener("click", () => focusTable(table.id));
    map.append(dot);

    const card = el("article", "table-card");
    card.id = `table-${table.id}`;
    card.dataset.table = table.id;
    const guests = table.guests || [];
    const seats = guests.reduce((sum, guest) => sum + (Number(guest.count) || 1), 0);
    card.append(el("p", "card-kicker", seats ? `第 ${table.id} 桌 · ${seats} 位` : `第 ${table.id} 桌`));
    card.append(el("h3", "", table.label || `第 ${table.id} 桌`));
    if (table.note) card.append(el("p", "card-note", table.note));
    if (guests.length) {
      const list = el("ul", "guest-list");
      guests.forEach((guest) => {
        const item = document.createElement("li");
        item.dataset.blob = guestBlob(guest);
        const line = el("span", "guest-line");
        line.append(el("span", "guest-name", guest.name || ""));
        if (guest.count > 1) line.append(el("span", "guest-count", `${guest.count} 位`));
        item.append(line);
        const extra = guestExtra(guest);
        if (extra) item.append(el("span", "guest-title", extra));
        if (guest.diet) item.append(el("span", "guest-diet", guest.diet));
        list.append(item);
      });
      card.append(list);
    }
    tableList.append(card);
  });

  hall.append(map);
}

function paintSelection(id) {
  document.querySelectorAll("[data-table]").forEach((node) => {
    node.classList.toggle("is-selected", Boolean(id) && node.dataset.table === id);
  });
}

function focusTable(id) {
  paintSelection(id);
  document.getElementById(`table-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function searchGuests(raw, options = {}) {
  const query = normalize(raw);
  clearButton.hidden = !query;
  const matches = [];

  document.querySelectorAll(".table-card").forEach((card) => {
    let tableHit = false;
    card.querySelectorAll(".guest-list li").forEach((item) => {
      const hit = Boolean(query) && item.dataset.blob.includes(query);
      item.classList.toggle("is-hit", hit);
      if (hit) tableHit = true;
    });
    card.classList.toggle("is-match", tableHit);
    card.classList.toggle("is-dim", Boolean(query) && !tableHit);
    const dot = document.querySelector(`.table-dot[data-table="${CSS.escape(card.dataset.table)}"]`);
    if (dot) {
      dot.classList.toggle("is-match", tableHit);
      dot.classList.toggle("is-dim", Boolean(query) && !tableHit);
    }
  });

  if (!query) {
    paintSelection("");
    resultBox.replaceChildren();
    return;
  }

  (data.tables || []).forEach((table) => {
    (table.guests || []).forEach((guest) => {
      if (guestBlob(guest).includes(query)) matches.push({ guest, table });
    });
  });

  resultBox.replaceChildren();
  if (!matches.length) {
    paintSelection("");
    resultBox.append(el("p", "", "找不到這位賓客。可以試試全名、暱稱，或舅舅、同事這類稱呼。"));
    return;
  }

  matches.sort((a, b) => {
    const rank = (guest) => (normalize(guest.name) === query ? 0 : 1);
    return rank(a.guest) - rank(b.guest);
  });

  const summary = matches.length === 1
    ? `${guestLabel(matches[0].guest)} 在${tableCaption(matches[0].table)}。`
    : searchSummary(matches);
  resultBox.append(el("p", "", summary));

  if (matches.length > 1) {
    paintSelection("");
    const list = el("div", "result-list");
    matches.forEach(({ guest, table }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "result-person";
      const who = el("span", "who");
      who.append(el("span", "result-name", guestLabel(guest)));
      const extra = [guestExtra(guest), guest.diet].filter(Boolean).join(" · ");
      if (extra) who.append(el("span", "result-title", extra));
      const place = el("span", "result-table");
      place.append(el("span", "result-table-no", `第 ${table.id} 桌`));
      if (table.label) place.append(el("span", "result-table-name", table.label));
      button.append(who, place);
      button.addEventListener("click", () => focusTable(table.id));
      list.append(button);
    });
    resultBox.append(list);
    return;
  }

  if (options.focus) focusTable(matches[0].table.id);
  else paintSelection(matches[0].table.id);
}

fillHero();
renderDay();
renderGallery();
renderSeating();
setInterval(tick, 1000);

const topnav = document.querySelector(".topnav");
function syncNav() {
  topnav.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.72);
}
syncNav();
window.addEventListener("scroll", syncNav, { passive: true });

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchGuests(queryInput.value, { focus: true });
});

queryInput.addEventListener("input", () => searchGuests(queryInput.value));

clearButton.addEventListener("click", () => {
  queryInput.value = "";
  searchGuests("");
  queryInput.focus();
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

lightbox.addEventListener("close", () => {
  lightboxImg.removeAttribute("src");
});
