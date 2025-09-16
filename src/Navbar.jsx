import React from 'react'
import { Link } from 'react-router-dom';
import logo from './logo.png';
import { useState } from 'react';



function Navbar() {

  const [searchInput, setSearchInput] = useState('');

  return (
    <div><nav className="flex items-center justify-between bg-white px-6 py-3 shadow rounded-lg w-full">

      <Link to='/home'>
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8" />
          <span className="text-xl font-semibold text-gray-800">Insta Share</span>
        </div>


      </Link>

      <div className="flex items-center gap-6">
        <div className="flex border rounded-lg overflow-hidden w-64">
          <input
            id="searchInput"
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search Caption"
            className="px-3 py-2 w-full outline-none text-sm"
            value={searchInput}
          />
          <Link to={`/SearchedPost?search=${searchInput}`} className="px-3 bg-gray-100 text-gray-600">
            🔍
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link to='/home' className="text-blue-600 font-medium cursor-pointer">Home</Link>
          <Link to='/MyProfile' className="text-gray-800 font-medium cursor-pointer">Profile</Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onClick={
            () => {
              localStorage.removeItem('jwt_token');
              window.location.href = '/login'; // Redirect to login page after logout
            }
          }>
            Logout
          </button>
        </div>
      </div>
    </nav></div>
  )
}

export default Navbar