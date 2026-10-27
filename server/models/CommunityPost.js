import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      enum: [
        'Crop Management',
        'Soil Health',
        'Irrigation',
        'Pest Control',
        'Organic Farming',
        'Government Schemes',
        'General Discussions',
      ],
      default: 'General Discussions',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Published', 'Flagged', 'Archived'],
      default: 'Published',
    },
  },
  { timestamps: true }
);

export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
