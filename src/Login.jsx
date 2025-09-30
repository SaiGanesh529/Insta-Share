import React, { useState } from 'react';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: '',
    email: ''
  });
  const navigate = useNavigate();

  const postData = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userDetails.username,
          password: userDetails.password
        }),
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

  const registerUser = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await res.json();
      const token = data.jwt_token;
      localStorage.setItem('jwt_token', token);
      setSuccessMsg('Account created successfully!');
      
      // Auto login after registration
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setErrorMsg('');
    setSuccessMsg('');
    setUserDetails({ username: '', password: '', email: '' });
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
        <div className="w-[450px] min-h-[500px] border border-gray-300 rounded-lg shadow-lg p-8 flex flex-col items-center">
          <img src={logo} alt="logo" className="w-20 h-20 mb-5" />
          <h1 className="text-2xl font-bold mb-8">Insta Share</h1>
          <div className="w-full">
            <label htmlFor="userName" className="font-bold">Username</label>
            <input
              onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
              id="userName"
              type="text"
              placeholder="Username"
              value={userDetails.username}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-4 outline-none focus:border-blue-500"
            />
            
            {isRegisterMode && (
              <>
                <label htmlFor="email" className="font-bold">Email (Optional)</label>
                <input
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={userDetails.email}
                  className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-4 outline-none focus:border-blue-500"
                />
              </>
            )}
            
            <label htmlFor="Password" className="font-bold">Password</label>
            <input
              onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
              id="Password"
              type="password"
              placeholder="Password"
              value={userDetails.password}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-4 outline-none focus:border-blue-500"
            />
            
            {errorMsg && <p className="text-red-700 flex items-center m-2">{errorMsg}</p>}
            {successMsg && <p className="text-green-700 flex items-center m-2">{successMsg}</p>}

            <button
              onClick={isRegisterMode ? registerUser : postData}
              disabled={loading || !userDetails.username || !userDetails.password}
              className={`w-full h-10 rounded-lg text-white flex justify-center items-center gap-2 transition duration-300 
              ${loading || !userDetails.username || !userDetails.password ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isRegisterMode ? 'Creating Account...' : 'Logging in...'}
                </>
              ) : (
                isRegisterMode ? 'Sign Up' : 'Login'
              )}
            </button>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={toggleMode}
                  className="text-blue-600 hover:text-blue-800 font-semibold ml-1"
                >
                  {isRegisterMode ? 'Login' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
