import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/DonorList.css';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5010/api/donors')
      .then((response) => {
        setDonors(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching donor data');
        setLoading(false);
      });
  }, []);

  const deleteDonor = async (username) => {
    try {
      await axios.delete(`http://localhost:5010/api/donors/${username}`);
      setDonors(donors.filter((donor) => donor.username !== username));
    } catch (error) {
      console.error('Error deleting donor:', error);
      alert('Failed to delete the donor. Please try again.');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDonors = donors.filter((donor) =>
    donor.donation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="donors-container">
      <h1 className="heading">Donors</h1>
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
            <div className="donor-card" key={donor.username}>
              <h3 className="donor-name">{donor.username}</h3>
              <p className="donor-donation">Donation: {donor.donation}</p>
              <p className="donor-email">
                <strong>Email:</strong> {donor.email}
              </p>
              <button
                className="delete-button"
                onClick={() => deleteDonor(donor.username)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No donors found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default DonorList;
