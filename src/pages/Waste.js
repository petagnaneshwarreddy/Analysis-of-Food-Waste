import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { CircularProgress } from "@mui/material";

const API_URL    = process.env.REACT_APP_API_URL;
const RENDER_URL = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  :root {
    --bg:        #080b09;
    --s1:        #0e1410;
    --s2:        #141d16;
    --s3:        #1a261c;
    --border:    rgba(255,255,255,0.06);
    --border2:   rgba(255,255,255,0.11);
    --lime:      #a3e635;
    --lime-dim:  rgba(163,230,53,0.10);
    --lime-mid:  rgba(163,230,53,0.20);
    --red:       #fb7185;
    --red-dim:   rgba(251,113,133,0.10);
    --gold:      #fbbf24;
    --gold-dim:  rgba(251,191,36,0.10);
    --sky:       #38bdf8;
    --sky-dim:   rgba(56,189,248,0.10);
    --text:      #e8f0e9;
    --t2:        rgba(232,240,233,0.50);
    --t3:        rgba(232,240,233,0.22);
    --t4:        rgba(232,240,233,0.07);
    --r:         16px;
    --r-sm:      9px;
    --sh:        0 4px 28px rgba(0,0,0,0.50);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .w-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Instrument Sans', sans-serif;
    color: var(--text);
    padding-bottom: 100px;
  }

  /* ── HERO ── */
  .w-hero {
    position: relative; overflow: hidden;
    padding: 52px 32px 44px;
    background: linear-gradient(145deg, #0c1f0e 0%, #080b09 65%);
    border-bottom: 1px solid var(--border);
  }
  .w-hero::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 55% 70% at 95% 20%, rgba(163,230,53,0.09) 0%, transparent 60%),
      radial-gradient(ellipse 35% 50% at 5% 90%,  rgba(163,230,53,0.04) 0%, transparent 60%);
  }
  .w-hero-inner {
    max-width: 1120px; margin: 0 auto;
    display: flex; align-items: center;
    justify-content: space-between; gap: 20px; flex-wrap: wrap;
    position: relative; z-index: 1;
  }
  .w-hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: var(--lime); border: 1px solid rgba(163,230,53,0.3);
    background: var(--lime-dim); padding: 5px 14px; border-radius: 20px; margin-bottom: 16px;
  }
  .w-hero-badge::before {
    content: ''; width: 5px; height: 5px; border-radius: 50%;
    background: var(--lime); box-shadow: 0 0 8px var(--lime);
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .w-hero-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(32px, 5vw, 56px); font-weight: 900;
    line-height: 1.05; letter-spacing: -1.5px; color: var(--text);
  }
  .w-hero-title em { font-style: italic; color: var(--lime); }
  .w-hero-right { text-align: right; flex-shrink: 0; }
  .w-hero-count {
    font-family: 'Fraunces', serif;
    font-size: clamp(60px, 10vw, 96px); font-weight: 900;
    color: var(--t4); line-height: 1; letter-spacing: -6px; user-select: none;
  }
  .w-hero-label {
    font-size: 10px; font-weight: 600; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--t3); margin-top: 4px;
  }

  /* ── BODY GRID ── */
  .w-body {
    max-width: 1120px; margin: 28px auto 0; padding: 0 20px;
    display: grid; grid-template-columns: 380px 1fr;
    gap: 20px; align-items: start;
  }
  @media (max-width: 960px) {
    .w-body { grid-template-columns: 1fr; padding: 0 14px; margin-top: 20px; }
  }

  /* ── CARDS ── */
  .w-card {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r); padding: 26px; box-shadow: var(--sh);
  }
  .w-card-head {
    font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700;
    color: var(--text); margin-bottom: 22px;
    display: flex; align-items: center; gap: 10px;
  }
  .w-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--lime); box-shadow: 0 0 10px var(--lime); flex-shrink: 0;
  }

  /* ── FORM ── */
  .w-form { display: flex; flex-direction: column; gap: 14px; }
  .w-field { display: flex; flex-direction: column; gap: 6px; }
  .w-label {
    font-size: 10px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--t3);
  }
  .w-input {
    width: 100%; padding: 11px 14px;
    font-family: 'Instrument Sans', sans-serif; font-size: 14px; color: var(--text);
    background: var(--s2); border: 1px solid var(--border);
    border-radius: var(--r-sm); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none;
  }
  .w-input::placeholder { color: var(--t3); }
  .w-input:focus { border-color: var(--lime); box-shadow: 0 0 0 3px rgba(163,230,53,0.10); }
  .w-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
  .w-input[type="file"] { padding: 9px 14px; cursor: pointer; font-size: 13px; color: var(--t2); }
  .w-input[type="file"]::file-selector-button {
    font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 700;
    background: var(--lime-dim); color: var(--lime);
    border: 1px solid rgba(163,230,53,0.25); padding: 5px 12px;
    border-radius: 6px; cursor: pointer; margin-right: 10px;
  }

  .w-btn {
    margin-top: 4px; padding: 14px; background: var(--lime); color: #0c1a06;
    font-family: 'Instrument Sans', sans-serif; font-size: 14px; font-weight: 700;
    letter-spacing: 0.3px; border: none; border-radius: var(--r-sm); cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; min-height: 48px;
    box-shadow: 0 4px 20px rgba(163,230,53,0.30);
  }
  .w-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .w-btn:disabled { opacity: 0.4; cursor: default; box-shadow: none; }

  .w-msg {
    padding: 11px 14px; border-radius: var(--r-sm);
    font-size: 13px; font-weight: 500; text-align: center;
  }
  .w-msg.ok  { background: var(--lime-dim); color: var(--lime); border: 1px solid rgba(163,230,53,0.20); }
  .w-msg.err { background: var(--red-dim);  color: var(--red);  border: 1px solid rgba(251,113,133,0.20); }

  /* ════════════════════════════════
     LOCATION FIELD — complete rebuild
  ════════════════════════════════ */
  .loc-wrap { position: relative; }

  /* GPS + Manual row */
  .loc-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 8px;
    width: 100%;
  }
  .loc-input-wrap {
    flex: 1 1 auto;
    min-width: 0;
    position: relative;
  }
  .loc-input-wrap .w-input { width: 100%; padding-right: 32px; }

  /* small clear x button inside input */
  .loc-clear {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: var(--t3); font-size: 14px;
    cursor: pointer; line-height: 1; padding: 2px 4px;
    transition: color 0.15s;
  }
  .loc-clear:hover { color: var(--text); }

  /* Auto button - fixed 88px, never grows */
  .loc-auto-btn {
    flex: 0 0 88px;
    width: 88px;
    display: inline-flex; align-items: center; justify-content: center; gap: 5px;
    padding: 0 8px; min-height: 42px;
    background: var(--lime-dim); color: var(--lime);
    border: 1px solid rgba(163,230,53,0.28); border-radius: var(--r-sm);
    font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; white-space: nowrap;
    transition: background 0.2s, border-color 0.2s; outline: none;
  }
  .loc-auto-btn:hover:not(:disabled) { background: var(--lime-mid); border-color: rgba(163,230,53,0.5); }
  .loc-auto-btn:disabled { opacity: 0.5; cursor: default; }
  .loc-auto-btn.detecting { border-color: rgba(163,230,53,0.5); }

  /* spinner inside button */
  .loc-spin {
    width: 12px; height: 12px; flex-shrink: 0;
    border: 2px solid rgba(163,230,53,0.25);
    border-top-color: var(--lime); border-radius: 50%;
    animation: locspin 0.7s linear infinite;
  }
  @keyframes locspin { to { transform: rotate(360deg); } }

  /* dropdown */
  .loc-drop {
    position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 300;
    background: var(--s1); border: 1px solid var(--border2);
    border-radius: var(--r-sm); box-shadow: 0 16px 48px rgba(0,0,0,0.70);
    overflow: hidden; max-height: 280px; overflow-y: auto;
  }
  .loc-drop::-webkit-scrollbar { width: 4px; }
  .loc-drop::-webkit-scrollbar-track { background: var(--s2); }
  .loc-drop::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  .loc-drop-head {
    padding: 8px 14px; font-size: 10px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--t3); background: var(--s2);
    border-bottom: 1px solid var(--border);
  }

  .loc-opt {
    padding: 11px 14px; cursor: pointer;
    display: flex; align-items: flex-start; gap: 11px;
    border-bottom: 1px solid var(--border);
    transition: background 0.12s;
  }
  .loc-opt:last-child { border-bottom: none; }
  .loc-opt:hover { background: var(--s2); }
  .loc-opt-ico { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .loc-opt-body { min-width: 0; }
  .loc-opt-main { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .loc-opt-sub  { font-size: 11px; color: var(--t2); line-height: 1.4;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* searching / empty states */
  .loc-state {
    padding: 16px 14px; text-align: center; color: var(--t2); font-size: 13px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  /* status line below field */
  .loc-status {
    margin-top: 6px; font-size: 12px; font-weight: 500;
    display: flex; align-items: flex-start; gap: 7px; line-height: 1.5;
  }
  .loc-status.ok  { color: var(--lime); }
  .loc-status.err { color: var(--red); }
  .loc-status.info { color: var(--t2); }

  /* GPS accuracy badge */
  .loc-acc {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; letter-spacing: 1px;
    padding: 2px 8px; border-radius: 20px; margin-left: 6px;
  }
  .loc-acc.high { background: var(--lime-dim); color: var(--lime); border: 1px solid rgba(163,230,53,0.25); }
  .loc-acc.mid  { background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(251,191,36,0.25); }
  .loc-acc.low  { background: var(--red-dim);  color: var(--red);  border: 1px solid rgba(251,113,133,0.25); }

  /* ── TABLE ── */
  .w-tcard {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r); box-shadow: var(--sh); overflow: hidden;
  }
  .w-tcard-top {
    padding: 20px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; flex-wrap: wrap;
  }
  .w-pill {
    background: var(--lime-dim); color: var(--lime);
    border: 1px solid rgba(163,230,53,0.20); border-radius: 20px;
    padding: 3px 12px; font-size: 12px; font-weight: 600;
  }
  .w-tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table.w-tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 580px; }
  .w-tbl th {
    padding: 11px 16px; text-align: left; font-size: 10px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3);
    background: var(--s2); border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  .w-tbl td {
    padding: 13px 16px; color: var(--text);
    border-bottom: 1px solid var(--border); vertical-align: middle;
  }
  .w-tbl tbody tr:last-child td { border-bottom: none; }
  .w-tbl tbody tr { transition: background 0.12s; }
  .w-tbl tbody tr:hover td { background: var(--s2); }
  .w-tbl tr.sold-row td { opacity: 0.55; }

  .w-item-cell { display: flex; flex-direction: column; gap: 5px; }
  .w-name { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; }
  .w-qty {
    display: inline-block; background: var(--lime-dim); color: var(--lime);
    border: 1px solid rgba(163,230,53,0.18); border-radius: 20px;
    padding: 3px 10px; font-size: 12px; font-weight: 700; white-space: nowrap;
  }
  .w-sub { color: var(--t2); font-size: 12.5px; }
  .w-thumb { width: 42px; height: 42px; border-radius: var(--r-sm); object-fit: cover; border: 1px solid var(--border); }
  .w-no-img {
    width: 42px; height: 42px; border-radius: var(--r-sm);
    background: var(--s2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; color: var(--t3);
  }
  .w-sold-badge {
    display: inline-block; background: var(--gold-dim); color: var(--gold);
    border: 1px solid rgba(251,191,36,0.25); border-radius: 20px;
    padding: 2px 9px; font-size: 10px; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase; width: fit-content;
  }
  .w-acts { display: flex; gap: 6px; }
  .w-act {
    padding: 6px 12px; font-family: 'Instrument Sans', sans-serif; font-size: 12px;
    font-weight: 700; border-radius: 6px; cursor: pointer; white-space: nowrap;
    border: none; transition: opacity 0.18s, transform 0.12s;
  }
  .w-act:hover:not(:disabled) { opacity: 0.78; transform: translateY(-1px); }
  .w-del  { background: var(--red-dim);  color: var(--red);  border: 1px solid rgba(251,113,133,0.20); }
  .w-appr { background: var(--lime-dim); color: var(--lime); border: 1px solid rgba(163,230,53,0.20); }

  /* ════════════════════════════════
     NEW — SPOTS PROGRESS CELL
  ════════════════════════════════ */
  .w-spots-cell { display: flex; flex-direction: column; gap: 6px; min-width: 130px; }
  .w-spots-nums { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .w-spots-tag { font-size: 11px; font-weight: 700; border-radius: 20px; padding: 2px 9px; white-space: nowrap; }
  .w-spots-tag.picked    { background: rgba(96,165,250,0.1); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); }
  .w-spots-tag.remaining { background: var(--lime-dim); color: var(--lime); border: 1px solid rgba(163,230,53,0.2); }
  .w-spots-tag.full      { background: var(--red-dim);  color: var(--red);  border: 1px solid rgba(251,113,133,0.2); }
  .w-spots-bar      { height: 4px; border-radius: 99px; background: rgba(255,255,255,0.07); overflow: hidden; }
  .w-spots-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--lime), #7ec820); transition: width 0.5s; }

  /* ════════════════════════════════
     NEW — INLINE PICKUP VERIFIER
  ════════════════════════════════ */
  .pv-inline { margin-top: 8px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
  .pv-inline-inp {
    width: 110px; padding: 6px 10px;
    font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 4px; text-transform: uppercase;
    color: var(--lime); background: rgba(163,230,53,0.06);
    border: 1px solid rgba(163,230,53,0.20); border-radius: 6px; outline: none;
    transition: border-color 0.2s;
  }
  .pv-inline-inp::placeholder { color: var(--t3); letter-spacing: 1px; font-weight: 400; font-size: 11px; }
  .pv-inline-inp:focus { border-color: var(--lime); }
  .pv-inline-btn {
    padding: 6px 12px; background: var(--lime); color: #0c1a06;
    font-family: 'Instrument Sans', sans-serif; font-size: 11px; font-weight: 700;
    border: none; border-radius: 6px; cursor: pointer; white-space: nowrap;
    transition: opacity 0.2s; display: flex; align-items: center; gap: 5px;
  }
  .pv-inline-btn:hover:not(:disabled) { opacity: 0.82; }
  .pv-inline-btn:disabled { opacity: 0.4; cursor: default; }
  .pv-inline-spin {
    width: 12px; height: 12px;
    border: 2px solid rgba(12,26,6,0.25); border-top-color: #0c1a06;
    border-radius: 50%; animation: pvspin 0.65s linear infinite;
  }
  @keyframes pvspin { to { transform: rotate(360deg); } }
  .pv-inline-result { font-size: 11px; font-weight: 600; padding: 4px 9px; border-radius: 6px; }
  .pv-inline-result.ok   { background: var(--lime-dim); color: var(--lime); }
  .pv-inline-result.err  { background: var(--red-dim);  color: var(--red); }
  .pv-inline-result.warn { background: var(--gold-dim); color: var(--gold); }

  /* COLLECTOR DETAILS CARD — shown after successful verify */
  .col-card { margin-top: 10px; background: rgba(163,230,53,0.05); border: 1px solid rgba(163,230,53,0.18); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 7px; }
  .col-card-title { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(163,230,53,0.55); margin-bottom: 2px; }
  .col-row { display: flex; align-items: center; gap: 8px; }
  .col-ico { font-size: 13px; flex-shrink: 0; }
  .col-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--t3); min-width: 50px; }
  .col-val { font-size: 12px; font-weight: 600; color: var(--text); }
  .col-val a { color: var(--sky); text-decoration: none; }
  .col-val a:hover { text-decoration: underline; }
  .col-divider { height: 1px; background: rgba(163,230,53,0.10); margin: 1px 0; }
  .col-spots { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 20px; margin-top: 2px; }
  .col-spots.ok   { background: var(--lime-dim); color: var(--lime); border: 1px solid rgba(163,230,53,0.2); }
  .col-spots.warn { background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(251,191,36,0.2); }
  .col-spots.full { background: var(--red-dim);  color: var(--red);  border: 1px solid rgba(251,113,133,0.2); }

  /* mobile cards */
  .w-mcards { display: none; flex-direction: column; gap: 12px; padding: 16px; }
  @media (max-width: 640px) { .w-tbl-wrap { display: none; } .w-mcards { display: flex; } }
  .w-mcard {
    background: var(--s2); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 14px 16px;
    display: flex; gap: 14px; align-items: flex-start;
  }
  .w-mcard-body { flex: 1; min-width: 0; }
  .w-mcard-name {
    font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700;
    color: var(--text); margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .w-mcard-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .w-mtag {
    font-size: 11px; font-weight: 500; color: var(--t2);
    background: var(--s1); border: 1px solid var(--border);
    border-radius: 20px; padding: 2px 9px;
  }
  .w-mcard-reason { font-size: 12px; color: var(--t2); margin-bottom: 12px; font-style: italic; }
  .w-mcard-acts   { display: flex; gap: 8px; }

  /* empty / log */
  .w-empty { padding: 60px 24px; text-align: center; }
  .w-empty-ico { font-size: 44px; margin-bottom: 12px; }
  .w-empty-txt { color: var(--t2); font-size: 14px; }

  .w-log { max-width: 1120px; margin: 20px auto 0; padding: 0 20px; }
  .w-log-inner {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r); padding: 20px 24px; box-shadow: var(--sh);
  }
  .w-log-list { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
  .w-log-item {
    padding: 10px 14px; background: var(--lime-dim);
    border: 1px solid rgba(163,230,53,0.15); border-radius: var(--r-sm);
    font-size: 13px; font-weight: 500; color: var(--lime);
  }

  /* login */
  .w-login {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 14px; background: var(--bg);
  }
  .w-login-ico { font-size: 52px; }
  .w-login-txt { font-family: 'Fraunces', serif; font-size: 22px; color: var(--t2); }

  /* ════════════════════════════════
     PAGE TAB SWITCHER
  ════════════════════════════════ */
  .wt-tabs { max-width: 1120px; margin: 28px auto 0; padding: 0 20px; display: flex; gap: 4px; }
  .wt-tab { display: flex; align-items: center; gap: 8px; padding: 11px 22px; font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 700; border-radius: var(--r-sm); border: 1px solid var(--border); background: var(--s1); color: var(--t2); cursor: pointer; transition: all 0.18s; }
  .wt-tab:hover { border-color: var(--border2); color: var(--text); }
  .wt-tab.active-log  { background: var(--lime-dim); color: var(--lime); border-color: rgba(163,230,53,0.3); box-shadow: 0 0 0 3px rgba(163,230,53,0.07); }
  .wt-tab.active-verify { background: rgba(56,189,248,0.10); color: var(--sky); border-color: rgba(56,189,248,0.3); box-shadow: 0 0 0 3px rgba(56,189,248,0.07); }
  .wt-tab-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .active-log    .wt-tab-dot { background: var(--lime); box-shadow: 0 0 6px var(--lime); }
  .active-verify .wt-tab-dot { background: var(--sky);  box-shadow: 0 0 6px var(--sky);  }

  /* ════════════════════════════════
     VERIFY PICKUP PAGE
  ════════════════════════════════ */
  .vp-wrap { max-width: 560px; margin: 48px auto 0; padding: 0 20px; }
  .vp-card { background: var(--s1); border: 1px solid rgba(56,189,248,0.18); border-radius: var(--r); padding: 36px 32px; display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; box-shadow: 0 8px 40px rgba(0,0,0,0.40); }
  .vp-icon { font-size: 48px; }
  .vp-title { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 900; color: var(--text); letter-spacing: -0.5px; }
  .vp-title em { font-style: italic; color: var(--sky); }
  .vp-sub { font-size: 14px; color: var(--t2); line-height: 1.6; max-width: 380px; }
  .vp-inp { width: 100%; padding: 18px 20px; font-family: 'Instrument Sans', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 10px; text-align: center; text-transform: uppercase; color: var(--sky); background: rgba(56,189,248,0.06); border: 2px solid rgba(56,189,248,0.25); border-radius: var(--r-sm); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .vp-inp::placeholder { color: var(--t3); letter-spacing: 4px; font-size: 16px; font-weight: 400; }
  .vp-inp:focus { border-color: var(--sky); box-shadow: 0 0 0 4px rgba(56,189,248,0.10); }
  .vp-btn { width: 100%; padding: 16px; background: var(--sky); color: #041922; font-family: 'Instrument Sans', sans-serif; font-size: 15px; font-weight: 700; border: none; border-radius: var(--r-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 20px rgba(56,189,248,0.30); }
  .vp-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .vp-btn:disabled { opacity: 0.35; cursor: default; transform: none; box-shadow: none; }
  .vp-spin { width: 18px; height: 18px; border: 2.5px solid rgba(4,25,34,0.25); border-top-color: #041922; border-radius: 50%; animation: locspin 0.65s linear infinite; }
  .vp-result { width: 100%; padding: 16px 18px; border-radius: var(--r-sm); font-size: 13px; font-weight: 500; text-align: left; }
  .vp-result.ok   { background: var(--lime-dim); border: 1px solid rgba(163,230,53,0.22); color: var(--lime); }
  .vp-result.err  { background: var(--red-dim);  border: 1px solid rgba(251,113,133,0.22); color: var(--red); }
  .vp-result.warn { background: var(--gold-dim); border: 1px solid rgba(251,191,36,0.22);  color: var(--gold); }
  .vp-result-title { font-weight: 700; font-size: 14px; margin-bottom: 4px; }
  .vp-result-sub   { font-size: 12px; opacity: 0.85; line-height: 1.5; }
  .vp-result-detail { margin-top: 10px; padding: 10px 12px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 8px; font-size: 12px; color: var(--t2); display: flex; flex-direction: column; gap: 4px; }
  .vp-result-detail strong { color: var(--text); }
  .vp-hint { font-size: 12px; color: var(--t3); line-height: 1.6; }

  /* ════════════════════════════════
     RESEND CODE FLOW (inside Verify Pickup tab)
  ════════════════════════════════ */
  .vp-divider { width: 100%; display: flex; align-items: center; gap: 10px; }
  .vp-divider::before, .vp-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
  .vp-divider-txt { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); white-space: nowrap; }

  .vp-resend-btn { width: 100%; padding: 12px 16px; background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.22); color: var(--gold); font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 700; border-radius: var(--r-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.18s; }
  .vp-resend-btn:hover { background: rgba(251,191,36,0.14); }

  /* resend modal overlay */
  .rs2-overlay { position: fixed; inset: 0; z-index: 3000; background: rgba(0,0,0,0.82); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .rs2-box { background: #0e1410; border: 1px solid rgba(255,255,255,0.11); border-radius: 20px; width: 100%; max-width: 460px; padding: 28px; display: flex; flex-direction: column; gap: 16px; position: relative; box-shadow: 0 32px 80px rgba(0,0,0,0.80); animation: rs2-pop 0.22s cubic-bezier(0.34,1.56,0.64,1); max-height: 90vh; overflow-y: auto; }
  @keyframes rs2-pop { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .rs2-close { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: var(--t2); font-size: 13px; cursor: pointer; transition: background 0.15s; }
  .rs2-close:hover { background: rgba(255,255,255,0.12); color: var(--text); }
  .rs2-step-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); display: flex; align-items: center; gap: 7px; }
  .rs2-step-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 6px var(--gold); }
  .rs2-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 900; color: var(--text); letter-spacing: -0.3px; }
  .rs2-sub { font-size: 13px; color: var(--t2); line-height: 1.6; }
  .rs2-field { display: flex; flex-direction: column; gap: 5px; }
  .rs2-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); }
  .rs2-inp { width: 100%; padding: 11px 14px; font-family: 'Instrument Sans', sans-serif; font-size: 14px; color: var(--text); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .rs2-inp::placeholder { color: var(--t3); }
  .rs2-inp:focus { border-color: rgba(251,191,36,0.5); box-shadow: 0 0 0 3px rgba(251,191,36,0.08); }
  .rs2-search-btn { width: 100%; padding: 12px; background: var(--gold); color: #1a0e00; font-family: 'Instrument Sans', sans-serif; font-size: 14px; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s; min-height: 44px; box-shadow: 0 4px 16px rgba(251,191,36,0.22); }
  .rs2-search-btn:hover:not(:disabled) { opacity: 0.88; }
  .rs2-search-btn:disabled { opacity: 0.35; cursor: default; box-shadow: none; }
  .rs2-spin { width: 14px; height: 14px; border: 2px solid rgba(26,14,0,0.2); border-top-color: #1a0e00; border-radius: 50%; animation: locspin 0.65s linear infinite; }

  /* user result card */
  .rs2-user-card { background: rgba(163,230,53,0.05); border: 1px solid rgba(163,230,53,0.18); border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
  .rs2-user-head { display: flex; align-items: center; gap: 10px; }
  .rs2-user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--lime), #7ec820); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: #0c1a06; flex-shrink: 0; }
  .rs2-user-info { flex: 1; min-width: 0; }
  .rs2-user-name { font-size: 14px; font-weight: 700; color: var(--text); }
  .rs2-user-meta { font-size: 11px; color: var(--t2); margin-top: 1px; }

  /* reservation items list */
  .rs2-items-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); }
  .rs2-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--s2); border: 1px solid var(--border); border-radius: 9px; cursor: pointer; transition: border-color 0.15s, background 0.15s; }
  .rs2-item:hover { border-color: var(--border2); background: var(--s3); }
  .rs2-item.selected { border-color: rgba(251,191,36,0.45); background: rgba(251,191,36,0.06); }
  .rs2-item-ico { font-size: 18px; flex-shrink: 0; }
  .rs2-item-body { flex: 1; min-width: 0; }
  .rs2-item-name { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
  .rs2-item-sub { font-size: 11px; color: var(--t2); }
  .rs2-item-check { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
  .rs2-item.selected .rs2-item-check { background: var(--gold); border-color: var(--gold); color: #1a0e00; font-size: 10px; font-weight: 800; }

  .rs2-send-btn { width: 100%; padding: 13px; background: var(--lime); color: #0c1a06; font-family: 'Instrument Sans', sans-serif; font-size: 14px; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s; min-height: 46px; box-shadow: 0 4px 20px rgba(163,230,53,0.25); }
  .rs2-send-btn:hover:not(:disabled) { opacity: 0.88; }
  .rs2-send-btn:disabled { opacity: 0.35; cursor: default; box-shadow: none; }

  .rs2-result { padding: 11px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; text-align: center; line-height: 1.5; }
  .rs2-result.ok  { background: var(--lime-dim); border: 1px solid rgba(163,230,53,0.20); color: var(--lime); }
  .rs2-result.err { background: var(--red-dim);  border: 1px solid rgba(251,113,133,0.20); color: var(--red); }
  .rs2-no-items { padding: 20px; text-align: center; color: var(--t2); font-size: 13px; }
`;

/* ─────────────────────────────────────────────────────────────
   SMART PHOTO
───────────────────────────────────────────────────────────── */
const Photo = ({ item, size = 42 }) => {
  const paths = item.image?.startsWith("http")
    ? [item.image]
    : [
        `${API_URL}/uploads/${item.image}`,
        `${API_URL}/api/uploads/${item.image}`,
        `${RENDER_URL}/uploads/${item.image}`,
        `${RENDER_URL}/api/uploads/${item.image}`,
      ].filter(Boolean);

  const [idx, setIdx]       = React.useState(0);
  const [broken, setBroken] = React.useState(false);

  if (!item.image || broken)
    return <div className="w-no-img" style={{ width: size, height: size }}>📷</div>;

  return (
    <img
      src={paths[idx]} alt={item.foodItem} className="w-thumb"
      style={{ width: size, height: size }}
      onError={() => { if (idx + 1 < paths.length) setIdx(idx + 1); else setBroken(true); }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────
   LOCATION FIELD — complete rebuild
   Features:
   • GPS auto-detect with HIGH accuracy (enableHighAccuracy: true)
   • Full reverse geocoding → exact address (house + street + city + state + country)
   • Manual type-ahead with Nominatim (debounced 350ms)
   • Shows GPS accuracy in metres
   • Shows full formatted address as status
   • Clear button inside input
   • Keyboard accessible (Enter to select first result)
───────────────────────────────────────────────────────────── */
const LocationField = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = React.useState([]);
  const [showDrop,    setShowDrop]    = React.useState(false);
  const [searching,   setSearching]   = React.useState(false);
  const [detecting,   setDetecting]   = React.useState(false);
  const [status,      setStatus]      = React.useState(null); // { type, text, acc? }
  const debounceRef  = React.useRef(null);
  const wrapRef      = React.useRef(null);
  const inputRef     = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Build the best possible address string from Nominatim address object ── */
  const buildAddress = (addr, displayName) => {
    if (!addr) return displayName?.split(",").slice(0, 3).join(", ").trim() || "";

    // Try to build: [house+road], city/town, state, country
    const road     = [addr.house_number, addr.road || addr.pedestrian || addr.footway]
                       .filter(Boolean).join(" ");
    const locality = addr.suburb || addr.neighbourhood || addr.quarter || "";
    const city     = addr.city || addr.town || addr.village || addr.county
                     || addr.state_district || "";
    const state    = addr.state || "";
    const country  = addr.country || "";

    const parts = [road, locality, city, state, country].filter(Boolean);
    // Remove duplicates keeping order
    const seen = new Set();
    const unique = parts.filter(p => { if (seen.has(p)) return false; seen.add(p); return true; });
    return unique.join(", ");
  };

  /* ── Type-ahead search ── */
  const handleInput = (e) => {
    const v = e.target.value;
    onChange(v);
    setStatus(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.trim().length < 2) { setSuggestions([]); setShowDrop(false); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      setShowDrop(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search` +
          `?q=${encodeURIComponent(v)}` +
          `&format=json&limit=7&addressdetails=1&namedetails=1`,
          { headers: { "Accept-Language": "en-IN,en" } }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  /* ── Select a suggestion ── */
  const selectSuggestion = (item) => {
    const full = buildAddress(item.address, item.display_name);
    onChange(full);
    setSuggestions([]);
    setShowDrop(false);
    setStatus({ type: "ok", text: `📍 ${full}` });
    inputRef.current?.blur();
  };

  /* ── Keyboard: Enter selects first result ── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      e.preventDefault();
      selectSuggestion(suggestions[0]);
    }
    if (e.key === "Escape") { setShowDrop(false); }
  };

  /* ── GPS auto-detect with HIGH accuracy ── */
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setStatus({ type: "err", text: "Geolocation is not supported by your browser." });
      return;
    }
    setDetecting(true);
    setStatus({ type: "info", text: "📡 Requesting your precise location…" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const accLabel = accuracy <= 20 ? "high" : accuracy <= 100 ? "mid" : "low";
        const accText  = `±${Math.round(accuracy)}m`;

        setStatus({ type: "info", text: `📡 Got GPS fix (${accText}), resolving address…`, acc: { label: accLabel, text: accText } });

        try {
          // Use zoom=18 for street-level detail
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse` +
            `?lat=${latitude}&lon=${longitude}` +
            `&format=json&addressdetails=1&zoom=18`,
            { headers: { "Accept-Language": "en-IN,en" } }
          );
          const data = await res.json();

          if (data.error) throw new Error(data.error);

          const full = buildAddress(data.address, data.display_name);
          onChange(full);
          setStatus({
            type: "ok",
            text: full,
            acc:  { label: accLabel, text: accText },
          });
        } catch (err) {
          // Fallback: just use coords as location
          const fallback = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          onChange(fallback);
          setStatus({ type: "err", text: `Could not resolve address. Using coordinates: ${fallback}` });
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        setDetecting(false);
        const msgs = {
          1: "Location permission denied. Please allow location access in your browser.",
          2: "Location unavailable. Try again or type manually.",
          3: "Location request timed out. Try again or type manually.",
        };
        setStatus({ type: "err", text: msgs[err.code] || "Could not get location." });
      },
      {
        enableHighAccuracy: true,  // ← GPS-level accuracy
        timeout:            15000,
        maximumAge:         0,     // ← always fresh, no cached position
      }
    );
  };

  /* ── Icon for suggestion type ── */
  const suggestionIcon = (item) => {
    const t = (item.type || item.class || "").toLowerCase();
    const c = (item.class || "").toLowerCase();
    if (["city", "town", "village", "municipality", "administrative"].includes(t)) return "🏙️";
    if (c === "amenity" && ["restaurant","cafe","fast_food","food_court"].includes(t)) return "🍽️";
    if (c === "amenity" && ["hospital","clinic","pharmacy"].includes(t)) return "🏥";
    if (c === "amenity" && ["school","university","college"].includes(t)) return "🎓";
    if (c === "highway") return "🛣️";
    if (c === "railway") return "🚂";
    if (["house","building","residential"].includes(t)) return "🏠";
    if (c === "natural") return "🌿";
    return "📍";
  };

  /* ── Get the primary display name from a suggestion ── */
  const primaryName = (item) => {
    const a = item.address || {};
    return a.city || a.town || a.village || a.county
        || a.road || a.pedestrian
        || item.namedetails?.name
        || item.display_name.split(",")[0].trim();
  };

  return (
    <div className="loc-wrap" ref={wrapRef}>
      <div className="loc-row">

        {/* Text input */}
        <div className="loc-input-wrap">
          <input
            ref={inputRef}
            className="w-input"
            type="text"
            value={value}
            placeholder="Type city, street, or click Auto…"
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setShowDrop(true); }}
            autoComplete="off"
            required
          />
          {value && (
            <button
              type="button"
              className="loc-clear"
              onClick={() => { onChange(""); setSuggestions([]); setShowDrop(false); setStatus(null); inputRef.current?.focus(); }}
              title="Clear"
            >
              ✕
            </button>
          )}

          {/* Suggestions dropdown */}
          {showDrop && (
            <div className="loc-drop">
              <div className="loc-drop-head">Search Results</div>
              {searching ? (
                <div className="loc-state">
                  <div className="loc-spin" /> Searching…
                </div>
              ) : suggestions.length === 0 ? (
                <div className="loc-state">No results found — try a different term</div>
              ) : (
                suggestions.map((s) => (
                  <div
                    key={s.place_id}
                    className="loc-opt"
                    onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
                  >
                    <span className="loc-opt-ico">{suggestionIcon(s)}</span>
                    <div className="loc-opt-body">
                      <div className="loc-opt-main">{primaryName(s)}</div>
                      <div className="loc-opt-sub">{buildAddress(s.address, s.display_name)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Auto / GPS button */}
        <button
          type="button"
          className={`loc-auto-btn${detecting ? " detecting" : ""}`}
          onClick={detectLocation}
          disabled={detecting}
          title="Detect my exact location using GPS"
        >
          {detecting
            ? <><div className="loc-spin" /> Locating…</>
            : <><span>📍</span> Auto</>
          }
        </button>
      </div>

      {/* Status line */}
      {status && (
        <div className={`loc-status ${status.type}`}>
          <span style={{ lineHeight: 1.5 }}>
            {status.type === "ok"   ? "✓ " : ""}
            {status.type === "err"  ? "✕ " : ""}
            {status.text}
          </span>
          {status.acc && (
            <span className={`loc-acc ${status.acc.label}`}>
              GPS {status.acc.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   NEW: SPOTS PROGRESS CELL
   Shows how many reservations have been picked up vs total.
   pickedUp increments each time a code is verified by the donor.
───────────────────────────────────────────────────────────── */
const SpotsCell = ({ spots }) => {
  if (!spots) return <span className="w-sub">—</span>;
  const { total = 0, pickedUp = 0 } = spots;
  const remaining = Math.max(0, total - pickedUp);
  const pct = total > 0 ? Math.min(100, Math.round((pickedUp / total) * 100)) : 0;
  return (
    <div className="w-spots-cell">
      <div className="w-spots-nums">
        <span className="w-spots-tag picked">✓ {pickedUp} picked up</span>
        <span className={`w-spots-tag ${remaining === 0 ? "full" : "remaining"}`}>
          {remaining} left
        </span>
      </div>
      <div className="w-spots-bar">
        <div className="w-spots-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   NEW: INLINE PICKUP CODE VERIFIER
   Appears per-row. Donor enters the 6-char code shown by the
   collector → POST /api/reservations/verify-pickup → backend
   marks reservation as picked_up, decrements available spots,
   and if all picked up auto-sets item approved = true (Sold Out).
───────────────────────────────────────────────────────────── */
const InlinePickupVerifier = ({ itemId, onVerified }) => {
  const [code,      setCode]      = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [collector, setCollector] = useState(null);

  const verify = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) return;
    setLoading(true);
    setError(null);
    setCollector(null);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/api/reservations/verify-pickup`,
        { code: trimmed, foodItemId: itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCollector(data);
      setCode("");
      if (onVerified) onVerified({ ...data, itemId });
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Invalid or expired code.";
      if (status === 409) setError({ type: "warn", msg: "⚠ Already used" });
      else if (status === 410) setError({ type: "warn", msg: "⚠ Code expired" });
      else setError({ type: "err", msg: `✕ ${msg}` });
    } finally { setLoading(false); }
  };

  const spotsClass = collector
    ? (collector.isSoldOut ? "full" : (collector.spotsLeft ?? 0) <= 3 ? "warn" : "ok")
    : "ok";

  /* After success — show compact confirmed card */
  if (collector) {
    return (
      <div className="col-card">
        <div className="col-card-title">✓ Pickup Confirmed</div>
        {collector.reserverName && (
          <div className="col-row">
            <span className="col-ico">👤</span>
            <span className="col-label">Name</span>
            <span className="col-val">{collector.reserverName}</span>
          </div>
        )}
        {collector.reserverPhone && (
          <>
            <div className="col-divider" />
            <div className="col-row">
              <span className="col-ico">📱</span>
              <span className="col-label">Phone</span>
              <span className="col-val">
                <a href={`tel:${collector.reserverPhone}`}>{collector.reserverPhone}</a>
              </span>
            </div>
          </>
        )}
        {collector.foodItem && (
          <>
            <div className="col-divider" />
            <div className="col-row">
              <span className="col-ico">🍽️</span>
              <span className="col-label">Item</span>
              <span className="col-val">{collector.foodItem}</span>
            </div>
          </>
        )}
        {collector.pickedUpAt && (
          <>
            <div className="col-divider" />
            <div className="col-row">
              <span className="col-ico">🕐</span>
              <span className="col-label">Time</span>
              <span className="col-val">
                {new Date(collector.pickedUpAt).toLocaleString("en-IN", {
                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </span>
            </div>
          </>
        )}
        <div className="col-divider" />
        <span className={`col-spots ${spotsClass}`}>
          {collector.isSoldOut
            ? "🔴 Fully Collected — Sold Out"
            : `👥 ${collector.spotsLeft} spot${collector.spotsLeft !== 1 ? "s" : ""} remaining`}
        </span>
        {/* Only show "verify another" if not sold out */}
        {!collector.isSoldOut && (
          <button
            style={{ marginTop: 4, background: "none", border: "none", color: "var(--t3)", fontSize: 11, cursor: "pointer", textAlign: "left", padding: 0 }}
            onClick={() => { setCollector(null); setError(null); setCode(""); }}
          >
            ↩ Verify another code
          </button>
        )}
      </div>
    );
  }

  /* Default — show code input */
  return (
    <div>
      <div className="pv-inline">
        <input
          className="pv-inline-inp"
          type="text"
          maxLength={6}
          placeholder="Code…"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(null); }}
          onKeyDown={e => { if (e.key === "Enter") verify(); }}
        />
        <button
          className="pv-inline-btn"
          onClick={verify}
          disabled={loading || code.trim().length < 4}
        >
          {loading ? <><div className="pv-inline-spin" /> Checking</> : "✓ Verify"}
        </button>
      </div>
      {error && (
        <span className={`pv-inline-result ${error.type}`} style={{ marginTop: 6, display: "block" }}>
          {error.msg}
        </span>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   RESEND CODE MODAL
   Collector forgot code → enter User ID or phone →
   backend finds their reservations → select item →
   send notification to donor's bell with the code.
───────────────────────────────────────────────────────────── */
const ResendCodeModal = ({ onClose }) => {
  const [step,         setStep]         = useState("search");   // "search" | "select" | "done"
  const [query,        setQuery]        = useState("");
  const [searching,    setSearching]    = useState(false);
  const [searchErr,    setSearchErr]    = useState("");
  const [foundUser,    setFoundUser]    = useState(null);       // { name, phone, userId, reservations[] }
  const [reservations, setReservations] = useState([]);
  const [selected,     setSelected]     = useState(null);       // reservation _id
  const [sending,      setSending]      = useState(false);
  const [sendResult,   setSendResult]   = useState(null);

  const handleSearch = async () => {
    const q = query.trim();
    if (q.length < 3) return;
    setSearching(true); setSearchErr(""); setFoundUser(null); setReservations([]);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${API_URL}/api/reservations/search-by-user?q=${encodeURIComponent(q)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data || !data.reservations?.length) {
        setSearchErr("No active reservations found for that User ID or phone number.");
        return;
      }
      setFoundUser(data);
      setReservations(data.reservations);
      setStep("select");
    } catch (err) {
      setSearchErr(err?.response?.data?.error || "User not found. Check the User ID or phone number.");
    } finally { setSearching(false); }
  };

  const handleSend = async () => {
    if (!selected) return;
    setSending(true); setSendResult(null);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/api/reservations/resend-code-by-id`,
        { reservationId: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSendResult({ type: "ok", msg: data.message || "✓ Notification sent! The donor will see the code in their bell." });
      setStep("done");
    } catch (err) {
      setSendResult({ type: "err", msg: err?.response?.data?.error || "Failed to send notification. Please try again." });
    } finally { setSending(false); }
  };

  const selectedRes = reservations.find(r => r._id === selected);

  return (
    <div className="rs2-overlay" onClick={e => { if (e.target.classList.contains("rs2-overlay")) onClose(); }}>
      <div className="rs2-box">
        <button className="rs2-close" onClick={onClose}>✕</button>

        {/* ── STEP 1: SEARCH ── */}
        {step === "search" && (
          <>
            <div className="rs2-step-label"><span className="rs2-step-dot"/>Step 1 of 2</div>
            <div className="rs2-title">🔍 Find Your Reservation</div>
            <div className="rs2-sub">
              Enter your <strong style={{color:"var(--text)"}}>User ID</strong> (e.g. PXXX7) or registered <strong style={{color:"var(--text)"}}>phone number</strong> to look up your active reservations.
            </div>
            <div className="rs2-field">
              <label className="rs2-label">User ID or Phone Number</label>
              <input
                className="rs2-inp"
                type="text"
                placeholder="e.g. PXXX7 or 9876543210"
                value={query}
                onChange={e => { setQuery(e.target.value); setSearchErr(""); }}
                onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
                autoFocus
              />
            </div>
            {searchErr && (
              <div className="rs2-result err">{searchErr}</div>
            )}
            <button
              className="rs2-search-btn"
              onClick={handleSearch}
              disabled={searching || query.trim().length < 3}
            >
              {searching ? <><div className="rs2-spin" /> Searching…</> : "🔍 Find My Reservations"}
            </button>
          </>
        )}

        {/* ── STEP 2: SELECT ITEM ── */}
        {step === "select" && foundUser && (
          <>
            <div className="rs2-step-label"><span className="rs2-step-dot"/>Step 2 of 2</div>
            <div className="rs2-title">📦 Select Your Item</div>

            {/* Found user card */}
            <div className="rs2-user-card">
              <div className="rs2-user-head">
                <div className="rs2-user-avatar">
                  {(foundUser.name || "?")[0].toUpperCase()}
                </div>
                <div className="rs2-user-info">
                  <div className="rs2-user-name">{foundUser.name || "Unknown"}</div>
                  <div className="rs2-user-meta">
                    {foundUser.userId && <span>ID: {foundUser.userId}</span>}
                    {foundUser.phone  && <span> · 📱 {foundUser.phone}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="rs2-items-label">
              Your active reservations ({reservations.length})
            </div>

            {reservations.length === 0 ? (
              <div className="rs2-no-items">No active reservations found.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {reservations.map(res => (
                  <div
                    key={res._id}
                    className={`rs2-item ${selected === res._id ? "selected" : ""}`}
                    onClick={() => setSelected(res._id)}
                  >
                    <span className="rs2-item-ico">🍽️</span>
                    <div className="rs2-item-body">
                      <div className="rs2-item-name">{res.foodItem || "Food Item"}</div>
                      <div className="rs2-item-sub">
                        Reserved: {res.reserverName}
                        {res.codeExpiresAt && ` · Expires: ${new Date(res.codeExpiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`}
                      </div>
                    </div>
                    <div className="rs2-item-check">
                      {selected === res._id ? "✓" : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sendResult && <div className={`rs2-result ${sendResult.type}`}>{sendResult.msg}</div>}

            <button
              className="rs2-send-btn"
              onClick={handleSend}
              disabled={!selected || sending}
            >
              {sending
                ? <><div className="rs2-spin" style={{borderTopColor:"#0c1a06"}} /> Sending notification…</>
                : "📨 Send Code to Donor's Bell"
              }
            </button>

            <button
              style={{ background:"none", border:"none", color:"var(--t3)", fontSize:12, cursor:"pointer", textAlign:"center", padding:"4px 0" }}
              onClick={() => { setStep("search"); setFoundUser(null); setReservations([]); setSelected(null); setSendResult(null); }}
            >
              ← Search again
            </button>
          </>
        )}

        {/* ── STEP 3: DONE ── */}
        {step === "done" && (
          <>
            <div style={{ textAlign:"center", fontSize: 48 }}>✅</div>
            <div className="rs2-title" style={{ textAlign:"center" }}>Notification Sent!</div>
            <div className="rs2-sub" style={{ textAlign:"center" }}>
              The donor has been notified with your pickup code for <strong style={{color:"var(--text)"}}>"{selectedRes?.foodItem}"</strong>.
              Ask them to open their notification bell and read you the code.
            </div>
            <div className="rs2-result ok">
              🔔 Code sent to donor's notification bell. They can tap it to copy and read it to you.
            </div>
            <button className="rs2-send-btn" onClick={onClose}>Done</button>
          </>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   VERIFY PICKUP PAGE
   Donor enters collector's 6-char code → backend verifies →
   spots decrement → auto sold out when all picked up.
   Also has a "Forgot Code?" button that opens the resend flow.
───────────────────────────────────────────────────────────── */
const VerifyPickupPage = ({ onVerified }) => {
  const [code,       setCode]       = useState("");
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [showResend, setShowResend] = useState(false);

  const handleVerify = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) return;
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/api/reservations/verify-pickup`,
        { code: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult({ type: "ok", title: "Pickup Confirmed!", sub: `${data.foodItem || "Item"} handed over successfully.`, data });
      setCode("");
      if (onVerified) onVerified(data);
    } catch (err) {
      const msg    = err?.response?.data?.error || err?.response?.data?.message || "Invalid or expired code.";
      const status = err?.response?.status;
      if (status === 409) setResult({ type: "warn", title: "Already Used", sub: "This code has already been verified for pickup." });
      else if (status === 410) setResult({ type: "warn", title: "Code Expired", sub: "This pickup code has expired (24h limit)." });
      else setResult({ type: "err", title: "Verification Failed", sub: msg });
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Resend modal */}
      {showResend && <ResendCodeModal onClose={() => setShowResend(false)} />}

      <div className="vp-wrap">
        <div className="vp-card">
          <div className="vp-icon">🎟️</div>
          <div className="vp-title">Verify <em>Pickup</em></div>
          <div className="vp-sub">
            Ask the collector to show their 6-character pickup code, then enter it below to confirm handover.
          </div>

          <input
            className="vp-inp"
            type="text"
            maxLength={6}
            placeholder="A B C 1 2 3"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setResult(null); }}
            onKeyDown={e => { if (e.key === "Enter") handleVerify(); }}
            autoFocus
          />

          <button className="vp-btn" onClick={handleVerify} disabled={loading || code.trim().length < 4}>
            {loading ? <><div className="vp-spin" /> Verifying code…</> : <>✓ Confirm Pickup</>}
          </button>

          {result && (
            <div className={`vp-result ${result.type}`}>
              <div className="vp-result-title">
                {result.type === "ok" ? "✓ " : result.type === "warn" ? "⚠ " : "✕ "}{result.title}
              </div>
              <div className="vp-result-sub">{result.sub}</div>
              {result.type === "ok" && result.data && (
                <div className="vp-result-detail">
                  {result.data.reserverName  && <span>👤 Collector: <strong>{result.data.reserverName}</strong></span>}
                  {result.data.reserverPhone && <span>📱 Phone: <strong>{result.data.reserverPhone}</strong></span>}
                  {result.data.foodItem      && <span>🍽️ Item: <strong>{result.data.foodItem}</strong></span>}
                  {result.data.spotsLeft !== undefined && (
                    <span>👥 Spots left: <strong style={{ color: result.data.isSoldOut ? "var(--red)" : result.data.spotsLeft <= 3 ? "var(--gold)" : "var(--lime)" }}>
                      {result.data.isSoldOut ? "None — Sold Out!" : result.data.spotsLeft}
                    </strong></span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="vp-divider">
            <span className="vp-divider-txt">or</span>
          </div>

          {/* Forgot code button */}
          <button className="vp-resend-btn" onClick={() => setShowResend(true)}>
            🔑 Collector forgot their code?
          </button>

          <div className="vp-hint">
            🔒 Codes are single-use and expire after 24 hours.<br />
            Each verified pickup decrements the available spots count.
          </div>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN WASTE COMPONENT
───────────────────────────────────────────────────────────── */
const Waste = () => {
  const { loggedIn } = useContext(AuthContext);

  const [foodItem,      setFoodItem]      = useState("");
  const [foodQuantity,  setFoodQuantity]  = useState("");
  const [foodReason,    setFoodReason]    = useState("");
  const [foodWasteDate, setFoodWasteDate] = useState("");
  const [location,      setLocation]      = useState("");
  const [image,         setImage]         = useState(null);
  const [wasteData,     setWasteData]     = useState([]);
  const [spotsMap,      setSpotsMap]      = useState({}); // NEW: { [itemId]: { total, reserved, pickedUp, isSoldOut } }
  const [loading,       setLoading]       = useState(false);
  const [message,       setMessage]       = useState("");
  const [messageType,   setMessageType]   = useState("ok");

  const [wtab,          setWtab]          = useState("log"); // "log" | "verify"

  /* fetchAllSpots declared first — fetchWasteData depends on it */
  const fetchAllSpots = useCallback(async (items) => {
    const results = await Promise.allSettled(
      items.map(i =>
        axios.get(`${API_URL}/api/reservations/food/${i._id}`)
          .then(r => ({ id: i._id, ...r.data }))
          .catch(() => null)
      )
    );
    const map = {};
    results.forEach(r => {
      if (r.status === "fulfilled" && r.value) map[r.value.id] = r.value;
    });
    setSpotsMap(map);
  }, []);

  const fetchWasteData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res  = await axios.get(`${API_URL}/api/waste`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      const items = data.filter(Boolean);
      setWasteData(items);
      fetchAllSpots(items);
    } catch (e) { console.error(e); }
  }, [fetchAllSpots]);

  useEffect(() => { if (loggedIn) fetchWasteData(); }, [loggedIn, fetchWasteData]);

  /* Called after a pickup code is successfully verified — refreshes spots, auto-marks sold out */
  const handlePickupVerified = async (data) => {
    const itemId = data.itemId;
    if (!itemId) return;
    try {
      const { data: fresh } = await axios.get(`${API_URL}/api/reservations/food/${itemId}`);
      setSpotsMap(prev => ({ ...prev, [itemId]: { id: itemId, ...fresh } }));
      if (fresh.isSoldOut) {
        setWasteData(prev => prev.map(i => i._id === itemId ? { ...i, approved: true } : i));
      }
    } catch { /* ignore */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) { setMessage("You must be logged in."); setMessageType("err"); setLoading(false); return; }

      const fd = new FormData();
      fd.append("foodItem",      foodItem);
      fd.append("foodQuantity",  foodQuantity);
      fd.append("foodReason",    foodReason);
      fd.append("foodWasteDate", foodWasteDate);
      fd.append("location",      location);
      if (image) fd.append("image", image);

      const res = await axios.post(`${API_URL}/api/waste`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setMessage("Entry added successfully!"); setMessageType("ok");
      const item = res.data;
      if (item?._id) {
        setWasteData(p => [item, ...p]);
        fetchAllSpots([item]); // NEW: load spots for the brand new item
      } else await fetchWasteData();

      // Reset form
      setFoodItem(""); setFoodQuantity(""); setFoodReason("");
      setFoodWasteDate(""); setLocation(""); setImage(null);
    } catch {
      setMessage("Failed to add entry. Please try again.");
      setMessageType("err");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/waste/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWasteData(p => p.filter(i => i._id !== id));
      setSpotsMap(p => { const n = { ...p }; delete n[id]; return n; }); // NEW: clean up
    } catch (e) {
      const s = e?.response?.status;
      if (s === 404) setWasteData(p => p.filter(i => i._id !== id));
      else alert(`Delete failed (${s ?? "network error"})`);
    }
  };

  // Approve removed — items auto-approve via pickup verification

  if (!loggedIn) return (
    <>
      <style>{css}</style>
      <div className="w-login">
        <div className="w-login-ico">🔒</div>
        <div className="w-login-txt">Please log in to continue</div>
      </div>
    </>
  );

  const fields = [
    { label: "Food Item",        val: foodItem,      set: setFoodItem,      type: "text",   ph: "e.g. Rice, Bread, Biryani…" },
    { label: "Quantity (Quantity)", val: foodQuantity,  set: setFoodQuantity,  type: "number", ph: "e.g. 250" },
    { label: "Reason for Waste", val: foodReason,    set: setFoodReason,    type: "text",   ph: "e.g. Expired, Excess, Overcooked…" },
    { label: "Date",             val: foodWasteDate, set: setFoodWasteDate, type: "date",   ph: "" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="w-root">

        {/* Hero */}
        <div className="w-hero">
          <div className="w-hero-inner">
            <div>
              <div className="w-hero-badge">Food Tracker</div>
              <h1 className="w-hero-title">
                {wtab === "log" ? <>Log Your <em>Food Waste</em></> : <>Verify <em>Pickup</em></>}
              </h1>
            </div>
            <div className="w-hero-right">
              <div className="w-hero-count">{wasteData.length}</div>
              <div className="w-hero-label">Total Entries</div>
            </div>
          </div>
        </div>

        {/* ── TAB SWITCHER ── */}
        <div className="wt-tabs">
          <button
            className={`wt-tab ${wtab === "log" ? "active-log" : ""}`}
            onClick={() => setWtab("log")}
          >
            <span className="wt-tab-dot" />
            📋 Log Food Waste
          </button>
          <button
            className={`wt-tab ${wtab === "verify" ? "active-verify" : ""}`}
            onClick={() => setWtab("verify")}
          >
            <span className="wt-tab-dot" />
            🎟️ Verify Pickup
          </button>
        </div>

        {/* ── VERIFY PICKUP TAB ── */}
        {wtab === "verify" && (
          <VerifyPickupPage onVerified={handlePickupVerified} />
        )}

        {/* ── LOG TAB ── */}
        {wtab === "log" && (
        <div className="w-body">

          {/* Form card */}
          <div className="w-card">
            <div className="w-card-head"><span className="w-dot" />Add Waste Entry</div>
            <form onSubmit={handleSubmit} className="w-form">

              {fields.map(({ label, val, set, type, ph }) => (
                <div className="w-field" key={label}>
                  <label className="w-label">{label}</label>
                  <input
                    className="w-input" type={type} value={val}
                    placeholder={ph} onChange={e => set(e.target.value)} required
                  />
                </div>
              ))}

              {/* Location with GPS */}
              <div className="w-field">
                <label className="w-label">Location</label>
                <LocationField value={location} onChange={setLocation} />
              </div>

              {/* Photo */}
              <div className="w-field">
                <label className="w-label">Photo (optional)</label>
                <input
                  className="w-input" type="file" accept="image/*"
                  onChange={e => setImage(e.target.files[0])}
                />
              </div>

              <button type="submit" className="w-btn" disabled={loading}>
                {loading
                  ? <CircularProgress size={20} style={{ color: "#0c1a06" }} />
                  : "Add Entry →"
                }
              </button>

              {message && <div className={`w-msg ${messageType}`}>{message}</div>}
            </form>
          </div>

          {/* Records table */}
          <div className="w-tcard">
            <div className="w-tcard-top">
              <div className="w-card-head" style={{ margin: 0 }}>
                <span className="w-dot" />Waste Records
              </div>
              {wasteData.length > 0 && <span className="w-pill">{wasteData.length} entries</span>}
            </div>

            {wasteData.length === 0 ? (
              <div className="w-empty">
                <div className="w-empty-ico">🗒️</div>
                <div className="w-empty-txt">No waste records yet. Add your first entry.</div>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="w-tbl-wrap">
                  <table className="w-tbl">
                    <thead>
                      <tr>
                        {/* NEW: "Pickup" column added between Location and Photo */}
                        {["Item", "Qty", "Reason", "Date", "Location", "Pickup", "Photo", "Delete"].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {wasteData.filter(Boolean).map(item => {
                        const spots = spotsMap[item._id]; // NEW
                        return (
                          <tr key={item._id} className={item.approved ? "sold-row" : ""}>
                            <td>
                              <div className="w-item-cell">
                                <span className="w-name">{item.foodItem}</span>
                                {item.approved && <span className="w-sold-badge">Sold Out</span>}
                              </div>
                            </td>
                            <td><span className="w-qty">{item.foodQuantity}g</span></td>
                            <td><span className="w-sub">{item.foodReason || "—"}</span></td>
                            <td><span className="w-sub">{new Date(item.foodWasteDate).toLocaleDateString()}</span></td>
                            <td>
                              <span className="w-sub" style={{ maxWidth: 160, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.location}>
                                {item.location}
                              </span>
                            </td>

                            {/* ── Pickup progress + verifier ── */}
                            <td>
                              <SpotsCell spots={spots} />
                              {!item.approved && !(spots?.isSoldOut) && (
                                <InlinePickupVerifier
                                  itemId={item._id}
                                  onVerified={handlePickupVerified}
                                />
                              )}
                              {(item.approved || spots?.isSoldOut) && (
                                <span className="w-sold-badge" style={{ marginTop: 6, display: "inline-block" }}>
                                  ✓ All Collected
                                </span>
                              )}
                            </td>

                            <td><Photo item={item} /></td>
                            <td>
                              <div className="w-acts">
                                <button className="w-act w-del" onClick={() => handleDelete(item._id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="w-mcards">
                  {wasteData.filter(Boolean).map(item => {
                    const spots = spotsMap[item._id]; // NEW
                    return (
                      <div className="w-mcard" key={item._id} style={item.approved ? { opacity: 0.65 } : {}}>
                        <Photo item={item} size={52} />
                        <div className="w-mcard-body">
                          <div className="w-mcard-name">
                            {item.foodItem}
                            {item.approved && <span className="w-sold-badge">Sold Out</span>}
                          </div>
                          <div className="w-mcard-meta">
                            <span className="w-qty">{item.foodQuantity}g</span>
                            <span className="w-mtag">📅 {new Date(item.foodWasteDate).toLocaleDateString()}</span>
                            <span className="w-mtag">📍 {item.location}</span>
                          </div>
                          <div className="w-mcard-reason">"{item.foodReason}"</div>

                          {/* NEW: spots progress on mobile */}
                          {spots && <SpotsCell spots={spots} />}

                          <div className="w-mcard-acts">
                            <button className="w-act w-del" onClick={() => handleDelete(item._id)}>Delete</button>
                          </div>

                          {/* Inline verifier on mobile — hidden when sold out */}
                          {!item.approved && !(spots?.isSoldOut) && (
                            <div style={{ marginTop: 10 }}>
                              <InlinePickupVerifier
                                itemId={item._id}
                                onVerified={handlePickupVerified}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        )} {/* end log tab */}



      </div>
    </>
  );
};

export default Waste;