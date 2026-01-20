import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HotelSection() {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:8085/hotelmanager/hotels");
        if (response.ok) {
          const data = await response.json();
          setHotels(data);
        } else {
          setError("Failed to fetch hotels.");
        }
      } catch (err) {
        setError("Error fetching hotels: " + err.message);
      }
    };

    fetchHotels();
  }, []);

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
    <div
      style={{
        padding: "20px",
        backgroundColor: "white",
      }}
    >
      <h2 style={{ color: "black", marginBottom: "30px" }}>Discover Your Next Stay...</h2>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "30px",
          paddingBottom: "10px",
        }}
      >
        {hotels.length === 0 ? (
          <p style={{ color: "black" }}>No hotels available.</p>
        ) : (
          hotels.map((hotel) => (
            <div
              key={hotel.hotelId}
              style={{
                minWidth: "300px",
                backgroundColor: "#fff",
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={
                  hotel.hotelImgUrl ||
                  "https://via.placeholder.com/300x180?text=No+Image"
                }
                alt={hotel.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "15px", flexGrow: 1 }}>
                <h3
                  style={{
                    margin: "0 0 10px",
                    color: "#171717",
                    fontWeight: "bold",
                  }}
                >
                  {hotel.name}
                </h3>
                <p style={{ margin: "5px 0", color: "#4a4a4a" }}>
                  <strong>Location: </strong>
                  {hotel.location}
                </p>
                <p style={{ margin: "5px 0", color: "#4a4a4a" }}>
                  <strong>Contact: </strong>
                  {hotel.contactNumber}
                </p>
                <p style={{ margin: "5px 0", color: "#4a4a4a" }}>
                  <strong>Rating: </strong>
                  {hotel.rating ?? "N/A"}
                </p>
              </div>

              <button
                style={{
                  position: "absolute",
                  bottom: "15px",
                  right: "15px",
                  backgroundColor: "#FFA700",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "black",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                  userSelect: "none",
                  transition: "background-color 0.3s",
                }}
                onClick={() => handleBookNow(hotel.hotelId)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#cc8400")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FFA700")
                }
              >
                View
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
