import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function HotelPage() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleBookNow = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate(`/reservation/${hotelId}`);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    async function fetchHotelAndRooms() {
      try {
        const hotelRes = await fetch(`http://localhost:8085/hotelmanager/hotels/${hotelId}`);
        const hotelData = await hotelRes.json();
        setHotel(hotelData);

        const roomsRes = await fetch(`http://localhost:8085/hotelmanager/rooms/hotel/${hotelId}`);
        const roomsData = await roomsRes.json();
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching hotel or rooms:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHotelAndRooms();
  }, [hotelId]);

  if (loading) {
    return <p>Loading hotel details...</p>;
  }

  if (!hotel) {
    return <p>Hotel not found.</p>;
  }

  // Group rooms by roomType to get unique types with representative room
  const roomGroups = rooms.reduce((acc, room) => {
    if (!acc[room.roomType]) {
      acc[room.roomType] = {
        room: room,
      };
    }
    return acc;
  }, {});

  // Convert to array
  const uniqueRooms = Object.values(roomGroups);

  // Map room type to capacity number
  const capacityMap = {
    single: 1,
    double: 2,
    suite: 3,
    deluxe: 4,
  };

  // Helper to get capacity by roomType (case insensitive)
  const getCapacity = (type) => {
    if (!type) return "N/A";
    return capacityMap[type.toLowerCase()] ?? "N/A";
  };


  return (
    
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
       {/* Go Home Button */}
       <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "10px",
              marginBottom: "15px",
              padding: "10px 20px",
              backgroundColor: "#FFA700",
              border: "none",
              borderRadius: "10px",
              color: "black",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "15px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#cc8400")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFA700")}
          >← Back
          </button>
      {/* Hotel Image */}
      {hotel.hotelImgUrl ? (
        <img
          src={hotel.hotelImgUrl}
          alt={hotel.name}
          style={{
            width: "100%",
            height: "500px",
            objectFit: "fill",
            borderRadius: "12px",
            marginBottom: "5px",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "400px",
            backgroundColor: "#ddd",
            borderRadius: "12px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px",
            color: "#666",
          }}
        >
          No Image Available
        </div>
      )}
  
      {/* Hotel Info */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ marginTop: "20px", fontFamily: '"Arizonia", cursive', fontSize: "50px", color: '#2c1810' }}>
            {hotel.name}
          </h1>
          <p style={{ fontSize: "20px", fontWeight: "500", marginTop: "-18px", color: "#2c1810" }}>
            <i>{hotel.location}</i>
          </p>
  
          <p style={{ marginTop: "10px", fontSize: "16px", lineHeight: "1.5", fontWeight: "bold" }}>
            Contact: <span>{hotel.contactNumber || "No description available."}</span>
          </p>
  
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            Rating: <span>{hotel.rating ?? "N/A"}</span>⭐
          </p>
  
         
        </div>
  
        <button
          onClick={handleBookNow}
          style={{
            padding: "12px 24px",
            marginTop: "30px",
            backgroundColor: "#FFA700",
            border: "none",
            borderRadius: "8px",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
            height: "fit-content",
            fontSize: "18px",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e59400")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFA700")}
        >
          Book Now
        </button>

      </div>
 {/* Our Rooms Section */}
<div style={{ marginTop: "40px" }}>
  <h2
    style={{
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "#2c1810",
    }}
  >
    A Glimpse of Our Rooms...
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      gap: "10px",
      overflowX: "auto", // horizontal scroll if needed
      paddingBottom: "10px",
    }}
  >
    {rooms.length > 0 ? (
      rooms
        .filter((room) => room.roomImgUrl && room.roomImgUrl.trim() !== "")
        .map((room) => (
          <div
            key={room.roomId}
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <img
              src={room.roomImgUrl}
              alt={room.roomType}
              style={{
                width: "100%",
                height: "120px",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                padding: "8px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {room.roomType}
            </div>
          </div>
        ))
    ) : (
      <p>No rooms available.</p>
    )}
  </div>
</div>

    </div>
  );
  
}
