import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, CameraIcon, ClockIcon, MonitorCheck, MonitorPlay, MoveIcon } from 'lucide-react'
import backgroundImage from '../assets/backgroundimage.jpg' // <-- Import
import { useNavigate } from 'react-router-dom'
import  './HeroSection.css';
const HeroSection = () => {

    const navigate=useNavigate();

  return (
    <div
      className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen'
      style={{ backgroundImage: `url(${backgroundImage})` }} // <-- Use here
    >
      <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>
        They Call Him <br/> OG
      </h1>
      <div className='flex items-center gap-4 text-gray-300'>
        <span>Action | Drama</span>
        <div className='flex items-center gap-1'>
          <CalendarIcon className='w-4.5 h-4.5'/>2025
        </div>
        <div className='flex items-center gap-1'>
          <ClockIcon className='w-4.5 h-4.5'/>2h 29m
        </div>
      </div>
      <p className='max-w-md text-gray-300'>OG revolves around a gangster named Ojas Gambheera 
        who returns to Mumbai following his ten year disappearance, to kill another crime boss, Omi Bhau.</p>
        <button onClick={() => navigate('/movies')}
className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 transition-all duration-200 rounded-full font-medium cursor-pointer text-white hover:shake"
>        
        Explore Movies
        <ArrowRight className="w-5 h-5" />
        </button>
        <button onClick={() => window.open('https://www.youtube.com/watch?v=7Y5q41D8_hs')}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 
        hover:bg-red-700 active:scale-95 transition-all duration-200 
        rounded-full font-medium cursor-pointer text-white hover:shake"

        >
        View Trailer
        <MonitorPlay className="w-5 h-5" />
        </button>
    </div>
    
  )
}

export default HeroSection