import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import { PlayCircleIcon } from 'lucide-react'
import BlurCircle from './BlurCircle'

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

  // Handle click → redirect
  const handleTrailerClick = (trailer) => {
    window.open(trailer.videoUrl, '_blank') // opens in new tab
    // OR use navigate() if you want internal routing
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      {/* Title */}
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailers
      </p>
      <BlurCircle />

      {/* Thumbnails Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 mt-8 max-w-4xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            onClick={() => handleTrailerClick(trailer)}
            className="relative cursor-pointer transition duration-300 transform rounded-lg overflow-hidden hover:scale-115"
          >
            {/* Thumbnail */}
            <img
              src={trailer.image}
              alt="trailer"
              className="w-full h-24 sm:h-28 md:h-32 object-cover brightness-75"
            />

            {/* Play Icon */}
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-6 h-6 md:w-10 md:h-10 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrailerSection
