
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setFollowing, toggleFollow } from '../redux/userSlice';

const FollowBtn = ({ targetUserId, tailwind ,onFollow}) => {
  const { following } = useSelector(state => state.user);
  const isFollowing = following.includes(targetUserId);
  const dispatch = useDispatch();

  const handleFollow = async () => {
    try {
      await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`, { withCredentials: true });
      // Fetch updated following list from backend
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
      dispatch(toggleFollow(targetUserId))
      if(onFollow){
        onFollow()
      }
      dispatch(setFollowing(result.data.following));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button onClick={handleFollow} className={tailwind}>
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowBtn;