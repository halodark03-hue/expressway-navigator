import type { Edge, Node } from "@/data/expressway";

export type KruskalStep = {
  edge: string;
  accepted: boolean;
  mst: string[];
  parents: Record<string, string>;
  log: string;
};

export function runKruskal(nodes: Node[], edges: Edge[]) {
  const parent: Record<string, string> = {};
  const rank: Record<string, number> = {};
  nodes.forEach((n) => {
    parent[n.id] = n.id;
    rank[n.id] = 0;
  });
  const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const union = (a: string, b: string) => {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  };

  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const mst: string[] = [];
  const steps: KruskalStep[] = [];
  let total = 0;
  for (const e of sorted) {
    const accepted = union(e.source, e.target);
    if (accepted) {
      mst.push(e.id);
      total += e.weight;
    }
    steps.push({
      edge: e.id,
      accepted,
      mst: [...mst],
      parents: { ...parent },
      log: `${e.source}-${e.target} (w=${e.weight}) ${accepted ? "✓ added" : "✗ cycle"}`,
    });
    if (mst.length === nodes.length - 1) break;
  }
  return { steps, mst, total };
}