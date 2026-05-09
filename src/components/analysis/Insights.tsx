import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BookOpen, FolderTree, Shield, Lightbulb, ChevronDown } from "lucide-react";
import { AnalysisResult } from "@/types/repo";

const HEALTH_CONFIG: Record<string, { color: string; bgColor: string; ringColor: string; percent: number; label: string }> = {
  good: { color: "hsl(160, 84%, 39%)", bgColor: "bg-success/10", ringColor: "text-success", percent: 90, label: "Good" },
  average: { color: "hsl(38, 92%, 50%)", bgColor: "bg-warning/10", ringColor: "text-warning", percent: 60, label: "Average" },
  poor: { color: "hsl(0, 84%, 60%)", bgColor: "bg-destructive/10", ringColor: "text-destructive", percent: 25, label: "Poor" },
  "well-structured": { color: "hsl(160, 84%, 39%)", bgColor: "bg-success/10", ringColor: "text-success", percent: 85, label: "Well Structured" },
  "needs-improvement": { color: "hsl(38, 92%, 50%)", bgColor: "bg-warning/10", ringColor: "text-warning", percent: 45, label: "Needs Work" },
  "production-ready": { color: "hsl(160, 84%, 39%)", bgColor: "bg-success/10", ringColor: "text-success", percent: 95, label: "Production Ready" },
  beta: { color: "hsl(38, 92%, 50%)", bgColor: "bg-warning/10", ringColor: "text-warning", percent: 65, label: "Beta" },
  experimental: { color: "hsl(215, 20%, 55%)", bgColor: "bg-muted/20", ringColor: "text-muted-foreground", percent: 30, label: "Experimental" },
};

function GaugeRing({ value, color, size = 56, strokeWidth = 5 }: { value: number; color: string; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="gauge-ring">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(230 20% 15%)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}

interface InsightsProps {
  analysis: AnalysisResult;
}

export function Insights({ analysis }: InsightsProps) {
  const { healthIndicators, improvements } = analysis;
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(null);

  const gauges = [
    { key: healthIndicators.documentation, label: "Documentation", icon: BookOpen },
    { key: healthIndicators.codeOrganization, label: "Organization", icon: FolderTree },
    { key: healthIndicators.maturity, label: "Maturity", icon: Shield },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-6 space-y-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-warning/40 to-transparent" />

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-warning" />
        </div>
        <h3 className="text-lg font-semibold">Insights</h3>
      </div>

      {/* Gauge Charts */}
      <div className="grid grid-cols-3 gap-4">
        {gauges.map((gauge, i) => {
          const config = HEALTH_CONFIG[gauge.key] || HEALTH_CONFIG.average;
          const GaugeIcon = gauge.icon;
          return (
            <motion.div
              key={gauge.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/20 border border-border/20"
            >
              <div className="relative">
                <GaugeRing value={config.percent} color={config.color} size={52} strokeWidth={4} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <GaugeIcon className={`w-3.5 h-3.5 ${config.ringColor}`} />
                </div>
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${config.ringColor}`}>
                  {config.label}
                </p>
                <p className="text-[10px] text-muted-foreground/50">{gauge.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Suggestions */}
      {improvements.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-border/20">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-warning" />
            <p className="text-sm font-semibold text-foreground">Suggestions</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
              {improvements.length}
            </span>
          </div>

          <div className="space-y-1.5">
            {improvements.map((imp, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                onClick={() => setExpandedSuggestion(expandedSuggestion === i ? null : i)}
                className="w-full text-left px-3 py-2 rounded-lg bg-secondary/20 border border-border/20 hover:border-border/40 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-[10px] text-muted-foreground/40 font-mono mt-0.5 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <p className={`text-xs text-muted-foreground hover:text-foreground/80 transition-colors leading-relaxed ${
                    expandedSuggestion === i ? '' : 'line-clamp-1'
                  }`}>
                    {imp}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
