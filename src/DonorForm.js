import React, { useState } from "react";
import axios from "axios";
import './css/DonorForm.css'; // Make sure to import the CSS

const DonorForm = () => {
  const [username, setUsername] = useState("");
  const [donation, setDonation] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donorData = {
      username,
      donation,
      email,
    };

    try {
      // Sending donor details to the backend server
      const response = await axios.post("http://localhost:5001/api/donors", donorData);

      if (response.data.success) {
        setMessage("Donor details submitted successfully!");
        setUsername("");
        setDonation("");
        setEmail("");
      } else {
        setMessage("Failed to submit donor details.");
      }
    } catch (error) {
      console.error("Error submitting donor details:", error.message);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="donor-form-container">
      <h2>Donor Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Donation (e.g., Blood, Organ, etc.)"
          value={donation}
          onChange={(e) => setDonation(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
    </div>
  );
};

export default DonorForm;
