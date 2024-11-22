import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles.css"; // Import the global styles
import backgroundImage from "../assets/curve.png"; // Import your background image

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(""); // Track error message

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsSnapshot = await getDocs(collection(db, "reservations"));
        const reservationsList = reservationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status || "Reservation Pending", // Default to "Reservation Pending" if no status
        }));
        setReservations(reservationsList);
      } catch (err) {
        setError("Error fetching reservations. Please try again later.");
        console.error("Error fetching reservations:", err);
      }
    };
    fetchReservations();
  }, []);

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const reservationRef = doc(db, "reservations", reservationId);
      await updateDoc(reservationRef, { status: newStatus });
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: newStatus }
            : reservation
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div
      className="dashboard-container"
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
        className="dashboard-card"
        style={{
          background: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
          borderRadius: "10px", // Rounded corners for the card
          padding: "20px",
          width: "80%",
          maxWidth: "1000px", // Limit the max width of the form
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", // Soft shadow for the card
        }}
      >
        <h2>Reservations Dashboard</h2>

        {/* Display error message if any */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Name
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Email
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Location
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Date
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {reservation.name}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {reservation.email}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {reservation.branch}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {reservation.date}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {/* RESERVATION STATUS */}
                  <select
                    value={reservation.status}
                    onChange={(e) =>
                      handleStatusChange(reservation.id, e.target.value)
                    }
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="Reservation Pending">Reservation Pending</option>
                    <option value="Reservation Confirmed">Reservation Confirmed</option>
                    <option value="Booking Canceled">Booking Canceled</option>
                    <option value="Event Completed">Event Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
