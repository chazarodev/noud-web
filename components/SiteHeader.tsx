import Link from "next/link";
import { NoudMark } from "./NoudMark";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/lib/site";
import styles from "./SiteHeader.module.css";

const NAV = [
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#escritos", label: "Escritos" },
  { href: "/#sobre-mi", label: "Sobre mí" },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <NoudMark size={36} />
        <span>{site.name}</span>
      </Link>
      <nav aria-label="Principal" className={styles.nav}>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className={styles.link}>
            {item.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
