export default async function handler(req, res) {
    // CORS setup for local development proxying
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
        const { owner, repo, description, language, treeString, keyFiles } = req.body;

        // Ensure the Vercel Envrionment variable is loaded
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
        }

        const systemPrompt = "You are an expert software architect. Respond ONLY with valid JSON, no markdown fences.";
        const userPrompt = `Analyze this GitHub repository and respond with ONLY valid JSON (no markdown, no code fences):

REPOSITORY: ${owner}/${repo}
DESCRIPTION: ${description || "None"}
PRIMARY LANGUAGE: ${language || "Unknown"}
DIRECTORY STRUCTURE:
${treeString.slice(0, 5000)}

KEY FILES:
${Object.entries(keyFiles || {}).map(([path, content]) => `--- ${path} ---\n${String(content).slice(0, 2000)}`).join("\n\n")}

Return this exact JSON structure:
{
  "overview": "2-3 sentence project overview",
  "techStack": [{"name": "string", "category": "frontend|backend|database|devops|testing|other", "confidence": "high|medium|low"}],
  "architecturePattern": "description of architecture pattern",
  "dataFlow": "description of data flow",
  "keyModules": [{"name": "string", "purpose": "string", "location": "string", "criticalFiles": ["string"]}],
  "healthIndicators": {
    "documentation": "good|average|poor",
    "codeOrganization": "well-structured|needs-improvement",
    "maturity": "production-ready|beta|experimental"
  },
  "improvements": ["suggestion 1", "suggestion 2"]
}`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: userPrompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                }
            }),
        });

        if (!geminiRes.ok) {
            const errData = await geminiRes.text();
            console.error("Gemini error detail:", errData);
            throw new Error(`Gemini API error: ${geminiRes.status}`);
        }

        const data = await geminiRes.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("Error in /api/analyze:", error);
        return res.status(500).json({ error: error.message || "An error occurred during analysis." });
    }
}
