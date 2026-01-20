// src/Components/Contact.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
const Contact = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !mobile.trim() || !message.trim()) {
      alert('Please fill in all the fields before submitting.');
      return;
    }

    alert('Ticket raised! We will intimate you as soon as possible.');
    navigate('/');
  };

  const containerStyle = {
    display: 'flex',
    padding: '2rem',
    gap: '2rem',
    flexWrap: 'wrap',
  };

  const formStyle = {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const detailsStyle = {
    flex: 1,
    minWidth: '300px',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const textareaStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minHeight: '150px',
  };

  const buttonStyle = {
    padding: '12px 20px',
    backgroundColor: '#FFA700',
    color: 'black',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: "700"
  };

  return (
    <>
    <Navbar/>
    <div style={containerStyle}>
      {/* Left Side - Raise a Ticket Form */}
      <div style={formStyle}>
        <h2>Raise a Ticket</h2>
        <input
          type="email"
          placeholder="Your Email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Your Mobile Number"
          style={inputStyle}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <textarea
          placeholder="Describe your issue..."
          style={textareaStyle}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button style={buttonStyle} onClick={handleSubmit}>
          Submit Ticket
        </button>
      </div>

      {/* Right Side - Contact Details */}
      <div style={detailsStyle}>
        <h2>Contact Us</h2>
        <p>If you have any questions or feedback, feel free to reach out!</p>
        <ul>
          <li>Email: support@thebengalroots.com</li>
          <li>Phone: +91 12345 67890</li>
          <li>Address: 123, Main Street, Kolkata, India</li>
        </ul>
      </div>
    </div>
    </>
  );
};

export default Contact;
