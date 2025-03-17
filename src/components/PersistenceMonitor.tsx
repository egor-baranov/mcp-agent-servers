// components/PersistenceMonitor.tsx
import { useEffect } from 'react';
import { persistor } from '@/lib/redux/store';
import { store } from '@/lib/redux/store';
import { PersistorState } from 'redux-persist';
import { RootState } from '@/lib/redux/store';

export default function PersistenceMonitor() {
    useEffect(() => {
        console.log('[PersistenceMonitor] Component mounted');

        const logPersistState = () => {
            try {
                const persistState: PersistorState = persistor.getState();
                const reduxState: RootState = store.getState();

                console.groupCollapsed('[Redux-Persist] Status Update');
                console.log('Persistence Engine:', {
                    bootstrapped: persistState.bootstrapped,
                    status: persistState.status,
                    registry: Object.keys(persistState.registry)
                });

                console.log('Application State:', {
                    version: reduxState.mcp._persist.version,
                    rehydrated: reduxState.mcp._persist.rehydrated,
                    serverCount: reduxState.mcp.servers.length
                });

                console.log('Raw Persisted Data:', reduxState.mcp);
                console.groupEnd();
            } catch (error) {
                console.error('[PersistenceMonitor] Error logging state:', error);
            }
        };

        // Initial state dump
        console.log('[PersistenceMonitor] Initial Redux State:', store.getState());

        // Subscribe to persistor changes
        const unsubscribe = persistor.subscribe(logPersistState);

        // Force initial log
        logPersistState();

        return () => {
            console.log('[PersistenceMonitor] Component unmounted');
            unsubscribe();
        };
    }, []);

    return null;
}