// Capa de datos: cuentas, reseñas, likes, "quiero verla", fotos y contenido
// editable por el admin. Expone la misma API tanto en modo demo (localStorage)
// como con Supabase, así el resto de la app no necesita saber dónde se guardan.
(function () {
  "use strict";

  const cfg = window.CINELAB_CONFIG || {};
  const useSupabase = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
  const BUCKET = "cinelab";
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

  // Firma opcional de la reseña: nombre y apellido.
  function validateFirma(firma) {
    if (!firma) return;
    if (firma.length > 80) throw new Error("La firma no puede superar los 80 caracteres.");
    if (firma.split(" ").length < 2) throw new Error("Para firmar escribí nombre y apellido.");
  }

  function validateTeamRating(rating) {
    if (rating !== null && !(rating >= 0 && rating <= 10)) throw new Error("El puntaje tiene que estar entre 0 y 10.");
  }

  function requireAdmin() {
    if (!current || !current.isAdmin) throw new Error("Solo un administrador puede hacer esto.");
  }

  // Achica la foto antes de guardarla: carga más rápido y ocupa menos espacio.
  function resizeImage(file, maxSize, quality) {
    return new Promise((resolve, reject) => {
      if (!file || !/^image\//.test(file.type)) return reject(new Error("Elegí un archivo de imagen (JPG, PNG o WebP)."));
      if (file.size > 15 * 1024 * 1024) return reject(new Error("La imagen es muy pesada (máximo 15 MB)."));
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(b => b ? resolve(b) : reject(new Error("No se pudo procesar la imagen.")), "image/jpeg", quality);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("No se pudo leer la imagen.")); };
      img.src = url;
    });
  }

  function blobToDataUrl(blob) {
    return new Promise(resolve => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.readAsDataURL(blob);
    });
  }

  // ---------------------------------------------------------------- Modo demo
  const LS = {
    get(key, fallback) {
      try { const v = localStorage.getItem("cinelab:" + key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("cinelab:" + key, JSON.stringify(value)); return true; }
      catch (e) { return false; }
    },
    // Para datos que pueden incluir fotos: avisa si el navegador se quedó sin espacio.
    save(key, value) {
      if (!LS.set(key, value)) throw new Error("No hay más espacio en este navegador (modo demo). Probá con menos fotos o conectá Supabase.");
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

  function publicUser(u) {
    return u ? { id: u.id, email: u.email, username: u.username, isAdmin: Boolean(u.isAdmin), avatarUrl: u.avatarUrl || null } : null;
  }

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
      // En modo demo la primera cuenta creada en el navegador es la administradora.
      const user = { id: uid(), email, username, pass: await hash(email + ":" + password), isAdmin: users.length === 0, createdAt: new Date().toISOString() };
      users.push(user);
      LS.save("users", users);
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
      const users = Object.fromEntries(LS.get("users", []).map(u => [u.id, u]));
      return LS.get("reviews", []).slice()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(r => Object.assign({}, r, { avatarUrl: users[r.userId] ? users[r.userId].avatarUrl || null : null, photoUrl: r.photoUrl || null, firma: r.firma || null }));
    },
    async saveReview({ itemId, rating, text, photoUrl, firma }) {
      if (!current) throw new Error("Tenés que ingresar para reseñar.");
      validateReview({ rating, text });
      validateFirma(firma);
      const reviews = LS.get("reviews", []);
      const existing = reviews.find(r => r.userId === current.id && r.itemId === itemId);
      if (existing) {
        existing.rating = rating;
        existing.text = text.trim();
        if (photoUrl !== undefined) existing.photoUrl = photoUrl;
        if (firma !== undefined) existing.firma = firma || null;
        existing.updatedAt = new Date().toISOString();
      } else {
        reviews.push({
          id: uid(), userId: current.id, username: current.username, itemId, rating,
          text: text.trim(), photoUrl: photoUrl || null, firma: firma || null, createdAt: new Date().toISOString(), likes: []
        });
      }
      LS.save("reviews", reviews);
    },
    async setReviewPhoto(reviewId, photoUrl) {
      const reviews = LS.get("reviews", []);
      const r = reviews.find(x => x.id === reviewId);
      if (!r || !current || (r.userId !== current.id && !current.isAdmin)) throw new Error("No podés cambiar la foto de esta reseña.");
      r.photoUrl = photoUrl;
      LS.save("reviews", reviews);
    },
    async deleteReview(id) {
      LS.set("reviews", LS.get("reviews", []).filter(r => !(r.id === id && current && (r.userId === current.id || current.isAdmin))));
    },
    async setLike(reviewId, liked) {
      if (!current) throw new Error("Tenés que ingresar para dar like.");
      const reviews = LS.get("reviews", []);
      const r = reviews.find(x => x.id === reviewId);
      if (!r) return;
      if (r.userId === current.id) throw new Error("No podés darle like a tu propia reseña.");
      r.likes = r.likes.filter(u => u !== current.id);
      if (liked) r.likes.push(current.id);
      LS.save("reviews", reviews);
    },
    async getWatchlist() {
      return current ? LS.get("watch:" + current.id, []) : [];
    },
    async setWatchlist(itemId, inList) {
      if (!current) throw new Error("Tenés que ingresar para armar tu lista.");
      const list = LS.get("watch:" + current.id, []).filter(i => i !== itemId);
      if (inList) list.push(itemId);
      LS.set("watch:" + current.id, list);
    },
    async getTeamRatings() {
      return LS.get("teamRatings", {});
    },
    async setTeamRating(itemId, rating) {
      requireAdmin();
      validateTeamRating(rating);
      const all = LS.get("teamRatings", {});
      all[itemId] = rating; // null = sin puntaje del equipo
      LS.set("teamRatings", all);
    },
    // kind: "reviews" | "avatars" | "media". En modo demo la foto queda dentro del navegador.
    async uploadImage(file, kind) {
      if (!current) throw new Error("Tenés que ingresar para subir fotos.");
      if (kind === "media") requireAdmin();
      return blobToDataUrl(await resizeImage(file, kind === "avatars" ? 256 : 900, 0.72));
    },
    async setAvatar(url) {
      if (!current) throw new Error("Tenés que ingresar.");
      const users = LS.get("users", []);
      const u = users.find(x => x.id === current.id);
      u.avatarUrl = url;
      LS.save("users", users);
      current = publicUser(u);
    },
    async getSiteContent() {
      return LS.get("siteContent", {});
    },
    async setSiteContent(key, value) {
      requireAdmin();
      const all = LS.get("siteContent", {});
      if (value === null) delete all[key]; else all[key] = value;
      LS.save("siteContent", all);
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

  // Prueba consultas de la más completa a la más simple, para que el sitio
  // siga andando aunque todavía no se hayan ejecutado los SQL nuevos.
  async function firstThatWorks(queries) {
    let res;
    for (const q of queries) {
      res = await q();
      if (!res.error) return res;
    }
    return res;
  }

  async function userFromSession(session) {
    if (!session) return null;
    const u = session.user;
    const profile = cols => () => sb.from("profiles").select(cols).eq("id", u.id).maybeSingle();
    const { data } = await firstThatWorks([profile("username, is_admin, avatar_url"), profile("username, is_admin"), profile("username")]);
    return {
      id: u.id, email: u.email, isAdmin: Boolean(data && data.is_admin), avatarUrl: (data && data.avatar_url) || null,
      username: (data && data.username) || (u.user_metadata && u.user_metadata.username) || u.email.split("@")[0]
    };
  }

  function check({ error }) {
    if (!error) return;
    if (/duplicate key.*username/i.test(error.message)) throw new Error("Ese nombre de usuario ya está en uso.");
    if (/Invalid login credentials/i.test(error.message)) throw new Error("Email o contraseña incorrectos.");
    if (/already registered/i.test(error.message)) throw new Error("Ya existe una cuenta con ese email.");
    if (/Email not confirmed/i.test(error.message)) throw new Error("Confirmá tu email antes de ingresar (revisá tu casilla).");
    if (/rate limit|only request this after/i.test(error.message)) {
      throw new Error("Hubo demasiados registros o intentos seguidos. Probá de nuevo en unos minutos.");
    }
    if (/firma/i.test(error.message)) {
      throw new Error("La firma todavía no está activada: falta ejecutar supabase/firma.sql en Supabase.");
    }
    if (/photo_url|avatar_url|site_content|Bucket not found/i.test(error.message)) {
      throw new Error("Las fotos todavía no están activadas: falta ejecutar supabase/fotos.sql en Supabase.");
    }
    throw new Error(error.message);
  }

  const remote = {
    mode: "supabase",
    async init() {
      await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
      // PKCE: el link de confirmación de email vuelve con "?code=" y no con "#",
      // que es lo que usa el router del sitio.
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
    async signOut() {
      await sb.auth.signOut();
      current = null;
      emit();
    },
    async listReviews() {
      const base = "id, user_id, item_id, rating, body, created_at, updated_at, review_likes(user_id)";
      const query = cols => () => sb.from("reviews").select(cols).order("created_at", { ascending: false });
      const res = await firstThatWorks([
        query(base + ", photo_url, firma, profiles!user_id(username, avatar_url)"),
        query(base + ", photo_url, profiles!user_id(username, avatar_url)"),
        query(base + ", profiles!user_id(username)")
      ]);
      check(res);
      return res.data.map(r => ({
        id: r.id, userId: r.user_id, username: r.profiles ? r.profiles.username : "usuario",
        avatarUrl: (r.profiles && r.profiles.avatar_url) || null, photoUrl: r.photo_url || null, firma: r.firma || null,
        itemId: r.item_id, rating: r.rating, text: r.body, createdAt: r.created_at, updatedAt: r.updated_at,
        likes: (r.review_likes || []).map(l => l.user_id)
      }));
    },
    async saveReview({ itemId, rating, text, photoUrl, firma }) {
      if (!current) throw new Error("Tenés que ingresar para reseñar.");
      validateReview({ rating, text });
      validateFirma(firma);
      const row = { user_id: current.id, item_id: itemId, rating, body: text.trim(), updated_at: new Date().toISOString() };
      if (photoUrl !== undefined) row.photo_url = photoUrl;
      if (firma !== undefined) row.firma = firma || null;
      check(await sb.from("reviews").upsert(row, { onConflict: "user_id,item_id" }));
    },
    async setReviewPhoto(reviewId, photoUrl) {
      const res = await sb.from("reviews").update({ photo_url: photoUrl }).eq("id", reviewId).select("id");
      check(res);
      if (!res.data.length) throw new Error("No podés cambiar la foto de esta reseña.");
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
    },
    async getTeamRatings() {
      const res = await sb.from("team_ratings").select("item_id, rating");
      if (res.error) return {}; // tabla sin crear: se usan los puntajes de data.js
      return Object.fromEntries(res.data.map(r => [r.item_id, r.rating === null ? null : Number(r.rating)]));
    },
    async setTeamRating(itemId, rating) {
      requireAdmin();
      validateTeamRating(rating);
      // rating null se guarda igual: significa "sin puntaje del equipo".
      check(await sb.from("team_ratings").upsert(
        { item_id: itemId, rating, updated_by: current.id, updated_at: new Date().toISOString() },
        { onConflict: "item_id" }));
    },
    // Las fotos van al bucket público "cinelab", en una carpeta por usuario.
    async uploadImage(file, kind) {
      if (!current) throw new Error("Tenés que ingresar para subir fotos.");
      if (kind === "media") requireAdmin();
      const blob = await resizeImage(file, kind === "avatars" ? 256 : 1400, 0.82);
      const path = `${kind}/${current.id}/${uid()}.jpg`;
      check(await sb.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" }));
      return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    },
    async setAvatar(url) {
      if (!current) throw new Error("Tenés que ingresar.");
      check(await sb.from("profiles").update({ avatar_url: url }).eq("id", current.id));
      current = Object.assign({}, current, { avatarUrl: url });
    },
    async getSiteContent() {
      const res = await sb.from("site_content").select("key, value");
      if (res.error) return {};
      return Object.fromEntries(res.data.map(r => [r.key, r.value]));
    },
    async setSiteContent(key, value) {
      requireAdmin();
      check(value === null
        ? await sb.from("site_content").delete().eq("key", key)
        : await sb.from("site_content").upsert(
            { key, value, updated_by: current.id, updated_at: new Date().toISOString() },
            { onConflict: "key" }));
    }
  };

  const impl = useSupabase ? remote : local;

  window.CinelabStore = Object.assign({}, impl, {
    user: () => current,
    onAuthChange(fn) { listeners.push(fn); },
    // Solo se muestran fotos propias del sitio (Supabase Storage o, en demo, guardadas en el navegador).
    isSafeImage(url) {
      if (typeof url !== "string") return false;
      if (useSupabase) return url.startsWith(cfg.supabaseUrl + "/storage/v1/object/public/" + BUCKET + "/");
      return /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(url);
    },
    // Recuerdo local de qué medallas ya se le mostraron a cada usuario.
    seenMedals(userId) { return LS.get("medals:" + userId, null); },
    setSeenMedals(userId, ids) { LS.set("medals:" + userId, ids); }
  });
})();
