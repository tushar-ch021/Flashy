import React, { useState, useRef, useEffect, useCallback } from 'react'
import { FaBookmark, FaComment, FaHeart, FaRegComment, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import { assets } from '../assets/assets'
import CommentSheet from './CommentSheet'
import { useDispatch, useSelector } from 'react-redux'
import { setMomentData } from '../redux/momentSlice'
import axios from 'axios'
import { serverUrl } from '../App'
import GetCurrentUser from '../hooks/GetCurrentUser'
import { useMute } from '../contexts/MuteContext'
import { Speaker } from 'lucide-react'
import { setUserData } from '../redux/userSlice'

const MomentCard = ({ moment }) => {
  const [openComments, setOpenComments] = useState(false)
  const dispatch = useDispatch()
  const { momentData } = useSelector(state => state.moment)
  const { userData } = useSelector(state => state.user)
  const fetchUser = GetCurrentUser()
  const [isPlaying, setIsPlaying] = useState(false)
  const { muted: isMuted, setMuted } = useMute()
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  const handleClick = () => {
    const v = videoRef.current
    if (!v) return
    if (isPlaying) {
      v.pause()
      setIsPlaying(false)
    } else {
      v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }
  const handleLike = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/moment/like/${moment._id}`, { withCredentials: true })
      const updatedMoment = res.data
      const updated = momentData.map(m => (m._id === updatedMoment._id ? updatedMoment : m))
      dispatch(setMomentData(updated))
    } catch (error) {
      console.error('Moment like error', error.response?.data || error)
    }
  }

  const handleSaved = async () => {
    try {
      const res = await axios.post(`${serverUrl}/api/post/saved/moment/${moment._id}`, {}, { withCredentials: true })
      if (res.data?.savedMoments) {
        dispatch(setUserData({ ...userData, savedMoments: res.data.savedMoments }))
      }
    } catch (error) {
      console.error('Moment save error', error.response?.data || error)
    }
  }

  const isSaved = (userData?.savedMoments || []).some(s => (s._id?.toString ? s._id.toString() : s._id) === (moment._id?.toString ? moment._id.toString() : moment._id))
  const isLiked = moment?.likes?.some(id => id?.toString ? id.toString() === (userData?._id?.toString ? userData._id.toString() : userData._id) : id === userData?._id)
  // Fetch latest moment from server and update redux
  const fetchMoment = useCallback(async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/moment/${moment._id}`, { withCredentials: true })
      const updatedMoment = res.data
      const updated = momentData.map(m => (m._id === updatedMoment._id ? updatedMoment : m))
      dispatch(setMomentData(updated))
      return updatedMoment
    } catch (error) {
      console.error('Fetch moment error', error.response?.data || error)
      return null
    }
    // eslint-disable-next-line
  }, [moment._id, dispatch, momentData])

  // Auto play/pause when the card is mostly visible
  useEffect(() => {
    const el = containerRef.current
    const v = videoRef.current
    if (!el || !v) return

    v.muted = isMuted

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
          } else {
            try { v.pause() } catch {}
            setIsPlaying(false)
          }
        })
      },
      { threshold: [0, 0.25, 0.5, 0.6, 0.9, 1] }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isMuted])

  // keep video muted in sync with global mute
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    try { v.muted = isMuted } catch {}
  }, [isMuted])

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    const next = !isMuted
    try { v.muted = next } catch {}
    setMuted(next)
  }
  return (
    <div className=" w-full  flex items-center justify-center relative overflow-hidden">
     <div className='absolute top-14 right-14 z-50 text-white cursor-pointer' onClick={toggleMute}>
       {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
     </div>
      <div className="relative h-full w-full max-w-3xl">
        <div ref={containerRef} className="h-screen w-full bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={moment?.media}
            className="w-full h-full object-contain"
            playsInline
            muted={isMuted}
            preload="metadata"
            controls={false}
            onClick={handleClick}
          />
        </div>

        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/60 to-transparent text-white">
          <div className="flex items-center gap-3 my-2">
            <div className="w-10 h-10 rounded-full bg-gray-500 overflow-hidden">
              <img className='w-full h-full rounded-full object-cover' src={moment?.author?.profileImage || assets.userDp} alt="" />
            </div>
            <span className="font-semibold text-sm">{moment?.author?.userName}</span>
          </div>
          <p className="text-sm">{moment?.caption}</p>
        </div>

        {/* Action Buttons */}
        <div className="absolute right-4 bottom-30 flex flex-col items-center gap-6 text-white text-xl">
          <button onClick={handleLike} className={`hover:scale-110 transition ${isLiked ? 'text-red-500' : ''}`}>
            <FaHeart /> <span className="text-sm">{moment?.likes?.length || 0}</span>
          </button>
          <button onClick={async ()=>{ await fetchMoment(); setOpenComments(true) }} className="hover:scale-110 transition ">
            <FaComment  /> <span className="text-sm">{moment?.comments?.length || 0}</span>
          </button>
          <button onClick={handleSaved} className={`hover:scale-110 transition ${isSaved ? 'text-blue-500' : ''}`}>
            <FaBookmark />
          </button>
        </div>

      </div>

      <CommentSheet
        open={openComments}
        onClose={async ()=>{ await fetchMoment(); setOpenComments(false) }}
        item={moment}
        type={'moment'}
        onCommentAdded={(updatedMoment)=>{
          const updated = momentData.map(m => m._id === updatedMoment._id ? updatedMoment : m)
          dispatch(setMomentData(updated))
        }}
      />
    </div>
  )
}

export default MomentCard