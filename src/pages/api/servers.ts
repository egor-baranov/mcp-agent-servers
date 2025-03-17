import type {NextApiRequest, NextApiResponse} from 'next';
import {withLogging} from "@/lib/logger/logger";

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

let storageData: PersistedState = {
    servers: [],
    _persist: {
        version: -1,
        rehydrated: false
    }
};

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
            case 'GET':
                console.log('Processing GET request');
                res.status(200).json(storageData);
                break;

            case 'POST':
                if (!req.body || typeof req.body !== 'object') {
                    return res.status(400).json({error: 'Invalid request format'});
                }

                // Handle stringified values
                const incomingData = {
                    servers: typeof req.body.servers === 'string'
                        ? JSON.parse(req.body.servers)
                        : req.body.servers,
                    _persist: typeof req.body._persist === 'string'
                        ? JSON.parse(req.body._persist)
                        : req.body._persist
                };

                // Validate parsed data
                if (!Array.isArray(incomingData.servers)) {
                    return res.status(400).json({error: 'Invalid servers format'});
                }

                storageData = {
                    servers: incomingData.servers,
                    _persist: {
                        version: incomingData._persist?.version || storageData._persist.version,
                        rehydrated: incomingData._persist?.rehydrated || storageData._persist.rehydrated
                    }
                };

                res.status(200).json({ success: true });
                break;

            case 'DELETE':
                console.log('Processing DELETE request');
                storageData = {
                    servers: [],
                    _persist: storageData._persist
                };
                res.status(200).json({success: true});
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
                res.status(405).json({error: `Method ${req.method} Not Allowed`});
        }
    } catch (error) {
        console.error('Handler error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export default withLogging(handler);