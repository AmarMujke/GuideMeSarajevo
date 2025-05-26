import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function LocationDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/locations/${id}`)
      .then((res) => res.json())
      .then((data) => setLocation(data))
      .catch((err) => console.error("Error loading location:", err));
  }, [id]);

  if (!location) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{location.name}</h1>
      {location.imageUrl && (
        <img
          src={location.imageUrl}
          alt={location.name}
          style={{ maxWidth: "100%", height: "auto", borderRadius: "12px" }}
        />
      )}
      <p style={{ marginTop: "1rem" }}>{location.description}</p>
      <p>
        <strong>Latitude:</strong> {location.latitude}
      </p>
      <p>
        <strong>Longitude:</strong> {location.longitude}
      </p>
    </div>
  );
}

export default LocationDetails;
