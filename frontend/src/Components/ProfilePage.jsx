import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();

  const email = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role"); 
  const token = sessionStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!email || !role || !token) {
      setErrorMsg("You are not logged in.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const url =
          role === "ADMIN"
            ? `http://localhost:8085/auth/admin/profile/${email}`
            : `http://localhost:8085/auth/customer/profile/${email}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // pass token if backend requires it
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile");
        }
        if (data.error) {
          throw new Error(data.error);
        }

        setProfile(data);
        setErrorMsg(null);
      } catch (error) {
        setErrorMsg(error.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email, role, token]);

  const handleBack = () => {
    if (role === "ADMIN") {
      navigate("/admindashboard");
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          fontSize: "1.2rem",
          color: "#333",
        }}
      >
        Loading profile...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          fontSize: "1.2rem",
          color: "red",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        {errorMsg}
      </div>
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f0f0;
          color: #000;
        }
        #root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .navbar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          background-color: #111;
          color: #fff;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          font-size: 1.2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar button {
          background: #FFA700;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          color: #111;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .navbar button:hover {
          background-color: #ffbf33;
        }
        .navbar .title {
          flex: 1;
          text-align: center;
          font-size: 1.4rem;
          margin-right: 2rem;
        }
        .profile-container {
          background: #fff;
          max-width: 420px;
          margin: 2rem auto 3rem;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          color: #000;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .profile-icon {
          color: #FFA700;
          font-size: 5rem;
          margin-bottom: 1.5rem;
        }
        .profile-details {
          width: 100%;
          text-align: left;
        }
        .profile-details p {
          margin: 0.7rem 0;
          font-size: 1rem;
        }
        .profile-details strong {
          color: #111;
        }
        .footer {
          margin-top: auto;
          background-color: #111;
          color: #fff;
          text-align: center;
          padding: 1rem;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          user-select: none;
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar" role="banner">
        <button onClick={handleBack} aria-label="Go back" style = {{fontWeight: "700", fontSize: "15px"}}>
          ← Back
        </button>
        <div className="title" aria-live="polite">
          Your Profile
        </div>
      </nav>

      {/* Profile container */}
      <main className="profile-container" role="main" aria-label="User Profile">
        <FaUserCircle className="profile-icon" aria-hidden="true" />
        <div className="profile-details">
          {role === "ADMIN" ? (
            <>
              <p>
                <strong>Admin ID:</strong> {profile.adminId}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Customer ID:</strong> {profile.customerId}
              </p>
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Address:</strong> {profile.address}
              </p>
              <p>
                <strong>Phone:</strong> {profile.phone}
              </p>
              <p>
                <strong>Aadhar:</strong> {profile.aadharNumber}
              </p>
              <p>
                <strong>Pin Code:</strong> {profile.pin_code}
              </p>
            </>
          )}
        </div>
      </main>

      
    </>
  );
};

export default ProfilePage;
