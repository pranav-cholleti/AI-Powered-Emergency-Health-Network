import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/PatientProfile.css';

const PatientProfile = ({ username }) => {
    const [formData, setFormData] = useState(null); // Start with null
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`http://localhost:5006/api/patient/${username}`);
                const reportData = response.data?.report || {}; // Fetch only report part
                setFormData(reportData);
            } catch (error) {
                setError('Failed to fetch patient data');
            }
        };
        fetchPatientData();
    }, [username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5006/api/patient/${username}`, {
                report: formData,
            });
            alert('Profile updated successfully!');
        } catch (error) {
            setError('Failed to update profile');
        }
    };

    if (error) return <div className="error">{error}</div>;
    if (!formData) return <div>Loading...</div>;

    return (
        <div className="patient-profile">
            <h1>{username}'s Profile</h1>
            <form onSubmit={handleSubmit}>
                <label>Blood Group</label>
                <input
                    name="blood_group"
                    value={formData?.blood_group || ''}
                    placeholder="No data"
                    onChange={handleChange}
                />

                <label>Weight (kg)</label>
                <input
                    name="weight"
                    type="number"
                    value={formData?.weight || ''}
                    placeholder="No data"
                    onChange={handleChange}
                />

                <label>Age</label>
                <input
                    name="age"
                    type="number"
                    value={formData?.age || ''}
                    placeholder="No data"
                    onChange={handleChange}
                />

                <label>Address</label>
                <input
                    name="address"
                    value={formData?.address || ''}
                    placeholder="No data"
                    onChange={handleChange}
                />

                <label>Phone</label>
                <input
                    name="phone"
                    value={formData?.phone || ''}
                    placeholder="No data"
                    onChange={handleChange}
                />

                <label>Email</label>
                <input
                    name="email"
                    value={formData?.email || ''}
                    placeholder="No data"
                    onChange={handleChange}
                />

                <label>Medical Conditions (comma-separated)</label>
                <input
                    name="medical_conditions"
                    value={formData?.medical_conditions?.join(', ') || ''}
                    placeholder="No data"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            medical_conditions: e.target.value.split(',').map((cond) => cond.trim()),
                        })
                    }
                />

                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default PatientProfile;
