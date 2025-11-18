import React from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useSelector } from 'react-redux'

const StoryCard = () => {
  const { storyData } = useSelector((state) => state.story)
  const { userName } = useParams()

  if (!storyData) return null

  const mediaUrl = storyData.media
  const mediaType = storyData.mediaType

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black relative">
      {/* media */}
      {mediaType === 'video' ? (
        <video src={mediaUrl} controls autoPlay className="max-h-full max-w-full object-contain" />
      ) : (
        <img src={mediaUrl} alt="story" className="max-h-full max-w-full object-contain" />
      )}

      {/* overlay author */}
      <div className="absolute top-4 left-4 flex items-center gap-3 text-white">
        <img src={storyData?.author?.profileImage || assets.userDp} className="w-10 h-10 rounded-full object-cover border-2 border-white" alt="" />
        <div className="font-semibold">{storyData?.author?.userName}</div>
      </div>
    </div>
  )
}

export default StoryCard