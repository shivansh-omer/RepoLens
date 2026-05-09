import { motion } from "framer-motion";
import { Layers, Server, Database, Cloud, TestTube, Package, Monitor, Wrench } from "lucide-react";
import { TechStackItem } from "@/types/repo";

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; label: string; gradient: string }> = {
  frontend: { icon: Monitor, label: "Frontend", gradient: "from-primary/20 to-primary/5" },
  backend: { icon: Server, label: "Backend", gradient: "from-accent/20 to-accent/5" },
  database: { icon: Database, label: "Database", gradient: "from-success/20 to-success/5" },
  devops: { icon: Cloud, label: "DevOps", gradient: "from-warning/20 to-warning/5" },
  testing: { icon: TestTube, label: "Testing", gradient: "from-accent/20 to-accent/5" },
  other: { icon: Package, label: "Other", gradient: "from-muted/30 to-muted/10" },
};

const CONFIDENCE_STYLES: Record<string, { bg: string; border: string }> = {
  high: { bg: "bg-success/8", border: "border-success/20" },
  medium: { bg: "bg-warning/8", border: "border-warning/20" },
  low: { bg: "bg-muted/15", border: "border-border/30" },
};

interface TechStackProps {
  items: TechStackItem[];
}

export function TechStack({ items }: TechStackProps) {
  const grouped = items.reduce<Record<string, TechStackItem[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-2xl p-6 space-y-5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Layers className="w-4 h-4 text-accent" />
        </div>
        <h3 className="text-lg font-semibold">Tech Stack</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(grouped).map(([category, techs], groupIdx) => {
          const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
          const Icon = config.icon;
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + groupIdx * 0.08 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5 text-foreground/70" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {config.label}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech, i) => {
                  const style = CONFIDENCE_STYLES[tech.confidence] || CONFIDENCE_STYLES.medium;
                  return (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + groupIdx * 0.08 + i * 0.04 }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${style.bg} border ${style.border} text-foreground/80 cursor-default hover:text-foreground transition-colors duration-200`}
                    >
                      {tech.name}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
