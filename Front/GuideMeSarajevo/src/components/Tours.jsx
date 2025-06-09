import { useEffect, useState } from "react";
import Nav from "./nav";
import Footer from "./footer";
import "./Tours.css";

const Tours = () => {
  const [routes, setRoutes] = useState([]);
  const [liked, setLiked] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    fetch("/api/routes")
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(err => console.error("Failed to fetch routes:", err));
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/liked-routes/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        const likedRouteIds = data.map((like) => like.routeId);
        setLiked(likedRouteIds);
      })
      .catch(err => console.error("Failed to fetch liked routes", err));
  }, [userId]);

  const handleToggleLike = (routeId) => {
    fetch(`/api/liked-routes/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: parseInt(userId), routeId }),
    })
      .then(() => {
        setLiked((prev) =>
          prev.includes(routeId)
            ? prev.filter((id) => id !== routeId)
            : [...prev, routeId]
        );
      })
      .catch((err) => console.error("Error toggling like", err));
  };

  return (
    <>
      <Nav />
      <div className="tours-container">
        <h2 className="tours-title">Available Tours</h2>
        <div className="routes-grid">
          {routes.map((route) => (
            <div className="route-card" key={route.routeId}>
              <img src={route.imageUrl} alt={route.name} className="route-image" />
              <div className="route-info">
                <h3>{route.name}</h3>
                <p>{route.description}</p>
                {route.itinerary && <p className="itinerary">Itinerary: {route.itinerary}</p>}
                <p className="route-price">${route.price}</p>
                <button
                  onClick={() => handleToggleLike(route.routeId)}
                  className={`like-button ${liked.includes(route.routeId) ? "liked" : ""}`}
                >
                  {liked.includes(route.routeId) ? "💖 Liked" : "🤍 Like"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Tours;
