import { type WebStorage } from "redux-persist/es/types";

const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        return '/api/servers';
    }
    return process.env.NODE_ENV === 'production'
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/servers`
        : `http://localhost:${process.env.PORT || 3000}/api/servers`;
};

export const storage: WebStorage = {
    // storage.ts
    async getItem(key: string): Promise<string | null> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000);

            const response = await fetch(getApiUrl(), {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) return null;
            const text = await response.text();
            console.log("Storage get:", text);

            // Validate JSON integrity
            JSON.parse(text); // Throws if invalid
            return text;
        } catch (error) {
            console.error('GET error:', error);
            return null; // Trigger migration by returning null
        }
    },

    async setItem(key: string, value: string): Promise<void> {
        try {
            // Validate before sending
            const state = JSON.parse(value);
            if (!state.servers || !state._persist) {
                throw new Error('Invalid state format');
            }

            await fetch(getApiUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: value,
            });
        } catch (error) {
            console.error('POST error:', error);
            throw error;
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            await fetch(getApiUrl(), { method: 'DELETE' });
        } catch (error) {
            console.error('DELETE error:', error);
            throw error;
        }
    }
};