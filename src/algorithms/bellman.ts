import type { Edge, Node } from "@/data/expressway";

export type BellmanStep = {
  iteration: number;
  edge?: string;
  distances: Record<string, number>;
  log: string;
  negativeCycleEdges?: string[];
};

export function runBellmanFord(
  nodes: Node[],
  edges: Edge[],
  source: string,
  weightOf: (e: Edge) => number,
) {
  const dist: Record<string, number> = {};
  nodes.forEach((n) => (dist[n.id] = Infinity));
  dist[source] = 0;

  const steps: BellmanStep[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    let updated = false;
    for (const e of edges) {
      const w = weightOf(e);
      for (const [u, v] of [[e.source, e.target], [e.target, e.source]] as const) {
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          updated = true;
          steps.push({
            iteration: i + 1,
            edge: e.id,
            distances: { ...dist },
            log: `Iter ${i + 1}: relax ${u}→${v} (w=${w}) → ${dist[v]}`,
          });
        }
      }
    }
    if (!updated) break;
  }

  const negEdges: string[] = [];
  for (const e of edges) {
    const w = weightOf(e);
    for (const [u, v] of [[e.source, e.target], [e.target, e.source]] as const) {
      if (dist[u] + w < dist[v]) negEdges.push(e.id);
    }
  }
  if (negEdges.length) {
    steps.push({
      iteration: -1,
      distances: { ...dist },
      log: `⚠ Negative cycle detected on ${negEdges.length} edge(s)`,
      negativeCycleEdges: negEdges,
    });
  } else {
    steps.push({ iteration: -1, distances: { ...dist }, log: "No negative cycles." });
  }

  return { steps, distances: dist, negativeCycleEdges: negEdges };
}