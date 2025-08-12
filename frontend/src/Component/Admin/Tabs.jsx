import React from 'react';

export const Tabs = ({ activeTab, setActiveTab }) => (
    <ul className="nav nav-tabs mt-3">
        <li className="nav-item">
            <button
                className={`nav-link ${activeTab === 'deliveryPartners' ? 'active' : ''}`}
                onClick={() => setActiveTab('deliveryPartners')}
            >
                Delivery Partners
            </button>
        </li>
        <li className="nav-item">
            <button
                className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`}
                onClick={() => setActiveTab('customers')}
            >
                Customers
            </button>
        </li>
        <li className="nav-item">
            <button
                className={`nav-link ${activeTab === 'status' ? 'active' : ''}`}
                onClick={() => setActiveTab('status')}
            >
                Delivery Status
            </button>
        </li>
    </ul>
);