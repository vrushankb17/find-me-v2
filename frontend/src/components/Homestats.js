import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./Homestats.css";

const genderData = [
{ name: "Women", value: 60 },
{ name: "Others", value: 40 },
];

const casesData = [
{ name: "Solved", value: 15421 },
{ name: "Pending", value: 9087 },
];

const COLORS = ["#7b5cff", "#00ffa6"];

export default function HomeStats() {
return ( <div className="statsWrapper">

```
  <div className="statBox">
    <h3>Gender Distribution</h3>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={genderData}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {genderData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <p>60% Women</p>
  </div>

  <div className="statBox">
    <h3>Cases Status</h3>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={casesData}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {casesData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <p>15,421 Solved</p>
  </div>

  <div className="numbersRow">
    <div>
      <h2>24,508</h2>
      <span>Total Missing (Delhi 2025)</span>
    </div>

    <div>
      <h2>9,087</h2>
      <span>Pending Cases</span>
    </div>

    <div>
      <h2>807</h2>
      <span>Jan 2026 (15 days)</span>
    </div>
  </div>

</div>

);
}
