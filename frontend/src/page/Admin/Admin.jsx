import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/auth.service';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        authService.me()
            .then((u) => {
                if (!mounted) return;
                // server returns user object
                const returnedUser = u;
                if (!returnedUser || returnedUser.role !== 'admin') {
                    // not authorized
                    navigate('/login');
                    return;
                }
                setUser(returnedUser);
            })
            .catch(() => {
                navigate('/login');
            })
            .finally(() => mounted && setLoading(false));

        return () => { mounted = false };
    }, [navigate]);

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1>Admin panel</h1>
            <p>Welcome, {user?.name}</p>
            {/* Future: admin controls, view suggestions, export data, etc. */}
        </div>
    );
};

export default Admin;