import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    // Email required
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } 
    // Email format validation
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    // Password required
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } 
    // Password length check
    else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('http://localhost:8085/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('isLoggedIn', 'true');
        setMessage('');

        if (data.role === 'ADMIN') {
          navigate('/admindashboard'); 
        } else {
          navigate('/'); 
        }
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  const containerStyle = {
    backgroundColor: 'black',
    minHeight: '100vh',
    padding: '20px',
    position: 'relative',
  };

  const formContainerStyle = {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '40px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '400px',
    margin: 'auto',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: '#FFA700',
          color: 'black',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '5px',
          fontWeight: '700',
          cursor: 'pointer',
          fontSize: '15px'
        }}
      >
        ← Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <form onSubmit={handleSubmit} style={formContainerStyle} noValidate>
          <h2 style={{ marginBottom: '20px', color: '#171717' }}>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '95%',
              padding: '10px',
              marginBottom: errors.email ? '5px' : '15px',
              borderRadius: '6px',
              border: errors.email ? '1px solid red' : '1px solid #ccc',
              fontSize: '16px',
            }}
          />
          {errors.email && (
            <p style={{ color: 'red', marginTop: 0, marginBottom: '10px' }}>{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '95%',
              padding: '10px',
              marginBottom: errors.password ? '5px' : '20px',
              borderRadius: '6px',
              border: errors.password ? '1px solid red' : '1px solid #ccc',
              fontSize: '16px',
            }}
          />
          {errors.password && (
            <p style={{ color: 'red', marginTop: 0, marginBottom: '20px' }}>{errors.password}</p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#FFA700',
              color: 'black',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '16px',
              marginBottom: '20px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>

          {message && (
            <p style={{ color: 'red', marginBottom: '20px' }}>{message}</p>
          )}

          <div style={{ marginBottom: '20px', color: '#888' }}>
            <span>────────── OR ──────────</span>
          </div>

          <button
            type="button"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'black',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            Sign in with Google
          </button>

          {/* Register redirect */}
          <p style={{ color: '#555' }}>
            Haven’t registered?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{
                background: 'none',
                border: 'none',
                color: 'blue',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontSize: 'inherit',
                fontFamily: 'inherit',
              }}
            >
              Register now
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
