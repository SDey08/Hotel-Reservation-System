import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowRooms() {
  const [hotelId, setHotelId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    setError(null);
    if (!hotelId) {
      alert("Please enter a Hotel ID");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8085/hotelmanager/rooms/hotel/${hotelId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          setRooms([]);
          setError(`No rooms found for Hotel ID ${hotelId}`);
        } else {
          setRooms(data);
        }
      } else if (response.status === 404) {
        setRooms([]);
        setError(`No rooms found for Hotel ID ${hotelId}`);
      } else {
        setRooms([]);
        setError("Failed to fetch rooms");
      }
    } catch (error) {
      setRooms([]);
      setError("Error fetching rooms: " + error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchRooms();
    }
  };

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", padding: "20px" }}>
      <button
        onClick={() => navigate("/admindashboard")}
        style={{
          backgroundColor: "#FFA700",
          color: "black",
          border: "none",
          padding: "8px 15px",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
          fontWeight: "700",
          fontSize: "15px"
        }}
      >
        ← Back
      </button>

      <h2 style={{ color: "white", textAlign: "center", marginBottom: "20px" }}>
        Show Rooms by Hotel ID
      </h2>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Enter Hotel ID..."
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: "8px",
            width: "200px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={fetchRooms}
          style={{
            backgroundColor: "#FFA700",
            color: "black",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "15px"
          }}
        >
          Search
        </button>
      </div>

      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
        <thead>
          <tr style={{ backgroundColor: "#FFA700" }}>
            <th style={tableHeadStyle}>Room ID</th>
            <th style={tableHeadStyle}>Room Type</th>
            <th style={tableHeadStyle}>Price per Night</th>
            <th style={tableHeadStyle}>Status</th>
            <th style={tableHeadStyle}>Image</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.roomId}>
                <td style={tableCellStyle}>{room.roomId}</td>
                <td style={tableCellStyle}>{room.roomType}</td>
                <td style={tableCellStyle}>₹{room.pricePerNight}</td>
                <td style={tableCellStyle}>{room.status}</td>
                <td style={tableCellStyle}>
                  {room.roomImgUrl ? (
                    <img
                      src={room.roomImgUrl}
                      alt={`Room ${room.roomId}`}
                      style={{ width: "80px", borderRadius: "5px" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
              </tr>
            ))
          ) : (
            !error && (
              <tr>
                <td style={tableCellStyle} colSpan="5" align="center">
                  Please enter a Hotel ID and search.
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

const tableHeadStyle = {
  padding: "10px",
  textAlign: "left",
  fontWeight: "bold",
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};
