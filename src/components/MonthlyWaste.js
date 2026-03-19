import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { CircularProgress } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTHS      = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL  = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .wa-root {
    min-height: 100vh; background: #080b08;
    font-family: 'Outfit', sans-serif; color: #e8f0e9;
    padding: 48px 24px 88px; position: relative; overflow: hidden;
  }
  .wa-root::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.038) 1px, transparent 1px);
    background-size: 38px 38px;
    mask-image: radial-gradient(ellipse 85% 85% at 50% 30%, black 20%, transparent 100%);
  }
  .wa-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

  .wa-header { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:40px; padding-bottom:22px; border-bottom:1px solid rgba(255,255,255,0.07); }
  .wa-eyebrow { display:inline-flex; align-items:center; gap:7px; font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:rgba(251,113,133,0.80); border:1px solid rgba(251,113,133,0.20); border-radius:100px; padding:5px 14px; margin-bottom:14px; width:fit-content; background:rgba(251,113,133,0.07); }
  .wa-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:#fb7185; box-shadow:0 0 7px rgba(251,113,133,0.7); animation:wadot 2s ease-in-out infinite; }
  @keyframes wadot { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .wa-title { font-family:'Playfair Display',serif; font-size:clamp(28px,4.5vw,48px); font-weight:900; line-height:1.06; letter-spacing:-2px; color:#f0f7f0; }
  .wa-title em { font-style:italic; color:#fb7185; }
  .wa-ghost { font-family:'Playfair Display',serif; font-size:clamp(52px,8vw,88px); font-weight:900; color:rgba(255,255,255,0.03); line-height:1; letter-spacing:-5px; user-select:none; }

  .wa-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:24px; }
  .wa-stat { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-top:2px solid #fb7185; border-radius:14px; padding:20px 22px; transition:background 0.2s; }
  .wa-stat:hover { background:rgba(251,113,133,0.05); }
  .wa-stat-label { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(232,240,233,0.28); margin-bottom:9px; }
  .wa-stat-val { font-family:'DM Mono',monospace; font-size:clamp(22px,3vw,32px); font-weight:500; line-height:1; letter-spacing:-1px; color:#fb7185; }
  .wa-stat-unit { font-size:13px; color:rgba(232,240,233,0.28); margin-left:3px; font-family:'Outfit',sans-serif; }
  .wa-stat-sub { font-size:11px; color:rgba(232,240,233,0.26); margin-top:5px; }

  .wa-charts { display:flex; flex-direction:column; gap:20px; }
  .wa-card { background:rgba(255,255,255,0.028); border:1px solid rgba(255,255,255,0.07); border-radius:16px; overflow:hidden; }
  .wa-card-head { padding:20px 26px 16px; border-bottom:1px solid rgba(255,255,255,0.065); display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .wa-card-title { font-size:14px; font-weight:700; color:rgba(232,240,233,0.75); display:flex; align-items:center; gap:9px; }
  .wa-card-bar-red  { width:4px; height:16px; border-radius:3px; background:#fb7185; flex-shrink:0; }
  .wa-card-bar-blue { width:4px; height:16px; border-radius:3px; background:#38bdf8; flex-shrink:0; }
  .wa-pill-red  { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:4px 12px; border-radius:100px; background:rgba(251,113,133,0.10); color:#fb7185; border:1px solid rgba(251,113,133,0.22); }
  .wa-pill-blue { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:4px 12px; border-radius:100px; background:rgba(56,189,248,0.10); color:#38bdf8; border:1px solid rgba(56,189,248,0.20); }
  .wa-card-body { padding:24px 26px 28px; height:320px; }

  .wa-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:14px; }
  .wa-loading-txt { font-size:13px; color:rgba(232,240,233,0.28); }
  .wa-error { max-width:380px; margin:80px auto; text-align:center; background:rgba(251,113,133,0.07); border:1px solid rgba(251,113,133,0.20); border-radius:16px; padding:32px; }
  .wa-error-icon { font-size:36px; margin-bottom:12px; }
  .wa-error-msg { font-size:14px; font-weight:600; color:#fb7185; }
  .wa-login { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; background:#080b08; font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:rgba(232,240,233,0.25); }
  .wa-login span { font-size:48px; }

  @media (max-width:700px) { .wa-root{padding:36px 14px 72px;} .wa-stats{grid-template-columns:1fr;} .wa-card-body{height:260px;} }
  @media (max-width:480px) { .wa-stats{grid-template-columns:1fr 1fr;} .wa-ghost{display:none;} }
`;

const makeOpts = (color) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#0d1210",
      titleFont: { family:"Outfit", weight:"700", size:13 },
      bodyFont:  { family:"Outfit", size:12 },
      borderColor: "rgba(255,255,255,0.09)", borderWidth: 1,
      padding: 12, cornerRadius: 9,
      callbacks: { label: ctx => ` ${ctx.parsed.y}g wasted` },
    },
  },
  scales: {
    x: { grid:{display:false}, border:{display:false}, ticks:{ color:"rgba(232,240,233,0.28)", font:{family:"Outfit",size:11,weight:"600"} } },
    y: { grid:{color:"rgba(255,255,255,0.05)"}, border:{display:false}, ticks:{ color:"rgba(232,240,233,0.28)", font:{family:"Outfit",size:11}, callback: v=>`${v}g` } },
  },
});

const WasteAnalysis = ({ newWaste }) => {
  const { loggedIn } = useContext(AuthContext);
  const [monthlyWaste, setMonthlyWaste] = useState(Array(12).fill(0));
  const [dailyWaste,   setDailyWaste]   = useState(Array(31).fill(0));
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => { if (loggedIn) fetchData(); }, [loggedIn]);
  useEffect(() => { if (newWaste) fetchData(); }, [newWaste]);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const res = await axios.get("https://backend-food-analysis.onrender.com/waste", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const byMonth = Array(12).fill(0);
      const byDay   = Array(31).fill(0);
      const curMon  = new Date().getMonth();
      res.data.forEach(item => {
        const d = new Date(item.foodWasteDate);
        byMonth[d.getMonth()] += item.foodQuantity;
        if (d.getMonth() === curMon) byDay[d.getDate() - 1] += item.foodQuantity;
      });
      setMonthlyWaste(byMonth);
      setDailyWaste(byDay);
    } catch (e) { setError("Failed to fetch data. Please try again."); }
    finally { setLoading(false); }
  };

  const totalWaste       = monthlyWaste.reduce((a, b) => a + b, 0);
  const peakIdx          = monthlyWaste.indexOf(Math.max(...monthlyWaste));
  const thisMonthWaste   = monthlyWaste[new Date().getMonth()];
  const curMonLabel      = MONTH_FULL[new Date().getMonth()];

  const monthData = {
    labels: MONTHS,
    datasets: [{
      label: "Waste (g)", data: monthlyWaste,
      backgroundColor: monthlyWaste.map(v => v === Math.max(...monthlyWaste) ? "#fb7185" : "rgba(251,113,133,0.18)"),
      hoverBackgroundColor: "#fb7185",
      borderRadius: 7, borderSkipped: false,
    }],
  };

  const dayData = {
    labels: Array.from({ length: 31 }, (_, i) => i + 1),
    datasets: [{
      label: "Daily Waste (g)", data: dailyWaste,
      backgroundColor: "rgba(56,189,248,0.18)",
      hoverBackgroundColor: "#38bdf8",
      borderRadius: 5, borderSkipped: false,
    }],
  };

  if (!loggedIn) return (
    <><style>{css}</style>
      <div className="wa-login"><span>🔒</span>Please log in to view waste analysis.</div></>
  );

  return (
    <><style>{css}</style>
    <div className="wa-root">
      <div className="wa-inner">

        <div className="wa-header">
          <div>
            <div className="wa-eyebrow"><span className="wa-eyebrow-dot"/>Analytics</div>
            <h1 className="wa-title">Your <em>Waste</em> Analysis</h1>
          </div>
          <div className="wa-ghost">📊</div>
        </div>

        {loading ? (
          <div className="wa-loading">
            <CircularProgress size={34} sx={{ color:"#fb7185" }} />
            <span className="wa-loading-txt">Loading your data…</span>
          </div>
        ) : error ? (
          <div className="wa-error"><div className="wa-error-icon">⚠️</div><div className="wa-error-msg">{error}</div></div>
        ) : (
          <>
            <div className="wa-stats">
              {[
                { label:"Total Waste",  val: totalWaste.toLocaleString(),     unit:"g", sub:"Across all months" },
                { label:"This Month",   val: thisMonthWaste.toLocaleString(), unit:"g", sub: curMonLabel },
                { label:"Peak Month",   val: MONTHS[peakIdx],                 unit:"",  sub:"Highest recorded waste" },
              ].map(s => (
                <div className="wa-stat" key={s.label}>
                  <div className="wa-stat-label">{s.label}</div>
                  <div className="wa-stat-val">{s.val}<span className="wa-stat-unit">{s.unit}</span></div>
                  <div className="wa-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="wa-charts">
              {/* Monthly */}
              <div className="wa-card">
                <div className="wa-card-head">
                  <div className="wa-card-title"><div className="wa-card-bar-red"/>Monthly Waste Summary</div>
                  <div className="wa-pill-red">Jan – Dec</div>
                </div>
                <div className="wa-card-body">
                  <Bar data={monthData} options={makeOpts("#fb7185")} />
                </div>
              </div>

              {/* Daily */}
              <div className="wa-card">
                <div className="wa-card-head">
                  <div className="wa-card-title"><div className="wa-card-bar-blue"/>Daily Waste — {MONTHS[new Date().getMonth()]}</div>
                  <div className="wa-pill-blue">This Month</div>
                </div>
                <div className="wa-card-body">
                  <Bar data={dayData} options={makeOpts("#38bdf8")} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div></>
  );
};

export default WasteAnalysis;