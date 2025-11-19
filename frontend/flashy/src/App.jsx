import React, { useEffect } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import ForgotPass from './components/ForgotPass'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import GetCurrentUser from './hooks/GetCurrentUser'
import GetSuggestedUsers from './hooks/GetSuggestedUsers'
import Profile from './pages/Profile'
import Editprofile from './pages/Editprofile'
import Upload from './pages/Upload'
import GetAllPost from './hooks/GetAllPost'
import ScrollPosts from './pages/ScrollPosts'
import Moments from './pages/Moments'
import GetAllMoments from './hooks/GetAllMoments'
import { MuteProvider } from './contexts/MuteContext'
import StoryCard from './components/StoryCard'
import StoryViewer from './components/StoryViewer'
import Notifications from './pages/Notifications'
import Messages from './pages/Messages'
import Search from './pages/Search'
import SocketListener from './components/SocketListener'
export const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'
const App = () => {
  // Fetch initial data on mount
  const fetchCurrentUser = GetCurrentUser();
  const fetchSuggested = GetSuggestedUsers();
  const fetchAllPosts = GetAllPost();
  const fetchAllMoments = GetAllMoments();

  useEffect(() => {
    if (typeof fetchCurrentUser === "function") fetchCurrentUser();
    if (typeof fetchSuggested === "function") fetchSuggested();
    if (typeof fetchAllPosts === "function") fetchAllPosts();
    if (typeof fetchAllMoments === "function") fetchAllMoments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const{userData,suggestedUsers}=useSelector(state=>state.user)
  return (
    <MuteProvider>
    {userData && <SocketListener />}
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!userData ? <Signin /> : <Navigate to="/" />}
      />
      <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPass /> : <Navigate to="/" />}
      />
      <Route
        path="/profile/:userName"
        element={userData ? <Profile /> : <Navigate to="/signin" />}
      />
      <Route
        path="/editprofile"
        element={userData ? <Editprofile /> : <Navigate to="/signin" />}
      />
      <Route
        path="/moments"
        element={userData ? <Moments /> : <Navigate to="/signin" />}
      />
      <Route
        path="/upload"
        element={userData ? <Upload/> : <Navigate to="/signin" />}
      />
      <Route
        path="/post/:postId"
        element={userData ? <ScrollPosts/> : <Navigate to="/signin" />}
      />
      <Route
        path="/search"
        element={userData ? <Search/> : <Navigate to="/signin" />}
      />
      <Route
        path="/story/:userName"
        element={userData ? <StoryViewer/> : <Navigate to="/signin" />}
      />
      <Route
        path="/notifications"
        element={userData ? <Notifications/> : <Navigate to="/signin" />}
      />
      <Route
        path="/messages"
        element={userData ? <Messages/> : <Navigate to="/signin" />}
      />
    </Routes>
    </MuteProvider>
  );
}

export default App