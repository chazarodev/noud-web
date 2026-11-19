import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { NoudMark } from "@/components/NoudMark";
import { MiniGraph } from "@/components/MiniGraph";
import { mdxComponents } from "@/components/mdx";
import { TYPE_LABEL, getAllNodes, getNeighbors, getNode } from "@/lib/nodes";
import styles from "./nodo.module.css";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllNodes()).map((n) => ({ id: n.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const node = await getNode((await params).id);
  if (!node) return {};
  return { title: node.title, description: node.summary };
}

const dateFmt = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" });

export default async function NodePage({ params }: Props) {
  const node = await getNode((await params).id);
  if (!node) notFound();

  const neighbors = await getNeighbors(node);
  const all = await getAllNodes();
  const sameType = all.filter((n) => n.type === node.type);
  const next = sameType[(sameType.indexOf(node) + 1) % sameType.length];

  return (
    <main>
      <Link href="/" className="lnk" style={{ display: "inline-block", margin: "8px 0 20px", fontSize: 15 }}>
        ← Volver al mosaico
      </Link>

      <div className={styles.split}>
        <section className={`${styles.hero} grain`} aria-label={node.title}>
          <NoudMark size={260} arc="rgba(244,241,234,.18)" feet="rgba(155,216,188,.5)" top="rgba(185,183,250,.6)" className={styles.heroMark} />
          <p className="eyebrow" style={{ color: "var(--node-mint)" }}>
            {TYPE_LABEL[node.type]}
            {node.date && ` · ${dateFmt.format(node.date)}`}
          </p>
          <h1 className={styles.title}>{node.title}</h1>
          {node.summary && <p className={styles.summary}>{node.summary}</p>}
          {(node.links?.demo || node.links?.repo) && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {node.links?.demo && (
                <a className="btn btn-sand" href={node.links.demo} target="_blank" rel="noreferrer">
                  Ver demo
                </a>
              )}
              {node.links?.repo && (
                <a className="btn btn-ghost" href={node.links.repo} target="_blank" rel="noreferrer">
                  Código en GitHub
                </a>
              )}
            </div>
          )}
        </section>

        <aside className={`${styles.facts} grain`} aria-label="Ficha">
          <div>
            <span className="eyebrow" style={{ color: "#5C608A" }}>
              Tipo
            </span>
            <p style={{ fontSize: 18, fontWeight: 500 }}>{TYPE_LABEL[node.type]}</p>
          </div>
          {node.type === "escrito" && (
            <div>
              <span className="eyebrow" style={{ color: "#5C608A" }}>
                Lectura
              </span>
              <p style={{ fontSize: 18, fontWeight: 500 }}>{node.readingMinutes} min</p>
            </div>
          )}
          {node.tags.length > 0 && (
            <div>
              <span className="eyebrow" style={{ color: "#5C608A" }}>
                Etiquetas
              </span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                {node.tags.map((t) => (
                  <span key={t} className={styles.chip}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        <article className={`prose ${styles.article}`}>
          <MDXRemote source={node.body} components={mdxComponents} />
        </article>

        {neighbors.length > 0 && (
          <aside className={`${styles.connections} grain`} aria-label="Conexiones">
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 600 }}>Conexiones</h2>
              <p style={{ fontSize: 14, color: "#C9CBE3", marginTop: 6 }}>Este nodo se relaciona con:</p>
            </div>
            <MiniGraph center={node.title} nodes={neighbors.map((n) => ({ id: n.id, title: n.title }))} />
          </aside>
        )}
      </div>

      {next && next !== node && (
        <Link href={`/nodo/${next.id}`} className={`${styles.next} grain`}>
          <span className="eyebrow">Siguiente nodo</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600 }}>{next.title} →</span>
        </Link>
      )}
    </main>
  );
}
