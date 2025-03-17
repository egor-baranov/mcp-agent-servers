// src/lib/redux/store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer, persistStore, PersistConfig } from 'redux-persist';
import { storage } from "@/lib/persistence/storage";
import {PersistedState} from "redux-persist/es/types";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";

// 1. Define core types
export interface MCPServer {
    title: string;
    description: string;
    category: string;
    link: string;
}

interface MCPState {
    servers: MCPServer[];
    _persist?: {  // Added for TypeScript compatibility
        version: number;
        rehydrated: boolean;
    };
}

// 2. Initial state with TypeScript assertion
const initialState: MCPState = {
    servers: []
};

// 3. Redux slice with typed reducers
const mcpSlice = createSlice({
    name: 'mcp',
    initialState,
    reducers: {
        addServer: (state, action: PayloadAction<MCPServer>) => {
            state.servers.push(action.payload);
        },
        updateServers: (state, action: PayloadAction<MCPServer[]>) => {
            state.servers = action.payload;
        },
        resetServers: (state) => {
            state.servers = [];
        }
    },
});

const persistConfig: PersistConfig<MCPState> = {
    key: 'mcp',
    storage,
    stateReconciler: autoMergeLevel1,
    serialize: true, // Enable serialization
    timeout: 150, // 10-second timeout
    migrate: (state: any) => {
        // Reset if state is invalid or version mismatch
        if (!state || !state.servers || typeof state.servers !== 'object') {
            return Promise.resolve({
                servers: [],
                _persist: { version: -1, rehydrated: false }
            });
        }
        return Promise.resolve(state); // Keep existing state if valid [[7]]
    }
};

// 5. Create persisted reducer
const persistedReducer = persistReducer(persistConfig, mcpSlice.reducer);

// 6. Configure store with middleware
export const store = configureStore({
    reducer: {
        mcp: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Add REHYDRATE [[7]][[8]]
                ignoredPaths: ['_persist', 'mcp._persist'] // Ignore nested persist metadata [[3]][[6]]
            }
        })
});

// 7. Export utilities
export const persistor = persistStore(store);
export const { addServer, updateServers, resetServers } = mcpSlice.actions;

// 8. Type exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;