import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    // unread messages keyed by senderId: { [senderId]: count }
    unreadMessages: {}
  },
  reducers: {
    addNotification(state, action) {
      const notif = action.payload
      state.list.unshift(notif)
      // If this is a message notification, increment unread counter for the sender
      if (notif?.type === 'message' && notif.from) {
        const key = notif.from
        state.unreadMessages[key] = (state.unreadMessages[key] || 0) + 1
      }
    },
    setNotifications(state, action) {
      state.list = action.payload
    },
    clearNotifications(state) {
      state.list = []
    },
    // clear unread messages from a specific user (when opening chat)
    clearUnreadFrom(state, action) {
      const userId = action.payload
      if (state.unreadMessages[userId]) delete state.unreadMessages[userId]
    },
    clearAllUnreadMessages(state) {
      state.unreadMessages = {}
    }
  }
})

export const { addNotification, setNotifications, clearNotifications, clearUnreadFrom, clearAllUnreadMessages } = notificationSlice.actions
export default notificationSlice.reducer
