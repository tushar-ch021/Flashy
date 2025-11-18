import axios from 'axios';
import React, { useState } from 'react';
import {
  FaHome,
  FaUser,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaHashtag,
  FaSearch,
  FaPlusSquare,
  FaCommentDots,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import NotificationDropdown from './NotificationDropdown';

const LeftHome = ({ active }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const {userData}=useSelector(state => state.user)
  const { list: notifications, unreadMessages } = useSelector(state => state.notifications || { list: [], unreadMessages: {} })
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className=" h-screen w-64 bg-white p-6 hidden md:flex flex-col justify-between shadow">
      {/* Logo */}
      <div>
        <h1
          className="text-2xl font-bold text-blue-600 mb-8 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Flashy
        </h1>

        {/* Menu (No map) */}
        <nav className="space-y-4">
          <div
            onClick={() => navigate('/')}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
              active === 'Home'
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaHome />
            <span>Home</span>
          </div>

          <div
            onClick={() => navigate('/search')}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
              active === 'Search'
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaSearch />
            <span>Search</span>
          </div>
          <div
            onClick={() => navigate('/messages')}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
              active === 'Messages'
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaCommentDots />
            <span>Messages</span>
            {/* show total unread messages count */}
            {Object.values(unreadMessages || {}).reduce((s, v) => s + v, 0) > 0 && (
              <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white rounded-full w-5 h-5 text-xs">{Object.values(unreadMessages || {}).reduce((s, v) => s + v, 0)}</span>
            )}
          </div>
            
           
          <div onClick={()=>setIsOpen(!isOpen)}
           
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
              active === 'Notifications'
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaBell />
            <span>Notification</span>
            {notifications?.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white rounded-full w-5 h-5 text-xs">{notifications.length}</span>
            )}
            {isOpen && <NotificationDropdown />}
          </div>
          <div
            onClick={() => navigate('/upload')}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
              active === 'Notifications'
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaPlusSquare
                     
                    />
            <span>Create</span>
          </div>

          <div
            onClick={() => navigate(`/profile/${userData.userName}`)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
              active === 'Profile'
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaUser />
            <span>Profile</span>
          </div>

          <div
            onClick={() => navigate('/settings')}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all ${
              active === 'Settings'
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaCog />
            <span>Settings</span>
          </div>
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default LeftHome;
