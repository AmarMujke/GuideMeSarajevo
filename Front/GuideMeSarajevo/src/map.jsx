import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./map.css";

function MapWithSearchBar() {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearchQueryChange(e) {
    setSearchQuery(e.target.value);
  }

  return (
    <div className="map-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Search for a location"
        />
      </div>
      <div className="google-map">
        <LoadScript googleMapsApiKey="AIzaSyCc7ev7o8HXbTDHvsPj6gUQ7CBwjMfMUMw">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={10}
          >
            <Marker position={mapCenter} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default MapWithSearchBar;
