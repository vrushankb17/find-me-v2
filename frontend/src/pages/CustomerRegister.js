import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Fingerprint } from 'lucide-react';
import API_BASE_URL from '../config/constants';

const CustomerRegister = ({ setPage, pageVariants, pageTransition }) => {
  const [photos, setPhotos] = useState([]);
  const [regData, setRegData] = useState({ name: "", age: "", city: "", phone: "", gender: "", aadhar_number: "" });
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
    if (!regData.name) {
      alert("Name is required.");
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
        photos: photos
      });
      alert(`REGISTRATION SUCCESSFUL! Saved as ${response.data.name}`);
      setPhotos([]);
      setRegData({ name: "", age: "", city: "", phone: "", gender: "", aadhar_number: "" });
      setPage("home");
    } catch (error) {
      alert("Registration failed: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <motion.div key="cust-reg" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="card wide-card" style={{maxWidth: "700px"}}>
      <h2 className="title"><Fingerprint size={24} style={{display: "inline", marginRight: "8px"}}/> Person Enrollment</h2>
      <div className="divider"></div>

      <div style={{display: 'flex', gap: '32px', flexWrap: 'wrap'}}>
        <div style={{flex: 1, minWidth: '300px'}}>
          <div className="info-text">Personal Details</div>
          <div className="input-group">
            <input className="input" placeholder="Full Name" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <input className="input" placeholder="Aadhar Card Number (12 digits)" maxLength="12" value={regData.aadhar_number} onChange={e => setRegData({...regData, aadhar_number: e.target.value.replace(/\D/g, '')})} />
          </div>
          
          <div className="register-grid">
            <div className="input-group">
              <input className="input" placeholder="Age" value={regData.age} onChange={e => setRegData({...regData, age: e.target.value})} />
            </div>
            
            <div className="input-group">
              <select className="input" value={regData.gender} onChange={e => setRegData({...regData, gender: e.target.value})}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <input className="input" placeholder="City / Location" value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})}/>
          </div>
          <div className="input-group">
            <input className="input" placeholder="Contact Number" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})}/>
          </div>
        </div>

        <div style={{flex: 1, minWidth: '300px'}}>
          <div className="info-text" style={{marginBottom: "12px"}}>Biometric Capture ({photos.length}/3)</div>

          <div className="camera-container" style={{height: "300px", minHeight: "300px"}}>
            <Webcam mirrored={false} audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%" height="100%" className="webcam-feed" />
          </div>

          <button className="btn secondary" onClick={capturePhoto} disabled={photos.length >= 3} style={{marginTop: "12px"}}>
            Capture Photo
          </button>

          {photos.length > 0 && (
            <div className="photo-grid">
              <AnimatePresence>
              {photos.map((photo, index) => (
                <motion.div key={index} initial={{scale: 0}} animate={{scale: 1}} exit={{scale: 0}} className="photo-item">
                  <img src={photo} alt={`capture-${index}`} />
                  <button className="delete-btn" onClick={() => deletePhoto(index)}>×</button>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="divider"></div>
      
      <div className="camera-actions" style={{marginTop: 0}}>
        <button className="btn" onClick={handleRegister}>
            Submit Registration
        </button>

        <button className="btn secondary" onClick={() => setPage("home")}>
            Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default CustomerRegister;
