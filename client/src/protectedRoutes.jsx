// ProtectedRoutes.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Home from './Home';
// import Login from './Login';

const ProtectedRoutes = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const handleProtection = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/user/getUser', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (res.data.success) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (e) {
            console.log(e);
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        handleProtection();
    }, []);

    if (isLoggedIn === null) {
        // Loading state or you can show a loading spinner
        return null;
    }

    return isLoggedIn ? <Home /> : <Navigate to={'/login'} />;
};

export default ProtectedRoutes;
