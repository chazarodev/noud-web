import Link from "next/link";
import styles from "./MiniGraph.module.css";

type Item = { id: string; title: string };

const W = 400;
const H = 320;
const C = { x: 200, y: 250 };
const R = { x: 150, y: 190 };

/**
 * Grafo pequeño: el nodo actual abajo al centro y sus vecinos repartidos
 * en un semicírculo, unidos con arcos como los del logo de noud.
 */
export function MiniGraph({ center, nodes }: { center: string; nodes: Item[] }) {
  const n = nodes.length;
  const placed = nodes.map((node, i) => {
    // De 180° (izquierda) a 0° (derecha); con uno solo, arriba.
    const t = n === 1 ? 0.5 : i / (n - 1);
    const angle = Math.PI * (1 - t);
    const x = C.x + R.x * Math.cos(angle);
    const y = C.y - R.y * Math.sin(angle) + (n > 1 && (i === 0 || i === n - 1) ? 10 : 0);
    const h = Math.max(40, Math.hypot(x - C.x, y - C.y) * 0.4);
    const d =
      Math.abs(x - C.x) < 1
        ? `M${C.x} ${C.y} L${x} ${y}`
        : `M${C.x} ${C.y} C${C.x} ${C.y - h} ${x} ${y - h} ${x} ${y}`;
    return { ...node, x, y, d };
  });

  return (
    <div className={styles.wrap}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden="true">
        {placed.map((p) => (
          <path key={p.id} d={p.d} fill="none" stroke="#F4F1EA" strokeWidth={3} strokeLinecap="round" />
        ))}
        <circle cx={C.x} cy={C.y} r={16} fill="#B9B7FA" stroke="#1F2147" strokeWidth={3} />
      </svg>
      <span className={styles.center} style={{ top: `${((C.y + 38) / H) * 100}%` }}>
        {center}
      </span>
      <ul className={styles.list}>
        {placed.map((p) => (
          <li key={p.id} style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}>
            <Link href={`/nodo/${p.id}`} className={styles.node}>
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
