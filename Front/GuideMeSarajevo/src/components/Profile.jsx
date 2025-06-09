import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Nav from "./nav";
import Footer from "./footer";
import AddLocationForm from "./AddLocationForm";
import EditLocationForm from "./EditLocationForm";
import "./Profile.css";
import parseJwt from "../helpers/parseJwt";

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
          `http://localhost:8080/api/auth/by-email?email=${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!userIdRes.ok) throw new Error("Failed to fetch user ID");
        const { userId } = await userIdRes.json();
  
        const favoritesRes = await fetch(`/api/favorites/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!favoritesRes.ok) throw new Error("Failed to fetch favorites");
        const favoritesData = await favoritesRes.json();
  
        setProfile({ ...profileData, favorites: favoritesData });
        setFormData((f) => ({ ...f, username: profileData.username || "" }));
        setUserID(userId);
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchAll();
  }, [user?.email, token]);
  

  const refresh = async () => {
    const profileRes = await fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const profileData = await profileRes.json();
  
    const favoritesRes = await fetch(`/api/favorites/${userID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const favoritesData = await favoritesRes.json();
  
    setProfile({ ...profileData, favorites: favoritesData });
  };
  

  const removeFavorite = async (locationId) => {
    try {
      const res = await fetch(`/api/favorites/${locationId}`, {
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
  
  const handleUsernameUpdate = async () => {
    try {
      const res = await fetch("/api/auth/update-username", {
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
  if (!profile) return <div className="loading">Loading…</div>;

  const userPayload = parseJwt(token);
  const userMail = userPayload.sub;

  const getUserIdByEmail = async (email, token) => {
    const res = await fetch(
      `http://localhost:8080/api/auth/by-email?email=${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch user ID");
    }

    const data = await res.json();
    return data.userId;
  };

  // Use inside an async context
  const fetchUserId = async () => {
    try {
      setUserID(await getUserIdByEmail(userMail, token));
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  fetchUserId();

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
                  {profile.locations.map((loc) => (
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
                        {loc.categories.map((c) => c.name).join(", ") || "-"}
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
            <div className="favorites-section">
              <h3>Favorite Locations</h3>
              <div className="scrollable-list">
                <ul className="location-list">
                  {profile.favorites?.map((loc) => (
                    <li key={loc.locationId} className="location-item">
                      <strong>{loc.name}</strong>
                      <p>{loc.description}</p>
                      <small>
                        Categories:{" "}
                        {loc.categories.map((c) => c.name).join(", ") || "-"}
                      </small>
                      <button
                        style={{ backgroundColor: "red", marginLeft: "10px" }}
                        onClick={() => removeFavorite(loc.locationId)}
                      >
                        Remove
                      </button>
                    </li>
                  )) || <p>No favorites yet.</p>}
                </ul>
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
