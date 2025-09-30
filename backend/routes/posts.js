import express from 'express';
import { Post, Comment, User, Like } from '../database/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

// Get all posts with user details and comments
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user_id', 'username profile_pic')
      .sort({ createdAt: -1 })
      .lean();

    // Get comments for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ post_id: post._id })
          .populate('user_id', 'username')
          .sort({ createdAt: -1 })
          .lean();

        return {
          post_id: post._id,
          user_id: post.user_id._id,
          user_name: post.user_id.username,
          profile_pic: post.user_id.profile_pic,
          post_details: {
            image_url: post.image_url,
            caption: post.caption
          },
          likes_count: post.likes_count,
          comments: comments.map(comment => ({
            user_name: comment.user_id.username,
            comment: comment.comment
          })),
          created_at: post.createdAt.toLocaleDateString()
        };
      })
    );

    res.json({ posts: postsWithComments });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new post
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file);
    
    const post = new Post({
      user_id: userId,
      image_url: cloudinaryResult.secure_url,
      caption: caption || ''
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a comment to a post
router.post('/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user.userId;

    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const newComment = new Comment({
      post_id: postId,
      user_id: userId,
      comment
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Like/unlike a post
router.post('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    // Check if user already liked the post
    const existingLike = await Like.findOne({ post_id: postId, user_id: userId });

    if (existingLike) {
      // Unlike the post
      await Like.findByIdAndDelete(existingLike._id);
      await Post.findByIdAndUpdate(postId, { $inc: { likes_count: -1 } });
      res.json({ message: 'Post unliked', liked: false });
    } else {
      // Like the post
      const like = new Like({
        post_id: postId,
        user_id: userId
      });

      await like.save();
      await Post.findByIdAndUpdate(postId, { $inc: { likes_count: 1 } });
      res.json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
