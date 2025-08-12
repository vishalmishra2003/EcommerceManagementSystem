import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SocketContext } from '../../Context/SocketContext';

export const DeliveryStatus = () => {
    const [orders, setOrders] = useState([]);
    const { socket } = useContext(SocketContext);

    const getStatusClass = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-success';
            case 'pending':
                return 'bg-primary';
            case 'picked_up':
                return 'bg-warning';
            case 'on_the_way':
                return 'bg-info';
            default:
                return 'bg-secondary';
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userData'))?.token;

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/getOrder`, { withCredentials: true });
                const ordersData = res.data;

                setOrders(ordersData);
            } catch (error) {
                toast.error('Failed to fetch delivery status');
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("deliveryStatusUpdated", ({ orderId, productId, status }) => {
            setOrders((prevOrders) => {
                return prevOrders.map(order => {
                    if (order._id !== orderId) return order;

                    const updatedProducts = order.products.map(product => {
                        if (product.product === productId) {
                            return { ...product, status };
                        }
                        return product;
                    });

                    return { ...order, products: updatedProducts };
                });
            });
        });

        return () => {
            socket.off("deliveryStatusUpdated");
        };
    }, [socket]);

    // Flatten all products for rendering (optional)
    const allProducts = orders.flatMap(order =>
        order.products.map(product => ({
            orderId: order._id,
            productId: product.product,
            name: product.product_name || product.product,
            status: product.status
        }))
    );

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
                {allProducts.map((item, index) => (
                    <tr key={`${item.orderId}-${item.productId}`}>
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
