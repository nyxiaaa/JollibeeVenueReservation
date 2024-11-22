import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Import Firebase configuration
import { onAuthStateChanged } from "firebase/auth";
import "../styles.css"; // Import your global styles

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [userRole, setUserRole] = useState(null); // User role: 'staff' or 'user'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      // Fetch all reviews from Firestore
      const querySnapshot = await getDocs(collection(db, "reviews"));
      const reviewsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsList);
    };

    const checkAuthStatus = () => {
      // Check if a user is logged in
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsAuthenticated(true);

          // Fetch user role from Firestore (Assuming roles are stored in a `users` collection)
          const userDoc = await getDocs(collection(db, "users"));
          userDoc.forEach((doc) => {
            if (doc.id === user.uid) {
              setUserRole(doc.data().role); // 'user' or 'staff'
            }
          });
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      });
    };

    fetchReviews();
    checkAuthStatus();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("You need to log in to leave a review.");
      return;
    }

    try {
      const newReview = {
        reviewText,
        user: auth.currentUser.email,
        date: new Date().toISOString(),
      };

      // Add review to Firestore
      await addDoc(collection(db, "reviews"), newReview);

      // Update local state
      setReviews((prev) => [...prev, newReview]);
      setReviewText("");
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div
      className="reviews-container"
      style={{
        display: "flex",
        justifyContent: "center", // Center the container horizontally
        alignItems: "flex-start", // Align items to the top
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* Main Wrapper to control maxWidth */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Space between reviews and form
          width: "100%",
          maxWidth: "1200px", // Set a max width for the content
        }}
      >
        {/* Reviews Section (Left Side) */}
        <div
          style={{
            flex: 1, // Take up equal space
            marginRight: "20px", // Space between reviews and form
            paddingRight: "20px", // Add padding to the right side
            overflowY: "auto", // Allow scrolling if content overflows
          }}
        >
          <h1 style={{ textAlign: "center", marginTop: "120px" }}>Customer Reviews</h1>
          <br />

          {/* Display Reviews */}
          <div>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    margin: "10px 0",
                    padding: "10px",
                    textAlign: "left",
                    background: "white",
                  }}
                >
                  <p>
                    <strong>{review.user}</strong>
                    <br />
                    {review.reviewText}
                  </p>
                  <p style={{ fontSize: "12px", color: "gray" }}>
                    {new Date(review.date).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to leave one!</p>
            )}
          </div>
        </div>

        {/* Review Form Section (Right Side) */}
        <div
          style={{
            width: "400px", // Set a fixed width for the form container
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            overflowY: "auto", // Allow scrolling if content overflows
            marginLeft: "auto", // Push the form container to the right
            marginTop: "120px", // Push it down so the navbar doesnt hide it
            display: "flex", // Flexbox for centering content
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            height: "400px", // Make the form container take up the full available height minus padding
          }}
        >
          {/* Feedback/Review Section */}
          {userRole === "staff" ? (
            <p style={{ color: "gray", marginTop: "20px" }}>
              Staff members can only view reviews.
            </p>
          ) : isAuthenticated ? (
            <form
              onSubmit={handleReviewSubmit}
              style={{ 
                marginTop: "20px", 
                textAlign: "center", 
                width: "100%",
              }}
            >
              <textarea
                placeholder="Leave a review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "250px",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              ></textarea>
              <button
                type="submit"
                style={{
                  width: "100%", // Make the button full width
                }}
              >
                Submit Review
              </button>
            </form>
          ) : (
            <p style={{ marginTop: "20px", color: "red" }}>
              Please log in to leave a review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
