import React from 'react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const COLS = 12;

const getSeatPrice = (rowLabel) => {
    if (['I', 'J'].includes(rowLabel)) return { type: 'Recliner', price: 400 };
    if (['E', 'F', 'G', 'H'].includes(rowLabel)) return { type: 'Premium', price: 250 };
    return { type: 'Regular', price: 150 };
};

const Seat = ({ label, status, onClick, type }) => {
    const baseStyles = "w-8 h-8 m-1 rounded-t-lg text-xs flex items-center justify-center cursor-pointer transition-all duration-200 border border-white/10";

    const statusStyles = {
        available: "bg-gray-700 hover:bg-primary/50 text-gray-300",
        selected: "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.6)]",
        booked: "bg-gray-800 text-gray-600 cursor-not-allowed opacity-50 border-transparent",
        locked: "bg-red-900/50 text-red-200/50 cursor-not-allowed border-red-900",
        monitor: "bg-yellow-500/20 text-yellow-500 border-yellow-500 animate-pulse" // For own locks if needed
    };

    return (
        <button
            disabled={status === 'booked' || status === 'locked'}
            onClick={onClick}
            className={`${baseStyles} ${statusStyles[status]}`}
            title={`${label} - ${type}`}
        >
            {label}
        </button>
    );
};

const SeatGrid = ({ selectedSeats = [], bookedSeats = [], lockedSeats = {}, userId, onSeatClick }) => {

    const getSeatStatus = (seatLabel) => {
        if (bookedSeats.includes(seatLabel)) return 'booked';

        // Check locks
        const lock = lockedSeats[seatLabel];
        if (lock) {
            if (lock.userId === userId) return 'selected'; // Treated as selected if I hold the lock
            return 'locked';
        }

        // Check local selection (optimistic UI)
        if (selectedSeats.includes(seatLabel)) return 'selected';

        return 'available';
    };

    return (
        <div className="flex flex-col items-center gap-6 overflow-x-auto pb-10">

            {/* Screen */}
            <div className="w-[80%] h-2 bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-8 relative">
                <div className="absolute top-4 w-full text-center text-gray-500 text-sm tracking-[0.2em] uppercase">
                    Screen This Way
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/20 blur-xl"></div>
            </div>

            {/* Grid */}
            <div className="flex flex-col gap-2">
                {ROWS.map((row) => {
                    const { type, price } = getSeatPrice(row);
                    return (
                        <div key={row} className="flex items-center gap-4">
                            <div className="w-8 text-gray-400 font-medium">{row}</div>
                            <div className="flex gap-2">
                                {Array.from({ length: COLS }).map((_, i) => {
                                    const col = i + 1;
                                    const seatLabel = `${row}${col}`;

                                    // Add Gaps for Aisle
                                    const isGap = col === 5 || col === 9;

                                    return (
                                        <div key={seatLabel} className="flex">
                                            {isGap && <div className="w-8" />}
                                            <Seat
                                                label={`${row}${col}`}
                                                status={getSeatStatus(seatLabel)}
                                                onClick={() => onSeatClick(seatLabel, price, type)}
                                                type={`${type} - ₹${price}`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-700 rounded decoration-slice"></div> Available
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div> Selected
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-800 opacity-50 rounded"></div> Booked
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-900/50 rounded"></div> Locked
                </div>
            </div>

        </div>
    );
};

export default SeatGrid;
