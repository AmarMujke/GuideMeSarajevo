import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import "./map.css";

function Map() {
  const [mapCenter, setMapCenter] = useState({ lat: 43.8563, lng: 18.4131 }); // Sarajevo
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const filtered = locations.filter((loc) => {
      const matchesName = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
  
      const matchesCategory =
        !selectedCategory ||
        loc.categories?.some((cat) => cat.categoryId === selectedCategory);
  
      return matchesName && matchesCategory;
    });
  
    setFilteredLocations(filtered);
  
    if (filtered.length > 0) {
      setMapCenter({ lat: filtered[0].latitude, lng: filtered[0].longitude });
    }
  }, [searchQuery, selectedCategory, locations]);
  
  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);
  
  useEffect(() => {
    fetch("http://localhost:8080/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        setFilteredLocations(data);
      })
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  useEffect(() => {
    const filtered = locations.filter((loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLocations(filtered);

    if (filtered.length > 0) {
      setMapCenter({ lat: filtered[0].latitude, lng: filtered[0].longitude });
    }
  }, [searchQuery, locations]);

  return (
    <div className="map-container">
   {/* <div className="category-dropdown">
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <option value="">All Categories</option>
    {categories.map((cat) => (
      <option key={cat.categoryId} value={cat.categoryId}>
        {cat.name}
      </option>
    ))}
  </select>
</div> */}

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location"
        />
      </div>
      <div className="google-map">
        <LoadScript googleMapsApiKey="AIzaSyCc7ev7o8HXbTDHvsPj6gUQ7CBwjMfMUMw">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={13}
          >
            {filteredLocations.map((loc) => (
              <Marker
                key={loc.locationId}
                position={{ lat: loc.latitude, lng: loc.longitude }}
                onClick={() => setSelectedLocation(loc)}
              />
            ))}

            {selectedLocation && (
              <InfoWindow
                position={{
                  lat: selectedLocation.latitude,
                  lng: selectedLocation.longitude,
                }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  <h4>{selectedLocation.name}</h4>
                  <p>{selectedLocation.description}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default Map;
