import React, { useState } from 'react';
import { Tabs } from '../Component/Admin/Tabs';
import { DeliveryPartners } from '../Component/Admin/DeliveryPartners';
import { Customers } from '../Component/Admin/Customers';
import { DeliveryStatus } from '../Component/Admin/DeliveryStatus';

export const Admin = () => {
    const [activeTab, setActiveTab] = useState('deliveryPartners');

    return (
        <div className="container mt-4">
            <h3>Admin Dashboard</h3>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="mt-3">
                {activeTab === 'deliveryPartners' && <DeliveryPartners />}
                {activeTab === 'customers' && <Customers />}
                {activeTab === 'status' && <DeliveryStatus />}
            </div>
        </div>
    );
};