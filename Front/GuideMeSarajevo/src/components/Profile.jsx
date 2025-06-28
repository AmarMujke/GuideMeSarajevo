import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Nav from "./nav";
import Footer from "./footer";
import AddLocationForm from "./AddLocationForm";
import EditLocationForm from "./EditLocationForm";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [userID, setUserID] = useState(null);
  const [activeTab, setActiveTab] = useState("favorites");
  const [bookedRoutes, setBookedRoutes] = useState([]);
  const [bookedCars, setBookedCars] = useState([]);
  const [likedRoutes, setLikedRoutes] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user?.email) return;

    const fetchAll = async () => {
      try {
        const profileRes = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileRes.json();

        const userIdRes = await fetch(
          `/api/auth/by-email?email=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!userIdRes.ok) throw new Error("Failed to fetch user ID");
        const { userId } = await userIdRes.json();
        setUserID(userId);

        let favoritesData = [];
        try {
          const favoritesRes = await fetch(`/api/favorites/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (favoritesRes.ok) favoritesData = await favoritesRes.json();
        } catch (err) {
          console.error("Failed to fetch favorites:", err.message);
        }

        let bookedRoutesData = [];
        try {
          const bookedRoutesRes = await fetch(`/api/routes/booked/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (bookedRoutesRes.ok) bookedRoutesData = await bookedRoutesRes.json();
        } catch (err) {
          console.error("Failed to fetch booked routes:", err.message);
        }

        let bookedCarsData = [];
        try {
          const bookedCarsRes = await fetch(`/api/cars/bookings/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (bookedCarsRes.ok) bookedCarsData = await bookedCarsRes.json();
        } catch (err) {
          console.error("Failed to fetch booked cars:", err.message);
        }

        let likedRoutesData = [];
        try {
          const likedRoutesRes = await fetch(`/api/liked-routes/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (likedRoutesRes.ok) likedRoutesData = await likedRoutesRes.json();
        } catch (err) {
          console.error("Failed to fetch liked routes:", err.message);
        }

        setProfile({ ...profileData, favorites: favoritesData });
        setBookedRoutes(bookedRoutesData);
        setBookedCars(bookedCarsData);
        setLikedRoutes(likedRoutesData);
        setFormData((f) => ({ ...f, username: profileData.username || "" }));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAll();
  }, [user?.email, token]);

  const refresh = async () => {
    try {
      const profileRes = await fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = profileRes.ok ? await profileRes.json() : {};

      let favoritesData = [];
      try {
        const favoritesRes = await fetch(`/api/favorites/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (favoritesRes.ok) favoritesData = await favoritesRes.json();
      } catch (err) {
        console.error("Failed to fetch favorites:", err.message);
      }

      let bookedRoutesData = [];
      try {
        const bookedRoutesRes = await fetch(`/api/routes/booked/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (bookedRoutesRes.ok) bookedRoutesData = await bookedRoutesRes.json();
      } catch (err) {
        console.error("Failed to fetch booked routes:", err.message);
      }

      let bookedCarsData = [];
      try {
        const bookedCarsRes = await fetch(`/api/cars/bookings/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (bookedCarsRes.ok) bookedCarsData = await bookedCarsRes.json();
      } catch (err) {
        console.error("Failed to fetch booked cars:", err.message);
      }

      let likedRoutesData = [];
      try {
        const likedRoutesRes = await fetch(`/api/liked-routes/user/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (likedRoutesRes.ok) likedRoutesData = await likedRoutesRes.json();
      } catch (err) {
        console.error("Failed to fetch liked routes:", err.message);
      }

      setProfile({ ...profileData, favorites: favoritesData });
      setBookedRoutes(bookedRoutesData);
      setBookedCars(bookedCarsData);
      setLikedRoutes(likedRoutesData);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFavorite = async (locationId) => {
    try {
      const res = await fetch(`/api/favorites/${userID}/${locationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove favorite");
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
      const res = await fetch(`/api/booked-routes/${userID}/${routeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      setBookedRoutes((routes) =>
        routes.filter((route) => route.routeId !== routeId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelCarBooking = async (bookingId) => {
    try {
      const res = await fetch(`/api/cars/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to cancel car booking");
      setBookedCars((bookings) =>
        bookings.filter((booking) => booking.bookingId !== bookingId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleLikeRoute = async (routeId) => {
    try {
      const res = await fetch(`/api/liked-routes/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userID, routeId }),
      });
      if (!res.ok) throw new Error("Failed to toggle like");
      const result = await res.text();
      setLikedRoutes((routes) =>
        result === "Liked"
          ? [...routes, { routeId, name: routes.find(r => r.routeId === routeId)?.name || "Route" }]
          : routes.filter((route) => route.routeId !== routeId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUsernameUpdate = async () => {
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: formData.username }),
      });
      if (!res.ok) throw new Error(await res.text());
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
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
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
      const res = await fetch(`/api/locations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setProfile((p) => ({
        ...p,
        locations: p.locations.filter((l) => l.locationId !== id),
      }));
    } catch (err) {
      setError(err.message);
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
              <h3>Your Locations</h3>
              <button
                className="small-btn"
                onClick={() => {
                  setShowAdd((s) => !s);
                  setEditingId(null);
                }}
              >
                {showAdd ? "Cancel" : "Add New Location"}
              </button>
              {showAdd && (
                <AddLocationForm
                  userId={userID}
                  onAdded={(newLoc) => {
                    setProfile((p) => ({
                      ...p,
                      locations: [...(p.locations || []), newLoc],
                    }));
                    setShowAdd(false);
                  }}
                />
              )}

              <div className="scrollable-list">
                <ul className="location-list">
                  {profile.locations?.map((loc) => (
                    <li key={loc.locationId} className="location-item">
                      <div className="loc-header">
                        <strong>{loc.name}</strong>
                        <div className="loc-buttons">
                          <button onClick={() => setEditingId(loc.locationId)}>
                            Edit
                          </button>
                          <button
                            style={{ backgroundColor: "red" }}
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

                      {editingId === loc.locationId && (
                        <EditLocationForm
                          initial={loc}
                          onCancel={() => setEditingId(null)}
                          onSaved={(updated) => {
                            setProfile((p) => ({
                              ...p,
                              locations: p.locations.map((l) =>
                                l.locationId === updated.locationId
                                  ? updated
                                  : l
                              ),
                            }));
                            setEditingId(null);
                          }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
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