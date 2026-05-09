import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExampleRepos } from "./ExampleRepos";
import { RecentRepos } from "./RecentRepos";
import { parseGitHubUrl } from "@/lib/github";

interface RepoInputProps {
  onAnalyze: (owner: string, repo: string) => void;
  isLoading: boolean;
  recentRepos: string[];
  onAddRecent: (repo: string) => void;
  onRemoveRecent: (repo: string) => void;
}

export function RepoInput({ onAnalyze, isLoading, recentRepos, onAddRecent, onRemoveRecent }: RepoInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    submit(url);
  };

  const submit = (value: string) => {
    setError("");
    const parsed = parseGitHubUrl(value);
    if (!parsed) {
      setError("Please enter a valid GitHub URL or owner/repo format");
      return;
    }
    onAddRecent(`${parsed.owner}/${parsed.repo}`);
    onAnalyze(parsed.owner, parsed.repo);
  };

  const handleSelect = (value: string) => {
    setUrl(value);
    submit(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      {/* Hero Badge */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full neon-badge text-sm font-medium"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Repository Analysis
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
            <span className="gradient-text">RepoLens</span>{" "}
            <span className="text-foreground">AI</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto leading-relaxed"
        >
          Understand any GitHub repository in seconds with{" "}
          <span className="text-primary font-medium">AI-powered</span> architecture analysis
        </motion.p>
      </div>

      {/* Search Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-4"
      >
        <div className={`relative group transition-all duration-500 ${isFocused ? 'scale-[1.02]' : ''}`}>
          {/* Glow effect behind input */}
          <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-lg transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />

          <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${
            isFocused
              ? 'border-primary/50 bg-card/90 shadow-lg shadow-primary/5'
              : 'border-border/50 bg-card/60 hover:border-border'
          }`}>
            <Search className={`ml-5 w-5 h-5 transition-colors duration-300 flex-shrink-0 ${
              isFocused ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="github.com/owner/repo or owner/repo"
              className="flex-1 h-14 px-4 text-base bg-transparent outline-none placeholder:text-muted-foreground/50 text-foreground"
              disabled={isLoading}
            />
            <div className="pr-2 flex-shrink-0">
              <Button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="rounded-lg h-10 px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Analyze
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm text-center">
            {error}
          </motion.p>
        )}
      </motion.form>

      {/* Example & Recent Repos */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="space-y-4"
      >
        <ExampleRepos onSelect={handleSelect} />
        <RecentRepos repos={recentRepos} onSelect={handleSelect} onRemove={onRemoveRecent} />
      </motion.div>
    </motion.div>
  );
}
