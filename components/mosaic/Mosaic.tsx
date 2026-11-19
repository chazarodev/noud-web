"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { TileColor, TileShape } from "@/lib/nodes";
import styles from "./Mosaic.module.css";

export type MosaicItem = {
  id: string;
  cols: number;
  rows: number;
  color: TileColor;
  shape: TileShape;
  /** ids de otros tiles con los que se conecta (se vuelven simétricas aquí). */
  connections: string[];
  /** false = tile decorativo/ayuda: no participa en el grafo. */
  isNode?: boolean;
  anchor?: string;
  label?: string;
  /** Tiles pequeños que en tablet van a media fila. */
  half?: boolean;
  content: ReactNode;
};

type Point = { x: number; y: number };

function circlePath({ x, y }: Point, r: number) {
  return `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z `;
}

/** Un arco tipo "∩" — el mismo gesto que el logo de noud. */
function archPath(a: Point, b: Point) {
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const h = Math.max(50, Math.min(180, dist * 0.38));
  return `M${a.x} ${a.y} C${a.x} ${a.y - h} ${b.x} ${b.y - h} ${b.x} ${b.y} `;
}

export function Mosaic({ items }: { items: MosaicItem[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [ports, setPorts] = useState<Record<string, Point>>({});

  const neighbors = useMemo(() => {
    const ids = new Set(items.filter((i) => i.isNode !== false).map((i) => i.id));
    const map: Record<string, Set<string>> = {};
    for (const id of ids) map[id] = new Set();
    for (const item of items) {
      if (!ids.has(item.id)) continue;
      for (const c of item.connections) {
        if (!ids.has(c) || c === item.id) continue;
        map[item.id].add(c);
        map[c].add(item.id);
      }
    }
    return map;
  }, [items]);

  const measure = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const g = grid.getBoundingClientRect();
    const next: Record<string, Point> = {};
    grid.querySelectorAll<HTMLElement>("[data-port]").forEach((el) => {
      const r = el.getBoundingClientRect();
      next[el.dataset.port!] = {
        x: Math.round(r.left - g.left + r.width / 2),
        y: Math.round(r.top - g.top + r.height / 2),
      };
    });
    setPorts(next);
  }, []);

  useEffect(() => {
    measure();
    const grid = gridRef.current;
    const ro = new ResizeObserver(measure);
    if (grid) ro.observe(grid);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const stateOf = (id: string) => {
    if (!active) return "idle";
    if (id === active) return "on";
    return neighbors[active]?.has(id) ? "near" : "dim";
  };

  const paths = useMemo(() => {
    if (!active || !ports[active]) return null;
    const a = ports[active];
    let links = "";
    let dots = "";
    for (const id of neighbors[active] ?? []) {
      const b = ports[id];
      if (!b) continue;
      links += archPath(a, b);
      dots += circlePath(b, 8);
    }
    return { links, dots, hub: circlePath(a, 11) };
  }, [active, ports, neighbors]);

  return (
    <div
      ref={gridRef}
      className={styles.grid}
      onMouseLeave={() => setActive(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null);
      }}
    >
      {items.map((item) => {
        const isNode = item.isNode !== false;
        return (
          <section
            key={item.id}
            id={item.anchor}
            aria-label={item.label}
            className={`${styles.tile} grain`}
            data-color={item.color}
            data-shape={item.shape}
            data-state={isNode ? stateOf(item.id) : "idle"}
            data-half={item.half || undefined}
            style={{ "--cols": item.cols, "--rows": item.rows } as CSSProperties}
            onMouseEnter={() => setActive(isNode ? item.id : null)}
            onFocus={() => isNode && setActive(item.id)}
          >
            {isNode && <span className={styles.port} data-port={item.id} aria-hidden="true" />}
            <div className={styles.body}>{item.content}</div>
          </section>
        );
      })}

      <svg className={styles.links} aria-hidden="true">
        {paths && (
          <g key={active}>
            <path d={paths.links} fill="none" stroke="#0F1022" strokeOpacity={0.45} strokeWidth={8} strokeLinecap="round" />
            <path d={paths.links} fill="none" stroke="#F4F1EA" strokeWidth={3} strokeLinecap="round" className={styles.draw} />
            <path d={paths.dots} fill="#9BD8BC" stroke="#0F1022" strokeWidth={2.5} />
            <path d={paths.hub} fill="#B9B7FA" stroke="#0F1022" strokeWidth={2.5} />
          </g>
        )}
      </svg>
    </div>
  );
}
