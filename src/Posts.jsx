import React, { useEffect, useState } from 'react';
import { CiHeart } from "react-icons/ci";
import { BsFillChatFill, BsFillShareFill } from "react-icons/bs";
import { Link } from 'react-router-dom';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [loading, setLoading] = useState(true); // loader state
  const [newComments, setNewComments] = useState({}); // Track new comments being typed
  const [showCommentInput, setShowCommentInput] = useState({}); // Track which posts show comment input

  const fetchPosts = async () => {
    try {
      setLoading(true); // start loader
      const res = await fetch("/api/posts", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      setPosts(data.posts);
    } catch (error) {
      console.log('Error fetching posts:', error);
    } finally {
      setLoading(false); // stop loader
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleLike = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });

      if (res.ok) {
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: !prev[postId]
        }));
        // Refresh posts to get updated like count
        fetchPosts();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentChange = (postId, comment) => {
    setNewComments((prev) => ({
      ...prev,
      [postId]: comment
    }));
  };

  const addComment = async (postId) => {
    const comment = newComments[postId];
    if (!comment || comment.trim() === '') return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ comment: comment.trim() })
      });

      if (res.ok) {
        // Clear the comment input
        setNewComments((prev) => ({
          ...prev,
          [postId]: ''
        }));
        // Refresh posts to show the new comment
        fetchPosts();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleKeyPress = (e, postId) => {
    if (e.key === 'Enter') {
      addComment(postId);
    }
  };

  const toggleCommentInput = (postId) => {
    setShowCommentInput((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div>
      {loading ? (
        // Loader while fetching posts
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.post_id} className="border-2 border-gray-300 p-4 m-4">
            {/* Profile */}
            <div className="flex flex-row mr-2 px-4">
              <img
                className="rounded-full h-12 w-12 object-cover border-2 border-pink-500 p-[2px]"
                src={post.profile_pic}
                alt={post.user_name}
              />
              <Link
                to={`/IndividualProfiles/${post.user_id}`}
                className="text-xs ml-2 mt-1 text-gray-700 w-auto text-center hover:underline"
              >
                {post.user_name}
              </Link>
            </div>

            {/* Post */}
            <div className="flex flex-col my-2">
              <img
                className="w-auto h-auto object-cover"
                src={post.post_details.image_url}
                alt="Post"
              />

              <div className="flex flex-col px-3">
                {/* Actions */}
                <div className="flex items-center space-x-3 mt-2">
                  <CiHeart
                    onClick={() => toggleLike(post.post_id)}
                    className={`cursor-pointer mx-2 ${
                      likedPosts[post.post_id] ? "text-red-500" : "text-gray-600"
                    }`}
                    size={20}
                  />
                  <BsFillChatFill 
                    onClick={() => toggleCommentInput(post.post_id)}
                    className={`cursor-pointer mr-2 ${
                      showCommentInput[post.post_id] ? "text-blue-500" : "text-gray-600"
                    }`}
                    size={20}
                  />
                  <BsFillShareFill />
                </div>

                <div className="px-4 mt-2">
                  {/* Likes */}
                  <p className="text-sm font-semibold text-gray-900">
                    {post.likes_count} likes
                  </p>

                  {/* Caption */}
                  <p className="text-sm text-gray-800 mt-1">
                    <span className="font-semibold">{post.user_name} </span>
                    {post.post_details.caption}
                  </p>

                  {/* Comments */}
                  <div className="mt-2 space-y-1">
                    {post.comments.map((comment, index) => (
                      <p key={index} className="text-sm text-gray-800">
                        <span className="font-semibold">{comment.user_name} </span>
                        {comment.comment}
                      </p>
                    ))}
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500 uppercase mt-2">
                    {post.created_at}
                  </p>

                  {/* Add Comment Section - Only show when comment icon is clicked */}
                  {showCommentInput[post.post_id] && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComments[post.post_id] || ''}
                          onChange={(e) => handleCommentChange(post.post_id, e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, post.post_id)}
                          className="flex-1 text-sm border-none outline-none bg-transparent placeholder-gray-500"
                          autoFocus
                        />
                        <button
                          onClick={() => addComment(post.post_id)}
                          disabled={!newComments[post.post_id] || newComments[post.post_id].trim() === ''}
                          className="text-blue-600 font-semibold text-sm hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Posts;
