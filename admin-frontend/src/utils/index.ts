// utils/index.ts
export function getStorage(key: string): string | null {
    try {
        if (typeof window === 'undefined') return null; // SSR check
        return localStorage.getItem(key);
    } catch (err) {
        console.error('Error reading localStorage key:', key, err);
        return null;
    }
}
