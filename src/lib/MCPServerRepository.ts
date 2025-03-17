import pg from 'pg';
import {MCPServer} from "@/app/types"; // Adjusted import for CommonJS compatibility [[10]]

export class MCPServerRepository {
    private pool: pg.Pool;

    constructor(pool: pg.Pool) {
        this.pool = pool;
    }

    // GET ALL ENTITIES
    async getAll(): Promise<MCPServer[]> {
        const query = 'SELECT * FROM mcp_servers;';
        try {
            const res = await this.pool.query(query);
            return res.rows; // Return all rows as an array of MCPServer objects
        } catch (error) {
            throw new Error(`Failed to fetch servers: ${error.message}`);
        }
    }

    // ADD ONE ENTITY
    async add(server: Omit<MCPServer, 'id'>): Promise<MCPServer> {
        const { title, description, category, link } = server;
        const query = `
      INSERT INTO mcp_servers (title, description, category, link)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        try {
            const res = await this.pool.query(query, [title, description, category, link]);
            return res.rows[0]; // Return the newly created entity with its generated ID
        } catch (error) {
            throw new Error(`Failed to add server: ${error.message}`);
        }
    }

    // REMOVE ONE ENTITY
    async remove(id: number): Promise<void> {
        const query = 'DELETE FROM mcp_servers WHERE id = $1;';
        try {
            await this.pool.query(query, [id]);
        } catch (error) {
            throw new Error(`Failed to remove server: ${error.message}`);
        }
    }
}