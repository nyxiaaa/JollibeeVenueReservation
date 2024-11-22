import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Import Firebase auth and db
import { Link } from "react-router-dom"; // Import Link from React Router for navigation
import "../styles.css"; // Import the global styles
import backgroundImage from "../assets/curve.png"; // Import your background image

const Reservation = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in

  const branchRef = useRef(); 
  const nameRef = useRef();
  const dateRef = useRef();
  const partySizeRef = useRef();
  const emailRef = useRef();

  useEffect(() => {
    const checkUserAuth = () => {
      const user = auth.currentUser;
      if (user) {
        setIsLoggedIn(true);
        setEmail(user.email); // Automatically populate email if the user is logged in
      } else {
        setIsLoggedIn(false);
        setEmail(""); // Clear email if not logged in
      }
    };

    checkUserAuth(); // Check if the user is logged in when the component mounts
  }, []);

  const handleReservation = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage("Please log in to make a reservation.");
      return; // Don't proceed with reservation if not logged in
    }

    try {
      const ref = collection(db, "reservations");
      const reservationInfo = {name: nameRef.current.value, email: email, branch: branchRef.current.value, date: dateRef.current.value, partySize: partySizeRef.current.value}
      addDoc(ref, reservationInfo);
      setMessage("Reservation made successfully!");
      nameRef.current.value = ""; // Clear fields after successful reservation
      dateRef.current.value = "";
      partySizeRef.current.value = "";
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div
      className="reservation-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh", // Full height to cover the screen
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
      }}
    >
      <div
        className="reservation-card"
        style={{
          background: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
          borderRadius: "10px", // Rounded corners for the card
          padding: "20px",
          width: "80%",
          maxWidth: "400px", // Limit the max width of the form
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", // Soft shadow for the card
        }}
      >
        <h2>Make a Reservation</h2>

        {/* Show message if not logged in */}
        {!isLoggedIn ? (
          <>
            <p>Login is required to make a reservation.</p>
            <div>
              <Link to="/register">
                <button
                  style={{
                    padding: "10px 20px",
                    margin: "10px",
                    width: "100px",
                  }}
                >
                  Register
                </button>
              </Link>
              <Link to="/login">
                <button
                  style={{
                    padding: "10px 20px",
                    margin: "10px",
                    width: "100px",
                  }}
                >
                  Log In
                </button>
              </Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleReservation}>
            <input
              type="text"
              placeholder="Name"
              ref = {nameRef}
              required
              style={{ margin: "10px 0", padding: "10px", width: "100%" }}
            />
            <input
              type="email"
              placeholder="Email"
              ref = {emailRef}
              readOnly // Make the email field read-only since it’s auto-populated
              style={{
                margin: "10px 0",
                padding: "10px",
                width: "100%",
                backgroundColor: "#f0f0f0",
                cursor: "not-allowed",
              }}
            />
            
            <select
              type="branch"
              placeholder="Branch"
              ref = {branchRef}
              readOnly // Make the email field read-only since it’s auto-populated
              style={{
                margin: "10px 0",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="Jollibee Kamuning">Jollibee Kamuning</option>
              <option value="Jollibee Ortigas">Jollibee Ortigas</option>
              <option value="Jollibee Makati">Jollibee Makati</option>
            </select>
            <input
              type="date"
              ref={dateRef}
              required
              style={{ margin: "10px 0", padding: "10px", width: "100%" }}
            />
            <input
              type="number"
              placeholder="Party Size"
              ref={partySizeRef}
              required
              style={{ margin: "10px 0", padding: "10px", width: "100%" }}
            />
            <button type="submit" style={{ width: "100%" }}>
              Reserve
            </button>
          </form>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Reservation;
