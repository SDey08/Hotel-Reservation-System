import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function MyBookings() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "BOOKED":
        return "#008200"; //GREEN
      case "INCOMPLETE":
        return "#00008B"; //BLUE
      case "CANCELLED":
        return "#CC0000"; //RED
      case "COMPLETED":
        return "BLACK"; //BLACK
      default:
        return "#111";
    }
  };

  const fetchHotelName = async (hotelId, token) => {
    const res = await fetch(`http://localhost:8085/hotelmanager/hotels/${hotelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch hotel");
    const data = await res.json();
    return data.name;
  };

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      const email = sessionStorage.getItem("email");

      if (!token || !email) {
        setError("Please login to view your bookings.");
        setReservations([]);
        return;
      }

      const customerRes = await fetch(
        `http://localhost:8085/auth/customer/profile/${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!customerRes.ok) throw new Error("Failed to get customer details");
      const customerData = await customerRes.json();
      const customerId = customerData.customerId;

      const statuses = ["BOOKED", "INCOMPLETE", "CANCELLED", "COMPLETED"];
      const allData = [];

      for (const status of statuses) {
        const res = await fetch(
          `http://localhost:8085/reservation/customer/${customerId}/status/${status}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error(`Failed to get ${status} reservations`);
        const data = await res.json();
        allData.push(...data);
      }

      const withHotels = [];
      for (const r of allData) {
        const hotelName = await fetchHotelName(r.hotelId, token);
        withHotels.push({ ...r, hotelName });
      }

      setReservations(withHotels);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (reservationId, status, paymentStatus) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Please login to cancel reservations");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

    if (status === "BOOKED" && paymentStatus === "SUCCESS") {
      alert("Your money will be refunded within 48 hours");
    }

    try {
      const res = await fetch(
        `http://localhost:8085/reservation/cancel/${reservationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || "Failed to cancel reservation");
      }
      await fetchReservations();
    } catch (err) {
      alert(err.message || "Error cancelling reservation");
    }
  };

  const handleEdit = (reservationId) => {
    navigate(`/editreservations/${reservationId}`);
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          backgroundColor: "black",
          minHeight: "100vh",
          padding: "2rem 1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "720px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {loading && (
            <p style={{ color: "white", fontSize: "1.2rem", textAlign: "center", marginTop: "2rem" }}>
              Loading your reservations...
            </p>
          )}

          {error && (
            <p style={{ color: "#ff4c4c", fontSize: "1.2rem", textAlign: "center", marginTop: "2rem" }}>
              {error}
            </p>
          )}

          {!loading && !error && reservations.length === 0 && (
            <p style={{ color: "white", fontSize: "1.2rem", textAlign: "center", marginTop: "2rem" }}>
              You have no reservations yet.
            </p>
          )}

          {!loading &&
            !error &&
            reservations.length > 0 &&
            reservations.map((res) => {
              const status = res.status?.toUpperCase() || "";
              const showCancel = status === "BOOKED" || status === "INCOMPLETE";
              const showEdit = status === "INCOMPLETE";
              const showPay = status === "INCOMPLETE";

              return (
                <div
                  key={res.reservationId}
                  style={{
                    position: "relative",
                    background: "#f0f4ff",
                    padding: "20px 24px",
                    borderRadius: "14px",
                    boxSizing: "border-box",
                    color: "#111",
                    transition: "background-color 0.3s ease",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffa700";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f4ff";
                  }}
                >
                  {(showCancel || showEdit || showPay) && (
                    <div
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        display: "flex",
                        gap: "12px",
                      }}
                    >
                      {showEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(res.reservationId);
                          }}
                          style={{
                            backgroundColor: "black",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "black")}
                        >
                          Edit
                        </button>
                      )}

                      {showCancel && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(res.reservationId, status, res.paymentStatus);
                          }}
                          style={{
                            backgroundColor: "black",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "black")}
                        >
                          Cancel
                        </button>
                      )}

                      {showPay && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payment/${res.reservationId}`);
                          }}
                          style={{
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0a0")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "green")}
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  )}

                  <div style={{ fontWeight: "700", fontSize: "1.25rem", marginBottom: "8px", textDecoration: "underline" }}>
                    Reservation #{res.reservationId}
                  </div>

                  {res.reservationDate && (
                    <div style={{ fontSize: "0.9rem", marginBottom: "30px", color: "#555" }}>
                      <strong>Reservation Date:</strong>{" "}
                      {new Date(res.reservationDate).toLocaleDateString()}
                    </div>
                  )}

                  <div style={{ fontSize: "25px", marginBottom: "15px", color: "black", fontFamily: "serif" }}>
                    <b>{res.hotelName}</b>
                  </div>
                  <div style={{ fontSize: "1rem", marginBottom: "6px" }}>
                    <strong>Room ID:</strong> {res.roomId}
                  </div>
                  <div style={{ fontSize: "1rem", marginBottom: "6px" }}>
                    <strong>Type:</strong> {res.roomType}
                  </div>
                  <div style={{ fontSize: "1rem", marginBottom: "6px" }}>
                    <strong>Check-in:</strong> {res.checkInDate}
                  </div>
                  <div style={{ fontSize: "1rem", marginBottom: "6px" }}>
                    <strong>Check-out:</strong> {res.checkOutDate}
                  </div>
                  <div style={{ fontSize: "1rem", marginBottom: "6px" }}>
                    <strong>Guests:</strong> {res.noOfGuests}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: getStatusColor(status), marginBottom: "6px" }}>
                    <strong>Status:</strong> {res.status}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
