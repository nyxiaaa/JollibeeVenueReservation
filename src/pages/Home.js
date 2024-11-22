import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "../styles.css"; // Import the global styles
import backgroundImage from "../assets/background.png";

const Home = () => {
  const [user, setUser] = useState(null); // To store user information
  const [isStaff, setIsStaff] = useState(false); // To check if user is staff
  const [loading, setLoading] = useState(true); // To show loading until data is fetched

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Get user's role from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();

        // Set user and role
        setUser(currentUser);
        setIsStaff(userData.role === "staff");
      } else {
        setUser(null);
        setIsStaff(false);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading while we fetch data
  }

  return (
    <div
      className="home-container"
      style={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Simple White Card*/}
      <div
        className="card"
        style={{
          background: "white", // Solid white background for the card
          borderRadius: "15px",
          padding: "40px",
          width: "80%",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.6)", // Soft shadow for depth
        }}
      >
      
         {/* Glass Effect - Covers the whole background */}
         <div className="glass"></div>
        
        <h1>Welcome to the Birthday Party Reservation Portal!</h1>
        <p>
          Make your next birthday celebration memorable! Browse, book, and
          reserve the best birthday party spots right here.
        </p>
        <br />
        {/* Button to make a reservation */}
        <Link to="/reserve">
          <button className="action-btn">Make Reservation</button>
        </Link>

        {user && isStaff && (
          <div style={{ marginTop: "20px" }}>
            <Link to="/dashboard">
              <button className="action-btn">Go to Dashboard</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
