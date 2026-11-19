# Guía de contenido

Todo el contenido vive en `content/nodes/`. Cada archivo `.mdx` es un nodo, y su nombre es su URL: `mi-nodo.mdx` → `/nodo/mi-nodo`.

## Agregar un nodo

1. Crea el archivo en `content/nodes/`.
2. Revísalo con `npm run dev`.
3. `git add . && git commit -m "..." && git push` → Vercel lo publica solo.

No hace falta registrarlo en ningún lado: al existir el archivo, aparece en el mosaico (si corresponde), tiene su página y entra al sitemap.

## Frontmatter

```yaml
---
type: escrito              # proyecto | escrito | pensamiento | sobre-mi | habilidades | ahora
title: Título
summary: Una línea         # se usa en el tile, en buscadores y al compartir
date: 2026-11-20
tags: [Next.js]
connections: [noudxml]     # ids de otros nodos; la conexión se vuelve de ida y vuelta sola
featured: false            # proyecto destacado (tile grande con el logo)
draft: false               # true = solo visible en npm run dev
inMosaic: true             # false = tiene página, pero no aparece en el mosaico
links:                     # opcional; botones en la página del nodo
  site: https://...
  demo: https://...
  repo: https://github.com/...
tile:                      # opcional; si no lo pones: 3×2, crema, al final
  cols: 3                  # ancho, de 1 a 12 columnas
  rows: 2                  # alto, de 1 a 6 filas (104px cada una)
  color: cream             # indigo | green | violet | lavender | cream | sand | terracotta | sky | mint
  shape: none              # none | arch | circle | quarter | dot | mark
  order: 100               # posición en el mosaico (menor = antes)
---
```

## Reglas del mosaico

- **Escritos:** solo el más reciente aparece en el mosaico, y ocupa el lugar que defina **su propio** `tile`. Copia siempre el mismo bloque `tile` del escrito anterior (`cols: 5, rows: 2, color: cream, shape: quarter, order: 40`).
- **Proyectos:** cada uno agrega un tile. Usa `cols: 3, rows: 3` y un `order` entre 71 y 999 para que caigan en la fila de proyectos.
- **Huecos:** el grid rellena huecos con tiles posteriores que quepan, pero no siempre de forma perfecta. Si queda un hueco, ajusta `cols`, `rows` u `order`.
- La suma de anchos por fila es 12 columnas.

Tiles fijos (presentación, ayuda, proyectos y contacto): `app/page.tsx`, con `order` 0, 65, 70 y 1000.

## Componentes dentro del MDX

```mdx
<Nota>Texto destacado.</Nota>

<Figura src="/imagen.png" alt="Descripción" pie="Pie de imagen opcional" />

[Enlace a otro nodo](/nodo/noudxml)
```

Las imágenes van en `public/`. Para agregar más componentes: `components/mdx.tsx`.

## Cuidado con estos caracteres

MDX interpreta `<` y `{` como código. Si los necesitas como texto, escríbelos así: `\<` y `\{`, o dentro de `código`.