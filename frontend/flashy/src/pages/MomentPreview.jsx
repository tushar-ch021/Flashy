import React, { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";
import { useSelector } from 'react-redux'

const MomentPreview = ({ item, onClick }) => {
  const [paused, setPaused] = useState(false);
  const videoRef = useRef();
  const { userData } = useSelector(state => state.user)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setPaused(false);
    }
  }, [item.media]);

  const handleTimeUpdate = (e) => {
    if (e.target.currentTime >= 5 && !paused) {
      e.target.pause();
      setPaused(true);
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setPaused(false);
    }
  };

  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      {/* no delete button in grid preview (delete available in modal/owner-only UI) */}
      {item.mediaType === "video" ? (
        <div className="relative">
          <video
            ref={videoRef}
            src={item.media}
            className="w-full h-40 md:h-64 object-cover"
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
          />
          {paused && (
            <button
              className="absolute inset-0 flex items-center justify-center text-white bg-black/40"
              onClick={e => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              <Play size={30} />
            </button>
          )}
        </div>
      ) : (
        <img
          src={item.media}
          className="w-full h-40 md:h-64 object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold transition">
        ❤️ {item?.likes?.length || 0} &nbsp; 💬 {item?.comments?.length || 0}
      </div>
    </div>
  );
};

export default MomentPreview;
