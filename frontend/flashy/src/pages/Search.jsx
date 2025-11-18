import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useSelector } from 'react-redux'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Search = () => {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(false)
  const { userData } = useSelector(s => s.user)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${serverUrl}/api/user/suggested`, { withCredentials: true })
        setUsers(res.data || [])
        setFiltered(res.data || [])
      } catch (err) {
        setUsers([])
        setFiltered([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) return setFiltered(users)
    setFiltered(users.filter(u => (u.userName || '').toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q)))
  }, [query, users])

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search users by name or username"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded shadow">
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No users found.</div>
            ) : (
              filtered.map(u => (
                <div key={u._id} className="p-3 flex items-center gap-3 border-b last:border-b-0 cursor-pointer" onClick={() => navigate(`/profile/${u.userName}`)}>
                  <img src={u.profileImage || assets.userDp} className="w-10 h-10 rounded-full object-cover" alt="" />
                  <div>
                    <div className="font-semibold">{u.userName}</div>
                    <div className="text-xs text-gray-500">{u.name}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
