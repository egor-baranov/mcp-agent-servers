// src/lib/redux/providers.tsx
'use client';

import {Provider} from 'react-redux';
import {persistor, store} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import React from "react";
import PersistenceMonitor from "@/components/PersistenceMonitor";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null}
                         persistor={persistor}
                         onBeforeLift={() => console.log('[PersistGate] Before lift')}>
                <PersistenceMonitor/>
                {children}
            </PersistGate>
        </Provider>
    );
}