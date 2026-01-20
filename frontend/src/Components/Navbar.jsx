import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import logo from './logo.png';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const baseSections = ['Home', 'AboutUs', 'Hotels', 'Contact'];
  // Add MyBookings dynamically if logged in
  const sections = isLoggedIn ? [...baseSections, 'MyBookings'] : baseSections;

  const pathToSection = {
    '/': 'Home',
    '/aboutus': 'AboutUs',
    '/hotels': 'Hotels',
    '/contact': 'Contact',
    '/mybookings': 'MyBookings',
  };

  const currentSection = pathToSection[location.pathname] || '';

  const handleNavClick = (section) => {
    if (section === 'Home') {
      navigate('/');
    } else if (section === 'MyBookings') {
      navigate('/mybookings');
    } else {
      navigate(`/${section.toLowerCase()}`);
    }
  };

  const handleRegisterClick = () => navigate('/register');
  const handleLoginClick = () => navigate('/login');
  const handleProfileClick = () => navigate('/profilepage');

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const styles = {
    navBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#000',
      padding: '10px 20px',
      position: 'relative',
    },
    navLinks: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
    },
    navLink: {
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: '18px',
      transition: 'color 0.2s ease',
      paddingBottom: '4px',
    },
    yellowBtn: {
      backgroundColor: '#FFA700',
      color: 'black',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: "15px"
    },
    icon: {
      color: '#FFA700',
      fontSize: '28px',
      cursor: 'pointer',
    },
    dropdown: {
      position: 'absolute',
      top: '50px',
      right: '0px',
      backgroundColor: 'white',
      borderRadius: '5px',
      boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
      minWidth: '150px',
    },
    dropdownItem: {
      padding: '10px',
      cursor: 'pointer',
      color: 'black',
    },
  };

  return (
    <div style={styles.navBar}>
      <div style={styles.navLinks}>
      <img src={logo} alt="The Bengal Roots Logo" style={{ height: '40px' }} />
        {sections.map((section) => (
          <span
            key={section}
            onClick={() => handleNavClick(section)}
            style={{
              ...styles.navLink,
              color: currentSection === section ? '#FFA700' : 'white',
              borderBottom:
                currentSection === section ? '2px solid #FFA700' : 'none',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#FFA700')}
            onMouseLeave={(e) =>
              (e.target.style.color =
                currentSection === section ? '#FFA700' : 'white')
            }
          >
            {section}
          </span>
        ))}
      </div>

      <div style={styles.navLinks} ref={dropdownRef}>
        {isLoggedIn ? (
          <>
            <FaUserCircle
              style={styles.icon}
              onClick={() => setDropdownOpen((prev) => !prev)}
            />
            {dropdownOpen && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownItem} onClick={handleProfileClick}>
                  Show Profile
                </div>
                <div style={styles.dropdownItem} onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <button style={styles.yellowBtn} onClick={handleRegisterClick}>
              Register
            </button>
            <button style={styles.yellowBtn} onClick={handleLoginClick}>
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
