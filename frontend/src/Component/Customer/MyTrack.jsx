import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../Context/SocketContext";

export const MyTrack = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);

    const customerId = JSON.parse(localStorage.getItem('userData')).id;

    // Fetch orders initially
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/getMyOrder/${customerId}`,
                    { withCredentials: true }
                );
                setOrders(res.data.orders || []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load orders");
            }
        };
        fetchOrders();
    }, [customerId]);

    useEffect(() => {
        if (!socket) return;

        socket.on("deliveryStatusUpdated", ({ orderId, productId, status }) => {

            setOrders((prevOrders) => {
                const updatedOrders = prevOrders.map((order) => {

                    if (order.orderId === orderId) {
                        const updatedProducts = order.products.map((product) => {
                            if (product.productId === productId) {
                                return { ...product, status };
                            }
                            return product;
                        });

                        const updatedOrder = { ...order, products: updatedProducts };
                        return updatedOrder;
                    }

                    return order;
                });
                return updatedOrders;
            });
        });

        return () => {
            socket.off("deliveryStatusUpdated");
        };
    }, [socket]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between">
                <h3>My Orders</h3>
                <button
                    className="btn btn-secondary p-1 m-0 fs-6"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>
            {orders.length > 0 ? (
                <table className="table table-bordered mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, orderIndex) =>
                            order.products.map((p, productIndex) => (
                                <tr key={`${order._id}-${productIndex}`}>
                                    <td>{orderIndex + 1}</td>
                                    <td>{p.product_name || p.product?.product_name}</td>
                                    <td>{p.quantity}</td>
                                    <td>
                                        <span
                                            className={`badge ${(p.status || p.product?.status) === "delivered"
                                                ? "bg-success"
                                                : (p.status || p.product?.status) === "pending"
                                                    ? "bg-info"
                                                    : "bg-warning"
                                                }`}
                                        >
                                            {(p.status || p.product?.status || "N/A").toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            ) : (
                <p className="mt-3">You have no orders yet.</p>
            )}
        </div>
    );
};
