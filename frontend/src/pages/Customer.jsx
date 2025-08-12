import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '../Component/Customer/ProductCard';
import { toast } from 'react-toastify';
import axios from 'axios';

export const Customer = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const userInfo = JSON.parse(localStorage.getItem('userData'))
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = userInfo?.token;

                if (!token) {
                    toast.error('Not authorized');
                    return;
                }

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/getAllProduct`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );

                setProducts(res.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch products');
            }
        };

        fetchProduct();
    }, []);

    const handleClick = (product) => {
        navigate(`/product/${product._id}`, { state: product });
    };

    const handleTrackOrder = () => {
        navigate(`/dashboard/track-order/${userInfo.id}`);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between">
                <h3>Available Products</h3>
                <Link to={`/dashboard/track-order/${userInfo.id}`} className="btn btn-success mb-3">
                    Track My Order
                </Link>
            </div>

            <div className="row">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div className="col-md-4" key={product._id}>
                            <ProductCard product={product} onClick={() => handleClick(product)} />
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
        </div>
    );
};
