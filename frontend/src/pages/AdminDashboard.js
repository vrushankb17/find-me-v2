import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Camera, LogOut } from 'lucide-react';

const AdminDashboard = ({ setPage, fetchUsers, pageVariants, pageTransition }) => {
  return (
    <motion.div key="admin-dash" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="card">
        <Activity size={32} color="#ea580c" style={{marginBottom: "16px"}} />
        <h1 className="title">Dashboard</h1>
        <p className="subtitle">Welcome to the FindMe admin command center.</p>
        <div className="divider"></div>
        
        <button className="btn" onClick={fetchUsers}>
            <Users size={18} /> View Users Database
        </button>
        <button className="btn" onClick={() => setPage("detect")}>
            <Camera size={18} /> Live Camera Feed
        </button>
        <button className="btn secondary" style={{marginTop: "24px"}} onClick={() => setPage("home")}>
            <LogOut size={18} /> Sign Out
        </button>
    </motion.div>
  );
};

export default AdminDashboard;
