import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../ConfirmationModal';

export const Order = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState(null);
    const navigate = useNavigate();

    const formatStatus = (status) =>
        status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    const deliveryId = JSON.parse(localStorage.getItem('userData'))?.id;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/getOrder`,
                    { withCredentials: true }
                );
                const orders = res.data;
                console.log(orders)
                const pendingProducts = orders.flatMap(order =>
                    order.products
                        .filter(p => p.status === "pending")
                        .map(p => ({
                            productId: p.product, // it's an ID string
                            orderId: order._id,
                            name: p.product_name || 'Unnamed Product',
                            status: p.status
                        }))
                );

                setProducts(pendingProducts);
            } catch (error) {
                toast.error('Failed to fetch delivery status');
            }
        };
        fetchProduct();
    }, []);

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'on_the_way', label: 'On the Way' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'picked_up', label: 'Picked Up' }
    ];

    const handleStatusChange = (index, newStatus) => {
        const product = products[index];
        setPendingUpdate({
            productId: product.productId,
            orderId: product.orderId,
            name: product.name,
            newStatus
        });
        setShowModal(true);
    };

    const confirmUpdate = async () => {
        if (!pendingUpdate) return;

        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/update_status`,
                {
                    deliveryId,
                    orderId: pendingUpdate.orderId,
                    productId: pendingUpdate.productId,
                    status: pendingUpdate.newStatus
                },
                { withCredentials: true }
            );

            setProducts(prevProducts =>
                prevProducts
                    .map(p =>
                        p.productId === pendingUpdate.productId &&
                            p.orderId === pendingUpdate.orderId
                            ? { ...p, status: pendingUpdate.newStatus }
                            : p
                    )
                    .filter(p => p.status === 'pending') // remove non-pending ones
            );

            toast.success('Status updated successfully');
        } catch (error) {
            toast.error('Failed to update status');
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
        <div className='container mt-4'>
            <div className="d-flex m-1 justify-content-between">
                <h3>Orders</h3>
                <button
                    className="btn btn-secondary p-1 m-0 fs-6"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>

            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Product</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index) => (
                        <tr key={`${item.orderId}-${item.productId}`}>
                            <td>{item.name}</td>
                            <td>
                                <select
                                    className="form-select"
                                    value={item.status}
                                    onChange={(e) =>
                                        handleStatusChange(index, e.target.value)
                                    }
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
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
