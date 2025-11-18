import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { addNotification } from '../redux/notificationSlice'

const SocketListener = () => {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const chat = useChat(userData?._id)

  useEffect(() => {
    if (!userData?._id) return
    // Register notification handler once
    chat.onNotification((notif) => {
      dispatch(addNotification(notif))
    })
    // no cleanup here: useChat handles socket disconnect
  }, [userData?._id])

  return null
}

export default SocketListener
