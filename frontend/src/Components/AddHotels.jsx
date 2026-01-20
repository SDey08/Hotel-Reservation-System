import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialRoom = {
  roomType: 'SINGLE',
  pricePerNight: '',
  status: 'AVAILABLE',
  roomImgUrl: ''
};

export default function AddHotels() {
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
    contactNumber: '',
    rating: '',
    hotelImgUrl: ''
  });
  const [addRooms, setAddRooms] = useState('NO');
  const [numRooms, setNumRooms] = useState(0);
  const [rooms, setRooms] = useState([]);

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRoomsChange = (e) => {
    const val = e.target.value;
    setAddRooms(val);

    if (val === 'YES') {
      setRooms(Array(numRooms).fill(null).map(() => ({ ...initialRoom })));
    } else {
      setRooms([]);
      setNumRooms(0);
    }
  };

  const handleNumRoomsChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) val = 0;
    setNumRooms(val);

    if (val > rooms.length) {
      setRooms(prev => [...prev, ...Array(val - prev.length).fill(null).map(() => ({ ...initialRoom }))]);
    } else if (val < rooms.length) {
      setRooms(prev => prev.slice(0, val));
    }
  };

  const handleRoomChange = (index, e) => {
    const { name, value } = e.target;
    setRooms(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: value,
      };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Please login as admin to add a hotel.');
      return;
    }

    const payload = {
      ...hotelData,
      rating: parseFloat(hotelData.rating),
      rooms: addRooms === 'YES' ? rooms.map(r => ({
        roomType: r.roomType,
        pricePerNight: parseFloat(r.pricePerNight),
        status: r.status,
        roomImgUrl: r.roomImgUrl
      })) : []
    };

    try {
      const response = await fetch('http://localhost:8085/hotelmanager/auth/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to add hotel: ${text}`);
      }

      const addedHotel = await response.json();

      alert(`Hotel Added Successfully!\n\n` +
        `Name: ${addedHotel.name}\nLocation: ${addedHotel.location}\nRating: ${addedHotel.rating}\n` +
        (addedHotel.rooms?.length > 0 ? `Rooms Added: ${addedHotel.rooms.length}` : 'No rooms added'));

      setHotelData({
        name: '',
        location: '',
        contactNumber: '',
        rating: '',
        hotelImgUrl: ''
      });
      setAddRooms('NO');
      setNumRooms(0);
      setRooms([]);

      navigate("/admindashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  // Styles
  const containerStyle = {
    backgroundColor: "#000",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  };

  const formWrapperStyle = {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '2.5rem 3rem',
    maxWidth: '720px',
    width: '100%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    color: '#000',
    marginTop: "24px"
  };

  const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "0.25rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.6rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const selectStyle = { 
    ...inputStyle, 
    appearance: 'none', 
    cursor: 'pointer' 
  };

  const fieldsetStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1.25rem 1.5rem',
    marginBottom: '1.5rem',
    backgroundColor: '#fafafa'
  };

  const legendStyle = {
    padding: '0 10px',
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#444'
  };

  const buttonStyle = {
    backgroundColor: '#ffa700',
    color: 'black',
    fontWeight: '700',
    fontSize: '15px',
    padding: '12px 50px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  const buttonHoverStyle = {
    backgroundColor: '#cc8400'
  };

  const backButtonStyle = {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: '8px 16px',
    backgroundColor: '#ffa700',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: "15px",
    color: 'black',
    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
    transition: 'background-color 0.3s'
  };

  const [btnHover, setBtnHover] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <button
        style={{ ...backButtonStyle, ...(btnHover ? buttonHoverStyle : {}) }}
        onClick={() => navigate('/admindashboard')}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
      >
        ← Back
      </button>

      <div style={formWrapperStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Add Hotel {addRooms === 'YES' ? 'and Rooms' : ''}
        </h2>

        <form onSubmit={handleSubmit}>

          <label style={labelStyle} htmlFor="name">Hotel Name:</label>
          <input
            style={inputStyle}
            id="name"
            type="text"
            name="name"
            value={hotelData.name}
            onChange={handleHotelChange}
            required
          />
          <br />

          <label style={labelStyle} htmlFor="location">Location:</label>
          <input
            style={inputStyle}
            id="location"
            type="text"
            name="location"
            value={hotelData.location}
            onChange={handleHotelChange}
            required
          />
          <br />

          <label style={labelStyle} htmlFor="contactNumber">Contact Number:</label>
          <input
            style={inputStyle}
            id="contactNumber"
            type="tel"
            name="contactNumber"
            value={hotelData.contactNumber}
            onChange={handleHotelChange}
            required
          />
          <br />

          <label style={labelStyle} htmlFor="rating">Rating (0-5):</label>
          <input
            style={inputStyle}
            id="rating"
            type="number"
            name="rating"
            step="0.1"
            min="0"
            max="5"
            value={hotelData.rating}
            onChange={handleHotelChange}
            required
          />
          <br />

          <label style={labelStyle} htmlFor="hotelImgUrl">Hotel Image URL (optional):</label>
          <input
            style={inputStyle}
            id="hotelImgUrl"
            type="url"
            name="hotelImgUrl"
            value={hotelData.hotelImgUrl}
            onChange={handleHotelChange}
            placeholder="Paste image link"
          />
          <br />

          <label style={labelStyle} htmlFor="addRooms">Do you want to add rooms?</label>
          <select
            id="addRooms"
            value={addRooms}
            onChange={handleAddRoomsChange}
            style={selectStyle}
          >
            <option value="NO">No</option>
            <option value="YES">Yes</option>
          </select>

          <br /><br />

          {addRooms === 'YES' && (
            <>
              <label style={labelStyle} htmlFor="numRooms">Number of rooms to add:</label>
              <input
                style={inputStyle}
                id="numRooms"
                type="number"
                min="1"
                value={numRooms}
                onChange={handleNumRoomsChange}
                required
              />
              <br /><br />

              {rooms.map((room, i) => (
                <fieldset key={i} style={fieldsetStyle}>
                  <legend style={legendStyle}>Room {i + 1} Details</legend>

                  <label style={labelStyle} htmlFor={`roomType-${i}`}>Room Type:</label>
                  <select
                    id={`roomType-${i}`}
                    name="roomType"
                    value={room.roomType}
                    onChange={(e) => handleRoomChange(i, e)}
                    required
                    style={selectStyle}
                  >
                    <option value="SINGLE">Single</option>
                    <option value="DOUBLE">Double</option>
                    <option value="SUITE">Suite</option>
                    <option value="DELUXE">Deluxe</option>
                  </select>
                  <br /><br />

                  <label style={labelStyle} htmlFor={`pricePerNight-${i}`}>Price Per Night:</label>
                  <input
                    style={inputStyle}
                    id={`pricePerNight-${i}`}
                    type="number"
                    name="pricePerNight"
                    step="0.01"
                    min="0"
                    value={room.pricePerNight}
                    onChange={(e) => handleRoomChange(i, e)}
                    required
                  />
                  <br /><br />

                  <label style={labelStyle} htmlFor={`status-${i}`}>Status:</label>
                  <select
                    id={`status-${i}`}
                    name="status"
                    value={room.status}
                    onChange={(e) => handleRoomChange(i, e)}
                    required
                    style={selectStyle}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                  <br /><br />

                  <label style={labelStyle} htmlFor={`roomImgUrl-${i}`}>Room Image URL (optional):</label>
                  <input
                    style={inputStyle}
                    id={`roomImgUrl-${i}`}
                    type="url"
                    name="roomImgUrl"
                    value={room.roomImgUrl}
                    onChange={(e) => handleRoomChange(i, e)}
                    placeholder="Paste image link"
                  />
                </fieldset>
              ))}
            </>
          )}

          <button
            type="submit"
            style={{ ...buttonStyle, ...(submitHover ? buttonHoverStyle : {}) }}
            onMouseEnter={() => setSubmitHover(true)}
            onMouseLeave={() => setSubmitHover(false)}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
