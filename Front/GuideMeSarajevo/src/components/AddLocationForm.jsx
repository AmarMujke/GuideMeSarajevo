import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Select from "react-select";
import { fetchWithAuth } from "../helpers/api";
import "./AddLocationForm.css";

function AddLocationForm({ userId, onAdded, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState({
    lat: 43.8563,
    lng: 18.4131,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: position.lat,
    longitude: position.lng,
    file: null,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    console.log("AddLocationForm userId:", userId);
    const fetchCategories = async () => {
      try {
        const data = await fetchWithAuth("/api/categories");
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err.message);
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setPosition({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID is missing!");
      return;
    }

    if (!formData.name || !formData.description || selectedCategories.length === 0) {
      setError("Please fill in all required fields and select at least one category.");
      return;
    }

    try {
      let newLocation;
      if (formData.file) {
        const data = new FormData();
        data.append("file", formData.file);
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("latitude", formData.latitude);
        data.append("longitude", formData.longitude);
        data.append("categories", JSON.stringify(selectedCategories.map((c) => c.value)));
        data.append("createdBy", userId);

        console.log("Submitting FormData for /api/locations/with-image:", {
          name: formData.name,
          description: formData.description,
          latitude: formData.latitude,
          longitude: formData.longitude,
          categories: selectedCategories.map((c) => c.value),
          createdBy: { userId: userId },
          file: formData.file?.name,
        });

        newLocation = await fetchWithAuth("/api/locations/with-image", {
          method: "POST",
          body: data,
        });
      } else {
        const jsonData = {
          name: formData.name,
          description: formData.description,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          categories: selectedCategories.map((c) => c.value),
          createdBy: { userId: userId },
          imageUrl: "",
        };

        console.log("Submitting JSON for /api/locations:", jsonData);

        newLocation = await fetchWithAuth("/api/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        });
      }

      console.log("New location response:", newLocation);
      onAdded({ ...formData, categories: selectedCategories.map((c) => c.value), locationId: newLocation.locationId || Date.now() });
      setFormData({
        name: "",
        description: "",
        latitude: position.lat,
        longitude: position.lng,
        file: null,
      });
      setSelectedCategories([]);
      setError(null);
    } catch (err) {
      console.error("Error adding location:", err.message);
      setError(`Failed to add location: ${err.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Location</h2>
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
          name="latitude"
          type="number"
          step="any"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
        />
        <input
          name="longitude"
          type="number"
          step="any"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
        />
        <div className="categories">
          <label htmlFor="categorySelect">Categories:</label>
          <Select
            id="categorySelect"
            isMulti
            options={categoryOptions}
            value={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>
        <input type="file" name="file" onChange={handleChange} />
        <div className="form-buttons">
          <button type="submit">Add Location</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>

      <hr />

      <h3>Click on Map to Set Location</h3>
      {isLoaded ? (
        <GoogleMap
          center={position}
          zoom={13}
          mapContainerStyle={{ width: "100%", height: "400px", marginTop: "1rem" }}
          onClick={handleMapClick}
        >
          <Marker position={position} />
        </GoogleMap>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}

export default AddLocationForm;