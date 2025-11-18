
import React from 'react';
import { assets } from '../assets/assets';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FollowBtn from './FollowBtn';

const OtherUser = ({ user }) => {
  const navigate=useNavigate()
    const {userData}=useSelector(state=>state.user)
      const {following}=useSelector(state=>state.user)
  return (
    <div className="flex items-center justify-between mb-4 " >
      
      <div className="flex items-center gap-3" onClick={() => navigate(`/profile/${user.userName}`)}>
        <img
          src={user?.profileImage || assets.userDp}
          alt="User Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-sm text-gray-900">@{user.userName}</p>
          <p className="text-sm text-gray-500">{user.name}</p>
        </div>
      </div>
      <FollowBtn tailwind={"text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"} targetUserId={user._id}/>
      
    </div>
  );
};

export default OtherUser;
