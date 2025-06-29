import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../helpers/api";
import Nav from "./nav";
import Footer from "./footer";
import AddLocationForm from "./AddLocationForm";
import EditLocationForm from "./EditLocationForm";
import AddRouteForm from "./AddRouteForm";
import Modal from "./Modal";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [userID, setUserID] = useState(null);
  const [activeTab, setActiveTab] = useState("favorites");
  const [adminTab, setAdminTab] = useState("locations");
  const [bookedRoutes, setBookedRoutes] = useState([]);
  const [bookedCars, setBookedCars] = useState([]);
  const [likedRoutes, setLikedRoutes] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (!user?.email) return;

    const fetchAll = async () => {
      try {
        const profileData = await fetchWithAuth("/api/auth/profile");
        const userIdData = await fetchWithAuth(`/api/auth/by-email?email=${encodeURIComponent(user.email)}`);
        console.log("Fetched userID:", userIdData.userId);
        setUserID(userIdData.userId);

        let favoritesData = [];
        try {
          favoritesData = await fetchWithAuth(`/api/favorites/${userIdData.userId}`);
        } catch (err) {
          console.error("Failed to fetch favorites:", err.message);
        }

        let bookedRoutesData = [];
        try {
          bookedRoutesData = await fetchWithAuth(`/api/routes/booked/${userIdData.userId}`);
        } catch (err) {
          console.error("Failed to fetch booked routes:", err.message);
        }

        let bookedCarsData = [];
        try {
          bookedCarsData = await fetchWithAuth(`/api/cars/bookings/${userIdData.userId}`);
        } catch (err) {
          console.error("Failed to fetch booked cars:", err.message);
        }

        let likedRoutesData = [];
        try {
          likedRoutesData = await fetchWithAuth(`/api/liked-routes/user/${userIdData.userId}`);
          console.log("Liked routes response:", likedRoutesData);
        } catch (err) {
          console.error("Failed to fetch liked routes:", err.message);
        }

        let routesData = [];
        let locationsData = [];
        if (profileData.role?.toUpperCase() === "ADMIN") {
          try {
            routesData = await fetchWithAuth("/api/routes");
            console.log("Routes response:", routesData);
            locationsData = await fetchWithAuth("/api/locations");
            console.log("Locations response:", locationsData);
          } catch (err) {
            console.error("Failed to fetch admin data:", err.message);
          }
        }

        setProfile({ ...profileData, favorites: favoritesData, locations: locationsData });
        setBookedRoutes(bookedRoutesData);
        setBookedCars(bookedCarsData);
        setLikedRoutes(likedRoutesData);
        setRoutes(routesData);
        setFormData((f) => ({ ...f, username: profileData.username || "" }));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAll();
  }, [user?.email]);

  const refresh = async () => {
    try {
      const profileData = await fetchWithAuth("/api/auth/profile");
      const favoritesData = await fetchWithAuth(`/api/favorites/${userID}`).catch(() => []);
      const bookedRoutesData = await fetchWithAuth(`/api/routes/booked/${userID}`).catch(() => []);
      const bookedCarsData = await fetchWithAuth(`/api/cars/bookings/${userID}`).catch(() => []);
      const likedRoutesData = await fetchWithAuth(`/api/liked-routes/user/${userID}`).catch(() => []);
      const routesData = await fetchWithAuth("/api/routes").catch(() => []);
      const locationsData = await fetchWithAuth("/api/locations").catch(() => []);
      console.log("Refreshed routes:", routesData);
      console.log("Refreshed locations:", locationsData);

      setProfile({ ...profileData, favorites: favoritesData, locations: locationsData });
      setBookedRoutes(bookedRoutesData);
      setBookedCars(bookedCarsData);
      setLikedRoutes(likedRoutesData);
      setRoutes(routesData);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFavorite = async (locationId) => {
    try {
      await fetchWithAuth(`/api/favorites/${userID}/${locationId}`, {
        method: "DELETE",
      });
      setProfile((p) => ({
        ...p,
        favorites: p.favorites.filter((fav) => fav.locationId !== locationId),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelBookedRoute = async (routeId) => {
    try {
      await fetchWithAuth(`/api/booked-routes/${userID}/${routeId}`, {
        method: "DELETE",
      });
      setBookedRoutes((routes) =>
        routes.filter((route) => route.routeId !== routeId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelCarBooking = async (bookingId) => {
    try {
      await fetchWithAuth(`/api/cars/bookings/${bookingId}`, {
        method: "DELETE",
      });
      setBookedCars((bookings) =>
        bookings.filter((booking) => booking.bookingId !== bookingId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleLikeRoute = async (routeId) => {
    try {
      const response = await fetchWithAuth(`/api/liked-routes/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userID, routeId }),
      });
      if (response === "Liked") {
        const routeData = await fetchWithAuth(`/api/routes/${routeId}`);
        setLikedRoutes((routes) => [
          ...routes,
          {
            routeId,
            name: routeData.name,
            description: routeData.description,
            price: routeData.price,
            imageUrl: routeData.imageUrl,
            itinerary: routeData.itinerary,
          },
        ]);
      } else {
        setLikedRoutes((routes) => routes.filter((route) => route.routeId !== routeId));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUsernameUpdate = async () => {
    try {
      await fetchWithAuth("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username }),
      });
      setEditUsername(false);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      await fetchWithAuth("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      setEditPassword(false);
      setFormData((f) => ({
        ...f,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteLocation = async (id) => {
    if (!window.confirm("Delete this location?")) return;
    try {
      await fetchWithAuth(`/api/locations/${id}`, {
        method: "DELETE",
      });
      setProfile((p) => ({
        ...p,
        locations: p.locations.filter((l) => l.locationId !== id),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteRoute = async (id) => {
    if (!window.confirm("Delete this route?")) return;
    try {
      console.log(`Attempting to delete route with ID: ${id}`);
      
      // Check for and delete associated booked routes
      try {
        const bookedRoutes = await fetchWithAuth(`/api/routes/booked/${userID}`);
        const associatedBookings = bookedRoutes.filter((booking) => booking.routeId === id);
        for (const booking of associatedBookings) {
          console.log(`Deleting booked route for user ${userID}, route ${id}`);
          await fetchWithAuth(`/api/booked-routes/${userID}/${id}`, {
            method: "DELETE",
          });
        }
      } catch (err) {
        console.warn(`No booked routes found or error deleting booked routes: ${err.message}`);
      }

      // Delete the route
      const response = await fetchWithAuth(`/api/routes/${id}`, {
        method: "DELETE",
      });
      console.log("Delete route response:", response);

      // Update state
      setRoutes((r) => {
        const updatedRoutes = r.filter((route) => route.routeId !== id);
        console.log("Updated routes state:", updatedRoutes);
        return updatedRoutes;
      });

      // Refresh routes to ensure consistency
      await refresh();
    } catch (err) {
      console.error("Error deleting route:", err.message);
      setError(`Failed to delete route: ${err.message}`);
    }
  };

  const isAdmin = profile?.role?.toUpperCase() === "ADMIN";

  if (!profile) {
    return (
      <>
        <Nav />
        <div className="profile-wrapper">
          <div className="profile-left">
            <h2>My Profile</h2>
            {error && <div className="error">{error}</div>}
            <p>No profile data available.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="profile-wrapper">
        <div className="profile-left">
          <h2>My Profile</h2>
          {error && <div className="error">{error}</div>}

          <div className="profile-card">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>

          <div className="profile-card">
            <label>Username:</label>
            {editUsername ? (
              <>
                <input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                <div className="btn-group">
                  <button onClick={handleUsernameUpdate}>Save</button>
                  <button
                    className="cancel"
                    onClick={() => setEditUsername(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>{profile.username}</span>
                <button onClick={() => setEditUsername(true)}>Edit</button>
              </>
            )}
          </div>

          <div className="profile-card">
            <label>Password:</label>
            {editPassword ? (
              <>
                <input
                  type="password"
                  placeholder="Current"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <input
                  type="password"
                  placeholder="New"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Confirm"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <div className="btn-group">
                  <button onClick={handlePasswordChange}>Change</button>
                  <button
                    className="cancel"
                    onClick={() => setEditPassword(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => setEditPassword(true)}>
                Change Password
              </button>
            )}
          </div>

          <div className="profile-card">
            <label>Role:</label>
            <span>{profile.role}</span>
          </div>
        </div>

        <div className="profile-right">
          {isAdmin ? (
            <div className="admin-section">
              <h3>Admin Dashboard</h3>
              <div className="tabs">
                <button
                  className={adminTab === "locations" ? "active" : ""}
                  onClick={() => setAdminTab("locations")}
                >
                  Locations
                </button>
                <button
                  className={adminTab === "routes" ? "active" : ""}
                  onClick={() => setAdminTab("routes")}
                >
                  Routes
                </button>
              </div>

              {adminTab === "locations" && (
                <>
                  <button
                    className="small-btn"
                    onClick={() => {
                      setShowAddLocation((s) => !s);
                      setEditingId(null);
                      setShowAddRoute(false);
                    }}
                  >
                    {showAddLocation ? "Cancel" : "Add New Location"}
                  </button>
                  {showAddLocation && (
                    <Modal
                      isOpen={showAddLocation}
                      onClose={() => setShowAddLocation(false)}
                    >
                      <AddLocationForm
                        userId={userID}
                        onAdded={async () => {
                          await refresh();
                          setShowAddLocation(false);
                        }}
                        onCancel={() => setShowAddLocation(false)}
                      />
                    </Modal>
                  )}

                  <div className="scrollable-list">
                    <ul className="location-list">
                      {profile.locations?.length > 0 ? (
                        profile.locations.map((loc) => (
                          <li key={loc.locationId} className="location-item">
                            <div className="loc-header">
                              <strong>{loc.name}</strong>
                              <div className="loc-buttons">
                                <button onClick={() => setEditingId(loc.locationId)}>
                                  Edit
                                </button>
                                <button
                                  style={{ backgroundColor: "red", marginLeft: "10px" }}
                                  onClick={() => deleteLocation(loc.locationId)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p>{loc.description}</p>
                            <small>
                              Categories:{" "}
                              {loc.categories?.map((c) => c.name).join(", ") || "-"}
                            </small>
                          </li>
                        ))
                      ) : (
                        <p>No locations available.</p>
                      )}
                    </ul>
                  </div>

                  {editingId && (
                    <Modal
                      isOpen={!!editingId}
                      onClose={() => setEditingId(null)}
                    >
                      <EditLocationForm
                        initial={profile.locations.find((l) => l.locationId === editingId)}
                        onSaved={async (updated) => {
                          setProfile((p) => ({
                            ...p,
                            locations: p.locations.map((l) =>
                              l.locationId === updated.locationId ? updated : l
                            ),
                          }));
                          setEditingId(null);
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    </Modal>
                  )}
                </>
              )}

              {adminTab === "routes" && (
                <>
                  <button
                    className="small-btn"
                    onClick={() => {
                      setShowAddRoute((s) => !s);
                      setShowAddLocation(false);
                      setEditingId(null);
                    }}
                  >
                    {showAddRoute ? "Cancel" : "Add New Route"}
                  </button>
                  {showAddRoute && (
                    <Modal
                      isOpen={showAddRoute}
                      onClose={() => setShowAddRoute(false)}
                    >
                      <AddRouteForm
                        userId={userID}
                        onAdded={async (newRoute) => {
                          await refresh();
                          setShowAddRoute(false);
                        }}
                        onCancel={() => setShowAddRoute(false)}
                      />
                    </Modal>
                  )}

                  <div className="scrollable-list">
                    <ul className="location-list">
                      {routes.length > 0 ? (
                        routes.map((route) => (
                          <li key={route.routeId} className="location-item">
                            <div className="loc-header">
                              <strong>{route.name}</strong>
                              <div className="loc-buttons">
                                <button
                                  style={{ backgroundColor: "red", marginLeft: "10px" }}
                                  onClick={() => deleteRoute(route.routeId)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p>{route.description}</p>
                            <p>Price: ${route.price}</p>
                            <small>
                              Itinerary Locations:{" "}
                              {Array.isArray(route.itinerary) && route.itinerary.length > 0
                                ? route.itinerary.join(", ")
                                : "-"}
                            </small>
                          </li>
                        ))
                      ) : (
                        <p>No routes available.</p>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="user-section">
              <h3>Your Activity</h3>
              <div className="tabs">
                <button
                  className={activeTab === "favorites" ? "active" : ""}
                  onClick={() => setActiveTab("favorites")}
                >
                  Favorite Locations
                </button>
                <button
                  className={activeTab === "likedRoutes" ? "active" : ""}
                  onClick={() => setActiveTab("likedRoutes")}
                >
                  Liked Routes
                </button>
                <button
                  className={activeTab === "bookedRoutes" ? "active" : ""}
                  onClick={() => setActiveTab("bookedRoutes")}
                >
                  Booked Routes
                </button>
                <button
                  className={activeTab === "bookedCars" ? "active" : ""}
                  onClick={() => setActiveTab("bookedCars")}
                >
                  Booked Cars
                </button>
              </div>
              <div className="scrollable-list">
                {activeTab === "favorites" && (
                  <ul className="location-list">
                    {profile.favorites?.length > 0 ? (
                      profile.favorites.map((loc) => (
                        <li key={loc.locationId} className="location-item">
                          <strong>{loc.name}</strong>
                          <p>{loc.description}</p>
                          <small>
                            Categories:{" "}
                            {loc.categories?.map((c) => c.name).join(", ") ||
                              "-"}
                          </small>
                          <button
                            style={{ backgroundColor: "red", marginLeft: "10px" }}
                            onClick={() => removeFavorite(loc.locationId)}
                          >
                            Remove
                          </button>
                        </li>
                      ))
                    ) : (
                      <p>No favorite locations yet.</p>
                    )}
                  </ul>
                )}
                {activeTab === "likedRoutes" && (
                  <ul className="location-list">
                    {likedRoutes.length > 0 ? (
                      likedRoutes.map((route) => (
                        <li key={route.routeId} className="location-item">
                          <strong>{route.name || `Route #${route.routeId}`}</strong>
                          <p>{route.description || "No description available."}</p>
                          <p>Price: ${route.price || "N/A"}</p>
                          <small>
                            Itinerary Locations:{" "}
                            {Array.isArray(route.itinerary) && route.itinerary.length > 0
                              ? route.itinerary.join(", ")
                              : "-"}
                          </small>
                          <button
                            style={{ backgroundColor: "red", marginLeft: "10px" }}
                            onClick={() => toggleLikeRoute(route.routeId)}
                          >
                            Unlike
                          </button>
                        </li>
                      ))
                    ) : (
                      <p>No liked routes yet.</p>
                    )}
                  </ul>
                )}
                {activeTab === "bookedRoutes" && (
                  <ul className="location-list">
                    {bookedRoutes.length > 0 ? (
                      bookedRoutes.map((route) => (
                        <li key={route.routeId} className="location-item">
                          <strong>{route.name || `Route #${route.routeId}`}</strong>
                          <p>{route.description || "No description available."}</p>
                          <p>Price: ${route.price || "N/A"}</p>
                          <p>Booked at: {new Date(route.bookedAt).toLocaleString()}</p>
                          <small>
                            Itinerary Locations:{" "}
                            {Array.isArray(route.itinerary) && route.itinerary.length > 0
                              ? route.itinerary.join(", ")
                              : "-"}
                          </small>
                          <button
                            style={{ backgroundColor: "red", marginLeft: "10px" }}
                            onClick={() => cancelBookedRoute(route.routeId)}
                          >
                            Cancel
                          </button>
                        </li>
                      ))
                    ) : (
                      <p>No booked routes yet.</p>
                    )}
                  </ul>
                )}
                {activeTab === "bookedCars" && (
                  <ul className="location-list">
                    {bookedCars.length > 0 ? (
                      bookedCars.map((booking) => (
                        <li key={booking.bookingId} className="location-item">
                          <strong>{booking.brand} {booking.model}</strong>
                          <p>
                            From: {new Date(booking.startDate).toLocaleDateString()} To: {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                          <button
                            style={{ backgroundColor: "red", marginLeft: "10px" }}
                            onClick={() => cancelCarBooking(booking.bookingId)}
                          >
                            Cancel
                          </button>
                        </li>
                      ))
                    ) : (
                      <p>No booked cars yet.</p>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;