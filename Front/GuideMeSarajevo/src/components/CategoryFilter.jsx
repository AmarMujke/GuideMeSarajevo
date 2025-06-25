import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchLocationsByCategory } from "../helpers/api.js";
import { useAuth } from "../context/AuthContext"; 
import "./CategoryFilter.css";

function CategoryFilter() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locations, setLocations] = useState([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].categoryId);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchLocationsByCategory(selectedCategory)
        .then((data) => setLocations(data))
        .catch((error) =>
          console.error("Error fetching locations:", error)
        );
    }
  }, [selectedCategory]);

  return (
    <div className="category-filter">
      <h1 style={{textAlign: 'center'}}>Filter Locations by Category</h1>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryId}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="location-grid">
      {locations.length > 0 ? (
        locations.map((loc) => (
          <div key={loc.locationId} 
          className="location-card"
          onClick={() => isLoggedIn ? navigate(`/location/${loc.locationId}`) : navigate('/register')}
          >
            {loc.imageUrl && (
              <img
                src={loc.imageUrl}
                alt={loc.name}
                className="location-image"
              />
            )}
            <div className="location-info">
              <h3 className="location-title">{loc.name}</h3>
              <p className="location-description">{loc.description}</p>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center" }}>No locations found.</p>
      )}
    </div>
</div>
  );
}

export default CategoryFilter;
