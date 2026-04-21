🎬 SpotMySeat — Real-Time Movie Ticket Booking 

SpotMySeat is a real-time movie ticket booking web application designed to handle high-concurrency seat selection. It ensures that multiple users cannot book the same seat at the same time by implementing a seat-locking mechanism using Firebase transactions / real-time updates.

 

✅ Browse Movies & Show Timings
✅ View Seat Layout (Available / Locked / Booked)
✅ Real-Time Seat Locking (No Double Booking)
✅ Secure Booking Confirmation
✅ User Authentication (Login / Signup)
✅ Booking History
✅ Mobile Responsive UI

🧠 Problem it Solves

In traditional ticket booking systems, if two users select the same seat simultaneously, both may think they booked it.

SpotMySeat solves this by:

Locking seats in real time

Preventing other users from selecting locked seats

Confirming seats only after successful payment/booking simulation

🛠️ Tech Stack
Frontend

React.js

JavaScript

CSS / Tailwind CSS 

Backend / Database

Firebase Firestore (Real-time Database)

Firebase Authentication

Firebase Transactions (Seat Lock System)

🔒 Seat Locking System (Core Logic)

SpotMySeat uses a real-time locking concept:

📌 When a user selects a seat:
✅ Seat status becomes LOCKED for that user
✅ Other users immediately see it as unavailable

📌 When the booking is confirmed:
✅ Seat status becomes BOOKED permanently

📌 If user leaves / timeout:
✅ Seat lock can be released (optional enhancement)

📂 Project Structure
spotmyseat/
│── src/
│   ├── components/
│   ├── pages/
│   ├── firebase/
│   ├── utils/
│   ├── App.js
│   ├── index.js
│── public/
│── package.json
│── README.md

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/spotmyseat.git
cd spotmyseat

2️⃣ Install Dependencies
npm install

3️⃣ Setup Firebase

Create a Firebase project and enable:

✅ Firestore Database
✅ Firebase Authentication

Then add your Firebase config in:

📌 src/firebase/firebaseConfig.js

Example:

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

4️⃣ Run the Project
npm start


Now open:
👉 http://localhost:3000

✅ Future Enhancements

✨ Payment Integration (Razorpay / Stripe)
✨ Auto Seat Unlock after timeout
✨ Admin Panel (Add Movies, Shows, Prices)
✨ QR Code Ticket Generation
✨ Notification / Confirmation Email

👨‍💻 Author

Gandrothu Venkata Siva Sai Charan
B.Tech (ECE) | SRKR Engineering College
💡 Interested in Web Development, Firebase, and Real-Time Applications

⭐ Support

If you like this project, give it a ⭐ on GitHub!
