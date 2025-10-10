import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const DateSelect = ({ id }) => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  // ✅ Generate dates: today + next 3 days
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 4; i++) {
      const nextDate = new Date(today)
      nextDate.setDate(today.getDate() + i)
      const iso = nextDate.toISOString().split('T')[0] // "2025-10-09"
      dates.push(iso)
    }
    return dates
  }

  const dates = generateDates()

  const onBookHandler = () => {
    if (!selected) {
      return toast('Please select a date')
    }
    navigate(`/movies/${id}/${selected}`)
    scrollTo(0, 0)
  }

  return (
    <div id='dateSelect' className='pt-30'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-10
        relative p-8 bg-primary/10 border border-primary/20 rounded-lg'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle />
        <div>
          <p className='text-lg font-semibold'>Choose Date</p>
          <div className='flex items-center gap-6 text-sm mt-4'>
            <ChevronLeftIcon width={28} />
            <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
              {dates.map((date) => (
                <button
                  onClick={() => setSelected(date)}
                  key={date}
                  className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer
                    ${selected === date
                      ? 'bg-rose-700 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                    }`}
                >
                  <span>{new Date(date).getDate()}</span>
                  <span>{new Date(date).toLocaleDateString('en-US', { month: 'short' })}</span>
                </button>
              ))}
            </span>
            <ChevronRightIcon width={28} />
          </div>
        </div>
        <button
          onClick={onBookHandler}
          className='bg-rose-700 text-white px-8 py-2 mt-6 rounded hover:bg-rose/90 transition-all cursor-pointer'
        >
          Book Now
        </button>
      </div>
    </div>
  )
}

export default DateSelect
