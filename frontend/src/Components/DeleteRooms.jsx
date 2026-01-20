import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteRooms = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!roomId) {
      alert('Room ID is required!');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8085/hotelmanager/auth/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Room deleted successfully!');
        navigate('/admindashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', padding: '20px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/admindashboard')}
        style={{
          backgroundColor: '#FFA700',
          color: 'black',
          border: 'none',
          padding: '8px 14px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: '700',
          marginBottom: '20px',
          fontSize: '15px'
        }}
      >
        ← Back
      </button>

      {/* White Container */}
      <div
        style={{
          backgroundColor: 'white',
          color: 'black',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '400px',
          margin: '0 auto',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}
      >
        <h2 style={{ color: 'black', textAlign: 'center', marginBottom: '20px' }}>
          Delete Room
        </h2>

        <form onSubmit={handleDelete} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="number"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              backgroundColor: '#FFA700',
              color: 'black',
              border: 'none',
              padding: '10px',
              marginTop: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '15px'
            }}
          >
            Delete Room
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  marginBottom: '10px',
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid gray'
};

export default DeleteRooms;
