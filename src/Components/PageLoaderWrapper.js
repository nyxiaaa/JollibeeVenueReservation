import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./Loader"; // Import your Loader component

const PageLoaderWrapper = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true); // Show loader when route changes
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate loading time
    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [location]);

  return (
    <>
      {loading && <Loader />} {/* Show the loader when loading */}
      <div style={{ display: loading ? "none" : "block" }}>{children}</div>
    </>
  );
};

export default PageLoaderWrapper;
