// Configuración de CineLab.
//
// Si se dejan vacíos, el sitio funciona en "modo demo": las cuentas, reseñas
// y likes se guardan en el navegador (localStorage). Sirve para probar y
// presentar, pero cada navegador ve solo sus propios datos.
//
// Para que las cuentas y reseñas sean compartidas entre todos los visitantes,
// creá un proyecto gratuito en https://supabase.com, ejecutá
// supabase/schema.sql en el SQL Editor y pegá acá la URL y la "anon public key"
// (Project Settings → API). La anon key es pública por diseño: la seguridad la
// dan las políticas RLS del schema.
window.CINELAB_CONFIG = {
  supabaseUrl: "https://kiedpmiesanlnwtucdrj.supabase.co",
  supabaseAnonKey: "sb_publishable_XdhEmupOA5PZ0BfylovBdg_Px2B_1HZ"
};
