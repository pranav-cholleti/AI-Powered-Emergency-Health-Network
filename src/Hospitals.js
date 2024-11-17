import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Hospitals.css';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('username'); // Default search field

  useEffect(() => {
    // Fetch hospitals data from backend API
    axios
      .get('http://localhost:5000/api/hospitals')
      .then((response) => {
        setHospitals(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching hospital data');
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  // Function to normalize tests_available to an array
  const normalizeTestsAvailable = (tests) => {
    if (typeof tests === 'string') {
      return tests.split(', ').map(test => test.trim());
    }
    return Array.isArray(tests) ? tests : [];
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    const fieldValue = hospital[searchField] || '';
    if (Array.isArray(fieldValue)) {
      return fieldValue.some((value) =>
        value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return fieldValue.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="hospitals-container">
      <h1 className="heading">Hospitals</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder={`Search by ${searchField}`}
          className="search-input"
          value={searchQuery}
          onChange={handleSearch}
        />
        <select
          value={searchField}
          onChange={handleFieldChange}
          className="search-dropdown"
        >
          <option value="username">Username</option>
          <option value="location">Location</option>
          <option value="description">Description</option>
          <option value="tests_available">Tests Available</option>
          <option value="specialties">Specialties</option>
          <option value="facilities">Facilities</option>
        </select>
      </div>
      <div className="hospitals-list">
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map((hospital) => (
            <div className="hospital-card" key={hospital.username}>
              <h3 className="hospital-name">{hospital.username}</h3>
              <p className="hospital-location">
                Location: {hospital.location || 'Not Available'}
              </p>
              <button className="details-btn">Details</button>
              <div className="hospital-details">
                <p className="hospital-description">
                  <strong>Description:</strong> {hospital.description}
                </p>
                <p className="hospital-tests">
                  <strong>Tests Available:</strong>{' '}
                  {normalizeTestsAvailable(hospital.tests_available).join(', ') ||
                    'Not Available'}
                </p>
                <p className="hospital-specialties">
                  <strong>Specialties:</strong>{' '}
                  {Array.isArray(hospital.specialties)
                    ? hospital.specialties.join(', ')
                    : hospital.specialties || 'Not Available'}
                </p>
                <p className="hospital-facilities">
                  <strong>Facilities:</strong>{' '}
                  {Array.isArray(hospital.facilities)
                    ? hospital.facilities.join(', ')
                    : hospital.facilities || 'Not Available'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No hospitals found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Hospitals;
