import React from 'react'
import LeftHome from '../components/LeftHome'
import Feed from '../components/Feed'
import RightHome from '../components/RightHome'

const Home = () => {
  return (
     <div className="h-screen w-full flex justify-between bg-gray-50">
      {/* Left Sidebar */}
      <div className="hidden md:flex w-60 border-r border-gray-200 bg-white fixed left-0 top-0 h-full shadow-lg">
        <LeftHome />
      </div>

      {/* Feed (scrollable) */}
      <div className="flex-1 md:mr-19 overflow-y-auto">
        <Feed />
      </div>

      {/* Right Sidebar */}
      <div className="hidden md:flex w-84 border-l border-gray-200 bg-white fixed right-4 top-0 h-full shadow-lg">
        <RightHome />
      </div>
    </div>
  )
}

export default Home