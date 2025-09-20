import { MenuIcon, SearchIcon, TicketCheck, TicketCheckIcon, TicketIcon, TicketPercentIcon, TicketPlus, XIcon } from 'lucide-react'
import React, { useState } from 'react';
import { assets } from '../assets/assets'; 
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const [isopen, setIsOpen] = useState(false)
  const {user}=useUser();
  const{openSignIn}=useClerk();
  const navigate=useNavigate();

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
      <Link to="/">
        <img src={assets.logo} alt="Logo" className='w-36 h-auto'/>
      </Link>
      {/* Desktop Menu */}
      <div className='hidden md:flex flex-row items-center gap-8 md:px-8 py-3 md:rounded-full backdrop-blur bg-white/10 md:border border-gray-300/20 transition-all duration-300'>
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/">Theatres</Link>
        <Link to="/">Releases</Link>
        <Link to="/favourite">Favourites</Link>
      </div>
      {/* Mobile Menu */}
      {isopen && (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-black/90 backdrop-blur max-md:h-screen md:hidden transition-all duration-300'>
          <XIcon className='absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setIsOpen(false)} />
          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Home</Link>
          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/movies">Movies</Link>
          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Theatres</Link>
          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Releases</Link>
          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/favourite">Favourites</Link>
        </div>
      )}
      <div className='flex items-center gap-8'>
        <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer'/>
        {
          !user?(
        <button onClick={openSignIn} className='px-4 py-1 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>
        ):(
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="My Bookings" labelIcon={<TicketPlus width={15}/>} onClick={()=>navigate('/my-bookings')}/>
            </UserButton.MenuItems>
          </UserButton>
        )
        
        }
      </div>
      <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={() => setIsOpen(true)} />
    </div>
  )
}
export default Navbar