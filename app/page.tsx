import { Mosaic, type MosaicItem } from "@/components/mosaic/Mosaic";
import { ContactTile, HeroTile, HintTile, NodeTile, ProjectsHeaderTile } from "@/components/mosaic/tiles";
import { getAllNodes, type NoudNode } from "@/lib/nodes";

const ANCHOR: Partial<Record<NoudNode["type"], string>> = {
  "sobre-mi": "sobre-mi",
  escrito: "escritos",
};

type Ordered = MosaicItem & { order: number };

export default async function Home() {
  const nodes = (await getAllNodes()).filter((n) => n.inMosaic);

  // Solo el escrito más reciente aparece en el mosaico.
  const latestPost = nodes
    .filter((n) => n.type === "escrito")
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))[0];

  const shown = nodes.filter((n) => n.type !== "escrito" || n === latestPost);
  const projectIds = shown.filter((n) => n.type === "proyecto").map((n) => n.id);
  const aboutId = shown.find((n) => n.type === "sobre-mi")?.id;
  const featuredId = shown.find((n) => n.featured)?.id;

  const usedAnchors = new Set<string>();
  const nodeItems: Ordered[] = shown.map((n) => {
    let anchor = ANCHOR[n.type];
    if (anchor && usedAnchors.has(anchor)) anchor = undefined;
    if (anchor) usedAnchors.add(anchor);
    return {
      id: n.id,
      cols: n.tile.cols,
      rows: n.tile.rows,
      color: n.tile.color,
      shape: n.tile.shape,
      connections: n.connections,
      anchor,
      label: n.title,
      half: n.tile.cols <= 5 && n.type !== "sobre-mi",
      content: <NodeTile node={n} />,
      order: n.tile.order,
    };
  });

  // Tiles fijos: su lugar en el mosaico se define con "order".
  const fixed: Ordered[] = [
    {
      id: "inicio",
      order: 0,
      cols: 6,
      rows: 4,
      color: "indigo",
      shape: "none",
      label: "Presentación",
      connections: [aboutId, featuredId, "contacto"].filter(Boolean) as string[],
      content: <HeroTile />,
    },
    {
      id: "ayuda",
      order: 65,
      cols: 3,
      rows: 1,
      color: "sky",
      shape: "none",
      isNode: false,
      half: true,
      connections: [],
      content: <HintTile />,
    },
    {
      id: "proyectos",
      order: 70,
      cols: 3,
      rows: 3,
      color: "terracotta",
      shape: "dot",
      anchor: "proyectos",
      label: "Proyectos",
      half: true,
      connections: projectIds,
      content: <ProjectsHeaderTile />,
    },
    {
      id: "contacto",
      order: 1000,
      cols: 3,
      rows: 3,
      color: "indigo",
      shape: "circle",
      anchor: "contacto",
      label: "Contacto",
      half: true,
      connections: [],
      content: <ContactTile />,
    },
  ];

  const items = [...fixed, ...nodeItems]
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...item }) => item);

  return (
    <main>
      <Mosaic items={items} />
    </main>
  );
}
