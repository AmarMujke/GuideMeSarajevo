// components/EditLocationForm.jsx
import { useState } from "react";
import "./EditLocationForm.css";

export default function EditLocationForm({ initial, onSaved, onCancel }) {
  const [formData, setFormData] = useState({
    name: initial.name,
    description: initial.description,
    latitude: initial.latitude,
    longitude: initial.longitude,
    file: null
  });
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there's a file, use multipart; otherwise JSON
    if (formData.file) {
      const data = new FormData();
      data.append("file", formData.file);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);

      const res = await fetch(
        `http://localhost:8080/api/locations/with-image?name=${encodeURIComponent(
          formData.name
        )}&description=${encodeURIComponent(
          formData.description
        )}&latitude=${formData.latitude}&longitude=${
          formData.longitude
        }`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: data,
        }
      );
      if (res.ok) {
        const newDto = await res.json();
        onSaved(newDto);
      }
    } else {
      // JSON update
      const res = await fetch(
        `http://localhost:8080/api/locations/${initial.locationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            latitude: formData.latitude,
            longitude: formData.longitude,
            imageUrl: initial.imageUrl  // keep existing
          })
        }
      );
      if (res.ok) {
        onSaved({ ...initial, ...formData, imageUrl: initial.imageUrl });
      }
    }
  };

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
        <div className="edit-btns">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
