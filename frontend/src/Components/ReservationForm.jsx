import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ROOM_CAPACITY = {
  SINGLE: 1,
  DOUBLE: 2,
  SUITE: 3,
  DELUXE: 4,
};

export default function ReservationForm() {
  const navigate = useNavigate();
  const { hotelId } = useParams();

  const [roomType, setRoomType] = useState("SINGLE");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [noOfGuests, setNoOfGuests] = useState(1);

  const [checkInDateError, setCheckInDateError] = useState("");
  const [checkOutDateError, setCheckOutDateError] = useState("");
  const [noOfGuestsError, setNoOfGuestsError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");

  if (!token || !email) {
    return <p style={{ color: "white" }}>Please log in to book a room.</p>;
  }

  if (!hotelId) {
    return <p style={{ color: "white" }}>Hotel ID is missing. Please select a hotel to book.</p>;
  }

  const validate = () => {
    let valid = true;

    if (!checkInDate) {
      setCheckInDateError("Check-in date is required.");
      valid = false;
    } else {
      setCheckInDateError("");
    }

    if (!checkOutDate) {
      setCheckOutDateError("Check-out date is required.");
      valid = false;
    } else if (checkInDate && new Date(checkOutDate) <= new Date(checkInDate)) {
      setCheckOutDateError("Check-out date must be after check-in date.");
      valid = false;
    } else {
      setCheckOutDateError("");
    }

    if (!noOfGuests || noOfGuests < 1) {
      setNoOfGuestsError("Please enter number of guests.");
      valid = false;
    } else if (noOfGuests > ROOM_CAPACITY[roomType]) {
      setNoOfGuestsError(`Maximum guests allowed for ${roomType} is ${ROOM_CAPACITY[roomType]}.`);
      valid = false;
    } else {
      setNoOfGuestsError("");
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const customerResp = await fetch(
        `http://localhost:8085/auth/customer/profile/${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!customerResp.ok) {
        throw new Error("Failed to get customer info.");
      }

      const customerData = await customerResp.json();

      if (!customerData.customerId) {
        throw new Error("Customer ID not found in profile response.");
      }

      const reservationRequest = {
        customerId: customerData.customerId,
        hotelId: parseInt(hotelId, 10),
        roomType,
        checkInDate,
        checkOutDate,
        noOfGuests,
      };

      const reservationResp = await fetch("http://localhost:8085/reservation/book", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationRequest),
      });

      if (!reservationResp.ok) {
        const errorText = await reservationResp.text();
        throw new Error(errorText || "Failed to book reservation.");
      }

      const reservationData = await reservationResp.json();

      navigate(`/payment/${reservationData.reservationId}`);
    } catch (err) {
      setGeneralError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        padding: "2rem 1rem",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          margin: "1rem 0",
          backgroundColor: "#FFA700",
          color: "black",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
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
          maxWidth: "420px",
          margin: "0 auto",
          padding: "1.5rem",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.08)",
        }}
        noValidate
      >
        <h2 style={{ textAlign: "center" }}>Book a Room</h2>

        <label htmlFor="roomType" style={{ display: "block", marginTop: 12, fontWeight: "700" }}>
          Room Type
        </label>
        <select
          id="roomType"
          value={roomType}
          onChange={(e) => {
            setRoomType(e.target.value);
            setNoOfGuests(1);
            setNoOfGuestsError("");
          }}
          required
          style={{ width: "100%", padding: "8px", marginTop: 6, borderRadius: 6 }}
        >
          <option value="SINGLE">SINGLE</option>
          <option value="DOUBLE">DOUBLE</option>
          <option value="SUITE">SUITE</option>
          <option value="DELUXE">DELUXE</option>
        </select>

        <label htmlFor="checkInDate" style={{ display: "block", marginTop: 12, fontWeight: "700" }}>
          Check-In Date
        </label>
        <input
          id="checkInDate"
          type="date"
          value={checkInDate}
          onChange={(e) => {
            setCheckInDate(e.target.value);
            setCheckInDateError("");
          }}
          required
          min={new Date().toISOString().split("T")[0]}
          style={{ width: "95%", padding: "8px", marginTop: 6, borderRadius: 6 }}
        />
        {checkInDateError && (
          <p style={{ color: "red", marginTop: 4 }}>{checkInDateError}</p>
        )}

        <label htmlFor="checkOutDate" style={{ display: "block", marginTop: 12, fontWeight: "700" }}>
          Check-Out Date
        </label>
        <input
          id="checkOutDate"
          type="date"
          value={checkOutDate}
          onChange={(e) => {
            setCheckOutDate(e.target.value);
            setCheckOutDateError("");
          }}
          required
          min={checkInDate || new Date().toISOString().split("T")[0]}
          style={{ width: "95%", padding: "8px", marginTop: 6, borderRadius: 6 }}
        />
        {checkOutDateError && (
          <p style={{ color: "red", marginTop: 4 }}>{checkOutDateError}</p>
        )}

        <label htmlFor="noOfGuests" style={{ display: "block", marginTop: 12, fontWeight: "700" }}>
          Number of Guests
        </label>
        <input
          id="noOfGuests"
          type="number"
          value={noOfGuests}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (isNaN(val) || val < 1) {
              setNoOfGuests(1);
              setNoOfGuestsError("");
              return;
            }
            const max = ROOM_CAPACITY[roomType] || 1;
            if (val > max) {
              setNoOfGuests(val);
              setNoOfGuestsError(`Maximum guests allowed for ${roomType} is ${max}.`);
            } else {
              setNoOfGuests(val);
              setNoOfGuestsError("");
            }
          }}
          min={1}
          max={ROOM_CAPACITY[roomType]}
          required
          style={{ width: "95%", padding: "8px", marginTop: 6, borderRadius: 6 }}
        />
        {noOfGuestsError && (
          <p style={{ color: "red", marginTop: 4 }}>{noOfGuestsError}</p>
        )}

        <div style={{ marginTop: 6 }}>
          <small style={{ color: "#555" }}>
            Max guests allowed for this room type: {ROOM_CAPACITY[roomType]}
          </small>
        </div>

        {generalError && (
          <p style={{ color: "red", marginTop: 12 }}>{generalError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "10px",
            backgroundColor: "#FFA700",
            color: "black",
            border: "none",
            borderRadius: 8,
            fontWeight: "700",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Booking..." : `Reserve Now`}
        </button>
      </form>
    </div>
  );
}
