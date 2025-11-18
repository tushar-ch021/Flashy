import React from "react";
import { FaHome, FaSearch, FaPlusSquare, FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { GoVideo } from "react-icons/go";


const BottomNav = () => {
  const navigate = useNavigate();
  const {userData}=useSelector(state=>state.user)
  const { list: notifications } = useSelector(state => state.notifications || { list: [] })
  return (
    <nav className="fixed bottom-0 inset-x-0 border-t border-gray-200 bg-white md:hidden">
      <div className="h-14 grid grid-cols-5 place-items-center text-xl text-gray-700">
        <FaHome
          className="cursor-pointer hover:text-blue-500"
          onClick={() => navigate("/")}
        />
        <FaSearch
          className="cursor-pointer hover:text-blue-500"
          onClick={() => navigate("/search")}
        />
        <FaPlusSquare
          className="cursor-pointer hover:text-blue-500"
          onClick={() => navigate("/upload")}
        />
        <GoVideo
          className="cursor-pointer text-gray-900 hover:text-blue-500"
          onClick={() => navigate("/moments")} size={23}
        />
        {/* <div className="relative">
          <FaBell onClick={() => navigate('/notifications')} className="cursor-pointer hover:text-blue-500" />
          {notifications?.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{notifications.length}</span>
          )}
        </div> */}
        <img
          src={userData.profileImage || assets.userDp}
          className="flex items-center justify-center overflow-hidden object-cover rounded-full w-10 h-10 cursor-pointer hover:text-blue-500"
          onClick={() => navigate(`/profile/${userData.userName}`)}
        />
      </div>
    </nav>
  );
}

export default BottomNav;
