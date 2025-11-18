import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../../App'

const Stories = ({ userName, ProfileImage, story }) => {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [seen, setSeen] = useState(false)
  const [followerStories, setFollowerStories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    try {
      const seenList = JSON.parse(localStorage.getItem('seenStories') || '[]')
      setSeen(seenList.includes(userName))
    } catch (e) {
      setSeen(false)
    }
  }, [userName])

  const handleClick = () => {
    // if adding own story
    if (!story && userName === 'Your Story') {
      navigate('/upload')
      return
    }

    // if opening a story, mark it seen for this userName
    if (story) {
      try {
        const seenList = JSON.parse(localStorage.getItem('seenStories') || '[]')
        if (!seenList.includes(userName)) {
          seenList.push(userName)
          localStorage.setItem('seenStories', JSON.stringify(seenList))
          setSeen(true)
        }
      } catch (e) {
        // ignore storage errors
      }
    }

    if (userName === 'Your Story') navigate(`/story/${userData.userName}`)
    else navigate(`/story/${userName}`)
  }
    useEffect(() => {
      // fetch followers and their stories
      const fetchFollowerStories = async () => {
        setIsLoading(true)
        setLoadError(null)
        try {
          const res = await axios.get(`${serverUrl}/api/user/followers`, { withCredentials: true })
          const followers = res.data || []

          const calls = followers.map(async (f) => {
            try {
              const r = await axios.get(`${serverUrl}/api/story/getByUserName/${f.userName}`, { withCredentials: true })
              // r.data is an array of stories for that user
              if (Array.isArray(r.data) && r.data.length > 0) {
                return { user: f, story: r.data[0] }
              }
              return null
            } catch (e) {
              // ignore per-user errors
              return null
            }
          })

          const results = await Promise.all(calls)
          setFollowerStories(results.filter(Boolean))
        } catch (err) {
          console.error('Failed to load follower stories', err)
          setLoadError(err.message || 'Failed to load stories')
        } finally {
          setIsLoading(false)
        }
      }

      if (userData) fetchFollowerStories()
    }, [userData])

    const StoryCircle = ({ u, s }) => {
      const name = u.userName
      const isSeen = (() => {
        try {
          const seenList = JSON.parse(localStorage.getItem('seenStories') || '[]')
          return seenList.includes(name)
        } catch (e) {
          return false
        }
      })()

      const onOpen = () => {
        try {
          const seenList = JSON.parse(localStorage.getItem('seenStories') || '[]')
          if (!seenList.includes(name)) {
            seenList.push(name)
            localStorage.setItem('seenStories', JSON.stringify(seenList))
          }
        } catch (e) {}
        navigate(`/story/${name}`)
      }

      return (
        <div className="flex flex-col items-center cursor-pointer" onClick={onOpen}>
          <div className={`relative p-[2px] rounded-full ${!isSeen ? 'bg-gradient-to-tr from-fuchsia-500 via-orange-400 to-yellow-500' : 'border border-gray-300'}`}>
            <div className="h-16 w-16 flex items-center justify-center bg-white rounded-full overflow-hidden">
              <img className="object-cover w-full h-full" src={u.profileImage || assets.userDp} alt={u.userName} />
            </div>
          </div>
          <span className="text-sm text-gray-600 truncate mt-1 max-w-[70px] text-center">{u.userName}</span>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-6 overflow-x-auto flex gap-4 no-scrollbar">
        {/* Your story cell */}
        <div className="flex flex-col items-center">
          <div onClick={handleClick} className={`relative p-[2px] rounded-full ${story && !seen ? 'bg-gradient-to-tr from-fuchsia-500 via-orange-400 to-yellow-500' : 'border border-gray-300'}`}>
            <div className="h-16 w-16 flex items-center justify-center bg-white rounded-full overflow-hidden">
              <img className="object-cover w-full h-full" src={ProfileImage || assets.userDp} alt="Your Story" />
              {!userData?.story && userName === 'Your Story' && (
                <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-[2px]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-600 truncate mt-1">{!story && userName === 'Your Story' ? 'Add Story' : userName === 'Your Story' ? 'Your Story' : userName}</span>
        </div>

        {/* Followers stories */}
        {isLoading ? (
          <div className="flex items-center px-4">Loading stories...</div>
        ) : loadError ? (
          <div className="text-sm text-red-500 px-4">Failed to load stories</div>
        ) : followerStories.length === 0 ? (
          <div className="text-sm text-gray-500 px-4">No stories from followers</div>
        ) : (
          followerStories.map(({ user, story: s }) => (
            <StoryCircle key={user._id} u={user} s={s} />
          ))
        )}
      </div>
    )
}

export default Stories
