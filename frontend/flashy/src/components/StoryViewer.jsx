import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { setStoryData } from '../redux/storySlice'
import StoryCard from './StoryCard'

const StoryViewer = () => {
  const { storyData } = useSelector((state) => state.story)
  const { userName } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // 25 seconds for each story
  const DURATION = 25_000
  const rafRef = useRef(null)
  const startRef = useRef(0)
  const [elapsed, setElapsed] = useState(0)

  const handleStory = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/story/getByUserName/${userName}`, { withCredentials: true })
      // result.data is an array of stories for this user
      if (Array.isArray(result.data) && result.data.length > 0) {
        dispatch(setStoryData(result.data[0]))
      } else {
        dispatch(setStoryData(null))
      }
    } catch (error) {
      console.error('Failed to load story', error)
      dispatch(setStoryData(null))
    }
  }

  useEffect(() => {
    if (userName) handleStory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName])

  // start/stop the 25s timer when storyData changes
  useEffect(() => {
    // cleanup any previous frame
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    if (!storyData) {
      setElapsed(0)
      return
    }

    startRef.current = performance.now()
    const tick = (now) => {
      const e = now - startRef.current
      setElapsed(e)
      if (e >= DURATION) {
        // auto-close
        dispatch(setStoryData(null))
        navigate(-1)
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyData])

  if (!storyData) {
    return (
      <div className='w-full bg-black h-[100vh] flex items-center justify-center text-white'>
        Loading story...
      </div>
    )
  }

  // remaining percent (0-100)
  const remainingPct = Math.max(0, ((DURATION - elapsed) / DURATION) * 100)

  const handleClose = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    dispatch(setStoryData(null))
    navigate(-1)
  }

  return (
    <div className='w-full bg-black h-[100vh] flex items-center justify-center relative'>
      {/* top progress bar */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gray-700/40'>
        <div
          style={{ width: `${remainingPct}%` }}
          className='h-full bg-white transition-all duration-100 linear'
        />
      </div>

      {/* close button */}
      <button
        onClick={handleClose}
        aria-label='Close story'
        className='absolute top-3 right-3 z-50 text-white bg-black/40 p-2 rounded-full hover:bg-black/60'
      >
        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
          <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
        </svg>
      </button>

      <StoryCard />
    </div>
  )
}

export default StoryViewer
