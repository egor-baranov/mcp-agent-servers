// src/lib/MCPManager.ts
import { storage } from "@/lib/persistence/storage";

interface MCPServer {
    title: string;
    description: string;
    category: string;
    link: string;
}

interface MCPState {
    servers: MCPServer[];
    _persist: {
        version: number;
        rehydrated: boolean;
    };
}

class MCPManager {
    private static instance: MCPManager;
    private state: MCPState = {
        servers: [],
        _persist: { version: -1, rehydrated: false }
    };

    private constructor() {
        this.initialize();
    }

    public static getInstance(): MCPManager {
        if (!MCPManager.instance) {
            MCPManager.instance = new MCPManager();
        }
        return MCPManager.instance;
    }

    private async initialize() {
        try {
            const data = await storage.getItem('mcp');
            if (data) {
                const parsed = JSON.parse(data);
                this.state = {
                    servers: Array.isArray(parsed.servers) ? parsed.servers : [],
                    _persist: parsed._persist || { version: -1, rehydrated: true }
                };
            }
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    }

    private async persist() {
        try {
            await storage.setItem('mcp', JSON.stringify(this.state));
        } catch (error) {
            console.error('Persistence failed:', error);
        }
    }

    public async addServer(server: MCPServer) {
        this.state.servers.push(server);
        await this.persist();
    }

    public async updateServers(newServers: MCPServer[]) {
        this.state.servers = [...newServers];
        await this.persist();
    }

    public async resetServers() {
        this.state.servers = [];
        await this.persist();
    }

    public getServers(): MCPServer[] {
        return [...this.state.servers];
    }
}

export const mcpManager = MCPManager.getInstance();