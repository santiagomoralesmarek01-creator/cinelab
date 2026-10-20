(function () {
  "use strict";

  const { items, categorias, equipo } = window.CINELAB_DATA;
  const itemsById = Object.fromEntries(items.map(i => [i.id, i]));
  // Puntaje original de data.js; un admin puede reemplazarlo desde el sitio.
  items.forEach(i => { i.ratingBase = i.rating; });
  const articulos = window.CINELAB_ARTICULOS || [];
  const articulosById = Object.fromEntries(articulos.map(a => [a.id, a]));
  const catNames = Object.keys(categorias);
  const Store = window.CinelabStore;
  const Ach = window.CinelabAchievements;

  // Las animaciones se apagan si la persona pidió "reducir movimiento" en su sistema.
  const motion = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (motion) document.documentElement.classList.add("motion");

  const state = {
    user: null,
    reviews: [],
    watchlist: [],
    content: {},          // fotos y firmas cargadas por el admin
    catalogo: { q: "", cat: "Todas", tipo: "Todos", anio: "Todos", min: "0", orden: "rating" },
    resenas: { cat: "Todas", orden: "recientes" },
    articulos: { tag: "Todos" },
    authTab: "login",
    animateNext: true,    // animar la próxima vista (al navegar, no al recargar datos)
    popLike: null,
    roulette: 0
  };

  const $ = sel => document.querySelector(sel);
  const app = $("#app");

  // --------------------------------------------------------------- utilidades
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function stars(n) {
    return `<span class="stars" aria-label="${n} de 5 estrellas">${"★".repeat(n)}<span class="off">${"★".repeat(5 - n)}</span></span>`;
  }

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
  }

  function truncate(text, n) { return text.length > n ? text.slice(0, n).replace(/\s+\S*$/, "") + "…" : text; }

  function reviewsFor(itemId) { return state.reviews.filter(r => r.itemId === itemId); }

  // Promedio de la comunidad llevado a escala de 10 para compararlo con la del equipo.
  function communityScore(itemId) {
    const list = reviewsFor(itemId);
    if (!list.length) return null;
    return (list.reduce((n, r) => n + r.rating, 0) / list.length * 2).toFixed(1);
  }

  // Puntaje para ordenar y filtrar: el del equipo o, si no tiene, el de la comunidad.
  function score(i) {
    return i.rating != null ? i.rating : Number(communityScore(i.id) || 0);
  }

  function initials(name) { return esc((name || "?").slice(0, 2).toUpperCase()); }

  function safeImg(url) { return Store.isSafeImage(url) ? url : null; }

  function avatar(name, url, opts) {
    opts = opts || {};
    const inner = safeImg(url) ? `<img src="${esc(url)}" alt="" loading="lazy">` : initials(name);
    const cls = "avatar" + (opts.cls ? " " + opts.cls : "");
    return opts.href ? `<a class="${cls}" href="${opts.href}">${inner}</a>` : `<span class="${cls}">${inner}</span>`;
  }

  function itemPhoto(i) { return safeImg(state.content["img:item:" + i.id]); }
  function articlePhoto(a) { return safeImg(state.content["img:article:" + a.id]); }
  function articleAuthorRaw(a) { return state.content["author:article:" + a.id] || a.autor || ""; }
  function articleAuthor(a) { return articleAuthorRaw(a) || "Equipo CineLab"; }

  function catHue(cat) { return [28, 350, 265, 210, 150, 45][Math.max(0, catNames.indexOf(cat)) % 6]; }

  // Foto de la película o, si todavía no tiene, un afiche generado con su título.
  function poster(i, cls) {
    const url = itemPhoto(i);
    return `<div class="poster${cls ? " " + cls : ""}">${url
      ? `<img src="${esc(url)}" alt="${esc(i.titulo)}" loading="lazy">`
      : `<div class="poster-ph" style="--h:${catHue(i.categoria)}"><span class="ph-title">${esc(i.titulo)}</span><span class="ph-year">${esc(i.tipo)} · ${esc(i.anio)}</span></div>`}</div>`;
  }

  function toast(html, kind) {
    const el = document.createElement("div");
    el.className = "toast" + (kind ? " " + kind : "");
    el.innerHTML = html;
    const box = $("#toasts");
    box.appendChild(el);
    while (box.children.length > 4) box.firstChild.remove();
    setTimeout(() => el.classList.add("out"), 4200);
    setTimeout(() => el.remove(), 4700);
  }

  function isAdmin() { return Boolean(state.user && state.user.isAdmin); }

  function requireLogin(message) {
    if (state.user) return true;
    openAuth("login", message || "Ingresá para usar esta función.");
    return false;
  }

  // ------------------------------------------------------------------- fotos
  // Abre el selector de archivos. Tiene que llamarse directo desde un click.
  function pickImage() {
    return new Promise(resolve => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg,image/png,image/webp";
      input.onchange = () => resolve(input.files[0] || null);
      input.click();
    });
  }

  function uploadAndApply(kind, apply, okMessage) {
    pickImage().then(async file => {
      if (!file) return;
      toast("Subiendo foto…");
      try {
        const url = await Store.uploadImage(file, kind);
        await apply(url);
        toast(okMessage);
        await reload();
      } catch (err) { toast(esc(err.message), "error"); }
    });
  }

  async function runAndReload(fn, okMessage) {
    try { await fn(); toast(okMessage); await reload(); }
    catch (err) { toast(esc(err.message), "error"); }
  }

  // ------------------------------------------------------- puntaje del equipo
  function ratingForm(i) {
    return `
      <form class="rating-form" data-id="${esc(i.id)}">
        <input type="text" inputmode="decimal" name="rating" maxlength="4" value="${i.rating != null ? String(i.rating).replace(".", ",") : ""}" placeholder="0 a 10" aria-label="Puntaje del equipo para ${esc(i.titulo)}">
        <button class="btn btn-small" type="submit">Guardar</button>
        ${i.rating != null ? `<button class="link-btn danger" type="button" data-action="clear-team-rating" data-id="${esc(i.id)}">Quitar</button>` : ""}
      </form>`;
  }

  async function saveTeamRating(itemId, rating) {
    await runAndReload(() => Store.setTeamRating(itemId, rating),
      rating === null ? "Se quitó el puntaje del equipo." : `Puntaje del equipo actualizado: ★ ${rating}`);
  }

  // Formularios de puntaje (ficha y panel admin), por delegación.
  document.addEventListener("submit", e => {
    const form = e.target.closest(".rating-form");
    if (!form) return;
    e.preventDefault();
    const raw = form.rating.value.trim().replace(",", ".");
    if (raw === "") return toast("Escribí un puntaje de 0 a 10.", "error");
    saveTeamRating(form.dataset.id, Math.round(Number(raw) * 10) / 10);
  });

  // ------------------------------------------------------------------- datos
  async function reload() {
    try {
      const overrides = await Store.getTeamRatings();
      items.forEach(i => { i.rating = i.id in overrides ? overrides[i.id] : i.ratingBase; });
    } catch (e) { /* se usan los puntajes de data.js */ }
    try { state.content = await Store.getSiteContent(); } catch (e) { state.content = {}; }
    try {
      state.reviews = await Store.listReviews();
      state.watchlist = await Store.getWatchlist();
    } catch (e) {
      toast("No pudimos cargar las reseñas: " + esc(e.message), "error");
    }
    state.user = Store.user();
    checkNewMedals();
    renderHeader();
    render();
  }

  // Muestra un aviso por cada medalla nueva desde la última visita.
  function checkNewMedals() {
    if (!state.user) return;
    const p = Ach.profile(state.user.id, state.reviews, itemsById, state.watchlist);
    const unlocked = p.medals.filter(m => m.unlocked).map(m => m.id);
    const seen = Store.seenMedals(state.user.id);
    if (seen) {
      p.medals.filter(m => m.unlocked && !seen.includes(m.id)).forEach(m =>
        toast(`<span class="toast-icon">${m.icon}</span><div><strong>¡Nueva medalla!</strong><br>${esc(m.name)}</div>`, "medal"));
    }
    Store.setSeenMedals(state.user.id, Array.from(new Set((seen || []).concat(unlocked))));
  }

  // ------------------------------------------------------------------ header
  function renderHeader() {
    const box = $("#authBox");
    if (!state.user) {
      box.innerHTML = `<button class="btn btn-small" data-action="open-auth">Ingresar</button>`;
      return;
    }
    const p = Ach.profile(state.user.id, state.reviews, itemsById, state.watchlist);
    box.innerHTML = `
      <a class="user-chip" href="#/perfil" title="Mi perfil y medallas">
        ${avatar(state.user.username, state.user.avatarUrl)}
        <span class="user-chip-text"><strong>${esc(state.user.username)}</strong><small>${isAdmin() ? "Admin · " : ""}${esc(p.level.name)} · ${p.xp} XP</small></span>
      </a>`;
  }

  function setActiveNav(page) {
    document.querySelectorAll("#mainNav a").forEach(a =>
      a.classList.toggle("active", a.dataset.page === (page || "inicio")));
  }

  // -------------------------------------------------------------- movimiento
  const REVEAL = ".card, .article-card, .review, .medal, .podium li, .ranking li, .stats > div, .admin-row, .team-review, .cat-intro, .featured, .join, .levels li";
  let observer = null;

  function animateIn(root) {
    if (!motion || !("IntersectionObserver" in window)) return;
    if (!observer) {
      observer = new IntersectionObserver(entries => entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        observer.unobserve(el);
        if (el.classList.contains("signature")) { el.classList.add("signed"); return; }
        el.classList.add("in");
        // Al terminar se sacan las clases para que no interfieran con el hover.
        const done = () => el.classList.remove("reveal", "in");
        el.addEventListener("transitionend", ev => { if (ev.target === el) done(); }, { once: false });
        setTimeout(done, 1600);
      }), { rootMargin: "0px 0px -30px 0px" });
    }
    root.querySelectorAll(REVEAL).forEach(el => {
      const idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--d", Math.min(idx, 8) * 70 + "ms");
      el.classList.add("reveal");
      observer.observe(el);
    });
    root.querySelectorAll(".signature").forEach(el => observer.observe(el));
  }

  // Números que cuentan desde 0 (estadísticas del perfil y puntajes).
  function countUp(root) {
    if (!motion) return;
    root.querySelectorAll("[data-count]").forEach(el => {
      const target = Number(el.dataset.count);
      if (!isFinite(target)) return;
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / 900);
        el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  // ------------------------------------------------------------------ router
  function currentRoute() {
    const [page, arg] = location.hash.replace(/^#\/?/, "").split("/");
    return { page: page || "inicio", arg: arg ? decodeURIComponent(arg) : null };
  }

  function render() {
    const { page, arg } = currentRoute();
    setActiveNav(page === "articulo" ? "articulos" : page === "titulo" ? "catalogo" : page);
    document.title = "CineLab — Reseñas de cine y series";
    const views = {
      inicio: viewHome, catalogo: viewCatalog, titulo: viewTitle, resenas: viewReviews,
      articulos: viewArticles, articulo: viewArticle, ranking: viewRanking, admin: viewAdmin,
      perfil: viewProfile, usuario: viewProfile, medallas: viewMedalsInfo, contacto: viewContact
    };
    if (observer) observer.disconnect();
    (views[page] || viewNotFound)(arg);
    const animate = state.animateNext;
    state.animateNext = false;
    app.classList.remove("page-in");
    if (motion && animate) {
      void app.offsetWidth; // reinicia la animación de entrada
      app.classList.add("page-in");
      animateIn(app);
      countUp(app);
    }
    state.popLike = null;
  }

  // ----------------------------------------------------------- componentes
  function card(i) {
    const community = communityScore(i.id);
    const n = reviewsFor(i.id).length;
    return `
      <a class="card" href="#/titulo/${esc(i.id)}">
        <div class="card-media">
          ${poster(i)}
          ${i.rating != null ? `<span class="badge-score">★ ${esc(i.rating)}</span>` : ""}
        </div>
        <div class="card-body">
          <p class="cat">${esc(i.categoria)}</p>
          <h3>${esc(i.titulo)}</h3>
          <p class="meta">${esc(i.tipo)} · ${esc(i.anio)}</p>
          <p class="snippet">${esc(i.sinopsis)}</p>
          <p class="card-foot">${n ? `💬 ${n} ${n === 1 ? "reseña" : "reseñas"} · comunidad ${community}` : "Sin reseñas todavía"}${state.watchlist.includes(i.id) ? " · 📌 en tu lista" : ""}</p>
        </div>
      </a>`;
  }

  function reviewPhoto(r) {
    const url = safeImg(r.photoUrl);
    return url ? `<button class="review-photo" data-action="zoom" data-src="${esc(url)}" aria-label="Ampliar foto"><img src="${esc(url)}" alt="Foto de la reseña de ${esc(r.username)}" loading="lazy"></button>` : "";
  }

  function reviewCard(r, opts) {
    opts = opts || {};
    const item = itemsById[r.itemId];
    const mine = state.user && r.userId === state.user.id;
    const liked = state.user && r.likes.includes(state.user.id);
    const moderate = isAdmin() && !mine;
    return `
      <article class="review">
        <header class="review-head">
          ${avatar(r.username, r.avatarUrl, { href: "#/usuario/" + esc(r.userId) })}
          <div>
            <a class="review-user" href="#/usuario/${esc(r.userId)}">${esc(r.username)}</a>
            <p class="meta">${stars(r.rating)} · ${fmtDate(r.createdAt)}${r.updatedAt ? " · editada" : ""}</p>
          </div>
        </header>
        ${opts.showItem && item ? `<p class="review-item">sobre <a href="#/titulo/${esc(item.id)}">${esc(item.titulo)}</a></p>` : ""}
        <p class="review-text">${esc(r.text)}</p>
        ${reviewPhoto(r)}
        <footer class="review-foot">
          ${mine
            ? `<span class="like-count">❤️ ${r.likes.length}</span>
               <button class="link-btn" data-action="edit-review" data-item="${esc(r.itemId)}">Editar</button>
               <button class="link-btn danger" data-action="delete-review" data-id="${esc(r.id)}">Borrar</button>`
            : `<button class="like-btn${liked ? " liked" : ""}${state.popLike === r.id ? " pop" : ""}" data-action="like" data-id="${esc(r.id)}" aria-pressed="${liked ? "true" : "false"}">
                 <span class="heart">${liked ? "❤️" : "🤍"}</span> <span>${r.likes.length}</span>
               </button>`}
          ${moderate ? `
            <span class="admin-tools" title="Herramientas de admin">
              <button class="link-btn" data-action="review-photo" data-id="${esc(r.id)}">📷 ${r.photoUrl ? "Cambiar foto" : "Agregar foto"}</button>
              ${r.photoUrl ? `<button class="link-btn danger" data-action="review-photo-clear" data-id="${esc(r.id)}">Quitar foto</button>` : ""}
              <button class="link-btn danger" data-action="delete-review" data-id="${esc(r.id)}">🛡 Borrar</button>
            </span>` : ""}
        </footer>
      </article>`;
  }

  function featuredReview() {
    const liked = state.reviews.filter(r => r.likes.length);
    return liked.length ? liked.slice().sort((a, b) => b.likes.length - a.likes.length)[0] : null;
  }

  function featuredHtml(r) {
    const it = itemsById[r.itemId];
    const photo = safeImg(r.photoUrl);
    return `
      <section class="section featured">
        <div class="featured-media">${photo ? `<img src="${esc(photo)}" alt="" loading="lazy">` : it ? poster(it) : ""}</div>
        <div class="featured-body">
          <p class="cat">Reseña destacada · ❤️ ${r.likes.length}</p>
          <blockquote>“${esc(truncate(r.text, 320))}”</blockquote>
          <p class="featured-by">${avatar(r.username, r.avatarUrl)} <span><strong>${esc(r.username)}</strong> ${it ? `sobre <a href="#/titulo/${esc(it.id)}">${esc(it.titulo)}</a>` : ""}<br>${stars(r.rating)}</span></p>
        </div>
      </section>`;
  }

  // Convierte [[id]] y [[id|texto]] en enlaces a la ficha. Se aplica después de escapar.
  function richText(text) {
    return esc(text).replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, id, label) => {
      const it = itemsById[id];
      if (!it) return label || id;
      return `<a href="#/titulo/${id}">${label || esc(it.titulo)}</a>`;
    });
  }

  function articlesAbout(itemId) {
    return articulos.filter(a => (a.titulos || []).includes(itemId));
  }

  function readingTime(a) {
    return Math.max(1, Math.round(a.cuerpo.flat().join(" ").split(/\s+/).length / 200));
  }

  function articleCard(a) {
    const photo = articlePhoto(a);
    return `
      <a class="article-card${photo ? " has-photo" : ""}" href="#/articulo/${esc(a.id)}">
        ${photo ? `<div class="ac-media"><img src="${esc(photo)}" alt="" loading="lazy"></div>` : ""}
        <p class="cat">${a.etiquetas.map(esc).join(" · ")}</p>
        <h3>${esc(a.titulo)}</h3>
        <p class="snippet">${esc(a.bajada)}</p>
        <p class="card-foot">✍️ ${esc(articleAuthor(a))} · ${readingTime(a)} min de lectura</p>
      </a>`;
  }

  function emptyReviews(text) {
    return `<div class="empty"><p>${text}</p>${state.user ? `<a class="btn" href="#/catalogo">Elegí un título para reseñar</a>`
      : `<button class="btn" data-action="open-auth" data-tab="signup">Creá tu cuenta y empezá a sumar medallas</button>`}</div>`;
  }

  // ------------------------------------------------------------------ inicio
  function viewHome() {
    const destacados = items.slice().sort((a, b) => score(b) - score(a)).slice(0, 4);
    const top = items.filter(i => i.top).sort((a, b) => a.top - b.top);
    const ultimas = state.reviews.slice(0, 3);
    const feat = featuredReview();
    const medals = ["🎬", "👏", "🔥", "🧭", "🦇", "🚩"];
    const title = "Encontrá qué ver, sin dar tantas vueltas.".split(" ")
      .map((w, n) => `<span class="w" style="--i:${n}">${esc(w)}</span>`).join(" ");
    app.innerHTML = `
      <section class="hero">
        <div class="hero-bg" aria-hidden="true"></div>
        <p class="eyebrow">CineLab · reseñas de cine y series</p>
        <h1>${title}</h1>
        <p class="hero-text">Reseñas y recomendaciones de películas y series, organizadas por categoría, para decidir rápido qué mirar hoy.</p>
        <div class="hero-actions">
          <a class="btn" href="#/catalogo">Explorar el catálogo</a>
          <button class="btn btn-ghost" data-action="random">🎲 ¿Qué veo hoy?</button>
        </div>
      </section>

      <div class="marquee" aria-label="Cartelera">
        <div class="marquee-track">
          ${items.concat(items).map((i, n) => `
            <a class="marquee-item" href="#/titulo/${esc(i.id)}"${n >= items.length ? ' tabindex="-1" aria-hidden="true"' : ""}>
              ${poster(i)}
              <span>${esc(i.titulo)}</span>
            </a>`).join("")}
        </div>
      </div>

      <section class="section">
        <div class="section-head"><h2>Recomendados</h2><a href="#/catalogo">Ver todo →</a></div>
        <div class="grid">${destacados.map(card).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Top 3 · Terror 2025</h2><a href="#/articulo/top-terror-2025">Leer el ranking →</a></div>
        <ol class="podium">
          ${top.map(i => `
            <li><a href="#/titulo/${esc(i.id)}">
              <span class="podium-pos">${["🥇", "🥈", "🥉"][i.top - 1]}</span>
              ${poster(i, "poster-thumb")}
              <span class="podium-info"><strong>${esc(i.titulo)}</strong><small>${esc(i.reparto)}</small></span>
              ${i.rating != null ? `<span class="rating">★ ${esc(i.rating)}</span>` : ""}
            </a></li>`).join("")}
        </ol>
      </section>

      ${feat ? featuredHtml(feat) : ""}

      ${articulos.length ? `
      <section class="section">
        <div class="section-head"><h2>Artículos</h2><a href="#/articulos">Ver todos →</a></div>
        <div class="grid">${articulos.slice(0, 3).map(articleCard).join("")}</div>
      </section>` : ""}

      <section class="section join">
        <div>
          <h2>Reseñá, recibí likes y ganá medallas</h2>
          <p>Mirar el sitio es libre. Si creás una cuenta podés publicar tus reseñas con fotos, darle like a las de otras personas, armar tu lista de “Quiero verla” y subir de nivel: de Espectador a Leyenda.</p>
          <div class="hero-actions">
            ${state.user ? `<a class="btn" href="#/perfil">Ver mis medallas</a>`
              : `<button class="btn" data-action="open-auth" data-tab="signup">Crear cuenta gratis</button>`}
            <a class="btn btn-ghost" href="#/medallas">Cómo funcionan las medallas</a>
          </div>
        </div>
        <div class="join-medals" aria-hidden="true">${medals.map((m, n) => `<span style="--i:${n}">${m}</span>`).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Últimas reseñas de la comunidad</h2><a href="#/resenas">Ver todas →</a></div>
        ${ultimas.length ? `<div class="reviews">${ultimas.map(r => reviewCard(r, { showItem: true })).join("")}</div>`
          : emptyReviews("Todavía nadie publicó una reseña. ¡La primera se lleva la medalla Pionero!")}
      </section>`;
  }

  // ---------------------------------------------------------------- catálogo
  function viewCatalog() {
    const f = state.catalogo;
    const cats = ["Todas"].concat(catNames);
    const anios = Array.from(new Set(items.map(i => i.anioNum))).sort((a, b) => b - a);
    const opt = (v, label, sel) => `<option value="${esc(v)}"${String(v) === String(sel) ? " selected" : ""}>${esc(label)}</option>`;
    app.innerHTML = `
      <section class="page-head">
        <h1>Catálogo</h1>
        <p>Películas y series organizadas por categoría. Filtrá por tipo, año o valoración.</p>
      </section>
      <div class="controls">
        <input id="search" type="search" value="${esc(f.q)}" placeholder="Buscar por título, actor o palabra clave..." aria-label="Buscar">
      </div>
      <div class="controls chips" id="chips">
        ${cats.map(c => `<button class="chip${c === f.cat ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}
      </div>
      <div class="controls filters">
        <label>Tipo<select id="fTipo">${["Todos", "Película", "Serie"].map(t => opt(t, t, f.tipo)).join("")}</select></label>
        <label>Año<select id="fAnio">${opt("Todos", "Todos", f.anio)}${anios.map(a => opt(a, a, f.anio)).join("")}</select></label>
        <label>Valoración<select id="fMin">${[["0", "Todas"], ["8", "8 o más"], ["8.5", "8.5 o más"], ["9", "9 o más"]].map(([v, l]) => opt(v, l, f.min)).join("")}</select></label>
        <label>Ordenar<select id="fOrden">${[["rating", "Mejor valorados"], ["recientes", "Más recientes"], ["resenas", "Más reseñados"], ["az", "A–Z"]].map(([v, l]) => opt(v, l, f.orden)).join("")}</select></label>
      </div>
      <p id="count" class="count"></p>
      <div class="grid" id="grid"></div>
      <div id="catIntro"></div>`;

    $("#search").addEventListener("input", e => { f.q = e.target.value; updateCatalog(); });
    $("#chips").addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (!b) return;
      f.cat = b.dataset.cat;
      document.querySelectorAll("#chips .chip").forEach(c => c.classList.toggle("active", c === b));
      updateCatalog(true);
    });
    [["fTipo", "tipo"], ["fAnio", "anio"], ["fMin", "min"], ["fOrden", "orden"]].forEach(([id, key]) =>
      $("#" + id).addEventListener("change", e => { f[key] = e.target.value; updateCatalog(true); }));
    updateCatalog();
  }

  function updateCatalog(animate) {
    const f = state.catalogo;
    const q = f.q.trim().toLowerCase();
    const list = items.filter(i =>
      (f.cat === "Todas" || i.categoria === f.cat) &&
      (f.tipo === "Todos" || i.tipo === f.tipo) &&
      (f.anio === "Todos" || String(i.anioNum) === f.anio) &&
      score(i) >= Number(f.min) &&
      (!q || [i.titulo, i.reparto, i.categoria, i.sinopsis].join(" ").toLowerCase().includes(q)));
    const sorters = {
      rating: (a, b) => score(b) - score(a),
      recientes: (a, b) => b.anioNum - a.anioNum,
      resenas: (a, b) => reviewsFor(b.id).length - reviewsFor(a.id).length,
      az: (a, b) => a.titulo.localeCompare(b.titulo, "es")
    };
    list.sort(sorters[f.orden]);
    $("#count").textContent = list.length + (list.length === 1 ? " resultado" : " resultados");
    $("#grid").innerHTML = list.map(card).join("") || `<p class="muted">No encontramos nada con esa búsqueda.</p>`;
    const info = categorias[f.cat];
    $("#catIntro").innerHTML = info ? `
      <aside class="cat-intro">
        <h2>${esc(info.titulo)}</h2>
        <p>${esc(info.intro)}</p>
        ${info.recomendacion ? `<h3>Recomendación para un fin de semana</h3><ul>${info.recomendacion.map(r => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        ${articulos.filter(a => a.etiquetas.includes(f.cat)).map(a => `<p><a href="#/articulo/${esc(a.id)}">Leer el artículo: ${esc(a.titulo)} →</a></p>`).join("")}
      </aside>` : "";
    if (animate) animateIn($("#grid"));
  }

  // ------------------------------------------------------- ficha de un título
  function mediaAdmin(kind, id, hasPhoto) {
    if (!isAdmin()) return "";
    return `<div class="media-admin">
      <button class="btn btn-small" data-action="${kind}-photo" data-id="${esc(id)}">📷 ${hasPhoto ? "Cambiar foto" : "Agregar foto"}</button>
      ${hasPhoto ? `<button class="btn btn-small btn-dark" data-action="${kind}-photo-clear" data-id="${esc(id)}">Quitar</button>` : ""}
    </div>`;
  }

  function viewTitle(id) {
    const i = itemsById[id];
    if (!i) return viewNotFound();
    const list = reviewsFor(i.id).slice().sort((a, b) => b.likes.length - a.likes.length || b.createdAt.localeCompare(a.createdAt));
    const community = communityScore(i.id);
    const mine = state.user && list.find(r => r.userId === state.user.id);
    const inList = state.watchlist.includes(i.id);
    const trailer = "https://www.youtube.com/results?search_query=" + encodeURIComponent(`${i.titulo} ${i.anioNum} tráiler`);
    const photos = list.filter(r => safeImg(r.photoUrl));
    document.title = i.titulo + " — CineLab";
    app.innerHTML = `
      <nav class="crumbs"><a href="#/catalogo">Catálogo</a> / <span>${esc(i.categoria)}</span></nav>
      <section class="title-page">
        <div class="title-poster">
          ${poster(i)}
          ${mediaAdmin("item", i.id, Boolean(itemPhoto(i)))}
        </div>
        <div class="title-main">
          <p class="cat">${esc(i.categoria)}</p>
          <h1>${esc(i.titulo)}</h1>
          <p class="meta">${esc(i.tipo)} · ${esc(i.anio)}<br>${esc(i.reparto)}</p>
          <p class="synopsis">${esc(i.sinopsis)}</p>
          <div class="hero-actions">
            <button class="btn${inList ? " btn-ghost" : ""}" data-action="watch" data-id="${esc(i.id)}">${inList ? "✓ En tu lista" : "📌 Quiero verla"}</button>
            <a class="btn btn-ghost" href="${trailer}" target="_blank" rel="noopener">▶ Ver tráiler</a>
          </div>
        </div>
        <aside class="scores">
          <div class="score" id="teamScore"><span class="score-num"${i.rating != null ? ` data-count="${esc(i.rating)}"` : ""}>${i.rating != null ? esc(i.rating) : "–"}</span><span class="score-label">Equipo CineLab${i.rating != null ? "" : " · sin puntaje"}</span>
            ${isAdmin() ? `<button class="link-btn admin-edit" data-action="edit-team-rating" data-id="${esc(i.id)}">✏️ Editar puntaje</button>` : ""}</div>
          <div class="score"><span class="score-num"${community ? ` data-count="${community}"` : ""}>${community || "–"}</span><span class="score-label">Comunidad · ${list.length} ${list.length === 1 ? "reseña" : "reseñas"}</span></div>
        </aside>
      </section>

      ${i.resenaEquipo ? `<section class="team-review"><h2>La reseña del equipo</h2><p>${esc(i.resenaEquipo)}</p></section>` : ""}

      ${photos.length ? `
      <section class="section">
        <h2>Fotos de la comunidad</h2>
        <div class="gallery">${photos.map(r => `<button class="gallery-item" data-action="zoom" data-src="${esc(r.photoUrl)}" aria-label="Foto de ${esc(r.username)}"><img src="${esc(r.photoUrl)}" alt="" loading="lazy"><span>${esc(r.username)}</span></button>`).join("")}</div>
      </section>` : ""}

      ${articlesAbout(i.id).length ? `
      <section class="section">
        <h2>Artículos que la mencionan</h2>
        <div class="grid">${articlesAbout(i.id).map(articleCard).join("")}</div>
      </section>` : ""}

      <section class="section" id="reviewForm">
        <h2>${mine ? "Tu reseña" : "Escribí tu reseña"}</h2>
        ${state.user ? reviewForm(i, mine) : `
          <div class="empty">
            <p>Para publicar una reseña necesitás una cuenta. Cada reseña suma puntos y medallas.</p>
            <button class="btn" data-action="open-auth">Ingresar o crear cuenta</button>
          </div>`}
      </section>

      <section class="section">
        <h2>Reseñas de la comunidad</h2>
        ${list.length ? `<div class="reviews">${list.map(r => reviewCard(r)).join("")}</div>`
          : `<p class="muted">Todavía no hay reseñas de ${esc(i.titulo)}. La primera persona en reseñarla gana la medalla 🚩 Pionero.</p>`}
      </section>`;

    const form = $("#reviewEditor");
    if (form) bindReviewForm(form, i);
  }

  function photoField(url) {
    return safeImg(url)
      ? `<img class="photo-preview" src="${esc(url)}" alt="Foto elegida">
         <div><button type="button" class="btn btn-ghost btn-small" data-action="form-photo">Cambiar foto</button>
         <button type="button" class="link-btn danger" data-action="form-photo-clear">Quitar</button></div>`
      : `<button type="button" class="btn btn-ghost btn-small" data-action="form-photo">📷 Agregar una foto</button>
         <small class="muted">Opcional: tu entrada del cine, una captura, tu maratón…</small>`;
  }

  function reviewForm(i, mine) {
    const rating = mine ? mine.rating : 0;
    return `
      <form id="reviewEditor" class="review-form">
        <div class="star-input" role="radiogroup" aria-label="Puntuación">
          ${[1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="${n === rating}" aria-label="${n} ${n === 1 ? "estrella" : "estrellas"}" data-star="${n}" class="${n <= rating ? "on" : ""}">★</button>`).join("")}
        </div>
        <input type="hidden" name="rating" value="${rating}">
        <textarea name="text" rows="5" maxlength="3000" placeholder="¿Qué te pareció ${esc(i.titulo)}? Contá sobre la historia, las actuaciones, lo que te hizo sentir… (mínimo 10 caracteres)">${mine ? esc(mine.text) : ""}</textarea>
        <div class="photo-field">${photoField(mine && mine.photoUrl)}</div>
        <div class="form-foot">
          <small class="muted"><span id="chars">${mine ? mine.text.length : 0}</span>/3000 · más de 400 caracteres desbloquea 📜 Crítico de fondo</small>
          <button class="btn" type="submit">${mine ? "Guardar cambios" : "Publicar reseña"}</button>
        </div>
        <p class="form-error" id="reviewError"></p>
      </form>`;
  }

  function bindReviewForm(form, i) {
    const starBtns = form.querySelectorAll("[data-star]");
    const paint = n => starBtns.forEach(b => {
      b.classList.toggle("on", Number(b.dataset.star) <= n);
      b.setAttribute("aria-checked", String(Number(b.dataset.star) === n));
    });
    starBtns.forEach(b => {
      b.addEventListener("click", () => {
        form.rating.value = b.dataset.star;
        paint(Number(b.dataset.star));
        b.classList.remove("bounce"); void b.offsetWidth; b.classList.add("bounce");
      });
      b.addEventListener("mouseenter", () => paint(Number(b.dataset.star)));
    });
    form.querySelector(".star-input").addEventListener("mouseleave", () => paint(Number(form.rating.value)));
    form.text.addEventListener("input", () => { $("#chars").textContent = form.text.value.length; });
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      // dataset.photo: sin definir = no cambió · "" = se quitó · url = foto nueva.
      const photoUrl = form.dataset.photo === undefined ? undefined : (form.dataset.photo || null);
      try {
        await Store.saveReview({ itemId: i.id, rating: Number(form.rating.value), text: form.text.value, photoUrl });
        toast("¡Reseña publicada! +10 XP");
        await reload();
      } catch (err) {
        $("#reviewError").textContent = err.message;
        btn.disabled = false;
      }
    });
  }

  // ------------------------------------------------------------------ reseñas
  function viewReviews() {
    const f = state.resenas;
    let list = state.reviews.filter(r => f.cat === "Todas" || (itemsById[r.itemId] || {}).categoria === f.cat);
    if (f.orden === "likes") list = list.slice().sort((a, b) => b.likes.length - a.likes.length);
    if (f.orden === "fotos") list = list.filter(r => safeImg(r.photoUrl));
    const feat = featuredReview();
    const cats = ["Todas"].concat(catNames);
    app.innerHTML = `
      <section class="page-head">
        <h1>Reseñas y recomendaciones</h1>
        <p>Lo que opina la comunidad de CineLab. Dale like a las reseñas que te ayudaron a elegir.</p>
      </section>
      ${feat ? featuredHtml(feat) : ""}
      <div class="controls chips">
        ${cats.map(c => `<button class="chip${c === f.cat ? " active" : ""}" data-action="reviews-cat" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}
      </div>
      <div class="controls">
        <div class="segmented">
          <button class="${f.orden === "recientes" ? "active" : ""}" data-action="reviews-order" data-order="recientes">Más recientes</button>
          <button class="${f.orden === "likes" ? "active" : ""}" data-action="reviews-order" data-order="likes">Más valoradas</button>
          <button class="${f.orden === "fotos" ? "active" : ""}" data-action="reviews-order" data-order="fotos">Con fotos</button>
        </div>
      </div>
      ${list.length ? `<div class="reviews">${list.map(r => reviewCard(r, { showItem: true })).join("")}</div>`
        : emptyReviews(state.reviews.length ? "No hay reseñas con este filtro todavía." : "Todavía nadie publicó una reseña. ¡La primera se lleva la medalla Pionero!")}`;
  }

  // ---------------------------------------------------------------- artículos
  function viewArticles() {
    const f = state.articulos;
    const tags = ["Todos"].concat(Array.from(new Set(articulos.flatMap(a => a.etiquetas))));
    if (!tags.includes(f.tag)) f.tag = "Todos";
    const list = articulos.filter(a => f.tag === "Todos" || a.etiquetas.includes(f.tag));
    app.innerHTML = `
      <section class="page-head">
        <h1>Artículos</h1>
        <p>Notas y opiniones sobre cine, series y sus géneros: rankings, análisis de actuaciones y lo que nos dejan las historias.</p>
      </section>
      <div class="controls chips">
        ${tags.map(t => `<button class="chip${t === f.tag ? " active" : ""}" data-action="articles-tag" data-tag="${esc(t)}">${esc(t)}</button>`).join("")}
      </div>
      ${list.length ? `<div class="grid">${list.map(articleCard).join("")}</div>` : `<p class="muted">Todavía no hay artículos.</p>`}`;
  }

  function viewArticle(id) {
    const a = articulosById[id];
    if (!a) return viewNotFound();
    const cited = (a.titulos || []).map(t => itemsById[t]).filter(Boolean);
    const others = articulos.filter(x => x !== a).slice(0, 3);
    const photo = articlePhoto(a);
    const author = articleAuthor(a);
    const block = b => Array.isArray(b)
      ? `<ul>${b.map(li => `<li>${richText(li)}</li>`).join("")}</ul>`
      : b.startsWith("## ") ? `<h2>${richText(b.slice(3))}</h2>` : `<p>${richText(b)}</p>`;
    document.title = a.titulo + " — CineLab";
    app.innerHTML = `
      <nav class="crumbs"><a href="#/articulos">Artículos</a> / <span>${a.etiquetas.map(esc).join(" · ")}</span></nav>
      <article class="article">
        <header>
          <p class="cat">${a.etiquetas.map(esc).join(" · ")}</p>
          <h1>${esc(a.titulo)}</h1>
          <p class="lead">${esc(a.bajada)}</p>
          <p class="byline">${avatar(author)} <span>Por <strong>${esc(author)}</strong><br><small>${readingTime(a)} min de lectura</small></span>
            ${isAdmin() ? `<button class="link-btn admin-sign" data-action="article-sign" data-id="${esc(a.id)}">✍️ Firmar</button>` : ""}</p>
        </header>
        ${photo || isAdmin() ? `
          <div class="article-cover${photo ? "" : " empty-cover"}">
            ${photo ? `<img src="${esc(photo)}" alt="">` : `<span class="muted">Sin foto de portada</span>`}
            ${mediaAdmin("article", a.id, Boolean(photo))}
          </div>` : ""}
        <div class="article-body">${a.cuerpo.map(block).join("")}</div>
        <footer class="signature">
          <span class="signature-name">${esc(author)}</span>
          <span class="signature-role">CineLab · Proyecto Laboratorio de Medios Gráficos, UMET</span>
        </footer>
      </article>
      ${cited.length ? `
        <section class="section">
          <h2>Títulos citados</h2>
          <div class="grid">${cited.map(card).join("")}</div>
        </section>` : ""}
      ${others.length ? `
        <section class="section">
          <h2>Más artículos</h2>
          <div class="grid">${others.map(articleCard).join("")}</div>
        </section>` : ""}`;
  }

  function openSignModal(id) {
    const a = articulosById[id];
    if (!a) return;
    openModal(`
      <h2>Firmar artículo</h2>
      <p class="muted">${esc(a.titulo)}</p>
      <form id="signForm" class="auth-form">
        <label>Firma (quién lo escribió)
          <input name="autor" list="teamNames" maxlength="80" value="${esc(articleAuthorRaw(a))}" placeholder="ej: Rocío Stagno">
        </label>
        <datalist id="teamNames">${(equipo || []).map(n => `<option value="${esc(n)}">`).join("")}</datalist>
        <button class="btn btn-block" type="submit">Guardar firma</button>
      </form>
      <p class="muted small-print">Si lo dejás vacío, el artículo se firma como “Equipo CineLab”.</p>`);
    $("#signForm input").focus();
    $("#signForm").addEventListener("submit", async e => {
      e.preventDefault();
      const value = e.target.autor.value.trim();
      closeModal();
      await runAndReload(() => Store.setSiteContent("author:article:" + id, value || null), "Firma guardada.");
    });
  }

  // -------------------------------------------------------------------- admin
  function viewAdmin() {
    if (!isAdmin()) {
      app.innerHTML = `<section class="page-head"><h1>Panel de administración</h1><p>Esta sección es solo para administradores de CineLab.</p>
        ${state.user ? "" : `<button class="btn" data-action="open-auth">Ingresar</button>`}</section>`;
      return;
    }
    app.innerHTML = `
      <section class="page-head">
        <h1>Panel de administración</h1>
        <p>Editá el puntaje del equipo (de 0 a 10) y las fotos de cada título. “Quitar” deja el título sin puntaje del equipo; se usa el de la comunidad.
        Las fotos de las reseñas se manejan desde cada reseña (📷 Agregar foto).</p>
      </section>
      ${catNames.map(c => `
        <section class="section">
          <h2>${esc(c)}</h2>
          <div class="admin-list">
            ${items.filter(i => i.categoria === c).map(i => `
              <div class="admin-row">
                ${poster(i, "poster-thumb")}
                <a class="admin-name" href="#/titulo/${esc(i.id)}"><strong>${esc(i.titulo)}</strong><small>${esc(i.tipo)} · ${esc(i.anio)} · comunidad ${communityScore(i.id) || "–"}</small></a>
                <span class="admin-photo">
                  <button class="link-btn" data-action="item-photo" data-id="${esc(i.id)}">📷 ${itemPhoto(i) ? "Cambiar" : "Foto"}</button>
                  ${itemPhoto(i) ? `<button class="link-btn danger" data-action="item-photo-clear" data-id="${esc(i.id)}">Quitar foto</button>` : ""}
                </span>
                ${ratingForm(i)}
              </div>`).join("")}
          </div>
        </section>`).join("")}
      <section class="section">
        <h2>Artículos</h2>
        <div class="admin-list">
          ${articulos.map(a => `
            <div class="admin-row">
              <span class="poster poster-thumb">${articlePhoto(a) ? `<img src="${esc(articlePhoto(a))}" alt="">` : `<span class="poster-ph" style="--h:28"><span class="ph-title">✍️</span></span>`}</span>
              <a class="admin-name" href="#/articulo/${esc(a.id)}"><strong>${esc(a.titulo)}</strong><small>Firma: ${esc(articleAuthor(a))}</small></a>
              <span class="admin-photo">
                <button class="link-btn" data-action="article-sign" data-id="${esc(a.id)}">✍️ Firmar</button>
                <button class="link-btn" data-action="article-photo" data-id="${esc(a.id)}">📷 ${articlePhoto(a) ? "Cambiar portada" : "Portada"}</button>
                ${articlePhoto(a) ? `<button class="link-btn danger" data-action="article-photo-clear" data-id="${esc(a.id)}">Quitar portada</button>` : ""}
              </span>
            </div>`).join("")}
        </div>
      </section>`;
  }

  // ------------------------------------------------------------------ ranking
  function viewRanking() {
    const users = {};
    state.reviews.forEach(r => { users[r.userId] = { username: r.username, avatarUrl: r.avatarUrl }; });
    const rows = Object.keys(users).map(id => {
      const p = Ach.profile(id, state.reviews, itemsById, null);
      return Object.assign({ id, p, medals: p.medals.filter(m => m.unlocked) }, users[id]);
    }).sort((a, b) => b.p.xp - a.p.xp);
    app.innerHTML = `
      <section class="page-head">
        <h1>Ranking de críticos</h1>
        <p>Cada reseña suma 10 XP, cada like recibido 5 XP y cada medalla 20 XP.</p>
      </section>
      ${rows.length ? `
        <ol class="ranking">
          ${rows.map((u, idx) => `
            <li class="${state.user && state.user.id === u.id ? "me" : ""}">
              <span class="rank-pos">${idx < 3 ? ["🥇", "🥈", "🥉"][idx] : idx + 1}</span>
              ${avatar(u.username, u.avatarUrl, { href: "#/usuario/" + esc(u.id) })}
              <a class="rank-name" href="#/usuario/${esc(u.id)}"><strong>${esc(u.username)}</strong><small>${esc(u.p.level.name)} · ${u.p.stats.reviews} reseñas · ${u.p.stats.likesReceived} likes</small></a>
              <span class="rank-medals" title="${u.medals.map(m => esc(m.name)).join(", ")}">${u.medals.slice(0, 6).map(m => m.icon).join("")}</span>
              <span class="rank-xp">${u.p.xp} XP</span>
            </li>`).join("")}
        </ol>` : emptyReviews("El ranking arranca con la primera reseña.")}`;
  }

  // ------------------------------------------------------------------- perfil
  function viewProfile(userId) {
    const own = !userId || (state.user && userId === state.user.id);
    if (own && !state.user) {
      app.innerHTML = `
        <section class="page-head"><h1>Mi perfil</h1></section>
        <div class="empty">
          <p>Ingresá para ver tu nivel, tus medallas, tus reseñas y tu lista de “Quiero verla”.</p>
          <button class="btn" data-action="open-auth">Ingresar o crear cuenta</button>
        </div>`;
      return;
    }
    const id = own ? state.user.id : userId;
    const theirs = state.reviews.filter(r => r.userId === id);
    const username = own ? state.user.username : (theirs[0] && theirs[0].username);
    if (!username) return viewNotFound();
    const avatarUrl = own ? state.user.avatarUrl : theirs[0].avatarUrl;
    const p = Ach.profile(id, state.reviews, itemsById, own ? state.watchlist : null);
    const unlocked = p.medals.filter(m => m.unlocked).length;
    const watch = state.watchlist.map(w => itemsById[w]).filter(Boolean);

    app.innerHTML = `
      <section class="profile-head">
        <div class="avatar-wrap">
          ${avatar(username, avatarUrl, { cls: "avatar-lg" })}
          ${own ? `<button class="avatar-edit" data-action="avatar" title="Cambiar foto de perfil" aria-label="Cambiar foto de perfil">📷</button>` : ""}
        </div>
        <div class="profile-info">
          <h1>${esc(username)}</h1>
          <p class="level">Nivel ${p.level.index} · <strong>${esc(p.level.name)}</strong> · ${p.xp} XP</p>
          <div class="bar"><span style="width:${Math.round(p.level.progress * 100)}%"></span></div>
          <small class="muted">${p.level.next ? `Te faltan ${p.level.toNext} XP para ser ${esc(p.level.next)}` : "¡Llegaste al nivel máximo!"}</small>
        </div>
        ${own ? `<div class="profile-actions">
          ${isAdmin() ? `<a class="btn btn-small" href="#/admin">Panel de administración</a>` : ""}
          ${safeImg(avatarUrl) ? `<button class="btn btn-ghost btn-small" data-action="avatar-clear">Quitar foto</button>` : ""}
          <button class="btn btn-ghost btn-small" data-action="logout">Cerrar sesión</button>
        </div>` : ""}
      </section>

      <div class="stats">
        <div><strong data-count="${p.stats.reviews}">${p.stats.reviews}</strong><span>reseñas</span></div>
        <div><strong data-count="${p.stats.likesReceived}">${p.stats.likesReceived}</strong><span>likes recibidos</span></div>
        <div><strong data-count="${p.stats.likesGiven}">${p.stats.likesGiven}</strong><span>likes dados</span></div>
        <div><strong>${unlocked}/${p.medals.length}</strong><span>medallas</span></div>
      </div>

      <section class="section">
        <div class="section-head"><h2>Medallas</h2><a href="#/medallas">¿Cómo se ganan?</a></div>
        <div class="medals">${p.medals.map(medalCard).join("")}</div>
      </section>

      ${own ? `
        <section class="section">
          <h2>Quiero verla</h2>
          ${watch.length ? `<div class="grid">${watch.map(card).join("")}</div>`
            : `<p class="muted">Tu lista está vacía. Tocá “📌 Quiero verla” en cualquier título para guardarlo.</p>`}
        </section>` : ""}

      <section class="section">
        <h2>${own ? "Mis reseñas" : "Reseñas de " + esc(username)}</h2>
        ${theirs.length ? `<div class="reviews">${theirs.map(r => reviewCard(r, { showItem: true })).join("")}</div>`
          : `<p class="muted">Todavía no hay reseñas.</p>`}
      </section>`;
  }

  function medalCard(m) {
    return `
      <div class="medal${m.unlocked ? " unlocked" : ""}" title="${esc(m.desc)}">
        <span class="medal-icon">${m.icon}</span>
        <strong>${esc(m.name)}</strong>
        <small>${esc(m.desc)}</small>
        ${m.unlocked ? `<span class="medal-done">Desbloqueada</span>`
          : `<div class="bar small"><span style="width:${Math.round(m.value / m.goal * 100)}%"></span></div><small class="muted">${m.value}/${m.goal}</small>`}
      </div>`;
  }

  function viewMedalsInfo() {
    app.innerHTML = `
      <section class="page-head">
        <h1>Medallas y niveles</h1>
        <p>Publicar reseñas y recibir likes te hace subir de nivel. Las medallas se calculan solas a partir de tu actividad.</p>
      </section>
      <section class="section">
        <h2>Niveles</h2>
        <ol class="levels">${Ach.LEVELS.map((l, i) => `<li><strong>${i + 1}. ${esc(l.name)}</strong><span>${l.min} XP</span></li>`).join("")}</ol>
        <p class="muted">Reseña publicada: +10 XP · Like recibido: +5 XP · Medalla: +20 XP</p>
      </section>
      <section class="section">
        <h2>Todas las medallas</h2>
        <div class="medals">${Ach.MEDALS.map(m => `
          <div class="medal unlocked"><span class="medal-icon">${m.icon}</span><strong>${esc(m.name)}</strong><small>${esc(m.desc)}</small></div>`).join("")}
        </div>
      </section>`;
  }

  // ----------------------------------------------------------------- contacto
  function viewContact() {
    app.innerHTML = `
      <section class="page-head">
        <h1>Contacto</h1>
        <p>¿Tenés una sugerencia, querés que reseñemos algo o encontraste un error? Escribinos.</p>
      </section>
      <form class="contact-form" id="contactForm">
        <label>Nombre<input name="nombre" required maxlength="80" value="${state.user ? esc(state.user.username) : ""}"></label>
        <label>Email<input name="email" type="email" required maxlength="120" value="${state.user ? esc(state.user.email) : ""}"></label>
        <label>Motivo
          <select name="motivo">
            <option>Sugerencia de película o serie</option>
            <option>Comentario sobre el sitio</option>
            <option>Consulta</option>
          </select>
        </label>
        <label>Mensaje<textarea name="mensaje" rows="5" required maxlength="2000"></textarea></label>
        <button class="btn" type="submit">Enviar</button>
      </form>
      <p class="muted social">Seguinos: <a href="#" aria-label="Instagram">Instagram</a> · <a href="#" aria-label="TikTok">TikTok</a> · <a href="#" aria-label="X">X</a></p>`;
    $("#contactForm").addEventListener("submit", e => {
      e.preventDefault();
      app.innerHTML = `<section class="page-head"><h1>¡Gracias por escribirnos!</h1><p>Recibimos tu mensaje y lo vamos a leer con atención.</p><a class="btn" href="#/">Volver al inicio</a></section>`;
    });
  }

  function viewNotFound() {
    app.innerHTML = `<section class="page-head"><h1>No encontramos esta página</h1><p>Puede que el enlace esté roto.</p><a class="btn" href="#/">Volver al inicio</a></section>`;
  }

  // ------------------------------------------------------------------- modal
  function openModal(html, cls) {
    const m = $("#modal");
    m.className = "modal" + (cls ? " " + cls : "");
    m.innerHTML = `<button class="close" data-action="close-modal" aria-label="Cerrar">&times;</button>` + html;
    $("#modalBack").classList.add("open");
  }

  function closeModal() {
    state.roulette++; // corta una ruleta en curso
    $("#modalBack").classList.remove("open");
  }

  // "¿Qué veo hoy?": ruleta que va frenando hasta caer en un título al azar.
  function spinRoulette() {
    const pick = items[Math.floor(Math.random() * items.length)];
    if (!motion) { location.hash = "#/titulo/" + pick.id; return; }
    const run = ++state.roulette;
    openModal(`
      <p class="cat">🎲 ¿Qué veo hoy?</p>
      <div class="roulette-window"><span id="rouletteName"></span></div>
      <div id="rouletteResult"></div>`, "modal-roulette");
    let n = 0;
    const total = 18;
    const tick = () => {
      if (run !== state.roulette) return;
      const it = n < total - 1 ? items[(n * 7 + Math.floor(Math.random() * items.length)) % items.length] : pick;
      const el = $("#rouletteName");
      el.textContent = it.titulo;
      el.classList.remove("spin"); void el.offsetWidth; el.classList.add("spin");
      n++;
      if (n < total) return setTimeout(tick, 40 + n * n * 0.8);
      $(".roulette-window").classList.add("done");
      $("#rouletteResult").innerHTML = `
        <div class="roulette-result">
          ${poster(pick, "poster-roulette")}
          <div>
            <p class="cat">${esc(pick.categoria)}</p>
            <p class="meta">${esc(pick.tipo)} · ${esc(pick.anio)}${pick.rating != null ? ` · <span class="rating">★ ${esc(pick.rating)}</span>` : ""}</p>
            <p>${esc(truncate(pick.sinopsis, 160))}</p>
            <div class="hero-actions">
              <a class="btn btn-small" href="#/titulo/${esc(pick.id)}">Ver ficha</a>
              <button class="btn btn-ghost btn-small" data-action="random">Girar otra vez</button>
            </div>
          </div>
        </div>`;
    };
    tick();
  }

  // -------------------------------------------------------------------- login
  function openAuth(tab, notice) {
    state.authTab = tab || "login";
    const signup = state.authTab === "signup";
    openModal(`
      <div class="tabs">
        <button class="${signup ? "" : "active"}" data-action="auth-tab" data-tab="login">Ingresar</button>
        <button class="${signup ? "active" : ""}" data-action="auth-tab" data-tab="signup">Crear cuenta</button>
      </div>
      ${notice ? `<p class="notice">${esc(notice)}</p>` : ""}
      <form id="authForm" class="auth-form">
        ${signup ? `<label>Nombre de usuario<input name="username" autocomplete="username" required minlength="3" maxlength="24" placeholder="ej: cinefila_99"></label>` : ""}
        <label>Email<input name="email" type="email" autocomplete="email" required></label>
        <label>Contraseña<input name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" required minlength="6"></label>
        <p class="form-error" id="authError"></p>
        <button class="btn btn-block" type="submit">${signup ? "Crear cuenta" : "Ingresar"}</button>
      </form>
      <p class="muted small-print">No hace falta una cuenta para ver el sitio: solo para reseñar, dar likes y ganar medallas.
      ${Store.mode === "demo" ? "<br><strong>Modo demo:</strong> las cuentas se guardan solo en este navegador." : ""}</p>`);
    const first = $("#authForm input");
    if (first) first.focus();
    $("#authForm").addEventListener("submit", async e => {
      e.preventDefault();
      const form = e.target;
      const btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      $("#authError").textContent = "";
      try {
        const data = { email: form.email.value, password: form.password.value, username: form.username ? form.username.value.trim() : undefined };
        if (signup) {
          const res = await Store.signUp(data);
          if (res && res.needsConfirmation) {
            openModal(`<h2>Revisá tu email</h2><p>Te mandamos un enlace para confirmar la cuenta. Después podés ingresar.</p>`);
            return;
          }
          toast(`¡Bienvenido/a a CineLab, ${esc(data.username)}! Publicá tu primera reseña para ganar 🎬 Primera función.`);
        } else {
          await Store.signIn(data);
        }
        closeModal();
      } catch (err) {
        $("#authError").textContent = err.message;
        btn.disabled = false;
      }
    });
  }

  // ------------------------------------------------------------------ eventos
  const actions = {
    "open-auth": el => openAuth(el.dataset.tab),
    "auth-tab": el => openAuth(el.dataset.tab),
    "close-modal": closeModal,
    logout: async () => { await Store.signOut(); location.hash = "#/"; toast("Cerraste sesión. ¡Hasta la próxima función!"); },
    random: spinRoulette,
    zoom: el => { if (safeImg(el.dataset.src)) openModal(`<img class="lightbox-img" src="${esc(el.dataset.src)}" alt="Foto ampliada">`, "modal-wide"); },
    "reviews-cat": el => { state.resenas.cat = el.dataset.cat; render(); },
    "reviews-order": el => { state.resenas.orden = el.dataset.order; render(); },
    "articles-tag": el => { state.articulos.tag = el.dataset.tag; render(); },
    "edit-team-rating": el => {
      const box = $("#teamScore");
      box.innerHTML = `<span class="score-label">Puntaje del equipo (0 a 10)</span>${ratingForm(itemsById[el.dataset.id])}`;
      box.querySelector("input").focus();
    },
    "clear-team-rating": el => {
      if (confirm("¿Quitar el puntaje del equipo de este título?")) saveTeamRating(el.dataset.id, null);
    },
    "edit-review": el => {
      const target = "#/titulo/" + el.dataset.item;
      if (location.hash !== target) location.hash = target;
      setTimeout(() => { const f = $("#reviewForm"); if (f) f.scrollIntoView({ behavior: "smooth" }); }, 50);
    },
    like: async el => {
      if (!requireLogin("Ingresá para darle like a esta reseña.")) return;
      const r = state.reviews.find(x => x.id === el.dataset.id);
      if (!r) return;
      const liking = !r.likes.includes(state.user.id);
      try {
        await Store.setLike(r.id, liking);
        state.popLike = liking ? r.id : null;
        await reload();
      } catch (err) { toast(esc(err.message), "error"); }
    },
    watch: async el => {
      if (!requireLogin("Ingresá para armar tu lista de “Quiero verla”.")) return;
      const id = el.dataset.id;
      const inList = state.watchlist.includes(id);
      await runAndReload(() => Store.setWatchlist(id, !inList), inList ? "Lo sacaste de tu lista." : "📌 Agregado a “Quiero verla”.");
    },
    "delete-review": async el => {
      if (!confirm("¿Borrar esta reseña? Se pierden sus likes.")) return;
      await runAndReload(() => Store.deleteReview(el.dataset.id), "Reseña borrada.");
    },

    // Fotos de la propia reseña (dentro del formulario).
    "form-photo": el => {
      const form = el.closest("form");
      const field = form.querySelector(".photo-field");
      pickImage().then(async file => {
        if (!file) return;
        field.classList.add("loading");
        try {
          const url = await Store.uploadImage(file, "reviews");
          form.dataset.photo = url;
          field.innerHTML = photoField(url);
        } catch (err) { toast(esc(err.message), "error"); }
        field.classList.remove("loading");
      });
    },
    "form-photo-clear": el => {
      const form = el.closest("form");
      form.dataset.photo = "";
      form.querySelector(".photo-field").innerHTML = photoField(null);
    },

    // Foto de perfil.
    avatar: () => uploadAndApply("avatars", url => Store.setAvatar(url), "¡Foto de perfil actualizada!"),
    "avatar-clear": () => runAndReload(() => Store.setAvatar(null), "Se quitó tu foto de perfil."),

    // Herramientas de admin: fotos de títulos, artículos y reseñas, y firmas.
    "item-photo": el => uploadAndApply("media", url => Store.setSiteContent("img:item:" + el.dataset.id, url), "Foto del título actualizada."),
    "item-photo-clear": el => {
      if (confirm("¿Quitar la foto de este título?")) runAndReload(() => Store.setSiteContent("img:item:" + el.dataset.id, null), "Se quitó la foto.");
    },
    "article-photo": el => uploadAndApply("media", url => Store.setSiteContent("img:article:" + el.dataset.id, url), "Portada actualizada."),
    "article-photo-clear": el => {
      if (confirm("¿Quitar la portada de este artículo?")) runAndReload(() => Store.setSiteContent("img:article:" + el.dataset.id, null), "Se quitó la portada.");
    },
    "article-sign": el => openSignModal(el.dataset.id),
    "review-photo": el => uploadAndApply("media", url => Store.setReviewPhoto(el.dataset.id, url), "Foto agregada a la reseña."),
    "review-photo-clear": el => {
      if (confirm("¿Quitar la foto de esta reseña?")) runAndReload(() => Store.setReviewPhoto(el.dataset.id, null), "Se quitó la foto de la reseña.");
    }
  };

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-action]");
    if (!el || !actions[el.dataset.action]) return;
    e.preventDefault();
    actions[el.dataset.action](el);
  });

  $("#modalBack").addEventListener("click", e => { if (e.target.id === "modalBack") closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  $("#menuToggle").addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    $("#menuToggle").setAttribute("aria-expanded", String(open));
  });

  const header = $(".site-header");
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 10), { passive: true });

  window.addEventListener("hashchange", () => {
    document.body.classList.remove("nav-open");
    closeModal();
    state.animateNext = true;
    render();
    window.scrollTo(0, 0);
  });

  Store.onAuthChange(user => {
    state.user = user;
    reload();
  });

  // -------------------------------------------------------------------- start
  (async function start() {
    app.innerHTML = `<p class="muted loading">Cargando…</p>`;
    try {
      await Store.init();
    } catch (err) {
      toast("No pudimos conectar con el servidor. " + esc(err.message), "error");
    }
    state.user = Store.user();
    state.animateNext = true;
    await reload();
  })();
})();
