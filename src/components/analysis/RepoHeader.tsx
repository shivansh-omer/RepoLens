import { motion } from "framer-motion";
import { Star, GitFork, Code2, ExternalLink, Eye } from "lucide-react";
import { RepoInfo } from "@/types/repo";

interface RepoHeaderProps {
  repo: RepoInfo;
}

function AnimatedCounter({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="font-bold tabular-nums"
    >
      {value.toLocaleString()}
    </motion.span>
  );
}

export function RepoHeader({ repo }: RepoHeaderProps) {
  const stats = [
    { icon: Star, label: "Stars", value: repo.stars, color: "text-warning" },
    { icon: GitFork, label: "Forks", value: repo.forks, color: "text-primary" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-3 flex-1 min-w-0">
          {/* Repo name */}
          <div className="flex items-start gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                <span className="text-muted-foreground/60 font-normal">{repo.owner}/</span>
                <span className="gradient-text-static">{repo.repo}</span>
              </h2>
              {repo.description && (
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-xl">
                  {repo.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/30"
              >
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <AnimatedCounter value={stat.value} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
            {repo.language && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg neon-badge"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{repo.language}</span>
              </motion.div>
            )}
          </div>

          {/* Topics */}
          {repo.topics.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {repo.topics.slice(0, 6).map((topic, i) => (
                <motion.span
                  key={topic}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15 transition-colors"
                >
                  {topic}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>

        {/* External link */}
        <motion.a
          href={`https://github.com/${repo.owner}/${repo.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300 text-sm self-start hover:opacity-90"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden md:inline">View on GitHub</span>
        </motion.a>
      </div>
    </motion.div>
  );
}
