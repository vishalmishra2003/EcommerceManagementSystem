import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const Customers = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userData'))?.token;

                if (!token) {
                    toast.error('Not authorized');
                    return;
                }

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/getAllUser`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );

                // ✅ Filter only customers
                const allUsers = res.data;
                const customerUsers = allUsers.filter(user => user.role === 'customer');
                setCustomers(customerUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Failed to fetch customer details');
            }
        };

        fetchCustomers();
    }, []);

    return (
        <div className="row">
            <div className="col-md-4">
                <ul className="list-group">
                    {customers.map((customer) => (
                        <li
                            key={customer.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => setSelectedCustomer(customer)}
                            style={{ cursor: 'pointer' }}
                        >
                            {customer.username}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-md-8">
                {selectedCustomer && (
                    <div className="card p-3">
                        <h5>Customer Details</h5>
                        <p><strong>Name:</strong> {selectedCustomer.username}</p>
                        <p><strong>Email:</strong> {selectedCustomer.email}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
