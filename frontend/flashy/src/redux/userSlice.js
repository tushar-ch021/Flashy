import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:'user',
    initialState:{
        userData:null,
        suggestedUsers:null,
        profileData:null,
        following:[],
        savedPosts: [],
  savedMoments: [],

    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
        setProfileData:(state,action)=>{
            state.profileData=action.payload
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUsers=action.payload
        },
        setFollowing:(state,action)=>{
            state.following=action.payload
        },
        toggleFollow:(state,action)=>{
            const targetUserId=action.payload
            if(state.following.includes(targetUserId)){
                state.following=state.following.filter(id=>id!=targetUserId)
            }
            else{
                state.following.push(targetUserId)
            }
        },
        toggleSavedPost: (state, action) => {
    const postId = action.payload;
    if (state.savedPosts.some(p => p._id === postId)) {
      state.savedPosts = state.savedPosts.filter(p => p._id !== postId);
    } else {
      state.savedPosts.push({ _id: postId }); // optimistic
    }
  },
  toggleSavedMoment: (state, action) => {
    const momentId = action.payload;
    if (state.savedMoments.some(m => m._id === momentId)) {
      state.savedMoments = state.savedMoments.filter(m => m._id !== momentId);
    } else {
      state.savedMoments.push({ _id: momentId }); // optimistic
    }
  },
    }
})
export const { toggleFollow,toggleSavedMoment,toggleSavedPost,setUserData,setFollowing, setSuggestedUsers,setProfileData } = userSlice.actions;
export default userSlice.reducer;