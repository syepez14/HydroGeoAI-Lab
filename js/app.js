const DATA = {
  team: "data/team.json",
  projects: "data/projects.json",
  services: "data/services.json",
  equipment: "data/equipment.json",
  national: "data/collaborations_national.json",
  international: "data/collaborations_international.json",
  publications: "data/publications.json"
};

async function getJSON(path) {
  try {
    const r = await fetch(path, {cache: "no-store"});
    if (!r.ok) return [];
    return await r.json();
  } catch {
    return [];
  }
}

function safe(v) {
  return (v ?? "").toString().trim();
}

function linksHTML(item, labels = {}) {
  const keys = [
    ["linkedin", "LinkedIn"],
    ["researchgate", "ResearchGate"],
    ["orcid", "ORCID"],
    ["website", "Website"],
    ["project", "Project"],
    ["publications", "Publications"],
    ["results", "Results"],
    ["doi", "DOI"],
    ["pdf", "PDF"]
  ];

  const links = keys
    .filter(([k]) => safe(item[k]))
    .map(([k, defaultLabel]) => {
      const label = labels[k] || defaultLabel;
      return `<a href="${item[k]}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
    });

  return links.length ? `<div class="card-links">${links.join("")}</div>` : "";
}

function empty(container, message) {
  container.innerHTML = `<div class="empty-state">${message}</div>`;
}

function renderTeam(items) {
  const el = document.getElementById("team-grid");
  if (!items.length) return empty(el, "Team members will appear automatically when folders are added to /Team.");

  el.innerHTML = items.map(p => {
    const initials = safe(p.name).split(/\s+/).slice(0,2).map(x => x[0] || "").join("").toUpperCase();
    const photo = safe(p.photo)
      ? `<img class="person-photo" src="${p.photo}" alt="${p.name}" onerror="this.outerHTML='<div class=&quot;person-placeholder&quot;>${initials}</div>'">`
      : `<div class="person-placeholder">${initials}</div>`;

    const keywords = (p.keywords || []).map(k => `<span class="keyword">${k}</span>`).join("");

    return `
      <article class="dynamic-card">
        <div class="person-head">
          ${photo}
          <div>
            ${safe(p.badge) ? `<span class="role-badge">${p.badge}</span>` : ""}
            <h3>${p.name}</h3>
            ${safe(p.position) ? `<div class="person-role">${p.position}</div>` : ""}
            ${safe(p.studies) ? `<div class="person-org">${p.studies}</div>` : ""}
            ${safe(p.organization) ? `<div class="person-org">${p.organization}</div>` : ""}
          </div>
        </div>
        ${safe(p.summary) ? `<p>${p.summary}</p>` : ""}
        ${keywords ? `<div class="keywords">${keywords}</div>` : ""}
        ${linksHTML(p)}
      </article>`;
  }).join("");
}

function renderProjects(items) {
  const el = document.getElementById("projects-grid");
  if (!items.length) return empty(el, "Projects will appear automatically when folders are added to /Projects.");

  el.innerHTML = items.map(p => `
    <article class="dynamic-card">
      <div class="card-top">
        ${safe(p.type) ? `<span class="tag">${p.type}</span>` : ""}
        ${safe(p.scope) ? `<span class="tag">${p.scope}</span>` : ""}
        ${safe(p.status) ? `<span class="tag ${p.status.toLowerCase().includes("ongo") ? "status-active" : "status-closed"}">${p.status}</span>` : ""}
      </div>
      <h3>${p.name}</h3>
      ${safe(p.summary) ? `<p>${p.summary}</p>` : ""}
      <div class="meta">
        ${safe(p.period) ? `<div class="meta-item"><small>Period</small><strong>${p.period}</strong></div>` : ""}
        ${safe(p.role) ? `<div class="meta-item"><small>Role</small><strong>${p.role}</strong></div>` : ""}
      </div>
      ${linksHTML(p)}
    </article>`).join("");
}

function renderServices(items) {
  const el = document.getElementById("services-grid");
  if (!items.length) return empty(el, "Services will appear automatically when folders are added to /Services.");

  el.innerHTML = items.map(s => `
    <article class="soft-card dynamic-card">
      <div class="big-icon">${safe(s.icon) || "◈"}</div>
      <h3>${s.name}</h3>
      ${safe(s.summary) ? `<p>${s.summary}</p>` : ""}
      ${linksHTML(s)}
    </article>`).join("");
}

function renderEquipment(items) {
  const el = document.getElementById("equipment-grid");
  if (!items.length) return empty(el, "Equipment will appear automatically when folders are added to /Equipment.");

  el.innerHTML = items.map(e => `
    <article class="dynamic-card equipment-card">
      ${safe(e.photo) ? `<img class="equipment-photo" src="${e.photo}" alt="${e.name}">` : ""}
      <div class="equipment-body">
        <h3>${e.name}</h3>
        ${safe(e.model) ? `<div class="person-role">${e.model}</div>` : ""}
        ${safe(e.summary) ? `<p>${e.summary}</p>` : ""}
        ${linksHTML(e)}
      </div>
    </article>`).join("");
}

function renderCollaborations(items, target) {
  const el = document.getElementById(target);
  if (!items.length) return empty(el, "Collaborations will appear automatically when folders are added.");

  el.innerHTML = items.map(c => `
    <article class="dynamic-card">
      <h3>${c.name}</h3>
      ${safe(c.organization) ? `<div class="person-role">${c.organization}</div>` : ""}
      ${safe(c.country) ? `<div class="person-org">${c.country}</div>` : ""}
      ${safe(c.summary) ? `<p style="margin-top:14px">${c.summary}</p>` : ""}
      ${linksHTML(c)}
    </article>`).join("");
}

function renderPublications(items) {
  const el = document.getElementById("publications-grid");
  if (!items.length) return empty(el, "Publications will appear automatically when folders are added to /Publications.");

  el.innerHTML = items.map(p => `
    <article class="dynamic-card publication-card">
      <div class="card-top">
        ${safe(p.year) ? `<span class="tag">${p.year}</span>` : ""}
        ${safe(p.project_name) ? `<span class="tag">${p.project_name}</span>` : ""}
      </div>
      <h3>${p.name}</h3>
      ${safe(p.authors) ? `<p class="citation">${p.authors}</p>` : ""}
      ${safe(p.journal) ? `<p class="journal">${p.journal}</p>` : ""}
      ${linksHTML(p)}
    </article>`).join("");
}

async function init() {
  const [team, projects, services, equipment, national, international, publications] = await Promise.all([
    getJSON(DATA.team),
    getJSON(DATA.projects),
    getJSON(DATA.services),
    getJSON(DATA.equipment),
    getJSON(DATA.national),
    getJSON(DATA.international),
    getJSON(DATA.publications)
  ]);

  renderProjects(projects);
  renderServices(services);
  renderTeam(team);
  renderCollaborations(national, "collab-national-grid");
  renderCollaborations(international, "collab-international-grid");
  renderEquipment(equipment);
  renderPublications(publications);
}

init();
