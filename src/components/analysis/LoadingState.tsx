import { motion } from "framer-motion";
import { FolderSearch, FileSearch, Cpu, Sparkles, Check } from "lucide-react";

const STEPS = [
  { label: "Fetching repository structure", icon: FolderSearch },
  { label: "Reading key files", icon: FileSearch },
  { label: "Analyzing architecture", icon: Cpu },
  { label: "Generating insights", icon: Sparkles },
];

interface LoadingStateProps {
  step: number;
}

export function LoadingState({ step }: LoadingStateProps) {
  return (
    <div className="max-w-md mx-auto py-20 space-y-12">
      {/* Headline */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-sm text-muted-foreground tracking-wide"
      >
        Analyzing repository…
      </motion.p>

      {/* DNA Helix Animation */}
      <div className="flex justify-center">
        <div className="helix-container">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="helix-pair"
              style={{ animationDelay: `${i * -0.15}s` }}
            >
              <div className="helix-dot helix-dot-a" />
              <div className="helix-bar" />
              <div className="helix-dot helix-dot-b" />
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-[3px] rounded-full bg-border/40 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "hsl(195 100% 50%)" }}
            initial={{ width: "0%" }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground/50 text-center tabular-nums">
          {step + 1} / {STEPS.length}
        </p>
      </div>

      {/* Step Timeline */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border/30" />

        <div className="space-y-5">
          {STEPS.map((s, i) => {
            const isActive = i === step;
            const isComplete = i < step;
            const Icon = s.icon;

            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: isComplete || isActive ? 1 : 0.35 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="relative flex items-center gap-3"
              >
                {/* Timeline dot */}
                <div className="absolute -left-8 flex items-center justify-center w-[22px] h-[22px]">
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-[22px] h-[22px] rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                    </motion.div>
                  ) : isActive ? (
                    <div className="relative">
                      <div className="w-[22px] h-[22px] rounded-full border border-primary/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary loading-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-[22px] h-[22px] rounded-full border border-border/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
                    </div>
                  )}
                </div>

                {/* Step content */}
                <div className="flex items-center gap-2.5 min-h-[22px]">
                  <Icon
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      isActive
                        ? "text-primary"
                        : isComplete
                        ? "text-muted-foreground/60"
                        : "text-muted-foreground/25"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isActive
                        ? "text-foreground font-medium"
                        : isComplete
                        ? "text-muted-foreground/70"
                        : "text-muted-foreground/30"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
