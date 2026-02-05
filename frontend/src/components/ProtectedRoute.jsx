import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, me } from '../service/auth.service';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { token } = getAuth();

                if (!token) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                // Verify token with backend
                await me();
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth verification failed:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1E88B5, #0D7EBA)'
            }}>
                <div style={{
                    background: '#ffffff',
                    padding: '40px',
                    borderRadius: '18px',
                    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '18px', color: '#333', fontWeight: 600 }}>
                              Checking authentication ...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
