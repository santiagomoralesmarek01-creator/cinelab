// Sistema de medallas, puntos (XP) y niveles.
// Todo se calcula a partir de las reseñas y likes, así no hace falta guardar
// las medallas en ningún lado: si cambian las reglas, se recalculan solas.
(function () {
  "use strict";

  const TERROR = "Terror y Suspenso";

  // stat: qué número mira la medalla · goal: cuánto hace falta para ganarla.
  const MEDALS = [
    { id: "primera-funcion", icon: "🎬", name: "Primera función", desc: "Publicá tu primera reseña.", stat: "reviews", goal: 1 },
    { id: "critico-en-ascenso", icon: "✍️", name: "Crítico en ascenso", desc: "Publicá 5 reseñas.", stat: "reviews", goal: 5 },
    { id: "pluma-de-oro", icon: "🖋️", name: "Pluma de oro", desc: "Publicá 10 reseñas.", stat: "reviews", goal: 10 },
    { id: "leyenda-del-celuloide", icon: "🎞️", name: "Leyenda del celuloide", desc: "Publicá 25 reseñas.", stat: "reviews", goal: 25 },
    { id: "primer-aplauso", icon: "👏", name: "Primer aplauso", desc: "Recibí tu primer like.", stat: "likesReceived", goal: 1 },
    { id: "ovacion", icon: "🙌", name: "Ovación de pie", desc: "Recibí 10 likes en total.", stat: "likesReceived", goal: 10 },
    { id: "alfombra-roja", icon: "🌟", name: "Alfombra roja", desc: "Recibí 50 likes en total.", stat: "likesReceived", goal: 50 },
    { id: "resena-viral", icon: "🔥", name: "Reseña viral", desc: "Conseguí 5 likes en una misma reseña.", stat: "bestReview", goal: 5 },
    { id: "buen-publico", icon: "🍿", name: "Buen público", desc: "Dale like a 10 reseñas de otras personas.", stat: "likesGiven", goal: 10 },
    { id: "explorador", icon: "🧭", name: "Explorador de géneros", desc: "Reseñá títulos de 3 categorías distintas.", stat: "categories", goal: 3 },
    { id: "todo-terreno", icon: "📺", name: "Todo terreno", desc: "Reseñá al menos una película y una serie.", stat: "tipos", goal: 2 },
    { id: "sin-miedo", icon: "🦇", name: "Sin miedo", desc: "Reseñá 3 títulos de terror y suspenso.", stat: "terror", goal: 3 },
    { id: "critico-de-fondo", icon: "📜", name: "Crítico de fondo", desc: "Escribí una reseña de más de 400 caracteres.", stat: "longReviews", goal: 1 },
    { id: "pionero", icon: "🚩", name: "Pionero", desc: "Sé la primera persona en reseñar un título.", stat: "pioneer", goal: 1 },
    { id: "maratonero", icon: "📌", name: "Maratonero", desc: "Agregá 5 títulos a tu lista “Quiero verla”.", stat: "watchlist", goal: 5, private: true }
  ];

  const LEVELS = [
    { name: "Espectador", min: 0 },
    { name: "Cinéfilo", min: 50 },
    { name: "Crítico", min: 150 },
    { name: "Director", min: 300 },
    { name: "Leyenda", min: 600 }
  ];

  // watchlist es null cuando no la conocemos (perfil de otra persona).
  function stats(userId, reviews, itemsById, watchlist) {
    const mine = reviews.filter(r => r.userId === userId);
    const firstByItem = {};
    reviews.forEach(r => {
      const f = firstByItem[r.itemId];
      if (!f || r.createdAt < f.createdAt) firstByItem[r.itemId] = r;
    });
    const cat = r => (itemsById[r.itemId] || {}).categoria;
    const tipo = r => (itemsById[r.itemId] || {}).tipo;
    return {
      reviews: mine.length,
      likesReceived: mine.reduce((n, r) => n + r.likes.length, 0),
      bestReview: mine.reduce((n, r) => Math.max(n, r.likes.length), 0),
      likesGiven: reviews.filter(r => r.likes.includes(userId)).length,
      categories: new Set(mine.map(cat).filter(Boolean)).size,
      tipos: new Set(mine.map(tipo).filter(Boolean)).size,
      terror: mine.filter(r => cat(r) === TERROR).length,
      longReviews: mine.filter(r => r.text.length > 400).length,
      pioneer: mine.filter(r => firstByItem[r.itemId] === r).length,
      watchlist: watchlist ? watchlist.length : null
    };
  }

  function evaluate(s) {
    return MEDALS
      .filter(m => s[m.stat] !== null)
      .map(m => Object.assign({}, m, {
        value: Math.min(s[m.stat], m.goal),
        unlocked: s[m.stat] >= m.goal
      }));
  }

  // Las medallas privadas no suman XP para que el ranking sea comparable.
  function xp(s, medals) {
    const earned = medals.filter(m => m.unlocked && !m.private).length;
    return s.reviews * 10 + s.likesReceived * 5 + earned * 20;
  }

  function level(points) {
    let i = 0;
    while (i + 1 < LEVELS.length && points >= LEVELS[i + 1].min) i++;
    const cur = LEVELS[i];
    const next = LEVELS[i + 1] || null;
    return {
      name: cur.name,
      index: i + 1,
      next: next ? next.name : null,
      toNext: next ? next.min - points : 0,
      progress: next ? (points - cur.min) / (next.min - cur.min) : 1
    };
  }

  function profile(userId, reviews, itemsById, watchlist) {
    const s = stats(userId, reviews, itemsById, watchlist);
    const medals = evaluate(s);
    const points = xp(s, medals);
    return { stats: s, medals, xp: points, level: level(points) };
  }

  window.CinelabAchievements = { MEDALS, LEVELS, profile };
})();
