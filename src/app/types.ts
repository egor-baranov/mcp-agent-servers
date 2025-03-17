// src/types.ts
export interface MCPServer {
    title: string;
    description: string;
    category: string;
    link: string;
}

export interface AppState {
    servers: MCPServer[];
    categories: Category[];
    selectedCategory: string;
}

export interface Category {
    name: string;
}