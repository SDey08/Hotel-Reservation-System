import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowAllCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          alert("Authorization token not found. Please log in again.");
          return;
        }

        const response = await fetch("http://localhost:8085/auth/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        } else {
          console.error("Failed to fetch customers");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers by name, email, or phone (case-insensitive)
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

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
        All Customers
      </h2>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
        <thead>
          <tr style={{ backgroundColor: "#FFA700" }}>
            <th style={tableHeadStyle}>ID</th>
            <th style={tableHeadStyle}>Name</th>
            <th style={tableHeadStyle}>Email</th>
            <th style={tableHeadStyle}>Address</th>
            <th style={tableHeadStyle}>Phone</th>
            <th style={tableHeadStyle}>Aadhar Number</th>
            <th style={tableHeadStyle}>Pin Code</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <tr key={customer.customerId}>
                <td style={tableCellStyle}>{customer.customerId}</td>
                <td style={tableCellStyle}>{customer.name}</td>
                <td style={tableCellStyle}>{customer.email}</td>
                <td style={tableCellStyle}>{customer.address}</td>
                <td style={tableCellStyle}>{customer.phone}</td>
                <td style={tableCellStyle}>{customer.aadharNumber}</td>
                <td style={tableCellStyle}>{customer.pin_code}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tableCellStyle} colSpan="7" align="center">
                No customers found
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
