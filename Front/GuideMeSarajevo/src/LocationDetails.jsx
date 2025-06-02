import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "./nav";
import Footer from "./footer";

function LocationDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const userId = 1; // temporary, replace with real logged-in user id

  useEffect(() => {
    fetch(`http://localhost:8080/api/locations/${id}`)
      .then((res) => res.json())
      .then((data) => setLocation(data))
      .catch((err) => console.error("Error loading location:", err));
  }, [id]);

  const handleAddFavorite = () => {
    fetch(`http://localhost:8080/api/favorites/${userId}/${id}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Already favorited");
        alert("Added to favorites!");
      })
      .catch((err) => alert(err.message));
  };

  const handleBookRoute = () => {
    fetch(`http://localhost:8080/api/booked-routes/${userId}/${id}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Already booked");
        alert("Route booked!");
      })
      .catch((err) => alert(err.message));
  };

  if (!location) return <p>Loading...</p>;

  return (
    <>
      <Nav />
      <div style={styles.container}>
        {location.imageUrl && (
          <img src={location.imageUrl} alt={location.name} style={styles.image} />
        )}
        <div style={styles.details}>
          <h1>{location.name}</h1>
          <p style={styles.description}>{location.description}</p>
          <p><strong>Latitude:</strong> {location.latitude}</p>
          <p><strong>Longitude:</strong> {location.longitude}</p>
          <div style={styles.buttons}>
            <button onClick={handleAddFavorite} style={styles.button}>❤️ Like</button>
            <button onClick={handleBookRoute} style={styles.bookButton}>🧭 Book Route</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "2rem",
    padding: "2rem",
    alignItems: "flex-start",
    flexWrap: "wrap",
    height: "80%"
  },
  image: {
    flex: "1",
    maxWidth: "500px",
    width: "100%",
    height: "auto",
    borderRadius: "12px",
    objectFit: "cover",
  },
  details: {
    flex: "1",
    minWidth: "300px",
  },
  description: {
    marginTop: "1rem",
    marginBottom: "1rem",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  buttons: {
    marginTop: "1rem",
    display: "flex",
    gap: "1rem",
  },
  button: {
    backgroundColor: "#ff5c5c",
    color: "white",
    padding: "0.7rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  bookButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "0.7rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default LocationDetails;
