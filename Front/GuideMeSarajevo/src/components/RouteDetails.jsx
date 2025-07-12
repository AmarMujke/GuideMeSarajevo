import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import Nav from "./nav";
import Footer from "./footer";
import "./RouteDetails.css";

const RouteDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [route, setRoute] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.email || userId) return;
      try {
        const res = await fetch(`${api}/api/auth/by-email?email=${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user ID");
        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchRoute = async () => {
      try {
        const res = await fetch(`${api}/api/routes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch route details");
        const data = await res.json();
        setRoute(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
    fetchRoute();
  }, [id, user?.email, token, userId]);

  const handleBookRoute = async () => {
    if (!userId) {
      setError("Please log in to book this route.");
      return;
    }
    try {
      const res = await fetch(`${api}/api/booked-routes/${userId}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Booking failed.");
      }
      alert("Route booked successfully!");
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="route-details-container">
          <p>Loading route details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!route) {
    return (
      <>
        <Nav />
        <div className="route-details-container">
          {error && <div className="error">{error}</div>}
          <p>Route not found.</p>
          <Link to="/tours" className="back-link">
            Back to Tours
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="route-details-container">
        {error && <div className="error">{error}</div>}
        <h2 className="route-title">{route.name || "Route Details"}</h2>
        <img
          src={route.imageUrl || "/placeholder-route.jpg"}
          alt={route.name || "Route Image"}
          className="route-image"
        />
        <div className="route-info">
          <p className="route-description">{route.description || "No description available."}</p>
          {route.itinerary && (
            <p className="route-itinerary">Itinerary: {route.itinerary}</p>
          )}
          <p className="route-price">Price: ${route.price || "N/A"}</p>
          {route.duration && (
            <p className="route-duration">Duration: {route.duration}</p>
          )}
          {route.startLocation && (
            <p className="route-start">Start: {route.startLocation}</p>
          )}
          {route.endLocation && (
            <p className="route-end">End: {route.endLocation}</p>
          )}
          <div className="route-actions">
            <button
              className="book-button"
              onClick={handleBookRoute}
              disabled={!userId}
            >
              Book Now
            </button>
            <Link to="/tours" className="back-link">
              Back to Tours
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RouteDetails;