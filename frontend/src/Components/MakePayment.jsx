import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MakePayment = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [reservation, setReservation] = useState(null);
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [inputs, setInputs] = useState({});
  const [payEnabled, setPayEnabled] = useState(false);

  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch reservation info
        const resResponse = await fetch(`http://localhost:8085/reservation/${reservationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resResponse.ok) throw new Error("Failed to fetch reservation");
        const reservationData = await resResponse.json();
        setReservation(reservationData);
  
        // 2️⃣ Fetch payment info
        const payResponse = await fetch(`http://localhost:8085/payments/reservation/${reservationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!payResponse.ok) throw new Error("Failed to fetch payment");
        const paymentData = await payResponse.json();
  
        setAmount(paymentData.amount);

  
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, [reservationId, token]);

  useEffect(() => {
    const allFilled = paymentMethod
      ? Object.values(inputs).every((v) => v && v.toString().trim() !== "")
      : false;
    setPayEnabled(allFilled);
  }, [inputs, paymentMethod]);

  const validateInputs = () => {
    if (paymentMethod === "CARD") {
      const { cardNumber, cvv, expiryDate } = inputs;
      if (!/^\d{16}$/.test(cardNumber)) return false;
      if (!/^\d{3}$/.test(cvv)) return false;
      if (new Date(expiryDate) <= new Date()) return false;
    } else if (paymentMethod === "BANKTRANSFER") {
      const { accountNumber, ifsc } = inputs;
      if (!/^\d{9,18}$/.test(accountNumber)) return false;
      if (!/^[A-Z]{4}\d{7}$/.test(ifsc)) return false;
    } else if (paymentMethod === "UPI") {
      const { upiId} = inputs;
      if (!/^.+@.+$/.test(upiId)) return false;
    }
    return true;
  };

  const handlePayNow = async () => {
    try {
      // 🔹 Check if room is available before payment
      const availabilityResponse = await fetch(
        `http://localhost:8085/reservation/available/${reservationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!availabilityResponse.ok) throw new Error("Failed to check room availability");
      const isAvailable = await availabilityResponse.json();
  
      // If room not available → FAIL immediately
      if (!isAvailable) {
        alert("Room is occupied. Reserve again!");
        await fetch(`http://localhost:8085/payments/process`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reservationId: reservationId,
            paymentMethod: paymentMethod || "NULL",
            paymentStatus: "FAILED",
          }),
        });
        setStatusMsg("Payment Failed! Room is occupied.");
        setTimeout(() => navigate("/"), 2500); // wait 2.5s before redirect
        return;
      }
  
      let finalStatus = "INCOMPLETE";
      if (paymentMethod === "CASH") {
        finalStatus = "PENDING";
      } else if (validateInputs()) {
        finalStatus = "SUCCESS";
      } else {
        finalStatus = "FAILED";
      }
  
      await fetch(`http://localhost:8085/payments/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservationId: reservationId,
          paymentMethod: paymentMethod,
          paymentStatus: finalStatus,
        }),
      });
  
      setStatusMsg(
        finalStatus === "SUCCESS"
          ? "Payment Successful!"
          : finalStatus === "FAILED"
          ? "Payment Failed!"
          : "Payment Pending!"
      );
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  
  return (
    <div style={{ backgroundColor: "#111", minHeight: "100vh", color: "#fff", padding: "2rem" }}>
      <button
          onClick={() => navigate(-1)}
          style={{
            padding: "0.5rem 1rem",
            background: "#FFA700",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            color: "black",
            fontSize: "15px"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#cc8400")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FFA700")}
        >
          ⬅ Back
        </button>
      <h2 style={{ color:"#FFA700", marginTop: "4rem"}}>Make Payment</h2>

      {reservation && (
        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ flex: 1 }}>
            <div>
              <h3>Choose Payment Method</h3>
              {["CARD", "BANKTRANSFER", "UPI", "CASH"].map((method) => (
                <button
                  key={method}
                  style={{
                    margin: "0.5rem",
                    padding: "0.5rem 1rem",
                    background: paymentMethod === method ? "#FFA700" : "#fff",
                    fontWeight: paymentMethod === method ? "700" : "500",
                    color: paymentMethod === method ? "#111" : "#111",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "15px"
                  }}
                  onClick={() => {
                    setPaymentMethod(method);
                    setInputs({});
                  }}
                >
                  {method}
                </button>
              ))}
            </div>

            <div style={{ marginTop: "1rem" }}>
              {paymentMethod === "CARD" && (
                <>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={inputs.cardNumber || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={inputs.cvv || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                  <input
                    type="date"
                    name="expiryDate"
                    placeholder="Expiry Date"
                    value={inputs.expiryDate || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </>
              )}

              {paymentMethod === "BANKTRANSFER" && (
                <>
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Account Number"
                    value={inputs.accountNumber || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    name="ifsc"
                    placeholder="IFSC Code"
                    value={inputs.ifsc || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </>
              )}

              {paymentMethod === "UPI" && (
                <>
                  <input
                    type="text"
                    name="upiId"
                    placeholder="UPI ID"
                    value={inputs.upiId || ""}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </>
              )}

              {paymentMethod === "CASH" && <p>Pay on arrival. Click PayNow to proceed.</p>}

              <button
                disabled={!payEnabled}
                onClick={handlePayNow}
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 1.2rem",
                  background: payEnabled ? "#FFA700" : "#cc8400",
                  color: "#111",
                  borderRadius: "10px",
                  cursor: payEnabled ? "pointer" : "not-allowed",
                  fontWeight: "700",
                  fontSize: "15px"
                }}
              >
                Pay Now
              </button>
            </div>

            {statusMsg && <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{statusMsg}</p>}
          </div>

          <div style={{ flex: 1, backgroundColor: "#222", padding: "1rem", borderRadius: "12px" }}>
            <h3 style={{ color: "#FFA700" }}>Reservation Summary</h3>
            <p><strong style={{ color: "#fff" }}>Reservation ID:</strong> {reservation.reservationId}</p>
            <p><strong style={{ color: "#fff" }}>Reservation Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong style={{ color: "#fff" }}>Check-In:</strong> {reservation.checkInDate}</p>
            <p><strong style={{ color: "#fff" }}>Check-Out:</strong> {reservation.checkOutDate}</p>
            <p><strong style={{ color: "#fff" }}>Guests:</strong> {reservation.noOfGuests}</p>
            <p><strong style={{ color: "#fff" }}>Payment Method:</strong> {paymentMethod || "Not Selected"}</p>
            <p><strong style={{ color: "#fff" }}>Amount:</strong> ₹{amount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  display: "block",
  width: "90%",
  margin: "0.5rem 0",
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

export default MakePayment;
