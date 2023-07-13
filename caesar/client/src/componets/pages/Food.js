import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";

// Set your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoibWF0dGhld3N0YW5kaXNoIiwiYSI6ImNsamhyMTFjMzAxY2MzZnA1cnA1bjVnZHYifQ.lAIJ-JvzD7DLfUkgB6apKg";

const App = () => {
  const [zipCode, setZipCode] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-74.5, 40],
        zoom: 9,
      });

      newMap.addControl(new mapboxgl.NavigationControl());

      setMap(newMap);
    };

    if (!map) {
      initializeMap();
    }
  }, [map]);

  useEffect(() => {
    if (map && restaurants.length > 0) {
      // Clear existing markers
      markers.forEach((marker) => marker.remove());
      setMarkers([]);

      restaurants.forEach((restaurant) => {
        const [longitude, latitude] = restaurant.geometry.coordinates;

        const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]);

        const popup = new mapboxgl.Popup().setHTML(
          `<h3>${restaurant.place_name}</h3>`
        );

        marker.setPopup(popup);

        marker.addTo(map);
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
      });

      if (markers.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        markers.forEach((marker) => bounds.extend(marker.getLngLat()));

        map.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
        });
      }
    }
  }, [map, restaurants, markers]);

  const handleZipCodeChange = (event) => {
    setZipCode(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json?types=postcode&access_token=${mapboxgl.accessToken}`
      );

      const [longitude, latitude] = response.data.features[0].center;

      const restaurantsResponse = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/restaurant.json?proximity=${longitude},${latitude}&access_token=${mapboxgl.accessToken}`
      );

      setRestaurants(restaurantsResponse.data.features);
    } catch (error) {
      console.error("Error searching for restaurants:", error);
    }
  };

  return (
    <div>
      <div id="map" style={{ height: "400px" }}></div>

      <input
        type="text"
        value={zipCode}
        onChange={handleZipCodeChange}
        placeholder="Enter ZIP code"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default App;
