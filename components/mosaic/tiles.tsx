import Link from "next/link";
import { NoudMark } from "@/components/NoudMark";
import { TYPE_LABEL, type NoudNode } from "@/lib/nodes";
import { site } from "@/lib/site";
import styles from "./tiles.module.css";

const dateFmt = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" });

/* ---------- Tiles fijos ---------- */

export function HeroTile() {
  return (
    <>
      <NoudMark
        size={300}
        arc="#2F6B52"
        top="#B9B7FA"
        className={styles.heroMark}
      />
      <div className={styles.heroText}>
        <p className={styles.heroRole}>{site.role}</p>
        <h1 className={styles.heroTitle}>{site.headline}</h1>
        <p className={styles.heroIntro}>{site.intro}</p>
      </div>
      <div className={styles.actions}>
        <Link href="/#proyectos" className="btn btn-sand">
          Ver proyectos
        </Link>
        <a href={site.cv} className="btn btn-ghost" download>
          Descargar CV
        </a>
      </div>
    </>
  );
}

export function ProjectsHeaderTile() {
  return (
    <>
      <h2 className={styles.bigTitle}>Proyectos</h2>
      <div className={styles.alignEnd}>
        <p style={{ maxWidth: 220, lineHeight: 1.5 }}>Todo lo que he construido, conectado por lo que comparte.</p>
      </div>
    </>
  );
}

export function ContactTile() {
  return (
    <>
      <h2 style={{ fontSize: 32, fontWeight: 600 }}>Contacto</h2>
      <a href={`mailto:${site.email}`} style={{ fontWeight: 600 }}>
        {site.email}
      </a>
      <div style={{ display: "flex", gap: 16, fontSize: 14, fontWeight: 500 }}>
        <a href={site.social.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={site.social.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
    </>
  );
}

export function HintTile() {
  return (
    <div className={styles.row}>
      <NoudMark size={30} arc="#1F2147" feet="#2F6B52" top="#5D5ABF" style={{ flex: "none" }} />
      <p style={{ fontSize: 14, lineHeight: 1.4, fontWeight: 500 }}>
        Pasa el cursor por una pieza para ver con qué se conecta.
      </p>
    </div>
  );
}

/* ---------- Tile genérico para un nodo MDX ---------- */

export function NodeTile({ node }: { node: NoudNode }) {
  const href = `/nodo/${node.id}`;

  switch (node.type) {
    case "habilidades":
      return (
        <>
          <h2 style={{ fontSize: 28, fontWeight: 600 }}>{node.title}</h2>
          <ul className={styles.list}>
            {(node.items ?? []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      );

    case "pensamiento":
      return (
        <>
          <p className="eyebrow" style={{ color: "#8A5A00" }}>
            {TYPE_LABEL[node.type]}
          </p>
          <Link href={href} className={styles.quote}>
            “{node.summary ?? node.title}”
          </Link>
        </>
      );

    case "ahora":
      return (
        <div className={styles.row}>
          <span className={styles.pulse} aria-hidden="true" />
          <p style={{ fontSize: 16, lineHeight: 1.4, paddingRight: 24 }}>
            <strong style={{ color: "var(--node-mint)" }}>Ahora mismo:</strong> {node.summary}
          </p>
        </div>
      );

    case "sobre-mi":
      return (
        <>
          <h2 style={{ fontSize: 30, fontWeight: 600 }}>{node.title}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: "#3A3D66" }}>{node.summary}</p>
          <Link href={href} className="lnk" style={{ alignSelf: "flex-start", fontSize: 15 }}>
            Leer más →
          </Link>
        </>
      );

    case "escrito":
      return (
        <>
          <div className={styles.stack} style={{ maxWidth: 380 }}>
            <p className="eyebrow" style={{ color: "#2F6B4F" }}>
              Escritos · lo último
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.15 }}>{node.title}</h2>
          </div>
          <div className={styles.meta}>
            <span>
              {node.date ? dateFmt.format(node.date) : "Sin fecha"} · {node.readingMinutes} min de lectura
            </span>
            <Link href={href} className="lnk" style={{ color: "#1F2147" }}>
              Leer →
            </Link>
          </div>
        </>
      );

    case "proyecto":
    default:
      if (node.featured) {
        return (
          <>
            <div className={styles.stack}>
              <p className="eyebrow" style={{ color: "var(--node-mint)" }}>
                Proyecto destacado
              </p>
              <h2 style={{ fontSize: 40, fontWeight: 600, lineHeight: 1 }}>{node.title}</h2>
              {node.summary && <p style={{ fontSize: 15, lineHeight: 1.5, opacity: 0.9 }}>{node.summary}</p>}
              <Link href={href} className="lnk" style={{ alignSelf: "flex-start", marginTop: 6, fontSize: 15 }}>
                Ver proyecto →
              </Link>
            </div>
            {node.tile.shape === "mark" && (
              <NoudMark size={170} arc="#F4F1EA" feet="#9BD8BC" top="#B9B7FA" strokeWidth={8} style={{ alignSelf: "center" }} />
            )}
          </>
        );
      }
      return (
        <>
          <div className={styles.stack}>
            <h3 style={{ fontSize: 23, fontWeight: 600 }}>{node.title}</h3>
            {node.summary && <p style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.8 }}>{node.summary}</p>}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {node.tags.slice(0, 3).map((t) => (
              <span key={t} className={styles.chip}>
                {t}
              </span>
            ))}
            <Link href={href} className="lnk" style={{ marginLeft: "auto", fontSize: 14 }}>
              Ver →
            </Link>
          </div>
        </>
      );
  }
}
