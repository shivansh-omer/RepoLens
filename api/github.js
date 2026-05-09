export default async function handler(req, res) {
    // CORS setup
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { action, owner, repo, path } = req.body;

        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

        const headers = {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "RepoLens-AI",
        };
        if (GITHUB_TOKEN) {
            headers["Authorization"] = `token ${GITHUB_TOKEN}`;
        }

        const GITHUB_API = "https://api.github.com";

        if (action === "repoInfo") {
            const ghRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers });
            if (!ghRes.ok) {
                if (ghRes.status === 404) {
                    return res.status(404).json({ error: "Repository not found. Make sure it's a public repository." });
                }
                if (ghRes.status === 403) {
                    return res.status(403).json({ error: "GitHub API rate limit exceeded. Please add a GITHUB_TOKEN to your .env file." });
                }
                return res.status(ghRes.status).json({ error: `Failed to fetch repository info (${ghRes.status})` });
            }
            const data = await ghRes.json();
            return res.status(200).json(data);

        } else if (action === "repoTree") {
            // First get the default branch SHA
            const repoRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers });
            if (!repoRes.ok) {
                if (repoRes.status === 404) {
                    return res.status(404).json({ error: "Repository not found." });
                }
                if (repoRes.status === 403) {
                    return res.status(403).json({ error: "GitHub API rate limit exceeded. Please add a GITHUB_TOKEN to your .env file." });
                }
                return res.status(repoRes.status).json({ error: `Failed to fetch repo (${repoRes.status})` });
            }
            const repoData = await repoRes.json();
            const defaultBranch = repoData.default_branch || "main";

            // Use Git Trees API with recursive flag — single request for entire tree
            const treeRes = await fetch(
                `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
                { headers }
            );
            if (!treeRes.ok) {
                if (treeRes.status === 403) {
                    return res.status(403).json({ error: "GitHub API rate limit exceeded. Please add a GITHUB_TOKEN to your .env file." });
                }
                return res.status(treeRes.status).json({ error: `Failed to fetch file tree (${treeRes.status})` });
            }
            const treeData = await treeRes.json();
            return res.status(200).json(treeData);

        } else if (action === "fileContent") {
            const ghRes = await fetch(
                `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
                { headers }
            );
            if (!ghRes.ok) {
                if (ghRes.status === 403) {
                    return res.status(403).json({ error: "GitHub API rate limit exceeded. Please add a GITHUB_TOKEN to your .env file." });
                }
                return res.status(ghRes.status).json({ error: `Failed to fetch file: ${path}` });
            }
            const data = await ghRes.json();
            return res.status(200).json(data);

        } else {
            return res.status(400).json({ error: `Unknown action: ${action}` });
        }
    } catch (error) {
        console.error("Error in /api/github:", error);
        return res.status(500).json({ error: error.message || "An error occurred." });
    }
}
