import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, FileCode, Loader2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchFileContent } from "@/lib/github";

interface FileViewerProps {
  owner: string;
  repo: string;
  filePath: string;
}

export function FileViewer({ owner, repo, filePath }: FileViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchFileContent(owner, repo, filePath)
      .then((c) => { if (!cancelled) setContent(c); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [owner, repo, filePath]);

  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive p-4">{error}</p>;
  }

  if (!content) return null;

  const lines = content.split("\n");
  const ext = filePath.split(".").pop()?.toLowerCase() || "";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-t-xl bg-secondary/60 border border-border/30 border-b-0">
        <div className="flex items-center gap-2">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground font-mono">{filePath}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-xs text-muted-foreground hover:text-primary"
        >
          {copied ? (
            <span className="flex items-center gap-1 text-success">
              <Check className="w-3 h-3" /> Copied
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="w-3 h-3" /> Copy
            </span>
          )}
        </Button>
      </div>

      {/* Code content */}
      <div className="rounded-b-xl bg-[hsl(230,25%,6%)] border border-border/30 border-t-0 overflow-auto max-h-[500px]">
        <pre className="text-xs font-mono p-4 leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex hover:bg-secondary/20 transition-colors -mx-4 px-4">
                <span className="text-muted-foreground/30 w-10 text-right pr-4 select-none flex-shrink-0 border-r border-border/10 mr-4">
                  {i + 1}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all text-foreground/80">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}
