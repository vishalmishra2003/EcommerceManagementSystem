import axios from 'axios';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

export const ProductDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { id } = useParams()

    if (!state) {
        return <div className="text-center mt-5">No product data found.</div>;
    }

    const handleBuy = async () => {
        const customerId = JSON.parse(localStorage.getItem('userData')).id
        const productId = id
        const quantity = 1
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/buyProduct`, { customerId, productId, quantity }, { withCredentials: true })
            if (res) {
                toast.success(`Proceeding to buy: ${state.product_name}`);
            }
        } catch (error) {
            toast.error(error)
        }
    };

    return (
        <div className="container mt-4">
            <ToastContainer />
            <h3>{state.product_name}</h3>
            <img
                src={`/assets${state.image_path}`}
                alt={state.product_name}
                className="img-fluid mb-3"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
            <p>{state.product_desc}</p>
            <p><strong>Amount:</strong> ₹{state.amount}</p>
            <button className="btn btn-success" onClick={handleBuy}>Buy Now</button>
            <button className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
};
