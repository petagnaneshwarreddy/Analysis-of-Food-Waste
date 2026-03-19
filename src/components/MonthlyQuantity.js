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

const ACCENT = "#38bdf8"; // sky blue for quantity
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mq-root {
    min-height: 100vh; background: #080b08;
    font-family: 'Outfit', sans-serif; color: #e8f0e9;
    padding: 48px 24px 88px; position: relative; overflow: hidden;
  }
  .mq-root::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.038) 1px, transparent 1px);
    background-size: 38px 38px;
    mask-image: radial-gradient(ellipse 85% 85% at 50% 30%, black 20%, transparent 100%);
  }
  .mq-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

  /* header */
  .mq-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 16px; margin-bottom: 40px; padding-bottom: 22px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .mq-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(56,189,248,0.75); border: 1px solid rgba(56,189,248,0.20);
    border-radius: 100px; padding: 5px 14px; margin-bottom: 14px; width: fit-content;
    background: rgba(56,189,248,0.06);
  }
  .mq-eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #38bdf8; box-shadow: 0 0 7px rgba(56,189,248,0.7);
    animation: mqdot 2s ease-in-out infinite;
  }
  @keyframes mqdot { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .mq-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4.5vw, 48px); font-weight: 900;
    line-height: 1.06; letter-spacing: -2px; color: #f0f7f0;
  }
  .mq-title em { font-style: italic; color: #38bdf8; }
  .mq-ghost {
    font-family: 'Playfair Display', serif;
    font-size: clamp(52px,8vw,88px); font-weight: 900;
    color: rgba(255,255,255,0.03); line-height:1; letter-spacing:-5px; user-select:none;
  }

  /* stats */
  .mq-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 24px; }
  .mq-stat {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-top: 2px solid #38bdf8; border-radius: 14px; padding: 20px 22px;
    transition: background 0.2s;
  }
  .mq-stat:hover { background: rgba(56,189,248,0.05); }
  .mq-stat-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(232,240,233,0.28); margin-bottom: 9px; }
  .mq-stat-val { font-family: 'DM Mono', monospace; font-size: clamp(22px,3vw,32px); font-weight: 500; line-height: 1; letter-spacing: -1px; color: #38bdf8; }
  .mq-stat-unit { font-size: 13px; color: rgba(232,240,233,0.28); margin-left: 3px; font-family: 'Outfit', sans-serif; }
  .mq-stat-sub { font-size: 11px; color: rgba(232,240,233,0.26); margin-top: 5px; }

  /* chart card */
  .mq-card { background: rgba(255,255,255,0.028); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
  .mq-card-head {
    padding: 20px 26px 16px; border-bottom: 1px solid rgba(255,255,255,0.065);
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .mq-card-title { font-size: 14px; font-weight: 700; color: rgba(232,240,233,0.75); display: flex; align-items: center; gap: 9px; }
  .mq-card-bar { width: 4px; height: 16px; border-radius: 3px; background: #38bdf8; flex-shrink: 0; }
  .mq-card-pill { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 12px; border-radius: 100px; background: rgba(56,189,248,0.10); color: #38bdf8; border: 1px solid rgba(56,189,248,0.20); }
  .mq-card-body { padding: 24px 26px 28px; height: 340px; }

  /* states */
  .mq-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:14px; }
  .mq-loading-txt { font-size:13px; color:rgba(232,240,233,0.28); }
  .mq-error { max-width:380px; margin:80px auto; text-align:center; background:rgba(251,113,133,0.07); border:1px solid rgba(251,113,133,0.20); border-radius:16px; padding:32px; }
  .mq-error-icon { font-size:36px; margin-bottom:12px; }
  .mq-error-msg { font-size:14px; font-weight:600; color:#fb7185; }
  .mq-login { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; background:#080b08; font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:rgba(232,240,233,0.25); }
  .mq-login span { font-size:48px; }

  @media (max-width:700px) { .mq-root{padding:36px 14px 72px;} .mq-stats{grid-template-columns:1fr;} .mq-card-body{height:260px;} }
  @media (max-width:480px) { .mq-stats{grid-template-columns:1fr 1fr;} .mq-ghost{display:none;} }
`;

const MonthlyQuantity = () => {
  const { loggedIn } = useContext(AuthContext);
  const [monthlyQuantity, setMonthlyQuantity] = useState(Array(12).fill(0));
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
        byMonth[new Date(item.itemPurchaseDate).getMonth()] += item.itemQuantity;
      });
      setMonthlyQuantity(byMonth);
    } catch (e) { setError("Failed to fetch data. Please try again."); }
    finally { setLoading(false); }
  };

  const total    = monthlyQuantity.reduce((a, b) => a + b, 0);
  const peakIdx  = monthlyQuantity.indexOf(Math.max(...monthlyQuantity));
  const avg      = Math.round(total / 12);

  const chartData = {
    labels: MONTHS,
    datasets: [{
      label: "Quantity (g)",
      data: monthlyQuantity,
      backgroundColor: monthlyQuantity.map((_, i) =>
        i === peakIdx ? "#38bdf8" : "rgba(56,189,248,0.18)"
      ),
      hoverBackgroundColor: "#38bdf8",
      borderRadius: 7, borderSkipped: false,
    }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0d1210",
        titleFont: { family: "Outfit", weight: "700", size: 13 },
        bodyFont:  { family: "Outfit", size: 12 },
        borderColor: "rgba(255,255,255,0.09)", borderWidth: 1,
        padding: 12, cornerRadius: 9,
        callbacks: { label: ctx => ` ${ctx.parsed.y}g purchased` },
      },
    },
    scales: {
      x: {
        grid: { display: false }, border: { display: false },
        ticks: { color: "rgba(232,240,233,0.28)", font: { family:"Outfit", size:11, weight:"600" } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.05)" }, border: { display: false },
        ticks: { color: "rgba(232,240,233,0.28)", font: { family:"Outfit", size:11 }, callback: v => `${v}g` },
      },
    },
  };

  if (!loggedIn) return (
    <><style>{css}</style>
      <div className="mq-login"><span>🔒</span>Please log in to view monthly quantity.</div></>
  );

  return (
    <><style>{css}</style>
    <div className="mq-root">
      <div className="mq-inner">

        <div className="mq-header">
          <div>
            <div className="mq-eyebrow"><span className="mq-eyebrow-dot"/>Inventory</div>
            <h1 className="mq-title">Monthly <em>Quantity</em> Purchased</h1>
          </div>
          <div className="mq-ghost">📦</div>
        </div>

        {loading ? (
          <div className="mq-loading">
            <CircularProgress size={34} sx={{ color: ACCENT }} />
            <span className="mq-loading-txt">Loading your data…</span>
          </div>
        ) : error ? (
          <div className="mq-error"><div className="mq-error-icon">⚠️</div><div className="mq-error-msg">{error}</div></div>
        ) : (
          <>
            <div className="mq-stats">
              {[
                { label:"Total Purchased", val: total.toLocaleString(), unit:"g", sub:"Across all months" },
                { label:"Monthly Average",  val: avg.toLocaleString(),   unit:"g", sub:"Per month" },
                { label:"Peak Month",       val: MONTHS[peakIdx],        unit:"",  sub:"Highest purchase volume" },
              ].map(s => (
                <div className="mq-stat" key={s.label}>
                  <div className="mq-stat-label">{s.label}</div>
                  <div className="mq-stat-val">{s.val}<span className="mq-stat-unit">{s.unit}</span></div>
                  <div className="mq-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="mq-card">
              <div className="mq-card-head">
                <div className="mq-card-title"><div className="mq-card-bar"/>Quantity by Month</div>
                <div className="mq-card-pill">Jan – Dec</div>
              </div>
              <div className="mq-card-body">
                <Bar data={chartData} options={options} />
              </div>
            </div>
          </>
        )}
      </div>
    </div></>
  );
};

export default MonthlyQuantity;