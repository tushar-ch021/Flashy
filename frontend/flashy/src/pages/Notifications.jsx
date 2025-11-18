import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearNotifications } from '../redux/notificationSlice'

const Notifications = () => {
  const { list } = useSelector(state => state.notifications)
  const dispatch = useDispatch()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button className="text-sm text-blue-600" onClick={() => dispatch(clearNotifications())}>Clear</button>
      </div>
      <div className="bg-white rounded shadow p-4">
        {list.length === 0 && <div className="text-gray-500">No notifications yet.</div>}
        <ul>
          {list.map((n, i) => (
            <li key={i} className="py-2 border-b last:border-b-0">{n.text}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Notifications
