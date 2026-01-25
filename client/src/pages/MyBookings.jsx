import React, { useEffect, useState } from 'react'
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { getUserBookings } from '../lib/firestore';
import Loading from '../components/Loading';

const MyBookings = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const data = await getUserBookings(user.id);
        // Sort by most recent
        setBookings(data.sort((a, b) => b.bookedAt?.seconds - a.bookedAt?.seconds));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (!isLoaded) return <Loading />;

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (loading) return <Loading />;

  return (
    <div className='min-h-screen bg-[#0f172a] text-white pt-32 px-6 md:px-16 lg:px-40 pb-20'>
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-400">No bookings found</p>
          <a href="/movies" className="text-primary mt-4 inline-block hover:underline">Book a Ticket</a>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {bookings.map((booking) => (
            <div key={booking.id} className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-lg hover:border-primary/50 transition-colors group">
              {/* Left Color Strip */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-purple-500"></div>

              {/* Poster / Image Section */}
              <div className="w-full md:w-32 bg-gray-800 flex items-center justify-center">
                {booking.poster ? (
                  <img src={booking.poster} alt={booking.movieTitle} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <span className="text-4xl">🎬</span>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      {booking.movieTitle || "Movie Ticket"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{booking.theater || "Main Screen"}</p>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs border border-primary/20 font-medium">
                    Confirmed
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Date</p>
                    <p className="text-gray-300 font-medium">{booking.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Time</p>
                    <p className="text-gray-300 font-medium">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Seats</p>
                    <p className="text-white font-semibold">{(booking.seats || []).join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Price</p>
                    <p className="text-white font-semibold">₹{booking.totalPrice}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                  <span>Booking ID: <span className="font-mono text-gray-400">{booking.id.slice(0, 8)}...</span></span>
                  <span>{booking.bookedAt?.toDate().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings