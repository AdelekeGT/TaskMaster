import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    // Load token from localStorge on app initialization
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setIsAuthenticated({ isLoggedIn: true });
        } else {
            setIsAuthenticated({ isLoggedIn: false });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated({ isLoggedIn: true });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated({ isLoggedIn: false });
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {isAuthenticated === null ? <div>Loading...</div> : children};
        </AuthContext.Provider>
    );
};

export default AuthProvider;
