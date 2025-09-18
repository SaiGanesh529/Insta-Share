
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import MyProfile from './MyProfile';
import IndividualProfiles from './IndividualProfiles';
import SearchedPost from './SearchedPost';
import Navbar from './Navbar';

function App() {


  return (
    <>
    
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} /> {/* about route */}
      </Routes> 
    <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />       {/* default route */}
        <Route path="/myprofile" element={<MyProfile />} /> {/* contact route */}
        <Route path="/IndividualProfiles/:userId" element={<IndividualProfiles />} /> {/* contact route */}
        <Route path="/SearchedPost" element={<SearchedPost />} /> {/* contact route */}
      </Routes>
    </BrowserRouter>

    </>
  );
}

export default App;
