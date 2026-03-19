import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { CircularProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ACCENT = "#a78bfa"; // violet for spending
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ms-root {
    min-height: 100vh; background: #080b08;
    font-family: 'Outfit', sans-serif; color: #e8f0e9;
    padding: 48px 24px 88px; position: relative; overflow: hidden;
  }
  .ms-root::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.038) 1px, transparent 1px);
    background-size: 38px 38px;
    mask-image: radial-gradient(ellipse 85% 85% at 50% 30%, black 20%, transparent 100%);
  }
  .ms-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

  .ms-header { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:40px; padding-bottom:22px; border-bottom:1px solid rgba(255,255,255,0.07); }
  .ms-eyebrow { display:inline-flex; align-items:center; gap:7px; font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:rgba(167,139,250,0.80); border:1px solid rgba(167,139,250,0.22); border-radius:100px; padding:5px 14px; margin-bottom:14px; width:fit-content; background:rgba(167,139,250,0.07); }
  .ms-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:#a78bfa; box-shadow:0 0 7px rgba(167,139,250,0.7); animation:msdot 2s ease-in-out infinite; }
  @keyframes msdot { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .ms-title { font-family:'Playfair Display',serif; font-size:clamp(28px,4.5vw,48px); font-weight:900; line-height:1.06; letter-spacing:-2px; color:#f0f7f0; }
  .ms-title em { font-style:italic; color:#a78bfa; }
  .ms-ghost { font-family:'Playfair Display',serif; font-size:clamp(52px,8vw,88px); font-weight:900; color:rgba(255,255,255,0.03); line-height:1; letter-spacing:-5px; user-select:none; }

  .ms-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:24px; }
  .ms-stat { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-top:2px solid #a78bfa; border-radius:14px; padding:20px 22px; transition:background 0.2s; }
  .ms-stat:hover { background:rgba(167,139,250,0.05); }
  .ms-stat-label { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(232,240,233,0.28); margin-bottom:9px; }
  .ms-stat-val { font-family:'DM Mono',monospace; font-size:clamp(22px,3vw,32px); font-weight:500; line-height:1; letter-spacing:-1px; color:#a78bfa; }
  .ms-stat-sub { font-size:11px; color:rgba(232,240,233,0.26); margin-top:5px; }

  .ms-card { background:rgba(255,255,255,0.028); border:1px solid rgba(255,255,255,0.07); border-radius:16px; overflow:hidden; }
  .ms-card-head { padding:20px 26px 16px; border-bottom:1px solid rgba(255,255,255,0.065); display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .ms-card-title { font-size:14px; font-weight:700; color:rgba(232,240,233,0.75); display:flex; align-items:center; gap:9px; }
  .ms-card-bar { width:4px; height:16px; border-radius:3px; background:#a78bfa; flex-shrink:0; }
  .ms-card-pill { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:4px 12px; border-radius:100px; background:rgba(167,139,250,0.10); color:#a78bfa; border:1px solid rgba(167,139,250,0.22); }
  .ms-card-body { padding:24px 26px 28px; height:340px; }

  .ms-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:14px; }
  .ms-loading-txt { font-size:13px; color:rgba(232,240,233,0.28); }
  .ms-error { max-width:380px; margin:80px auto; text-align:center; background:rgba(251,113,133,0.07); border:1px solid rgba(251,113,133,0.20); border-radius:16px; padding:32px; }
  .ms-error-icon { font-size:36px; margin-bottom:12px; }
  .ms-error-msg { font-size:14px; font-weight:600; color:#fb7185; }
  .ms-empty { padding:60px 32px; text-align:center; font-size:13px; color:rgba(232,240,233,0.25); }
  .ms-empty-icon { font-size:36px; margin-bottom:10px; }
  .ms-login { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; background:#080b08; font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:rgba(232,240,233,0.25); }
  .ms-login span { font-size:48px; }

  @media (max-width:700px) { .ms-root{padding:36px 14px 72px;} .ms-stats{grid-template-columns:1fr;} .ms-card-body{height:260px;} }
  @media (max-width:480px) { .ms-stats{grid-template-columns:1fr 1fr;} .ms-ghost{display:none;} }
`;

const MonthlySpending = () => {
  const { loggedIn } = useContext(AuthContext);
  const [monthlySpending, setMonthlySpending] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => { if (loggedIn) fetchData(); }, [loggedIn]);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const res = await axios.get("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const byMonth = Array(12).fill(0);
      res.data.forEach(item => {
        byMonth[new Date(item.itemPurchaseDate).getMonth()] += item.itemCost;
      });
      setMonthlySpending(byMonth);
    } catch (e) { setError("Failed to fetch data. Please try again."); }
    finally { setLoading(false); }
  };

  const total   = monthlySpending.reduce((a, b) => a + b, 0);
  const peakIdx = monthlySpending.indexOf(Math.max(...monthlySpending));
  const avg     = Math.round(total / 12);
  const hasData = monthlySpending.some(v => v > 0);

  const chartData = {
    labels: MONTHS,
    datasets: [{
      label: "Monthly Spending (₹)",
      data: monthlySpending,
      borderColor: ACCENT,
      borderWidth: 2.5,
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 320);
        g.addColorStop(0, "rgba(167,139,250,0.22)");
        g.addColorStop(1, "rgba(167,139,250,0)");
        return g;
      },
      fill: true,
      pointBackgroundColor: monthlySpending.map((_, i) => i === peakIdx ? ACCENT : "#0e1410"),
      pointBorderColor: ACCENT,
      pointBorderWidth: 2,
      pointRadius: 5, pointHoverRadius: 7,
      tension: 0.4,
    }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0d1210",
        titleFont: { family:"Outfit", weight:"700", size:13 },
        bodyFont:  { family:"Outfit", size:12 },
        borderColor: "rgba(255,255,255,0.09)", borderWidth: 1,
        padding: 12, cornerRadius: 9,
        callbacks: { label: ctx => ` ₹${ctx.parsed.y.toLocaleString()}` },
      },
    },
    scales: {
      x: { grid:{display:false}, border:{display:false}, ticks:{ color:"rgba(232,240,233,0.28)", font:{family:"Outfit",size:11,weight:"600"} } },
      y: { grid:{color:"rgba(255,255,255,0.05)"}, border:{display:false}, ticks:{ color:"rgba(232,240,233,0.28)", font:{family:"Outfit",size:11}, callback: v=>`₹${v.toLocaleString()}` } },
    },
  };

  if (!loggedIn) return (
    <><style>{css}</style>
      <div className="ms-login"><span>🔒</span>Please log in to view monthly spending.</div></>
  );

  return (
    <><style>{css}</style>
    <div className="ms-root">
      <div className="ms-inner">

        <div className="ms-header">
          <div>
            <div className="ms-eyebrow"><span className="ms-eyebrow-dot"/>Finance</div>
            <h1 className="ms-title">Monthly <em>Spending</em> Overview</h1>
          </div>
          <div className="ms-ghost">₹</div>
        </div>

        {loading ? (
          <div className="ms-loading">
            <CircularProgress size={34} sx={{ color: ACCENT }} />
            <span className="ms-loading-txt">Loading your data…</span>
          </div>
        ) : error ? (
          <div className="ms-error"><div className="ms-error-icon">⚠️</div><div className="ms-error-msg">{error}</div></div>
        ) : (
          <>
            <div className="ms-stats">
              {[
                { label:"Total Spent",     val:`₹${total.toLocaleString()}`, sub:"Across all months" },
                { label:"Monthly Average", val:`₹${avg.toLocaleString()}`,   sub:"Per month" },
                { label:"Peak Month",      val: hasData ? MONTHS[peakIdx] : "—", sub:"Highest spending" },
              ].map(s => (
                <div className="ms-stat" key={s.label}>
                  <div className="ms-stat-label">{s.label}</div>
                  <div className="ms-stat-val">{s.val}</div>
                  <div className="ms-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="ms-card">
              <div className="ms-card-head">
                <div className="ms-card-title"><div className="ms-card-bar"/>Spending Trend</div>
                <div className="ms-card-pill">Jan – Dec</div>
              </div>
              <div className="ms-card-body">
                {hasData
                  ? <Line data={chartData} options={options} />
                  : <div className="ms-empty"><div className="ms-empty-icon">📭</div>No spending data available yet.</div>
                }
              </div>
            </div>
          </>
        )}
      </div>
    </div></>
  );
};

export default MonthlySpending;