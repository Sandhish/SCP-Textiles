import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = ({ children }) => {
    return (
        <>
            {children}
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                    },
                    success: {
                        style: {
                            background: '#10B981',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444',
                        },
                    },
                }}
            />
        </>
    );
};

export default ToastProvider;
