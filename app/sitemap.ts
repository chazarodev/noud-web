import type { MetadataRoute } from "next";
import { getAllNodes } from "@/lib/nodes";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const nodes = await getAllNodes();
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...nodes.map((n) => ({
      url: `${site.url}/nodo/${n.id}`,
      lastModified: n.date,
      changeFrequency: "monthly" as const,
      priority: n.type === "proyecto" ? 0.8 : 0.6,
    })),
  ];
}
