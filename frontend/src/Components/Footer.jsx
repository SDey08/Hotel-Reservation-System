// src/Components/Footer.js
import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#000',
    color: '#FFA700', // chrome yellow
    padding: '20px 40px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontFamily: '"Roboto", sans-serif',
    fontSize: '14px',
  };

  const sectionStyle = {
    flex: '1 1 200px',
    margin: '10px',
  };

  const headingStyle = {
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const linkStyle = {
    color: '#FFA700',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '6px',
    cursor: 'pointer',
  };

  const socialListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const socialItemStyle = {
    marginBottom: '8px',
  };

  const socialLinkStyle = {
    color: '#FFA700',
    fontSize: '14px',  // smaller font size
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <footer style={footerStyle}>
      <div style={sectionStyle}>
        <h4 style={headingStyle}>About Us</h4>
        <a href="/aboutus" style={linkStyle}>Learn more about The Bengal Roots</a>
      </div>
      <div style={sectionStyle}>
        <h4 style={headingStyle}>Contact Us</h4>
        <p>Email: support@thebengalroots.com</p>
        <p>Phone: +91 12345 67890</p>
      </div>
      <div style={sectionStyle}>
        <h4 style={headingStyle}>Follow Us</h4>
        <ul style={socialListStyle}>
          <li style={socialItemStyle}>
            <a
              href="https://twitter.com/thebengalroots"
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
              aria-label="Twitter"
            >
              🐦 Twitter
            </a>
          </li>
          <li style={socialItemStyle}>
            <a
              href="https://facebook.com/thebengalroots"
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
              aria-label="Facebook"
            >
              📘 Facebook
            </a>
          </li>
          <li style={socialItemStyle}>
            <a
              href="https://instagram.com/thebengalroots"
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
              aria-label="Instagram"
            >
              📸 Instagram
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
