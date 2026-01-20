import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdatePaymentStatus = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [paymentId, setPaymentId] = useState("");
  const [reservationId, setReservationId] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [newStatus, setNewStatus] = useState(""); // start empty
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Payment and Reservation info
  const handleFetch = async () => {
    if (!paymentId || !reservationId) {
      alert("Please enter both Payment ID and Reservation ID");
      return;
    }

    if (!token) {
      alert("You are not logged in or token expired!");
      return;
    }

    try {
      setLoading(true);

      // Fetch payment info
      const payResp = await fetch(`http://localhost:8085/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!payResp.ok) throw new Error("Payment not found");
      const payData = await payResp.json();

      if (payData.reservationId !== parseInt(reservationId, 10)) {
        alert("Payment does not belong to this Reservation ID");
        setPaymentInfo(null);
        return;
      }

      if (payData.paymentMethod !== "CASH") {
        alert("Only CASH payments can be updated here");
        setPaymentInfo(null);
        return;
      }

      if (payData.paymentStatus !== "PENDING") {
        alert("Only PENDING payments can be updated");
        setPaymentInfo(null);
        return;
      }

      setPaymentInfo(payData);
      setNewStatus("");

      const resResp = await fetch(`http://localhost:8085/reservation/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resResp.ok) throw new Error("Reservation not found");
      const resData = await resResp.json();
      setReservation(resData);

      setStatusMsg("");
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!paymentInfo || !newStatus) {
      alert("Please select a new payment status before updating");
      return;
    }

    if (!token) {
      alert("You are not logged in or token expired!");
      return;
    }

    try {
      setLoading(true);

      const body = {
        reservationId: parseInt(reservationId, 10),
        paymentMethod: "CASH",
        paymentStatus: newStatus,
      };

      const resp = await fetch(`http://localhost:8085/payments/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Failed to update payment");
      }

      const updatedPayment = await resp.json();
      setPaymentInfo(updatedPayment);
      setStatusMsg(`Payment updated to ${updatedPayment.paymentStatus}. Reservation status updated.`);
    } catch (err) {
      console.error(err);
      setStatusMsg("Error updating payment/reservation: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "#fff", padding: "2rem" }}>
  <button
    onClick={() => navigate("/admindashboard")} 
    style={{ ...buttonStyle, marginBottom: "1rem" }}
  >
    ← Back
  </button>
    <div style={{ backgroundColor: "#111", minHeight: "100vh", color: "#fff", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Update CASH Payment Status</h2>

      <div style={{ display: "flex", gap: "2rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ flex: 1, backgroundColor: "#222", padding: "1rem", borderRadius: "12px" }}>
          <h3>Enter IDs</h3>
          <input
            type="number"
            placeholder="Payment ID"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            style={inputStyle}
            disabled={loading}
          />
          <input
            type="number"
            placeholder="Reservation ID"
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
            style={inputStyle}
            disabled={loading}
          />
          <button onClick={handleFetch} style={buttonStyle} disabled={loading}>
            {loading ? "Fetching..." : "Fetch Payment & Reservation"}
          </button>

          {paymentInfo && reservation && (
            <>
              <h3 style={{ marginTop: "1rem" }}>Payment Info</h3>
              <p><strong>Payment ID:</strong> {paymentInfo.paymentId}</p>
              <p><strong>Reservation ID:</strong> {paymentInfo.reservationId}</p>
              <p><strong>Amount:</strong> ₹{paymentInfo.amount}</p>
              <p><strong>Current Status:</strong> {paymentInfo.paymentStatus}</p>

              <label style={{ marginTop: "1rem" }}>
                Change Payment Status:
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ display: "block", marginTop: "0.5rem", padding: "0.5rem", borderRadius: "6px", width: "100%" }}
                  disabled={loading}
                >
                  <option value="" disabled>Select status</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </label>

              <button onClick={handleUpdate} style={{ ...buttonStyle, marginTop: "1rem" }} disabled={loading}>
                {loading ? "Updating..." : "Update Payment"}
              </button>

              {statusMsg && <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{statusMsg}</p>}
            </>
          )}
        </div>

        {reservation && paymentInfo && (
          <div style={{ flex: 1, backgroundColor: "#222", padding: "1rem", borderRadius: "12px" }}>
            <h3 style={{ color: "#FFA700" }}>Reservation Summary</h3>
            <p><strong style={{ color: "#fff" }}>Reservation ID:</strong> {reservation.reservationId}</p>
            <p><strong style={{ color: "#fff" }}>Check-In:</strong> {reservation.checkInDate}</p>
            <p><strong style={{ color: "#fff" }}>Check-Out:</strong> {reservation.checkOutDate}</p>
            <p><strong style={{ color: "#fff" }}>Guests:</strong> {reservation.noOfGuests}</p>
            <p><strong style={{ color: "#fff" }}>Amount:</strong> ₹{paymentInfo.amount}</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

const inputStyle = {
  display: "block",
  width: "100%",
  margin: "0.5rem 0",
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const buttonStyle = {
  marginTop: "1rem",
  padding: "0.6rem 1.2rem",
  background: "#FFA700",
  color: "black",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "15px",
  border: "none",
};

export default UpdatePaymentStatus;
