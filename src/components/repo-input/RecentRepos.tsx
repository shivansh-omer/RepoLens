import { Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RecentReposProps {
  repos: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
}

export function RecentRepos({ repos, onSelect, onRemove }: RecentReposProps) {
  if (repos.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5 justify-center">
        <Clock className="w-3 h-3" /> Recent
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <AnimatePresence>
          {repos.slice(0, 5).map((repo) => (
            <motion.div
              key={repo}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/30 bg-card/50 text-xs group hover:border-primary/20 transition-all duration-300"
            >
              <button
                onClick={() => onSelect(repo)}
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer font-mono text-[11px]"
              >
                {repo}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(repo); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/50 hover:text-destructive cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
