import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Reservation from "./pages/Reservation";
import Dashboard from "./pages/Dashboard";
import Locations from "./pages/Locations";
import Reviews from "./pages/Reviews";
import PageLoaderWrapper from "./Components/PageLoaderWrapper"; // Import the component

function App() {
  return (
    <Router>
      <PageLoaderWrapper>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reserve" element={<Reservation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </PageLoaderWrapper>
    </Router>
  );
}

export default App;
