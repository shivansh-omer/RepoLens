import { motion } from "framer-motion";
import { Brain, GitMerge, ArrowRight, Workflow, Monitor, Zap, Database, Package, Link, Lightbulb } from "lucide-react";

interface OverviewCardProps {
  overview: string;
  architecturePattern: string;
  dataFlow: string;
}

const LUCIDE_ICON_MAP: Record<string, React.ElementType> = {
  view: Monitor,
  controller: Zap,
  viewmodel: Zap,
  model: Database,
  default: Package,
};

const NODE_COLORS = ["hsl(195 100% 50%)", "hsl(270 80% 60%)", "hsl(160 84% 39%)", "hsl(330 85% 60%)"];

function parseArchitectureNodes(pattern: string) {
  const commonPatterns: Record<string, string[]> = {
    mvc: ["View", "Controller", "Model"],
    mvvm: ["View", "ViewModel", "Model"],
  };

  const lower = pattern.toLowerCase();
  for (const [key, labels] of Object.entries(commonPatterns)) {
    if (lower.includes(key)) {
      return labels.map((label, i) => ({
        label,
        icon: LUCIDE_ICON_MAP[label.toLowerCase()] || Package,
        color: NODE_COLORS[i % NODE_COLORS.length],
      }));
    }
  }

  const words = pattern.split(/[,\-–→>\s]+/).filter(w => w.length > 2 && w.length < 25).slice(0, 4);
  return words.map((w, i) => ({
    label: w.charAt(0).toUpperCase() + w.slice(1),
    icon: LUCIDE_ICON_MAP[w.toLowerCase()] || Package,
    color: NODE_COLORS[i % NODE_COLORS.length],
  }));
}

export function OverviewCard({ overview, architecturePattern, dataFlow }: OverviewCardProps) {
  const archNodes = parseArchitectureNodes(architecturePattern);
  const shortOverview = overview.split('. ').slice(0, 3).join('. ') + (overview.split('. ').length > 3 ? '.' : '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="glass-card rounded-2xl p-6 space-y-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Overview</h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{shortOverview}</p>

      {/* Architecture Flow */}
      <div className="pt-2 space-y-4">
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-accent" />
          <p className="text-sm font-semibold text-foreground">Architecture Pattern</p>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap py-4 px-2">
          {archNodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.label}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
              >
                <div
                  className="flex flex-col items-center gap-2 px-5 py-3 rounded-xl border border-border/40 bg-secondary/20 min-w-[90px] cursor-default hover:bg-secondary/30 transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" style={{ color: node.color }} />
                  <span className="text-xs font-semibold text-foreground">{node.label}</span>
                </div>

                {i < archNodes.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                  >
                    <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-center text-muted-foreground/50 font-mono"
        >
          {architecturePattern}
        </motion.p>
      </div>

      {/* Data Flow */}
      <div className="pt-2 border-t border-border/30 space-y-3">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-neon-green" />
          <p className="text-sm font-semibold text-foreground">Data Flow</p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative px-4 py-3 rounded-lg bg-secondary/20 border border-border/20"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-accent to-success" />
          <p className="text-xs text-muted-foreground leading-relaxed pl-3">{dataFlow}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
