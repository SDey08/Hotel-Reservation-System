import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowHotels() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:8085/hotelmanager/hotels");

        if (response.ok) {
          const data = await response.json();
          setHotels(data);
        } else {
          console.error("Failed to fetch hotels");
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Hotel List
      </h2>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Hotel Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
        <thead>
          <tr style={{ backgroundColor: "#FFA700" }}>
            <th style={tableHeadStyle}>Hotel ID</th>
            <th style={tableHeadStyle}>Name</th>
            <th style={tableHeadStyle}>Location</th>
            <th style={tableHeadStyle}>Contact</th>
            <th style={tableHeadStyle}>Rating</th>
            <th style={tableHeadStyle}>Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <tr key={hotel.hotelId}>
                <td style={tableCellStyle}>{hotel.hotelId}</td>
                <td style={tableCellStyle}>{hotel.name}</td>
                <td style={tableCellStyle}>{hotel.location}</td>
                <td style={tableCellStyle}>{hotel.contactNumber}</td>
                <td style={tableCellStyle}>{hotel.rating || "N/A"}</td>
                <td style={tableCellStyle}>
                  {hotel.hotelImgUrl ? (
                    <img src={hotel.hotelImgUrl} alt={hotel.name} style={{ width: "80px", borderRadius: "5px" }} />
                  ) : (
                    "No Image"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tableCellStyle} colSpan="6" align="center">
                No hotels found
              </td>
            </tr>
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
