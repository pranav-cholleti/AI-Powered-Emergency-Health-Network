import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/HospitalProfile.css';

const HospitalProfile = ({ username }) => {
  const [hospital, setHospital] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    tests_available: '',
    specialties: '',
    facilities: ''
  });

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const response = await axios.get(`http://localhost:5004/api/hospital/${username}`);
        setHospital(response.data);
        setFormData({
          description: response.data.description || '',
          tests_available: response.data.tests_available || '',
          specialties: response.data.specialties || '',
          facilities: response.data.facilities || ''
        });
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      }
    };

    fetchHospitalData();
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        username,
        description: formData.description,
        tests_available: formData.tests_available,
        specialties: formData.specialties,
        facilities: formData.facilities
      };

      const response = await axios.put(`http://localhost:5004/api/hospital/${username}`, updatedData);
      console.log('Updated successfully:', response.data);
      alert('Hospital profile updated successfully!');
      setHospital(response.data);
    } catch (err) {
      setError('Error updating data');
      console.error('Error updating data:', err);
    }
  };

  if (error) {
    return <div className="hospital-profile error">{error}</div>;
  }

  if (!hospital) {
    return <div className="hospital-profile">Loading...</div>;
  }

  return (
    <div className="hospital-profile">
      <h1 className="hospital-title">{hospital.username}</h1>
      <div className="hospital-details">
        <div className="detail-item"><strong>Location:</strong> <span>{hospital.location || "No Data"}</span></div>
        <div className="detail-item"><strong>Description:</strong> <span>{hospital.description || "No Data"}</span></div>
        <div className="detail-item"><strong>Tests Available:</strong> <span>{hospital.tests_available || "No Data"}</span></div>
        <div className="detail-item"><strong>Specialties:</strong> <span>{hospital.specialties || "No Data"}</span></div>
        <div className="detail-item"><strong>Facilities:</strong> <span>{hospital.facilities || "No Data"}</span></div>
      </div>

      <h2 className="update-title">Update Hospital Profile</h2>
      <form className="hospital-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            className="input-field"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Tests Available (comma separated):</label>
          <input
            className="input-field"
            type="text"
            name="tests_available"
            value={formData.tests_available}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Specialties (comma separated):</label>
          <input
            className="input-field"
            type="text"
            name="specialties"
            value={formData.specialties}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Facilities (comma separated):</label>
          <input
            className="input-field"
            type="text"
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
          />
        </div>
        <button className="update-button" type="submit">Update</button>
      </form>
    </div>
  );
};

export default HospitalProfile;
