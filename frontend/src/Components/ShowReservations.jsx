import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowAllReservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [error, setError] = useState(null);
  const [searchCustomerId, setSearchCustomerId] = useState("");
  const navigate = useNavigate();

  // Check token on mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Authorization token not found. Please log in again.");
      navigate("/login");
      return;
    }
  }, [navigate]);

  const fetchReservations = async () => {
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Authorization token not found. Please log in again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:8085/reservation/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
        setFilteredReservations(data);
        if (data.length === 0) setError("No reservations found.");
      } else {
        setReservations([]);
        setFilteredReservations([]);
        setError("Failed to fetch reservations");
      }
    } catch (error) {
      setReservations([]);
      setFilteredReservations([]);
      setError("Error fetching reservations: " + error.message);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []); 

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchCustomerId(value);

    if (!value) {
      // If search is empty, show all
      setFilteredReservations(reservations);
      setError(null);
      return;
    }

    // Filter by customerId
    const filtered = reservations.filter(
      (res) => res.customerId?.toString().includes(value)
    );

    setFilteredReservations(filtered);

    if (filtered.length === 0) {
      setError("No reservations found for this Customer ID.");
    } else {
      setError(null);
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
        Show All Reservations
      </h2>

      {/* Search bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Customer ID..."
          value={searchCustomerId}
          onChange={handleSearchChange}
          style={{
            padding: "8px",
            width: "200px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
        <thead>
          <tr style={{ backgroundColor: "#FFA700" }}>
            <th style={tableHeadStyle}>Reservation ID</th>
            <th style={tableHeadStyle}>Customer ID</th>
            <th style={tableHeadStyle}>Hotel ID</th>
            <th style={tableHeadStyle}>Room ID</th>
            <th style={tableHeadStyle}>Room Type</th>
            <th style={tableHeadStyle}>Check-in Date</th>
            <th style={tableHeadStyle}>Check-out Date</th>
            <th style={tableHeadStyle}>Guests</th>
            <th style={tableHeadStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.length > 0 ? (
            filteredReservations.map((res) => (
              <tr key={res.reservationId}>
                <td style={tableCellStyle}>{res.reservationId}</td>
                <td style={tableCellStyle}>{res.customerId}</td>
                <td style={tableCellStyle}>{res.hotelId}</td>
                <td style={tableCellStyle}>{res.roomId}</td>
                <td style={tableCellStyle}>{res.roomType}</td>
                <td style={tableCellStyle}>{res.checkInDate}</td>
                <td style={tableCellStyle}>{res.checkOutDate}</td>
                <td style={tableCellStyle}>{res.noOfGuests}</td>
                <td style={tableCellStyle}>{res.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tableCellStyle} colSpan="10" align="center">
                {!error ? "No reservations to show." : ""}
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
