import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeleteHotels() {
  const [hotelId, setHotelId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Authorization token not found. Please log in again.");
      return;
    }

    if (!hotelId) {
      alert("Please enter a valid Hotel ID.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8085/hotelmanager/auth/hotels/${hotelId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert(`Hotel with ID ${hotelId} deleted successfully!`);
        navigate("/admindashboard");
      } else {
        const errorText = await response.text();
        alert(`Failed to delete hotel: ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
      alert("An error occurred while deleting the hotel.");
    }
  };

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: "20px" }}>
      {/* Back button at top-left */}
      <button
        onClick={() => navigate("/admindashboard")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "#FFA700",
          color: "black",
          border: "none",
          padding: "8px 12px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "15px"
        }}
      >
       ← Back
      </button>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "400px",
          margin: "80px auto 0 auto",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Delete Hotel</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Hotel ID:</label>
            <input
              type="number"
              value={hotelId}
              onChange={(e) => setHotelId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginTop: "5px",
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#FFA700", 
              color: "#000",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
              fontWeight: "700",
              fontSize: "15px"
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
