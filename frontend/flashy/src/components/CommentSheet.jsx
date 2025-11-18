import React, { useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { assets } from '../assets/assets'
import { X } from 'lucide-react'
import { getRelativeTime } from './time'

const CommentSheet = ({ open, onClose, item, onCommentAdded, type = 'moment' }) => {
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const comments = useMemo(() => (item?.comments || []).slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)), [item])
  if (!open) return null

  const handleSubmit = async () => {
    try {
      const url = type === 'moment' ? `${serverUrl}/api/moment/comment` : `${serverUrl}/api/post/comment/${item._id}`
      const payload = type === 'moment' ? { message, momentId: item._id } : { message, postId: item._id }
      const res = await axios.post(url, payload, { withCredentials: true })
      if (res.data) {
        onCommentAdded(res.data)
        setMessage('')
      }
    } catch (err) {
      console.error('Comment submit error', err.response?.data || err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full md:w-[640px] rounded-t-2xl md:rounded-2xl p-4 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Comments</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black"><X/></button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c._id} className="flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    onClose();
                    navigate(`/profile/${c.author?.userName}`);
                  }}
                >
                  <img
                    className="object-cover w-full h-full"
                    src={c.author?.profileImage || assets.userDp}
                    alt=""
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      className=" text-sm hover:underline"
                      onClick={() => {
                        onClose();
                        navigate(`/profile/${c.author?.userName}`);
                      }}
                    >
                      {c.author?.userName || 'user'}
                    </button>
                    <span className="text-xs text-gray-500">{getRelativeTime(c.createdAt)}</span>
                  </div>

                  <div className="text-sm text-white mt-1">{c.message}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No comments yet</div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <img
            src={item?.author?.profileImage || assets.userDp}
            alt="you"
            className="w-9 h-9 rounded-full object-cover"
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 text-black border rounded-full px-4 py-2 text-sm bg-gray-50 focus:outline-none"
            placeholder="Add a comment..."
          />
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-full">Send</button>
        </div>
      </div>
    </div>
  )
}

export default CommentSheet
