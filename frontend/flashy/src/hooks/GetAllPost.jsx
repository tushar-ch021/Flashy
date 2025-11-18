import axios from 'axios';
import React, {  useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';

import { setPostData } from '../redux/postSlice';
import { setMomentData } from '../redux/momentSlice';

function GetAllPost  () {
    const dispatch=useDispatch()
    const { userData } = useSelector((state) => state.user);
    useEffect(()=>{
        const fetchPost= async () => {
            try {
                const postRes = await axios.get(`${serverUrl}/api/post/getAll`,{withCredentials:true});
               dispatch(setPostData(postRes.data));
               const momentRes = await axios.get(`${serverUrl}/api/moment/getAll`, {
          withCredentials: true,
        });
        dispatch(setMomentData(momentRes.data));
               
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchPost();
    }, [dispatch,userData]);
}

export default GetAllPost