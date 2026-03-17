import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { CircularProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Mulish:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ms-root {
    min-height: 100vh;
    background: #f7f4ef;
    font-family: 'Mulish', sans-serif;
    padding: 48px 28px 80px;
  }

  /* Header */
  .ms-header {
    max-width: 1100px;
    margin: 0 auto 40px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }
  .ms-eyebrow {
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
  .ms-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 5vw, 50px);
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1;
    letter-spacing: -2px;
  }
  .ms-title em { font-style: normal; color: #7d3c98; }
  .ms-ghost {
    font-family: 'Syne', sans-serif;
    font-size: 72px;
    font-weight: 800;
    color: rgba(26,26,26,0.06);
    line-height: 1;
    letter-spacing: -4px;
    user-select: none;
  }

  /* Stats */
  .ms-stats {
    max-width: 1100px;
    margin: 0 auto 32px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 600px) { .ms-stats { grid-template-columns: 1fr; } }

  .ms-stat-card {
    background: #fff;
    border: 1.5px solid rgba(26,26,26,0.08);
    border-radius: 14px;
    padding: 20px 22px;
  }
  .ms-stat-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(26,26,26,0.4);
    margin-bottom: 8px;
  }
  .ms-stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 30px;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: -1px;
  }
  .ms-stat-value span {
    font-size: 14px;
    font-weight: 600;
    color: rgba(26,26,26,0.4);
    margin-left: 3px;
    letter-spacing: 0;
  }
  .ms-stat-sub {
    font-size: 12px;
    color: rgba(26,26,26,0.4);
    margin-top: 4px;
  }

  /* Chart card */
  .ms-chart-card {
    max-width: 1100px;
    margin: 0 auto;
    background: #fff;
    border: 1.5px solid rgba(26,26,26,0.08);
    border-radius: 16px;
    overflow: hidden;
  }
  .ms-chart-header {
    padding: 22px 28px 18px;
    border-bottom: 1.5px solid rgba(26,26,26,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ms-chart-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ms-chart-title::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 18px;
    background: #7d3c98;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .ms-chart-badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
    background: rgba(125,60,152,0.09);
    color: #7d3c98;
  }
  .ms-chart-body {
    padding: 24px 28px 32px;
    height: 380px;
  }

  /* Empty */
  .ms-empty {
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
    padding: 60px 32px;
    color: rgba(26,26,26,0.35);
    font-size: 14px;
    font-weight: 500;
  }
  .ms-empty-icon { font-size: 36px; margin-bottom: 12px; }

  /* States */
  .ms-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 16px;
    color: rgba(26,26,26,0.4);
    font-size: 14px; font-weight: 500;
  }
  .ms-error {
    max-width: 400px;
    margin: 80px auto;
    text-align: center;
    padding: 32px;
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid rgba(192,57,43,0.2);
  }
  .ms-error-icon { font-size: 36px; margin-bottom: 12px; }
  .ms-error-msg { font-size: 15px; font-weight: 600; color: #c0392b; }

  .ms-login-prompt {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 700;
    color: rgba(26,26,26,0.3);
  }
  .ms-login-prompt span { font-size: 48px; }
`;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MonthlySpending = () => {
  const { loggedIn } = useContext(AuthContext);
  const [monthlySpending, setMonthlySpending] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loggedIn) fetchMonthlySpending();
  }, [loggedIn]);

  const fetchMonthlySpending = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const spendingByMonth = Array(12).fill(0);
      response.data.forEach((item) => {
        const monthIndex = new Date(item.itemPurchaseDate).getMonth();
        spendingByMonth[monthIndex] += item.itemCost;
      });

      setMonthlySpending(spendingByMonth);
    } catch (err) {
      console.error("Error fetching monthly spending:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = monthlySpending.reduce((a, b) => a + b, 0);
  const peakIdx = monthlySpending.indexOf(Math.max(...monthlySpending));
  const avgMonthly = Math.round(total / 12);
  const hasData = monthlySpending.some((v) => v > 0);

  const chartData = {
    labels: MONTHS,
    datasets: [{
      label: "Monthly Spending (₹)",
      data: monthlySpending,
      borderColor: "#7d3c98",
      borderWidth: 2.5,
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 340);
        gradient.addColorStop(0, "rgba(125,60,152,0.18)");
        gradient.addColorStop(1, "rgba(125,60,152,0)");
        return gradient;
      },
      fill: true,
      pointBackgroundColor: monthlySpending.map((_, i) =>
        i === peakIdx ? "#7d3c98" : "#fff"
      ),
      pointBorderColor: "#7d3c98",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.4,
    }],
  };

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
        callbacks: { label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString()}` },
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
          callback: (v) => `₹${v.toLocaleString()}`,
        },
      },
    },
  };

  if (!loggedIn) {
    return (
      <>
        <style>{cssStyles}</style>
        <div className="ms-login-prompt">
          <span>🔒</span>
          Please log in to view monthly spending.
        </div>
      </>
    );
  }

  return (
    <>
      <style>{cssStyles}</style>
      <div className="ms-root">

        {/* Header */}
        <div className="ms-header">
          <div>
            <div className="ms-eyebrow">Finance</div>
            <h1 className="ms-title">Monthly <em>Spending</em> Overview</h1>
          </div>
          <div className="ms-ghost">₹</div>
        </div>

        {loading ? (
          <div className="ms-loading">
            <CircularProgress size={36} sx={{ color: "#7d3c98" }} />
            Loading your data…
          </div>
        ) : error ? (
          <div className="ms-error">
            <div className="ms-error-icon">⚠️</div>
            <div className="ms-error-msg">{error}</div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="ms-stats">
              <div className="ms-stat-card">
                <div className="ms-stat-label">Total Spent</div>
                <div className="ms-stat-value">₹{total.toLocaleString()}</div>
                <div className="ms-stat-sub">Across all months</div>
              </div>
              <div className="ms-stat-card">
                <div className="ms-stat-label">Monthly Average</div>
                <div className="ms-stat-value">₹{avgMonthly.toLocaleString()}</div>
                <div className="ms-stat-sub">Per month</div>
              </div>
              <div className="ms-stat-card">
                <div className="ms-stat-label">Peak Month</div>
                <div className="ms-stat-value">{hasData ? MONTHS[peakIdx] : "—"}</div>
                <div className="ms-stat-sub">Highest spending</div>
              </div>
            </div>

            {/* Chart */}
            <div className="ms-chart-card">
              <div className="ms-chart-header">
                <div className="ms-chart-title">Spending Trend</div>
                <div className="ms-chart-badge">Jan – Dec</div>
              </div>
              <div className="ms-chart-body">
                {hasData ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="ms-empty">
                    <div className="ms-empty-icon">📭</div>
                    No spending data available yet.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MonthlySpending;