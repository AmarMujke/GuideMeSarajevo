import { useEffect, useState } from "react";
import "./PopularSection.css";

const PopularSection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
    fetch(`http://localhost:8080/api/locations/public/category/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const withImages = data.filter((loc) => loc.imageUrl !== null);
        setLocations(withImages);
      })
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setLocations([]);
      });
  };

  return (
    <div className="popular-section">
      <h2 className="section-title">Popular Sites</h2>
      <p className="section-subtitle">
        Explore popular sites around the city! Use one of the suggested options and feel the spirit of Sarajevo.
      </p>

      <div className="category-scroll">
        {categories.map((category) => (
          <button
            key={category.categoryId}
            className={`category-btn ${selectedCategoryId === category.categoryId ? "active" : ""}`}
            onClick={() => handleCategoryClick(category.categoryId)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="location-grid">
        {locations.map((loc) => (
          <div className="location-card" key={loc.locationId}>
            <img src={loc.imageUrl} alt={loc.name} className="location-img" />
            <div className="location-details">
              <h3>{loc.name}</h3>
              <p>{loc.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularSection;
