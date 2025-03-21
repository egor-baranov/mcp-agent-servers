// src/types.ts
export interface MCPServer {
    id: number,
    title: string;
    description: string;
    category: string;
    link: string;
    uid: string;
    active: boolean;
    created: string;
    deleted: string;
}

export interface AppState {
    servers: MCPServer[];
    categories: Category[];
    selectedCategory: string;
}

export interface Category {
    name: string;
}