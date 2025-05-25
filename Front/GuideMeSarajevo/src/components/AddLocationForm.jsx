import { useState } from "react";
import "./AddLocationForm.css";
import { useEffect } from "react";
import Select from "react-select";

function AddLocationForm({ userId }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    file: null,
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const categoryOptions = categories.map((cat) => ({
    value: cat.categoryId,
    label: cat.name,
  }));

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID is missing!");
      return;
    }

    if (formData.file) {
      // Image upload path
      const data = new FormData();
      data.append("file", formData.file);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("createdBy", userId); // 👈 send user ID

      await fetch("http://localhost:8080/api/locations/with-image", {
        method: "POST",
        body: data,
      });
      window.location.reload();
    } else {
      // JSON-only path
      const jsonData = {
        name: formData.name,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        createdBy: { userId: userId },
        categories: selectedCategoryIds.map((id) => ({ categoryId: id })),
      };

      await fetch("http://localhost:8080/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
      window.location.reload();
    }

    // Optional: reset form
    setFormData({
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      file: null,
    });
  };

  return (
    <div className="form-container">
      <h2>Add New Location</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
        />
        <input
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
        />
        <div className="categories">
          <label htmlFor="categorySelect">Categories:</label>
          <Select
            id="categorySelect"
            isMulti
            options={categoryOptions}
            value={categoryOptions.filter((opt) =>
              selectedCategoryIds.includes(opt.value)
            )}
            onChange={(selectedOptions) => {
              const selectedIds = selectedOptions.map((opt) => opt.value);
              setSelectedCategoryIds(selectedIds);
            }}
          />
        </div>
        <small>Hold Ctrl (Cmd on Mac) to select multiple</small>

        <input type="file" name="file" onChange={handleChange} />
        <button type="submit">Add Location</button>
      </form>
    </div>
  );
}

export default AddLocationForm;
