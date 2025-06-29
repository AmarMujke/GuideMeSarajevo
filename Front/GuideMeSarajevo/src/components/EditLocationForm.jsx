import { useState, useEffect, useRef } from "react";
import { fetchWithAuth } from "../helpers/api";
import "./EditLocationForm.css";

export default function EditLocationForm({ initial, onSaved, onCancel }) {
  const [formData, setFormData] = useState({
    name: initial.name,
    description: initial.description,
    latitude: initial.latitude,
    longitude: initial.longitude,
    file: null,
  });
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let updated;
      if (formData.file) {
        const data = new FormData();
        data.append("file", formData.file);
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("latitude", formData.latitude);
        data.append("longitude", formData.longitude);

        console.log("Submitting FormData for /api/locations/with-image:", {
          name: formData.name,
          description: formData.description,
          latitude: formData.latitude,
          longitude: formData.longitude,
          file: formData.file?.name,
        });

        await fetchWithAuth("/api/locations/with-image", {
          method: "POST",
          body: data,
        });
        updated = { ...initial, ...formData };
      } else {
        const jsonData = {
          name: formData.name,
          description: formData.description,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          imageUrl: initial.imageUrl,
        };

        console.log("Submitting JSON for /api/locations/", initial.locationId, ":", jsonData);

        updated = await fetchWithAuth(`/api/locations/${initial.locationId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        });
      }
      onSaved(updated);
    } catch (err) {
      console.error("Error saving location:", err.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(interval);
        console.log("Google Maps loaded, initializing map");

        const map = new window.google.maps.Map(document.getElementById("edit-map"), {
          center: {
            lat: parseFloat(formData.latitude) || 43.8563,
            lng: parseFloat(formData.longitude) || 18.4131,
          },
          zoom: 13,
        });
        mapRef.current = map;

        const marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(formData.latitude) || 43.8563,
            lng: parseFloat(formData.longitude) || 18.4131,
          },
          map: map,
          draggable: true,
        });
        markerRef.current = marker;

        map.addListener("click", (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
          marker.setPosition({ lat, lng });
        });

        marker.addListener("dragend", (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
        });
      } else {
        console.log("Waiting for Google Maps to load...");
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const lat = parseFloat(formData.latitude) || 43.8563;
      const lng = parseFloat(formData.longitude) || 18.4131;
      mapRef.current.setCenter({ lat, lng });
      markerRef.current.setPosition({ lat, lng });
    }
  }, [formData.latitude, formData.longitude]);

  return (
    <div className="edit-form-container">
      <h4>Edit Location</h4>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          placeholder="Name"
          onChange={handleChange}
        />
        <textarea
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
        />
        <input
          name="latitude"
          value={formData.latitude}
          placeholder="Latitude"
          onChange={handleChange}
        />
        <input
          name="longitude"
          value={formData.longitude}
          placeholder="Longitude"
          onChange={handleChange}
        />
        <input type="file" name="file" onChange={handleChange} />

        <div id="edit-map" style={{ height: "300px", width: "100%", marginTop: "1rem" }}></div>

        <div className="edit-btns">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}