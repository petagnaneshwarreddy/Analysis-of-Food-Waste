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

  .mq-root {
    min-height: 100vh;
    background: #f7f4ef;
    font-family: 'Mulish', sans-serif;
    padding: 48px 28px 80px;
  }

  /* Header */
  .mq-header {
    max-width: 1100px;
    margin: 0 auto 40px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }
  .mq-eyebrow {
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
  .mq-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 5vw, 50px);
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1;
    letter-spacing: -2px;
  }
  .mq-title em { font-style: normal; color: #1e8449; }
  .mq-ghost {
    font-family: 'Syne', sans-serif;
    font-size: 72px;
    font-weight: 800;
    color: rgba(26,26,26,0.06);
    line-height: 1;
    letter-spacing: -4px;
    user-select: none;
  }

  /* Stats strip */
  .mq-stats {
    max-width: 1100px;
    margin: 0 auto 32px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 600px) { .mq-stats { grid-template-columns: 1fr; } }

  .mq-stat-card {
    background: #fff;
    border: 1.5px solid rgba(26,26,26,0.08);
    border-radius: 14px;
    padding: 20px 22px;
  }
  .mq-stat-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(26,26,26,0.4);
    margin-bottom: 8px;
  }
  .mq-stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: -1px;
  }
  .mq-stat-value span {
    font-size: 14px;
    font-weight: 600;
    color: rgba(26,26,26,0.4);
    margin-left: 4px;
    letter-spacing: 0;
  }
  .mq-stat-sub {
    font-size: 12px;
    color: rgba(26,26,26,0.4);
    margin-top: 4px;
  }

  /* Chart card */
  .mq-chart-card {
    max-width: 1100px;
    margin: 0 auto;
    background: #fff;
    border: 1.5px solid rgba(26,26,26,0.08);
    border-radius: 16px;
    overflow: hidden;
  }
  .mq-chart-header {
    padding: 22px 28px 18px;
    border-bottom: 1.5px solid rgba(26,26,26,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .mq-chart-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .mq-chart-title::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 18px;
    background: #1e8449;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .mq-chart-badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
    background: rgba(30,132,73,0.09);
    color: #1e8449;
  }
  .mq-chart-body {
    padding: 24px 28px 32px;
    height: 380px;
  }

  /* States */
  .mq-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 16px;
    color: rgba(26,26,26,0.4);
    font-size: 14px; font-weight: 500;
  }
  .mq-error {
    max-width: 400px;
    margin: 80px auto;
    text-align: center;
    padding: 32px;
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid rgba(192,57,43,0.2);
  }
  .mq-error-icon { font-size: 36px; margin-bottom: 12px; }
  .mq-error-msg { font-size: 15px; font-weight: 600; color: #c0392b; }

  .mq-login-prompt {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 700;
    color: rgba(26,26,26,0.3);
  }
  .mq-login-prompt span { font-size: 48px; }
`;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MonthlyQuantity = () => {
  const { loggedIn } = useContext(AuthContext);
  const [monthlyQuantity, setMonthlyQuantity] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loggedIn) fetchMonthlyQuantity();
  }, [loggedIn]);

  const fetchMonthlyQuantity = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const quantityByMonth = Array(12).fill(0);
      response.data.forEach((item) => {
        const monthIndex = new Date(item.itemPurchaseDate).getMonth();
        quantityByMonth[monthIndex] += item.itemQuantity;
      });

      setMonthlyQuantity(quantityByMonth);
    } catch (err) {
      console.error("Error fetching monthly quantity:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = monthlyQuantity.reduce((a, b) => a + b, 0);
  const peakIdx = monthlyQuantity.indexOf(Math.max(...monthlyQuantity));
  const avgMonthly = Math.round(total / 12);

  const chartOptions = {
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
        callbacks: { label: (ctx) => ` ${ctx.parsed.y}g purchased` },
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
        grid: { color: "rgba(26,26,26,0.06)" },
        border: { display: false },
        ticks: {
          color: "rgba(26,26,26,0.4)",
          font: { family: "Mulish", size: 11 },
          callback: (v) => `${v}g`,
        },
      },
    },
  };

  const chartData = {
    labels: MONTHS,
    datasets: [{
      label: "Total Quantity (g)",
      data: monthlyQuantity,
      backgroundColor: monthlyQuantity.map((v, i) =>
        i === peakIdx ? "#1e8449" : "rgba(30,132,73,0.22)"
      ),
      borderRadius: 6,
      borderSkipped: false,
      hoverBackgroundColor: "#1e8449",
    }],
  };

  if (!loggedIn) {
    return (
      <>
        <style>{cssStyles}</style>
        <div className="mq-login-prompt">
          <span>🔒</span>
          Please log in to view monthly quantity.
        </div>
      </>
    );
  }

  return (
    <>
      <style>{cssStyles}</style>
      <div className="mq-root">

        {/* Header */}
        <div className="mq-header">
          <div>
            <div className="mq-eyebrow">Inventory</div>
            <h1 className="mq-title">Monthly <em>Quantity</em> Purchased</h1>
          </div>
          <div className="mq-ghost">📦</div>
        </div>

        {loading ? (
          <div className="mq-loading">
            <CircularProgress size={36} sx={{ color: "#1e8449" }} />
            Loading your data…
          </div>
        ) : error ? (
          <div className="mq-error">
            <div className="mq-error-icon">⚠️</div>
            <div className="mq-error-msg">{error}</div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mq-stats">
              <div className="mq-stat-card">
                <div className="mq-stat-label">Total Purchased</div>
                <div className="mq-stat-value">{total.toLocaleString()}<span>g</span></div>
                <div className="mq-stat-sub">Across all months</div>
              </div>
              <div className="mq-stat-card">
                <div className="mq-stat-label">Monthly Average</div>
                <div className="mq-stat-value">{avgMonthly.toLocaleString()}<span>g</span></div>
                <div className="mq-stat-sub">Per month</div>
              </div>
              <div className="mq-stat-card">
                <div className="mq-stat-label">Peak Month</div>
                <div className="mq-stat-value">{MONTHS[peakIdx]}</div>
                <div className="mq-stat-sub">Highest purchase volume</div>
              </div>
            </div>

            {/* Chart */}
            <div className="mq-chart-card">
              <div className="mq-chart-header">
                <div className="mq-chart-title">Quantity by Month</div>
                <div className="mq-chart-badge">Jan – Dec</div>
              </div>
              <div className="mq-chart-body">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MonthlyQuantity;