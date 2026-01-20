import React, { useState, useRef, useEffect } from "react";
import { FaUsers, FaHotel, FaDoorOpen, FaClipboardList, FaMoneyCheckAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const adminMenu = {
  "Manage Customers": ["Show all Customers"],
  "Manage Hotels": ["Show Hotels", "Add Hotels", "Edit Hotels", "Delete Hotels"],
  "Manage Rooms": ["Show Rooms","Add Rooms", "Edit Rooms", "Delete Rooms"],
  "Manage Reservations": ["Show Reservations","Search Reservations"],
  "Manage Payments": ["Show Payments","Update Payment Status"]
};

const iconMap = {
  "Manage Customers": <FaUsers size={48} color="#FFA700" />,
  "Manage Hotels": <FaHotel size={48} color="#FFA700" />,
  "Manage Rooms": <FaDoorOpen size={48} color="#FFA700" />,
  "Manage Reservations": <FaClipboardList size={48} color="#FFA700" />,
  "Manage Payments": <FaMoneyCheckAlt size={48} color="#FFA700" />,
};

export default function AdminDashboard() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const userDropdownRef = useRef();

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    sessionStorage.setItem("isLoggedIn", "false");
    navigate("/");
  };

  const handleShowProfile = () => {
    navigate("/profilepage");
  };

  const handleBackLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    sessionStorage.setItem("isLoggedIn", "false");
    navigate("/");
  };

  const optionToRoute = (option) => {
    return '/' + option.toLowerCase().replace(/\s+/g, '');
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: "#222",
          color: "#fff",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          position: "relative",
        }}
      >
        <button
          onClick={handleBackLogout}
          style={{
            backgroundColor: "#FFA700",
            border: "none",
            color: "black",
            padding: "8px 12px",
            borderRadius: "6px",
            fontWeight: "700",
            cursor: "pointer",
            marginRight: "1rem",
            fontSize: "16px",
          }}
          aria-label="Go back to Home and Logout"
        >
          ← Home
        </button>

        <div>Welcome to Admin Dashboard</div>

        <div
          ref={userDropdownRef}
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          aria-haspopup="true"
          aria-expanded={userDropdownOpen}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") setUserDropdownOpen(!userDropdownOpen); }}
          title="User Menu"
        >
          <FaUserCircle size={36} color="#FFA700" />
          {userDropdownOpen && (
            <ul
              style={{
                position: "absolute",
                top: "calc(100% + 5px)",
                right: 0,
                backgroundColor: "#fff",
                color: "#333",
                listStyle: "none",
                padding: "0.5rem 0",
                margin: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                borderRadius: "6px",
                width: "160px",
                zIndex: 1000,
              }}
            >
              <li
                onClick={handleShowProfile}
                style={{
                  padding: "10px 15px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  fontSize: "0.85rem"
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleShowProfile(); }}
                tabIndex={0}
              >
                Show Profile
              </li>
              <li
                onClick={handleLogout}
                style={{
                  padding: "10px 15px",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogout(); }}
                tabIndex={0}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </nav>

      <main
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "2rem",
          }}
        >
          {Object.entries(adminMenu).map(([key, options]) => (
            <div
              key={key}
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                userSelect: "none",
                height: "120px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div
                onClick={() => toggleDropdown(key)}
                style={{
                  display: "flex",
                  flexDirection: "column", // icon above text
                  alignItems: "center",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                {iconMap[key]}
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    textAlign: "center",
                  }}
                >
                  {key}
                </div>
              </div>

              {openDropdown === key && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    backgroundColor: "#fff",
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderRadius: "0 0 10px 10px",
                    zIndex: 10,
                  }}
                >
                  {options.map((option) => (
                    <li
                      key={option}
                      style={{
                        padding: "0.5rem 1rem",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                        color: "#555",
                        fontSize: "0.95rem",
                      }}
                      onClick={() => navigate(optionToRoute(option))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") navigate(optionToRoute(option));
                      }}
                      tabIndex={0}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
