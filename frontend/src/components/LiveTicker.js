import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, UserCheck } from 'lucide-react';

const MOCK_SCANS = [
  { id: 1, name: "Rahul S.", sector: "Sector 4", time: "Just now", status: "match" },
  { id: 2, name: "Unknown", sector: "Gate 1", time: "1 min ago", status: "scan" },
];

const LiveTicker = () => {
    const [scans, setScans] = useState(MOCK_SCANS);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomSector = Math.floor(Math.random() * 12) + 1;
            const isMatch = Math.random() > 0.6;
            const newScan = {
                id: Date.now(),
                name: isMatch ? ["Amit K.", "Neha P.", "Suresh V.", "Anjali R."][Math.floor(Math.random()*4)] : "Unknown",
                sector: `Sector ${randomSector}`,
                time: "Just now",
                status: isMatch ? "match" : "scan"
            };
            setScans(prev => [newScan, ...prev.slice(0, 3)]);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="ticker-card">
            <h3 className="stats-title" style={{marginBottom: "16px", borderBottom: 'none'}}>Live Activity Feed</h3>
            <div className="ticker-list">
                <AnimatePresence>
                    {scans.map(scan => (
                        <motion.div 
                            key={scan.id} 
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="ticker-item"
                        >
                            <div className={`ticker-icon ${scan.status}`}>
                                {scan.status === "match" ? <UserCheck size={18} /> : <ScanFace size={18} />}
                            </div>
                            <div className="ticker-info">
                                <div className="ticker-name" style={{ color: scan.status === "match" ? "#34d399" : "#fff" }}>
                                    {scan.status === "match" ? `Match: ${scan.name}` : "Scanning Sector..."}
                                </div>
                                <div className="ticker-meta">{scan.sector} • {scan.time}</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LiveTicker;
