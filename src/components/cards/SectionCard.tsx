import { motion } from "framer-motion";
import { ReactNode } from "react";

export function SectionCard({
  id, title, subtitle, children, icon,
}: { id: string; title: string; subtitle?: string; children: ReactNode; icon?: ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-5 md:p-6 scroll-mt-24"
    >
      <header className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>{icon}</div>}
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </header>
      {children}
    </motion.section>
  );
}