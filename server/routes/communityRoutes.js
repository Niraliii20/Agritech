import express from 'express';
import { CommunityPost } from '../models/CommunityPost.js';
import { Comment } from '../models/Comment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all community forum posts
// @route   GET /api/community/posts
router.get('/posts', async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = { status: { $ne: 'Archived' } };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await CommunityPost.countDocuments(query);
    const posts = await CommunityPost.find(query)
      .populate('author', 'fullName state district role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: posts.length,
      total,
      posts,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new community post
// @route   POST /api/community/posts
router.post('/posts', protect, async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    const post = await CommunityPost.create({
      author: req.user._id,
      title,
      content,
      category: category || 'General Discussions',
    });

    const populated = await CommunityPost.findById(post._id).populate('author', 'fullName state district role');

    res.status(201).json({
      success: true,
      message: 'Forum topic published successfully',
      post: populated,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single post and its comments
// @route   GET /api/community/posts/:id
router.get('/posts/:id', async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id).populate('author', 'fullName state district role');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Discussion post not found' });
    }

    const comments = await Comment.find({ post: post._id })
      .populate('author', 'fullName state district role')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      post,
      comments,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Toggle upvote / like on post
// @route   POST /api/community/posts/:id/like
router.post('/posts/:id/like', protect, async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const isLiked = post.likes.some(likeId => likeId.toString() === req.user._id.toString());
    if (isLiked) {
      post.likes = post.likes.filter(likeId => likeId.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      liked: !isLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add comment to community post
// @route   POST /api/community/posts/:id/comments
router.post('/posts/:id/comments', protect, async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content,
    });

    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    const populated = await Comment.findById(comment._id).populate('author', 'fullName state district role');

    res.status(201).json({
      success: true,
      message: 'Comment posted',
      comment: populated,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete community post (Author or Admin)
// @route   DELETE /api/community/posts/:id
router.delete('/posts/:id', protect, async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({
      success: true,
      message: 'Discussion topic deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
