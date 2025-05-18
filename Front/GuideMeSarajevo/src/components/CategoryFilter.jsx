// components/CategoryFilter.jsx
import React, { useEffect, useState } from "react";
import { fetchCategories } from "../api.js";
import './CategoryFilter.css'

function CategoryFilter({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((data) => {console.log(data);setCategories(data)})
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <select onChange={(e) => onSelectCategory(e.target.value)}>
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryId}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
