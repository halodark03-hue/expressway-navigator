import type { Edge, Node } from "@/data/expressway";

export type DijkstraStep = {
  type: "visit" | "relax" | "done";
  current?: string;
  edge?: string;
  distances: Record<string, number>;
  visited: string[];
  log: string;
};

export function runDijkstra(nodes: Node[], edges: Edge[], source: string, target: string) {
  const adj: Record<string, { to: string; w: number; eid: string }[]> = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    adj[e.source].push({ to: e.target, w: e.weight, eid: e.id });
    adj[e.target].push({ to: e.source, w: e.weight, eid: e.id });
  });

  const dist: Record<string, number> = {};
  const prev: Record<string, { node: string; edge: string } | null> = {};
  nodes.forEach((n) => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  });
  dist[source] = 0;

  const visited = new Set<string>();
  const steps: DijkstraStep[] = [];

  while (visited.size < nodes.length) {
    let u: string | null = null;
    let min = Infinity;
    for (const n of nodes) {
      if (!visited.has(n.id) && dist[n.id] < min) {
        min = dist[n.id];
        u = n.id;
      }
    }
    if (u === null) break;
    visited.add(u);
    steps.push({
      type: "visit",
      current: u,
      distances: { ...dist },
      visited: [...visited],
      log: `Visit ${u} (dist=${dist[u]})`,
    });
    if (u === target) break;
    for (const { to, w, eid } of adj[u]) {
      if (visited.has(to)) continue;
      const nd = dist[u] + w;
      if (nd < dist[to]) {
        dist[to] = nd;
        prev[to] = { node: u, edge: eid };
        steps.push({
          type: "relax",
          current: to,
          edge: eid,
          distances: { ...dist },
          visited: [...visited],
          log: `Relax ${u}→${to} = ${nd}`,
        });
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  const pathEdges: string[] = [];
  let cur: string | null = target;
  while (cur && prev[cur]) {
    path.unshift(cur);
    pathEdges.unshift(prev[cur]!.edge);
    cur = prev[cur]!.node;
  }
  if (cur === source) path.unshift(source);

  steps.push({
    type: "done",
    distances: { ...dist },
    visited: [...visited],
    log: `Done. Distance: ${dist[target] === Infinity ? "∞" : dist[target]}`,
  });

  return { steps, path, pathEdges, distance: dist[target] };
}