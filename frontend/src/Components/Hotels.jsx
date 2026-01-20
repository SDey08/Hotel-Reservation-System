import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar.jsx';
export default function HotelSection() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:8085/hotelmanager/hotels");
        if (response.ok) {
          const data = await response.json();
          setHotels(data);
          setFilteredHotels(data);
        } else {
          setError("Failed to fetch hotels.");
        }
      } catch (err) {
        setError("Error fetching hotels: " + err.message);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setFilteredHotels(hotels);
      return;
    }

    const filtered = hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(query) ||
        hotel.location.toLowerCase().includes(query)
    );
    setFilteredHotels(filtered);
  }, [searchQuery, hotels]);

  const handleBookNow = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  if (error) {
    return (
      <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
        {error}
      </div>
    );
  }

  return (
   <>
    <Navbar/>
    <div style={{ maxWidth: "70vw", margin: "2rem auto", padding: "0 15px" }}>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by hotel name or location"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 20px",
          fontSize: "16px",
          borderRadius: "24px",
          border: "1.5px solid grey",
          marginBottom: "25px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      {filteredHotels.length === 0 ? (
        <p style={{ color: "#555", textAlign: "center" }}>No hotels found.</p>
      ) : (
        filteredHotels.map((hotel) => (
          <div
            key={hotel.hotelId}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.35)",
              marginBottom: "20px",
              padding: "12px 15px",
              cursor: "default",
              userSelect: "none",
            }}
          >
            {/* Left: Hotel Image */}
            <img
              src={
                hotel.hotelImgUrl ||
                "https://via.placeholder.com/100?text=No+Image"
              }
              alt={hotel.name}
              style={{
                width: "200px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "12px",
                flexShrink: 0,
                marginRight: "15px",
              }}
            />

            {/* Right: Hotel Details */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {hotel.name}
              </h3>
              <p style={{ margin: "0 0 4px", color: "#4a4a4a", fontSize: "14px" }}>
                <strong>Location:</strong> {hotel.location}
              </p>
              <p style={{ margin: "0 0 4px", color: "#4a4a4a", fontSize: "14px" }}>
                <strong>Contact:</strong> {hotel.contactNumber}
              </p>
              <p style={{ margin: "0 0 8px", color: "#4a4a4a", fontSize: "14px" }}>
                <strong>Rating:</strong> {hotel.rating ?? "N/A"}
              </p>

              <button
                onClick={() => handleBookNow(hotel.hotelId)}
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#FFA700",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "black",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                  userSelect: "none",
                  transition: "background-color 0.3s",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#cc8400")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFA700")}
              >
                View
              </button>
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
}
