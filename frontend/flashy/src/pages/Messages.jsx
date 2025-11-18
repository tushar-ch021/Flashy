import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useSelector, useDispatch } from 'react-redux'
import ChatBox from '../components/ChatBox'
import { clearUnreadFrom } from '../redux/notificationSlice'
import { FiArrowLeft } from 'react-icons/fi'
import { useMediaQuery } from '../utils/useMediaQuery'

const Messages = () => {
  const { userData } = useSelector(state => state.user)
  const { unreadMessages } = useSelector(state => state.notifications || { unreadMessages: {} })
  const [activeChat, setActiveChat] = useState(null)
  const [followers, setFollowers] = useState([])
  const dispatch = useDispatch()
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/followers`, { withCredentials: true })
        setFollowers(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    if (userData) fetchFollowers()
  }, [userData])

  // Mobile: if a chat is active show it full screen with a back button
  if (isMobile && activeChat) {
    const follower = followers.find(f => f._id === activeChat)
    return (
      <div className="h-screen flex flex-col">
        <header className="flex items-center gap-3 px-3 py-2 border-b bg-white">
          <button onClick={() => setActiveChat(null)} className="p-1">
            <FiArrowLeft size={20} />
          </button>
          <img src={follower?.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
          <div>
            <div className="font-medium">{follower?.userName}</div>
            <div className="text-xs text-gray-500">Tap back to go to chats</div>
          </div>
        </header>
        <main className="flex-1">
          <ChatBox targetUserId={activeChat} />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r overflow-y-auto p-4 hidden md:block">
        <h3 className="font-semibold mb-3">Chats</h3>
        {followers.map(u => (
          <div key={u._id} className="py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => { setActiveChat(u._id); dispatch(clearUnreadFrom(u._id)) }}>
            <img src={u.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
            <div className="flex-1">
              <div className="font-medium flex items-center gap-2">
                {u.userName}
                {/* unread badge for this user */}
                {unreadMessages && unreadMessages[u._id] > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white rounded-full w-5 h-5 text-xs">{unreadMessages[u._id]}</span>
                )}
              </div>
              <div className="text-sm text-gray-500 truncate">{u.name || ''}</div>
            </div>
          </div>
        ))}
      </aside>

      {/* Mobile: show followers list when no active chat */}
      {isMobile && !activeChat && (
        <div className="w-full overflow-y-auto p-4 md:hidden">
          <h3 className="font-semibold mb-3">Chats</h3>
          {followers.map(u => (
            <div key={u._id} className="py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => { setActiveChat(u._id); dispatch(clearUnreadFrom(u._id)) }}>
              <img src={u.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  {u.userName}
                  {unreadMessages && unreadMessages[u._id] > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white rounded-full w-5 h-5 text-xs">{unreadMessages[u._id]}</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 truncate">{u.name || ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <main className="flex-1 p-4">
        {activeChat ? <ChatBox targetUserId={activeChat} /> : <div className="text-gray-500">Select a chat to start</div>}
      </main>
    </div>
  )
}

export default Messages
