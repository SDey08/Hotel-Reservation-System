import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    aadharNumber: '',
    pin_code: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));

    // Clear error on input change
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateCustomerForm = () => {
    const newErrors = {};
    if (!customerForm.name.trim()) newErrors.name = 'Name is required';
    if (!customerForm.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email))
      newErrors.email = 'Invalid email format';

    if (!customerForm.password) newErrors.password = 'Password is required';
    else if (customerForm.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';

    if (!customerForm.address.trim()) newErrors.address = 'Address is required';

    if (!customerForm.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(customerForm.phone))
      newErrors.phone = 'Phone must be exactly 10 digits';

    if (!customerForm.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar Number is required';
    else if (!/^\d{12}$/.test(customerForm.aadharNumber))
      newErrors.aadharNumber = 'Aadhar number must be exactly 12 digits';

    if (!customerForm.pin_code.trim()) newErrors.pin_code = 'Pin Code is required';
    else if (!/^\d{6}$/.test(customerForm.pin_code))
      newErrors.pin_code = 'Pin Code must be exactly 6 digits';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    const validationErrors = validateCustomerForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // prevent submit if validation fails
    }

    try {
      const response = await fetch('http://localhost:8085/auth/register/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerForm),
      });

      if (response.ok) {
        const text = await response.text();
        setMessage(text);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>
        &larr; Back
      </button>

      <div style={styles.formWrapper}>
        <h2 style={styles.heading}>Customer Registration</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={customerForm.name}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}
          </div>

          <div style={styles.inputWrapper}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={customerForm.email}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.inputWrapper}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={customerForm.password}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <div style={styles.inputWrapper}>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={customerForm.address}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.address && <p style={styles.error}>{errors.address}</p>}
          </div>

          <div style={styles.inputWrapper}>
            <input
              type="text"
              name="phone"
              placeholder="Phone (10 digits)"
              value={customerForm.phone}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.phone && <p style={styles.error}>{errors.phone}</p>}
          </div>

          <div style={styles.inputWrapper}>
            <input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Number (12 digits)"
              value={customerForm.aadharNumber}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.aadharNumber && <p style={styles.error}>{errors.aadharNumber}</p>}
          </div>

          <div style={styles.inputWrapper}>
            <input
              type="text"
              name="pin_code"
              placeholder="Pin Code (6 digits)"
              value={customerForm.pin_code}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.pin_code && <p style={styles.error}>{errors.pin_code}</p>}
          </div>

          <button type="submit" style={styles.registerBtn}>
            Register
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: '15px',
              textAlign: 'center',
              color: message.toLowerCase().includes('success') ? 'green' : 'red',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: '20px',
    top: '20px',
    padding: '8px 12px',
    border: 'none',
    backgroundColor: '#FFA700',
    color: 'black',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: "15px"
  },
  formWrapper: {
    maxWidth: '700px',
    width: '100%',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#171717',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid rgba(74, 74, 74, 0.35)',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  registerBtn: {
    backgroundColor: '#FFA700',
    color: 'black',
    padding: '10px',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    fontSize: '0.85rem',
    marginTop: '4px',
    textAlign: 'center',  
  },
};

export default Register;
