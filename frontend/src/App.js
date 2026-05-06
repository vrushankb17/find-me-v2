import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Search, Radar, CheckCircle2, UserPlus, Edit2, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import IndiaMap from "./components/IndiaMap";
import LiveTicker from "./components/LiveTicker";
import WeatherWidget from "./components/WeatherWidget";
import ChatBot from "./components/ChatBot";
import CustomerRegister from "./pages/CustomerRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import API_BASE_URL from "./config/constants";
import "./App.css";

function App() {
  const [page, setPage] = useState("home"); // User starts directly at the Home / Dashboard
  const webcamRef = useRef(null);

  // States for Admin
  const [allUsers, setAllUsers] = useState([]);

  // Determine if we are in the "admin" new tab
  const pathParts = window.location.pathname.split('/');
  const isAdminTab = pathParts.includes('admin');

  // Form states
  const [adminReg, setAdminReg] = useState({ username: "", password: "", confirm: "" });
  const [mockCameraId, setMockCameraId] = useState("CAM-FRONT-GATE");
  const [detectStatus, setDetectStatus] = useState("");

  const runMockDetection = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setDetectStatus("Analyzing frame...");
    try {
      const response = await axios.post(`${API_BASE_URL}/detect/camera-upload`, {
        camera_id: mockCameraId,
        location: "Main Lobby Entrance",
        photo: imageSrc
      });

      if (response.data.matched) {
         setDetectStatus(`MATCH FOUND: Employee ${response.data.emp_id} spotted at ${mockCameraId}!`);
      } else {
         setDetectStatus(`No known faces matched.`);
      }
    } catch (error) {
      setDetectStatus("Error checking face");
    }
  };

  const fetchRegisteredUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/`);
      setAllUsers(response.data);
      setPage("registered-users");
    } catch (error) {
      alert("Failed to load users: " + error.message);
    }
  };

  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditFormData(user);
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/users/${editingUserId}`, editFormData);
      setEditingUserId(null);
      fetchRegisteredUsers(); // refresh the list
    } catch (error) {
      alert("Failed to update user: " + error.message);
    }
  };

  const handleDeleteUser = async (user_id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${user_id}`);
        fetchRegisteredUsers(); // refresh the list
      } catch (error) {
        alert("Failed to delete user: " + error.message);
      }
    }
  };

  // --- Dummy Data for Charts ---
  const pieData = [
    { name: 'Currently Missing', value: 420 },
    { name: 'Found & Reunited', value: 1350 },
  ];

  const barData = [
    { name: 'Day 1', lost: 120, found: 90 },
    { name: 'Day 2', lost: 200, found: 150 },
    { name: 'Day 3', lost: 150, found: 210 },
    { name: 'Day 4', lost: 300, found: 280 },
    { name: 'Day 5', lost: 90,  found: 320 },
  ];

  // --- Animation Variants ---
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -15 }
  };
  
  const pageTransition = { duration: 0.3, ease: "easeOut" };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  
  const fadeItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="app">
      <div className="container">

        {/* ----------------- ADMIN TAB VIEWS ----------------- */}
        <AnimatePresence mode="wait">
        
        {isAdminTab && page === "home" && (
          <motion.div key="admin-home" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="card">
              <h1 className="title"><ShieldAlert size={28} /> Admin Access</h1>
              <p className="subtitle">Secure authentication required to access the dashboard.</p>
              
              <button className="btn" onClick={() => setPage("login")}>
                Login to Dashboard
              </button>
              <button className="btn secondary" onClick={() => setPage("admin-register")}>
                Create Admin Account
              </button>
          </motion.div>
        )}

        {isAdminTab && page === "admin-register" && (
          <motion.div key="admin-reg" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="card">
            <h2 className="title"><UserPlus size={24} /> New Admin</h2>
            <div className="divider"></div>

            <div className="input-group">
              <input className="input" placeholder="Admin Username" value={adminReg.username} onChange={e => setAdminReg({...adminReg, username: e.target.value})} />
            </div>
            
            <div className="input-group">
              <input className="input" type="password" placeholder="Password" value={adminReg.password} onChange={e => setAdminReg({...adminReg, password: e.target.value})} />
            </div>
            
            <div className="input-group">
              <input className="input" type="password" placeholder="Confirm Password" value={adminReg.confirm} onChange={e => setAdminReg({...adminReg, confirm: e.target.value})} />
            </div>

            <button className="btn" onClick={async () => {
              if (adminReg.password && adminReg.password === adminReg.confirm) {
                try {
                  await axios.post(`${API_BASE_URL}/admin/register`, {
                    username: adminReg.username,
                    password: adminReg.password
                  });
                  alert("Account created successfully.");
                  setPage("login");
                } catch(error) {
                  alert(error.response?.data?.detail || "Failed to create account");
                }
              } else {
                alert("Passwords do not match.");
              }
            }}>
              Create Account
            </button>
            <button className="btn secondary" onClick={() => setPage("home")}>Cancel</button>
          </motion.div>
        )}

        {isAdminTab && page === "login" && (
          <AdminLogin 
            setPage={setPage} 
            adminReg={adminReg} 
            pageVariants={pageVariants} 
            pageTransition={pageTransition} 
          />
        )}

        {isAdminTab && page === "admin-dashboard" && (
          <AdminDashboard 
            setPage={setPage} 
            fetchUsers={fetchRegisteredUsers} 
            pageVariants={pageVariants} 
            pageTransition={pageTransition} 
          />
        )}

        {/* REGISTERED USERS TABLE */}
        {isAdminTab && page === "registered-users" && (
          <motion.div key="reg-users" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="card wide-card">
            <h2 className="title"><Search size={24} style={{display: "inline", marginRight: "10px"}} /> Users Database</h2>
            <div className="divider"></div>
            
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Aadhar No.</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>City/Sector</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u, i) => (
                    editingUserId === u.id ? (
                      <motion.tr key={u.id} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: i * 0.05}}>
                        <td><input className="input" style={{padding:"4px", fontSize:"0.9rem"}} value={editFormData.emp_id || ''} onChange={(e) => setEditFormData({...editFormData, emp_id: e.target.value})} /></td>
                        <td><input className="input" style={{padding:"4px", fontSize:"0.9rem", width:"110px"}} maxLength="12" value={editFormData.aadhar_number || ''} onChange={(e) => setEditFormData({...editFormData, aadhar_number: e.target.value.replace(/\D/g, '')})} /></td>
                        <td><input className="input" style={{padding:"4px", fontSize:"0.9rem"}} value={editFormData.name || ''} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} /></td>
                        <td><input className="input" type="number" style={{padding:"4px", fontSize:"0.9rem", width:"50px"}} value={editFormData.age || ''} onChange={(e) => setEditFormData({...editFormData, age: e.target.value})} /></td>
                        <td><input className="input" style={{padding:"4px", fontSize:"0.9rem", width:"70px"}} value={editFormData.gender || ''} onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})} /></td>
                        <td><input className="input" style={{padding:"4px", fontSize:"0.9rem"}} value={editFormData.city || ''} onChange={(e) => setEditFormData({...editFormData, city: e.target.value})} /></td>
                        <td><input className="input" style={{padding:"4px", fontSize:"0.9rem"}} value={editFormData.phone || ''} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} /></td>
                        <td style={{display: "flex", gap: "8px", justifyContent: "center"}}>
                          <button className="btn" style={{padding: "4px 8px"}} onClick={handleUpdateSubmit}>Save</button>
                          <button className="btn secondary" style={{padding: "4px 8px"}} onClick={() => setEditingUserId(null)}>Cancel</button>
                        </td>
                      </motion.tr>
                    ) : (
                      <motion.tr key={u.id} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: i * 0.05}}>
                        <td className="highlight-text">{u.emp_id}</td>
                        <td className="highlight-text">{u.aadhar_number}</td>
                        <td>{u.name}</td>
                        <td>{u.age}</td>
                        <td>{u.gender}</td>
                        <td>{u.city}</td>
                        <td>{u.phone}</td>
                        <td style={{display: "flex", gap: "8px", justifyContent: "center"}}>
                          <button className="btn secondary" style={{padding: "4px 8px"}} onClick={() => handleEditClick(u)} title="Edit"><Edit2 size={16} /></button>
                          <button className="btn secondary" style={{padding: "4px 8px", color: "#f43f5e", borderColor: "#f43f5e"}} onClick={() => handleDeleteUser(u.id)} title="Delete"><Trash2 size={16} /></button>
                        </td>
                      </motion.tr>
                    )
                  ))}
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{padding: "30px", textAlign: "center", color: "#888"}}>No records found in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button className="btn secondary" style={{marginTop: "24px"}} onClick={() => setPage("admin-dashboard")}>
              Back to Dashboard
            </button>
          </motion.div>
        )}

        {/* DETECTION HUD (Admin Only via New Tab) */}
        {isAdminTab && page === "detect" && (
          <motion.div key="hud-detect" initial="hidden" animate="visible" variants={fadeVariants} className="dashboard-layout">
            
            {/* LEFT DATA PANEL */}
            <motion.div variants={fadeItem} className="panel side-panel">
              <h3 className="panel-title">Camera Settings</h3>
              
              <div className="data-box">
                <span className="data-label">Camera Source</span>
                <input className="input" value={mockCameraId} onChange={(e) => setMockCameraId(e.target.value)} />
              </div>

              <div className="data-box">
                <span className="data-label">Status</span>
                <div className={`status-badge ${detectStatus.includes('MATCH') ? 'success' : ''}`}>
                  {detectStatus || "Awaiting scan..."}
                </div>
              </div>
            </motion.div>

            {/* CENTER CAM VIEW */}
            <motion.div variants={fadeItem} className="panel main-panel">
               <div className="camera-container">
                 <Webcam mirrored={false} audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="webcam-feed" />
                 <div className="camera-label">{mockCameraId} • LIVE</div>
               </div>

               <div className="camera-actions">
                  <button className="btn" onClick={runMockDetection}>
                     Scan Frame
                  </button>
                  <button className="btn secondary" onClick={() => {
                    setDetectStatus("");
                    setPage("admin-dashboard");
                  }}>
                    Close Camera
                  </button>
               </div>
            </motion.div>

          </motion.div>
        )}

        {/* ----------------- CUSTOMER TAB VIEWS ----------------- */}
        {/* EXTERNAL DASHBOARD */}
        {!isAdminTab && page === "home" && (
          <motion.div key="cust-home" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="home-layout">

            {/* LEFT COLUMN */}
            <div className="home-left">
              <h1 className="title" style={{fontSize: "3.5rem", marginBottom: "8px"}}>FindMe</h1>
              <p className="subtitle" style={{fontSize: "1.1rem"}}>AI-Powered Person Identification System for Large Scale Events.</p>

              <div style={{display: 'flex', gap: '16px', width: '100%', maxWidth: '400px', marginBottom: '16px'}}>
                <button className="btn" onClick={() => setPage("register")}>
                  Enroll Person
                </button>
                <button className="btn secondary" onClick={() => window.open("/admin", "_blank")}>
                  Admin Login
                </button>
              </div>

              <LiveTicker />

              <div style={{marginTop: '24px', width: '100%'}}>
                <WeatherWidget />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="home-right">
              <div className="home-right-inner">

                {/* Stats Card - aligned with LiveTicker */}
                <div className="stats-card">
                  <h3 className="stats-title">Kumbh Mela Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-box">
                      <div style={{display: "flex", justifyContent: "center", marginBottom: "8px"}}>
                        <Radar size={32} color="#f43f5e" />
                      </div>
                      <div className="stat-value highlight-red">420</div>
                      <div className="stat-label">Currently Missing</div>
                    </div>
                    <div className="stat-box">
                      <div style={{display: "flex", justifyContent: "center", marginBottom: "8px"}}>
                        <CheckCircle2 size={32} color="#10b981" />
                      </div>
                      <div className="stat-value highlight-green">1,350</div>
                      <div className="stat-label">Successfully Reunited</div>
                    </div>
                  </div>

                  <div className="charts-container">
                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <defs>
                            <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f43f5e" stopOpacity={1}/>
                              <stop offset="95%" stopColor="#fb923c" stopOpacity={1}/>
                            </linearGradient>
                            <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={1}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={1}/>
                            </linearGradient>
                          </defs>
                          <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fill="#1f2937" fontSize="24" fontWeight="bold">
                            1,770
                          </text>
                          <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="#ea580c" fontSize="12">
                            Total Cases
                          </text>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={70}
                            dataKey="value"
                            stroke="none"
                            paddingAngle={5}
                            cornerRadius={4}
                          >
                            <Cell key={`cell-0`} fill="url(#colorLost)" />
                            <Cell key={`cell-1`} fill="url(#colorFound)" />
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px' }} itemStyle={{ color: '#1f2937' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="chart-label">Status Distribution</div>
                    </div>

                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="barColorLost" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f43f5e" stopOpacity={1}/>
                              <stop offset="95%" stopColor="#fb923c" stopOpacity={1}/>
                            </linearGradient>
                            <linearGradient id="barColorFound" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={1}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={1}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" tick={{fontSize: 10, fill: '#ea580c'}} axisLine={false} tickLine={false} />
                          <YAxis tick={{fontSize: 10, fill: '#ea580c'}} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: '#ffedd5'}} contentStyle={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px' }} itemStyle={{ color: '#1f2937' }} />
                          <Bar dataKey="lost" fill="url(#barColorLost)" radius={[5, 5, 0, 0]} barSize={12} />
                          <Bar dataKey="found" fill="url(#barColorFound)" radius={[5, 5, 0, 0]} barSize={12} />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="chart-label">Daily Cases (Lost vs Found)</div>
                    </div>
                  </div>
                </div>

                {/* India Map - below stats */}
                <IndiaMap />

              </div>
            </div>

          </motion.div>
        )}

        {/* CUSTOMER ENROLLMENT */}
        {!isAdminTab && page === "register" && (
          <CustomerRegister 
            setPage={setPage} 
            pageVariants={pageVariants} 
            pageTransition={pageTransition} 
          />
        )}
        
        </AnimatePresence>

        {!isAdminTab && <ChatBot />}
      </div>
    </div>
  );
}

export default App;