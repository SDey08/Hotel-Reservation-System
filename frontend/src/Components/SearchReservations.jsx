import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchReservations() {
  const [reservations, setReservations] = useState([]);
  const [hotelId, setHotelId] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const fetchReservations = async () => {
    if (!hotelId || !date) {
      alert("Please enter Hotel ID and Date");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Authorization token not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `http://localhost:8085/reservation/searchByHotelAndDate?hotelId=${hotelId}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        console.error("Failed to fetch reservations");
        setReservations([]);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setReservations([]);
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
        Hotel Reservations By Date
      </h2>

      {/* Search Form */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "10px" }}>
        <input
          type="number"
          placeholder="Hotel ID"
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          style={{
            padding: "8px",
            width: "120px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={fetchReservations}
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

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
        <thead>
          <tr style={{ backgroundColor: "#FFA700" }}>
            <th style={tableHeadStyle}>Reservation ID</th>
            <th style={tableHeadStyle}>Customer ID</th>
            <th style={tableHeadStyle}>Hotel ID</th>
            <th style={tableHeadStyle}>Room ID</th>
            <th style={tableHeadStyle}>Room Type</th>
            <th style={tableHeadStyle}>Check-In Date</th>
            <th style={tableHeadStyle}>Check-Out Date</th>
            <th style={tableHeadStyle}>Guests</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((res) => (
              <tr key={res.reservationId}>
                <td style={tableCellStyle}>{res.reservationId}</td>
                <td style={tableCellStyle}>{res.customerId}</td>
                <td style={tableCellStyle}>{res.hotelId}</td>
                <td style={tableCellStyle}>{res.roomId}</td>
                <td style={tableCellStyle}>{res.roomType}</td>
                <td style={tableCellStyle}>{res.checkInDate}</td>
                <td style={tableCellStyle}>{res.checkOutDate}</td>
                <td style={tableCellStyle}>{res.noOfGuests}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tableCellStyle} colSpan="8" align="center">
                No reservations found
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
