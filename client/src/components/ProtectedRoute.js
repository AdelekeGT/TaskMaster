// import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated.isLoggedIn ? children : <Navigate to='/' />;
};

export default ProtectedRoute;
