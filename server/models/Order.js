import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        imageUrl: String,
        unit: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      fullName: String,
      street: String,
      district: String,
      state: String,
      pincode: String,
      phone: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Confirmed',
    },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery (Demo Checkout)',
    },
    notes: String,
    isDemoOrder: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
