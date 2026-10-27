import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// @desc    Create new order (Demonstration checkout)
// @route   POST /api/orders
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }

      const itemTotal = product.price * (item.quantity || 1);
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity || 1,
        imageUrl: product.imageUrl,
        unit: product.unit,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        fullName: shippingAddress?.fullName || req.user.fullName,
        street: shippingAddress?.street || 'Farm Village Plot 12',
        district: shippingAddress?.district || req.user.district,
        state: shippingAddress?.state || req.user.state,
        pincode: shippingAddress?.pincode || '141001',
        phone: shippingAddress?.phone || req.user.mobileNumber,
      },
      status: 'Confirmed',
      paymentMethod: paymentMethod || 'Cash on Delivery (Demo Mode)',
      notes,
      isDemoOrder: true,
    });

    // Create confirmation notification
    await Notification.create({
      user: req.user._id,
      title: 'Order Confirmed',
      message: `Your AgriTech marketplace order #${order._id.toString().slice(-6).toUpperCase()} of Rs. ${totalAmount.toLocaleString('en-IN')} has been placed. (Demonstration Flow)`,
      type: 'market',
      severity: 'info',
      link: '/orders',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully (Demonstration Mode)',
      order,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current user's orders
// @route   GET /api/orders/my
router.get('/my', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single order details
// @route   GET /api/orders/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'fullName email mobileNumber');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Admin: Get all orders
// @route   GET /api/orders
router.get('/', protect, requireAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'fullName email mobileNumber district state').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Admin: Update order status
// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // Notify user
    await Notification.create({
      user: order.user,
      title: `Order Status Updated: ${status}`,
      message: `Your AgriTech order #${order._id.toString().slice(-6).toUpperCase()} status has been updated to "${status}".`,
      type: 'market',
      severity: 'info',
      link: '/orders',
    });

    res.json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
