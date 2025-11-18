import React, { useState, useRef } from "react";
import { Image as ImageIcon, Video, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { setPostData } from "../redux/postSlice";
import { setMomentData } from "../redux/momentSlice";
import { setStoryData } from "../redux/storySlice";
import { setUserData } from "../redux/userSlice";

const Upload = () => {
  const [active, setActive] = useState("post"); // post | story | moment
 
  const [mediaName, setMediaName] = useState("");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);
  const { momentData } = useSelector((state) => state.moment);
  const { storyData } = useSelector((state) => state.story);

  let navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const mediaInput = useRef();

  // 🔄 Upload API Calls
  const uploadPost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(`${serverUrl}/api/post/upload`, formData, {
        withCredentials: true,
      });

      dispatch(setPostData([result.data, ...postData]));
      navigate("/");
    } catch (error) {
      console.log("Post upload error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const uploadStory = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/story/upload`,
        formData,
        { withCredentials: true }
      );
      setUserData((prev)=>({...prev,stroy:result.data}))
      navigate("/");
    } catch (error) {
      console.log("Story upload error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };
  const uploadMoment = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/moment/upload`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMomentData([result.data, ...momentData]));
      navigate("/");
    } catch (error) {
      console.log("Moment upload error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // 📂 Handle File Selection
  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaName(file.name);

    let type = "";
    if (file.type.includes("image")) type = "image";
    else if (file.type.includes("video")) type = "video";

    // ⚠️ Validation rules
    if (active === "story" && type !== "image") {
      setWarning("Stories can only contain images.");
      resetMedia();
      return;
    }
    if (active === "moment" && type !== "video") {
      setWarning("Moments can only contain videos.");
      resetMedia();
      return;
    }

    // Valid media
    setWarning("");
    setMediaType(type);
    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
  };

  const resetMedia = () => {
    setFrontendMedia(null);
    setBackendMedia(null);
    setMediaType("");
    setMediaName("");
  };

  // 🚀 Handle Upload
  const handleUpload = (e) => {
    e.preventDefault();
    if (warning || !backendMedia) return;

    if (active === "post") uploadPost();
    else if (active === "story") uploadStory();
    else if (active === "moment") uploadMoment();
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        {/* Cross Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-0 left-3 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md overflow-hidden relative">
      
        {/* Header with Tabs */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Upload</h2>
          <div className="grid grid-cols-3 bg-gray-100 rounded-xl text-sm">
            {["post", "story", "moment"].map((key) => (
              <button
                key={key}
                onClick={() => {
                  setActive(key);
                  setWarning("");
                  resetMedia();
                }}
                className={`capitalize px-3 py-2 rounded-lg transition ${
                  active === key ? "bg-white shadow font-medium" : "text-gray-500"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* File Picker */}
          <div className="border-2 border-dashed rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3 text-gray-600">
              <ImageIcon className="w-5 h-5" />
              <Video className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-600">
              {active === "moment"
                ? "Upload a short video reel"
                : active === "story"
                ? "Upload an image for your story"
                : "Upload an image or a video for your post"}
            </p>
            <label
              onClick={() => mediaInput.current.click()}
              className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-900 text-white text-sm cursor-pointer hover:bg-black/90"
            >
              Choose File
            </label>
            <input hidden type="file" accept={active==='moment'?'video/*' :''} ref={mediaInput} onChange={handleMedia} />

            {mediaName && (
              <p className="mt-2 text-xs text-gray-700 truncate">{mediaName}</p>
            )}

            {/* ⚠️ Warning Message */}
            {warning && (
              <p className="mt-2 text-xs text-red-500 font-medium">{warning}</p>
            )}
          </div>

          {/* Caption */}
          {active !== "story" && (
            <div>
              <label className="block text-sm font-medium mb-1">Caption</label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={
                  active === "moment"
                    ? "Say something about your reel..."
                    : "Write a caption..."
                }
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 p-3 resize-none"
              />
            </div>
          )}

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium mb-1">Preview</label>
            {!frontendMedia && (
              <div className="w-full aspect-[9/16] sm:aspect-[16/9] rounded-xl bg-gray-100 border border-dashed flex items-center justify-center text-gray-500 text-sm">
                {mediaName ? "Your media preview here" : "No media selected"}
              </div>
            )}
            {frontendMedia && (
              <div className="w-full aspect-[9/16] sm:aspect-[16/9] rounded-xl bg-gray-100 border border-dashed flex items-center justify-center overflow-hidden">
                {mediaType === "image" ? (
                  <img
                    src={frontendMedia}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <VideoPlayer media={frontendMedia} />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t flex justify-end">
          <button
            onClick={handleUpload}
            className="px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black/90 disabled:opacity-50"
            disabled={!!warning || !backendMedia || loading}
          >
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : active === "post" ? (
              "Publish Post"
            ) : active === "story" ? (
              "Share Story"
            ) : (
              "Share Moment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
