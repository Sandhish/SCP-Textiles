import { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth, logout as apiLogout } from '../Services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');

                if (storedUser) {
                    const parsedStoredUser = JSON.parse(storedUser);
                    setUser(parsedStoredUser);

                    try {
                        const { authenticated, user: serverUser } = await checkAuth();

                        if (authenticated) {
                            const isAdmin = parsedStoredUser.isAdmin || false;

                            setUser({
                                ...serverUser,
                                isAdmin: isAdmin
                            });
                        } else {
                            localStorage.removeItem('user');
                            setUser(null);
                        }
                    } catch (err) {
                        console.error('Auth check error:', err);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = (userData) => {
        try {
            const userWithAdminFlag = {
                ...userData,
                isAdmin: userData.isAdmin || false
            };

            localStorage.setItem('user', JSON.stringify(userWithAdminFlag));
            setUser(userWithAdminFlag);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            localStorage.removeItem('user');
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            isAuthenticated: !!user,
            isAdmin: user?.isAdmin || false
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;