// Capa de datos: cuentas, reseñas, likes y "quiero verla".
// Expone la misma API tanto en modo demo (localStorage) como con Supabase,
// así el resto de la app no necesita saber dónde se guardan los datos.
(function () {
  "use strict";

  const cfg = window.CINELAB_CONFIG || {};
  const useSupabase = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
  const listeners = [];
  let current = null;

  function emit() { listeners.forEach(fn => fn(current)); }

  function validate({ email, password, username }, isSignUp) {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Ingresá un email válido.");
    if (!password || password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");
    if (isSignUp && !/^[\wÁÉÍÓÚáéíóúÑñ.]{3,24}$/.test(username || "")) {
      throw new Error("El nombre de usuario debe tener entre 3 y 24 letras, números, puntos o guiones bajos.");
    }
  }

  function validateReview({ rating, text }) {
    if (!(rating >= 1 && rating <= 5)) throw new Error("Elegí una puntuación de 1 a 5 estrellas.");
    if (!text || text.trim().length < 10) throw new Error("La reseña tiene que tener al menos 10 caracteres.");
    if (text.length > 3000) throw new Error("La reseña no puede superar los 3000 caracteres.");
  }

  // ---------------------------------------------------------------- Modo demo
  const LS = {
    get(key, fallback) {
      try { const v = localStorage.getItem("cinelab:" + key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("cinelab:" + key, JSON.stringify(value)); } catch (e) { /* sin storage */ }
    }
  };

  function uid() {
    return (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  // Solo evita guardar la contraseña en texto plano; el modo demo no es seguro
  // y no está pensado para datos reales.
  async function hash(text) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
    }
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
    return "x" + h;
  }

  function publicUser(u) { return u ? { id: u.id, email: u.email, username: u.username } : null; }

  const local = {
    mode: "demo",
    async init() {
      const id = LS.get("session", null);
      current = publicUser(LS.get("users", []).find(u => u.id === id));
    },
    async signUp({ email, password, username }) {
      validate({ email, password, username }, true);
      email = email.trim().toLowerCase();
      const users = LS.get("users", []);
      if (users.some(u => u.email === email)) throw new Error("Ya existe una cuenta con ese email.");
      if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) throw new Error("Ese nombre de usuario ya está en uso.");
      const user = { id: uid(), email, username, pass: await hash(email + ":" + password), createdAt: new Date().toISOString() };
      users.push(user);
      LS.set("users", users);
      LS.set("session", user.id);
      current = publicUser(user);
      emit();
      return {};
    },
    async signIn({ email, password }) {
      validate({ email, password }, false);
      email = email.trim().toLowerCase();
      const user = LS.get("users", []).find(u => u.email === email);
      if (!user || user.pass !== await hash(email + ":" + password)) throw new Error("Email o contraseña incorrectos.");
      LS.set("session", user.id);
      current = publicUser(user);
      emit();
    },
    async signOut() {
      LS.set("session", null);
      current = null;
      emit();
    },
    async listReviews() {
      return LS.get("reviews", []).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async saveReview({ itemId, rating, text }) {
      if (!current) throw new Error("Tenés que ingresar para reseñar.");
      validateReview({ rating, text });
      const reviews = LS.get("reviews", []);
      const existing = reviews.find(r => r.userId === current.id && r.itemId === itemId);
      if (existing) {
        existing.rating = rating;
        existing.text = text.trim();
        existing.updatedAt = new Date().toISOString();
      } else {
        reviews.push({
          id: uid(), userId: current.id, username: current.username, itemId, rating,
          text: text.trim(), createdAt: new Date().toISOString(), likes: []
        });
      }
      LS.set("reviews", reviews);
    },
    async deleteReview(id) {
      LS.set("reviews", LS.get("reviews", []).filter(r => !(r.id === id && current && r.userId === current.id)));
    },
    async setLike(reviewId, liked) {
      if (!current) throw new Error("Tenés que ingresar para dar like.");
      const reviews = LS.get("reviews", []);
      const r = reviews.find(x => x.id === reviewId);
      if (!r) return;
      if (r.userId === current.id) throw new Error("No podés darle like a tu propia reseña.");
      r.likes = r.likes.filter(u => u !== current.id);
      if (liked) r.likes.push(current.id);
      LS.set("reviews", reviews);
    },
    async getWatchlist() {
      return current ? LS.get("watch:" + current.id, []) : [];
    },
    async setWatchlist(itemId, inList) {
      if (!current) throw new Error("Tenés que ingresar para armar tu lista.");
      const list = LS.get("watch:" + current.id, []).filter(i => i !== itemId);
      if (inList) list.push(itemId);
      LS.set("watch:" + current.id, list);
    }
  };

  // ----------------------------------------------------------------- Supabase
  let sb = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("No se pudo cargar " + src));
      document.head.appendChild(s);
    });
  }

  async function userFromSession(session) {
    if (!session) return null;
    const u = session.user;
    const { data } = await sb.from("profiles").select("username").eq("id", u.id).maybeSingle();
    return { id: u.id, email: u.email, username: (data && data.username) || (u.user_metadata && u.user_metadata.username) || u.email.split("@")[0] };
  }

  function check({ error }) {
    if (!error) return;
    if (/duplicate key.*username/i.test(error.message)) throw new Error("Ese nombre de usuario ya está en uso.");
    if (/Invalid login credentials/i.test(error.message)) throw new Error("Email o contraseña incorrectos.");
    if (/already registered/i.test(error.message)) throw new Error("Ya existe una cuenta con ese email.");
    if (/Email not confirmed/i.test(error.message)) throw new Error("Confirmá tu email antes de ingresar (revisá tu casilla).");
    throw new Error(error.message);
  }

  const remote = {
    mode: "supabase",
    async init() {
      await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
      // PKCE devuelve el código en "?code=" y no en el "#", que usa el router del sitio.
      sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { flowType: "pkce" } });
      const { data } = await sb.auth.getSession();
      current = await userFromSession(data.session);
      sb.auth.onAuthStateChange((_event, session) => {
        // Se difiere para no llamar a Supabase dentro del propio callback.
        setTimeout(async () => {
          const next = await userFromSession(session);
          if ((next && next.id) !== (current && current.id)) { current = next; emit(); }
        }, 0);
      });
    },
    async signUp({ email, password, username }) {
      validate({ email, password, username }, true);
      const { data: taken } = await sb.from("profiles").select("id").eq("username", username).maybeSingle();
      if (taken) throw new Error("Ese nombre de usuario ya está en uso.");
      const res = await sb.auth.signUp({ email: email.trim(), password, options: { data: { username } } });
      check(res);
      if (!res.data.session) return { needsConfirmation: true };
      current = await userFromSession(res.data.session);
      emit();
      return {};
    },
    async signIn({ email, password }) {
      validate({ email, password }, false);
      const res = await sb.auth.signInWithPassword({ email: email.trim(), password });
      check(res);
      current = await userFromSession(res.data.session);
      emit();
    },
    async signInWithGoogle() {
      if (location.protocol === "file:") {
        throw new Error("El login con Google necesita que el sitio esté publicado o en un servidor local (no funciona abriendo el archivo directo).");
      }
      check(await sb.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: location.origin + location.pathname }
      }));
    },
    async signOut() {
      await sb.auth.signOut();
      current = null;
      emit();
    },
    async listReviews() {
      const res = await sb.from("reviews")
        .select("id, user_id, item_id, rating, body, created_at, updated_at, profiles(username), review_likes(user_id)")
        .order("created_at", { ascending: false });
      check(res);
      return res.data.map(r => ({
        id: r.id, userId: r.user_id, username: r.profiles ? r.profiles.username : "usuario",
        itemId: r.item_id, rating: r.rating, text: r.body, createdAt: r.created_at, updatedAt: r.updated_at,
        likes: (r.review_likes || []).map(l => l.user_id)
      }));
    },
    async saveReview({ itemId, rating, text }) {
      if (!current) throw new Error("Tenés que ingresar para reseñar.");
      validateReview({ rating, text });
      check(await sb.from("reviews").upsert(
        { user_id: current.id, item_id: itemId, rating, body: text.trim(), updated_at: new Date().toISOString() },
        { onConflict: "user_id,item_id" }
      ));
    },
    async deleteReview(id) {
      check(await sb.from("reviews").delete().eq("id", id));
    },
    async setLike(reviewId, liked) {
      if (!current) throw new Error("Tenés que ingresar para dar like.");
      check(liked
        ? await sb.from("review_likes").insert({ review_id: reviewId, user_id: current.id })
        : await sb.from("review_likes").delete().eq("review_id", reviewId).eq("user_id", current.id));
    },
    async getWatchlist() {
      if (!current) return [];
      const res = await sb.from("watchlist").select("item_id").eq("user_id", current.id);
      check(res);
      return res.data.map(r => r.item_id);
    },
    async setWatchlist(itemId, inList) {
      if (!current) throw new Error("Tenés que ingresar para armar tu lista.");
      check(inList
        ? await sb.from("watchlist").insert({ user_id: current.id, item_id: itemId })
        : await sb.from("watchlist").delete().eq("user_id", current.id).eq("item_id", itemId));
    }
  };

  const impl = useSupabase ? remote : local;

  window.CinelabStore = Object.assign({}, impl, {
    user: () => current,
    onAuthChange(fn) { listeners.push(fn); },
    // Recuerdo local de qué medallas ya se le mostraron a cada usuario.
    seenMedals(userId) { return LS.get("medals:" + userId, null); },
    setSeenMedals(userId, ids) { LS.set("medals:" + userId, ids); }
  });
})();
