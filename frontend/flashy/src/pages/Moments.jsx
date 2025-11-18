import { MoveLeft } from 'lucide-react';
import React from 'react'
import { FaHeart, FaRegComment, FaBookmark } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MomentCard from '../components/MomentCard';
 const Moments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const {momentData}=useSelector(state=>state.moment)
  return (
    <div className="w-full h-screen bg-black relative">
      <div
        className="flex fixed left-5 top-5 w-10 h-10 rounded-full bg-gray-800 items-center justify-center text-white hover:text-gray-400 hover:bg-gray-900 z-40"
        onClick={() => navigate(-1)}
      >
        <MoveLeft />
      </div>

      <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth touch-pan-y">
        {momentData.map((moment, index) => (
          <div key={moment._id || index} className="snap-center h-screen w-full flex items-center justify-center">
            <MomentCard moment={moment} />
          </div>
        ))}
      </div>
    </div>
  );
  
}
export default Moments