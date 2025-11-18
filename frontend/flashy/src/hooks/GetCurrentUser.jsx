import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData, setFollowing } from "../redux/userSlice";

const GetCurrentUser = () => {
  const dispatch = useDispatch();
  const {storyData}=useSelector(state=>state.story)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
        dispatch(setFollowing(result.data.following));
        } catch (error) {
        if (error.response?.status === 401) {
          console.warn("Not authenticated");
          dispatch(setUserData(null));
        } else {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, [storyData]);

  return null; // This component doesn’t render UI
};

export default GetCurrentUser;
