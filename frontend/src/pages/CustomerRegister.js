import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Fingerprint, User, Phone, Activity, Stethoscope } from 'lucide-react';
import API_BASE_URL from '../config/constants';

const CustomerRegister = ({ setPage, pageVariants, pageTransition }) => {
  const [photos, setPhotos] = useState([]);
  const [regData, setRegData] = useState({ 
    name: "", age: "", city: "", phone: "", gender: "", aadhar_number: "",
    emergency_contact_name: "", emergency_contact_phone: "",
    blood_group: "", height_cm: "", weight_kg: "",
    allergies: "", chronic_conditions: "", current_medications: "", past_surgeries: ""
  });
  const webcamRef = useRef(null);

  const capturePhoto = () => {
    if (photos.length >= 3) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setPhotos([...photos, imageSrc]);
  };

  const deletePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
  };

  const handleRegister = async () => {
    if (photos.length < 3) {
      alert("Please capture exactly 3 photos before submitting.");
      return;
    }
    if (!regData.name || !regData.phone || !regData.emergency_contact_name || !regData.emergency_contact_phone) {
      alert("Name, Phone, and Emergency Contact details are required.");
      return;
    }
    if (!regData.aadhar_number || regData.aadhar_number.length !== 12 || !/^\d+$/.test(regData.aadhar_number)) {
      alert("A valid 12-digit Aadhar Number is required.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, {
        ...regData,
        emp_id: "CUST-" + Math.floor(1000 + Math.random() * 9000), 
        age: parseInt(regData.age) || 0,
        height_cm: regData.height_cm ? parseFloat(regData.height_cm) : null,
        weight_kg: regData.weight_kg ? parseFloat(regData.weight_kg) : null,
        photos: photos
      });
      alert(`REGISTRATION SUCCESSFUL! Saved as ${response.data.name}`);
      setPhotos([]);
      setRegData({ 
        name: "", age: "", city: "", phone: "", gender: "", aadhar_number: "",
        emergency_contact_name: "", emergency_contact_phone: "",
        blood_group: "", height_cm: "", weight_kg: "",
        allergies: "", chronic_conditions: "", current_medications: "", past_surgeries: ""
      });
      setPage("home");
    } catch (error) {
      alert("Registration failed: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <motion.div key="cust-reg" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="kumbh-card" style={{maxWidth: "950px"}}>
      <h2 className="title"><Fingerprint size={32} style={{display: "inline", marginRight: "8px"}}/> Person Enrollment</h2>
      <div className="divider"></div>

      <div style={{display: 'flex', gap: '32px', flexWrap: 'wrap'}}>
        <div style={{flex: 2, minWidth: '400px'}}>
          <div className="info-text"><User size={20}/> Personal Details</div>
          <div className="input-group" style={{marginBottom: 0}}>
            <input className="kumbh-input" placeholder="Full Name *" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} />
          </div>
          <div className="input-group" style={{marginBottom: 0}}>
            <input className="kumbh-input" placeholder="Aadhar Card Number (12 digits) *" maxLength="12" value={regData.aadhar_number} onChange={e => setRegData({...regData, aadhar_number: e.target.value.replace(/\D/g, '')})} />
          </div>
          
          <div className="register-grid">
            <div className="input-group" style={{marginBottom: 0}}>
              <input className="kumbh-input" placeholder="Age" type="number" value={regData.age} onChange={e => setRegData({...regData, age: e.target.value})} />
            </div>
            
            <div className="input-group" style={{marginBottom: 0}}>
              <select className="kumbh-input" value={regData.gender} onChange={e => setRegData({...regData, gender: e.target.value})}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="register-grid">
            <div className="input-group" style={{marginBottom: 0}}>
              <input className="kumbh-input" placeholder="City / Location" value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})}/>
            </div>
            <div className="input-group" style={{marginBottom: 0}}>
              <input className="kumbh-input" placeholder="Contact Number *" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})}/>
            </div>
          </div>

          <div className="info-text" style={{marginTop: "24px"}}><Phone size={20}/> Emergency Contact</div>
          <div className="register-grid">
            <div className="input-group" style={{marginBottom: 0}}>
              <input className="kumbh-input" placeholder="Emergency Contact Name *" value={regData.emergency_contact_name} onChange={e => setRegData({...regData, emergency_contact_name: e.target.value})}/>
            </div>
            <div className="input-group" style={{marginBottom: 0}}>
              <input className="kumbh-input" placeholder="Emergency Contact Phone *" value={regData.emergency_contact_phone} onChange={e => setRegData({...regData, emergency_contact_phone: e.target.value})}/>
            </div>
          </div>

          <div className="info-text" style={{marginTop: "24px"}}><Stethoscope size={20}/> Medical Information</div>
          <div className="register-grid">
            <div className="input-group" style={{marginBottom: 0}}>
              <input className="kumbh-input" placeholder="Height (cm)" type="number" value={regData.height_cm} onChange={e => setRegData({...regData, height_cm: e.target.value})}/>
            </div>
            <div className="input-group" style={{marginBottom: 0}}>
              <input className="kumbh-input" placeholder="Weight (kg)" type="number" value={regData.weight_kg} onChange={e => setRegData({...regData, weight_kg: e.target.value})}/>
            </div>
            <div className="input-group" style={{marginBottom: 0}}>
              <select className="kumbh-input" value={regData.blood_group} onChange={e => setRegData({...regData, blood_group: e.target.value})}>
                <option value="">Blood Group</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
          </div>
          <div className="input-group" style={{marginBottom: 0}}>
            <input className="kumbh-input" placeholder="Chronic Conditions (e.g., Diabetes, Asthma)" value={regData.chronic_conditions} onChange={e => setRegData({...regData, chronic_conditions: e.target.value})} />
          </div>
          <div className="input-group" style={{marginBottom: 0}}>
            <input className="kumbh-input" placeholder="Allergies (e.g., Peanuts, Dust)" value={regData.allergies} onChange={e => setRegData({...regData, allergies: e.target.value})} />
          </div>
          <div className="input-group" style={{marginBottom: 0}}>
            <input className="kumbh-input" placeholder="Current Medications" value={regData.current_medications} onChange={e => setRegData({...regData, current_medications: e.target.value})} />
          </div>
          <div className="input-group" style={{marginBottom: 0}}>
            <input className="kumbh-input" placeholder="Past Surgeries" value={regData.past_surgeries} onChange={e => setRegData({...regData, past_surgeries: e.target.value})} />
          </div>

        </div>

        <div style={{flex: 1, minWidth: '300px'}}>
          <div className="info-text" style={{marginBottom: "16px"}}>Biometric Capture ({photos.length}/3)</div>

          <div className="camera-container kumbh-camera-container" style={{height: "300px", minHeight: "300px"}}>
            <Webcam mirrored={false} audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%" height="100%" className="webcam-feed" />
          </div>

          <button className="kumbh-btn secondary" onClick={capturePhoto} disabled={photos.length >= 3} style={{marginTop: "16px"}}>
            Capture Photo
          </button>

          {photos.length > 0 && (
            <div className="photo-grid" style={{marginTop: "16px"}}>
              <AnimatePresence>
              {photos.map((photo, index) => (
                <motion.div key={index} initial={{scale: 0}} animate={{scale: 1}} exit={{scale: 0}} className="photo-item kumbh-photo-item">
                  <img src={photo} alt={`capture-${index}`} />
                  <button className="delete-btn kumbh-delete-btn" onClick={() => deletePhoto(index)}>×</button>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="divider"></div>
      
      <div className="camera-actions" style={{marginTop: 0}}>
        <button className="kumbh-btn" onClick={handleRegister}>
            Submit Registration
        </button>

        <button className="kumbh-btn secondary" onClick={() => setPage("home")}>
            Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default CustomerRegister;
