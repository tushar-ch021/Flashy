import { createSlice } from "@reduxjs/toolkit";
const momentSlice=createSlice({
    name:'moment',
    initialState:{
        momentData:[],
        
    },
    reducers:{
        setMomentData:(state,action)=>{
            state.momentData=action.payload
        },
       
    }
})
export const { setMomentData} = momentSlice.actions;
export default momentSlice.reducer;