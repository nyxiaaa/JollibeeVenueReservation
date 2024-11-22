import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles.css"; // Import the global styles
import backgroundImage from "../assets/curve.png"; // Import your background image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate("/"); // Redirect to Home after login
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div 
      className="login-container"
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
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button 
            type="submit" 
            style={{ width: "100%" }}>
              Login
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
