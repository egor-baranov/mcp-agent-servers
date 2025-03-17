import { NextResponse } from 'next/server';
import pg from 'pg';
import {MCPServerRepository} from "@/lib/MCPServerRepository";

// Initialize the pool with environment variables [[3]][[6]]
const pool = new pg.Pool({
    user: 'user',
    password: 'password',
    database: 'mcp_db',
    host: 'localhost',
    port: 5444,
});


const repo = new MCPServerRepository(pool);

// GET ALL SERVERS
export async function GET() {
    try {
        const servers = await repo.getAll();
        console.log("Get servers:", servers);
        return NextResponse.json(servers);
    } catch (error) {
        console.error("Failed:", error);
        return NextResponse.json({ error: 'Failed to fetch servers' }, undefined);
    }
}

// ADD A SERVER
export async function POST(request: Request) {
    try {
        const serverData = await request.json();
        const newServer = await repo.add(serverData);
        console.log("New server: ", newServer);
        return NextResponse.json(newServer, undefined);
    } catch (error) {
        console.error("Failed:", error);
        return NextResponse.json({ error: 'Failed to add server' }, undefined);
    }
}

// DELETE A SERVER
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await repo.remove(id);
        console.log("Remove by id: ", id);
        return NextResponse.json({ message: 'Server deleted' });
    } catch (error) {
        console.error("Failed:", error);
        return NextResponse.json({ error: 'Failed to delete server' }, undefined);
    }
}