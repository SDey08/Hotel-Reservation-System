import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRooms() {
  const navigate = useNavigate();

  const [hotelId, setHotelId] = useState("");
  const [roomType, setRoomType] = useState("SINGLE");
  const [pricePerNight, setPricePerNight] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [roomImgUrl, setRoomImgUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hotelId) {
      alert("Please enter Hotel ID");
      return;
    }
    if (!pricePerNight) {
      alert("Please enter Price Per Night");
      return;
    }

    const payload = {
      roomType,
      pricePerNight: parseFloat(pricePerNight),
      status,
      ...(roomImgUrl.trim() !== "" && { roomImgUrl: roomImgUrl.trim() }),
    };

    try {
      let token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8085/hotelmanager/auth/rooms/hotel/${hotelId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Room added successfully!");
        navigate("/admindashboard");
      } else {
        const errorText = await response.text();
        alert(`Failed to add room: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding room");
    }
  };

  const containerStyle = {
    backgroundColor: "#000",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  };

  const formWrapperStyle = {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '2.5rem 3rem',
    maxWidth: '720px',
    width: '100%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    color: '#000'
  };

  const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "0.25rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.6rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const buttonStyle = {
    backgroundColor: '#ffa700',
    color: 'black',
    fontWeight: '700',
    fontSize: '15px',
    padding: '12px 50px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  const backButtonStyle = {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: '8px 16px',
    backgroundColor: '#ffa700',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: "15px",
    color: 'black',
    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
    transition: 'background-color 0.3s'
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate("/admindashboard")} style={backButtonStyle}>
        ← Back
      </button>

      <form onSubmit={handleSubmit} style={formWrapperStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Add Room</h2>

        <label style={labelStyle}>Hotel ID:</label>
        <input
          type="number"
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>Room Type:</label>
        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="SINGLE">Single</option>
          <option value="DOUBLE">Double</option>
          <option value="SUITE">Suite</option>
          <option value="DELUXE">Deluxe</option>
        </select>

        <label style={labelStyle}>Price Per Night:</label>
        <input
          type="number"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          required
          min="0"
          step="0.01"
          style={inputStyle}
        />

        <label style={labelStyle}>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="AVAILABLE">Available</option>
          <option value="BOOKED">Booked</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        <label style={labelStyle}>Room Image URL (optional):</label>
        <input
          type="text"
          value={roomImgUrl}
          onChange={(e) => setRoomImgUrl(e.target.value)}
          placeholder="Paste image URL"
          style={inputStyle}
        />

        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e69500")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#FFA700")}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
