import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

const ShareModal = ({ isOpen, onClose, post }) => {
  const { userData } = useSelector(state => state.user)
  const [following, setFollowing] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const chat = useChat(userData?._id)

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true)
    axios.get(`${serverUrl}/api/user/following`, { withCredentials: true })
      .then(res => setFollowing(res.data || []))
      .catch(() => setFollowing([]))
      .finally(() => setLoading(false))
  }, [isOpen])

  const toggle = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  const handleSend = () => {
    if (selected.length === 0) return
    const url = `${window.location.origin}/post/${post._id}`
    const message = `Check out this post: ${url}`
    selected.forEach(id => chat.sendMessage(id, message));
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Send to</h3>
          <button onClick={onClose} className="text-sm text-gray-600">Close</button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="max-h-72 overflow-y-auto mb-4">
            {following.length === 0 ? (
              <div className="text-sm text-gray-500">No followings found</div>
            ) : following.map(u => (
              <div key={u._id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <img src={u.profileImage || '/assets/userDp.avif'} className="w-8 h-8 rounded-full object-cover" alt="" />
                  <div>
                    <div className="font-semibold">{u.userName}</div>
                    <div className="text-xs text-gray-500">{u.name}</div>
                  </div>
                </div>
                <div>
                  <input type="checkbox" checked={selected.includes(u._id)} onChange={() => toggle(u._id)} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded-md border">Cancel</button>
          <button onClick={handleSend} className="px-3 py-1 rounded-md bg-blue-500 text-white">Send</button>
        </div>
      </div>
    </div>
  )
}

export default ShareModal
