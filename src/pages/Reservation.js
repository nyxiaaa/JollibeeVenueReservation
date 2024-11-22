import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Import Firebase auth and db
import { Link } from "react-router-dom"; // Import Link from React Router for navigation
import "../styles.css"; // Import the global styles
import backgroundImage from "../assets/curve.png"; // Import your background image

const Reservation = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState("");
  const [email, setEmail] = useState(""); // Add email state
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in

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
      addDoc(collection(db, "reservations"), {
        name,
        email, 
        branch, 
        date,
        partySize,
      });
      setMessage("Reservation made successfully!");
      setName(""); // Clear fields after successful reservation
      setDate("");
      setPartySize("");
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ margin: "10px 0", padding: "10px", width: "100%" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
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
              value={branch}
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ margin: "10px 0", padding: "10px", width: "100%" }}
            />
            <input
              type="number"
              placeholder="Party Size"
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
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
