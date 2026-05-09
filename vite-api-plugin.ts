import { Plugin, loadEnv } from 'vite';

export function apiPlugin(): Plugin {
    return {
        name: 'vite-plugin-api',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url?.startsWith('/api/')) {
                    return next();
                }

                // Load environment variables so process.env is populated for our Vercel handlers
                const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
                if (env.GEMINI_API_KEY) {
                    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
                }
                if (env.GITHUB_TOKEN) {
                    process.env.GITHUB_TOKEN = env.GITHUB_TOKEN;
                }

                // Patch native Node.js 'res' to mimic Express/Vercel behavior
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const responseListner = res as any;
                responseListner.status = (code: number) => {
                    responseListner.statusCode = code;
                    return responseListner;
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                responseListner.json = (data: any) => {
                    responseListner.setHeader('Content-Type', 'application/json');
                    responseListner.end(JSON.stringify(data));
                    return responseListner;
                };

                try {
                    // Parse JSON body manually like Express would
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });

                    req.on('end', async () => {
                        try {
                            if (body) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (req as any).body = JSON.parse(body);
                            }
                        } catch (e) {
                            // Ignore empty or invalid JSON parse errors
                        }

                        const urlPath = req.url!.split('?')[0];

                        try {
                            // Dynamically import the handlers we created
                            if (urlPath === '/api/analyze') {
                                // @ts-expect-error: ignore dynamic import
                                const handler = (await import('./api/analyze.js')).default;
                                await handler(req, res);
                            } else if (urlPath === '/api/explain') {
                                // @ts-expect-error: ignore dynamic import
                                const handler = (await import('./api/explain.js')).default;
                                await handler(req, res);
                            } else if (urlPath === '/api/github') {
                                // @ts-expect-error: ignore dynamic import
                                const handler = (await import('./api/github.js')).default;
                                await handler(req, res);
                            } else {
                                responseListner.status(404).json({ error: 'API route not found' });
                            }
                        } catch (importError) {
                            console.error("Failed to execute handler:", importError);
                            responseListner.status(500).json({ error: 'Failed to execute API function.' });
                        }
                    });
                } catch (error) {
                    console.error("API Plugin Error:", error);
                    responseListner.status(500).json({ error: 'Internal Server Error' });
                }
            });
        }
    };
}
