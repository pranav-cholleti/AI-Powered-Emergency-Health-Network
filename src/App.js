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
import DonorList from './DonorList';
import HospitalProfile from './HospitalProfile';
import PatientProfile from './PatientProfile';
import Footer from './Footer';
import "./css/Chat.css";
import ChatClient from "./ChatClient"; // Updated import path

const App = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(''); 

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

  const handleLoginSuccess = (username, role) => {
    setUsername(username);
    setRole(role);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role); 
  };

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

          <Route
            path="/hospitals"
            element={
              !username || username === 'guest' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <div>
                  <Nav username={username} role={role} onLogout={handleLogout} />
                  <Hospitals username={username} role={role}/>
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
                  <Donors username={username} role={role}/>
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
                  <DonorForm username={username} role={role}/>
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
                <Link to="/" />  
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
            path="/donorlist"
            element={
              role !== 'admin' ? (
                <Link to="/" />  
              ) : !username || username === 'guest' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <div>
                  <Nav username={username} role={role} onLogout={handleLogout} />
                  <DonorList />
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
          <Route
            path="/chat"
            element={
              <ChatClient username={username} role={role} onLogout={handleLogout} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
