import { useState } from "react";
import "./AddLocationForm.css";

function AddLocationForm() {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      file: null
    });
  
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const data = new FormData();
      data.append("file", formData.file);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
  
      await fetch("http://localhost:8080/api/locations/with-image", {
        method: "POST",
        body: data,
      });
    };
  
    return (
        <div className="form-container">
        <h2>Add New Location</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} />
                <textarea name="description" placeholder="Description" onChange={handleChange} />
                <input name="latitude" placeholder="Latitude" onChange={handleChange} />
                <input name="longitude" placeholder="Longitude" onChange={handleChange} />
                <input type="file" name="file" onChange={handleChange} />
                <button type="submit">Add Location</button>
            </form>
      </div>
    );
  }
  
  export default AddLocationForm;