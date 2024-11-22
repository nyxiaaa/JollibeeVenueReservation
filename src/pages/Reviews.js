import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Import Firebase configuration
import { onAuthStateChanged } from "firebase/auth";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reviews"));
        const reviewsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsList);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const checkAuthStatus = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsAuthenticated(true);
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              setUserRole(userDoc.data().role); // 'user' or 'staff'
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
          }
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

      const docRef = await addDoc(collection(db, "reviews"), newReview);
      const reviewWithId = { id: docRef.id, ...newReview };

      setReviews((prev) => [...prev, reviewWithId]);
      setReviewText("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="container" style={{ padding: "20px", textAlign: "center" }}>
      <h1>Customer Reviews</h1>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0" }}>
        <div style={{ flex: 1, marginRight: "20px" }}>
          {reviews.map((review) => (
            <div key={review.id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
              <p>
                <strong>{review.user}</strong>: {review.reviewText}
              </p>
              <p style={{ fontSize: "12px", color: "gray" }}>{new Date(review.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div>
          {userRole === "staff" ? (
            <p>Staff members can only view reviews.</p>
          ) : isAuthenticated ? (
            <form onSubmit={handleReviewSubmit}>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here"
                style={{ width: "100%", height: "100px", marginBottom: "10px" }}
              />
              <button type="submit">Submit</button>
            </form>
          ) : (
            <p>Please log in to leave a review.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
