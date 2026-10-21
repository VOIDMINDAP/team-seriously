# TEAM SERIOUSLY · Sitio tributo
Sitio estático (HTML/CSS/JS). Todo lo editable está en **`data/config.js`**.

## Activar Twitch (En vivo)
Pon el nombre del canal de cada miembro:
```js
miembros: { mono: { twitch: "nombre_canal" }, ... }
```
Vacío = tarjeta "PRÓXIMAMENTE". El parámetro `parent` de Twitch se toma automáticamente del dominio donde corre el sitio.

## Agregar un clip (Destacados)
Añade un objeto a `clips`:
```js
clips: [
  { titulo: "Ace en Mirage", autor: "Spawn", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX" },
  { titulo: "Ejecución", autor: "Mono", url: "https://clips.twitch.tv/NombreDelClip" },
  { titulo: "Clutch", autor: "Replica", url: "https://ejemplo.com/clip.mp4" }
]
```
Soporta YouTube (incl. Shorts), clips de Twitch y archivos .mp4. Se abren en un lightbox.

## Publicar
`npx netlify-cli deploy --prod --dir . --site <SITE_ID>` (excluye `shots/` si quieres).
