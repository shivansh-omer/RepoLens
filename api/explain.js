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
        const { filePath, content } = req.body;

        // Ensure the Vercel Envrionment variable is loaded
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
        }

        const systemPrompt = "You are a senior developer explaining code to a junior engineer. Be concise and jargon-free.";
        const userPrompt = `FILE: ${filePath}\nCONTENT:\n${content.slice(0, 8000)}\n\nExplain:\n1. PURPOSE (1 sentence)\n2. KEY COMPONENTS - Main functions/classes and responsibilities\n3. DEPENDENCIES - Imports and connections\n4. ARCHITECTURAL ROLE - Where it fits\n5. IMPORTANT NOTES - Critical logic, gotchas\n\nKeep it concise.`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: userPrompt }] }]
            }),
        });

        if (!geminiRes.ok) {
            throw new Error(`Gemini API error: ${geminiRes.status}`);
        }

        const data = await geminiRes.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("Error in /api/explain:", error);
        return res.status(500).json({ error: error.message || "An error occurred during explanation." });
    }
}
