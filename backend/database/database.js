import mongoose from 'mongoose';
import { config } from '../config.js';

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  profile_pic: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  bio: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Post Schema
const postSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  likes_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Story Schema
const storySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  story_url: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  }
}, {
  timestamps: true
});

// Like Schema
const likeSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better performance
likeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });
storySchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

// Create models
export const User = mongoose.model('User', userSchema);
export const Post = mongoose.model('Post', postSchema);
export const Comment = mongoose.model('Comment', commentSchema);
export const Story = mongoose.model('Story', storySchema);
export const Like = mongoose.model('Like', likeSchema);
