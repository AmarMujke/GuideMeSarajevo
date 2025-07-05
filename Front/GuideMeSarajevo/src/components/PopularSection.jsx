import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "./PopularSection.css";

const PopularSection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [locations, setLocations] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); 
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${api}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        const fetchValidCategories = async () => {
          const validCategories = [];
          for (let cat of data) {
            const res = await fetch(`${api}/api/locations/public/category/${cat.categoryId}`);
            const locs = await res.json();
            const hasImages = locs.some((l) => l.imageUrl !== null);
            if (hasImages) validCategories.push(cat);
          }
          setCategories(validCategories);
          if (validCategories.length > 0) {
            setSelectedCategoryId(validCategories[0].categoryId);
            handleCategoryClick(validCategories[0].categoryId);
          }
        };
        fetchValidCategories();
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
    fetch(`${api}/api/locations/public/category/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
      })
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setLocations([]);
      });
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  const handleCardClick = (locationId) => {
    if (isLoggedIn) {
      navigate(`/location/${locationId}`);
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="popular-section">
      <h2 className="section-title">Popular Sites</h2>
      <p className="section-subtitle">
        Explore popular sites around the city! Use one of the suggested options and feel the spirit of Sarajevo.
      </p>

      <div className="category-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left")}>&lt;</button>
        <div className="category-scroll" ref={scrollRef}>
          {categories.slice(1, 6).map((category) => (
            <button
              key={category.categoryId}
              className={`category-btn ${selectedCategoryId === category.categoryId ? "active" : ""}`}
              onClick={() => handleCategoryClick(category.categoryId)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll("right")}>&gt;</button>
      </div>

      <div className="location-grid">
        {locations.map((loc) => (
          <div
            className="location-card"
            key={loc.locationId}
            onClick={() => handleCardClick(loc.locationId)} 
          >
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
