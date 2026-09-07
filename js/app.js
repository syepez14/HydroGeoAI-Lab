const DATA = {
  about: "data/about.json",
  news: "data/news.json",
  team: "data/team.json",
  projects: "data/projects.json",
  services: "data/services.json",
  equipment: "data/equipment.json",
  technologies: "data/technologies.json",
  resources: "data/resources.json",
  national: "data/collaborations_national.json",
  international: "data/collaborations_international.json",
  publications: "data/publications.json",
  contact: "data/contact.json"
};

const safe = v => (v ?? "").toString().trim();

async function getJSON(path, fallback = []) {
  try {
    const r = await fetch(path, {cache: "no-store"});
    if (!r.ok) return fallback;
    return await r.json();
  } catch {
    return fallback;
  }
}

function esc(s) {
  return safe(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function iconSVG(kind) {
  const icons = {
    remote: `<svg viewBox="0 0 24 24"><path d="M4 17c4-4 8-8 16-10"/><path d="M7 6l4 4"/><path d="M14 3l4 4"/><circle cx="7" cy="17" r="2.5"/><path d="M17 13a5 5 0 0 1-5 5"/></svg>`,
    ai: `<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M9.5 14.5h5"/></svg>`,
    water: `<svg viewBox="0 0 24 24"><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/><path d="M9 15c1 1 2 1.5 3.5 1.5"/></svg>`,
    code: `<svg viewBox="0 0 24 24"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/></svg>`,
    file: `<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>`
  };
  return icons[safe(kind).toLowerCase()] || icons.remote;
}

function mediaHTML(item, cls = "content-image") {
  const src = safe(item.media || item.photo);
  if (!src) return "";
  if (safe(item.media_type) === "video") {
    return `<video class="${cls} media-clickable" src="${esc(src)}" muted autoplay loop playsinline preload="metadata"></video>`;
  }
  return `<img class="${cls} media-clickable" src="${esc(src)}" alt="${esc(item.name)}">`;
}

function linkButtons(item, definitions) {
  const out = [];
  for (const [key, label] of definitions) {
    const value = safe(item[key]);
    if (value) out.push(`<a href="${esc(value)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`);
  }
  return out.length ? `<div class="card-links">${out.join("")}</div>` : "";
}

function empty(el, text) { el.innerHTML = `<div class="empty-state">${text}</div>`; }

function renderAbout(data) {
  document.getElementById("about-intro").textContent = safe(data.intro);
  document.getElementById("about-mission").textContent = safe(data.mission);
  document.getElementById("about-vision").textContent = safe(data.vision);
  const el = document.getElementById("about-areas");
  const areas = data.areas || [];
  if (!areas.length) return empty(el, "Research areas will appear here.");
  el.innerHTML = areas.map(a => `<article class="soft-card"><div class="serious-icon">${iconSVG(a.icon)}</div><h3>${esc(a.name)}</h3><p>${esc(a.summary)}</p></article>`).join("");
}

function renderNews(items) {
  const el = document.getElementById("news-rail");
  items.sort((a,b) => safe(b.date).localeCompare(safe(a.date)));
  if (!items.length) return empty(el, "News and notices will appear automatically when folders are added to /News.");
  el.innerHTML = items.map(n => `<article class="dynamic-card news-card">${mediaHTML(n)}<div class="news-body"><div class="news-date">${esc(n.date)}${safe(n.type) ? ` · ${esc(n.type)}` : ""}</div><h3>${esc(n.name)}</h3>${safe(n.summary) ? `<p>${esc(n.summary)}</p>` : ""}${linkButtons(n, [["link","Read more"]])}</div></article>`).join("");
}

function renderProjects(items) {
  const el = document.getElementById("projects-grid");
  if (!items.length) return empty(el, "Projects will appear automatically when folders are added to /Projects.");
  el.innerHTML = items.map(p => `<article class="dynamic-card">${mediaHTML(p) ? `<div class="card-media">${mediaHTML(p)}</div>` : ""}<div class="card-top">${safe(p.type)?`<span class="tag">${esc(p.type)}</span>`:""}${safe(p.scope)?`<span class="tag">${esc(p.scope)}</span>`:""}${safe(p.status)?`<span class="tag ${p.status.toLowerCase().includes("ongo") ? "status-active":"status-closed"}">${esc(p.status)}</span>`:""}</div><h3>${esc(p.name)}</h3>${safe(p.summary)?`<p>${esc(p.summary)}</p>`:""}<div class="meta">${safe(p.period)?`<div class="meta-item"><small>Period</small><strong>${esc(p.period)}</strong></div>`:""}${safe(p.role)?`<div class="meta-item"><small>Role</small><strong>${esc(p.role)}</strong></div>`:""}</div>${linkButtons(p, [["link","Open project"],["project","Open project"],["publications","Publications"],["results","Results"]])}</article>`).join("");
}

function renderServices(items) {
  const el = document.getElementById("services-grid");
  if (!items.length) return empty(el, "Services will appear automatically when folders are added to /Services.");
  el.innerHTML = items.map(s => `<article class="soft-card dynamic-card">${mediaHTML(s) ? `<div class="card-media">${mediaHTML(s)}</div>` : `<div class="serious-icon">${iconSVG(s.icon || "remote")}</div>`}<h3>${esc(s.name)}</h3>${safe(s.summary)?`<p>${esc(s.summary)}</p>`:""}${linkButtons(s, [["website","More information"]])}</article>`).join("");
}

function memberGroup(p) {
  const position = `${safe(p.position)} ${safe(p.studies)}`.toLowerCase();
  if (/principal investigator|lab leader|director.*lab|head.*lab/.test(position)) return {key:"leader",label:"Lab Leader",rank:0};
  if (/researcher|investigator|investigador|academic|professor|postdoc/.test(position)) return {key:"researchers",label:"Researchers",rank:1};
  if (/ph\.d|msc|m\.sc|master|mag[ií]ster|doctoral|postgraduate|postgrado/.test(position)) return {key:"postgraduate",label:"Postgraduate Students",rank:2};
  if (/undergraduate|pregrado|bachelor|thesis student|tesista/.test(position)) return {key:"undergraduate",label:"Undergraduate Students",rank:3};
  return {key:"other",label:"Other Members",rank:4};
}

function personCard(p, flag = "") {
  const initials = safe(p.name).split(/\s+/).slice(0,2).map(x => x[0] || "").join("").toUpperCase();
  const media = safe(p.media || p.photo);
  const avatar = media ? (safe(p.media_type)==="video" ? `<video class="media-clickable" src="${esc(media)}" muted autoplay loop playsinline></video>` : `<img class="media-clickable" src="${esc(media)}" alt="${esc(p.name)}">`) : esc(initials);
  const keywords = (p.keywords || []).map(k => `<span class="keyword">${esc(k)}</span>`).join("");
  return `<article class="dynamic-card person-card"><div class="person-head"><div class="person-media">${avatar}</div><div><h3>${esc(p.name)}${flag ? `<span class="flag">${flag}</span>`:""}</h3>${safe(p.position)?`<div class="person-role">${esc(p.position)}</div>`:""}${safe(p.studies)?`<div class="person-org">${esc(p.studies)}</div>`:""}${safe(p.organization)?`<div class="person-org">${esc(p.organization)}</div>`:""}</div></div>${safe(p.summary)?`<p>${esc(p.summary)}</p>`:""}${keywords?`<div class="keywords">${keywords}</div>`:""}${linkButtons(p, [["linkedin","LinkedIn"],["researchgate","ResearchGate"],["orcid","ORCID"],["website","Website"]])}</article>`;
}

function renderTeam(items) {
  const el = document.getElementById("team-groups");
  if (!items.length) return empty(el, "Team members will appear automatically when folders are added to /Team.");
  const groups = new Map();
  items.forEach(p => { const g = memberGroup(p); if(!groups.has(g.key)) groups.set(g.key,{...g,items:[]}); groups.get(g.key).items.push(p); });
  const ordered = [...groups.values()].sort((a,b)=>a.rank-b.rank);
  el.innerHTML = ordered.map(g => `<details class="group-accordion" ${g.key==="leader" ? "open":""}><summary><span>${g.label}</span><span>${g.items.length}</span></summary><div class="group-content"><div class="two-grid">${g.items.sort((a,b)=>a.name.localeCompare(b.name)).map(p=>personCard(p)).join("")}</div></div></details>`).join("");
}

const COUNTRY_FLAGS = {chile:"🇨🇱",italy:"🇮🇹",italia:"🇮🇹",spain:"🇪🇸",españa:"🇪🇸",germany:"🇩🇪",alemania:"🇩🇪",france:"🇫🇷",francia:"🇫🇷",usa:"🇺🇸","united states":"🇺🇸",canada:"🇨🇦",brazil:"🇧🇷",brasil:"🇧🇷",argentina:"🇦🇷",peru:"🇵🇪",perú:"🇵🇪",ecuador:"🇪🇨",colombia:"🇨🇴",mexico:"🇲🇽",méxico:"🇲🇽",uk:"🇬🇧","united kingdom":"🇬🇧",portugal:"🇵🇹",australia:"🇦🇺",japan:"🇯🇵",japón:"🇯🇵"};
function countryFlag(country){return COUNTRY_FLAGS[safe(country).toLowerCase()] || "🌐";}

function renderCollaborations(national, international) {
  const el = document.getElementById("collaboration-groups");
  const groups = [{label:"National Collaborations",items:national},{label:"International Collaborations",items:international}];
  el.innerHTML = groups.map(g => `<details class="group-accordion"><summary><span>${g.label}</span><span>${g.items.length}</span></summary><div class="group-content">${g.items.length ? `<div class="two-grid">${g.items.map(c=>personCard(c,countryFlag(c.country))).join("")}</div>` : `<div class="empty-state">No collaborators added yet.</div>`}</div></details>`).join("");
}

function renderEquipment(items) {
  const el = document.getElementById("equipment-grid");
  if (!items.length) return empty(el, "Equipment will appear automatically when folders are added to /Equipment.");
  el.innerHTML = items.map(e=>`<article class="dynamic-card equipment-card">${mediaHTML(e) || `<div class="equipment-placeholder">◇</div>`}<div class="equipment-body"><h3>${esc(e.name)}</h3>${safe(e.model)?`<div class="person-role">${esc(e.model)}</div>`:""}${safe(e.summary)?`<p>${esc(e.summary)}</p>`:""}${linkButtons(e,[["website","More information"]])}</div></article>`).join("");
}

function renderTechnologies(items) {
  const el = document.getElementById("technologies-grid");
  if (!items.length) return empty(el, "Software and digital developments will appear automatically when folders are added to /Technologies.");
  el.innerHTML = items.map(t=>`<article class="dynamic-card technology-card">${mediaHTML(t) || `<div class="equipment-placeholder">${iconSVG("code")}</div>`}<div class="technology-body"><h3>${esc(t.name)}</h3>${safe(t.version)?`<div class="person-role">Version ${esc(t.version)}</div>`:""}${safe(t.summary)?`<p>${esc(t.summary)}</p>`:""}${linkButtons(t,[["link","Open technology"],["repository","Repository"]])}</div></article>`).join("");
}

function renderResources(items) {
  const el = document.getElementById("resources-grid");
  if (!items.length) return empty(el, "Manuals, classes and other resources will appear automatically when folders are added to /Resources.");
  el.innerHTML = items.map(r=>`<article class="dynamic-card resource-card">${mediaHTML(r) || `<div class="equipment-placeholder">${iconSVG("file")}</div>`}<div class="resource-body"><div class="card-top">${safe(r.type)?`<span class="tag">${esc(r.type)}</span>`:""}</div><h3>${esc(r.name)}</h3>${safe(r.summary)?`<p>${esc(r.summary)}</p>`:""}${linkButtons({...r, file:r.download},[["link","Open resource"],["file","Open file"]])}</div></article>`).join("");
}

function normalizeDOI(v) {
  let doi = safe(v).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "");
  return doi ? `https://doi.org/${doi}` : "";
}

function renderPublications(items) {
  const el = document.getElementById("publications-list");
  items.sort((a,b) => Number(b.year || 0)-Number(a.year || 0) || a.name.localeCompare(b.name));
  if (!items.length) return empty(el, "Publications will appear automatically when folders are added to /Publications.");
  el.innerHTML = items.map(p=>{const doi=normalizeDOI(p.doi);const link=safe(p.link)||doi;return `<article class="publication-item"><div class="publication-year">${esc(p.year)}</div><div><div class="publication-title">${esc(p.name)}</div>${doi?`<div class="publication-doi">${esc(safe(p.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i,""))}</div>`:""}</div><div class="publication-actions">${doi?`<a href="${esc(doi)}" target="_blank" rel="noopener noreferrer">DOI ↗</a>`:""}${link && link!==doi?`<a href="${esc(link)}" target="_blank" rel="noopener noreferrer">Link ↗</a>`:""}</div></article>`}).join("");
}

function renderContact(c) {
  const email = safe(c.email) || "syepez@udec.cl";
  document.getElementById("contact-email").textContent = email;
  document.getElementById("email-button").href = `mailto:${email}?subject=HydroGeoAI%20Lab%20-%20Contact&body=Hello%20HydroGeoAI%20Lab%2C%0A%0AI%20would%20like%20to%20contact%20you%20regarding%3A%0A%0A`;
  document.getElementById("contact-location").textContent = safe(c.location) || "Concepción, Chile";
  const lat = safe(c.latitude) || "-36.834495", lon = safe(c.longitude) || "-73.032547";
  document.getElementById("map-frame").src = `https://www.google.com/maps?q=${lat},${lon}&z=16&output=embed`;
  document.getElementById("map-link").href = safe(c.maplink) || "https://maps.app.goo.gl/EthMW9VcD7aecfzE7";
  const socials = [["instagram","Instagram"],["facebook","Facebook"],["linkedin","LinkedIn"],["youtube","YouTube"],["x","X"],["researchgate","ResearchGate"],["website","Website"]];
  document.getElementById("social-links").innerHTML = socials.filter(([k])=>safe(c[k])).map(([k,l])=>`<a href="${esc(c[k])}" target="_blank" rel="noopener noreferrer">${l} ↗</a>`).join("");
}

function setupRails() {
  document.querySelectorAll("[data-scroll]").forEach(btn=>btn.addEventListener("click",()=>{const rail=document.getElementById(btn.dataset.scroll);rail?.scrollBy({left:Number(btn.dataset.dir)*380,behavior:"smooth"});}));
}

function setupMediaModal() {
  const modal=document.getElementById("media-modal"), stage=document.getElementById("media-stage"), close=document.getElementById("media-close");
  function open(src,type){if(!src)return; stage.innerHTML=type==="video"?`<video src="${esc(src)}" controls autoplay></video>`:`<img src="${esc(src)}" alt="Expanded media">`; modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
  function shut(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");stage.innerHTML="";document.body.style.overflow="";}
  document.addEventListener("click",e=>{const t=e.target;if(t.matches("img.zoomable, img.media-clickable"))open(t.currentSrc||t.src,"image");else if(t.matches("video.media-clickable"))open(t.currentSrc||t.src,"video");});
  close.addEventListener("click",shut);modal.addEventListener("click",e=>{if(e.target===modal)shut();});document.addEventListener("keydown",e=>{if(e.key==="Escape")shut();});
}

async function init() {
  const [about,news,projects,services,team,national,international,equipment,technologies,resources,publications,contact] = await Promise.all([
    getJSON(DATA.about,{}),getJSON(DATA.news),getJSON(DATA.projects),getJSON(DATA.services),getJSON(DATA.team),getJSON(DATA.national),getJSON(DATA.international),getJSON(DATA.equipment),getJSON(DATA.technologies),getJSON(DATA.resources),getJSON(DATA.publications),getJSON(DATA.contact,{})
  ]);
  renderAbout(about);renderNews(news);renderProjects(projects);renderServices(services);renderTeam(team);renderCollaborations(national,international);renderEquipment(equipment);renderTechnologies(technologies);renderResources(resources);renderPublications(publications);renderContact(contact);setupRails();setupMediaModal();
}

init();
