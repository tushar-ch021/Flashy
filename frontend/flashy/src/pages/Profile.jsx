import axios from "axios";
import React, { useState, useEffect } from "react";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import { assets } from "../assets/assets";
import BottomNav from "../components/FeedComponents/BottomNav";
import { MoveLeft } from "lucide-react";
import LeftHome from "../components/LeftHome";
import FollowBtn from "../components/FollowBtn";
import ScrollPosts from "./ScrollPosts";
import MomentPreview from "./MomentPreview";
import ChatBox from "../components/ChatBox";


const Profile = () => {
  const [showScrollPosts, setShowScrollPosts] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(0);

  const navigate = useNavigate();
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);
  const { profileData, userData } = useSelector((state) => state.user);
  const { momentData } = useSelector((state) => state.moment);

  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getProfile/${userName}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    handleProfile();
  }, [userName, dispatch]);
  

  const handleSignOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Tabs
  const [activeTab, setActiveTab] = useState("posts");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Posts/moments/saved
  const userPosts =
    postData?.filter((post) => post.author?._id === profileData?._id) || [];
  const userMoments =
    momentData?.filter((moment) => moment.author?._id === profileData?._id) ||
    [];

  const allPosts = [...userPosts, ...userMoments];
  const reels = userMoments;
  const savedPosts = profileData?.savedPosts || [];
const savedMoments = profileData?.savedMoments || [];
const savedAll = [...savedPosts, ...savedMoments];


  return (
    <div className="flex h-screen">
      <LeftHome />

      <div className="relative flex flex-col items-center w-full min-h-screen bg-gray-50 text-gray-800 pt-[48px] overflow-auto">
        {/* Back Btn */}
        <div
          className="hidden sm:flex absolute left-5 top-5 w-10 h-10 rounded-full bg-gray-200 items-center justify-center hover:bg-gray-300"
          onClick={() => navigate("/")}
        >
          <MoveLeft />
        </div>

        {/* Header */}
        <div className="w-full max-w-4xl px-4 md:px-8 py-6 border-b">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <img
                src={profileData?.profileImage || assets.userDp}
                alt="Profile"
                className="w-29 h-29 rounded-full object-cover border"
              />
            </div>

            <div className="flex flex-col flex-grow">
              {/* Username + Edit */}
              <div className="flex sm:flex-row flex-col items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold">
                  @{profileData?.userName}
                </h2>
                {profileData?._id === userData?._id && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/editProfile")}
                      className="px-4 py-1 rounded text-sm font-medium bg-gray-200 hover:bg-gray-300"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-1 text-white rounded text-sm bg-blue-400 font-medium hover:bg-blue-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6 mb-4 text-sm">
                <p>
                  <span className="font-semibold">
                    {profileData?.posts?.length || 0}
                  </span>{" "}
                  posts
                </p>
                <p className="cursor-pointer" onClick={() => setShowFollowers(true)}>
                  <span className="font-semibold">
                    {profileData?.followers?.length || 0}
                  </span>{" "}
                  followers
                </p>
                <p className="cursor-pointer" onClick={() => setShowFollowing(true)}>
                  <span className="font-semibold">
                    {profileData?.following?.length || 0}
                  </span>{" "}
                  following
                </p>
              </div>

              {/* Bio */}
              <div>
                <p className="font-semibold">{profileData?.name}</p>
                <p className="text-sm">{profileData?.bio || ""}</p>
              </div>

              {profileData?._id !== userData?._id && (
                <div className="flex gap-5 mt-4">
                  <FollowBtn
                    tailwind="px-4 py-1 rounded text-sm bg-blue-500 font-medium text-white hover:bg-blue-600"
                    targetUserId={profileData?._id}
                    onFollow={handleProfile}
                  />
                  <button className="px-4 py-1 rounded text-sm bg-gray-200 font-medium hover:bg-gray-300" onClick={() => setShowChat(true)}>
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full max-w-4xl flex justify-center border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "posts"
                ? "border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "reels"
                ? "border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => setActiveTab("reels")}
          >
            Moments
          </button>

          {/* Saved tab only on own profile */}
          {profileData?._id === userData?._id && (
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "saved"
                  ? "border-b-2 border-black"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setActiveTab("saved")}
            >
              Saved
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="w-full max-w-4xl px-2 py-6 grid grid-cols-3 gap-1 md:gap-4">
          {activeTab === "posts" &&
            allPosts.map((item, index) => (
              <MomentPreview
                key={item._id || index}
                item={item}
                onClick={() => {
                  setScrollIndex(index);
                  setShowScrollPosts(true);
                }}
              />
            ))}

          {activeTab === "reels" &&
            reels.map((moment, index) => (
              <MomentPreview
                key={moment._id || index}
                item={moment}
                onClick={() => {
                  setScrollIndex(index);
                  setShowScrollPosts(true);
                }}
              />
            ))}

       {activeTab === "saved" &&
  savedAll.map((item, index) => (
    <MomentPreview
      key={index}
      item={item}
      onClick={() => {
        setScrollIndex(index);
        setShowScrollPosts(true);
      }}
    />
  ))}

        </div>
      </div>

      {/* Scroll Modal */}
      {showScrollPosts && (
        <ScrollPosts
          posts={
            activeTab === "posts"
              ? allPosts
              : activeTab === "reels"
              ? reels
              : savedPosts
          }
          initialIndex={scrollIndex}
          onClose={() => setShowScrollPosts(false)}
        />
      )}

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 max-h-[70vh] rounded-lg shadow p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Followers</h3>
              <button onClick={() => setShowFollowers(false)} className="text-sm">Close</button>
            </div>
            {profileData?.followers?.length ? (
              profileData.followers.map((u) => (
                <div key={u._id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <img src={u.profileImage || assets.userDp} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium">@{u.userName}</p>
                      <p className="text-xs text-gray-500">{u.name}</p>
                    </div>
                  </div>
                  <button className="text-xs text-blue-600" onClick={() => navigate(`/profile/${u.userName}`)}>View</button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No followers yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 max-h-[70vh] rounded-lg shadow p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Following</h3>
              <button onClick={() => setShowFollowing(false)} className="text-sm">Close</button>
            </div>
            {profileData?.following?.length ? (
              profileData.following.map((u) => (
                <div key={u._id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <img src={u.profileImage || assets.userDp} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium">@{u.userName}</p>
                      <p className="text-xs text-gray-500">{u.name}</p>
                    </div>
                  </div>
                  <button className="text-xs text-blue-600" onClick={() => navigate(`/profile/${u.userName}`)}>View</button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Not following anyone.</p>
            )}
          </div>
        </div>
      )}

      {/* Chat Drawer */}
      {showChat && profileData?._id !== userData?._id && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowChat(false)}>
          <div className="absolute right-0 top-0 h-full w-full sm:w-[380px] bg-white shadow-xl p-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden object-cover flex items-center justify-center">
                <img src={profileData?.profileImage || assets.userDp} alt="" />
              </div>
              <h4 >Chat with <span className="font-semibold">@{profileData?.userName}</span></h4>
              <button onClick={() => setShowChat(false)} className="text-sm">Close</button>
            </div>
            <ChatBox targetUserId={profileData?._id} />
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Profile;
