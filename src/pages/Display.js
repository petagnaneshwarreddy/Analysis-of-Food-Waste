import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL    = process.env.REACT_APP_API_URL;
const RENDER_URL = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    /* ── Canvas ── */
    --bg:        #07090a;
    --s1:        #0d1117;
    --s2:        #111820;
    --s3:        #162030;
    --s4:        #1c2a3e;

    /* ── Borders ── */
    --b0: rgba(255,255,255,0.03);
    --b1: rgba(255,255,255,0.07);
    --b2: rgba(255,255,255,0.12);
    --b3: rgba(255,255,255,0.20);

    /* ── Accent palette ── */
    --lime:      #c6f135;
    --lime-a10:  rgba(198,241,53,0.10);
    --lime-a20:  rgba(198,241,53,0.20);
    --lime-a35:  rgba(198,241,53,0.35);
    --lime-glow: rgba(198,241,53,0.18);

    --sky:       #60c8f5;
    --sky-a10:   rgba(96,200,245,0.10);
    --sky-a25:   rgba(96,200,245,0.25);

    --rose:      #f56582;
    --rose-a10:  rgba(245,101,130,0.10);
    --rose-a25:  rgba(245,101,130,0.25);

    --amber:     #f5c842;
    --amber-a10: rgba(245,200,66,0.10);
    --amber-a25: rgba(245,200,66,0.25);

    --violet:    #a78bfa;
    --violet-a10:rgba(167,139,250,0.10);

    /* ── Text ── */
    --t0: #f0f6ff;
    --t1: rgba(240,246,255,0.82);
    --t2: rgba(240,246,255,0.50);
    --t3: rgba(240,246,255,0.28);
    --t4: rgba(240,246,255,0.10);

    /* ── Typography ── */
    --f-display: 'Playfair Display', Georgia, serif;
    --f-sans:    'Syne', system-ui, sans-serif;
    --f-mono:    'JetBrains Mono', monospace;

    /* ── Radii ── */
    --r-xs: 6px;
    --r-sm: 10px;
    --r-md: 16px;
    --r-lg: 24px;
    --r-xl: 32px;
    --r-pill: 999px;

    /* ── Motion ── */
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { -webkit-font-smoothing: antialiased; }

  /* ═══════════════════════════════
     ROOT
  ═══════════════════════════════ */
  .d-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--f-sans);
    color: var(--t0);
    padding-bottom: 120px;
    position: relative;
  }

  /* subtle noise texture overlay */
  .d-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* ═══════════════════════════════
     HERO
  ═══════════════════════════════ */
  .d-hero {
    position: relative; z-index: 1;
    overflow: hidden;
    padding: 80px 32px 72px;
    border-bottom: 1px solid var(--b1);
    background:
      radial-gradient(ellipse 70% 80% at 80% -20%, rgba(198,241,53,0.06) 0%, transparent 55%),
      radial-gradient(ellipse 50% 60% at -10% 80%, rgba(96,200,245,0.04) 0%, transparent 55%),
      linear-gradient(180deg, #0a0f14 0%, var(--bg) 100%);
  }

  .d-hero-inner {
    max-width: 1160px; margin: 0 auto;
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 32px; flex-wrap: wrap;
  }

  .d-hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--f-mono); font-size: 10px; font-weight: 500;
    letter-spacing: 2.5px; text-transform: uppercase; color: var(--lime);
    border: 1px solid var(--lime-a35); background: var(--lime-a10);
    padding: 6px 16px; border-radius: var(--r-pill);
    margin-bottom: 20px;
  }
  .d-hero-tag::before {
    content: '';
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--lime); box-shadow: 0 0 10px var(--lime);
    animation: blink-dot 2.4s ease-in-out infinite;
  }
  @keyframes blink-dot { 0%,100%{opacity:1} 50%{opacity:0.2} }

  .d-hero-title {
    font-family: var(--f-display);
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -2px;
    color: var(--t0);
    margin-bottom: 18px;
  }
  .d-hero-title em {
    font-style: italic; font-weight: 400;
    background: linear-gradient(135deg, var(--lime), #8ef000);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .d-hero-sub {
    font-size: 15px; font-weight: 400; color: var(--t2);
    max-width: 480px; line-height: 1.65;
  }
  .d-hero-num {
    font-family: var(--f-display);
    font-size: clamp(80px, 14vw, 160px);
    font-weight: 900;
    color: rgba(255,255,255,0.025);
    line-height: 0.85; letter-spacing: -8px;
    user-select: none; pointer-events: none;
  }

  /* ═══════════════════════════════
     LOCATION CARD
  ═══════════════════════════════ */
  .d-loc-banner { max-width: 1160px; margin: 28px auto 0; padding: 0 24px; position: relative; z-index: 1; }
  .d-loc-card {
    background: var(--s1);
    border: 1px solid var(--b1);
    border-radius: var(--r-lg);
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }
  .d-loc-top {
    display: flex; align-items: center; gap: 16px; padding: 18px 24px; flex-wrap: wrap;
    background: linear-gradient(135deg, rgba(198,241,53,0.03), transparent);
  }
  .d-loc-icon-wrap {
    width: 42px; height: 42px; border-radius: var(--r-sm);
    background: var(--lime-a10); border: 1px solid var(--lime-a35);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .d-loc-body { flex: 1; min-width: 0; }
  .d-loc-label {
    font-family: var(--f-mono); font-size: 9px; font-weight: 500;
    letter-spacing: 2px; text-transform: uppercase; color: var(--t3); margin-bottom: 3px;
  }
  .d-loc-text { font-size: 13px; font-weight: 600; color: var(--t0); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 500px; }
  .d-loc-text.ph { color: var(--t3); font-weight: 400; font-style: italic; }
  .d-loc-acc {
    display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700;
    font-family: var(--f-mono); padding: 2px 8px; border-radius: var(--r-pill); margin-left: 10px;
  }
  .d-loc-acc.high { background: var(--lime-a10); color: var(--lime); border: 1px solid var(--lime-a35); }
  .d-loc-acc.mid  { background: var(--amber-a10); color: var(--amber); border: 1px solid var(--amber-a25); }
  .d-loc-acc.low  { background: var(--rose-a10); color: var(--rose); border: 1px solid var(--rose-a25); }
  .d-loc-btn {
    flex-shrink: 0; display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px; background: var(--lime); color: #060b00;
    border: none; border-radius: var(--r-sm);
    font-family: var(--f-sans); font-size: 12px; font-weight: 700;
    cursor: pointer; white-space: nowrap;
    transition: opacity 0.2s, transform 0.15s; outline: none;
    box-shadow: 0 4px 20px var(--lime-glow);
  }
  .d-loc-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .d-loc-btn:disabled { opacity: 0.4; cursor: default; }
  .d-loc-spin { width: 12px; height: 12px; border: 2px solid rgba(6,11,0,0.2); border-top-color: #060b00; border-radius: 50%; animation: spin-loc 0.7s linear infinite; }
  @keyframes spin-loc { to { transform: rotate(360deg); } }

  .d-loc-slider-section { border-top: 1px solid var(--b1); padding: 20px 24px 22px; }
  .d-loc-slider-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; gap: 10px; flex-wrap: wrap; }
  .d-loc-radius-display { display: flex; align-items: center; gap: 12px; }
  .d-loc-radius-ico { font-size: 14px; }
  .d-loc-radius-val { font-family: var(--f-display); font-size: 28px; font-weight: 700; color: var(--sky); line-height: 1; }
  .d-loc-radius-unit { font-size: 10px; font-weight: 600; font-family: var(--f-mono); color: var(--t3); margin-top: 3px; letter-spacing: 1px; text-transform: uppercase; }
  .d-loc-count-badge {
    display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px;
    border-radius: var(--r-pill); font-size: 11px; font-weight: 700;
    border: 1px solid var(--lime-a35); background: var(--lime-a10); color: var(--lime);
  }
  .d-loc-count-badge.zero { border-color: var(--rose-a25); background: var(--rose-a10); color: var(--rose); }
  .d-loc-all-toggle {
    display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px;
    border-radius: var(--r-pill); font-family: var(--f-sans); font-size: 11px; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
    border: 1px dashed var(--b2); background: transparent; color: var(--t2);
  }
  .d-loc-all-toggle:hover { border-color: var(--b3); color: var(--t0); }
  .d-loc-all-toggle.on { border-style: solid; border-color: var(--amber-a25); background: var(--amber-a10); color: var(--amber); }

  /* slider */
  .d-slider-wrap { position: relative; padding: 6px 0; }
  .d-slider-track { position: relative; height: 4px; border-radius: 99px; background: var(--b1); }
  .d-slider-fill { position: absolute; left: 0; top: 0; height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--lime), var(--sky)); transition: width 0.05s; pointer-events: none; }
  .d-slider {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 4px; border-radius: 99px;
    background: transparent; outline: none; cursor: pointer; position: relative; z-index: 2;
    margin-top: -4px;
  }
  .d-slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
    background: var(--sky); cursor: pointer;
    border: 3px solid var(--s1);
    box-shadow: 0 0 0 2px var(--sky-a25), 0 2px 10px rgba(0,0,0,0.5);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .d-slider::-webkit-slider-thumb:hover { transform: scale(1.2); box-shadow: 0 0 0 4px var(--sky-a25); }
  .d-slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: var(--sky); cursor: pointer; border: 3px solid var(--s1); }
  .d-slider-ticks { display: flex; justify-content: space-between; margin-top: 10px; padding: 0 2px; }
  .d-slider-tick { font-family: var(--f-mono); font-size: 9px; font-weight: 500; color: var(--t3); cursor: pointer; letter-spacing: 0.5px; transition: color 0.15s; }
  .d-slider-tick:hover { color: var(--t2); }
  .d-slider-tick.active { color: var(--sky); }
  .d-geocoding { display: inline-flex; align-items: center; gap: 7px; font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 1px; color: var(--t3); margin-top: 12px; }
  .d-geocoding-spin { width: 10px; height: 10px; border: 1.5px solid rgba(96,200,245,0.2); border-top-color: var(--sky); border-radius: 50%; animation: spin-loc 0.7s linear infinite; }

  /* ═══════════════════════════════
     STATS ROW
  ═══════════════════════════════ */
  .d-stats {
    max-width: 1160px; margin: 20px auto 0; padding: 0 24px;
    display: flex; gap: 12px; flex-wrap: wrap; position: relative; z-index: 1;
  }
  .d-stat {
    flex: 1; min-width: 100px;
    background: var(--s1); border: 1px solid var(--b1); border-radius: var(--r-md);
    padding: 18px 22px; position: relative; overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
  }
  .d-stat:hover { border-color: var(--b2); transform: translateY(-2px); }
  .d-stat::before {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; border-radius: 0 0 var(--r-md) var(--r-md);
    background: var(--lime); opacity: 0.5;
  }
  .d-stat:nth-child(2)::before { background: var(--sky); }
  .d-stat:nth-child(3)::before { background: var(--rose); }
  .d-stat:nth-child(4)::before { background: var(--amber); }
  .d-stat-n { font-family: var(--f-display); font-size: 32px; font-weight: 700; color: var(--t0); line-height: 1; margin-bottom: 5px; }
  .d-stat-l { font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); }

  /* ═══════════════════════════════
     FILTER BAR
  ═══════════════════════════════ */
  .df-wrap { max-width: 1160px; margin: 20px auto 0; padding: 0 24px; position: relative; z-index: 1; }
  .df-toolbar {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    padding: 14px 16px;
    background: var(--s1); border: 1px solid var(--b1); border-radius: var(--r-md) var(--r-md) 0 0;
  }
  .df-search-wrap { flex: 1 1 220px; min-width: 0; position: relative; }
  .df-search-ico { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); font-size: 13px; color: var(--t3); pointer-events: none; }
  .df-search {
    width: 100%; padding: 9px 14px 9px 38px;
    font-family: var(--f-sans); font-size: 13px; color: var(--t0);
    background: var(--s2); border: 1px solid var(--b1); border-radius: var(--r-sm);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .df-search::placeholder { color: var(--t3); }
  .df-search:focus { border-color: var(--lime-a35); box-shadow: 0 0 0 3px var(--lime-a10); }
  .df-sort {
    flex: 0 0 auto; padding: 9px 32px 9px 12px;
    appearance: none; -webkit-appearance: none;
    font-family: var(--f-sans); font-size: 12px; font-weight: 600; color: var(--t1);
    background: var(--s2); border: 1px solid var(--b1); border-radius: var(--r-sm);
    outline: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='rgba(240,246,255,0.25)' d='M5 7L0 2h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
    transition: border-color 0.2s;
  }
  .df-sort:focus { border-color: var(--lime-a35); }
  .df-filter-toggle {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 16px; flex: 0 0 auto;
    font-family: var(--f-sans); font-size: 12px; font-weight: 700; color: var(--t2);
    background: var(--s2); border: 1px solid var(--b1); border-radius: var(--r-sm);
    cursor: pointer; white-space: nowrap; transition: all 0.18s;
  }
  .df-filter-toggle:hover { border-color: var(--b2); color: var(--t0); }
  .df-filter-toggle.open { background: var(--lime-a10); color: var(--lime); border-color: var(--lime-a35); }
  .df-filter-badge { display: inline-flex; align-items: center; justify-content: center; width: 17px; height: 17px; border-radius: 50%; background: var(--lime); color: #060b00; font-size: 9px; font-weight: 900; }
  .df-view-toggle { display: flex; align-items: center; gap: 2px; background: var(--s2); border: 1px solid var(--b1); border-radius: var(--r-sm); padding: 3px; flex: 0 0 auto; }
  .df-vbtn { width: 30px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; background: none; color: var(--t3); border-radius: var(--r-xs); cursor: pointer; font-size: 13px; transition: all 0.15s; }
  .df-vbtn:hover { color: var(--t1); }
  .df-vbtn.active { background: var(--s3); color: var(--lime); }
  .df-count { font-family: var(--f-mono); font-size: 11px; font-weight: 500; color: var(--t3); white-space: nowrap; }
  .df-count strong { color: var(--lime); }

  .df-panel-wrap { overflow: hidden; transition: max-height 0.38s var(--ease-out), opacity 0.25s; max-height: 0; opacity: 0; }
  .df-panel-wrap.open { max-height: 600px; opacity: 1; }
  .df-panel {
    padding: 20px 18px; background: var(--s2);
    border-left: 1px solid var(--b1); border-right: 1px solid var(--b1);
    display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 20px 24px;
  }
  .df-fsec { display: flex; flex-direction: column; gap: 10px; }
  .df-fsec-title { font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); display: flex; align-items: center; gap: 7px; }
  .df-fsec-title::after { content: ''; flex: 1; height: 1px; background: var(--b1); }
  .df-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .df-chip {
    padding: 5px 12px; border-radius: var(--r-pill); font-size: 11px; font-weight: 600;
    cursor: pointer; border: 1px solid var(--b1); background: var(--s1);
    color: var(--t2); transition: all 0.15s; white-space: nowrap; user-select: none;
  }
  .df-chip:hover { border-color: var(--b2); color: var(--t0); }
  .df-chip.sel { background: var(--lime-a10); color: var(--lime); border-color: var(--lime-a35); }
  .df-chip.sel-red { background: var(--rose-a10); color: var(--rose); border-color: var(--rose-a25); }
  .df-tags-row {
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    padding: 10px 18px;
    background: var(--s1); border-left: 1px solid var(--b1); border-right: 1px solid var(--b1); border-bottom: 1px solid var(--b1);
  }
  .df-tags-label { font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); flex-shrink: 0; }
  .df-tag { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px 3px 12px; border-radius: var(--r-pill); background: var(--lime-a10); border: 1px solid var(--lime-a35); font-size: 11px; font-weight: 600; color: var(--lime); }
  .df-tag-x { display: inline-flex; align-items: center; justify-content: center; width: 13px; height: 13px; border-radius: 50%; background: var(--lime-a20); border: none; color: var(--lime); font-size: 8px; cursor: pointer; font-weight: 900; transition: background 0.15s; padding: 0; }
  .df-tag-x:hover { background: var(--lime-a35); }
  .df-clear-all { margin-left: 4px; padding: 3px 10px; border-radius: var(--r-pill); background: none; border: 1px solid var(--rose-a25); font-family: var(--f-sans); font-size: 11px; font-weight: 700; color: var(--rose); cursor: pointer; transition: background 0.15s; }
  .df-clear-all:hover { background: var(--rose-a10); }
  .df-range-wrap { display: flex; flex-direction: column; gap: 8px; }
  .df-range-labels { display: flex; justify-content: space-between; }
  .df-range-label { font-size: 10px; font-weight: 600; color: var(--t2); }
  .df-range-label span { color: var(--lime); }
  .df-range { -webkit-appearance: none; appearance: none; width: 100%; height: 3px; border-radius: 99px; background: var(--s3); outline: none; cursor: pointer; }
  .df-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--lime); cursor: pointer; box-shadow: 0 0 8px var(--lime-a35); transition: transform 0.15s; }
  .df-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
  .df-range::-moz-range-thumb { width: 14px; height: 14px; border: none; border-radius: 50%; background: var(--lime); }

  /* ═══════════════════════════════
     GRID WRAPPER
  ═══════════════════════════════ */
  .d-grid-wrap { max-width: 1160px; margin: 28px auto 0; padding: 0 24px; position: relative; z-index: 1; }
  .d-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
  @media (max-width: 500px) { .d-grid { grid-template-columns: 1fr; } }

  /* ═══════════════════════════════
     FOOD CARD — redesigned
  ═══════════════════════════════ */
  .d-card {
    background: var(--s1);
    border: 1px solid var(--b1);
    border-radius: var(--r-xl);
    overflow: hidden;
    display: flex; flex-direction: column;
    position: relative;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }
  .d-card:hover {
    border-color: var(--b2);
    box-shadow: 0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px var(--b2);
    transform: translateY(-6px);
  }
  .d-card.sold-card { opacity: 0.55; }
  .d-card.sold-card:hover { transform: none; box-shadow: 0 2px 12px rgba(0,0,0,0.3); }

  /* ── Image area ── */
  .d-img-wrap {
    width: 100%; height: 220px;
    background: var(--s2); overflow: hidden; position: relative; flex-shrink: 0;
  }
  .d-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s var(--ease-out); }
  .d-card:hover .d-img { transform: scale(1.08); }
  .d-no-img { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
  .d-no-img-icon { font-size: 36px; opacity: 0.15; }
  .d-no-img span { font-family: var(--f-mono); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); }

  /* image overlay gradient */
  .d-img-overlay {
    position: absolute; inset: 0; pointer-events: none; z-index: 1;
    background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
  }

  /* image badges */
  .d-img-qty-badge {
    position: absolute; bottom: 14px; left: 14px; z-index: 2;
    background: rgba(7,9,10,0.85); backdrop-filter: blur(12px);
    border: 1px solid var(--lime-a35); border-radius: var(--r-pill);
    padding: 5px 13px;
    font-family: var(--f-mono); font-size: 11px; font-weight: 500; color: var(--lime);
    letter-spacing: 0.5px;
  }
  .d-img-hot-badge {
    position: absolute; top: 14px; right: 14px; z-index: 2;
    background: rgba(245,101,130,0.15); backdrop-filter: blur(12px);
    border: 1px solid var(--rose-a25); border-radius: var(--r-pill);
    padding: 5px 12px; font-size: 10px; font-weight: 700; color: var(--rose);
    animation: hot-pulse 2s ease-in-out infinite;
  }
  @keyframes hot-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
  .d-img-new-badge {
    position: absolute; top: 14px; left: 14px; z-index: 2;
    background: var(--lime); color: #060b00;
    border-radius: var(--r-pill); padding: 4px 10px;
    font-family: var(--f-mono); font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  }
  .d-sold-overlay {
    position: absolute; inset: 0; z-index: 3;
    background: rgba(7,9,10,0.8); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
  }
  .d-sold-stamp {
    font-family: var(--f-display); font-size: 22px; font-weight: 700; font-style: italic;
    color: rgba(255,255,255,0.8); border: 2px solid rgba(255,255,255,0.55);
    padding: 7px 22px; border-radius: 4px; transform: rotate(-10deg);
    letter-spacing: 3px; text-transform: uppercase;
  }

  /* ── Card body ── */
  .d-card-body { padding: 22px 22px 16px; flex: 1; display: flex; flex-direction: column; }

  /* food name */
  .d-card-name {
    font-family: var(--f-display); font-size: 22px; font-weight: 700;
    color: var(--t0); margin-bottom: 16px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    letter-spacing: -0.3px; line-height: 1.1;
  }

  /* donor row */
  .d-donor {
    display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
    padding: 10px 14px;
    background: rgba(198,241,53,0.04);
    border: 1px solid rgba(198,241,53,0.12);
    border-radius: var(--r-md);
  }
  .d-donor-avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--lime), #6ec800);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--f-display); font-size: 13px; font-weight: 700; color: #060b00;
  }
  .d-donor-info { flex: 1; min-width: 0; }
  .d-donor-name { font-size: 12px; font-weight: 700; color: var(--lime); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .d-donor-meta { display: flex; align-items: center; gap: 6px; margin-top: 2px; flex-wrap: wrap; }
  .d-donor-uid { font-family: var(--f-mono); font-size: 9px; font-weight: 500; color: rgba(198,241,53,0.35); letter-spacing: 0.5px; }
  .d-donor-phone {
    display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600;
    color: var(--sky); background: var(--sky-a10); border: 1px solid rgba(96,200,245,0.18);
    border-radius: var(--r-pill); padding: 1px 8px; text-decoration: none; transition: background 0.15s;
  }
  .d-donor-phone:hover { background: var(--sky-a25); }

  /* info rows */
  .d-rows { display: flex; flex-direction: column; gap: 0; margin-bottom: 16px; flex: 1; }
  .d-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 8px 0; border-bottom: 1px solid var(--b0);
  }
  .d-row:last-child { border-bottom: none; }
  .d-lbl { font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); min-width: 62px; flex-shrink: 0; padding-top: 2px; }
  .d-val { font-size: 12px; font-weight: 500; color: var(--t1); line-height: 1.5; }
  .d-dist-badge {
    display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700;
    font-family: var(--f-mono); padding: 2px 10px; border-radius: var(--r-pill);
    background: var(--sky-a10); border: 1px solid rgba(96,200,245,0.20); color: var(--sky);
    letter-spacing: 0.3px;
  }

  /* availability bar */
  .d-spots { margin-bottom: 16px; }
  .d-spots-head { display: flex; justify-content: space-between; font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); margin-bottom: 7px; }
  .d-spots-head span:last-child { color: var(--amber); }
  .d-spots-track { height: 4px; border-radius: 99px; background: var(--b1); overflow: hidden; }
  .d-spots-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--lime), #8ef000); transition: width 0.7s var(--ease-out); }
  .d-spots-fill.almost { background: linear-gradient(90deg, var(--amber), #f59500); }
  .d-spots-fill.full   { background: linear-gradient(90deg, var(--rose), #d02050); }

  /* ── Card footer ── */
  .d-footer { border-top: 1px solid var(--b1); padding: 16px 22px 22px; display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
  .d-reserve-btn {
    width: 100%; padding: 13px 16px;
    background: var(--lime); color: #060b00;
    font-family: var(--f-sans); font-size: 13px; font-weight: 700;
    border: none; border-radius: var(--r-md); cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 4px 20px var(--lime-glow);
    letter-spacing: 0.3px;
  }
  .d-reserve-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .d-footer-row { display: flex; gap: 8px; }
  .d-call-btn {
    flex: 1; padding: 10px 12px;
    background: var(--sky-a10); color: var(--sky);
    border: 1px solid rgba(96,200,245,0.20);
    font-family: var(--f-sans); font-size: 11px; font-weight: 700;
    border-radius: var(--r-sm); cursor: pointer; text-decoration: none;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    transition: background 0.2s;
  }
  .d-call-btn:hover { background: var(--sky-a25); }
  .d-dir-btn {
    flex: 1; padding: 10px 12px;
    background: transparent; border: 1px solid var(--b1); color: var(--t2);
    font-family: var(--f-sans); font-size: 11px; font-weight: 600;
    border-radius: var(--r-sm); cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .d-dir-btn:hover { background: var(--b0); border-color: var(--b2); color: var(--t0); }
  .d-sold-btn {
    width: 100%; padding: 12px 16px;
    background: var(--rose-a10); color: var(--rose);
    border: 1px solid var(--rose-a25);
    font-family: var(--f-sans); font-size: 12px; font-weight: 700;
    border-radius: var(--r-md); cursor: default;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }

  /* ═══════════════════════════════
     LIST VIEW
  ═══════════════════════════════ */
  .d-list { display: flex; flex-direction: column; gap: 10px; }
  .d-lcard {
    background: var(--s1); border: 1px solid var(--b1); border-radius: var(--r-md);
    display: flex; align-items: stretch; overflow: hidden;
    transition: border-color 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .d-lcard:hover { border-color: var(--b2); transform: translateX(4px); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
  .d-lcard-img { width: 90px; flex-shrink: 0; background: var(--s2); display: flex; align-items: center; justify-content: center; font-size: 28px; color: var(--t3); overflow: hidden; position: relative; }
  .d-lcard-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .d-lcard-body { flex: 1; padding: 12px 16px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; min-width: 0; }
  .d-lcard-name { font-family: var(--f-display); font-size: 15px; font-weight: 700; color: var(--t0); min-width: 100px; flex-shrink: 0; }
  .d-lcard-meta { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; }
  .d-ltag { font-family: var(--f-mono); font-size: 10px; font-weight: 500; color: var(--t2); background: var(--s2); border: 1px solid var(--b1); border-radius: var(--r-pill); padding: 3px 10px; white-space: nowrap; letter-spacing: 0.3px; }
  .d-donor-ltag { font-size: 10px; font-weight: 700; color: var(--lime); background: var(--lime-a10); border: 1px solid var(--lime-a35); border-radius: var(--r-pill); padding: 3px 10px; white-space: nowrap; font-family: var(--f-mono); }
  .d-phone-ltag { font-size: 10px; font-weight: 700; color: var(--sky); background: var(--sky-a10); border: 1px solid rgba(96,200,245,0.2); border-radius: var(--r-pill); padding: 3px 10px; white-space: nowrap; text-decoration: none; font-family: var(--f-mono); }
  .d-phone-ltag:hover { background: var(--sky-a25); }
  .d-sold-ltag { font-size: 10px; font-weight: 700; color: var(--rose); background: var(--rose-a10); border: 1px solid var(--rose-a25); border-radius: var(--r-pill); padding: 3px 10px; white-space: nowrap; font-family: var(--f-mono); }
  .d-lcard-acts { margin-left: auto; flex-shrink: 0; display: flex; gap: 7px; align-items: center; padding-right: 4px; }
  .d-lbtn { padding: 8px 14px; background: var(--lime); color: #060b00; font-family: var(--f-sans); font-size: 11px; font-weight: 700; border: none; border-radius: var(--r-sm); cursor: pointer; transition: opacity 0.2s; white-space: nowrap; }
  .d-lbtn:hover { opacity: 0.82; }
  .d-lbtn-dir { padding: 8px 10px; background: transparent; border: 1px solid var(--b1); color: var(--t2); font-size: 13px; border-radius: var(--r-sm); cursor: pointer; transition: background 0.2s; }
  .d-lbtn-dir:hover { background: var(--b0); }

  /* ═══════════════════════════════
     EMPTY / LOADING STATES
  ═══════════════════════════════ */
  .df-no-results { padding: 80px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .df-no-results-ico { font-size: 48px; opacity: 0.2; }
  .df-no-results-title { font-family: var(--f-display); font-size: 24px; font-weight: 700; color: var(--t2); }
  .df-no-results-sub { font-size: 13px; color: var(--t3); max-width: 320px; line-height: 1.65; }
  .df-no-results-btn { margin-top: 8px; padding: 10px 22px; background: var(--lime-a10); border: 1px solid var(--lime-a35); color: var(--lime); font-family: var(--f-sans); font-size: 12px; font-weight: 700; border-radius: var(--r-pill); cursor: pointer; transition: background 0.15s; }
  .df-no-results-btn:hover { background: var(--lime-a20); }
  .d-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; gap: 16px; color: var(--t2); font-size: 13px; }
  .d-spinner { width: 32px; height: 32px; border: 2px solid rgba(198,241,53,0.12); border-top-color: var(--lime); border-radius: 50%; animation: dspin 0.7s linear infinite; }
  @keyframes dspin { to { transform: rotate(360deg); } }
  .d-empty { max-width: 400px; margin: 80px auto; text-align: center; padding: 48px 32px; background: var(--s1); border: 1px solid var(--b1); border-radius: var(--r-xl); color: var(--t2); font-size: 14px; }
  .d-empty-ico { font-size: 44px; margin-bottom: 16px; }
  .d-empty-title { font-family: var(--f-display); font-size: 20px; font-weight: 700; color: var(--t0); margin-bottom: 8px; }
  .d-err { color: var(--rose); }
  .d-gate { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; background: var(--bg); }
  .d-gate-ico { font-size: 48px; }
  .d-gate-txt { font-family: var(--f-display); font-size: 22px; color: var(--t2); }

  /* ═══════════════════════════════
     MODAL
  ═══════════════════════════════ */
  .rm-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.82); backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .rm-box {
    background: var(--s1); border: 1px solid var(--b2); border-radius: var(--r-xl);
    width: 100%; max-width: 500px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.9);
    overflow: hidden; position: relative; max-height: 90vh; overflow-y: auto;
  }
  .rm-box::-webkit-scrollbar { width: 3px; }
  .rm-box::-webkit-scrollbar-thumb { background: var(--b2); border-radius: 3px; }
  .rm-close {
    position: absolute; top: 18px; right: 18px;
    background: var(--s2); border: 1px solid var(--b1); border-radius: var(--r-sm);
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    color: var(--t2); font-size: 13px; cursor: pointer; transition: all 0.15s;
  }
  .rm-close:hover { background: var(--s3); color: var(--t0); border-color: var(--b2); }
  .rm-top { padding: 28px 28px 0; background: linear-gradient(180deg, rgba(198,241,53,0.04), transparent); }
  .rm-food-name { font-family: var(--f-display); font-size: 26px; font-weight: 700; color: var(--t0); margin-bottom: 10px; padding-right: 48px; line-height: 1.1; }
  .rm-food-meta { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 18px; }
  .rm-tag { display: inline-flex; align-items: center; gap: 4px; font-family: var(--f-mono); font-size: 10px; font-weight: 500; padding: 4px 11px; border-radius: var(--r-pill); }
  .rm-tag-g { background: var(--lime-a10); color: var(--lime); border: 1px solid var(--lime-a35); }
  .rm-tag-s { background: var(--sky-a10); color: var(--sky); border: 1px solid var(--sky-a25); }
  .rm-tag-d { background: var(--amber-a10); color: var(--amber); border: 1px solid var(--amber-a25); }
  .rm-spots { padding: 12px 16px; background: var(--b0); border: 1px solid var(--b1); border-radius: var(--r-md); margin-bottom: 20px; }
  .rm-spots-row { display: flex; justify-content: space-between; font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); margin-bottom: 8px; }
  .rm-spots-row span:last-child { color: var(--amber); }
  .rm-spots-track { height: 3px; border-radius: 99px; background: var(--b1); overflow: hidden; }
  .rm-spots-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--lime), #8ef000); transition: width 0.5s; }
  .rm-body { padding: 0 28px 28px; }
  .rm-section-title { font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); margin-bottom: 14px; margin-top: 22px; display: flex; align-items: center; gap: 8px; }
  .rm-section-title::after { content: ''; flex: 1; height: 1px; background: var(--b1); }
  .rm-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
  .rm-label { font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); }
  .rm-inp {
    width: 100%; padding: 12px 16px;
    font-family: var(--f-sans); font-size: 14px; color: var(--t0);
    background: var(--s2); border: 1px solid var(--b1); border-radius: var(--r-md);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .rm-inp::placeholder { color: var(--t3); }
  .rm-inp:focus { border-color: var(--lime-a35); box-shadow: 0 0 0 3px var(--lime-a10); }
  .rm-qty-note { padding: 11px 14px; border-radius: var(--r-sm); background: var(--lime-a10); border: 1px solid var(--lime-a35); font-size: 12px; color: var(--t1); display: flex; align-items: center; gap: 9px; margin-bottom: 7px; }
  .rm-error { padding: 12px 15px; border-radius: var(--r-sm); background: var(--rose-a10); border: 1px solid var(--rose-a25); color: var(--rose); font-size: 12px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 8px; }
  .rm-submit {
    width: 100%; padding: 14px;
    background: var(--lime); color: #060b00;
    font-family: var(--f-sans); font-size: 14px; font-weight: 700;
    border: none; border-radius: var(--r-md); cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 50px; transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 4px 20px var(--lime-glow); letter-spacing: 0.3px;
  }
  .rm-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .rm-submit:disabled { opacity: 0.35; cursor: default; transform: none; }
  .rm-spin { width: 16px; height: 16px; border: 2px solid rgba(6,11,0,0.2); border-top-color: #060b00; border-radius: 50%; animation: dspin 0.6s linear infinite; }
  .rm-success { padding: 36px 28px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .rm-success-ico { font-size: 52px; }
  .rm-success-title { font-family: var(--f-display); font-size: 28px; font-weight: 700; color: var(--lime); letter-spacing: -0.5px; }
  .rm-success-sub { font-size: 14px; color: var(--t2); line-height: 1.6; max-width: 320px; }
  .rm-code-box { background: var(--lime-a10); border: 2px solid var(--lime-a35); border-radius: var(--r-lg); padding: 24px 32px; margin: 8px 0; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: background 0.18s; }
  .rm-code-box:hover { background: var(--lime-a20); }
  .rm-code-label { font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: rgba(198,241,53,0.45); }
  .rm-code { font-family: var(--f-display); font-size: 52px; font-weight: 700; color: var(--lime); letter-spacing: 10px; line-height: 1; }
  .rm-code-hint { font-family: var(--f-mono); font-size: 9px; color: var(--t3); letter-spacing: 1px; }
  .rm-code-copied { font-family: var(--f-mono); font-size: 10px; font-weight: 700; color: var(--lime); margin-top: -4px; letter-spacing: 1px; }
  .rm-expiry { font-family: var(--f-mono); font-size: 10px; color: var(--t3); font-style: italic; padding: 6px 0; }
  .rm-donor-section { width: 100%; background: var(--lime-a10); border: 1px solid rgba(198,241,53,0.14); border-radius: var(--r-md); padding: 16px; display: flex; flex-direction: column; gap: 10px; text-align: left; }
  .rm-donor-section-title { font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: rgba(198,241,53,0.45); margin-bottom: 2px; }
  .rm-donor-row { display: flex; align-items: flex-start; gap: 10px; }
  .rm-donor-row-ico { font-size: 13px; flex-shrink: 0; margin-top: 1px; }
  .rm-donor-row-body { flex: 1; min-width: 0; }
  .rm-donor-row-label { font-family: var(--f-mono); font-size: 9px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); margin-bottom: 2px; }
  .rm-donor-row-val { font-size: 13px; font-weight: 600; color: var(--t0); }
  .rm-donor-row-val a { color: var(--sky); text-decoration: none; }
  .rm-donor-row-val a:hover { text-decoration: underline; }
  .rm-divider { width: 100%; height: 1px; background: var(--b1); margin: 2px 0; }
  .rm-call-action { width: 100%; padding: 12px 16px; background: var(--sky-a10); color: var(--sky); border: 1px solid var(--sky-a25); font-family: var(--f-sans); font-size: 12px; font-weight: 700; border-radius: var(--r-sm); cursor: pointer; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s; }
  .rm-call-action:hover { background: var(--sky-a25); }
  .rm-dir-action { width: 100%; padding: 10px 16px; background: transparent; border: 1px solid var(--b1); color: var(--t2); font-family: var(--f-sans); font-size: 12px; font-weight: 600; border-radius: var(--r-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s, color 0.2s; }
  .rm-dir-action:hover { background: var(--b0); color: var(--t0); }
  .rm-done-btn { width: 100%; padding: 13px; background: var(--b0); border: 1px solid var(--b2); color: var(--t2); font-family: var(--f-sans); font-size: 13px; font-weight: 600; border-radius: var(--r-md); cursor: pointer; transition: background 0.18s; }
  .rm-done-btn:hover { background: var(--b1); color: var(--t0); }
`;

/* ── Helpers ── */
const buildPaths = (image) => {
  if (!image) return [];
  if (image.startsWith("http")) return [image];
  return [
    `${API_URL}/uploads/${image}`,
    `${API_URL}/api/uploads/${image}`,
    `${RENDER_URL}/uploads/${image}`,
    `${RENDER_URL}/api/uploads/${image}`,
  ];
};

const SmartImg = ({ image, alt }) => {
  const paths = buildPaths(image);
  const [idx, setIdx] = useState(0);
  const [broken, setBroken] = useState(false);
  if (!image || broken) {
    return (
      <div className="d-no-img">
        <div className="d-no-img-icon">🍽️</div>
        <span>No Photo</span>
      </div>
    );
  }
  return (
    <img src={paths[idx]} alt={alt} className="d-img"
      onError={() => { if (idx + 1 < paths.length) setIdx(idx + 1); else setBroken(true); }} />
  );
};

const ListImg = ({ image, alt }) => {
  const paths = buildPaths(image);
  const [idx, setIdx] = useState(0);
  const [broken, setBroken] = useState(false);
  if (!image || broken) return <span>🍽️</span>;
  return (
    <img src={paths[idx]} alt={alt}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      onError={() => { if (idx + 1 < paths.length) setIdx(idx + 1); else setBroken(true); }} />
  );
};

const getDirections = (dest) => {
  if (!dest) return;
  const fb = () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`, "_blank");
  if (!navigator.geolocation) { fb(); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => window.open(`https://www.google.com/maps/dir/${pos.coords.latitude},${pos.coords.longitude}/${encodeURIComponent(dest)}`, "_blank"),
    fb, { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
  );
};

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const geocodeLocation = async (locStr) => {
  if (!locStr) return null;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locStr)}&format=json&limit=1`, { headers: { "Accept-Language": "en" } });
    const data = await res.json();
    if (data[0]) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch { /* ignore */ }
  return null;
};

/* ── Spots Bar ── */
const SpotsBar = ({ reserved, total }) => {
  if (!total) return null;
  const pct  = Math.min(100, Math.round((reserved / total) * 100));
  const left = Math.max(0, total - reserved);
  const cls  = pct >= 100 ? "full" : pct >= 70 ? "almost" : "";
  return (
    <div className="d-spots">
      <div className="d-spots-head">
        <span>Availability</span>
        <span>{left === 0 ? "FULL" : `${left} spot${left !== 1 ? "s" : ""} left`}</span>
      </div>
      <div className="d-spots-track">
        <div className={`d-spots-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ── Location Card ── */
const LocationCard = ({ userCoords, locText, locAcc, locating, onLocate, sliderKm, setSliderKm, distanceCache, allItems, spotsMap, geocoding }) => {
  const accClass = !locAcc ? "" : locAcc <= 20 ? "high" : locAcc <= 100 ? "mid" : "low";
  const countInRadius = sliderKm === 0 ? null : allItems.filter(item => {
    if (item.approved || spotsMap[item._id]?.isSoldOut) return false;
    const d = distanceCache[item._id];
    if (d === undefined) return false;
    return d <= sliderKm;
  }).length;
  const totalAvailable = allItems.filter(i => !i.approved && !spotsMap[i._id]?.isSoldOut).length;
  const TICKS = [0, 25, 50, 75, 100];

  return (
    <div className="d-loc-banner">
      <div className="d-loc-card">
        <div className="d-loc-top">
          <div className="d-loc-icon-wrap">
            {locating ? "📡" : userCoords ? "📍" : "🗺️"}
          </div>
          <div className="d-loc-body">
            <div className="d-loc-label">Your Location</div>
            <div className={`d-loc-text${!locText && !locating ? " ph" : ""}`}>
              {locating ? "Detecting your location…" : locText || "Tap Locate Me to enable distance-based filtering"}
              {locText && locAcc && (
                <span className={`d-loc-acc ${accClass}`}>GPS ±{Math.round(locAcc)}m</span>
              )}
            </div>
          </div>
          <button className="d-loc-btn" onClick={onLocate} disabled={locating}>
            {locating ? <><div className="d-loc-spin" />Locating…</> : userCoords ? <>🔄 Refresh</> : <>📍 Locate Me</>}
          </button>
        </div>

        {userCoords && (
          <div className="d-loc-slider-section">
            <div className="d-loc-slider-header">
              <div className="d-loc-radius-display">
                <span className="d-loc-radius-ico">📍</span>
                <div>
                  <div className="d-loc-radius-val">{sliderKm === 0 ? "All" : `${sliderKm} km`}</div>
                  <div className="d-loc-radius-unit">{sliderKm === 0 ? "All locations" : "Radius from you"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {sliderKm > 0 && countInRadius !== null && (
                  <span className={`d-loc-count-badge${countInRadius === 0 ? " zero" : ""}`}>
                    {countInRadius === 0 ? "No donations nearby" : `${countInRadius} donation${countInRadius !== 1 ? "s" : ""} nearby`}
                  </span>
                )}
                {sliderKm === 0 && (
                  <span className="d-loc-count-badge">🌍 {totalAvailable} donation{totalAvailable !== 1 ? "s" : ""}</span>
                )}
                <button className={`d-loc-all-toggle${sliderKm === 0 ? " on" : ""}`} onClick={() => setSliderKm(sliderKm === 0 ? 25 : 0)}>
                  🌍 {sliderKm === 0 ? "Back to radius" : "All locations"}
                </button>
              </div>
            </div>
            <div className="d-slider-wrap">
              <div className="d-slider-track">
                <div className="d-slider-fill" style={{ width: sliderKm === 0 ? "100%" : `${sliderKm}%` }} />
              </div>
              <input type="range" min={1} max={100} step={1} value={sliderKm === 0 ? 100 : sliderKm}
                className="d-slider" onChange={e => setSliderKm(Number(e.target.value))}
                onMouseDown={() => { if (sliderKm === 0) setSliderKm(25); }} />
            </div>
            <div className="d-slider-ticks">
              {TICKS.map(t => (
                <span key={t} className={`d-slider-tick${sliderKm > 0 && sliderKm >= t ? " active" : ""}`}
                  style={{ cursor: "pointer" }} onClick={() => setSliderKm(t === 0 ? 1 : t)}>
                  {t === 0 ? "1" : t} km
                </span>
              ))}
            </div>
            {geocoding && (
              <div className="d-geocoding">
                <div className="d-geocoding-spin" />
                CALCULATING DISTANCES
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Sort options ── */
const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc",  label: "Oldest first" },
  { value: "qty-desc",  label: "Quantity: High → Low" },
  { value: "qty-asc",   label: "Quantity: Low → High" },
  { value: "dist-asc",  label: "Nearest first" },
  { value: "name-asc",  label: "Name: A → Z" },
];

/* ── Filter Bar ── */
const FilterBar = ({ items, filters, setFilters, view, setView, resultCount, userCoords }) => {
  const [open, setOpen] = useState(false);
  const donors = [...new Set(items.map(i => i.user?.username).filter(Boolean))].slice(0, 8);
  const activeCount = [
    filters.status !== "all", filters.donor !== "",
    filters.dateFrom !== "", filters.dateTo !== "", filters.maxQty < 10000,
  ].filter(Boolean).length;

  const activeTags = [];
  if (filters.status !== "all") activeTags.push({ key: "status", label: `Status: ${filters.status === "available" ? "Available" : "Sold Out"}`, clear: () => setFilters(f => ({ ...f, status: "all" })) });
  if (filters.donor !== "")    activeTags.push({ key: "donor", label: `Donor: ${filters.donor}`, clear: () => setFilters(f => ({ ...f, donor: "" })) });
  if (filters.dateFrom !== "") activeTags.push({ key: "df", label: `From: ${filters.dateFrom}`, clear: () => setFilters(f => ({ ...f, dateFrom: "" })) });
  if (filters.dateTo !== "")   activeTags.push({ key: "dt", label: `To: ${filters.dateTo}`, clear: () => setFilters(f => ({ ...f, dateTo: "" })) });
  if (filters.maxQty < 10000)  activeTags.push({ key: "qty", label: `Qty ≤ ${filters.maxQty}g`, clear: () => setFilters(f => ({ ...f, maxQty: 10000 })) });
  const clearAll = () => setFilters(f => ({ ...f, status: "all", donor: "", dateFrom: "", dateTo: "", maxQty: 10000 }));

  return (
    <div className="df-wrap">
      <div className="df-toolbar">
        <div className="df-search-wrap">
          <span className="df-search-ico">🔍</span>
          <input className="df-search" type="text" placeholder="Search food item, location, donor…"
            value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <select className="df-sort" value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}>
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value} disabled={o.value === "dist-asc" && !userCoords}>
              {o.value === "dist-asc" && !userCoords ? "Nearest (locate first)" : o.label}
            </option>
          ))}
        </select>
        <button className={`df-filter-toggle${open ? " open" : ""}`} onClick={() => setOpen(v => !v)}>
          ⚙ Filters {activeCount > 0 && <span className="df-filter-badge">{activeCount}</span>}
        </button>
        <div className="df-view-toggle">
          <button className={`df-vbtn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")} title="Grid">⊞</button>
          <button className={`df-vbtn${view === "list" ? " active" : ""}`} onClick={() => setView("list")} title="List">☰</button>
        </div>
        <span className="df-count"><strong>{resultCount}</strong> result{resultCount !== 1 ? "s" : ""}</span>
      </div>

      <div className={`df-panel-wrap${open ? " open" : ""}`}>
        <div className="df-panel">
          <div className="df-fsec">
            <div className="df-fsec-title">Status</div>
            <div className="df-chips">
              {[{ v: "all", l: "All" }, { v: "available", l: "Available", cls: "sel" }, { v: "soldout", l: "Sold Out", cls: "sel-red" }].map(c => (
                <button key={c.v} className={`df-chip${filters.status === c.v ? ` ${c.cls || "sel"}` : ""}`}
                  onClick={() => setFilters(f => ({ ...f, status: c.v }))}>{c.l}</button>
              ))}
            </div>
          </div>
          {donors.length > 0 && (
            <div className="df-fsec">
              <div className="df-fsec-title">Donor</div>
              <div className="df-chips">
                <button className={`df-chip${filters.donor === "" ? " sel" : ""}`} onClick={() => setFilters(f => ({ ...f, donor: "" }))}>Any</button>
                {donors.map(d => (
                  <button key={d} className={`df-chip${filters.donor === d ? " sel" : ""}`}
                    onClick={() => setFilters(f => ({ ...f, donor: filters.donor === d ? "" : d }))}>{d}</button>
                ))}
              </div>
            </div>
          )}
          <div className="df-fsec">
            <div className="df-fsec-title">Date Range</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                style={{ flex: 1, padding: "8px 10px", fontFamily: "var(--f-sans)", fontSize: 12, color: "var(--t0)", background: "var(--s1)", border: "1px solid var(--b1)", borderRadius: 8, outline: "none" }} />
              <span style={{ color: "var(--t3)", fontSize: 11, flexShrink: 0 }}>→</span>
              <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                style={{ flex: 1, padding: "8px 10px", fontFamily: "var(--f-sans)", fontSize: 12, color: "var(--t0)", background: "var(--s1)", border: "1px solid var(--b1)", borderRadius: 8, outline: "none" }} />
            </div>
          </div>
          <div className="df-fsec">
            <div className="df-fsec-title">Max Quantity</div>
            <div className="df-range-wrap">
              <div className="df-range-labels">
                <span className="df-range-label">0g</span>
                <span className="df-range-label">Up to <span>{filters.maxQty >= 10000 ? "Any" : `${filters.maxQty}g`}</span></span>
                <span className="df-range-label">10kg+</span>
              </div>
              <input className="df-range" type="range" min={100} max={10000} step={100} value={filters.maxQty}
                onChange={e => setFilters(f => ({ ...f, maxQty: Number(e.target.value) }))} />
            </div>
          </div>
        </div>
      </div>

      {activeTags.length > 0 && (
        <div className="df-tags-row">
          <span className="df-tags-label">Active:</span>
          {activeTags.map(tag => (
            <span key={tag.key} className="df-tag">
              {tag.label}
              <button className="df-tag-x" onClick={tag.clear}>✕</button>
            </span>
          ))}
          <button className="df-clear-all" onClick={clearAll}>Clear all</button>
        </div>
      )}
    </div>
  );
};

/* ── Reservation Modal ── */
const ReservationModal = ({ item, spotsInfo, onClose, onReserved }) => {
  const [form, setForm]       = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState(null);
  const [copied, setCopied]   = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_URL}/api/reservations`,
        { foodItemId: item._id, reserverName: form.name.trim(), reserverPhone: form.phone.trim(), reserverEmail: form.email.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(data); onReserved(item._id);
    } catch (err) { setError(err?.response?.data?.error || "Reservation failed."); }
    finally { setLoading(false); }
  };

  const copyCode = () => navigator.clipboard.writeText(result.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  const fmtExp  = iso => iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <AnimatePresence>
      <motion.div className="rm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={e => { if (e.target.classList.contains("rm-overlay")) onClose(); }}>
        <motion.div className="rm-box" initial={{ scale: 0.9, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 24 }} transition={{ type: "spring", damping: 24, stiffness: 300 }}>
          <button className="rm-close" onClick={onClose}>✕</button>
          {result ? (
            <div className="rm-success">
              <div className="rm-success-ico">🎉</div>
              <div className="rm-success-title">Confirmed!</div>
              <div className="rm-success-sub">Show this code to the donor when you arrive to collect.</div>
              <div className="rm-code-box" onClick={copyCode} title="Tap to copy">
                <div className="rm-code-label">Pickup Code</div>
                <div className="rm-code">{result.code}</div>
                <div className="rm-code-hint">tap to copy</div>
              </div>
              {copied && <div className="rm-code-copied">✓ Copied to clipboard</div>}
              <div className="rm-expiry">⏰ Expires: {fmtExp(result.codeExpiresAt)}</div>
              <div className="rm-donor-section">
                <div className="rm-donor-section-title">Donor</div>
                <div className="rm-donor-row"><span className="rm-donor-row-ico">🙍</span>
                  <div className="rm-donor-row-body"><div className="rm-donor-row-label">Name</div><div className="rm-donor-row-val">{item.user?.username || "Anonymous"}</div></div>
                </div>
                {item.user?.phone && (<><div className="rm-divider" /><div className="rm-donor-row"><span className="rm-donor-row-ico">📱</span>
                  <div className="rm-donor-row-body"><div className="rm-donor-row-label">Phone</div><div className="rm-donor-row-val"><a href={`tel:${item.user.phone}`}>{item.user.phone}</a></div></div>
                </div></>)}
              </div>
              <div className="rm-donor-section">
                <div className="rm-donor-section-title">Pickup Location</div>
                <div className="rm-donor-row"><span className="rm-donor-row-ico">🗺️</span>
                  <div className="rm-donor-row-body"><div className="rm-donor-row-label">Address</div><div className="rm-donor-row-val">{result.location || item.location || "—"}</div></div>
                </div>
              </div>
              {item.user?.phone && <a className="rm-call-action" href={`tel:${item.user.phone}`}>📞 Call Donor — {item.user.phone}</a>}
              <button className="rm-dir-action" onClick={() => getDirections(result.location || item.location)}>📍 Get Directions</button>
              <button className="rm-done-btn" onClick={onClose}>Done</button>
            </div>
          ) : (
            <>
              <div className="rm-top">
                <div className="rm-food-name">{item.foodItem}</div>
                <div className="rm-food-meta">
                  <span className="rm-tag rm-tag-g">🧺 {item.foodQuantity}g</span>
                  <span className="rm-tag rm-tag-s">📍 {item.location || "—"}</span>
                  {item.foodReason && <span className="rm-tag rm-tag-d">💬 {item.foodReason}</span>}
                </div>
                {spotsInfo && (
                  <div className="rm-spots">
                    <div className="rm-spots-row"><span>Availability</span><span>{spotsInfo.spotsLeft <= 0 ? "FULL" : `${spotsInfo.spotsLeft} of ${spotsInfo.total} left`}</span></div>
                    <div className="rm-spots-track"><div className="rm-spots-fill" style={{ width: `${Math.min(100, Math.round((spotsInfo.reserved / spotsInfo.total) * 100))}%` }} /></div>
                  </div>
                )}
              </div>
              <div className="rm-body">
                <div className="rm-section-title">Your Details</div>
                {error && <div className="rm-error"><span>⚠️</span> {error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="rm-field"><label className="rm-label">Full Name *</label><input className="rm-inp" type="text" placeholder="Your full name" value={form.name} onChange={set("name")} required minLength={2} /></div>
                  <div className="rm-field"><label className="rm-label">Phone Number *</label><input className="rm-inp" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} required /></div>
                  <div className="rm-field"><label className="rm-label">Email Address *</label><input className="rm-inp" type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} required /></div>
                  <div className="rm-qty-note"><span>📦</span><span>Each person can reserve <strong>1 unit</strong>.</span></div>
                  <div className="rm-section-title">Rules</div>
                  <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.75, marginBottom: 20 }}>
                    • Reserve <strong>one item per listing</strong><br />
                    • <strong>6-character pickup code</strong> generated<br />
                    • Code valid for <strong>24 hours</strong> only
                  </div>
                  <button type="submit" className="rm-submit" disabled={loading}>
                    {loading ? <><div className="rm-spin" />Reserving…</> : "🎯 Reserve This Food"}
                  </button>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Filter + Sort ── */
const applyFiltersAndSort = (items, filters, spotsMap, sliderKm, distanceCache, userCoords) => {
  let out = [...items].filter(Boolean);
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    out = out.filter(i =>
      (i.foodItem || "").toLowerCase().includes(q) ||
      (i.location || "").toLowerCase().includes(q) ||
      (i.user?.username || "").toLowerCase().includes(q)
    );
  }
  if (filters.status === "available") out = out.filter(i => !i.approved && !spotsMap[i._id]?.isSoldOut);
  if (filters.status === "soldout")   out = out.filter(i => i.approved || spotsMap[i._id]?.isSoldOut);
  if (filters.donor)                  out = out.filter(i => (i.user?.username || "") === filters.donor);
  if (filters.dateFrom)               out = out.filter(i => new Date(i.foodWasteDate) >= new Date(filters.dateFrom));
  if (filters.dateTo)                 out = out.filter(i => new Date(i.foodWasteDate) <= new Date(filters.dateTo));
  if (filters.maxQty < 10000)         out = out.filter(i => Number(i.foodQuantity) <= filters.maxQty);
  if (sliderKm > 0 && userCoords) {
    out = out.filter(i => { const d = distanceCache[i._id]; if (d === undefined) return true; return d <= sliderKm; });
  }
  switch (filters.sort) {
    case "date-asc":  out.sort((a, b) => new Date(a.foodWasteDate) - new Date(b.foodWasteDate)); break;
    case "date-desc": out.sort((a, b) => new Date(b.foodWasteDate) - new Date(a.foodWasteDate)); break;
    case "qty-desc":  out.sort((a, b) => Number(b.foodQuantity) - Number(a.foodQuantity)); break;
    case "qty-asc":   out.sort((a, b) => Number(a.foodQuantity) - Number(b.foodQuantity)); break;
    case "name-asc":  out.sort((a, b) => (a.foodItem || "").localeCompare(b.foodItem || "")); break;
    case "dist-asc":  if (userCoords) out.sort((a, b) => (distanceCache[a._id] ?? 9999) - (distanceCache[b._id] ?? 9999)); break;
    default: break;
  }
  return out;
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const Display = ({ newWaste }) => {
  const [wasteData,     setWasteData]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [view,          setView]          = useState("grid");
  const [spotsMap,      setSpotsMap]      = useState({});
  const [modalItem,     setModalItem]     = useState(null);
  const [filters,       setFilters]       = useState({ search: "", sort: "date-desc", status: "all", donor: "", dateFrom: "", dateTo: "", maxQty: 10000 });
  const [userCoords,    setUserCoords]    = useState(null);
  const [locText,       setLocText]       = useState("");
  const [locAcc,        setLocAcc]        = useState(null);
  const [locating,      setLocating]      = useState(false);
  const [distanceCache, setDistanceCache] = useState({});
  const [geocoding,     setGeocoding]     = useState(false);
  const [sliderKm,      setSliderKm]      = useState(0);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon, accuracy } = pos.coords;
        setUserCoords({ lat, lon }); setLocAcc(accuracy);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=14`, { headers: { "Accept-Language": "en-IN,en" } });
          const data = await res.json();
          const a = data.address || {};
          const parts = [a.road || a.pedestrian, a.suburb || a.neighbourhood, a.city || a.town || a.village, a.state].filter(Boolean);
          setLocText(parts.join(", ") || data.display_name?.split(",").slice(0, 3).join(", "));
        } catch { setLocText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`); }
        setLocating(false); setSliderKm(25);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  const computeDistances = useCallback(async (items, coords) => {
    if (!coords) return;
    setGeocoding(true);
    const newCache = { ...distanceCache };
    for (const item of items) {
      if (newCache[item._id] !== undefined || !item.location) continue;
      const geo = await geocodeLocation(item.location);
      if (geo) newCache[item._id] = haversine(coords.lat, coords.lon, geo.lat, geo.lon);
    }
    setDistanceCache({ ...newCache }); setGeocoding(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCoords]);

  useEffect(() => { if (userCoords && wasteData.length > 0) computeDistances(wasteData, userCoords); }, [userCoords, wasteData, computeDistances]);

  const fetchAllSpots = useCallback(async (items) => {
    const available = items.filter(i => !i.approved);
    const results = await Promise.allSettled(
      available.map(i => axios.get(`${API_URL}/api/reservations/food/${i._id}`).then(r => ({ id: i._id, ...r.data })).catch(() => null))
    );
    const map = {};
    results.forEach(r => { if (r.status === "fulfilled" && r.value) map[r.value.id] = r.value; });
    setSpotsMap(map);
  }, []);

  const handleReserved = useCallback(async (itemId) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/reservations/food/${itemId}`);
      setSpotsMap(prev => ({ ...prev, [itemId]: { id: itemId, ...data } }));
      if (data.isSoldOut) setWasteData(prev => prev.map(i => i._id === itemId ? { ...i, approved: true } : i));
    } catch { /* ignore */ }
  }, []);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      let arr = [];
      try {
        const { data } = await axios.get(`${API_URL}/api/waste/feed`, { headers: { Authorization: `Bearer ${token}` } });
        arr = Array.isArray(data) ? data : data?.data ?? [];
      } catch (feedErr) {
        if (feedErr?.response?.status === 404) {
          const { data } = await axios.get(`${API_URL}/api/waste`, { headers: { Authorization: `Bearer ${token}` } });
          arr = Array.isArray(data) ? data : data?.data ?? [];
        } else throw feedErr;
      }
      const items = arr.filter(Boolean);
      setWasteData(items); setError(""); fetchAllSpots(items);
    } catch { setError("Failed to load records. Please try again."); }
    finally { setLoading(false); }
  }, [fetchAllSpots]);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);
  useEffect(() => { if (newWaste) setWasteData(p => [newWaste, ...p]); }, [newWaste]);

  const isNew = item => (Date.now() - new Date(item.createdAt || item.foodWasteDate).getTime()) < 48 * 60 * 60 * 1000;
  const filtered     = applyFiltersAndSort(wasteData, filters, spotsMap, sliderKm, distanceCache, userCoords);
  const totalWasted  = wasteData.reduce((s, i) => s + Number(i.foodQuantity || 0), 0);
  const uniqueDonors = new Set(wasteData.map(i => i.user?._id).filter(Boolean)).size;

  const cv = {
    hidden:  { opacity: 0, y: 20 },
    visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
  };

  if (!localStorage.getItem("token")) return (
    <><style>{css}</style>
      <div className="d-gate"><div className="d-gate-ico">🔒</div><div className="d-gate-txt">Please log in</div></div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      {modalItem && (
        <ReservationModal item={modalItem} spotsInfo={spotsMap[modalItem._id] || null}
          onClose={() => setModalItem(null)} onReserved={handleReserved} />
      )}
      <div className="d-root">

        {/* HERO */}
        <div className="d-hero">
          <div className="d-hero-inner">
            <div>
              <div className="d-hero-tag">Community Feed</div>
              <h1 className="d-hero-title">All <em>Donations</em><br />From Everyone</h1>
              <p className="d-hero-sub">Browse available food donations in your community. Reserve yours before it's gone.</p>
            </div>
            <div className="d-hero-num">{wasteData.length}</div>
          </div>
        </div>

        {/* LOCATION */}
        <LocationCard userCoords={userCoords} locText={locText} locAcc={locAcc} locating={locating}
          onLocate={detectLocation} sliderKm={sliderKm} setSliderKm={setSliderKm}
          distanceCache={distanceCache} allItems={wasteData} spotsMap={spotsMap} geocoding={geocoding} />

        {/* STATS */}
        {!loading && !error && (
          <div className="d-stats">
            {[
              { n: wasteData.length,                          l: "Total Entries" },
              { n: filtered.length,                           l: "Showing" },
              { n: `${(totalWasted / 1000).toFixed(1)}kg`,   l: "Total Food" },
              { n: uniqueDonors,                              l: "Donors" },
            ].map(({ n, l }, i) => (
              <motion.div key={l} className="d-stat"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <div className="d-stat-n">{n}</div>
                <div className="d-stat-l">{l}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* FILTER BAR */}
        {!loading && !error && (
          <FilterBar items={wasteData} filters={filters} setFilters={setFilters}
            view={view} setView={setView} resultCount={filtered.length} userCoords={userCoords} />
        )}

        {/* CONTENT */}
        {loading ? (
          <div className="d-loading"><div className="d-spinner" />Loading community feed…</div>
        ) : error ? (
          <div className="d-empty"><div className="d-empty-ico">⚠️</div><div className="d-empty-title d-err">Something went wrong</div><div>{error}</div></div>
        ) : (
          <div className="d-grid-wrap">
            <AnimatePresence mode="wait">

              {/* ── GRID ── */}
              {view === "grid" && (
                <motion.div key="grid" className="d-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {filtered.length === 0 ? (
                    <div className="df-no-results" style={{ gridColumn: "1/-1" }}>
                      <div className="df-no-results-ico">📍</div>
                      <div className="df-no-results-title">{sliderKm > 0 && userCoords ? `No donations within ${sliderKm} km` : "No results match your filters"}</div>
                      <div className="df-no-results-sub">{sliderKm > 0 && userCoords ? "Expand the slider or tap All locations to see everything." : "Try adjusting or clearing your active filters."}</div>
                      {sliderKm > 0 && userCoords
                        ? <button className="df-no-results-btn" onClick={() => setSliderKm(0)}>🌍 Show all locations</button>
                        : <button className="df-no-results-btn" onClick={() => setFilters(f => ({ ...f, search: "", status: "all", donor: "", dateFrom: "", dateTo: "", maxQty: 10000 }))}>Clear filters</button>
                      }
                    </div>
                  ) : filtered.map((item, i) => {
                    const spots     = spotsMap[item._id];
                    const isSoldOut = item.approved || spots?.isSoldOut;
                    const dist      = distanceCache[item._id];
                    const showHot   = !isSoldOut && spots && spots.spotsLeft <= 3 && spots.spotsLeft > 0;
                    const showNew   = !isSoldOut && isNew(item);
                    const donorInit = (item.user?.username || "?")[0].toUpperCase();

                    return (
                      <motion.div key={item._id || i} className={`d-card${isSoldOut ? " sold-card" : ""}`}
                        custom={i} variants={cv} initial="hidden" animate="visible">

                        {/* image */}
                        <div className="d-img-wrap">
                          {isSoldOut && <div className="d-sold-overlay"><div className="d-sold-stamp">Sold Out</div></div>}
                          <SmartImg image={item.image} alt={item.foodItem} />
                          <div className="d-img-overlay" />
                          {!isSoldOut && <div className="d-img-qty-badge">{item.foodQuantity}g</div>}
                          {showNew && !showHot && <div className="d-img-new-badge">New</div>}
                          {showHot && <div className="d-img-hot-badge">🔥 {spots.spotsLeft} left!</div>}
                        </div>

                        {/* body */}
                        <div className="d-card-body">
                          <div className="d-card-name">{item.foodItem}</div>

                          {/* donor */}
                          <div className="d-donor">
                            <div className="d-donor-avatar">{donorInit}</div>
                            <div className="d-donor-info">
                              <div className="d-donor-name">{item.user?.username || "Anonymous"}</div>
                              <div className="d-donor-meta">
                                {item.user?.userId && <span className="d-donor-uid">{item.user.userId}</span>}
                                {item.user?.phone && <a className="d-donor-phone" href={`tel:${item.user.phone}`} onClick={e => e.stopPropagation()}>📱 {item.user.phone}</a>}
                              </div>
                            </div>
                          </div>

                          {/* rows */}
                          <div className="d-rows">
                            <div className="d-row"><span className="d-lbl">Reason</span><span className="d-val">{item.foodReason || "—"}</span></div>
                            <div className="d-row"><span className="d-lbl">Date</span><span className="d-val">{new Date(item.foodWasteDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></div>
                            <div className="d-row"><span className="d-lbl">Location</span><span className="d-val">{item.location || "—"}</span></div>
                            {dist !== undefined && (
                              <div className="d-row">
                                <span className="d-lbl">Distance</span>
                                <span className="d-dist-badge">📍 {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}</span>
                              </div>
                            )}
                          </div>

                          {!isSoldOut && spots && <SpotsBar reserved={spots.reserved} total={spots.total} />}
                        </div>

                        {/* footer */}
                        <div className="d-footer">
                          {isSoldOut ? (
                            <div className="d-sold-btn">✕ Sold Out — Fully Reserved</div>
                          ) : (
                            <>
                              <button className="d-reserve-btn" onClick={() => setModalItem(item)}>🎯 Reserve This Food</button>
                              <div className="d-footer-row">
                                {item.user?.phone && <a className="d-call-btn" href={`tel:${item.user.phone}`} onClick={e => e.stopPropagation()}>📞 Call</a>}
                                <button className="d-dir-btn" onClick={() => getDirections(item.location)}>📍 Directions</button>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* ── LIST ── */}
              {view === "list" && (
                <motion.div key="list" className="d-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {filtered.length === 0 ? (
                    <div className="df-no-results">
                      <div className="df-no-results-ico">📍</div>
                      <div className="df-no-results-title">{sliderKm > 0 && userCoords ? `No donations within ${sliderKm} km` : "No results match your filters"}</div>
                      <div className="df-no-results-sub">{sliderKm > 0 && userCoords ? "Expand the slider or tap All locations." : "Try adjusting or clearing your active filters."}</div>
                      {sliderKm > 0 && userCoords
                        ? <button className="df-no-results-btn" onClick={() => setSliderKm(0)}>🌍 Show all locations</button>
                        : <button className="df-no-results-btn" onClick={() => setFilters(f => ({ ...f, search: "", status: "all", donor: "", dateFrom: "", dateTo: "", maxQty: 10000 }))}>Clear filters</button>
                      }
                    </div>
                  ) : filtered.map((item, i) => {
                    const spots     = spotsMap[item._id];
                    const isSoldOut = item.approved || spots?.isSoldOut;
                    const dist      = distanceCache[item._id];
                    return (
                      <motion.div key={item._id || i} className="d-lcard" custom={i} variants={cv} initial="hidden" animate="visible"
                        style={isSoldOut ? { opacity: 0.55 } : {}}>
                        <div className="d-lcard-img">
                          <ListImg image={item.image} alt={item.foodItem} />
                          {isSoldOut && <div style={{ position: "absolute", inset: 0, background: "rgba(7,9,10,0.78)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "var(--rose)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "var(--f-mono)" }}>SOLD</div>}
                        </div>
                        <div className="d-lcard-body">
                          <div className="d-lcard-name">{item.foodItem}</div>
                          <div className="d-lcard-meta">
                            <span className="d-ltag">🧺 {item.foodQuantity}g</span>
                            <span className="d-ltag">📍 {(item.location || "—").slice(0, 28)}{(item.location || "").length > 28 ? "…" : ""}</span>
                            <span className="d-ltag">📅 {new Date(item.foodWasteDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                            <span className="d-donor-ltag">👤 {item.user?.username || "Anon"}</span>
                            {item.user?.phone && <a className="d-phone-ltag" href={`tel:${item.user.phone}`}>📱 {item.user.phone}</a>}
                            {spots && !isSoldOut && <span className="d-ltag" style={{ color: spots.spotsLeft <= 3 ? "var(--amber)" : "var(--t2)" }}>👥 {spots.spotsLeft} left</span>}
                            {dist !== undefined && <span className="d-ltag" style={{ color: "var(--sky)" }}>📍 {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}</span>}
                            {isSoldOut && <span className="d-sold-ltag">✕ Sold Out</span>}
                          </div>
                        </div>
                        <div className="d-lcard-acts">
                          {isSoldOut
                            ? <span className="d-sold-ltag" style={{ padding: "8px 14px" }}>✕ Sold Out</span>
                            : <><button className="d-lbtn" onClick={() => setModalItem(item)}>🎯 Reserve</button>
                              <button className="d-lbtn-dir" onClick={() => getDirections(item.location)}>📍</button></>
                          }
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default Display;