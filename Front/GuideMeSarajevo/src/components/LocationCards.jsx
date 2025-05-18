import { useEffect, useState } from "react";
import "./LocationCards.css";

const LocationCards = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/locations")
      .then((res) => res.json())
      .then((data) => {
        const withImages = data.filter((loc) => loc.imageUrl !== null);
        setLocations(withImages.slice(0, 3));
      })
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  return (
    <div className="card-container">
      {locations.map((loc) => (
        <div key={loc.locationId} className="location-card">
          <img src={loc.imageUrl} alt={loc.name} className="location-image" />
          <h3 className="location-title">{loc.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default LocationCards;
