import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClockIcon, CalendarIcon, Loader2 } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

import Loading from '../components/Loading';
import SeatGrid from '../components/SeatGrid';
import { getMovies, subscribeToShowSeats, lockSeat, confirmBooking } from '../lib/firestore';
import { dummyShowsData } from '../assets/assets';

const SeatLayout = () => {
  const { id, date } = useParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  const [movie, setMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(true);

  const [lockedSeats, setLockedSeats] = useState({});
  const [bookedSeats, setBookedSeats] = useState([]);

  const [mySeats, setMySeats] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movies = await getMovies();
        let found = movies.find(m => m.id === id || m._id === id);

        // Fallback to dummy data if not found in Firestore (e.g. empty DB)
        if (!found) {
          found = dummyShowsData.find(m => m._id === id || m.id === id);
        }

        if (found) setMovie(found);
      } catch (error) {
        console.error("Failed to fetch movie", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const showId = useMemo(() => {
    return selectedTime ? `${id}_${date}_${selectedTime}` : null;
  }, [id, date, selectedTime]);

  useEffect(() => {
    if (!showId) return;

    setMySeats([]);

    const unsubscribe = subscribeToShowSeats(showId, ({ lockedSeats, bookedSeats }) => {
      setLockedSeats(lockedSeats);
      setBookedSeats(bookedSeats);
    });

    return () => unsubscribe();
  }, [showId]);

  const handleSeatClick = async (seatLabel) => {
    if (!isSignedIn) {
      toast.error("Please sign in to select seats");
      return;
    }

    if (mySeats.includes(seatLabel)) {
      setMySeats(prev => prev.filter(s => s !== seatLabel));
      return;
    }

    try {
      if (bookedSeats.includes(seatLabel)) return;

      await lockSeat(showId, seatLabel, user.id);
      setMySeats(prev => [...prev, seatLabel]);
      toast.success(`Seat ${seatLabel} selected`);
    } catch (error) {
      toast.error(error.message || "Could not select seat");
    }
  };

  const handleBooking = async () => {
    if (mySeats.length === 0) return;
    setIsBooking(true);

    try {
      const totalPrice = mySeats.reduce((acc, label) => {
        const row = label.charAt(0);
        let price = 150;
        if (['E', 'F', 'G', 'H'].includes(row)) price = 250;
        if (['I', 'J'].includes(row)) price = 400;
        return acc + price;
      }, 0);

      await confirmBooking(showId, mySeats, user.id, totalPrice, {
        movieTitle: movie?.title || "Unknown Movie",
        date,
        time: selectedTime,
        poster: movie?.poster_path || ""
      });

      toast.success("Booking Confirmed! 🎟️");
      navigate('/my-bookings');
    } catch (error) {
      console.error(error);
      toast.error("Booking Failed. Try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <Loading />;
  if (!movie) return <div className="text-center text-white pt-20">Movie not found</div>;

  return (
    <div className='min-h-screen bg-[#0f172a] text-white pt-24 px-6 md:px-16 lg:px-40 pb-20'>
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {movie.title}
        </h1>
        <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
          <div className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {date}</div>
          <div className="bg-primary/20 px-2 py-0.5 rounded text-primary text-xs border border-primary/20">
            {movie.language || "English"}
          </div>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-12'>
        <div className='w-full lg:w-64 flex-shrink-0 space-y-6'>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Select Time</h3>
            <div className='flex flex-wrap gap-2'>
              {["10:00", "13:00", "16:00", "19:00", "22:00"].map((time, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTime(time)}
                  className={`flex items-center gap-2 px-4 py-3 w-full rounded-lg transition-all duration-200 border ${selectedTime === time
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-gray-800/50 hover:bg-gray-800 border-white/5 text-gray-400"
                    }`}
                >
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{time}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 space-y-2 text-sm text-gray-400">
              <div className="flex justify-between"><span>Regular (A-D)</span> <span className="text-white">₹150</span></div>
              <div className="flex justify-between"><span>Premium (E-H)</span> <span className="text-white">₹250</span></div>
              <div className="flex justify-between"><span>Recliner (I-J)</span> <span className="text-white">₹400</span></div>
            </div>
          </div>
        </div>

        <div className='flex-grow'>
          {selectedTime ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SeatGrid
                userId={user?.id}
                selectedSeats={mySeats}
                lockedSeats={lockedSeats}
                bookedSeats={bookedSeats}
                onSeatClick={handleSeatClick}
              />
              <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-white/10 p-4 z-50">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Selected Seats</p>
                    <p className="font-semibold text-white">{mySeats.join(', ') || '-'}</p>
                  </div>
                  {isSignedIn ? (
                    <button
                      disabled={mySeats.length === 0 || isBooking}
                      onClick={handleBooking}
                      className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                                   text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-primary/25 transition-all
                                   flex items-center gap-2"
                    >
                      {isBooking && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isBooking ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  ) : (
                    <SignInButton mode="modal">
                      <button className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200">
                        Sign in to Book
                      </button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-white/5">
              <p className="text-gray-500">Select a time to view availability</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;