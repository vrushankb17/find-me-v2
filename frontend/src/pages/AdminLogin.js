import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanFace } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config/constants';

const AdminLogin = ({ setPage, adminReg, pageVariants, pageTransition }) => {
  const [adminCreds, setAdminCreds] = useState({ username: "", password: "" });

  return (
    <motion.div key="admin-login" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="card">
      <h1 className="title"><ScanFace size={28} /> Authentication</h1>
      <div className="divider"></div>

      <div className="input-group">
        <input className="input" placeholder="Username" value={adminCreds.username} onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} />
      </div>
      <div className="input-group">
        <input className="input" type="password" placeholder="Password" value={adminCreds.password} onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} />
      </div>

      <button className="btn" onClick={async () => {
        try {
          const response = await axios.post(`${API_BASE_URL}/admin/login`, {
            username: adminCreds.username,
            password: adminCreds.password
          });
          if (response.data.message === "Login successful") {
            setPage("admin-dashboard");
            setAdminCreds({username: "", password: ""});
          }
        } catch (error) {
          alert(error.response?.data?.detail || "Invalid credentials.");
        }
      }}>
        Login
      </button>
      <button className="btn secondary" onClick={() => setPage("home")}>Cancel</button>
    </motion.div>
  );
};

export default AdminLogin;
