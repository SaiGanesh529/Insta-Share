import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddPost from './AddPost';

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddPost, setShowAddPost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    if (!token) {
      navigate("/login");   // 👈 redirect if no token
      return;
    }
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users/my-profile", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
          },
        });
        const data = await res.json();
        setProfile(data.profile);
      } catch (error) {
        console.error("Error fetching my profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePostAdded = () => {
    // Refresh profile data after adding a post
    fetchProfile();
    setShowAddPost(false);
  };

  const handleEditProfile = () => {
    setEditBio(profile.user_bio || '');
    setShowEditProfile(true);
  };

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      if (editBio !== undefined) formData.append('bio', editBio);
      if (profilePic) formData.append('profile_pic', profilePic);

      const res = await fetch('/api/users/my-profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      // Refresh profile data
      await fetchProfile();
      setShowEditProfile(false);
      setProfilePic(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/my-profile", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
        },
      });
      const data = await res.json();
      setProfile(data.profile);
    } catch (error) {
      console.error("Error fetching my profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6">
      {showAddPost ? (
        <AddPost onPostAdded={handlePostAdded} />
      ) : showEditProfile ? (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
          
          <div className="mb-6">
            <label htmlFor="profile-pic" className="block text-gray-700 text-sm font-bold mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={profilePic ? URL.createObjectURL(profilePic) : profile.profile_pic}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />
              <input
                type="file"
                id="profile-pic"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              rows="4"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleUpdateProfile}
              disabled={updating}
              className={`flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ${
                updating ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
            <button
              onClick={() => {
                setShowEditProfile(false);
                setProfilePic(null);
                setEditBio('');
              }}
              className="flex-1 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            // Loader while fetching profile
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : !profile ? (
            // Fallback if profile is missing
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

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setShowAddPost(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      Add New Post
                    </button>
                    <button
                      onClick={handleEditProfile}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
                    >
                      Edit Profile
                    </button>
                  </div>
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
        </>
      )}
    </div>
  );
}

export default MyProfile;
