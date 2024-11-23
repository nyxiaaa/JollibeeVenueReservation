import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from "../firebaseConfig"; // Import the Firebase auth object
import { onAuthStateChanged } from 'firebase/auth'; // Firebase function to track auth state
import { doc, getDoc } from "firebase/firestore"; // Firestore functions to get user data
import { db } from '../firebaseConfig'; // Import Firestore database
import { getAuth, signOut } from "firebase/auth"; // For the logout
import './NavigationBar.css';

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // For tracking login state
  const [isStaff, setIsStaff] = useState(false); // For tracking staff role
  
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true); // User is logged in
        
        // Fetch user role from Firestore to check if the user is staff
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        if (userData && userData.role === 'staff') {
          setIsStaff(true); // Set staff to true if the user is a staff member
        } else {
          setIsStaff(false); // Set staff to false if the user is not staff
        }
      } else {
        setIsLoggedIn(false); // User is logged out
        setIsStaff(false); // Reset staff role if user is logged out
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const handleLogout = async () => {
    // Log out the user
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      // Redirect to login or home page
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <header className="header">
      <a href="/" className="logo">Jollibee</a>

      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/locations">Locations</Link>
        <Link to="/reviews">Reviews</Link>
        {isStaff && <Link to="/dashboard">Dashboard</Link>} {/* Only show if staff */}
        
        {isLoggedIn ? (
          <>
            <Link to="/" onClick={handleLogout}>Logout</Link> {/* Logout action */}
          </>
        ) : (
          <>
            <Link to="/register">Register</Link> {/* Show register when not logged in */}
            <Link to="/login">Login</Link> {/* Show login when not logged in */}
          </>
        )}
      </nav>
    </header>
  );
};

export default NavigationBar;
