import { useState, useCallback } from "react";
import { toast } from "sonner";
import { RepoInfo, FileNode, AnalysisResult } from "@/types/repo";
import { fetchRepoInfo, fetchRepoTree, fetchKeyFiles, buildTreeString } from "@/lib/github";

interface AnalysisState {
  repoInfo: RepoInfo | null;
  fileTree: FileNode[];
  analysis: AnalysisResult | null;
  isLoading: boolean;
  loadingStep: number;
  error: string | null;
}

export function useRepoAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    repoInfo: null,
    fileTree: [],
    analysis: null,
    isLoading: false,
    loadingStep: 0,
    error: null,
  });

  const analyze = useCallback(async (owner: string, repo: string) => {
    setState({ repoInfo: null, fileTree: [], analysis: null, isLoading: true, loadingStep: 0, error: null });

    try {
      // Fetch repo metadata
      const repoInfo = await fetchRepoInfo(owner, repo);
      setState(s => ({ ...s, repoInfo, loadingStep: 1 }));

      // Fetch file tree
      const fileTree = await fetchRepoTree(owner, repo);
      setState(s => ({ ...s, fileTree, loadingStep: 2 }));

      // Get critical files for context
      const keyFiles = await fetchKeyFiles(owner, repo, fileTree);
      const treeString = buildTreeString(fileTree);
      setState(s => ({ ...s, loadingStep: 3 }));

      // Analyze via backend
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner,
          repo,
          description: repoInfo.description,
          language: repoInfo.language,
          treeString,
          keyFiles
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed: ${res.statusText}`);
      }

      const data = await res.json();
      const resultStr = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      let analysis: AnalysisResult;
      try {
        // Strip markdown codeblocks
        const cleanedStr = resultStr.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        analysis = JSON.parse(cleanedStr);
      } catch {
        throw new Error("Failed to parse AI response. Please try again.");
      }

      setState(s => ({ ...s, analysis, isLoading: false, loadingStep: 4 }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "An error occurred";
      setState(s => ({ ...s, isLoading: false, error: msg }));
      toast.error(msg);
    }
  }, []);

  const explainFile = useCallback(async (owner: string, repo: string, filePath: string, content: string): Promise<string> => {
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath, content }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to explain file");
    }
    
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No explanation generated.";
  }, []);

  const reset = useCallback(() => {
    setState({ repoInfo: null, fileTree: [], analysis: null, isLoading: false, loadingStep: 0, error: null });
  }, []);

  return { ...state, analyze, explainFile, reset };
}
