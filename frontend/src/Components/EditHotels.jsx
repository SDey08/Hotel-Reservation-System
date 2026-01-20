import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UpdateHotels() {
  const navigate = useNavigate();

  const [hotelId, setHotelId] = useState("");
  const [hotel, setHotel] = useState({
    name: "",
    location: "",
    contactNumber: "",
    rating: "",
    hotelImgUrl: ""
  });
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");

  // Fetch hotel details when hotelId changes
  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!hotelId.trim()) return; // avoid calling when empty

      if (!token) {
        alert("Please login as admin.");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8085/hotelmanager/hotels/${hotelId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch hotel details");
        }

        // Pre-fill the form with fetched details
        setHotel({
          name: data.name || "",
          location: data.location || "",
          contactNumber: data.contactNumber || "",
          rating: data.rating || "",
          hotelImgUrl: data.hotelImgUrl || ""
        });
      } catch (err) {
        console.error("Fetch hotel error:", err);
        alert("Error fetching hotel: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hotelId) {
      alert("Please enter Hotel ID to update.");
      return;
    }

    if (!token) {
      alert("Please login as admin.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...hotel,
        rating: hotel.rating ? parseFloat(hotel.rating) : null
      };

      const res = await fetch(
        `http://localhost:8085/hotelmanager/auth/hotels/${hotelId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || res.statusText || "Failed to update hotel";
        throw new Error(msg);
      }

      alert(
        `Hotel updated successfully!\n\n` +
          `Name: ${data.name || hotel.name}\n` +
          `Location: ${data.location || hotel.location}\n` +
          `Rating: ${data.rating ?? hotel.rating}\n` +
          `Image URL: ${data.hotelImgUrl || hotel.hotelImgUrl || "N/A"}`
      );

      navigate("/admindashboard");
    } catch (err) {
      alert("Error: " + (err.message || err));
      console.error("UpdateHotel error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "black",
        padding: "24px",
      }}
    >
      <div style={{ flex: 1 }}>
        <button
          onClick={() => navigate("/admindashboard")}
          style={{
            backgroundColor: "#FFA700",
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: '700',
            marginBottom: "18px",
            fontSize: '15px'
          }}
        >
          ← Back
        </button>

        <div
          style={{
            background: "#fff",
            padding: '2.5rem 3rem',
            borderRadius: "15px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            maxWidth: "720px",
            marginTop: "-20px",
            marginLeft: "245px"
          }}
        >
          <h2 style={{ textAlign: 'center' }}>Edit Hotel</h2>

          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
              Hotel ID:
            </label>
            <input
              type="text"
              value={hotelId}
              onChange={(e) => setHotelId(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
              Hotel Name:
            </label>
            <input
              type="text"
              name="name"
              value={hotel.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
              Location:
            </label>
            <input
              type="text"
              name="location"
              value={hotel.location}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
              Contact Number:
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={hotel.contactNumber}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
              Rating:
            </label>
            <input
              type="number"
              name="rating"
              value={hotel.rating}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="5"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
              Hotel Image URL:
            </label>
            <input
              type="url"
              name="hotelImgUrl"
              value={hotel.hotelImgUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "18px",
              }}
            />

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#FFA700",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: '700',
                  fontSize: '15px'
                }}
              >
                Submit
              </button>

              <button
                type="button"
                onClick={() => {
                  setHotel({
                    name: "",
                    location: "",
                    contactNumber: "",
                    rating: "",
                    hotelImgUrl: ""
                  });
                  setHotelId("");
                }}
                style={{
                  backgroundColor: "#adadad",
                  padding: "10px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: '700',
                  fontSize: '15px'
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
