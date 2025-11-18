import React, { useEffect, useRef } from 'react'

const VideoPlayer = ({ media }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoEl = entry.target;
        if (!videoEl) return;

        if (entry.isIntersecting) {
          // try to play; ignore promise rejections
          const p = videoEl.play();
          if (p && typeof p.then === 'function') p.catch(() => {});
        } else {
          videoEl.pause();
        }
      });
    }, { threshold: 0.6 });

    const el = videoRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-[420px] relative cursor-pointer object-cover overflow-hidden">
      <video
        ref={videoRef}
        src={media}
        playsInline muted
    
        loop
        preload="metadata"
        controls
        className="text-black w-full h-full object-cover"
      />
    </div>
  );
}

export default VideoPlayer