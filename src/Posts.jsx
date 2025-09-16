import React, { useEffect, useState } from 'react';
import { CiHeart } from "react-icons/ci";
import { BsFillChatFill, BsFillShareFill } from "react-icons/bs";
import { Link } from 'react-router-dom';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [loading, setLoading] = useState(true); // loader state

  const fetchPosts = async () => {
    try {
      setLoading(true); // start loader
      const res = await fetch("/api/insta-share/posts", {
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
                  <BsFillChatFill className="mr-2" />
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
