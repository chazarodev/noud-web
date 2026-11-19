<p align="center">
  <img src="public/noud-mark.svg" width="72" alt="" />
</p>

<h1 align="center">noud-web</h1>

<p align="center">
  Mi portafolio y sitio personal: un mosaico donde cada proyecto, escrito y pensamiento es un nodo.<br />
  <a href="https://noud-web.vercel.app/"><strong>[tu-dominio]</strong></a>
</p>

---

## La idea

Mi proyecto principal, [noudxml](https://noudxml.com), lee archivos XML, y un XML está estructurado en nodos. Este sitio usa la misma idea: en lugar de una landing page para hacer scroll, es un mosaico de piezas conectadas. Al pasar el cursor sobre una, se dibujan arcos hacia las piezas relacionadas, con el mismo gesto del logo de noud.

## Stack

- **[Next.js](https://nextjs.org)** (App Router) + **TypeScript**
- **MDX** para el contenido, sin base de datos: cada archivo en `content/nodes/` es un nodo
- **gray-matter** + **zod** para leer y validar el frontmatter
- **next-mdx-remote-client** para renderizar el MDX en Server Components
- **CSS Modules** con los design tokens de noud (tema claro y oscuro)
- Desplegado en **Vercel**

## Estructura

```
app/                  rutas: el mosaico (/) y la página de cada nodo (/nodo/[id])
components/mosaic/    el grid interactivo y el diseño de cada tipo de tile
content/nodes/        el contenido, un archivo .mdx por nodo
lib/                  lectura y validación del contenido, datos del sitio
```

## Correr en local

```bash
npm install
npm run dev
```

Requiere Node.js 20.9 o superior. La guía para agregar contenido está en [`docs/contenido.md`](docs/contenido.md).

---

<p align="center">Diseño y desarrollo: [Tu nombre] · Identidad visual de noud</p>