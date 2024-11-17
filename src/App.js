import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';
import Nav from './Nav'; // Import Nav component
import Home from './Home';
import Hospitals from './Hospitals';
import Donors from './Donors';
import DonorForm from './DonorForm';
import Contact from './Contact';
import ContactList from './ContactList';
import HospitalProfile from './HospitalProfile';
import PatientProfile from './PatientProfile';
import Footer from './Footer';

const App = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(''); // State for role

  // Load username and role from localStorage on app load
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername && storedRole) {
      setUsername(storedUsername);
      setRole(storedRole);
    } else {
      setUsername('guest');
      setRole('guest');
    }
  }, []);

  // Handle successful login by passing username and role to App component
  const handleLoginSuccess = (username, role) => {
    setUsername(username);
    setRole(role);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role); // Save role to localStorage
  };

  // Handle logout and remove username and role from localStorage
  const handleLogout = () => {
    setUsername('guest');
    setRole('guest');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Hospitals Route */}
          <Route
            path="/hospitals"
            element={
              !username || username === 'guest' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <div>
                  <Nav username={username} role={role} onLogout={handleLogout} />
                  <Hospitals />
                  <Footer />
                </div>
              )
            }
          />
          <Route
            path="/donors"
            element={
              !username || username === 'guest' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <div>
                  <Nav username={username} role={role} onLogout={handleLogout} />
                  <Donors />
                  <Footer />
                </div>
              )
            }
          />
          <Route
            path="/donorform"
            element={
              !username || username === 'guest' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <div>
                  <Nav username={username} role={role} onLogout={handleLogout} />
                  <div style={{ minHeight: '20vh' }}></div>
                  <DonorForm />
                  <div style={{ minHeight: '20vh' }}></div>
                  <Footer />
                </div>
              )
            }
          />
          <Route
            path="/contact"
            element={
              !username || username === 'guest' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <div>
                  <Nav username={username} role={role} onLogout={handleLogout} />
                  <div style={{ minHeight: '20vh' }}></div>
                  <Contact />
                  <div style={{ minHeight: '20vh' }}></div>
                  <Footer />
                </div>
              )
            }
          />
          <Route
            path="/contactlist"
            element={
              role !== 'admin' ? (
                <Link to="/" />  // Redirect to the homepage or another path if not admin
              ) : !username || username === 'guest' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <div>
                  <Nav username={username} role={role} onLogout={handleLogout} />
                  <ContactList />
                  <Footer />
                </div>
              )
            }
          />
          <Route
            path="/patientprofile"
            element={
             role==='patient' ? (
                  <div>
                    <Nav username={username} role={role} onLogout={handleLogout} />
                    <div style={{ minHeight: '10vh' }}></div>
                    <PatientProfile username={username}/>
                    <div style={{ minHeight: '10vh' }}></div>
                    <Footer />
                  </div>
             ):(
                  <div>
                    <Nav username={username} role={role} onLogout={handleLogout} />
                    No Patient Profile
                    <Footer />
                  </div>
             )
            }
          />
          <Route
            path="/hospitalprofile"
            element={
             role==='hospital' ? (
                  <div>
                    <Nav username={username} role={role} onLogout={handleLogout} />
                    <div style={{ minHeight: '10vh' }}></div>
                    <HospitalProfile username={username}/>
                    <div style={{ minHeight: '10vh' }}></div>
                    <Footer />
                  </div>
             ):(
                  <div>
                    <Nav username={username} role={role} onLogout={handleLogout} />
                    No Hospital Profile
                    <Footer />
                  </div>
             )
            }
          />
          <Route
            path="/"
            element={
              !username || username === 'guest' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <div>
                  <Nav username={username} role={role} onLogout={handleLogout} />
                  <Home />
                  <Footer />
                </div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
