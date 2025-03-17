import type { NextApiRequest, NextApiResponse } from 'next';
import { withLogging } from '@/lib/logger/logger';
import fs from 'fs/promises';
import path from 'path';

type MCPServer = {
    title: string;
    description: string;
    category: string;
    link: string;
};

type PersistedState = {
    servers: MCPServer[];
    _persist: {
        version: number;
        rehydrated: boolean;
    };
};

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'storageData.json');

async function initializeStorage(): Promise<PersistedState> {
    try {
        const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        const parsedData = JSON.parse(fileContent);
        console.log("parsed data", parsedData);

        return {
            servers: Array.isArray(parsedData.servers) ? parsedData.servers : [],
            _persist: parsedData._persist ?? { version: -1, rehydrated: false },
        };
    } catch (error) {
        console.error('Using default data:', error);
        return { servers: [], _persist: { version: -1, rehydrated: false } };
    }
}

async function saveToFile(data: PersistedState) {
    try {
        const dir = path.dirname(DATA_FILE_PATH);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
        console.log('Data saved to:', DATA_FILE_PATH);
    } catch (error) {
        console.error('Save failed:', error);
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PersistedState | { error: string } | { success: boolean }>
) {
    try {
        switch (req.method) {
            case 'GET': {
                const data = await initializeStorage(); // Load fresh data from file
                res.status(200).json(data);
                break;
            }

            case 'POST': {
                const currentData = await initializeStorage(); // Get latest data

                if (!req.body || typeof req.body !== 'object') {
                    return res.status(400).json({ error: 'Invalid request format' });
                }

                const incomingData = {
                    servers: typeof req.body.servers === 'string'
                        ? JSON.parse(req.body.servers)
                        : req.body.servers,
                    _persist: typeof req.body._persist === 'string'
                        ? JSON.parse(req.body._persist)
                        : req.body._persist
                };

                if (!Array.isArray(incomingData.servers)) {
                    return res.status(400).json({ error: 'Invalid servers format' });
                }

                const updatedData: PersistedState = {
                    servers: incomingData.servers.concat(currentData.servers),
                    _persist: {
                        version: incomingData._persist?.version ?? currentData._persist.version,
                        rehydrated: incomingData._persist?.rehydrated ?? currentData._persist.rehydrated
                    }
                };

                await saveToFile(updatedData);
                res.status(200).json({ success: true });
                break;
            }

            case 'DELETE': {
                const currentData = await initializeStorage(); // Get latest data
                const updatedData = { ...currentData, servers: [] };
                await saveToFile(updatedData);
                res.status(200).json({ success: true });
                break;
            }

            default:
                res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error('Handler error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default withLogging(handler);