import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const mapCenter = [80, 22]; // India

const IndiaMap = () => {
  return (
    <div className="map-card">
      <h3 className="stats-title" style={{marginBottom: "8px", borderBottom: 'none'}}>Live Surveillance Map</h3>
      <p className="subtitle" style={{marginBottom: "16px", fontSize: "0.85rem", color: "#ea580c", fontWeight: "600"}}>Monitoring Kumbh Mela Zones</p>
      
      <div className="map-inner-container">
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 800, center: mapCenter }} width={400} height={240} style={{ width: "100%", height: "100%" }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill={geo.properties.name === "India" ? "rgba(234, 88, 12, 0.15)" : "transparent"} 
                  stroke={geo.properties.name === "India" ? "#ea580c" : "rgba(0,0,0,0.05)"}
                  strokeWidth={geo.properties.name === "India" ? 1 : 0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "rgba(234, 88, 12, 0.25)" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {/* Prayagraj */}
          <Marker coordinates={[81.8463, 25.4358]}>
            <circle r={8} fill="#ef4444" opacity={0.4}>
              <animate attributeName="r" values="3;10;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r={4} fill="#ef4444" />
          </Marker>
          <Marker coordinates={[78.1642, 29.9457]}>
            <circle r={4} fill="#f97316" />
          </Marker>
          <Marker coordinates={[75.7788, 23.1793]}>
            <circle r={4} fill="#f97316" />
          </Marker>
          <Marker coordinates={[73.7898, 19.9975]}>
            <circle r={4} fill="#f97316" />
          </Marker>
        </ComposableMap>
      </div>
    </div>
  );
};

export default IndiaMap;