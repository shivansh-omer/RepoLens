import { FileNode, RepoInfo } from "@/types/repo";

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^/]+)\/([^/\s#?]+)/,
    /^([^/\s]+)\/([^/\s]+)$/,
  ];
  for (const pattern of patterns) {
    const match = url.trim().match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    }
  }
  return null;
}

async function githubProxy(body: Record<string, string>) {
  const res = await fetch("/api/github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `GitHub API request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
  const data = await githubProxy({ action: "repoInfo", owner, repo });
  return {
    owner,
    repo,
    description: data.description || "No description",
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language || "Unknown",
    topics: data.topics || [],
    defaultBranch: data.default_branch,
  };
}

export async function fetchRepoTree(owner: string, repo: string): Promise<FileNode[]> {
  const data = await githubProxy({ action: "repoTree", owner, repo });

  // Git Trees API returns a flat list — convert to nested structure
  const tree = data.tree || [];

  // Build nested tree from flat list, limit depth to 2
  const root: FileNode[] = [];
  const dirMap = new Map<string, FileNode>();

  for (const item of tree) {
    const parts: string[] = item.path.split("/");

    // Skip items deeper than depth 3 (root = 0, so depth 2 children are at index 2)
    if (parts.length > 3) continue;

    const node: FileNode = {
      name: parts[parts.length - 1],
      path: item.path,
      type: item.type === "tree" ? "dir" : "file",
      size: item.size || 0,
    };

    if (node.type === "dir") {
      node.children = [];
      dirMap.set(item.path, node);
    }

    if (parts.length === 1) {
      // Top-level item
      root.push(node);
    } else {
      // Find parent directory
      const parentPath = parts.slice(0, -1).join("/");
      const parent = dirMap.get(parentPath);
      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  }

  // Sort: directories first, then alphabetical
  const sortNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    }).map(node => {
      if (node.children) {
        node.children = sortNodes(node.children);
      }
      return node;
    });
  };

  return sortNodes(root);
}

export async function fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
  const data = await githubProxy({ action: "fileContent", owner, repo, path });
  if (data.encoding === "base64") {
    return atob(data.content);
  }
  return data.content || "";
}

const IMPORTANT_FILES = [
  "package.json", "requirements.txt", "Cargo.toml", "go.mod", "pom.xml",
  "README.md", "readme.md",
  "docker-compose.yml", "Dockerfile", ".dockerignore",
  "tsconfig.json", "vite.config.ts", "vite.config.js", "webpack.config.js",
  "next.config.js", "next.config.mjs", "nuxt.config.ts",
  ".env.example", "vercel.json", "netlify.toml",
];

export async function fetchKeyFiles(owner: string, repo: string, tree: FileNode[]): Promise<Record<string, string>> {
  const files: Record<string, string> = {};
  const flatFiles = flattenTree(tree);
  const toFetch = flatFiles
    .filter(f => IMPORTANT_FILES.some(imp => f.path.endsWith(imp)))
    .slice(0, 8);

  await Promise.all(
    toFetch.map(async (f) => {
      try {
        const content = await fetchFileContent(owner, repo, f.path);
        if (content.length < 10000) files[f.path] = content;
      } catch { /* skip */ }
    })
  );
  return files;
}

function flattenTree(nodes: FileNode[]): FileNode[] {
  const result: FileNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") result.push(node);
    if (node.children) result.push(...flattenTree(node.children));
  }
  return result;
}

export function buildTreeString(nodes: FileNode[], prefix = ""): string {
  let result = "";
  nodes.forEach((node, i) => {
    const isLast = i === nodes.length - 1;
    const connector = isLast ? "└── " : "├── ";
    result += `${prefix}${connector}${node.name}\n`;
    if (node.children) {
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      result += buildTreeString(node.children, nextPrefix);
    }
  });
  return result;
}
