const Product = require('../Models/productSchema');
const Order = require('../Models/orderSchema');
const User = require('../Models/userSchema');

const buyProduct = async (req, res) => {
    try {
        const { customerId, productId, quantity } = req.body;

        // Validate customer
        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        if (customer.role !== 'customer') {
            return res.status(400).json({ message: "Only customers can buy products" });
        }

        // Validate product
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: `Product ${productId} not found` });
        }
        if (quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }
        if (productExists.quantity < quantity) {
            return res.status(400).json({ message: `Not enough stock for ${productExists.product_name}` });
        }

        // Deduct stock
        productExists.quantity -= quantity;
        await productExists.save();

        // Create order
        const newOrder = new Order({
            customer: customerId,
            products: [{
                product: productId,
                product_name: productExists.product_name,
                quantity: 1
            }]
        });

        await newOrder.save();

        // Link order to customer
        customer.orders.push(newOrder._id);
        await customer.save();

        res.status(201).json({
            message: "Order placed successfully with pickedup status",
            order: newOrder
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const addProduct = async (req, res) => {
    try {
        const { product_name, product_desc, amount, quantity, image_path } = req.body;

        if (!product_name || !product_desc || !amount || quantity == null || !image_path) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new Product({
            product_name,
            product_desc,
            amount,
            quantity,
            image_path
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getProduct = async (req, res) => {
    try {
        const allProducts = await Product.find()
        res.status(200).json(allProducts)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to fetch products" })
    }
}

const getSingleProduct = async (req, res) => {
    const { productId } = req.body;
    try {
        const singleProductDetail = await Product.findById(productId);
        if (!singleProductDetail) {
            res.status(404).json({ message: 'product not found ' })
        }
        res.status(200).json(singleProductDetail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch product" });
    }
};


const getOrder = async (req, res) => {
    try {
        const allOrders = await Order.find()
        res.status(200).json(allOrders)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to fetch orders" })
    }
}


const getMyOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Customer ID is required" });
        }

        const orders = await Order.find({ customer: id })
            .populate('products.product', 'product_name')
            .populate('customer', 'name');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this customer" });
        }

        // for (let order of orders) {
        //     for (let product of order.products) {
        //         console.log(product)
        //     }
        // }
        const formattedOrders = orders.map(order => ({
            orderId: order._id,
            products: order.products.map(p => ({
                productId: p.product._id,
                product_name: p.product_name,
                quantity: p.quantity,
                status: p.status
            }))
        }));

        res.status(200).json({ orders: formattedOrders });
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { buyProduct, addProduct, getProduct, getSingleProduct, getOrder, getMyOrder }