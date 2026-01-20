// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import AboutUs from './Components/AboutUs';
import Hotels from './Components/Hotels';
import Register from './Components/Register';
import Login from './Components/Login';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
import MyBookings from './Components/MyBookings';
import AdminDashboard from './Components/AdminDashboard';
import ProfilePage from './Components/ProfilePage';
import ShowAllCustomers from './Components/ShowAllCustomers';
import AddHotels from './Components/AddHotels';
import EditHotels from './Components/EditHotels';
import DeleteHotels from './Components/DeleteHotels';
import ShowHotels from './Components/ShowHotels';
import AddRooms from './Components/AddRooms';
import EditRooms from './Components/EditRooms';
import DeleteRooms from './Components/DeleteRooms';
import ShowRooms from './Components/ShowRooms';
import ShowPayments from './Components/ShowPayments';
import ShowReservations from './Components/ShowReservations';
import HotelPage from './Components/HotelPage';
import ReservationForm from './Components/ReservationForm';
import EditReservations from './Components/EditReservations';
import MakePayment from './Components/MakePayment';
import UpdatePaymentStatus from './Components/UpdatePaymentStatus';
import SearchReservations from './Components/SearchReservations';
function AppWrapper() {

  return (
    <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
    >
      <div style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/showallcustomers" element={<ShowAllCustomers />} />
          <Route path="/addhotels" element={<AddHotels />} />
          <Route path="/edithotels" element={<EditHotels />} />
          <Route path="/deletehotels" element={<DeleteHotels />} />
          <Route path="/showhotels" element={<ShowHotels />} />
          <Route path="/addrooms" element={<AddRooms />} />
          <Route path="/editrooms" element={<EditRooms />} />
          <Route path="/deleterooms" element={<DeleteRooms />} />
          <Route path="/showrooms" element={<ShowRooms />} />
          <Route path="/showpayments" element={<ShowPayments />} />
          <Route path="/showreservations" element={<ShowReservations />} />
          <Route path="/hotel/:hotelId" element={<HotelPage />} />
          <Route path="/reservation/:hotelId" element={<ReservationForm />} />
          <Route path="/editreservations/:reservationId" element={<EditReservations />} />
          <Route path="/payment/:reservationId" element={<MakePayment />} />
          <Route path="/updatepaymentstatus" element={<UpdatePaymentStatus />} />
          <Route path="/searchreservations" element={<SearchReservations />} />
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
      </div>
      <Footer />
  </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
