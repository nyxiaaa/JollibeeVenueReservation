import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firebase configuration
import backgroundImage from "../assets/curve.png"; // Import your background image
import { Link } from "react-router-dom";
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { getDoc } from 'firebase/firestore';
import AddLocationModal from '../Components/AddLocationModal';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [isStaff, setIsStaff] = useState(false); // State to track if the user is staff
  const [showModal, setShowModal] = useState(false); // State to toggle the modal visibility
  const [editingLocation, setEditingLocation] = useState(null); // Track the location being edited

  useEffect(() => {
    const fetchLocations = async () => {
      const querySnapshot = await getDocs(collection(db, 'locations'));
      const locationsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLocations(locationsList);
    };

    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'staff') {
          setIsStaff(true);
        }
      }
    };

    fetchLocations();
    checkUserRole(); // Check if the current user is staff
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await deleteDoc(doc(db, 'locations', id));
        setLocations((prev) => prev.filter((location) => location.id !== id));
      } catch (error) {
        console.error("Error deleting location:", error);
        alert("Failed to delete location. Please try again.");
      }
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, 'locations', id), updatedData);
      setLocations((prev) =>
        prev.map((location) =>
          location.id === id ? { ...location, ...updatedData } : location
        )
      );
      setEditingLocation(null); // Exit editing mode
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location. Please try again.");
    }
  };

  const handleEditClick = (location) => {
    setEditingLocation(location);
  };

  const handleEditSubmit = (e, location) => {
    e.preventDefault();
    const updatedData = {
      branch: e.target.branch.value,
      price: e.target.price.value,
      pax: e.target.pax.value,
    };
    handleEdit(location.id, updatedData);
  };

  return (
    <div
      className="locations-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "0 10px", // Reduce padding to make use of more space
      }}
    >
      <h1 style={{ textAlign: "center", marginTop: "120px" }}>Jollibee Locations</h1>
      <br />
      {isStaff && (
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 20px",
            width: "200px",
            border: "none",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          Add Location
        </button>
      )}

      <div
        className="locations-list"
        style={{
          display: "flex",
          flexWrap: "wrap", // Ensure new rows when needed
          justifyContent: "center",
          gap: "20px", // Add space between cards
          padding: "0", // No extra padding around the card container
          maxWidth: "1200px", // Optional: Prevent cards from stretching too wide
          width: "100%", // Full width of the parent container
        }}
      >
        {locations.map((location) => (
          <div
            key={location.id}
            className="location-card"
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              width: 'calc(33.33% - 20px)', // Increase width of cards
              backgroundColor: 'white',
              boxSizing: 'border-box', // Ensures padding doesn't affect the card's size
            }}
          >
            {editingLocation?.id === location.id ? (
              <form onSubmit={(e) => handleEditSubmit(e, location)}>
                <input
                  name="branch"
                  defaultValue={location.branch}
                  style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
                  required
                />
                <input
                  name="price"
                  defaultValue={location.price}
                  style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
                  required
                />
                <input
                  name="pax"
                  defaultValue={location.pax}
                  style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
                  required
                />
                <button type="submit" style={{ padding: "8px 15px", marginRight: "10px" }}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingLocation(null)}
                  style={{ padding: "8px 15px" }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <img
                  src="https://gracezylbee.wordpress.com/wp-content/uploads/2018/09/received_2231824206834370.jpeg?w=640"
                  alt={location.branch}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '10px',
                  }}
                />
                <h3>{location.branch}</h3>
                <p><strong>Price:</strong> {location.price}</p>
                <p><strong>Pax:</strong> {location.pax}</p>
                <br />
                <Link to="/reserve">
                  <button className="action-btn">Make Reservation</button>
                </Link>
                {isStaff && (
                  <div>
                    <button
                      onClick={() => handleEditClick(location)}
                      style={{
                        marginTop: "10px",
                        padding: "8px 15px",
                        marginRight: "10px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal to add location */}
      {showModal && <AddLocationModal closeModal={() => setShowModal(false)} />}
    </div>
  );
};

export default Locations;
