const express = require('express')
const route = express.Router()
const auth = require('../Middleware/authMiddleware')
const { createUser, loginUser, getSingleUser, getAllUser } = require('../Controller/userController')
const { buyProduct, addProduct, getProduct, getSingleProduct, getOrder, getMyOrder } = require('../Controller/productController')
const { getPendingDeliveries, updateDeliveryStatus, getDelivery } = require('../Controller/partnerController');

// Public routes
route.post('/api/register', createUser)
route.post('/api/login', loginUser)

// Protected routes (any logged in user)
route.get('/api/getAllUser', auth(['admin']), getAllUser)
route.get('/api/getSingleUser/:id', auth(['admin']), getSingleUser)

// Role-restricted routes
route.post('/api/buyProduct', auth(['customer']), buyProduct)
route.post('/api/addProduct', auth(['admin']), addProduct)
route.get('/api/getAllProduct', auth(['customer']), getProduct)
route.post('/api/getSingleProduct', auth(['customer', 'delivery_partner']), getSingleProduct)

route.get('/api/getOrder', auth(['admin', 'delivery_partner']), getOrder)
route.get('/api/getMyOrder/:id', auth(['customer']), getMyOrder)


// Get pending deliveries (Delivery Partner only)
route.get('/api/pending', auth(['delivery_partner']), getPendingDeliveries);

// Update delivery status (Delivery Partner only)
route.patch('/api/update_status', auth(['delivery_partner']), updateDeliveryStatus);

route.post('/api/getDelivery', auth(['delivery_partner']), getDelivery)

module.exports = route