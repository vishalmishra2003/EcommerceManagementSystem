import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const DeliveryPartners = () => {
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userData'))?.token;

                if (!token) {
                    toast.error('Not authorized');
                    return;
                }

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/getAllUser`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );

                const allUsers = res.data;
                const deliveryPartner = allUsers.filter(user => user.role === 'delivery_partner');
                setPartners(deliveryPartner);
            } catch (error) {
                toast.error('Failed to fetch customer details');
            }
        };

        fetchPartners();
    }, []);

    return (
        <div className="row">
            <div className="col-md-4">
                <ul className="list-group">
                    {partners.map((partner) => (
                        <li
                            key={partner.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => setSelectedPartner(partner)}
                            style={{ cursor: 'pointer' }}
                        >
                            {partner.username}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-md-8">
                {selectedPartner && (
                    <div className="card p-3">
                        <h5>Delivery Partner Details</h5>
                        <p><strong>Name:</strong> {selectedPartner.username}</p>
                        <p><strong>Email:</strong> {selectedPartner.email}</p>
                    </div>
                )}
            </div>
        </div>
    );
    // return (
    //     <div className="row">
    //         <div className="col-md-4">
    //             <ul className="list-group">
    //                 {data.deliveryPartners.map((partner) => (
    //                     <li
    //                         key={partner.id}
    //                         className="list-group-item list-group-item-action"
    //                         onClick={() => setSelectedPartner(partner)}
    //                         style={{ cursor: 'pointer' }}
    //                     >
    //                         {partner.name}
    //                     </li>
    //                 ))}
    //             </ul>
    //         </div>
    //         <div className="col-md-8">
    //             {selectedPartner && (
    //                 <div className="card p-3">
    //                     <h5>Delivery Partner Details</h5>
    //                     <p><strong>Name:</strong> {selectedPartner.name}</p>
    //                     <p><strong>Phone:</strong> {selectedPartner.phone}</p>
    //                     <p><strong>Area:</strong> {selectedPartner.area}</p>
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // );
};
