import express from 'express';
import { User, Post, Story } from '../database/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

// Get user profile
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's posts
    const posts = await Post.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Get user's stories
    const stories = await Story.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      profile: {
        id: user._id,
        user_id: user.username,
        user_name: user.username.charAt(0).toUpperCase() + user.username.slice(1),
        profile_pic: user.profile_pic,
        followers_count: 2900, // Default value as specified
        following_count: 24,   // Default value as specified
        user_bio: user.bio,
        posts: posts.map(post => ({
          id: post._id,
          image: post.image_url
        })),
        posts_count: posts.length,
        stories: stories.map(story => ({
          id: story._id,
          image: story.story_url
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user's profile
router.get('/my-profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's posts
    const posts = await Post.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Get user's stories
    const stories = await Story.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      profile: {
        id: user._id,
        user_id: user.username,
        user_name: user.username.charAt(0).toUpperCase() + user.username.slice(1),
        profile_pic: user.profile_pic,
        followers_count: 2900, // Default value as specified
        following_count: 24,   // Default value as specified
        user_bio: user.bio,
        posts: posts.map(post => ({
          id: post._id,
          image: post.image_url
        })),
        posts_count: posts.length,
        stories: stories.map(story => ({
          id: story._id,
          image: story.story_url
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update current user's profile (profile picture and bio)
router.put('/my-profile', authenticateToken, upload.single('profile_pic'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bio } = req.body;
    
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    
    // Handle profile picture upload
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file);
        updateData.profile_pic = result.secure_url;
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return res.status(500).json({ error: 'Failed to upload profile picture' });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile_pic: user.profile_pic,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
