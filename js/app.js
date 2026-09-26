(function () {
  "use strict";

  const { items, categorias } = window.CINELAB_DATA;
  const itemsById = Object.fromEntries(items.map(i => [i.id, i]));
  const articulos = window.CINELAB_ARTICULOS || [];
  const articulosById = Object.fromEntries(articulos.map(a => [a.id, a]));
  const Store = window.CinelabStore;
  const Ach = window.CinelabAchievements;

  const state = {
    user: null,
    reviews: [],
    watchlist: [],
    catalogo: { q: "", cat: "Todas", tipo: "Todos", anio: "Todos", min: "0", orden: "rating" },
    resenas: { cat: "Todas", orden: "recientes" },
    articulos: { tag: "Todos" },
    authTab: "login"
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

  function requireLogin(message) {
    if (state.user) return true;
    openAuth("login", message || "Ingresá para usar esta función.");
    return false;
  }

  // ------------------------------------------------------------------- datos
  async function reload() {
    try {
      state.reviews = await Store.listReviews();
      state.watchlist = await Store.getWatchlist();
    } catch (e) {
      toast("No pudimos cargar las reseñas: " + esc(e.message), "error");
    }
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
        <span class="avatar">${initials(state.user.username)}</span>
        <span class="user-chip-text"><strong>${esc(state.user.username)}</strong><small>${esc(p.level.name)} · ${p.xp} XP</small></span>
      </a>`;
  }

  function setActiveNav(page) {
    document.querySelectorAll("#mainNav a").forEach(a =>
      a.classList.toggle("active", a.dataset.page === (page || "inicio")));
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
      articulos: viewArticles, articulo: viewArticle, ranking: viewRanking, perfil: viewProfile, usuario: viewProfile, medallas: viewMedalsInfo, contacto: viewContact
    };
    (views[page] || viewNotFound)(arg);
  }

  // ----------------------------------------------------------- componentes
  function card(i) {
    const community = communityScore(i.id);
    const n = reviewsFor(i.id).length;
    return `
      <a class="card" href="#/titulo/${esc(i.id)}">
        <p class="cat">${esc(i.categoria)}</p>
        <h3>${esc(i.titulo)}</h3>
        <p class="meta">${esc(i.tipo)} · ${esc(i.anio)}${i.rating != null ? ` · <span class="rating">★ ${esc(i.rating)}</span>` : ""}</p>
        <p class="snippet">${esc(i.sinopsis)}</p>
        <p class="card-foot">${n ? `💬 ${n} ${n === 1 ? "reseña" : "reseñas"} · comunidad ${community}` : "Sin reseñas todavía"}${state.watchlist.includes(i.id) ? " · 📌 en tu lista" : ""}</p>
      </a>`;
  }

  function reviewCard(r, opts) {
    opts = opts || {};
    const item = itemsById[r.itemId];
    const mine = state.user && r.userId === state.user.id;
    const liked = state.user && r.likes.includes(state.user.id);
    return `
      <article class="review">
        <header class="review-head">
          <a class="avatar" href="#/usuario/${esc(r.userId)}">${initials(r.username)}</a>
          <div>
            <a class="review-user" href="#/usuario/${esc(r.userId)}">${esc(r.username)}</a>
            <p class="meta">${stars(r.rating)} · ${fmtDate(r.createdAt)}${r.updatedAt ? " · editada" : ""}</p>
          </div>
        </header>
        ${opts.showItem && item ? `<p class="review-item">sobre <a href="#/titulo/${esc(item.id)}">${esc(item.titulo)}</a></p>` : ""}
        <p class="review-text">${esc(r.text)}</p>
        <footer class="review-foot">
          ${mine
            ? `<span class="like-count">❤️ ${r.likes.length}</span>
               <button class="link-btn" data-action="edit-review" data-item="${esc(r.itemId)}">Editar</button>
               <button class="link-btn danger" data-action="delete-review" data-id="${esc(r.id)}">Borrar</button>`
            : `<button class="like-btn${liked ? " liked" : ""}" data-action="like" data-id="${esc(r.id)}" aria-pressed="${liked ? "true" : "false"}">
                 ${liked ? "❤️" : "🤍"} <span>${r.likes.length}</span>
               </button>`}
        </footer>
      </article>`;
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

  function articleCard(a) {
    const words = a.cuerpo.flat().join(" ").split(/\s+/).length;
    return `
      <a class="article-card" href="#/articulo/${esc(a.id)}">
        <p class="cat">${a.etiquetas.map(esc).join(" · ")}</p>
        <h3>${esc(a.titulo)}</h3>
        <p class="snippet">${esc(a.bajada)}</p>
        <p class="card-foot">${Math.max(1, Math.round(words / 200))} min de lectura${a.titulos && a.titulos.length ? ` · ${a.titulos.length} ${a.titulos.length === 1 ? "título citado" : "títulos citados"}` : ""}</p>
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
    const medals = ["🎬", "👏", "🔥", "🧭", "🦇", "🚩"];
    app.innerHTML = `
      <section class="hero">
        <h1>Encontrá qué ver, sin dar tantas vueltas.</h1>
        <p>Reseñas y recomendaciones de películas y series, organizadas por categoría, para decidir rápido qué mirar hoy.</p>
        <div class="hero-actions">
          <a class="btn" href="#/catalogo">Explorar el catálogo</a>
          <button class="btn btn-ghost" data-action="random">🎲 ¿Qué veo hoy?</button>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Recomendados</h2><a href="#/catalogo">Ver todo →</a></div>
        <div class="grid">${destacados.map(card).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Top 3 · Terror 2025</h2></div>
        <ol class="podium">
          ${top.map(i => `
            <li><a href="#/titulo/${esc(i.id)}">
              <span class="podium-pos">${["🥇", "🥈", "🥉"][i.top - 1]}</span>
              <span><strong>${esc(i.titulo)}</strong><small>${esc(i.reparto)}</small></span>
              <span class="rating">★ ${esc(i.rating)}</span>
            </a></li>`).join("")}
        </ol>
      </section>

      ${articulos.length ? `
      <section class="section">
        <div class="section-head"><h2>Artículos</h2><a href="#/articulos">Ver todos →</a></div>
        <div class="grid">${articulos.slice(0, 3).map(articleCard).join("")}</div>
      </section>` : ""}

      <section class="section join">
        <div>
          <h2>Reseñá, recibí likes y ganá medallas</h2>
          <p>Mirar el sitio es libre. Si creás una cuenta podés publicar tus reseñas, darle like a las de otras personas, armar tu lista de “Quiero verla” y subir de nivel: de Espectador a Leyenda.</p>
          <div class="hero-actions">
            ${state.user ? `<a class="btn" href="#/perfil">Ver mis medallas</a>`
              : `<button class="btn" data-action="open-auth" data-tab="signup">Crear cuenta gratis</button>`}
            <a class="btn btn-ghost" href="#/medallas">Cómo funcionan las medallas</a>
          </div>
        </div>
        <div class="join-medals" aria-hidden="true">${medals.map(m => `<span>${m}</span>`).join("")}</div>
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
    const cats = ["Todas"].concat(Object.keys(categorias));
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
      updateCatalog();
    });
    [["fTipo", "tipo"], ["fAnio", "anio"], ["fMin", "min"], ["fOrden", "orden"]].forEach(([id, key]) =>
      $("#" + id).addEventListener("change", e => { f[key] = e.target.value; updateCatalog(); }));
    updateCatalog();
  }

  function updateCatalog() {
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
  }

  // ------------------------------------------------------- ficha de un título
  function viewTitle(id) {
    const i = itemsById[id];
    if (!i) return viewNotFound();
    const list = reviewsFor(i.id).slice().sort((a, b) => b.likes.length - a.likes.length || b.createdAt.localeCompare(a.createdAt));
    const community = communityScore(i.id);
    const mine = state.user && list.find(r => r.userId === state.user.id);
    const inList = state.watchlist.includes(i.id);
    const trailer = "https://www.youtube.com/results?search_query=" + encodeURIComponent(`${i.titulo} ${i.anioNum} tráiler`);
    app.innerHTML = `
      <nav class="crumbs"><a href="#/catalogo">Catálogo</a> / <span>${esc(i.categoria)}</span></nav>
      <section class="title-page">
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
          <div class="score"><span class="score-num">${i.rating != null ? esc(i.rating) : "–"}</span><span class="score-label">Equipo CineLab${i.rating != null ? "" : " · sin puntaje"}</span></div>
          <div class="score"><span class="score-num">${community || "–"}</span><span class="score-label">Comunidad · ${list.length} ${list.length === 1 ? "reseña" : "reseñas"}</span></div>
        </aside>
      </section>

      ${i.resenaEquipo ? `<section class="team-review"><h2>La reseña del equipo</h2><p>${esc(i.resenaEquipo)}</p></section>` : ""}

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

  function reviewForm(i, mine) {
    const rating = mine ? mine.rating : 0;
    return `
      <form id="reviewEditor" class="review-form">
        <div class="star-input" role="radiogroup" aria-label="Puntuación">
          ${[1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="${n === rating}" aria-label="${n} ${n === 1 ? "estrella" : "estrellas"}" data-star="${n}" class="${n <= rating ? "on" : ""}">★</button>`).join("")}
        </div>
        <input type="hidden" name="rating" value="${rating}">
        <textarea name="text" rows="5" maxlength="3000" placeholder="¿Qué te pareció ${esc(i.titulo)}? Contá sobre la historia, las actuaciones, lo que te hizo sentir… (mínimo 10 caracteres)">${mine ? esc(mine.text) : ""}</textarea>
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
      b.addEventListener("click", () => { form.rating.value = b.dataset.star; paint(Number(b.dataset.star)); });
      b.addEventListener("mouseenter", () => paint(Number(b.dataset.star)));
    });
    form.querySelector(".star-input").addEventListener("mouseleave", () => paint(Number(form.rating.value)));
    form.text.addEventListener("input", () => { $("#chars").textContent = form.text.value.length; });
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      try {
        await Store.saveReview({ itemId: i.id, rating: Number(form.rating.value), text: form.text.value });
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
    const cats = ["Todas"].concat(Object.keys(categorias));
    app.innerHTML = `
      <section class="page-head">
        <h1>Reseñas y recomendaciones</h1>
        <p>Lo que opina la comunidad de CineLab. Dale like a las reseñas que te ayudaron a elegir.</p>
      </section>
      <div class="controls chips">
        ${cats.map(c => `<button class="chip${c === f.cat ? " active" : ""}" data-action="reviews-cat" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}
      </div>
      <div class="controls">
        <div class="segmented">
          <button class="${f.orden === "recientes" ? "active" : ""}" data-action="reviews-order" data-order="recientes">Más recientes</button>
          <button class="${f.orden === "likes" ? "active" : ""}" data-action="reviews-order" data-order="likes">Más valoradas</button>
        </div>
      </div>
      ${list.length ? `<div class="reviews">${list.map(r => reviewCard(r, { showItem: true })).join("")}</div>`
        : emptyReviews(state.reviews.length ? "No hay reseñas en esta categoría todavía." : "Todavía nadie publicó una reseña. ¡La primera se lleva la medalla Pionero!")}`;
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
          ${a.autor ? `<p class="meta">Por ${esc(a.autor)}</p>` : ""}
        </header>
        <div class="article-body">${a.cuerpo.map(block).join("")}</div>
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

  // ------------------------------------------------------------------ ranking
  function viewRanking() {
    const users = {};
    state.reviews.forEach(r => { users[r.userId] = r.username; });
    const rows = Object.keys(users).map(id => {
      const p = Ach.profile(id, state.reviews, itemsById, null);
      return { id, username: users[id], p, medals: p.medals.filter(m => m.unlocked) };
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
              <a class="avatar" href="#/usuario/${esc(u.id)}">${initials(u.username)}</a>
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
    const p = Ach.profile(id, state.reviews, itemsById, own ? state.watchlist : null);
    const unlocked = p.medals.filter(m => m.unlocked).length;
    const watch = state.watchlist.map(w => itemsById[w]).filter(Boolean);

    app.innerHTML = `
      <section class="profile-head">
        <span class="avatar avatar-lg">${initials(username)}</span>
        <div class="profile-info">
          <h1>${esc(username)}</h1>
          <p class="level">Nivel ${p.level.index} · <strong>${esc(p.level.name)}</strong> · ${p.xp} XP</p>
          <div class="bar"><span style="width:${Math.round(p.level.progress * 100)}%"></span></div>
          <small class="muted">${p.level.next ? `Te faltan ${p.level.toNext} XP para ser ${esc(p.level.next)}` : "¡Llegaste al nivel máximo!"}</small>
        </div>
        ${own ? `<button class="btn btn-ghost btn-small" data-action="logout">Cerrar sesión</button>` : ""}
      </section>

      <div class="stats">
        <div><strong>${p.stats.reviews}</strong><span>reseñas</span></div>
        <div><strong>${p.stats.likesReceived}</strong><span>likes recibidos</span></div>
        <div><strong>${p.stats.likesGiven}</strong><span>likes dados</span></div>
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

  // -------------------------------------------------------------------- login
  function openAuth(tab, notice) {
    state.authTab = tab || "login";
    const signup = state.authTab === "signup";
    $("#modal").innerHTML = `
      <button class="close" data-action="close-modal" aria-label="Cerrar">&times;</button>
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
      ${Store.mode === "demo" ? "<br><strong>Modo demo:</strong> las cuentas se guardan solo en este navegador." : ""}</p>`;
    $("#modalBack").classList.add("open");
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
            $("#modal").innerHTML = `<button class="close" data-action="close-modal" aria-label="Cerrar">&times;</button>
              <h2>Revisá tu email</h2><p>Te mandamos un enlace para confirmar la cuenta. Después podés ingresar.</p>`;
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

  function closeModal() { $("#modalBack").classList.remove("open"); }

  // ------------------------------------------------------------------ eventos
  const actions = {
    "open-auth": el => openAuth(el.dataset.tab),
    "auth-tab": el => openAuth(el.dataset.tab),
    "close-modal": closeModal,
    logout: async () => { await Store.signOut(); location.hash = "#/"; toast("Cerraste sesión. ¡Hasta la próxima función!"); },
    random: () => { const i = items[Math.floor(Math.random() * items.length)]; location.hash = "#/titulo/" + i.id; },
    "reviews-cat": el => { state.resenas.cat = el.dataset.cat; render(); },
    "reviews-order": el => { state.resenas.orden = el.dataset.order; render(); },
    "articles-tag": el => { state.articulos.tag = el.dataset.tag; render(); },
    "edit-review": el => {
      const target = "#/titulo/" + el.dataset.item;
      if (location.hash !== target) location.hash = target;
      setTimeout(() => { const f = $("#reviewForm"); if (f) f.scrollIntoView({ behavior: "smooth" }); }, 50);
    },
    like: async el => {
      if (!requireLogin("Ingresá para darle like a esta reseña.")) return;
      const r = state.reviews.find(x => x.id === el.dataset.id);
      if (!r) return;
      try { await Store.setLike(r.id, !r.likes.includes(state.user.id)); await reload(); }
      catch (err) { toast(esc(err.message), "error"); }
    },
    watch: async el => {
      if (!requireLogin("Ingresá para armar tu lista de “Quiero verla”.")) return;
      const id = el.dataset.id;
      const inList = state.watchlist.includes(id);
      try {
        await Store.setWatchlist(id, !inList);
        toast(inList ? "Lo sacaste de tu lista." : "📌 Agregado a “Quiero verla”.");
        await reload();
      } catch (err) { toast(esc(err.message), "error"); }
    },
    "delete-review": async el => {
      if (!confirm("¿Borrar esta reseña? Se pierden sus likes.")) return;
      try { await Store.deleteReview(el.dataset.id); toast("Reseña borrada."); await reload(); }
      catch (err) { toast(esc(err.message), "error"); }
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

  window.addEventListener("hashchange", () => {
    document.body.classList.remove("nav-open");
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
    await reload();
  })();
})();
