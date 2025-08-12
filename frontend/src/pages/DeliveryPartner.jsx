import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../Component/ConfirmationModal';
import { SocketContext } from '../Context/SocketContext';

export const DeliveryPartner = () => {
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null); // { orderId, productId }
    const [showModal, setShowModal] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState(null);

    const { socket } = useContext(SocketContext); // <-- only addition: socket from context

    const statusOptions = ['on_the_way', 'delivered', 'picked_up'];
    const deliveryId = JSON.parse(localStorage.getItem('userData')).id;

    // default-safe formatter (prevents undefined / toUpperCase errors)
    const formatStatus = (status) =>
        (status || 'pending').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/getDelivery`,
                    { deliveryId },
                    { withCredentials: true }
                );

                // console.log("Response : ", res.data)
                if (res?.data?.products) {
                    const productList = res.data.products.map((item) => ({
                        orderId: item.order,
                        productId: item.product?._id || item.product,
                        productName:
                            item.product?.product_name || item.product_name || 'Unnamed Product',
                        quantity: item.quantity || 1,
                        status: item.status
                    }));
                    setData(productList);
                }
            } catch (error) {
                console.error('Error fetching delivery data:', error);
            }
        };
        fetchData();
    }, [deliveryId]);
    useEffect(() => {
        if (!socket) return;

        const handler = (payload) => {
            try {
                const orderId =
                    payload?.orderId ||
                    payload?.order ||
                    (payload?.order?._id && String(payload.order._id));

                let productId =
                    payload?.productId ||
                    payload?.product?.id ||
                    payload?.product?._id ||
                    payload?.product?.product ||
                    payload?.product;

                const status =
                    payload?.status ||
                    payload?.product?.status ||
                    (payload?.product && payload.product?.status);

                if (!orderId || !productId) {
                    return;
                }

                const orderIdStr = String(orderId);
                const productIdStr = String(productId);

                setData((prev) =>
                    prev.map((item) => {
                        if (String(item.orderId) === orderIdStr && String(item.productId) === productIdStr) {
                            return { ...item, status };
                        }
                        return item;
                    })
                );
            } catch (err) {
                console.error('Error handling socket payload:', err);
            }
        };

        socket.on('deliveryStatusUpdated', handler);

        return () => {
            socket.off('deliveryStatusUpdated', handler);
        };
    }, [socket]);

    const handleStatusClick = (orderId, productId) => {
        setEditingKey({ orderId, productId });
    };

    const handleStatusSelect = (orderId, productId, newStatus) => {
        setPendingUpdate({ orderId, productId, newStatus });
        setShowModal(true);
    };

    const confirmUpdate = async () => {
        if (!pendingUpdate) return;

        // console.log("Pending Update : ", pendingUpdate)
        const { orderId, productId, newStatus } = pendingUpdate;

        try {
            // Update local UI immediately (optimistic)
            setData((prev) =>
                prev.map((item) =>
                    String(item.productId) === String(productId) && String(item.orderId) === String(orderId)
                        ? { ...item, status: newStatus }
                        : item
                )
            );
            setEditingKey(null);

            // <-- KEEP YOUR ORIGINAL API CALL (unchanged)
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/update_status`,
                {
                    deliveryId,
                    orderId,
                    productId,
                    status: newStatus
                },
                { withCredentials: true }
            );

            // DO NOT emit from frontend here — your backend already emits the
            // socket update after database update. We rely on that.
        } catch (error) {
            console.error('Error updating status:', error);
            // optionally revert optimistic update or refetch if needed
        } finally {
            setShowModal(false);
            setPendingUpdate(null);
        }
    };

    const cancelUpdate = () => {
        setShowModal(false);
        setPendingUpdate(null);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between">
                <h3 className="mb-3">Product Delivery Status</h3>
                <Link to="/dashboard/order" className="btn btn-success mb-3">
                    Orders
                </Link>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Delivery Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        const isEditing =
                            editingKey?.productId === item.productId &&
                            editingKey?.orderId === item.orderId;
                        return (
                            <tr key={`${item.orderId}-${item.productId}`}>
                                <td>{item.productName}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    {isEditing ? (
                                        <select
                                            className="form-select"
                                            value={item.status || statusOptions[0]}
                                            onChange={(e) =>
                                                handleStatusSelect(
                                                    item.orderId,
                                                    item.productId,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {statusOptions.map((status, idx) => (
                                                <option key={idx} value={status}>
                                                    {formatStatus(status)}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span
                                            style={{ cursor: 'pointer', color: 'blue' }}
                                            onClick={() =>
                                                handleStatusClick(item.orderId, item.productId)
                                            }
                                        >
                                            {formatStatus(item.status)}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Confirmation Modal */}
            <ConfirmationModal
                show={showModal}
                onHide={cancelUpdate}
                onConfirm={confirmUpdate}
                title="Confirm Status Update"
                body={
                    <>
                        Are you sure you want to change the delivery status to{' '}
                        <strong>{pendingUpdate && formatStatus(pendingUpdate.newStatus)}</strong>?
                    </>
                }
            />
        </div>
    );
};
