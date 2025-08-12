import React from 'react';

export const ProductCard = ({ product, onClick }) => {
    const shortDesc = product.product_desc.length > 50
        ? product.product_desc.slice(0, 50) + '...'
        : product.product_desc;

    return (
        <div className="card mb-3" style={{ cursor: 'pointer' }} onClick={onClick}>
            <img
                src={`/assets${product.image_path}`}
                className="card-img-top"
                alt={product.product_name}
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
            />
            <div className="card-body">
                <h5 className="card-title">{product.product_name}</h5>
                <p className="card-text">{shortDesc}</p>
                <p><strong>Amount:</strong> ₹{product.amount}</p>
            </div>
        </div>
    );
};
