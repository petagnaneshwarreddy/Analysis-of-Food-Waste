import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { CircularProgress } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Mulish:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .wa-root {
    min-height: 100vh;
    background: #f7f4ef;
    font-family: 'Mulish', sans-serif;
    padding: 48px 28px 80px;
  }

  /* Header */
  .wa-header {
    max-width: 1100px;
    margin: 0 auto 48px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }
  .wa-header-left {}
  .wa-eyebrow {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
    background: #1a1a1a;
    padding: 4px 12px;
    border-radius: 4px;
    margin-bottom: 12px;
  }
  .wa-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(34px, 5vw, 52px);
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1;
    letter-spacing: -2px;
  }
  .wa-title em { font-style: normal; color: #c0392b; }
  .wa-ghost {
    font-family: 'Syne', sans-serif;
    font-size: 72px;
    font-weight: 800;
    color: rgba(26,26,26,0.06);
    line-height: 1;
    letter-spacing: -4px;
    user-select: none;
  }

  /* Stats strip */
  .wa-stats {
    max-width: 1100px;
    margin: 0 auto 40px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 600px) { .wa-stats { grid-template-columns: 1fr; } }

  .wa-stat-card {
    background: #fff;
    border: 1.5px solid rgba(26,26,26,0.08);
    border-radius: 14px;
    padding: 20px 22px;
  }
  .wa-stat-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(26,26,26,0.4);
    margin-bottom: 8px;
  }
  .wa-stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: -1px;
  }
  .wa-stat-value span {
    font-size: 14px;
    font-weight: 600;
    color: rgba(26,26,26,0.4);
    margin-left: 4px;
    letter-spacing: 0;
  }
  .wa-stat-sub {
    font-size: 12px;
    color: rgba(26,26,26,0.4);
    margin-top: 4px;
  }

  /* Charts */
  .wa-charts {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .wa-chart-card {
    background: #fff;
    border: 1.5px solid rgba(26,26,26,0.08);
    border-radius: 16px;
    overflow: hidden;
  }
  .wa-chart-header {
    padding: 22px 28px 18px;
    border-bottom: 1.5px solid rgba(26,26,26,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .wa-chart-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .wa-chart-title::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 18px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .wa-chart-title.red::before { background: #c0392b; }
  .wa-chart-title.blue::before { background: #2980b9; }

  .wa-chart-badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
  }
  .wa-chart-badge.red { background: rgba(192,57,43,0.08); color: #c0392b; }
  .wa-chart-badge.blue { background: rgba(41,128,185,0.08); color: #2980b9; }

  .wa-chart-body { padding: 24px 28px 28px; height: 340px; }

  /* States */
  .wa-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 16px;
    color: rgba(26,26,26,0.4);
    font-size: 14px; font-weight: 500;
  }
  .wa-error {
    max-width: 400px;
    margin: 80px auto;
    text-align: center;
    padding: 32px;
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid rgba(192,57,43,0.2);
  }
  .wa-error-icon { font-size: 36px; margin-bottom: 12px; }
  .wa-error-msg { font-size: 15px; font-weight: 600; color: #c0392b; }

  .wa-login-prompt {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 700;
    color: rgba(26,26,26,0.3);
  }
  .wa-login-prompt span { font-size: 48px; }
`;

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const MONTH_FULL = [
  "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
  "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
];

const WasteAnalysis = ({ newWaste }) => {
  const { loggedIn } = useContext(AuthContext);
  const [monthlyWaste, setMonthlyWaste] = useState(Array(12).fill(0));
  const [dailyWaste, setDailyWaste] = useState(Array(31).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { if (loggedIn) fetchWasteData(); }, [loggedIn]);
  useEffect(() => { if (newWaste) fetchWasteData(); }, [newWaste]);

  const fetchWasteData = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("https://backend-food-analysis.onrender.com/waste", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const wasteByMonth = Array(12).fill(0);
      const wasteByDay = Array(31).fill(0);
      const currentMonth = new Date().getMonth();

      response.data.forEach((item) => {
        const wasteDate = new Date(item.foodWasteDate);
        wasteByMonth[wasteDate.getMonth()] += item.foodQuantity;
        if (wasteDate.getMonth() === currentMonth) {
          wasteByDay[wasteDate.getDate() - 1] += item.foodQuantity;
        }
      });

      setMonthlyWaste(wasteByMonth);
      setDailyWaste(wasteByDay);
    } catch (err) {
      console.error("Error fetching waste data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalWaste = monthlyWaste.reduce((a, b) => a + b, 0);
  const peakMonth = MONTHS[monthlyWaste.indexOf(Math.max(...monthlyWaste))];
  const thisMonthWaste = monthlyWaste[new Date().getMonth()];

  const makeOptions = (color) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleFont: { family: "Syne", weight: "700", size: 13 },
        bodyFont: { family: "Mulish", size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: { label: (ctx) => ` ${ctx.parsed.y}g wasted` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "rgba(26,26,26,0.4)",
          font: { family: "Mulish", size: 11, weight: "600" },
        },
      },
      y: {
        grid: { color: "rgba(26,26,26,0.06)", drawBorder: false },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: "rgba(26,26,26,0.4)",
          font: { family: "Mulish", size: 11 },
          callback: (v) => `${v}g`,
        },
      },
    },
  });

  if (!loggedIn) {
    return (
      <>
        <style>{cssStyles}</style>
        <div className="wa-login-prompt">
          <span>🔒</span>
          Please log in to view waste analysis.
        </div>
      </>
    );
  }

  return (
    <>
      <style>{cssStyles}</style>
      <div className="wa-root">

        {/* Header */}
        <div className="wa-header">
          <div className="wa-header-left">
            <div className="wa-eyebrow">Analytics</div>
            <h1 className="wa-title">Your <em>Waste</em> Analysis</h1>
          </div>
          <div className="wa-ghost">📊</div>
        </div>

        {loading ? (
          <div className="wa-loading">
            <CircularProgress size={36} sx={{ color: "#c0392b" }} />
            Loading your data…
          </div>
        ) : error ? (
          <div className="wa-error">
            <div className="wa-error-icon">⚠️</div>
            <div className="wa-error-msg">{error}</div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="wa-stats">
              <div className="wa-stat-card">
                <div className="wa-stat-label">Total Waste</div>
                <div className="wa-stat-value">{totalWaste.toLocaleString()}<span>g</span></div>
                <div className="wa-stat-sub">Across all months</div>
              </div>
              <div className="wa-stat-card">
                <div className="wa-stat-label">This Month</div>
                <div className="wa-stat-value">{thisMonthWaste.toLocaleString()}<span>g</span></div>
                <div className="wa-stat-sub">{MONTH_FULL[new Date().getMonth()]}</div>
              </div>
              <div className="wa-stat-card">
                <div className="wa-stat-label">Peak Month</div>
                <div className="wa-stat-value">{peakMonth}</div>
                <div className="wa-stat-sub">Highest recorded waste</div>
              </div>
            </div>

            {/* Charts */}
            <div className="wa-charts">

              {/* Monthly */}
              <div className="wa-chart-card">
                <div className="wa-chart-header">
                  <div className="wa-chart-title red">Monthly Waste Summary</div>
                  <div className="wa-chart-badge red">Jan – Dec</div>
                </div>
                <div className="wa-chart-body">
                  <Bar
                    data={{
                      labels: MONTHS,
                      datasets: [{
                        label: "Total Waste (g)",
                        data: monthlyWaste,
                        backgroundColor: (ctx) => {
                          const peak = Math.max(...monthlyWaste);
                          return ctx.raw === peak ? "#c0392b" : "rgba(192,57,43,0.25)";
                        },
                        borderRadius: 6,
                        borderSkipped: false,
                        hoverBackgroundColor: "#c0392b",
                      }]
                    }}
                    options={makeOptions("#c0392b")}
                  />
                </div>
              </div>

              {/* Daily */}
              <div className="wa-chart-card">
                <div className="wa-chart-header">
                  <div className="wa-chart-title blue">Daily Waste — {MONTHS[new Date().getMonth()]}</div>
                  <div className="wa-chart-badge blue">This Month</div>
                </div>
                <div className="wa-chart-body">
                  <Bar
                    data={{
                      labels: Array.from({ length: 31 }, (_, i) => i + 1),
                      datasets: [{
                        label: "Daily Waste (g)",
                        data: dailyWaste,
                        backgroundColor: "rgba(41,128,185,0.25)",
                        borderRadius: 5,
                        borderSkipped: false,
                        hoverBackgroundColor: "#2980b9",
                      }]
                    }}
                    options={makeOptions("#2980b9")}
                  />
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WasteAnalysis;