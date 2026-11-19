import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Todo el contenido del sitio es un "nodo": un archivo .mdx en content/nodes
 * con frontmatter validado por este esquema.
 */

export const NODE_TYPES = [
  "proyecto",
  "escrito",
  "pensamiento",
  "sobre-mi",
  "habilidades",
  "ahora",
] as const;

export const TILE_COLORS = [
  "indigo",
  "green",
  "violet",
  "lavender",
  "cream",
  "sand",
  "terracotta",
  "sky",
  "mint",
] as const;

export const TILE_SHAPES = ["none", "arch", "circle", "quarter", "dot", "mark"] as const;

const TileSchema = z.object({
  cols: z.number().int().min(1).max(12).optional(),
  rows: z.number().int().min(1).max(6).optional(),
  color: z.enum(TILE_COLORS).optional(),
  shape: z.enum(TILE_SHAPES).optional(),
  order: z.number().optional(),
});

const FrontmatterSchema = z.object({
  type: z.enum(NODE_TYPES),
  title: z.string(),
  summary: z.string().optional(),
  date: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  connections: z.array(z.string()).default([]),
  items: z.array(z.string()).optional(), // p. ej. lista de habilidades
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  inMosaic: z.boolean().default(true),
  links: z
    .object({ repo: z.string().url().optional(), demo: z.string().url().optional() })
    .optional(),
  tile: TileSchema.optional(),
});

export type NodeType = (typeof NODE_TYPES)[number];
export type TileColor = (typeof TILE_COLORS)[number];
export type TileShape = (typeof TILE_SHAPES)[number];

export type NoudNode = Omit<z.infer<typeof FrontmatterSchema>, "tile"> & {
  id: string;
  body: string;
  readingMinutes: number;
  tile: Required<z.infer<typeof TileSchema>>;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "nodes");

const DEFAULT_TILE: NoudNode["tile"] = {
  cols: 3,
  rows: 2,
  color: "cream",
  shape: "none",
  order: 100,
};

async function readNode(file: string): Promise<NoudNode> {
  const id = file.replace(/\.mdx?$/, "");
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
  const { data, content } = matter(raw);

  const parsed = FrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Frontmatter inválido en content/nodes/${file}:\n${z.prettifyError(parsed.error)}`);
  }

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return {
    ...parsed.data,
    id,
    body: content,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    tile: { ...DEFAULT_TILE, ...parsed.data.tile },
  };
}

/** Todos los nodos publicados, ordenados por tile.order. Conexiones simétricas. */
export const getAllNodes = cache(async (): Promise<NoudNode[]> => {
  const files = (await fs.readdir(CONTENT_DIR)).filter((f) => /\.mdx?$/.test(f));
  const nodes = (await Promise.all(files.map(readNode)))
    .filter((n) => process.env.NODE_ENV === "development" || !n.draft)
    .sort((a, b) => a.tile.order - b.tile.order);

  // Si A dice que se conecta con B, B también se conecta con A.
  const ids = new Set(nodes.map((n) => n.id));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  for (const n of nodes) {
    for (const target of n.connections) {
      if (!ids.has(target)) {
        console.warn(`[nodos] "${n.id}" se conecta con "${target}", que no existe.`);
        continue;
      }
      const other = byId.get(target)!;
      if (!other.connections.includes(n.id)) other.connections.push(n.id);
    }
    n.connections = n.connections.filter((c) => ids.has(c));
  }
  return nodes;
});

export async function getNode(id: string): Promise<NoudNode | undefined> {
  return (await getAllNodes()).find((n) => n.id === id);
}

export async function getNeighbors(node: NoudNode): Promise<NoudNode[]> {
  const all = await getAllNodes();
  return node.connections
    .map((id) => all.find((n) => n.id === id))
    .filter((n): n is NoudNode => Boolean(n));
}

export const TYPE_LABEL: Record<NodeType, string> = {
  proyecto: "Proyecto",
  escrito: "Escrito",
  pensamiento: "Pensamiento",
  "sobre-mi": "Sobre mí",
  habilidades: "Habilidades",
  ahora: "Ahora mismo",
};
