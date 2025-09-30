import express from 'express';
import { Story, User } from '../database/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

// Get all stories with user details
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('user_id', 'username')
      .sort({ createdAt: -1 })
      .lean();

    const storiesWithUserDetails = stories.map(story => ({
      user_id: story.user_id._id,
      user_name: story.user_id.username,
      story_url: story.story_url
    }));

    res.json({ users_stories: storiesWithUserDetails });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new story
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file);

    const story = new Story({
      user_id: userId,
      story_url: cloudinaryResult.secure_url
    });

    await story.save();
    res.status(201).json({ message: 'Story created successfully', story });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
