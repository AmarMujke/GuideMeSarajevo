import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Nav from "./nav";
import Footer from "./footer";
import "./Tours.css";

const Tours = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [routes, setRoutes] = useState([]);
  const [liked, setLiked] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchUserId = async () => {
      if (!user?.email || userId) return;
      try {
        const res = await fetch(`/api/auth/by-email?email=${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user ID");
        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        setError(err.message);
      }
    };


    const fetchRoutes = async () => {
      try {
        const res = await fetch("/api/routes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch routes");
        const data = await res.json();
        setRoutes(data);
      } catch (err) {
        setError(err.message);
      }
    };


    const fetchLikedRoutes = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`/api/liked-routes/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch liked routes");
        const data = await res.json();
        const likedRouteIds = data.map((like) => like.routeId);
        setLiked(likedRouteIds);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserId();
    fetchRoutes();
    fetchLikedRoutes();
  }, [user?.email, token, userId]);

  const handleToggleLike = async (routeId) => {
    if (!userId) {
      setError("Please log in to like routes.");
      return;
    }
    try {
      const res = await fetch(`/api/liked-routes/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, routeId }),
      });
      if (!res.ok) throw new Error("Failed to toggle like");
      setLiked((prev) =>
        prev.includes(routeId)
          ? prev.filter((id) => id !== routeId)
          : [...prev, routeId]
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBookRoute = async (routeId) => {
    if (!userId) {
      setError("Please log in to book routes.");
      return;
    }
    try {
      const res = await fetch(`/api/booked-routes/${userId}/${routeId}`, {
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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Nav />
      <div className="tours-container">
        <h2 className="tours-title">Available Tours</h2>
        {error && <div className="error">{error}</div>}
        {!userId ? (
          <p>Please log in to like or book tours.</p>
        ) : routes.length === 0 ? (
          <p>No tours available at the moment.</p>
        ) : (
          <div className="routes-grid">
            {routes.map((route) => (
              <div className="route-card" key={route.routeId}>
                <Link to={`/routes/${route.routeId}`}>
                  <img
                    src={route.imageUrl || "/placeholder-route.jpg"}
                    alt={route.name}
                    className="route-image"
                  />
                </Link>
                <div className="route-info">
                  <h3>
                    <Link to={`/routes/${route.routeId}`}>{route.name}</Link>
                  </h3>
                  <p>{route.description || "No description available."}</p>
                  {route.itinerary && (
                    <p className="itinerary">Itinerary: {route.itinerary}</p>
                  )}
                  <p className="route-price">${route.price || "N/A"}</p>
                  <div className="route-actions">
                    <button
                      onClick={() => handleToggleLike(route.routeId)}
                      className={`like-button ${
                        liked.includes(route.routeId) ? "liked" : ""
                      }`}
                      disabled={!userId}
                    >
                      {liked.includes(route.routeId) ? "💖 Liked" : "🤍 Like"}
                    </button>
                    <button
                      className="book-button"
                      onClick={() => handleBookRoute(route.routeId)}
                      disabled={!userId}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Tours;