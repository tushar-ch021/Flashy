import React from "react";
import BottomNav from "./FeedComponents/BottomNav";
import PostCard from "./FeedComponents/PostCard";
import Stories from "./FeedComponents/Stories";
import { useSelector } from "react-redux";
import { FaBell, FaCommentDots } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Feed = () => {
  const { postData } = useSelector((state) => state.post);
  const { momentData } = useSelector((state) => state.moment);
  const { userData } = useSelector((state) => state.user);
  const { list: notifications, unreadMessages } = useSelector(state => state.notifications || { list: [], unreadMessages: {} })
  const navigate = useNavigate()

  const messageUnreadTotal = Object.values(unreadMessages || {}).reduce((s, v) => s + v, 0)

  // 🌀 Merge posts + moments and sort by createdAt (latest first)
  const feedItems = [...postData, ...momentData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto pb-20 mt-3 md:pb-6">
      {/* Mobile top bar: show notification & messages icons top-right */}
      <div className="md:hidden sticky top-0 z-30 bg-white px-4 py-2 border-b flex items-center w-full">
        <div />
        <div className="flex w-full items-center justify-between gap-4">
          <div
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  className="text-md font-medium bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
>
  Flashy
</div>

          <div className="flex items-center justify-between w-15">
            <button onClick={() => navigate('/messages')} className="relative">
            <FaCommentDots size={20} />
            {messageUnreadTotal > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{messageUnreadTotal}</span>
            )}
          </button>
          <button onClick={() => navigate('/notifications')} className="relative">
            <FaBell size={20} />
            {notifications?.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{notifications.length}</span>
            )}
          </button>
          </div>
        </div>
      </div>
      {/* Stories Section */}
      <Stories userName={'Your Story'} ProfileImage={userData.profileImage} story={userData.story} />

      {/* Feed Items (Posts + Moments) */}
      {Array.isArray(feedItems) && feedItems.length > 0 ? (
        feedItems.map((item, index) => (
          <PostCard post={item} key={item?._id || index} />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No posts or moments yet. Start sharing!
        </p>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Feed;
