import { MoveLeft, Plus } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import axios from 'axios';
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';

const Editprofile = () => {
    const navigate=useNavigate()
    const {userData}=useSelector(state=>state.user)
    const imageInput=useRef()
    const [frontendImage,setFrontendImage]=useState(userData.profileImage || assets.userDp)
    const [backendImage,setBackendImage]=useState(null)
    const [name,setName]=useState(userData.name || '')
    const [userName,setUserName]=useState(userData.userName || '')
    const [bio,setBio]=useState(userData.bio || '')
    const [profession,setProfession]=useState(userData.profession || '')
    const [gender,setGender]=useState(userData.gender || '')
    const dispatch=useDispatch()
    const [loading,setLoading]=useState(false)

    const handleImage=async(e)=>{
        const file=e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleEditProfile=async()=>{
      setLoading(true)
  try {
    const formData=new FormData()
    formData.append('name',name)
    formData.append('userName',userName)
    formData.append('bio',bio)
    formData.append('gender',gender)
    formData.append('profession',profession)
    if(backendImage){
      formData.append('profileImage',backendImage)
    }
        const result=await axios.post(`${serverUrl}/api/user/editProfile`,formData,{withCredentials:true})
        dispatch(setProfileData(result.data.user))
        dispatch(setUserData(result.data.user))
        setLoading(false)
        navigate(`/profile/${result.data.user.userName}`)
      } catch (error) {
    setLoading(false)
    console.log(error)
  }
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 ">
        <div
          className="flex absolute left-5 top-5 w-10 h-10 rounded-full bg-gray-200 items-center justify-center hover:bg-gray-300"
          onClick={() => navigate(`/profile/${userData.userName}`)}
        >
          <MoveLeft />
        </div>
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Edit Profile
          </h2>

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div
              onClick={() => imageInput.current.click()}
              className="relative cursor-pointer"
            >
              <input
                hidden
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={handleImage}
              />
              <img
                src={frontendImage}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div className="bg-blue-400  h-4 w-4 rounded-full flex items-center justify-center   absolute bottom-3 right-2">
                <Plus color="white" size={15} />
              </div>
            </div>
            <p className="text-sm text-blue-500 mt-2">
              Change Your Profile Picture
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input value={userName}  onChange={(e) => setUserName(e.target.value)}
                type="text"
                placeholder="Enter username"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input value={name}  onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter name"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea value={bio}  onChange={(e) => setBio(e.target.value)}
                rows="3"
                placeholder="Write something about yourself..."
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 min-h-[40px]"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select value={gender}  onChange={(e) => setGender(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profession
              </label>
              <input value={profession}  onChange={(e) => setProfession(e.target.value)}
                type="text"
                placeholder="Enter profession"
                className="p-2 mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-center" onClick={handleEditProfile}>
            <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow">
             {loading?<ClipLoader color='white'/> :'Save Changes'} 
            </button>
          </div>
        </div>
      </div>
    );
};

export default Editprofile