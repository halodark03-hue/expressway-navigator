import { motion, AnimatePresence } from "framer-motion";

export function LogPanel({ logs, title = "Execution Log" }: { logs: string[]; title?: string }) {
  return (
    <div className="glass rounded-xl p-3 h-48 overflow-hidden flex flex-col">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
      <div className="overflow-auto font-mono text-xs space-y-1 pr-1">
        <AnimatePresence initial={false}>
          {logs.map((l, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-foreground/90">
              <span className="text-muted-foreground mr-2">{String(i + 1).padStart(2, "0")}</span>{l}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
