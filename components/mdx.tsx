import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Componentes que puedes usar dentro de cualquier .mdx:
 *   <Nota>Texto destacado</Nota>
 *   <Figura src="/covers/noudxml.png" alt="..." pie="Pie de imagen" />
 * Y los enlaces internos (/nodo/...) usan next/link automáticamente.
 */

function A({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/")) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noreferrer" {...props} />;
}

function Nota({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        margin: "24px 0",
        padding: "20px 24px",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-bg-soft)",
        color: "var(--page-ink)",
      }}
    >
      {children}
    </div>
  );
}

function Figura({ src, alt, pie }: { src: string; alt: string; pie?: string }) {
  return (
    <figure style={{ margin: "24px 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ width: "100%", borderRadius: "var(--radius-xl)", display: "block" }} />
      {pie && (
        <figcaption style={{ marginTop: 10, fontSize: 14, color: "var(--page-ink-soft)" }}>{pie}</figcaption>
      )}
    </figure>
  );
}

export const mdxComponents = { a: A, Nota, Figura };
