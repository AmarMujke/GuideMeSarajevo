import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Select from "react-select";
import { fetchWithAuth } from "../helpers/api";
import "./AddRouteForm.css";

function AddRouteForm({ userId, onAdded, onCancel }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    console.log("AddRouteForm userId:", userId);
    const fetchLocations = async () => {
      try {
        const data = await fetchWithAuth("/api/locations");
        setLocations(data);
      } catch (err) {
        console.error("Failed to load locations:", err.message);
        setError("Failed to load locations");
      }
    };
    fetchLocations();
  }, []);

  const locationOptions = locations.map((loc) => ({
    value: loc.locationId,
    label: loc.name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID is missing!");
      return;
    }

    if (!formData.name || !formData.description || !formData.price || selectedLocationIds.length === 0) {
      setError("Please fill in all required fields and select at least one location.");
      return;
    }

    try {
      const jsonData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        itinerary: selectedLocationIds.join(","), // Convert array to comma-separated string
        createdBy: parseInt(userId), // Send as Integer
        imageUrl: "",
      };

      console.log("Submitting JSON for /api/routes:", jsonData);

      const newRoute = await fetchWithAuth("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      console.log("New route response:", newRoute);
      onAdded({ ...formData, itinerary: selectedLocationIds, routeId: newRoute.routeId || Date.now() });
      setFormData({
        name: "",
        description: "",
        price: "",
      });
      setSelectedLocationIds([]);
      setError(null);
    } catch (err) {
      console.error("Error adding route:", err.message);
      setError(`Failed to add route: ${err.message}`);
    }
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const clickedLocation = locations.find(
      (loc) =>
        Math.abs(loc.latitude - lat) < 0.01 &&
        Math.abs(loc.longitude - lng) < 0.01
    );
    if (clickedLocation && !selectedLocationIds.includes(clickedLocation.locationId)) {
      setSelectedLocationIds((prev) => [...prev, clickedLocation.locationId]);
    }
  }, [locations, selectedLocationIds]);

  return (
    <div className="form-container">
      <h2>Add New Route</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <div className="locations">
          <label htmlFor="locationSelect">Itinerary Locations:</label>
          <Select
            id="locationSelect"
            isMulti
            options={locationOptions}
            value={locationOptions.filter((opt) =>
              selectedLocationIds.includes(opt.value)
            )}
            onChange={(selectedOptions) => {
              const selectedIds = selectedOptions.map((opt) => opt.value);
              setSelectedLocationIds(selectedIds);
            }}
          />
        </div>
        <div className="form-buttons">
          <button type="submit">Add Route</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>

      <hr />

      <h3>Click on Map to Add Locations to Itinerary</h3>
      {isLoaded ? (
        <GoogleMap
          center={{
            lat: 43.8563,
            lng: 18.4131,
          }}
          zoom={13}
          mapContainerStyle={{ width: "100%", height: "400px", marginTop: "1rem" }}
          onClick={handleMapClick}
        >
          {locations
            .filter((loc) => selectedLocationIds.includes(loc.locationId))
            .map((loc) => (
              <Marker
                key={loc.locationId}
                position={{
                  lat: parseFloat(loc.latitude),
                  lng: parseFloat(loc.longitude),
                }}
                label={loc.name}
              />
            ))}
        </GoogleMap>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}

export default AddRouteForm;