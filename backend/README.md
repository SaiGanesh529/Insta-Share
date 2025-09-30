# Insta Share Backend

A Node.js/Express backend API for the Instagram-like social media application with MongoDB and Cloudinary integration.

## Features

- User authentication with JWT
- MongoDB database integration
- Cloudinary image upload
- Posts with images and captions
- Stories (24-hour expiring content)
- Comments system
- Like/unlike functionality
- User profiles

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- npm or yarn

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory:
   ```
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://saiganeshreddydabbula169_db_user:Saiganesh@cluster0.ie6midr.mongodb.net/insta_share
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Posts
- `GET /api/posts` - Get all posts (public)
- `POST /api/posts` - Create a new post (authenticated)
- `POST /api/posts/:postId/like` - Like/unlike a post (authenticated)
- `POST /api/posts/:postId/comments` - Add a comment (authenticated)

### Stories
- `GET /api/stories` - Get all stories (public)
- `POST /api/stories` - Create a new story (authenticated)

### Users
- `GET /api/users/:userId` - Get user profile (authenticated)
- `GET /api/users/my-profile` - Get current user profile (authenticated)

### Health Check
- `GET /api/health` - Server health check

## Database Schema

### Users
- username (unique)
- password (hashed)
- email
- profile_pic
- bio
- timestamps

### Posts
- user_id (reference to User)
- image_url (Cloudinary URL)
- caption
- likes_count
- timestamps

### Stories
- user_id (reference to User)
- story_url (Cloudinary URL)
- expires_at (auto-expires after 24 hours)
- timestamps

### Comments
- post_id (reference to Post)
- user_id (reference to User)
- comment
- timestamps

### Likes
- post_id (reference to Post)
- user_id (reference to User)
- timestamps

## Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add them to your `.env` file

## CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` (Vite default port). Update the CORS configuration in `server.js` if your frontend runs on a different port.

## Production Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Use a strong, unique JWT_SECRET
3. Use a production MongoDB instance (MongoDB Atlas recommended)
4. Set up proper error logging and monitoring
5. Configure Cloudinary for production use
