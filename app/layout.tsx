import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s · ${site.name}` },
  description: site.intro,
  openGraph: { type: "website", siteName: site.name },
};

// Aplica el tema guardado antes de pintar, para evitar un parpadeo.
const themeScript = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t||"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="container">
          <SiteHeader />
          {children}
          <footer
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              paddingTop: 28,
              fontSize: 14,
              color: "var(--page-ink-soft)",
            }}
          >
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
            <span>Hecho con Next.js, MDX y nodos.</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
