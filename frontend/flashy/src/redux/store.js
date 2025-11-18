import {configureStore} from '@reduxjs/toolkit' 
import  userSlice from './userSlice.js'
import  postSlice from './postSlice.js'
import  momentSlice from './momentSlice.js'
import  storySlice from './storySlice.js'
import  notificationSlice from './notificationSlice.js'
const store=configureStore({
    reducer: {
        // your reducers go here
        user:userSlice,
        post:postSlice,
        moment:momentSlice,
        story:storySlice,
        notifications:notificationSlice,
    }
})
export default store