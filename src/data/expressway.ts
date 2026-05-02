export type Node = { id: string; label: string; x: number; y: number };
export type Edge = { id: string; source: string; target: string; weight: number; toll?: number };

// Delhi–Dehradun Expressway inspired network (positions in viewBox 0..1000 x 0..600)
export const initialNodes: Node[] = [
  { id: "DEL", label: "Delhi", x: 90, y: 480 },
  { id: "GZB", label: "Ghaziabad", x: 200, y: 430 },
  { id: "MRT", label: "Meerut", x: 320, y: 360 },
  { id: "MZN", label: "Muzaffarnagar", x: 450, y: 280 },
  { id: "SHR", label: "Saharanpur", x: 580, y: 220 },
  { id: "ROK", label: "Roorkee", x: 700, y: 180 },
  { id: "HWR", label: "Haridwar", x: 800, y: 140 },
  { id: "DDN", label: "Dehradun", x: 910, y: 90 },
  { id: "BGP", label: "Baghpat", x: 230, y: 360 },
  { id: "SHM", label: "Shamli", x: 380, y: 220 },
  { id: "YNR", label: "Yamunanagar", x: 560, y: 130 },
  { id: "RSH", label: "Rishikesh", x: 870, y: 50 },
];

export const initialEdges: Edge[] = [
  { id: "e1", source: "DEL", target: "GZB", weight: 25, toll: 60 },
  { id: "e2", source: "GZB", target: "MRT", weight: 60, toll: 140 },
  { id: "e3", source: "MRT", target: "MZN", weight: 65, toll: 150 },
  { id: "e4", source: "MZN", target: "SHR", weight: 55, toll: 130 },
  { id: "e5", source: "SHR", target: "ROK", weight: 35, toll: 90 },
  { id: "e6", source: "ROK", target: "HWR", weight: 30, toll: 70 },
  { id: "e7", source: "HWR", target: "DDN", weight: 50, toll: 110 },
  { id: "e8", source: "DEL", target: "BGP", weight: 50, toll: 80 },
  { id: "e9", source: "BGP", target: "SHM", weight: 70, toll: 120 },
  { id: "e10", source: "SHM", target: "SHR", weight: 60, toll: 100 },
  { id: "e11", source: "GZB", target: "BGP", weight: 35, toll: 50 },
  { id: "e12", source: "MRT", target: "SHM", weight: 50, toll: 90 },
  { id: "e13", source: "SHR", target: "YNR", weight: 45, toll: 80 },
  { id: "e14", source: "YNR", target: "HWR", weight: 90, toll: 160 },
  { id: "e15", source: "ROK", target: "DDN", weight: 70, toll: 140 },
  { id: "e16", source: "HWR", target: "RSH", weight: 25, toll: 40 },
  { id: "e17", source: "RSH", target: "DDN", weight: 45, toll: 60 },
];