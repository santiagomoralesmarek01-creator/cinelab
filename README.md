# CineLab 🎬

Sitio web interactivo de reseñas y recomendaciones de cine y series.
Proyecto del Laboratorio de Medios Gráficos (UMET).

Está hecho con **HTML, CSS y JavaScript puro**: no requiere instalar nada ni compilar.

## Qué incluye

- **Inicio**: recomendados, Top 3 de terror 2025, últimas reseñas y botón **🎲 ¿Qué veo hoy?** (elige un título al azar).
- **Catálogo**: buscador y filtros por categoría, tipo (película/serie), año y valoración, más orden por puntaje, año, cantidad de reseñas o A–Z. Cada categoría muestra su texto introductorio.
- **Ficha de cada título**: sinopsis, reparto, puntaje del equipo y de la comunidad, la reseña del equipo, un link al tráiler y las reseñas de los usuarios.
- **Reseñas**: todas las reseñas de la comunidad, filtrables por categoría y ordenables por más recientes o más valoradas.
- **Login opcional**: el sitio se puede ver completo sin cuenta. La cuenta sirve para:
  - publicar, editar y borrar reseñas (1 a 5 estrellas, una por título),
  - dar likes a reseñas de otras personas (no a las propias),
  - armar la lista **📌 Quiero verla**.
- **Medallas y niveles**: 15 medallas (primera reseña, 5/10/25 reseñas, likes recibidos, reseña viral, likes dados, explorar 3 categorías, película + serie, terror, reseña larga, pionero, lista “Quiero verla”). Se avisa con una notificación cuando se desbloquea una nueva.
  - XP: reseña publicada +10 · like recibido +5 · medalla +20.
  - Niveles: Espectador → Cinéfilo → Crítico → Director → Leyenda.
- **Ranking de críticos** y **perfil público** de cada usuario con sus medallas.
- **Contacto**: formulario de sugerencias y links a redes.
- Diseño adaptado a celulares.

## Cómo verlo

Abrí `index.html` en el navegador (doble click). Listo.

Por defecto funciona en **modo demo**: las cuentas, reseñas y likes se guardan en el navegador
(localStorage). Para probar los likes y las medallas por likes recibidos, creá dos cuentas
en el mismo navegador.

## Conectar Supabase (cuentas y reseñas compartidas por todos)

1. Creá un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pegá y ejecutá el contenido de [`supabase/schema.sql`](supabase/schema.sql).
   Crea las tablas `profiles`, `reviews`, `review_likes` y `watchlist` con sus reglas de seguridad (RLS).
3. En **Project Settings → API** copiá la *Project URL* y la *anon public key* y pegalas en
   [`js/config.js`](js/config.js).
4. Opcional: en **Authentication → Sign In / Providers → Email** podés desactivar
   “Confirm email” para que las cuentas se activen sin confirmar el correo (práctico para la presentación).
5. En **Authentication → URL Configuration** poné como *Site URL* la dirección donde publiques el sitio.

La anon key es pública por diseño; quién puede leer o modificar qué lo controlan las políticas RLS del schema
(por ejemplo, nadie puede editar la reseña de otra persona ni darse like a sí mismo).

## Publicarlo gratis

Al ser un sitio estático se sube a **Vercel** sin configuración: *Add New → Project*, elegir este repo,
Framework Preset **Other** y *Deploy*. Cada cambio en `main` se publica solo.
Después, en Supabase (**Authentication → URL Configuration**) poner la dirección de Vercel como *Site URL*
y en *Redirect URLs* la misma dirección seguida de `/**`, para que funcionen los links de confirmación por email.

Para probarlo en tu compu con Supabase: `python3 -m http.server 5500` dentro de la carpeta y abrir `http://localhost:5500`.

## Estructura

```
index.html            estructura de la página
css/styles.css        estilos (paleta, tipografías y versión celular)
js/config.js          datos de conexión a Supabase (vacío = modo demo)
js/data.js            catálogo de películas y series  ← acá se agregan títulos
js/store.js           login, reseñas, likes y lista (demo o Supabase)
js/achievements.js    medallas, XP y niveles
js/app.js             pantallas y navegación
supabase/schema.sql   base de datos para Supabase
```

### Agregar una película o serie

Sumá un objeto a `items` en `js/data.js` con un `id` único (minúsculas y guiones, ej. `"casi-angeles"`).
El resto (catálogo, filtros, ficha, reseñas) se actualiza solo.
Si el equipo todavía no le puso puntaje, usá `rating: null`: se ordena y filtra con el promedio de la comunidad.
Para una categoría nueva, agregala también en `categorias` con su título e introducción.

## Equipo

Rocío Stagno · Rocío Nicole Murillo Yñiguez · Daiana Solis · Camila Cardozo ·
Facundo Britez · Ramiro García · Priscila Alvarado · Carolina Ardenghi
