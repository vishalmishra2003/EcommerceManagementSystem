const DeliveryPartner = require('../Models/partnerSchema');
const Order = require('../Models/orderSchema');
const User = require('../Models/userSchema')

// Get All Pending Deliveries (for Delivery Partner)
const getPendingDeliveries = async (req, res) => {
    try {
        const deliveries = await DeliveryPartner.find({
            'products.deliveryStatus': 'pending'
        }).populate('delivery_agent', 'username email')
            .populate('products.product', 'name')
            .populate('products.order', 'customer');

        res.json(deliveries);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching deliveries', error: err.message });
    }
};

// Update Delivery Status
const updateDeliveryStatus = async (req, res) => {
    try {
        const { deliveryId, orderId, productId, status } = req.body;

        const delivery = await DeliveryPartner.findOne({ delivery_agent: deliveryId });

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, "products.product": productId },
            { $set: { "products.$.status": status } },
            { new: true }
        ).populate('products.product', 'product_name');

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found for given orderId/productId' });
        }

        const updatedProductInfo = updatedOrder.products.find(
            p => p.product._id.toString() === productId
        );

        if (!updatedProductInfo) {
            return res.status(404).json({ message: 'Product not found in the order' });
        }

        const productIndex = delivery.products.findIndex(
            p =>
                (p.product?._id?.toString() || p.product?.toString()) === productId &&
                (p.order?._id?.toString() || p.order?.toString()) === orderId
        );

        if (productIndex > -1) {
            delivery.products[productIndex].status = status;
            delivery.products[productIndex].quantity = updatedProductInfo.quantity;
        } else {
            delivery.products.push({
                product: updatedProductInfo.product._id,
                order: updatedOrder._id,
                status,
                quantity: updatedProductInfo.quantity
            });
        }

        await delivery.save();
        await delivery.populate('delivery_agent', 'username _id email');
        await delivery.populate('products.product', 'product_name _id');

        // 🔹 Emit socket event here
        const io = req.app.get('io');
        io.emit('deliveryStatusUpdated', {
            orderId,
            productId: productId,
            status: status
        });

        res.json({
            message: 'Delivery status updated successfully',
            delivery_agent: {
                id: delivery.delivery_agent._id,
                name: delivery.delivery_agent.username
            },
            product: {
                id: updatedProductInfo.product._id,
                name: updatedProductInfo.product.product_name,
                status: updatedProductInfo.status,
                quantity: updatedProductInfo.quantity
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDelivery = async (req, res) => {
    const { deliveryId } = req.body
    try {
        const agentInfo = await DeliveryPartner.findOne({ delivery_agent: deliveryId })
            // const delivery = await DeliveryPartner.findOne({ delivery_agent: deliveryId })
            // .populate('delivery_agent', 'username _id email') // populate agent details
            .populate('products.product', 'product_name _id') // populate product details
        // .populate('products.order'); // populate order if needed
        res.status(200).json(agentInfo)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { getPendingDeliveries, updateDeliveryStatus, getDelivery }