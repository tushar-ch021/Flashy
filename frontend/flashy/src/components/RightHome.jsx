import React, { use, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assets } from '../assets/assets';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const RightHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, suggestedUsers } = useSelector(state => state.user);

  const handleSignOut = async () => {
    const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
    dispatch(setUserData(null));
  };

  return (
    <div className="absolute w-full md:w-[350px] lg:w-[350px] p-4 bg-white shadow-lg h-screen ">
      {/* Logged-in User Profile */}
      <div
        className="flex items-center justify-center gap-4 mb-8 cursor-pointer "
        onClick={() => navigate(`/profile/${userData.userName}`)}
      >
        <div className='w-15 h-15 rounded-full overflow-hidden flex items-center justify-center object-cover'>
            <img
                  src={userData?.profileImage || assets.userDp}
                  alt="User Profile"
                  className=" "
                />
        </div>
        {userData && (
          <div>
            <p className="font-semibold text-gray-800">@{userData.userName}</p>
            <p className="text-sm text-gray-500 pl-3">{userData.name}</p>
          </div>
        )}
        <div className="ml-4">
          <p
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={handleSignOut}
          >
            Logout
          </p>
        </div>
      </div>

      <div className="h-[1.15px] bg-black my-2"></div>

      

      {/* Who to Follow */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Suggested Users
        </h3>
        {suggestedUsers &&
          suggestedUsers.slice(0, 3).map((user, index) => (
            <OtherUser key={index} user={user} />
          ))}
      </div>
    </div>
  );
};

export default RightHome;
