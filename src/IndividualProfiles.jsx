import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function IndividualProfiles() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/insta-share/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
        const data = await res.json();
        setProfile(data.user_details);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6">
      {loading ? (
        // Loader while fetching profile
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : !profile ? (
        // Fallback if no profile found
        <p className="text-center text-gray-500 mt-10">Profile not found.</p>
      ) : (
        <>
          {/* Top section: Profile pic + info */}
          <div className="flex items-center gap-12">
            <img
              src={profile.profile_pic}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-semibold">{profile.user_name}</h2>
              <p className="mt-1 text-gray-600">@{profile.user_id}</p>

              <div className="flex gap-6 mt-3 text-gray-800">
                <span><b>{profile.posts_count}</b> posts</span>
                <span><b>{profile.followers_count}</b> followers</span>
                <span><b>{profile.following_count}</b> following</span>
              </div>

              <p className="mt-3 text-sm text-gray-700 max-w-lg">
                {profile.user_bio || "This user has not set a bio yet."}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex gap-6 mt-8">
            {profile.stories?.map((story) => (
              <div key={story.id} className="flex flex-col items-center">
                <img
                  src={story.image}
                  className="w-20 h-20 rounded-full border p-[2px]"
                  alt={`story-${story.id}`}
                />
              </div>
            ))}
          </div>

          {/* Posts */}
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center space-x-2 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">Posts</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {profile.posts?.map((post) => (
                <div key={post.id}>
                  <img
                    src={post.image}
                    className="w-full h-64 object-cover"
                    alt={`post-${post.id}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
