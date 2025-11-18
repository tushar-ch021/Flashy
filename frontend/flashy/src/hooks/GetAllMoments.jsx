import axios from 'axios';
import React, {  useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';

import { setPostData } from '../redux/postSlice';
import { setMomentData } from '../redux/momentSlice';

function GetAllMoments  () {
    const dispatch=useDispatch()
    const { userData } = useSelector((state) => state.user);
    useEffect(()=>{
        const fetchMomets= async () => {
            try {
                
               const momentRes = await axios.get(`${serverUrl}/api/moment/getAll`, {
          withCredentials: true,
        });
        dispatch(setMomentData(momentRes.data));
               
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchMomets();
    }, [dispatch,userData]);
}

export default GetAllMoments