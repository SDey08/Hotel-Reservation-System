import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hotels, setHotels] = useState([]); 
  const [error, setError] = useState("");
  const containerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setError("");
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setHotels([]);
      setSuggestions([]);
      setError("");
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }
    fetch(`http://localhost:8085/search/suggestions?query=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch(() => setSuggestions([]));
  }, [searchQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Search query is required");
      return;
    }
    setError("");
    setIsOpen(false);

    fetch(`http://localhost:8085/search?query=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API returned:", data);
        if (Array.isArray(data)) {
          setHotels(data);
        } else if (data && Array.isArray(data.hotels)) {
          setHotels(data.hotels);
        } else {
          setHotels([]);
          setError("");
        }
      })
      .catch(() => {
        setHotels([]);
        setError("Error fetching hotels.");
      });
  };

  return (
    <div ref={containerRef} style={{ maxWidth: "900px", margin: "2rem auto" }}>
      <h1 style={{ textAlign: "center", color: "#171717" }}>Search Hotels</h1>

      <input
        type="text"
        placeholder="Search by hotel name or location"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsOpen(true);
        }}
        style={{
          width: "95.45%",
          padding: "12px 20px",
          fontSize: "18px",
          borderRadius: "24px",
          border: error ? "2px solid red" : "1.5px solid #ddd",
          outline: "none",
          alignContent: "center",
        }}
      />

      {isOpen && suggestions.length > 0 && (
        <div
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
            borderRadius: "12px",
            marginTop: "4px",
            maxHeight: "200px",
            overflowY: "auto",
            cursor: "pointer",
          }}
        >
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSearchQuery(item);
                setIsOpen(false);
              }}
              style={{ padding: "10px 16px", borderBottom: "1px solid #eee" }}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {error && (
        <small style={{ color: "red", fontWeight: "bold" }}>{error}</small>
      )}

      <button
        onClick={handleSearch}
        style={{
          marginTop: "12px",
          width: "100%",
          padding: "12px",
          backgroundColor: "#FFA700",
          borderRadius: "25px",
          border: "none",
          color: "black",
          fontWeight: "bold",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Search
      </button>

      {/* Render hotel results as cards */}
      <div style={{ marginTop: "20px" }}>
        {Array.isArray(hotels) && hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div
              key={hotel.hotelId}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => navigate(`/hotel/${hotel.hotelId}`)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={hotel.hotelImgUrl || "https://via.placeholder.com/150x100?text=No+Image"}
                alt={hotel.name}
                style={{
                  width: "150px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginRight: "16px",
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{hotel.name}</h3>
                <p style={{ margin: "0 0 4px 0", color: "#555" }}>{hotel.location}</p>
                <p style={{ margin: "0", color: "black", fontWeight: "bold" }}>
                  ⭐ {hotel.rating || "N/A"}
                </p>
              </div>
            </div>
          ))
        ) : (
          !error && null
        )}
      </div>
    </div>
  );
}
