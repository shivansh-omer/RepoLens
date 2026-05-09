import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, File, Folder, FolderOpen, FileCode, FileJson, FileText, Image, Settings, FileType } from "lucide-react";
import { FileNode } from "@/types/repo";

const FILE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  ts: { icon: FileCode, color: "text-primary" },
  tsx: { icon: FileCode, color: "text-primary" },
  js: { icon: FileCode, color: "text-warning" },
  jsx: { icon: FileCode, color: "text-warning" },
  json: { icon: FileJson, color: "text-success" },
  md: { icon: FileText, color: "text-muted-foreground" },
  css: { icon: FileType, color: "text-accent" },
  scss: { icon: FileType, color: "text-accent" },
  svg: { icon: Image, color: "text-neon-pink" },
  png: { icon: Image, color: "text-neon-pink" },
  jpg: { icon: Image, color: "text-neon-pink" },
  yaml: { icon: Settings, color: "text-warning" },
  yml: { icon: Settings, color: "text-warning" },
  toml: { icon: Settings, color: "text-warning" },
  env: { icon: Settings, color: "text-warning" },
};

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] || { icon: File, color: "text-muted-foreground/60" };
}

interface FileTreeProps {
  nodes: FileNode[];
  selectedPath?: string;
  onSelect: (node: FileNode) => void;
  depth?: number;
}

export function FileTree({ nodes, selectedPath, onSelect, depth = 0 }: FileTreeProps) {
  return (
    <div className={depth === 0 ? "space-y-0.5" : "ml-3 space-y-0.5 border-l border-border/20 pl-2"}>
      {nodes.map((node) => (
        <FileTreeItem key={node.path} node={node} selectedPath={selectedPath} onSelect={onSelect} depth={depth} />
      ))}
    </div>
  );
}

function FileTreeItem({ node, selectedPath, onSelect, depth }: { node: FileNode; selectedPath?: string; onSelect: (n: FileNode) => void; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const isDir = node.type === "dir";
  const isSelected = node.path === selectedPath;
  const fileIcon = !isDir ? getFileIcon(node.name) : null;

  return (
    <div>
      <motion.button
        whileHover={{ x: 2 }}
        onClick={() => {
          if (isDir) setExpanded(!expanded);
          else onSelect(node);
        }}
        className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-all duration-200 cursor-pointer ${
          isSelected
            ? "bg-primary/10 text-primary font-medium border border-primary/20"
            : "text-foreground/80 hover:bg-secondary/50 hover:text-foreground"
        }`}
      >
        {isDir && (
          <ChevronRight className={`w-3 h-3 transition-transform duration-200 text-muted-foreground/50 ${expanded ? "rotate-90" : ""}`} />
        )}
        {isDir ? (
          expanded ? (
            <FolderOpen className="w-3.5 h-3.5 text-warning flex-shrink-0" />
          ) : (
            <Folder className="w-3.5 h-3.5 text-warning/70 flex-shrink-0" />
          )
        ) : (
          <fileIcon.icon className={`w-3.5 h-3.5 ${fileIcon.color} ml-3 flex-shrink-0`} />
        )}
        <span className="truncate font-mono text-[11px]">{node.name}</span>
      </motion.button>
      <AnimatePresence>
        {isDir && expanded && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <FileTree nodes={node.children} selectedPath={selectedPath} onSelect={onSelect} depth={depth + 1} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
