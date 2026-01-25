import {
    collection,
    getDocs,
    doc,
    onSnapshot,
    runTransaction,
    writeBatch,
    query,
    where,
    serverTimestamp,
    getDoc
} from "firebase/firestore";
import { db } from "./firebase";

// --- Caching Constants ---
const CACHE_KEY_MOVIES = "movies_cache";
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// --- 1. Fetching Movies (with Caching) ---
export const getMovies = async () => {
    // Check Local Storage first
    const cachedData = localStorage.getItem(CACHE_KEY_MOVIES);
    if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
            console.log("Serving movies from cache");
            return data;
        }
    }

    // Fetch from Firestore if cache expired or missing
    console.log("Fetching movies from Firestore");
    const querySnapshot = await getDocs(collection(db, "movies"));
    const movies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Update Cache
    if (movies.length > 0) {
        localStorage.setItem(CACHE_KEY_MOVIES, JSON.stringify({
            data: movies,
            timestamp: Date.now()
        }));
    }

    return movies;
};

// --- 2. Real-time Show Data (Locks & Bookings) ---
export const subscribeToShowSeats = (showId, onUpdate) => {
    const locksRef = collection(db, "shows", showId, "locks");
    const bookingsRef = collection(db, "bookings");
    const qBookings = query(bookingsRef, where("showId", "==", showId));

    let locksMap = {};
    let bookedList = [];

    const notify = () => {
        onUpdate({
            lockedSeats: locksMap,
            bookedSeats: bookedList
        });
    };

    const unsubLocks = onSnapshot(locksRef, (snapshot) => {
        const now = Date.now();
        const newLocks = {};
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.expiresAt > now) {
                newLocks[doc.id] = data;
            }
        });
        locksMap = newLocks;
        notify();
    });

    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
        const allBooked = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.seats && Array.isArray(data.seats)) {
                allBooked.push(...data.seats);
            }
        });
        bookedList = allBooked;
        notify();
    });

    return () => {
        unsubLocks();
        unsubBookings();
    };
};

// --- 3. Locking a Seat (Transaction) ---
export const lockSeat = async (showId, seatLabel, userId) => {
    const seatLockRef = doc(db, "shows", showId, "locks", seatLabel);

    await runTransaction(db, async (transaction) => {
        const lockDoc = await transaction.get(seatLockRef);
        const now = Date.now();

        if (lockDoc.exists()) {
            const data = lockDoc.data();
            if (data.expiresAt > now && data.userId !== userId) {
                throw new Error("Seat is already locked by another user.");
            }
        }

        const expiresAt = now + 2 * 60 * 1000;

        transaction.set(seatLockRef, {
            userId,
            expiresAt,
            seatLabel
        });
    });
};

// --- 4. Confirm Booking (Batch Write) ---
// Updated to accept metadata for rich booking history
export const confirmBooking = async (showId, seats, userId, totalPrice, metadata = {}) => {
    const batch = writeBatch(db);
    const bookingRef = doc(collection(db, "bookings"));

    batch.set(bookingRef, {
        showId,
        userId,
        seats,
        totalPrice,
        bookedAt: serverTimestamp(),
        status: "confirmed",
        ...metadata // Store movie title, date, time etc.
    });

    seats.forEach(seatLabel => {
        const lockRef = doc(db, "shows", showId, "locks", seatLabel);
        batch.delete(lockRef);
    });

    await batch.commit();
    return bookingRef.id;
};

// --- 5. Fetch User Bookings ---
export const getUserBookings = async (userId) => {
    const q = query(collection(db, "bookings"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
