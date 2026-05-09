import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FolderTree as FolderTreeIcon, Brain, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { RepoInput } from "@/components/repo-input/RepoInput";
import { RepoHeader } from "@/components/analysis/RepoHeader";
import { OverviewCard } from "@/components/analysis/OverviewCard";
import { TechStack } from "@/components/analysis/TechStack";
import { KeyModules } from "@/components/analysis/KeyModules";
import { Insights } from "@/components/analysis/Insights";
import { LoadingState } from "@/components/analysis/LoadingState";
import { FileTree } from "@/components/file-explorer/FileTree";
import { FileViewer } from "@/components/file-explorer/FileViewer";
import { useRepoAnalysis } from "@/hooks/useRepoAnalysis";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FileNode } from "@/types/repo";
import { fetchFileContent } from "@/lib/github";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

const Index = () => {
  const [recentRepos, setRecentRepos] = useLocalStorage<string[]>("repolens-recent", []);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileExplanation, setFileExplanation] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);

  const { repoInfo, fileTree, analysis, isLoading, loadingStep, error, analyze, explainFile, reset } = useRepoAnalysis();

  const handleAddRecent = (repo: string) => {
    setRecentRepos((prev) => [repo, ...prev.filter((r) => r !== repo)].slice(0, 10));
  };

  const handleRemoveRecent = (repo: string) => {
    setRecentRepos((prev) => prev.filter((r) => r !== repo));
  };

  const handleSelectFile = (node: FileNode) => {
    setSelectedFile(node);
    setFileExplanation(null);
  };

  const handleExplainFile = async () => {
    if (!selectedFile || !repoInfo) return;
    setExplaining(true);
    try {
      const content = await fetchFileContent(repoInfo.owner, repoInfo.repo, selectedFile.path);
      const explanation = await explainFile(repoInfo.owner, repoInfo.repo, selectedFile.path, content);
      setFileExplanation(explanation);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to explain file");
    } finally {
      setExplaining(false);
    }
  };

  const handleBack = () => {
    reset();
    setSelectedFile(null);
    setFileExplanation(null);
  };

  const showResults = repoInfo && analysis && !isLoading;

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/20">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />
        <div className="relative container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2.5 font-bold text-lg cursor-pointer hover:opacity-80 transition-all duration-300 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="gradient-text font-extrabold tracking-tight">RepoLens</span>
          </button>
          <div className="flex items-center gap-2">
            {showResults && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-primary border border-border/30 hover:border-primary/30 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  New Analysis
                </Button>
              </motion.div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container max-w-7xl mx-auto px-4 py-8">
        {/* Input State — Landing Page */}
        {!repoInfo && !isLoading && (
          <div className="flex items-center justify-center min-h-[70vh]">
            <RepoInput
              onAnalyze={analyze}
              isLoading={isLoading}
              recentRepos={recentRepos}
              onAddRecent={handleAddRecent}
              onRemoveRecent={handleRemoveRecent}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState step={loadingStep} />}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-destructive text-sm">{error}</p>
            <Button onClick={handleBack} variant="outline" className="border-border/50 hover:border-primary/30">
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Results — Visual Analysis Dashboard */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <RepoHeader repo={repoInfo} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                <OverviewCard
                  overview={analysis.overview}
                  architecturePattern={analysis.architecturePattern}
                  dataFlow={analysis.dataFlow}
                />
                <TechStack items={analysis.techStack} />
                <KeyModules modules={analysis.keyModules} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Insights analysis={analysis} />

                {/* File Explorer */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card rounded-2xl p-5 space-y-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <FolderTreeIcon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold">File Explorer</h3>
                  </div>
                  <div className="max-h-[400px] overflow-auto">
                    <FileTree
                      nodes={fileTree}
                      selectedPath={selectedFile?.path}
                      onSelect={handleSelectFile}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* File Viewer Panel */}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6 space-y-4 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm font-mono text-muted-foreground">{selectedFile.path}</h3>
                  <Button
                    size="sm"
                    onClick={handleExplainFile}
                    disabled={explaining}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium"
                  >
                    {explaining ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-1.5" />
                    )}
                    Explain with AI
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FileViewer owner={repoInfo.owner} repo={repoInfo.repo} filePath={selectedFile.path} />
                  {fileExplanation && (
                    <motion.div
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded-xl border border-border/30 bg-secondary/20 p-5 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">AI Explanation</span>
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {fileExplanation}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      {/* Footer accent line */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-50 pointer-events-none" />
    </div>
  );
};

export default Index;
