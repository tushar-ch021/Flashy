import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { FaTrash } from 'react-icons/fa'
import VideoPlayer from "../components/VideoPlayer";
import { assets } from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import axios from "axios";
import { setPostData } from "../redux/postSlice";
import { useNavigate } from "react-router-dom";
import { getRelativeTime } from "../components/time";
import { FaBookmark, FaHeart, FaRegComment, FaRegPaperPlane } from "react-icons/fa";
import ShareModal from "../components/ShareModal";
import { setUserData, toggleSavedMoment, toggleSavedPost } from "../redux/userSlice";
import GetCurrentUser from "../hooks/GetCurrentUser";
import { setMomentData } from "../redux/momentSlice";
const ScrollPosts = ({ posts, initialIndex = 0, onClose }) => {
  const fetchUser = GetCurrentUser(); 
  const [index, setIndex] = useState(initialIndex);
  const post = posts[index];
  if (!post) return null;
  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showComments, setShowComments] = useState(false);
  const {savedMoments,savedPosts}=useSelector(state=>state.user)
  const [showCommentUserProfile, setShowCommentUserProfile] = useState(false);
    const [showShare, setShowShare] = useState(false);
  const { momentData } = useSelector((state) => state.moment);
  const dispatch = useDispatch();

  const nextPost = () => {
    if (index < posts.length - 1) setIndex(index + 1);
  };

  const prevPost = () => {
    if (index > 0) setIndex(index - 1);
  };
  const isMoment = post.mediaType === "video";
// Like
  const handleLike = async () => {
    try {
      const url = isMoment
        ? `${serverUrl}/api/moment/like/${post._id}`
        : `${serverUrl}/api/post/like/${post._id}`;

      const result = await axios.get(url, { withCredentials: true });
      const updatedItem = result.data;

      if (isMoment) {
        const updated = momentData.map((m) =>
          m._id === updatedItem._id ? updatedItem : m
        );
        dispatch(setMomentData(updated));
        
      } else {
        const updated = postData.map((p) =>
          p._id === updatedItem._id ? updatedItem : p
        );
        dispatch(setPostData(updated));
          // server sends no user update on like; skip fetchUser
      }
    } catch (error) {
      console.error("Like error:", error.response?.data || error.message || error);
    }
  };

  // Comment
  const handleComment = async (message, setMessage, setShowComments) => {
    try {
      const url = isMoment
        ? `${serverUrl}/api/moment/comment`
        : `${serverUrl}/api/post/comment/${post._id}`;

      const payload = isMoment ? { message, momentId: post._id } : { message };

      const result = await axios.post(url, payload, { withCredentials: true });
      const updatedItem = result.data;

      if (isMoment) {
        const updated = momentData.map((m) =>
          m._id === updatedItem._id ? updatedItem : m
        );
        dispatch(setMomentData(updated));
      } else {
        const updated = postData.map((p) =>
          p._id === updatedItem._id ? updatedItem : p
        );
        dispatch(setPostData(updated));
      }

      if (setMessage) setMessage("");
      if (setShowComments) setShowComments(true);
    } catch (error) {
      console.error("Comment error:", error.response?.data || error.message || error);
    }
  };

  // Save
  const handleSaved = async () => {
    try {
      if (isMoment) {
  const res = await axios.post(`${serverUrl}/api/post/saved/moment/${post._id}`, {}, { withCredentials: true });
          // update userData from response if provided, otherwise skip full refetch
          if (res?.data?.savedMoments) dispatch(setUserData({ ...userData, savedMoments: res.data.savedMoments }));
      } else {
        const res = await axios.post(`${serverUrl}/api/post/saved/post/${post._id}`, {}, { withCredentials: true });
          if (res?.data?.savedPosts) dispatch(setUserData({ ...userData, savedPosts: res.data.savedPosts }));
      }

    } catch (error) {
      console.error("Save error:", error.response?.data || error.message || error);
    }
  };



  // Close modal on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextPost();
      if (e.key === "ArrowLeft") prevPost();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index]);

  return (<>
   {/* Close Button */}
      <div className="absolute right-1 flex  items-center gap-3 sm:top-1 sm:right-3 z-50">
        
        <button
          onClick={onClose}
          className=""
        >
          <X size={28} />
        </button>
      </div>
    <div className="fixed  inset-0 bg-white flex items-center justify-center ">
     

      {/* Prev Button */}
      {index > 0 && (
        <button
          onClick={prevPost}
          className="absolute text-gray-700 top-[180px]  left-4 md:left-6  p-2 rounded-full hover:bg-gray-100 bg-gray-50"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Post Content */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row h-[90%] bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Media */}

        <div className="w-full md:w-2/3 h-[50%] md:h-full  bg-black flex items-center justify-center">
          {post.mediaType === "image" ? (
            <img
            src={post.media}
            alt="Preview"
            className="w-full h-full object-cover"
            />
          ) : (
            <VideoPlayer media={post.media} />
          )}
        </div>

        {/* Sidebar (Caption + Comments) */}
        <div className="w-full md:w-1/3 p-4 flex flex-col rounded-lg shadow-lg ">
          <div className="flex flex-col  mb-3  ">
            <div className="flex items-center  gap-3">
              <img
                src={post.author?.profileImage || assets.userDp}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-semibold">{post.author?.userName}</p>
              <p className="text-xs text-gray-500">
                {getRelativeTime(post.createdAt)}
              </p>
            </div>
            <div className="mt-1 ml-[55px]">
              <p className="text-sm mb-3 ">{post.caption}</p>
            </div>
          </div>
           <div className="flex items-center justify-between px-4 pb-2">
                  <div className="flex items-center gap-4 text-xl text-gray-700">
                    {!post.likes.includes(userData._id) && (
                      <FaHeart
                      className="cursor-pointer transition"
                      onClick={handleLike}
                      />
                    )}
                    {post.likes.includes(userData._id) && (
                      <FaHeart
                      className="cursor-pointer text-red-500 transition"
                      onClick={handleLike}
                      />
                    )}
                     
                    <FaRegComment  onClick={() => setShowComments(!showComments)} className="cursor-pointer hover:text-blue-500 transition" />
                   
                                      <FaRegPaperPlane onClick={() => setShowShare(true)} className="cursor-pointer hover:text-blue-500 transition" />
                  </div>
                  <div className="flex items-center justify-between gap-3" onClick={handleSaved}>
                    {String(userData._id) === String(post.author?._id) && (
          <button onClick={async () => {
            try {
              const url = isMoment ? `${serverUrl}/api/moment/delete/${post._id}` : `${serverUrl}/api/post/delete/${post._id}`
              const res = await axios.delete(url, { withCredentials: true })
              if (res.data?.success) {
                if (isMoment) {
                  const updated = (momentData || []).filter(m => m._id !== post._id)
                  dispatch(setMomentData(updated))
                } else {
                  const updated = (postData || []).filter(p => p._id !== post._id)
                  dispatch(setPostData(updated))
                }
                // close modal after delete
                onClose()
              }
            } catch (err) {
              console.error('Delete error', err.response?.data || err.message || err)
            }
          }} className=" ">
            {/* On mobile show save/bookmark icon instead of trash to match request; keep trash for larger screens */}
           
            <FaTrash size={20} className="cursor-pointer text-xl text-gray-700 " />
          </button>
        )}
                  <FaBookmark
                    onClick={handleSaved}
                    className={`cursor-pointer text-xl ${
                      post.mediaType === "video"
                        ? ((userData?.savedMoments || savedMoments).some(m => (m._id?.toString ? m._id.toString() : m._id) === (post._id?.toString ? post._id.toString() : post._id)) ? "text-blue-500" : "text-gray-700")
                        : ((userData?.savedPosts || savedPosts).some(p => (p._id?.toString ? p._id.toString() : p._id) === (post._id?.toString ? post._id.toString() : post._id)) ? "text-blue-500" : "text-gray-700")
                    }`}
                  />

                  </div>
                  
                </div>
                 <p className="font-semibold text-xs text-gray-800 ml-3">{post.likes.length} likes</p>

          <div className="">
  {/* Toggle Comments */}
  <button
    onClick={() => setShowComments(!showComments)}
    className="text-sm  text-gray-500 hover:text-gray-700 mt-1"
    >
    View all{" "}
    <span>{post.comments.length > 0 ? post.comments.length : ""}</span>{" "}
    comments
  </button>
  </div>

  {/* Comments Section */}
  <div className="flex-1 overflow-y-auto space-y-4 shadow rounded">


  {/* Comments Section */}
  <div className="sm:max-h-[200px] md:max-h-full overflow-y-auto px-2">
    {showComments ? (
      post.comments
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((comment) => (
        <div key={comment._id} className="text-sm flex items-start py-2 gap-3">
            <img
              onClick={() => {
                onClose(); // closes modal
                navigate(`/profile/${comment.author.userName}`);
              }}
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              src={comment.author?.profileImage || assets.userDp}
              alt=""
              />

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  onClick={() => {
                    onClose();
                    navigate(`/profile/${comment.author?.userName}`);
                  }}
                  className="font-semibold cursor-pointer"
                >
                  {comment.author?.userName}
                </span>
                <span className="text-xs text-gray-500">
                  {getRelativeTime(comment.createdAt)} {/* ⏰ time here */}
                </span>
              </div>
              <span className="text-gray-700">{comment.message}</span>
            </div>
          </div>
        ))
      ) : (
        post.comments.length === 0 && (
          <p className="flex items-center justify-center mt-5">
          No comments yet.
        </p>
      )
    )}
  </div>
</div>



          {/* Comment Input */}
          <div className="flex items-center">
            <div className="flex items-center mt-2 rounded-full">
              <img
                src={userData.profileImage || assets.userDp}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
                />
            </div>
            <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Add a comment..."
              className="w-[90%] mt-4 text-sm border-b border-gray-200 focus:outline-none py-1 px-3"
              />
            <Send onClick={() => handleComment(message, setMessage, setShowComments)} />
          </div>
        </div>
      </div>

      {/* Next Button */}
      {index < posts.length - 1 && (
        <button
        onClick={nextPost}
        className="absolute text-gray-700 top-[180px]  right-4 md:right-6  p-2 rounded-full hover:bg-gray-100 bg-gray-50"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} post={post} />
      </>
  );
};

export default ScrollPosts;
