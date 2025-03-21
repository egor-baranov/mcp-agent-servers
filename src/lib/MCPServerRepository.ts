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
        const {
            title,
            description,
            category,
            link,
            uid,
            active,
            created,
            deleted
        } = server;
        const query = `
      INSERT INTO mcp_servers (title, description, category, link, uid, active, created, deleted)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
        try {
            const res = await this.pool.query(query, [title, description, category, link, uid, active, created, deleted]);
            return res.rows[0]; // Return the newly created entity with its generated ID
        } catch (error) {
            throw new Error(`Failed to add server: ${error.message}`);
        }
    }

    // REMOVE ONE ENTITY
    async remove(id: number): Promise<void> {
        const query = `
        UPDATE mcp_servers 
        SET 
            active = false,
            deleted = $2
        WHERE id = $1;
    `;
        try {
            await this.pool.query(query, [id, new Date().toISOString()]);
        } catch (error) {
            throw new Error(`Failed to remove server: ${error.message}`);
        }
    }
}