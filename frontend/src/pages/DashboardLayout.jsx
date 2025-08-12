import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Header } from '../Component/Header';

export const DashboardLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('userData')

        if (!userData) {
            navigate('/');
            return;
        }

        const storedUser = JSON.parse(userData);
        switch (storedUser.role) {
            case 'admin':
                navigate('/dashboard/admin');
                break;
            case 'customer':
                navigate('/dashboard/customer');
                break;
            case 'delivery_partner':
                navigate('/dashboard/delivery-partner');
                break;
            default:
                navigate('/');
        }
    }, []);

    return (
        <>
            <Header />
            <div className="container mt-4">
                <Outlet />
            </div>
        </>
    );
};
