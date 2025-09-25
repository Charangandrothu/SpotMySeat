import React from 'react'
import {dummyShowsData} from '../assets/assets'
import MovieCard from '../components/MovieCard'
const Movies = () => {
  return  dummyShowsData.length>0 ?(
    <div>
      <h1>Now Showing</h1>
      <div>
        {dummyShowsData.map(()=>(
          <MovieCard movie={movie} key={movie.id}/>
        ))}
      </div>
    </div>
  ):(
    <div>
      <h1>No Movies</h1>
    </div>
  )
}

export default Movies