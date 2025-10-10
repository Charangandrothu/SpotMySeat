import React from 'react'
import {dummyShowsData} from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
const Favourite = () => {
  return  dummyShowsData.length>0 ?(
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-36 xl:px-44
    overflow-hidden min-h-[80vh]'>

      <BlurCircle top="70px" left="0px"/>
      <BlurCircle bottom="60px" right="50px"/>
      <h1 className='text-lg font-medium my-4'>Your Favourite Movies</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
        {dummyShowsData.map((movie)=>(
          <MovieCard movie={movie} key={movie.id}/>
        ))}
      </div>
    </div>
  ):(
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No Movies Available</h1>
    </div>
  )
}

export default Favourite