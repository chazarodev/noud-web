# noud-web

Página personal con la identidad de **noud**: un mosaico donde cada pieza es un nodo y al pasar el cursor se dibujan arcos (como el del logo) hacia las piezas relacionadas.

## Empezar

```bash
npm install
npm run dev        # http://localhost:3000
```

Requiere Node.js 20.9 o superior.

## Cómo está organizado

```
app/
  layout.tsx            fuentes (Inter + Fraunces), tema, header y footer
  page.tsx              el mosaico: une los tiles fijos con los nodos MDX
  nodo/[id]/page.tsx    página de cada nodo (/nodo/noudxml, etc.)
  globals.css           tokens de noud + paleta del mosaico
  icon.svg, favicon.ico, apple-icon.png   íconos de noud
components/
  mosaic/Mosaic.tsx     grid interactivo (hover → conexiones en SVG)
  mosaic/tiles.tsx      cómo se ve cada tipo de nodo dentro de su tile
  MiniGraph.tsx         grafo de conexiones en la página de un nodo
  mdx.tsx               componentes disponibles dentro del MDX (<Nota>, <Figura>)
content/nodes/*.mdx     TODO tu contenido
lib/nodes.ts            lee y valida los .mdx (gray-matter + zod)
lib/site.ts             tu nombre, correo, redes, CV
```

## Escribir un nodo nuevo

Crea `content/nodes/mi-nodo.mdx`. El nombre del archivo es su URL (`/nodo/mi-nodo`).

```mdx
---
type: escrito            # proyecto | escrito | pensamiento | sobre-mi | habilidades | ahora
title: Mi primer escrito
summary: Una línea que lo resume
date: 2026-11-20
tags: [Next.js]
connections: [noudxml]   # ids de otros nodos; la conexión se vuelve de ida y vuelta sola
draft: false             # true = solo visible con npm run dev
inMosaic: true           # false = tiene página, pero no aparece en el mosaico
tile:
  cols: 5                # ancho en columnas (de 12)
  rows: 2                # alto en filas (104px cada una)
  color: cream           # indigo | green | violet | lavender | cream | sand | terracotta | sky | mint
  shape: quarter         # none | arch | circle | quarter | dot | mark
  order: 40              # posición en el mosaico (menor = antes)
---

El contenido en Markdown. Puedes usar <Nota>componentes</Nota>.
```

En el mosaico solo aparece el **escrito más reciente**; los demás tienen su propia página.

Los tiles fijos (presentación, proyectos, ayuda y contacto) están en `app/page.tsx`.

## Pendientes

- Cambiar los textos entre `[corchetes]` en `lib/site.ts` y `content/nodes/`.
- Poner tu CV en `public/cv.pdf`.
- Página `/escritos` con la lista de todas las publicaciones.
- Imágenes OG automáticas por nodo (`opengraph-image.tsx`).
- Deploy en Vercel.
