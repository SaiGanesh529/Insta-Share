import React, { useState } from 'react';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const postData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (!res.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await res.json();
      const token = data.jwt_token;
      localStorage.setItem('jwt_token', token);
      if (token) {
        navigate('/home');
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="col-span-3 flex items-center m-5">
        <img
          src="https://launchtoast.com/wp-content/uploads/2021/01/how-to-grow-instagram-organically-1-1024x655.png"
          alt="logo"
          className="w-auto h-auto mx-auto mt-10"
        />
      </div>
      <div className="col-span-3 flex items-center justify-center">
        <div className="w-[450px] h-[500px] border border-gray-300 rounded-lg shadow-lg p-8 flex flex-col items-center">
          <img src={logo} alt="logo" className="w-20 h-20 mb-5" />
          <h1 className="text-2xl font-bold mb-8">Insta Share</h1>
          <div className="w-full">
            <label htmlFor="userName" className="font-bold">Username</label>
            <input
              onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
              id="userName"
              type="text"
              placeholder="Username"
              className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-4 outline-none focus:border-blue-500"
            />
            <label htmlFor="Password" className="font-bold">Password</label>
            <input
              onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
              id="Password"
              type="password"
              placeholder="Password"
              className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-4 outline-none focus:border-blue-500"
            />
            <p className="text-red-700 flex items-center m-2">{errorMsg}</p>

            <button
              onClick={postData}
              disabled={loading}
              className={`w-full h-10 rounded-lg text-white flex justify-center items-center gap-2 transition duration-300 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
