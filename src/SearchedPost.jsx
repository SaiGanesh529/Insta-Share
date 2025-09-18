import React, { useEffect, useState } from 'react';
import { CiHeart } from "react-icons/ci";
import { BsFillChatFill, BsFillShareFill } from "react-icons/bs";
import { useLocation } from "react-router-dom";

function SearchedPost() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [loading, setLoading] = useState(true); // loader state

  const searchInput = new URLSearchParams(location?.search).get('search');

  const fetchPosts = async () => {
    try {
      setLoading(true); // start loader
      const res = await fetch(`https://apis.ccbp.in/insta-share/posts?search=${searchInput}`, {
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

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-xl font-bold text-gray-800 mb-6 px-4">🔍 Search Results</h1>

      {loading ? (
        // Loader Section
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : posts?.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No results found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.post_id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6 overflow-hidden"
          >
            {/* Top: Profile */}
            <div className="flex items-center px-4 py-3">
              <img
                className="rounded-full h-12 w-12 object-cover border-2 border-pink-500 p-[2px]"
                src={post.profile_pic}
                alt={post.user_name}
              />
              <p className="ml-3 text-sm font-semibold text-gray-700 hover:underline cursor-pointer">
                {post.user_name}
              </p>
            </div>

            {/* Post Image */}
            <div className="w-full">
              <img
                className="w-full h-auto object-cover"
                src={post.post_details.image_url}
                alt="Post"
              />
            </div>

            {/* Actions + Info */}
            <div className="px-4 py-3">
              {/* Actions */}
              <div className="flex items-center space-x-4 text-gray-600">
                <CiHeart
                  className={`cursor-pointer ${likedPosts[post.post_id] ? "text-red-500" : "hover:text-gray-800"}`}
                  size={24}
                  onClick={() => toggleLike(post.post_id)}
                />
                <BsFillChatFill size={20} className="cursor-pointer hover:text-gray-800" />
                <BsFillShareFill size={20} className="cursor-pointer hover:text-gray-800" />
              </div>

              {/* Likes */}
              <p className="text-sm font-semibold text-gray-900 mt-2">
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
              <p className="text-xs text-gray-500 uppercase mt-3">
                {post.created_at}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SearchedPost;
