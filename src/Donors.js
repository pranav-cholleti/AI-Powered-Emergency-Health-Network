import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Donors.css';  // Donors CSS

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');  // State for search query

  useEffect(() => {
    // Fetch donors data from backend API
    axios
      .get('http://localhost:4500/api/donors')
      .then((response) => {
        setDonors(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching donor data');
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter donors by the donation field
  const filteredDonors = donors.filter((donor) =>
    donor.donation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="donors-container">
      <h1 className="heading">Donors</h1>

      {/* Search Bar for Donation */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by donation (e.g., Blood Group, Organ)"
          className="search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="donors-list">
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => (
            <div className="donor-card" key={donor._id}>
              <h3 className="donor-name">{donor.username}</h3>
              <p className="donor-donation">
                Donation: {donor.donation || 'Not Available'}
              </p>
              <p className="donor-email">
                <strong>Email:</strong> {donor.email || 'Not Available'}
              </p>
            </div>
          ))
        ) : (
          <p>No donors found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Donors;
