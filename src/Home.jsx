import React, { useEffect, useState } from 'react';


import Posts from './Posts';


function Home() {

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/stories", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}` // Use the token from localStorage
        }
      })

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      console.log('Fetched stories:', data);
      setStories(data.users_stories);

    } catch (error) {
      console.log('Error fetching stories:', error);
    }
  }

  const [stories, setStories] = useState([]);
 

  useEffect(() => {
    fetchStories();
  }, []);

  console.log('Stories:', stories);

  return (
    <div className='flex flex-col items-center w-full'>
      
      <div>
        <div className="flex flex-row space-x-4 px-3 py-2 m-2 bg-white shadow-md rounded-xl overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <div
              key={story.user_id}
              className="flex flex-col items-center min-w-[70px] cursor-pointer"
            >
              <img
                className="rounded-full h-14 w-14 object-cover border-2 border-pink-500 p-[2px]"
                src={story.story_url}
                alt={story.user_name}
              />
              <p className="text-xs mt-1 text-gray-700 truncate w-14 text-center">
                {story.user_name}
              </p>
            </div>
          ))}
           
        </div>
       <Posts />
      </div>

    </div>
  )
}

export default Home;
