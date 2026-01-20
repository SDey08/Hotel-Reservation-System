import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditRooms() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [roomType, setRoomType] = useState("SINGLE");
  const [pricePerNight, setPricePerNight] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [roomImgUrl, setRoomImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");

  // Fetch room details when roomId changes
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId.trim()) return; // avoid calling when empty

      if (!token) {
        alert("Please login as admin.");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8085/hotelmanager/rooms/${roomId}`,
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
          throw new Error(data.message || "Failed to fetch room details");
        }

        // Pre-fill form with fetched details
        setRoomType(data.roomType || "SINGLE");
        setPricePerNight(data.pricePerNight ?? "");
        setStatus(data.status || "AVAILABLE");
        setRoomImgUrl(data.roomImgUrl || "");
      } catch (err) {
        console.error("Fetch room error:", err);
        alert("Error fetching room: Room not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomId) {
      alert("Please enter Room ID");
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
      if (!token) {
        alert("Please login to continue.");
        return;
      }

      const response = await fetch(
        `http://localhost:8085/hotelmanager/auth/rooms/${roomId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Room updated successfully!");
        navigate("/admindashboard");
      } else {
        const errorText = await response.text();
        alert(`Failed to update room: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating room");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <button
        onClick={() => navigate("/admindashboard")}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "#FFA700",
          color: "#000",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "15px"
        }}
      >
        ← Back
      </button>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          width: "750px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          color: "#333",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "black" }}>Edit Room</h2>

        <label style={{ fontWeight: '700', color: "black"}}>
          Room ID:
          <input
            type="number"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>
        <br />
        <br />

        <label style={{ fontWeight: '700', color: "black"}}>
          Room Type:
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          >
            <option value="SINGLE">SINGLE</option>
            <option value="DOUBLE">DOUBLE</option>
            <option value="SUITE">SUITE</option>
            <option value="DELUXE">DELUXE</option>
          </select>
        </label>
        <br />
        <br />

        <label style={{ fontWeight: '700', color: "black"}}>
          Price Per Night:
          <input
            type="number"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            required
            min="0"
            step="0.01"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>
        <br />
        <br />

        <label style={{ fontWeight: '700', color: "black"}}>
          Status:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          >
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </label>
        <br />
        <br />

        <label style={{ fontWeight: '700', color: "black"}}>
          Room Image URL (optional):
          <input
            type="text"
            value={roomImgUrl}
            onChange={(e) => setRoomImgUrl(e.target.value)}
            placeholder="Paste image URL"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>
        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#FFA700",
            color: "#000",
            padding: "0.75rem",
            border: "none",
            width: "20%",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "15px"
          }}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
