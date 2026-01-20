import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowPayments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Role & token validation on mount
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Authorization token not found. Please log in again.");
      navigate("/");
      return;
    }

    if (role !== "ADMIN") {
      alert("Access denied. Admins only.");
      navigate("/");
      return;
    }

    fetchPayments(token);
  }, [navigate]);

  const fetchPayments = async (token) => {
    setError(null);

    try {
      const response = await fetch("http://localhost:8085/payments/admin/All", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          setError("No payments found");
          setPayments([]);
          setFilteredPayments([]);
        } else {
          setPayments(data);
          setFilteredPayments(data);
          setError(null);
        }
      } else if (response.status === 401) {
        setError("Unauthorized: Please login again.");
      } else if (response.status === 403) {
        setError("Forbidden: You don't have access.");
      } else {
        setError("Failed to fetch payments");
      }
    } catch (error) {
      setError("Error fetching payments: " + error.message);
    }
  };

  // Filter payments based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPayments(payments);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    const filtered = payments.filter((p) =>
      String(p.paymentId).toLowerCase().includes(lowerTerm) ||
      String(p.reservationId).toLowerCase().includes(lowerTerm) ||
      String(p.customerId).toLowerCase().includes(lowerTerm)
    );

    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

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
        All Payments
      </h2>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Payment ID, Reservation ID, or Customer ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "400px",
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
            <th style={tableHeadStyle}>Payment ID</th>
            <th style={tableHeadStyle}>Reservation ID</th>
            <th style={tableHeadStyle}>Customer ID</th>
            <th style={tableHeadStyle}>Amount (₹)</th>
            <th style={tableHeadStyle}>Payment Date</th>
            <th style={tableHeadStyle}>Payment Method</th>
            <th style={tableHeadStyle}>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((p) => (
              <tr key={p.paymentId}>
                <td style={tableCellStyle}>{p.paymentId}</td>
                <td style={tableCellStyle}>{p.reservationId}</td>
                <td style={tableCellStyle}>{p.customerId}</td>
                <td style={tableCellStyle}>₹{p.amount.toFixed(2)}</td>
                <td style={tableCellStyle}>
                  {new Date(p.paymentDate).toLocaleString()}
                </td>
                <td style={tableCellStyle}>{p.paymentMethod}</td>
                <td style={tableCellStyle}>{p.paymentStatus}</td>
              </tr>
            ))
          ) : (
            !error && (
              <tr>
                <td style={tableCellStyle} colSpan="7" align="center">
                  No matching payments found.
                </td>
              </tr>
            )
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
