const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            product_name: {
                type: String,
                required: true,
                trim: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            status: {
                type: String,
                enum: ['pending', 'on_the_way', 'delivered', 'picked_up'],
                default: 'pending'
            }
        }
    ],
    // order_status: {
    //     type: String,
    //     enum: ['pending', 'on_the_way', 'delivered', 'picked_up'],
    //     default: 'pending'
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
