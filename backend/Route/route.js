const express = require('express')
const route = express.Router()
const auth = require('../Middleware/authMiddleware')
const { createUser, loginUser, getSingleUser, getAllUser } = require('../Controller/userController')
const { buyProduct, addProduct, getProduct, getSingleProduct, getOrder, getMyOrder } = require('../Controller/productController')
const { getPendingDeliveries, updateDeliveryStatus, getDelivery } = require('../Controller/partnerController');

// Public routes
route.post('/register', createUser)
route.post('/login', loginUser)

// Protected routes (any logged in user)
route.get('/getAllUser', auth(['admin']), getAllUser)
route.get('/getSingleUser/:id', auth(['admin']), getSingleUser)

// Role-restricted routes
route.post('/buyProduct', auth(['customer']), buyProduct)
route.post('/addProduct', auth(['admin']), addProduct)
route.get('/getAllProduct', auth(['customer']), getProduct)
route.post('/getSingleProduct', auth(['customer', 'delivery_partner']), getSingleProduct)

route.get('/getOrder', auth(['admin', 'delivery_partner']), getOrder)
route.get('/getMyOrder/:id', auth(['customer']), getMyOrder)


// Get pending deliveries (Delivery Partner only)
route.get('/pending', auth(['delivery_partner']), getPendingDeliveries);

// Update delivery status (Delivery Partner only)
route.patch('/update_status', auth(['delivery_partner']), updateDeliveryStatus);

route.post('/getDelivery', auth(['delivery_partner']), getDelivery)

module.exports = route