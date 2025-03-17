// src/lib/logger.ts
import { NextApiRequest, NextApiResponse } from 'next';

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

export function withLogging(handler: NextApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const start = Date.now();
        const originalEnd = res.end.bind(res);

        // Log request start
        console.log(`[REQ START] ${req.method} ${req.url}`, {
            query: req.query,
            body: req.body
        });

        // Override end method
        (res as any).end = (...args: any[]) => {
            const duration = Date.now() - start;

            // Log response completion
            console.log(`[RES END] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`, {
                status: res.statusCode,
                duration: `${duration}ms`,
                headers: res.getHeaders()
            });

            originalEnd(...args);
        };

        try {
            await handler(req, res);

            // If response isn't handled, log that
            if (!res.writableEnded) {
                console.log(`[RES UNHANDLED] ${req.method} ${req.url} - No response sent`);
            }
        } catch (error) {
            console.error(`[ERROR] ${req.method} ${req.url}`, error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };
}