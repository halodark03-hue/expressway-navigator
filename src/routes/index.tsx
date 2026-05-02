import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, MapPin, Github, Sparkles } from "lucide-react";
import { DijkstraCard } from "@/components/cards/DijkstraCard";
import { KruskalCard } from "@/components/cards/KruskalCard";
import { BellmanCard } from "@/components/cards/BellmanCard";
import { FenwickCard } from "@/components/cards/FenwickCard";
import { BloomCard } from "@/components/cards/BloomCard";
import { TopKCard } from "@/components/cards/TopKCard";

export const Route = createFileRoute("/")({
  component: Index,
});

const SECTIONS = [
  { id: "dijkstra", label: "Dijkstra" },
  { id: "kruskal", label: "Kruskal MST" },
  { id: "bellman", label: "Bellman-Ford" },
  { id: "fenwick", label: "Fenwick Tree" },
  { id: "bloom", label: "Bloom Filter" },
  { id: "topk", label: "Top-K Heap" },
];

function Index() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline">Expressway Viz</span>
          </div>
          <nav className="hidden md:flex gap-1 text-sm overflow-x-auto">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="px-3 py-1.5 rounded-md hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition">
                {s.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-muted-foreground hidden sm:inline">{online ? "Connected" : "Offline"}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center py-10 md:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs mb-5">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.78_0.2_60)]" />
            Delhi–Dehradun Expressway Network
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-gradient">Algorithm Visualizer</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-base md:text-lg">
            Explore graph algorithms and data structures through an interactive highway simulation. Drag nodes, run step-by-step traversals, and watch the math come alive.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a href="#dijkstra" className="px-5 py-2.5 rounded-xl text-sm font-medium text-primary-foreground inline-flex items-center gap-2" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              <Activity className="h-4 w-4" /> Start exploring
            </a>
            <a href="https://en.wikipedia.org/wiki/Delhi%E2%80%93Dehradun_Expressway" target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl text-sm glass inline-flex items-center gap-2">
              <Github className="h-4 w-4" /> About the route
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { k: "12", v: "Cities" },
              { k: "17", v: "Roads" },
              { k: "6", v: "Algorithms" },
              { k: "O(log n)", v: "BIT updates" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-xl p-3">
                <div className="text-xl md:text-2xl font-bold text-gradient">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.section>

        <DijkstraCard />
        <KruskalCard />
        <BellmanCard />
        <FenwickCard />
        <BloomCard />
        <TopKCard />

        <footer className="text-center text-xs text-muted-foreground py-8">
          Built with React, TanStack Start, Tailwind & Framer Motion. ✨
        </footer>
      </main>
    </div>
  );
}
