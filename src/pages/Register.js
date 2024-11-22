import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles.css"; // Import the global styles
import backgroundImage from "../assets/curve.png"; // Import your background image

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("customer"); // Add role state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add role (default: customer) to Firestore
      await setDoc(doc(db, "users", user.uid), { email: user.email, role });

      setMessage("Registration successful!");
      navigate("/"); // Redirect to Home Page
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div 
      className="register-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh", // Full height to cover the screen
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
      }}>

        <div
          className="register-card"
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
        <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
        </select>
        <button 
          type="submit" 
          style={{ width: "100%" }}>
            Register
        </button>
      </form>
      {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
