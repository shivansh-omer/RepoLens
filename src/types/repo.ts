export interface RepoInfo {
  owner: string;
  repo: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  defaultBranch: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
  children?: FileNode[];
}

export interface TechStackItem {
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "testing" | "other";
  confidence: "high" | "medium" | "low";
}

export interface KeyModule {
  name: string;
  purpose: string;
  location: string;
  criticalFiles: string[];
}

export interface AnalysisResult {
  overview: string;
  techStack: TechStackItem[];
  architecturePattern: string;
  dataFlow: string;
  keyModules: KeyModule[];
  healthIndicators: {
    documentation: "good" | "average" | "poor";
    codeOrganization: "well-structured" | "needs-improvement";
    maturity: "production-ready" | "beta" | "experimental";
  };
  improvements: string[];
}

export interface FileExplanation {
  purpose: string;
  keyComponents: string[];
  dependencies: string[];
  architecturalRole: string;
  notes: string[];
}
