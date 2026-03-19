import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

/* ═══════════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  :root {
    --bg:       #060908;
    --s0:       #090d0a;
    --s1:       #0d1210;
    --s2:       #121a13;
    --s3:       #172018;
    --border:   rgba(255,255,255,0.055);
    --border2:  rgba(255,255,255,0.10);
    --lime:     #a3e635;
    --lime-dim: rgba(163,230,53,0.08);
    --lime-mid: rgba(163,230,53,0.18);
    --lime-hi:  rgba(163,230,53,0.30);
    --red:      #fb7185;
    --red-dim:  rgba(251,113,133,0.08);
    --gold:     #fbbf24;
    --gold-dim: rgba(251,191,36,0.08);
    --sky:      #38bdf8;
    --sky-dim:  rgba(56,189,248,0.08);
    --violet:   #a78bfa;
    --violet-dim:rgba(167,139,250,0.08);
    --emerald:  #34d399;
    --emerald-dim:rgba(52,211,153,0.08);
    --orange:   #fb923c;
    --orange-dim:rgba(251,146,60,0.08);
    --text:     #dfeee0;
    --t2:       rgba(223,238,224,0.50);
    --t3:       rgba(223,238,224,0.22);
    --t4:       rgba(223,238,224,0.06);
    --t5:       rgba(223,238,224,0.03);
    --r:        14px;
    --r-sm:     8px;
    --r-xs:     5px;
    --sh:       0 2px 20px rgba(0,0,0,0.40);
    --sh2:      0 8px 40px rgba(0,0,0,0.55);
    --mono:     'DM Mono', monospace;
    --sans:     'Instrument Sans', sans-serif;
    --serif:    'Fraunces', serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ep-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--sans);
    color: var(--text);
    padding-bottom: 100px;
  }

  /* ── HERO ────────────────────────────────── */
  .ep-hero {
    position: relative; overflow: hidden;
    padding: 56px 32px 48px;
    background: linear-gradient(160deg, #0b1d0d 0%, #060908 70%);
    border-bottom: 1px solid var(--border);
  }
  .ep-hero-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 80% at 100% 0%,   rgba(163,230,53,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 40% 60% at 0%   100%,  rgba(163,230,53,0.04) 0%, transparent 55%),
      radial-gradient(ellipse 30% 40% at 50%  50%,   rgba(163,230,53,0.02) 0%, transparent 60%);
  }
  /* subtle grid lines */
  .ep-hero-bg::after {
    content:'';
    position:absolute; inset:0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
    opacity:0.4;
  }
  .ep-hero-inner {
    max-width: 1280px; margin: 0 auto;
    position: relative; z-index: 1;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 32px; flex-wrap: wrap;
  }
  .ep-badge {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: var(--lime); border: 1px solid var(--lime-hi);
    background: var(--lime-dim); padding: 5px 14px; border-radius: 20px; margin-bottom: 18px;
  }
  .ep-badge-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--lime); box-shadow: 0 0 8px var(--lime);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

  .ep-title {
    font-family: var(--serif);
    font-size: clamp(28px, 4.5vw, 54px);
    font-weight: 900; line-height: 1.06;
    letter-spacing: -2px; color: var(--text);
  }
  .ep-title em { font-style: italic; color: var(--lime); }
  .ep-subtitle { font-size: 14px; color: var(--t2); margin-top: 10px; max-width: 480px; line-height: 1.6; }

  /* KPI strip in hero */
  .ep-kpi-strip {
    display: flex; gap: 2px; flex-wrap: wrap; align-items: stretch;
  }
  .ep-kpi {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 16px 22px;
    min-width: 110px; text-align: center;
    position: relative; overflow: hidden;
  }
  .ep-kpi::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background: var(--kpi-color, var(--lime));
    border-radius: var(--r-sm) var(--r-sm) 0 0;
  }
  .ep-kpi-val {
    font-family: var(--mono);
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 500; line-height: 1; letter-spacing: -1px;
    color: var(--kpi-color, var(--lime));
  }
  .ep-kpi-label {
    font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: var(--t3); margin-top: 6px;
  }
  .ep-kpi-sub { font-size: 10px; color: var(--t2); margin-top: 3px; font-family: var(--mono); }

  /* ── TABS ────────────────────────────────── */
  .ep-tabs-bar {
    max-width: 1280px; margin: 0 auto;
    padding: 20px 24px 0;
    display: flex; gap: 4px; flex-wrap: wrap;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 50;
    background: var(--bg);
  }
  .ep-tab {
    padding: 10px 20px; border-radius: var(--r-sm) var(--r-sm) 0 0;
    font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
    cursor: pointer; border: 1px solid transparent; border-bottom: none;
    background: transparent; color: var(--t3);
    font-family: var(--sans);
    transition: all 0.18s;
    position: relative; bottom: -1px;
  }
  .ep-tab:hover   { color: var(--text); background: var(--s1); }
  .ep-tab.active  {
    color: var(--lime); background: var(--s1);
    border-color: var(--border); border-bottom-color: var(--s1);
  }

  /* ── BODY ────────────────────────────────── */
  .ep-body {
    max-width: 1280px; margin: 0 auto;
    padding: 28px 24px 0;
  }

  /* ── SECTION GRID ────────────────────────── */
  .ep-grid-2 {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;
  }
  .ep-grid-3 {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;
  }
  .ep-grid-full { margin-bottom: 16px; }
  @media(max-width:900px) {
    .ep-grid-2, .ep-grid-3 { grid-template-columns: 1fr; }
  }

  /* ── CARD ────────────────────────────────── */
  .ep-card {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r); box-shadow: var(--sh); overflow: hidden;
  }
  .ep-card-head {
    padding: 18px 22px 0;
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }
  .ep-card-title {
    font-family: var(--serif); font-size: 15px; font-weight: 700;
    color: var(--text); display: flex; align-items: center; gap: 9px;
  }
  .ep-card-sub { font-size: 11px; color: var(--t3); margin-top: 3px; }
  .ep-card-body { padding: 18px 22px; }

  .ep-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
    background: var(--lime); box-shadow: 0 0 8px rgba(163,230,53,0.6);
  }

  /* Pill badges */
  .ep-pill {
    display: inline-block; border-radius: 20px; padding: 3px 11px;
    font-size: 11px; font-weight: 600; white-space: nowrap;
    font-family: var(--mono);
  }

  /* ── BAR CHARTS ──────────────────────────── */
  .ep-bars { display: flex; flex-direction: column; gap: 11px; }
  .ep-bar-row { display: flex; align-items: center; gap: 10px; }
  .ep-bar-label {
    width: 30px; text-align: right; flex-shrink: 0;
    font-size: 11px; font-weight: 500; color: var(--t2);
    font-family: var(--mono);
  }
  .ep-bar-track {
    flex: 1; height: 10px; background: var(--t5);
    border-radius: 6px; overflow: hidden; min-width: 0;
    border: 1px solid var(--border);
  }
  .ep-bar-fill {
    height: 100%; border-radius: 6px;
    transition: width 1s cubic-bezier(0.4,0,0.2,1);
  }
  .ep-bar-val {
    width: 64px; text-align: right; flex-shrink: 0;
    font-size: 11px; font-weight: 700; font-family: var(--mono);
    color: var(--t2);
  }
  .ep-bar-val.hi { color: var(--text); }

  /* ── SUMMARY TILES ───────────────────────── */
  .ep-tiles { display: grid; grid-template-columns: repeat(auto-fit,minmax(100px,1fr)); gap: 10px; margin-top: 16px; }
  .ep-tile {
    border-radius: var(--r-sm); padding: 14px 12px; text-align: center;
    border-top: 2px solid;
  }
  .ep-tile-val { font-family: var(--mono); font-size: 1.25rem; font-weight: 500; line-height: 1; }
  .ep-tile-label { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t2); margin-top: 5px; }

  /* ── DONUT SVG ───────────────────────────── */
  .ep-donut-wrap { position: relative; display: inline-block; }
  .ep-donut-center {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; pointer-events: none;
  }
  .ep-donut-center-val {
    font-family: var(--mono); font-size: 22px; font-weight: 500; line-height: 1;
  }
  .ep-donut-center-label { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); margin-top: 3px; }

  /* ── LEGEND LIST ─────────────────────────── */
  .ep-legend { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0; }
  .ep-legend-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: var(--r-xs);
    background: var(--t5); border: 1px solid var(--border);
    cursor: default; transition: background 0.15s;
  }
  .ep-legend-row:hover { background: var(--s2); }
  .ep-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .ep-legend-name { flex: 1; font-size: 12px; color: var(--t2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ep-legend-count { font-size: 11px; font-family: var(--mono); font-weight: 500; color: var(--text); }
  .ep-legend-bar-wrap { width: 60px; height: 4px; background: var(--t4); border-radius: 4px; overflow: hidden; }
  .ep-legend-bar { height: 100%; border-radius: 4px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }

  /* ── HEATMAP ─────────────────────────────── */
  .ep-heatmap { display: flex; gap: 4px; flex-wrap: wrap; }
  .ep-heatmap-cell {
    width: 28px; height: 28px; border-radius: 4px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; color: var(--t3); font-family: var(--mono);
    cursor: default; transition: transform 0.15s;
    position: relative;
  }
  .ep-heatmap-cell:hover { transform: scale(1.2); z-index: 5; }
  .ep-heatmap-label { font-size: 10px; color: var(--t3); font-family: var(--mono); margin-bottom: 8px; }

  /* ── TIMELINE ────────────────────────────── */
  .ep-timeline { display: flex; flex-direction: column; gap: 0; }
  .ep-tl-item {
    display: flex; gap: 14px; align-items: flex-start;
    padding-bottom: 16px; position: relative;
  }
  .ep-tl-item:not(:last-child)::before {
    content: ''; position: absolute;
    left: 11px; top: 24px; bottom: 0; width: 1px;
    background: var(--border2);
  }
  .ep-tl-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--s2); border: 2px solid;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
    font-size: 9px; font-family: var(--mono);
  }
  .ep-tl-body { flex: 1; min-width: 0; }
  .ep-tl-title { font-size: 13px; font-weight: 600; color: var(--text); }
  .ep-tl-meta { font-size: 11px; color: var(--t2); margin-top: 3px; font-family: var(--mono); }
  .ep-tl-qty {
    font-family: var(--mono); font-size: 11px; font-weight: 500;
    padding: 2px 8px; border-radius: 20px; white-space: nowrap;
    background: var(--lime-dim); color: var(--lime);
    border: 1px solid var(--lime-hi); flex-shrink: 0;
  }

  /* ── SCORE RING ──────────────────────────── */
  .ep-score-ring-wrap {
    display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
  }

  /* ── LOCATION TABLE ──────────────────────── */
  .ep-loc-tbl { width: 100%; border-collapse: collapse; }
  .ep-loc-tbl th {
    padding: 9px 14px; text-align: left; font-size: 9px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--t3);
    background: var(--s2); border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  .ep-loc-tbl td {
    padding: 11px 14px; border-bottom: 1px solid var(--border);
    font-size: 12px; color: var(--text); vertical-align: middle;
  }
  .ep-loc-tbl tbody tr:last-child td { border-bottom: none; }
  .ep-loc-tbl tbody tr:hover td { background: var(--s2); transition: background 0.12s; }
  .ep-loc-tbl .ep-loc-bar-wrap { width: 80px; height: 5px; background: var(--t4); border-radius: 5px; overflow: hidden; }
  .ep-loc-tbl .ep-loc-bar { height: 100%; border-radius: 5px; background: var(--lime); }

  /* ── SECTION DIVIDER ─────────────────────── */
  .ep-section-label {
    font-size: 9px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: var(--t3); margin-bottom: 12px; padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px;
  }
  .ep-section-label::after { content:''; flex:1; height:1px; background:var(--border); }

  /* ── TREND ARROW ─────────────────────────── */
  .ep-trend { font-size: 11px; font-family: var(--mono); }
  .ep-trend.up   { color: var(--red); }
  .ep-trend.down { color: var(--emerald); }
  .ep-trend.flat { color: var(--t3); }

  /* ── ECO SCORE ───────────────────────────── */
  .ep-score-card {
    background: linear-gradient(135deg, #0f1f11 0%, var(--s1) 100%);
    border: 1px solid var(--lime-hi);
  }
  .ep-score-grade {
    font-family: var(--serif); font-size: 80px; font-weight: 900;
    color: var(--lime); line-height: 1; letter-spacing: -4px;
  }
  .ep-score-desc { font-size: 13px; color: var(--t2); line-height: 1.6; margin-top: 8px; max-width: 340px; }
  .ep-score-factors { display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .ep-score-factor { display: flex; align-items: center; gap: 10px; }
  .ep-score-factor-label { flex: 1; font-size: 12px; color: var(--t2); }
  .ep-score-factor-bar { width: 120px; height: 6px; background: var(--t4); border-radius: 6px; overflow: hidden; }
  .ep-score-factor-fill { height: 100%; border-radius: 6px; }
  .ep-score-factor-val { font-size: 11px; font-family: var(--mono); color: var(--text); width: 36px; text-align: right; }

  /* ── INSIGHTS ────────────────────────────── */
  .ep-insights { display: flex; flex-direction: column; gap: 10px; }
  .ep-insight {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 12px 14px; border-radius: var(--r-sm);
    background: var(--t5); border: 1px solid var(--border);
  }
  .ep-insight-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .ep-insight-text { font-size: 12px; color: var(--t2); line-height: 1.6; }
  .ep-insight-text strong { color: var(--text); }

  /* ── LOADING / ERROR ─────────────────────── */
  .ep-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 14px; min-height: 60vh;
  }
  .ep-spin {
    width: 32px; height: 32px;
    border: 2px solid var(--border2); border-top-color: var(--lime);
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg)} }
  .ep-state-txt { color: var(--t2); font-size: 13px; }

  .ep-login {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 14px; background: var(--bg);
  }

  /* ── RESPONSIVE ──────────────────────────── */
  @media(max-width:640px) {
    .ep-hero { padding: 36px 16px 32px; }
    .ep-kpi-strip { gap: 8px; }
    .ep-kpi { padding: 12px 16px; min-width: 90px; }
    .ep-body { padding: 16px 12px 0; }
    .ep-tabs-bar { padding: 12px 12px 0; }
    .ep-card-head { padding: 14px 16px 0; }
    .ep-card-body { padding: 14px 16px; }
    .ep-score-grade { font-size: 56px; }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const ML = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PALETTE = ["#a3e635","#fb7185","#fbbf24","#38bdf8","#a78bfa","#fb923c","#34d399","#f472b6","#6ee7b7","#fde68a"];

function groupByMonth(records, field, months = 6) {
  const now = new Date();
  const slots = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    slots.push({ year: d.getFullYear(), month: d.getMonth(), label: ML[d.getMonth()], value: 0, count: 0 });
  }
  records.forEach(r => {
    const d = new Date(r.foodWasteDate);
    if (isNaN(d)) return;
    const s = slots.find(s => s.year === d.getFullYear() && s.month === d.getMonth());
    if (s) { s.value += Number(r[field]) || 0; s.count += 1; }
  });
  return slots;
}

function pct(v, max) { return max === 0 ? 0 : Math.min(Math.round((v / max) * 100), 100); }

function countBy(records, key) {
  const map = {};
  records.forEach(r => {
    const k = (r[key] || "Unknown").toString().trim() || "Unknown";
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function sumBy(records, key, groupKey) {
  const map = {};
  records.forEach(r => {
    const k = (r[groupKey] || "Unknown").toString().trim() || "Unknown";
    if (!map[k]) map[k] = { count: 0, total: 0 };
    map[k].count += 1;
    map[k].total += Number(r[key]) || 0;
  });
  return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
}

/* ── Donut Chart ── */
const Donut = ({ segments, size = 120, stroke = 14, centerVal, centerLabel }) => {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0);
  let offset = 0;
  return (
    <div className="ep-donut-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
        {segments.map((s, i) => {
          const len = total > 0 ? (s.value / total) * circ : 0;
          const el = (
            <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
              stroke={s.color} strokeWidth={stroke}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="ep-donut-center">
        <div className="ep-donut-center-val" style={{ color: segments[0]?.color || "var(--lime)" }}>{centerVal}</div>
        <div className="ep-donut-center-label">{centerLabel}</div>
      </div>
    </div>
  );
};

/* ── Radial Score Ring ── */
const ScoreRing = ({ score, size = 160, stroke = 12 }) => {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 75 ? "#a3e635" : score >= 50 ? "#fbbf24" : "#fb7185";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SECTION COMPONENTS
═══════════════════════════════════════════════════════════════ */

/* ── Overview Tab ── */
const OverviewTab = ({ records }) => {
  const monthlyQty   = groupByMonth(records, "foodQuantity", 6);
  const maxQty       = Math.max(...monthlyQty.map(d => d.value), 1);
  const totalQty     = records.reduce((a, r) => a + (Number(r.foodQuantity) || 0), 0);
  const approved     = records.filter(r => r.approved);
  const totalApproved= approved.reduce((a, r) => a + (Number(r.foodQuantity) || 0), 0);
  const salvagePct   = totalQty > 0 ? Math.round((totalApproved / totalQty) * 100) : 0;

  // Month-over-month trend
  const last = monthlyQty[monthlyQty.length - 1]?.value || 0;
  const prev = monthlyQty[monthlyQty.length - 2]?.value || 0;
  const trend = prev === 0 ? 0 : Math.round(((last - prev) / prev) * 100);

  // Reasons donut
  const reasons = countBy(records, "foodReason");
  const reasonSegs = reasons.slice(0, 6).map(([name, val], i) => ({ name, value: val, color: PALETTE[i] }));

  // Items donut
  const items = countBy(records, "foodItem");
  const itemSegs = items.slice(0, 6).map(([name, val], i) => ({ name, value: val, color: PALETTE[i] }));

  return (
    <>
      {/* Monthly Quantity Trend */}
      <div className="ep-grid-full">
        <div className="ep-card">
          <div className="ep-card-head">
            <div>
              <div className="ep-card-title">
                <span className="ep-dot" style={{ background:"var(--sky)", boxShadow:"0 0 8px rgba(56,189,248,0.5)" }} />
                Monthly Waste Quantity
              </div>
              <div className="ep-card-sub">Grams wasted per month — last 6 months</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span className={`ep-trend ${trend > 0 ? "up" : trend < 0 ? "down" : "flat"}`}>
                {trend > 0 ? `▲ +${trend}%` : trend < 0 ? `▼ ${trend}%` : "→ 0%"} vs prev month
              </span>
              <span className="ep-pill" style={{ background:"var(--sky-dim)", color:"var(--sky)", border:"1px solid rgba(56,189,248,0.2)" }}>
                {totalQty}g total
              </span>
            </div>
          </div>
          <div className="ep-card-body">
            <div className="ep-bars">
              {monthlyQty.map((d, i) => {
                const isLast = i === monthlyQty.length - 1;
                const isPeak = d.value === Math.max(...monthlyQty.map(x => x.value));
                return (
                  <div className="ep-bar-row" key={d.label}>
                    <span className="ep-bar-label">{d.label}</span>
                    <div className="ep-bar-track">
                      <div className="ep-bar-fill" style={{
                        width: `${pct(d.value, maxQty)}%`,
                        background: isPeak
                          ? "linear-gradient(90deg,#fb7185,#f43f5e)"
                          : isLast
                          ? "linear-gradient(90deg,#a3e635,#65a30d)"
                          : "linear-gradient(90deg,#38bdf8,#0ea5e9)",
                      }} />
                    </div>
                    <span className={`ep-bar-val ${d.value > 0 ? "hi" : ""}`}>
                      {d.value > 0 ? `${d.value}g` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="ep-tiles">
              {[
                { val:`${totalQty}g`,   label:"Total Wasted", color:"#38bdf8", bg:"var(--sky-dim)",     border:"rgba(56,189,248,0.2)" },
                { val:`${totalApproved}g`,label:"Reclaimed",  color:"#a3e635", bg:"var(--lime-dim)",    border:"rgba(163,230,53,0.2)" },
                { val:`${salvagePct}%`, label:"Salvage Rate", color:"#fbbf24", bg:"var(--gold-dim)",    border:"rgba(251,191,36,0.2)" },
                { val: approved.length, label:"Approved",     color:"#34d399", bg:"var(--emerald-dim)", border:"rgba(52,211,153,0.2)" },
                { val: records.length,  label:"Total Entries",color:"#a78bfa", bg:"var(--violet-dim)",  border:"rgba(167,139,250,0.2)" },
              ].map(t => (
                <div key={t.label} className="ep-tile"
                  style={{ background:t.bg, borderColor:t.color, borderTopColor:t.color }}>
                  <div className="ep-tile-val" style={{ color:t.color }}>{t.val}</div>
                  <div className="ep-tile-label">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reasons + Items Donuts */}
      <div className="ep-grid-2">
        {/* Reasons */}
        <div className="ep-card">
          <div className="ep-card-head">
            <div>
              <div className="ep-card-title">
                <span className="ep-dot" style={{ background:"var(--red)", boxShadow:"0 0 8px rgba(251,113,133,0.5)" }} />
                Waste Reasons
              </div>
              <div className="ep-card-sub">Why food was wasted</div>
            </div>
          </div>
          <div className="ep-card-body" style={{ display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap" }}>
            {reasonSegs.length > 0 && (
              <Donut segments={reasonSegs} size={130} stroke={14}
                centerVal={records.length} centerLabel="total" />
            )}
            <div className="ep-legend">
              {reasons.slice(0, 6).map(([name, cnt], i) => (
                <div className="ep-legend-row" key={name}>
                  <span className="ep-legend-dot" style={{ background: PALETTE[i] }} />
                  <span className="ep-legend-name" title={name}>{name || "Unknown"}</span>
                  <span className="ep-legend-count">{cnt}</span>
                  <div className="ep-legend-bar-wrap">
                    <div className="ep-legend-bar" style={{ width:`${pct(cnt, records.length)}%`, background:PALETTE[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Items */}
        <div className="ep-card">
          <div className="ep-card-head">
            <div>
              <div className="ep-card-title">
                <span className="ep-dot" style={{ background:"var(--orange)", boxShadow:"0 0 8px rgba(251,146,60,0.5)" }} />
                Most Wasted Items
              </div>
              <div className="ep-card-sub">Food items wasted most frequently</div>
            </div>
          </div>
          <div className="ep-card-body" style={{ display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap" }}>
            {itemSegs.length > 0 && (
              <Donut segments={itemSegs} size={130} stroke={14}
                centerVal={items.length} centerLabel="items" />
            )}
            <div className="ep-legend">
              {items.slice(0, 6).map(([name, cnt], i) => (
                <div className="ep-legend-row" key={name}>
                  <span className="ep-legend-dot" style={{ background: PALETTE[i] }} />
                  <span className="ep-legend-name" title={name}>{name}</span>
                  <span className="ep-legend-count">{cnt}×</span>
                  <div className="ep-legend-bar-wrap">
                    <div className="ep-legend-bar" style={{ width:`${pct(cnt, items[0][1])}%`, background:PALETTE[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ── Location Tab ── */
const LocationTab = ({ records }) => {
  const byLoc    = sumBy(records, "foodQuantity", "location");
  const maxTotal = byLoc[0]?.[1].total || 1;
  const locCount = byLoc.map(([name, v]) => ({ name, ...v }));

  // Monthly by location (top 3 locations)
  const top3 = byLoc.slice(0, 3).map(([name]) => name);
  const locMonthly = top3.map((loc, li) => {
    const recs = records.filter(r => (r.location || "Unknown").trim() === loc);
    return {
      loc, color: PALETTE[li],
      data: groupByMonth(recs, "foodQuantity", 6),
    };
  });

  const maxLocMonth = Math.max(
    ...locMonthly.flatMap(l => l.data.map(d => d.value)), 1
  );

  return (
    <>
      <div className="ep-grid-full">
        <div className="ep-card">
          <div className="ep-card-head">
            <div>
              <div className="ep-card-title">
                <span className="ep-dot" style={{ background:"var(--emerald)", boxShadow:"0 0 8px rgba(52,211,153,0.5)" }} />
                Waste by Location
              </div>
              <div className="ep-card-sub">Total quantity and entry count per location</div>
            </div>
          </div>
          <div className="ep-card-body">
            <div style={{ overflowX:"auto" }}>
              <table className="ep-loc-tbl">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Entries</th>
                    <th>Total Qty</th>
                    <th>Avg / Entry</th>
                    <th>Share</th>
                    <th style={{ width:120 }}>Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {locCount.map((l, i) => {
                    const totalAll = records.reduce((a, r) => a + (Number(r.foodQuantity)||0), 0);
                    const share = totalAll > 0 ? Math.round((l.total / totalAll) * 100) : 0;
                    return (
                      <tr key={l.name}>
                        <td>
                          <span style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <span style={{ width:8, height:8, borderRadius:"50%", background:PALETTE[i], display:"inline-block", flexShrink:0 }} />
                            📍 {l.name}
                          </span>
                        </td>
                        <td>
                          <span className="ep-pill" style={{ background:PALETTE[i]+"18", color:PALETTE[i], border:`1px solid ${PALETTE[i]}40` }}>
                            {l.count}
                          </span>
                        </td>
                        <td style={{ fontFamily:"var(--mono)", fontSize:12 }}>{l.total}g</td>
                        <td style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--t2)" }}>
                          {Math.round(l.total / l.count)}g
                        </td>
                        <td style={{ fontFamily:"var(--mono)", fontSize:12 }}>{share}%</td>
                        <td>
                          <div className="ep-loc-bar-wrap" style={{ width:"100%" }}>
                            <div className="ep-loc-bar" style={{ width:`${pct(l.total, maxTotal)}%`, background:PALETTE[i] }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly by location */}
      {locMonthly.length > 0 && (
        <div className="ep-grid-full">
          <div className="ep-card">
            <div className="ep-card-head">
              <div>
                <div className="ep-card-title">
                  <span className="ep-dot" style={{ background:"var(--violet)", boxShadow:"0 0 8px rgba(167,139,250,0.5)" }} />
                  Monthly Breakdown by Location
                </div>
                <div className="ep-card-sub">Top 3 locations — last 6 months</div>
              </div>
            </div>
            <div className="ep-card-body">
              {locMonthly.map(lm => (
                <div key={lm.loc} style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:lm.color, marginBottom:8, display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:lm.color, display:"inline-block" }} />
                    {lm.loc}
                  </div>
                  <div className="ep-bars">
                    {lm.data.map(d => (
                      <div className="ep-bar-row" key={d.label}>
                        <span className="ep-bar-label">{d.label}</span>
                        <div className="ep-bar-track">
                          <div className="ep-bar-fill" style={{ width:`${pct(d.value, maxLocMonth)}%`, background:lm.color }} />
                        </div>
                        <span className={`ep-bar-val ${d.value > 0 ? "hi" : ""}`}>{d.value > 0 ? `${d.value}g` : "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ── Timeline Tab ── */
const TimelineTab = ({ records }) => {
  const sorted = [...records]
    .filter(r => r.foodWasteDate)
    .sort((a, b) => new Date(b.foodWasteDate) - new Date(a.foodWasteDate))
    .slice(0, 20);

  const colorForQty = (q) => {
    if (q >= 500) return "#fb7185";
    if (q >= 200) return "#fbbf24";
    if (q >= 50)  return "#38bdf8";
    return "#a3e635";
  };

  return (
    <div className="ep-grid-full">
      <div className="ep-card">
        <div className="ep-card-head">
          <div>
            <div className="ep-card-title">
              <span className="ep-dot" style={{ background:"var(--gold)", boxShadow:"0 0 8px rgba(251,191,36,0.5)" }} />
              Recent Activity Timeline
            </div>
            <div className="ep-card-sub">Last 20 waste entries in chronological order</div>
          </div>
        </div>
        <div className="ep-card-body">
          <div className="ep-timeline">
            {sorted.map((r, i) => {
              const qty   = Number(r.foodQuantity) || 0;
              const color = colorForQty(qty);
              const date  = new Date(r.foodWasteDate);
              const dateStr = isNaN(date) ? "—" : date.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
              return (
                <div className="ep-tl-item" key={r._id || i}>
                  <div className="ep-tl-dot" style={{ borderColor:color, color }}>
                    {i + 1}
                  </div>
                  <div className="ep-tl-body">
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                      <div className="ep-tl-title">{r.foodItem}</div>
                      <span className="ep-tl-qty">{qty}g</span>
                    </div>
                    <div className="ep-tl-meta">
                      📅 {dateStr} &nbsp;·&nbsp; 📍 {r.location || "—"} &nbsp;·&nbsp; 
                      {r.foodReason ? `🔖 ${r.foodReason}` : ""}&nbsp;
                      {r.approved ? <span style={{ color:"var(--lime)", fontSize:11 }}>✔ Approved</span> : ""}
                    </div>
                  </div>
                </div>
              );
            })}
            {sorted.length === 0 && (
              <div style={{ color:"var(--t3)", fontSize:13, textAlign:"center", padding:"40px 0" }}>No records found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Eco Score Tab ── */
const EcoScoreTab = ({ records }) => {
  const total   = records.length;
  if (total === 0) return (
    <div className="ep-state" style={{ minHeight:300 }}>
      <span style={{ fontSize:40 }}>🌱</span>
      <span className="ep-state-txt">Add some waste entries to get your Eco Score.</span>
    </div>
  );

  const approved    = records.filter(r => r.approved);
  const totalQty    = records.reduce((a, r) => a + (Number(r.foodQuantity)||0), 0);
  const reclaimedQty= approved.reduce((a, r) => a + (Number(r.foodQuantity)||0), 0);
  const salvagePct  = totalQty > 0 ? (reclaimedQty / totalQty) * 100 : 0;

  // Monthly trend: lower is better
  const monthly = groupByMonth(records, "foodQuantity", 3);
  const trendScore = (() => {
    const last = monthly[2]?.value || 0;
    const first = monthly[0]?.value || 0;
    if (first === 0) return 50;
    return last < first ? 80 : last === first ? 50 : 20;
  })();

  // Consistency: how many months have data
  const monthsWithData = groupByMonth(records, "foodQuantity", 6).filter(d => d.count > 0).length;
  const consistencyScore = Math.round((monthsWithData / 6) * 100);

  // Variety of reasons recorded
  const reasonCount = new Set(records.map(r => r.foodReason).filter(Boolean)).size;
  const awarenessScore = Math.min(reasonCount * 20, 100);

  // Overall score (weighted)
  const overall = Math.round(
    salvagePct * 0.40 +
    trendScore * 0.25 +
    consistencyScore * 0.20 +
    awarenessScore * 0.15
  );

  const grade = overall >= 85 ? "A" : overall >= 70 ? "B" : overall >= 55 ? "C" : overall >= 40 ? "D" : "F";
  const gradeColor = overall >= 70 ? "var(--lime)" : overall >= 50 ? "var(--gold)" : "var(--red)";

  const factors = [
    { label:"Salvage Rate",       val: Math.round(salvagePct), color:"var(--lime)" },
    { label:"Waste Trend",        val: trendScore,             color:"var(--sky)" },
    { label:"Tracking Consistency",val: consistencyScore,      color:"var(--violet)" },
    { label:"Reason Awareness",   val: awarenessScore,         color:"var(--gold)" },
  ];

  const insights = [];
  if (salvagePct < 30)  insights.push({ icon:"♻️", text:<>Your salvage rate is <strong>{Math.round(salvagePct)}%</strong>. Try approving more entries to reclaim wasted food.</> });
  else                  insights.push({ icon:"✅", text:<>Great salvage rate of <strong>{Math.round(salvagePct)}%</strong> — keep approving entries to push it higher.</> });
  if (trendScore < 50)  insights.push({ icon:"📈", text:<>Waste quantity is <strong>increasing</strong> month-over-month. Review your most wasted items and plan smarter.</> });
  else                  insights.push({ icon:"📉", text:<>Waste quantity is <strong>trending down</strong>. You're improving — great work!</> });
  if (monthsWithData < 3) insights.push({ icon:"📅", text:<>You've only logged in <strong>{monthsWithData} month(s)</strong>. Consistent tracking helps spot patterns faster.</> });
  if (awarenessScore < 40) insights.push({ icon:"🔖", text:<>You haven't filled in many waste reasons. Labelling each entry helps identify what to fix first.</> });
  if (overall >= 70)    insights.push({ icon:"🌿", text:<>Your Eco Score of <strong>{overall}/100</strong> is strong. Share your habits with your community!</> });

  return (
    <>
      <div className="ep-grid-full">
        <div className="ep-card ep-score-card">
          <div className="ep-card-head" style={{ padding:"22px 24px 0" }}>
            <div className="ep-card-title" style={{ fontSize:17 }}>
              <span className="ep-dot" style={{ background:"var(--lime)", boxShadow:"0 0 10px rgba(163,230,53,0.6)" }} />
              Your Eco Score
            </div>
          </div>
          <div className="ep-card-body">
            <div className="ep-score-ring-wrap">
              {/* Ring */}
              <div style={{ position:"relative", display:"inline-block", flexShrink:0 }}>
                <ScoreRing score={overall} size={160} stroke={12} />
                <div style={{
                  position:"absolute", inset:0,
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                }}>
                  <div className="ep-score-grade" style={{ color:gradeColor, fontSize:64 }}>{grade}</div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:16, color:gradeColor, marginTop:2 }}>{overall}/100</div>
                </div>
              </div>

              {/* Factors */}
              <div className="ep-score-factors">
                {factors.map(f => (
                  <div className="ep-score-factor" key={f.label}>
                    <span className="ep-score-factor-label">{f.label}</span>
                    <div className="ep-score-factor-bar">
                      <div className="ep-score-factor-fill" style={{ width:`${f.val}%`, background:f.color }} />
                    </div>
                    <span className="ep-score-factor-val" style={{ color:f.color }}>{f.val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="ep-grid-full">
        <div className="ep-card">
          <div className="ep-card-head">
            <div className="ep-card-title">
              <span className="ep-dot" style={{ background:"var(--violet)", boxShadow:"0 0 8px rgba(167,139,250,0.5)" }} />
              Personalised Insights
            </div>
          </div>
          <div className="ep-card-body">
            <div className="ep-insights">
              {insights.map((ins, i) => (
                <div className="ep-insight" key={i}>
                  <span className="ep-insight-icon">{ins.icon}</span>
                  <span className="ep-insight-text">{ins.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ── Items Tab ── */
const ItemsTab = ({ records }) => {
  const byItem = sumBy(records, "foodQuantity", "foodItem");
  const maxQty = byItem[0]?.[1].total || 1;

  // Entry count donut
  const entryCounts = countBy(records, "foodItem");
  const entrySegs   = entryCounts.slice(0, 6).map(([name, val], i) => ({ name, value:val, color:PALETTE[i] }));

  return (
    <>
      <div className="ep-grid-full">
        <div className="ep-card">
          <div className="ep-card-head">
            <div>
              <div className="ep-card-title">
                <span className="ep-dot" style={{ background:"var(--orange)", boxShadow:"0 0 8px rgba(251,146,60,0.5)" }} />
                Food Items — Quantity Analysis
              </div>
              <div className="ep-card-sub">Total grams wasted per food item</div>
            </div>
          </div>
          <div className="ep-card-body">
            <div style={{ overflowX:"auto" }}>
              <table className="ep-loc-tbl">
                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Entries</th>
                    <th>Total Wasted</th>
                    <th>Avg / Entry</th>
                    <th>Approved</th>
                    <th style={{ width:120 }}>Qty Share</th>
                  </tr>
                </thead>
                <tbody>
                  {byItem.slice(0, 15).map(([name, v], i) => {
                    const itemApproved = records.filter(r =>
                      (r.foodItem || "").trim() === name && r.approved
                    ).length;
                    return (
                      <tr key={name}>
                        <td>
                          <span style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <span style={{ width:8, height:8, borderRadius:"50%", background:PALETTE[i % PALETTE.length], display:"inline-block", flexShrink:0 }} />
                            {name}
                          </span>
                        </td>
                        <td style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--t2)" }}>{v.count}</td>
                        <td style={{ fontFamily:"var(--mono)", fontSize:12 }}>{v.total}g</td>
                        <td style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--t2)" }}>{Math.round(v.total / v.count)}g</td>
                        <td>
                          <span className="ep-pill" style={{
                            background: itemApproved > 0 ? "var(--lime-dim)" : "var(--t5)",
                            color: itemApproved > 0 ? "var(--lime)" : "var(--t3)",
                            border: `1px solid ${itemApproved > 0 ? "rgba(163,230,53,0.2)" : "var(--border)"}`,
                          }}>
                            {itemApproved > 0 ? `✔ ${itemApproved}` : "—"}
                          </span>
                        </td>
                        <td>
                          <div className="ep-loc-bar-wrap" style={{ width:"100%" }}>
                            <div className="ep-loc-bar" style={{ width:`${pct(v.total, maxQty)}%`, background:PALETTE[i % PALETTE.length] }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="ep-grid-2">
        <div className="ep-card">
          <div className="ep-card-head">
            <div className="ep-card-title">
              <span className="ep-dot" style={{ background:"var(--orange)", boxShadow:"0 0 8px rgba(251,146,60,0.5)" }} />
              Entry Frequency
            </div>
          </div>
          <div className="ep-card-body" style={{ display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap" }}>
            {entrySegs.length > 0 && (
              <Donut segments={entrySegs} size={120} stroke={13}
                centerVal={entryCounts.length} centerLabel="items" />
            )}
            <div className="ep-legend">
              {entryCounts.slice(0, 6).map(([name, cnt], i) => (
                <div className="ep-legend-row" key={name}>
                  <span className="ep-legend-dot" style={{ background:PALETTE[i] }} />
                  <span className="ep-legend-name" title={name}>{name}</span>
                  <span className="ep-legend-count">{cnt}×</span>
                  <div className="ep-legend-bar-wrap">
                    <div className="ep-legend-bar" style={{ width:`${pct(cnt, entryCounts[0][1])}%`, background:PALETTE[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ep-card">
          <div className="ep-card-head">
            <div className="ep-card-title">
              <span className="ep-dot" style={{ background:"var(--emerald)", boxShadow:"0 0 8px rgba(52,211,153,0.5)" }} />
              Qty Bars — Top 8 Items
            </div>
          </div>
          <div className="ep-card-body">
            <div className="ep-bars">
              {byItem.slice(0, 8).map(([name, v], i) => (
                <div className="ep-bar-row" key={name}>
                  <span className="ep-bar-label" style={{ width:70, fontSize:11 }} title={name}>
                    {name.length > 8 ? name.slice(0,8)+"…" : name}
                  </span>
                  <div className="ep-bar-track">
                    <div className="ep-bar-fill" style={{ width:`${pct(v.total, maxQty)}%`, background:PALETTE[i % PALETTE.length] }} />
                  </div>
                  <span className="ep-bar-val hi">{v.total}g</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════ */
const TABS = [
  { id:"overview",  label:"📊 Overview" },
  { id:"items",     label:"🍱 Food Items" },
  { id:"location",  label:"📍 Locations" },
  { id:"timeline",  label:"🕐 Timeline" },
  { id:"ecoscore",  label:"🌿 Eco Score" },
];

const ECOProgress = () => {
  const { loggedIn } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tab,     setTab]     = useState("overview");

  useEffect(() => {
    if (!loggedIn) { setLoading(false); return; }
    const token = localStorage.getItem("token");
    if (!token)   { setLoading(false); return; }
    axios.get(`${API_URL}/api/waste`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setRecords(data.filter(Boolean));
      })
      .catch(err => { console.error(err); setError("Failed to load data. Please try again."); })
      .finally(() => setLoading(false));
  }, [loggedIn]);

  if (!loggedIn) return (
    <>
      <style>{css}</style>
      <div className="ep-login">
        <span style={{ fontSize:52 }}>🔒</span>
        <span style={{ fontFamily:"var(--serif)", fontSize:22, color:"var(--t2)" }}>
          Please log in to view your progress
        </span>
      </div>
    </>
  );

  const totalEntries  = records.length;
  const totalQty      = records.reduce((a, r) => a + (Number(r.foodQuantity)||0), 0);
  const totalApproved = records.filter(r => r.approved).length;
  const salvagePct    = totalQty > 0
    ? Math.round((records.filter(r=>r.approved).reduce((a,r)=>a+(Number(r.foodQuantity)||0),0) / totalQty)*100)
    : 0;
  const uniqueItems   = new Set(records.map(r => r.foodItem)).size;

  return (
    <>
      <style>{css}</style>
      <div className="ep-root">

        {/* ── HERO ── */}
        <div className="ep-hero">
          <div className="ep-hero-bg" />
          <div className="ep-hero-inner">
            <div>
              <div className="ep-badge">
                <span className="ep-badge-dot" />
                Eco Analytics
              </div>
              <h1 className="ep-title">
                Waste Impact<br /><em>Dashboard</em>
              </h1>
              <p className="ep-subtitle">
                Complete analysis of your food waste patterns — monthly trends, location data, item breakdown and your personalised eco score.
              </p>
            </div>

            <div className="ep-kpi-strip">
              {[
                { val: totalEntries,        label:"Entries",       sub:"total logged",   color:"var(--lime)" },
                { val: `${totalQty}g`,      label:"Qty Logged",    sub:"grams tracked",  color:"var(--sky)" },
                { val: `${salvagePct}%`,    label:"Salvage Rate",  sub:"qty reclaimed",  color:"var(--gold)" },
                { val: totalApproved,       label:"Approved",      sub:"sold out items", color:"var(--emerald)" },
                { val: uniqueItems,         label:"Unique Items",  sub:"food types",     color:"var(--orange)" },
              ].map(k => (
                <div className="ep-kpi" key={k.label} style={{ "--kpi-color":k.color }}>
                  <div className="ep-kpi-val">{k.val}</div>
                  <div className="ep-kpi-label">{k.label}</div>
                  <div className="ep-kpi-sub">{k.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div className="ep-tabs-bar">
          {TABS.map(t => (
            <button key={t.id} className={`ep-tab${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        <div className="ep-body">
          {loading ? (
            <div className="ep-state"><div className="ep-spin" /><span className="ep-state-txt">Loading your data…</span></div>
          ) : error ? (
            <div className="ep-state"><span style={{ fontSize:36 }}>⚠️</span><span className="ep-state-txt">{error}</span></div>
          ) : records.length === 0 ? (
            <div className="ep-state">
              <span style={{ fontSize:44 }}>🗒️</span>
              <span className="ep-state-txt">No waste records yet — add some entries from Waste Analysis.</span>
            </div>
          ) : (
            <>
              {tab === "overview"  && <OverviewTab  records={records} />}
              {tab === "items"     && <ItemsTab     records={records} />}
              {tab === "location"  && <LocationTab  records={records} />}
              {tab === "timeline"  && <TimelineTab  records={records} />}
              {tab === "ecoscore"  && <EcoScoreTab  records={records} />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ECOProgress;