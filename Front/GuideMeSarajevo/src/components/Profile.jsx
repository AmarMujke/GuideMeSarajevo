import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Nav from "../nav";
import Footer from "../footer";
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

  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (!user?.email) return;
    (async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
        setFormData((f) => ({ ...f, username: data.username || "" }));
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [user?.email, token]);

  const refresh = async () => {
    const res = await fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProfile(await res.json());
  };

  const handleUsernameUpdate = async () => {
    try {
      const res = await fetch("/api/auth/update-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username: formData.username })
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      if (!res.ok) throw new Error(await res.text());
      setEditPassword(false);
      setFormData((f) => ({
        ...f,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
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
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      setProfile((p) => ({
        ...p,
        locations: p.locations.filter((l) => l.locationId !== id)
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const isAdmin = profile?.role?.toUpperCase() === "ADMIN";
  if (!profile) return <div className="loading">Loading…</div>;

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
                      currentPassword: e.target.value
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
                      confirmPassword: e.target.value
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
                  onAdded={(newLoc) => {
                    setProfile((p) => ({
                      ...p,
                      locations: [...(p.locations || []), newLoc]
                    }));
                    setShowAdd(false);
                  }}
                />
              )}

              <div className="scrollable-list">
                <ul className="location-list">
                  {profile.locations.map((loc) => (
                    <li
                      key={loc.locationId}
                      className="location-item"
                    >
                      <div className="loc-header">
                        <strong>{loc.name}</strong>
                        <div className="loc-buttons">
                          <button onClick={() => setEditingId(loc.locationId)}>
                            Edit
                          </button>
                          <button onClick={() => deleteLocation(loc.locationId)}>
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
                              )
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
