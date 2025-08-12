import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const DeliveryStatus = () => {
    const [products, setProducts] = useState([]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-success'; // Green
            case 'pending':
                return 'bg-primary'; // Blue
            case 'picked_up':
                return 'bg-warning'; // Yellow
            case 'on_the_way':
                return 'bg-info'; // Light blue (or pick another)
            default:
                return 'bg-secondary'; // Gray fallback
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userData'))?.token;

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/getOrder`, { withCredentials: true });

                const orders = res.data;
                console.log(orders)

                const allProducts = orders.flatMap(order =>
                    order.products.map(p => ({
                        name: p.product_name || p.product,
                        status: p.status
                    }))
                );

                setProducts(allProducts);
            } catch (error) {
                toast.error('Failed to fetch delivery status');
            }
        };

        fetchProduct();
    }, []);

    return (
        <table className="table table-bordered">
            <thead className="table-dark">
                <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {products.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td className={`text-white text-center ${getStatusClass(item.status)}`}>
                            {item.status.toUpperCase()}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
