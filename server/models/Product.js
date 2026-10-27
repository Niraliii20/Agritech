import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Seeds',
        'Fertilizers',
        'Farming Tools',
        'Irrigation Equipment',
        'Organic Farming Products',
        'Crop Protection Products',
      ],
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    unit: {
      type: String,
      default: 'Unit',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 50,
    },
    rating: {
      type: Number,
      default: 4.7,
    },
    reviewsCount: {
      type: Number,
      default: 18,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    features: [
      {
        type: String,
      },
    ],
    brand: {
      type: String,
      default: 'AgriTech Select',
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
