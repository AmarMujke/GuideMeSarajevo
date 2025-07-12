import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "./nav";
import Footer from "./footer";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  DirectionsService,
} from "@react-google-maps/api";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const api = import.meta.env.VITE_API_URL;

function LocationDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    fetch(`${api}/api/locations/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch location: ${res.status}`);
        return res.json();
      })
      .then((data) => setLocation(data))
      .catch((err) => console.error("Error loading location:", err));
  }, [id]);  

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setUserLocation({ lat: 43.8563, lng: 18.4131 }); // fallback Sarajevo
      }
    );
  }, []);

  const handleDirectionsCallback = (response) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirections(response);
      } else {
        console.error("Directions request failed:", response);
      }
    }
  };

  const handleAddFavorite = () => {
    fetch(`${api}/api/favorites/1/${id}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Already favorited");
        alert("Added to favorites!");
      })
      .catch((err) => alert(err.message));
  };

  const handleBookRoute = () => {
    fetch(`${api}/api/booked-routes/1/${id}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Already booked");
        alert("Route booked!");
      })
      .catch((err) => alert(err.message));
  };


  if (!location || !location.latitude || !location.longitude) {
    return <p>Location data is not available.</p>;
  }
  
  const destination = {
    lat: parseFloat(location.latitude),
    lng: parseFloat(location.longitude),
  };  

  return (
    <>
      <Nav />
      <div style={styles.container}>
        {location.imageUrl && (
          <img
            src={location.imageUrl}
            alt={location.name}
            style={styles.image}
          />
        )}
        <div style={styles.details}>
          <h1>{location.name}</h1>
          <p style={styles.description}>{location.description}</p>
          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>
          <div style={styles.buttons}>
            <button onClick={handleAddFavorite} style={styles.button}>
              ❤️ Like
            </button>
            <button onClick={handleBookRoute} style={styles.bookButton}>
              🧭 Book Route
            </button>
          </div>
        </div>
      </div>
<h2 style={styles.mapTitle}>Find your way to us!</h2>
      <div style={styles.mapWrapper}>
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapContainerStyle={styles.map}
            center={destination}
            zoom={13}
          >
            <Marker position={destination} />
            {userLocation && <Marker position={userLocation} />}
            {userLocation && location && !directions && (
  <DirectionsService
    options={{
      origin: userLocation,
      destination,
      travelMode: "DRIVING",
    }}
    callback={handleDirectionsCallback}
  />
)}


            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </LoadScript>
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
  mapWrapper: {
    width: "90%",
    height: "400px",
    padding: "2rem",
    margin: "0 auto",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
  },
  mapTitle: {
    textAlign: "center",
  }
};

export default LocationDetails;
