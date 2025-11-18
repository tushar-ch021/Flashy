import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaRegComment, FaRegPaperPlane, FaBookmark, FaTrash } from "react-icons/fa";
import ShareModal from '../ShareModal'
import { assets } from "../../assets/assets";
import VideoPlayer from "../VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { getRelativeTime } from "../time.js";
import { serverUrl } from "../../App.jsx";
import axios from "axios";
import { setPostData } from "../../redux/postSlice.js";
import { setUserData, toggleSavedMoment, toggleSavedPost } from "../../redux/userSlice.js";
import FollowBtn from "../FollowBtn.jsx";
import GetCurrentUser from "../../hooks/GetCurrentUser.jsx";
import { setMomentData } from "../../redux/momentSlice.js";
const PostCard = ({ post }) => {
  const fetchUser = GetCurrentUser(); 

  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const {savedMoments,savedPosts}=useSelector(state=>state.user)
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const dispatch = useDispatch();
      const videoRef=useRef()
    useEffect(()=>{
        const observer=new IntersectionObserver(entry=>{
          const video=videoRef.current
          if(entry.isIntersecting && video){
            video.play()
          }
          else if(!entry.isIntersecting && video){
              video.pause()
          }
            
        },{threshold:0.6})
        if(videoRef.current){
          observer.observe(videoRef.current)
        }
        return ()=>{
          if(videoRef.current){
              observer.unobserve(videoRef.current)
        }
      }
      },[])


  
  const { momentData } = useSelector((state) => state.moment);

  const isMoment = post.mediaType === "video"; // <-- decide type

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
        const res = await axios.post(
          `${serverUrl}/api/post/saved/moment/${post._id}`,
          {},
          { withCredentials: true }
        );
        if (res.data?.savedMoments) {
          dispatch(setUserData({ ...userData, savedMoments: res.data.savedMoments }));
        }
      } else {
        const res = await axios.post(
          `${serverUrl}/api/post/saved/post/${post._id}`,
          {},
          { withCredentials: true }
        );
        if (res.data?.savedPosts) {
          dispatch(setUserData({ ...userData, savedPosts: res.data.savedPosts }));
        }
      }
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message || error);
    }
  };




  return (
    <div className="bg-gray-50 shadow rounded-xl mb-6 border border-gray-200 min-h-[200px] px-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div
         
          className="flex items-center gap-3 cursor-pointer"
        >
          <img  onClick={() => navigate(`/profile/${post.author.userName}`)}
            src={post.author.profileImage || assets.userDp}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p  onClick={() => navigate(`/profile/${post.author.userName}`)} className="font-semibold text-gray-800">
              {post.author.userName}
            </p>
            <p className="text-xs text-gray-500">
              {getRelativeTime(post.createdAt)}
            </p>
          </div>
          {
            String(userData._id) !== String(post.author._id) &&  <FollowBtn targetUserId={post.author._id} tailwind={" text-blue-600 rounded pb-3 ml-3"}/>
          }
          </div>
         
         
        {/* three-dots menu for author */}
        {String(userData._id) === String(post.author._id) ? (
          <div className="relative ">
            <button onClick={() => setShowMenu((s) => !s)} className="text-gray-500"><FaTrash /></button>
            {showMenu && (
              <div className="absolute right-0  bg-white border rounded shadow p-2 w-40 z-50">
                <button
                  className="w-full text-left px-2 py-1 hover:bg-gray-100"
                  onClick={async () => {
                    try {
                      const url = isMoment ? `${serverUrl}/api/moment/delete/${post._id}` : `${serverUrl}/api/post/delete/${post._id}`;
                      const res = await axios.delete(url, { withCredentials: true });
                      if (res.data?.success) {
                        if (isMoment) {
                          const updated = momentData.filter((m) => m._id !== post._id);
                          dispatch(setMomentData(updated));
                        } else {
                          const updated = postData.filter((p) => p._id !== post._id);
                          dispatch(setPostData(updated));
                        }
                      }
                    } catch (err) {
                      console.error('Delete error', err.response?.data || err.message || err);
                    } finally {
                      setShowMenu(false);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Media */}
      <div className="w-full sm:h-[400px] md:h-[490px] rounded-xl bg-gray-100  flex items-center justify-center overflow-hidden">
        {post.mediaType === "image" ? (
          <img
            src={post.media}
            alt="Preview"
            className="  object-cover"
          />
        ) : (
          <VideoPlayer media={post.media} />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
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
        <div onClick={handleSaved}>

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

      {/* Meta */}
      <div className="px-4 pb-4">
        <p className="font-semibold text-gray-800">{post.likes.length} likes</p>
        <p className="text-gray-700">
          <span className="font-semibold mr-1">{post.author.name}</span>
          {post.caption}
        </p>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-sm text-gray-500 hover:text-gray-700 mt-1"
        >
          View all{" "}
          <span>{post.comments.length > 0 ? post.comments.length : ""}</span>{" "}
          comments
        </button>

        <div className="max-h-[300px] overflow-y-auto">
          {showComments &&
            post.comments.slice() 
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment) => (
              <div
                key={comment._id}
                className="flex items-center gap-4 mt-2 shadow p-3 rounded "
              >
                <img  onClick={() => navigate(`/profile/${comment.author.userName}`)}
                  src={comment.author.profileImage || assets.userDp}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-800" onClick={() => navigate(`/profile/${comment.author.userName}`)}>
                      {comment.author?.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getRelativeTime(comment.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">{comment.message}</p>
                </div>
              </div>
            ))}
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
          <Send onClick={() => handleComment(message, setMessage, setShowComments)}
 />
        </div>
      </div>
      <ShareModal post={post} isOpen={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
};

export default PostCard;
