// src/Components/About.js
import React from 'react';
import Navbar from './Navbar';
const AboutUs = () => {
  const sectionContainer = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem',
    flexWrap: 'wrap',
  };

  const textContainer = {
    flex: 1,
    minWidth: '250px',
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const headingStyle = {
    marginBottom: '1rem',
    color: '#FFA700',
    fontSize: '1.5rem',
    borderBottom: '2px solid #FFA700',
    paddingBottom: '0.5rem',
  };

  const paragraphStyle = {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#333',
  };

  const imgStyle = {
    flex: 1,
    maxWidth: '400px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  return (
    <div>
      <Navbar/>
      {/* Our History */}
      <div style={sectionContainer}>
        <img
          src="https://www.adotrip.com/public/images/state/contentImg/5f227ff1f1f5c.jpg"
          alt="Bengali Tradition"
          style={imgStyle}
        />
        <div style={textContainer}>
          <h2 style={headingStyle}>Our History</h2>
          <p style={paragraphStyle}>
            Rooted in the heart of Bengal, our journey began with the timeless belief of 
            <strong> “Atithi Devo Bhava”</strong> — the guest is equivalent to God.
            For generations, Bengalis have been known for their warmth, cultural richness,
            and unmatched hospitality. We carry forward this legacy to create a home away 
            from home for every guest who walks through our doors.
          </p>
        </div>
      </div>

      {/* Our Legacy */}
      <div style={{ ...sectionContainer, flexDirection: 'row-reverse' }}>
        <img
          src="https://assets.architecturaldigest.in/photos/644a990f296ee8bf229263bb/16:9/w_2560%2Cc_limit/Feature%2520(13).png"
          alt="Our Legacy"
          style={imgStyle}
        />
        <div style={textContainer}>
          <h2 style={headingStyle}>Our Legacy</h2>
          <p style={paragraphStyle}>
            As a proud Bengali hotel franchise, we have built a legacy of excellence over the 
            years. From our humble beginnings to becoming a trusted name in the hospitality 
            industry, our dedication to guest satisfaction remains unchanged. Our legacy is 
            not just about buildings — it’s about relationships, trust, and memories created.
          </p>
        </div>
      </div>

      {/* Our Services */}
      <div style={sectionContainer}>
        <img
          src="https://www.shutterstock.com/image-photo/special-bengali-food-occasion-served-600nw-2515228021.jpg"
          alt="Our Services"
          style={imgStyle}
        />
        <div style={textContainer}>
          <h2 style={headingStyle}>Our Services</h2>
          <p style={paragraphStyle}>
            We offer a variety of services to ensure a comfortable and memorable stay:
          </p>
          <ul style={{ paddingLeft: '1.5rem', color: '#333' }}>
            <li>Luxurious and comfortable rooms</li>
            <li>Authentic Bengali and multi-cuisine dining</li>
            <li>24/7 room service</li>
            <li>Gym and Spa Services</li>
            <li>Parking Facilities</li>
            <li>Children's Play Area</li>
            <li>Event hosting & banquet halls</li>
            <li>Travel assistance & guided tours</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
