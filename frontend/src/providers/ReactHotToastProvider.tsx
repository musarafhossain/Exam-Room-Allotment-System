'use client';
import { Toaster } from "react-hot-toast";

export function ReactHotToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        fontFamily: 'Roboto, Arial, sans-serif',
                    },
                }}
            />
            {children}
        </>
    );
}
