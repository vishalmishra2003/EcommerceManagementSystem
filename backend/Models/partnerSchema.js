const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
    delivery_agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            order: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            },
            status: {
                type: String,
                enum: ['pending', 'on_the_way', 'delivered', 'picked_up'],
                default: 'pending'
            },
            quantity: {
                type: Number
            }
        }
    ],
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    assignedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
