import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL    = process.env.REACT_APP_API_URL;
const RENDER_URL = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  :root {
    --bg:       #080b09; --s1: #0e1410; --s2: #141d16; --s3: #1a261c;
    --border:   rgba(255,255,255,0.06); --border2: rgba(255,255,255,0.11);
    --lime:     #a3e635; --lime-dim: rgba(163,230,53,0.10); --lime-mid: rgba(163,230,53,0.20);
    --red:      #fb7185; --red-dim:  rgba(251,113,133,0.10);
    --gold:     #fbbf24; --gold-dim: rgba(251,191,36,0.10);
    --sky:      #38bdf8; --sky-dim:  rgba(56,189,248,0.10);
    --text:     #e8f0e9; --t2: rgba(232,240,233,0.50); --t3: rgba(232,240,233,0.22); --t4: rgba(232,240,233,0.07);
    --r: 16px; --r-sm: 9px;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .d-root { min-height: 100vh; background: var(--bg); font-family: 'Instrument Sans', sans-serif; color: var(--text); padding-bottom: 100px; }

  /* HERO */
  .d-hero { position: relative; overflow: hidden; padding: 52px 24px 44px; border-bottom: 1px solid var(--border); background: linear-gradient(145deg, #0c1f0e 0%, #080b09 65%); }
  .d-hero::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 55% 70% at 90% 15%, rgba(163,230,53,0.08) 0%, transparent 60%), radial-gradient(ellipse 30% 40% at 10% 85%, rgba(163,230,53,0.04) 0%, transparent 60%); }
  .d-hero-inner { max-width: 1140px; margin: 0 auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; flex-wrap: wrap; position: relative; z-index: 1; }
  .d-hero-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--lime); border: 1px solid rgba(163,230,53,0.3); background: var(--lime-dim); padding: 5px 14px; border-radius: 20px; margin-bottom: 14px; }
  .d-hero-tag::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 8px var(--lime); animation: hblink 2s ease-in-out infinite; }
  @keyframes hblink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  .d-hero-title { font-family: 'Fraunces', serif; font-size: clamp(34px, 5.5vw, 60px); font-weight: 900; line-height: 1.0; letter-spacing: -1.5px; color: var(--text); }
  .d-hero-title em { font-style: italic; color: var(--lime); }
  .d-hero-sub { margin-top: 10px; font-size: 14px; color: var(--t2); max-width: 420px; line-height: 1.6; }
  .d-hero-num { font-family: 'Fraunces', serif; font-size: clamp(60px, 10vw, 100px); font-weight: 900; color: var(--t4); line-height: 1; letter-spacing: -6px; user-select: none; flex-shrink: 0; }

  /* TOOLBAR */
  .d-toolbar { max-width: 1140px; margin: 0 auto; padding: 28px 16px 0; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .d-search-wrap { position: relative; flex: 1; max-width: 360px; min-width: 180px; }
  .d-search-ico { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); font-size: 13px; color: var(--t3); pointer-events: none; }
  .d-search { width: 100%; padding: 11px 14px 11px 40px; font-family: 'Instrument Sans', sans-serif; font-size: 14px; color: var(--text); background: var(--s1); border: 1px solid var(--border); border-radius: var(--r-sm); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .d-search::placeholder { color: var(--t3); }
  .d-search:focus { border-color: var(--lime); box-shadow: 0 0 0 3px rgba(163,230,53,0.1); }
  .d-toggle { display: flex; background: var(--s1); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 3px; gap: 2px; }
  .d-tbtn { padding: 7px 13px; border: none; border-radius: 6px; background: transparent; color: var(--t3); font-size: 15px; cursor: pointer; transition: background 0.15s, color 0.15s; }
  .d-tbtn.on { background: var(--s3); color: var(--lime); }

  /* STATS */
  .d-stats { max-width: 1140px; margin: 22px auto 0; padding: 0 16px; display: flex; gap: 12px; flex-wrap: wrap; }
  .d-stat { flex: 1; min-width: 110px; background: var(--s1); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 16px 20px; position: relative; overflow: hidden; }
  .d-stat::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; border-radius: 0 0 var(--r-sm) var(--r-sm); background: var(--lime); opacity: 0.4; }
  .d-stat:nth-child(2)::after { background: #60a5fa; } .d-stat:nth-child(3)::after { background: var(--red); opacity: 0.5; } .d-stat:nth-child(4)::after { background: var(--gold); opacity: 0.5; }
  .d-stat-n { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; color: var(--text); line-height: 1; margin-bottom: 4px; }
  .d-stat-l { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); }

  /* FILTERS */
  .d-filters { max-width: 1140px; margin: 0 auto; padding: 20px 16px 0; display: flex; gap: 8px; flex-wrap: wrap; }
  .d-filter-btn { padding: 8px 16px; font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 700; border-radius: 20px; cursor: pointer; border: 1px solid var(--border); background: var(--s1); color: var(--t2); transition: all 0.18s; display: flex; align-items: center; gap: 6px; }
  .d-filter-btn:hover { border-color: var(--border2); color: var(--text); }
  .d-filter-btn.active-all { background: var(--lime-dim); color: var(--lime); border-color: rgba(163,230,53,0.3); }
  .d-filter-btn.active-available { background: rgba(96,165,250,0.1); color: #60a5fa; border-color: rgba(96,165,250,0.3); }
  .d-filter-btn.active-soldout { background: var(--red-dim); color: var(--red); border-color: rgba(251,113,133,0.3); }
  .d-filter-count { background: rgba(255,255,255,0.08); border-radius: 20px; padding: 1px 7px; font-size: 11px; font-weight: 700; }

  /* GRID / LIST */
  .d-grid-wrap { max-width: 1140px; margin: 28px auto 0; padding: 0 16px; }
  .d-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .d-list { display: flex; flex-direction: column; gap: 14px; }
  @media (max-width: 480px) { .d-grid { grid-template-columns: 1fr; } }

  /* GRID CARD */
  .d-card { background: var(--s1); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; cursor: default; transition: border-color 0.18s; }
  .d-card:hover { border-color: var(--border2); }
  .d-card.approved { opacity: 0.72; }
  .d-img-wrap { width: 100%; height: 200px; background: var(--s2); border-bottom: 1px solid var(--border); overflow: hidden; position: relative; }
  .d-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
  .d-card:hover .d-img { transform: scale(1.05); }
  .d-no-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 44px; color: var(--t4); }
  .d-img-badge { position: absolute; bottom: 10px; left: 10px; background: rgba(8,11,9,0.85); backdrop-filter: blur(8px); border: 1px solid var(--border2); border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; color: var(--lime); }
  .d-spots-badge { position: absolute; bottom: 10px; right: 10px; background: rgba(8,11,9,0.85); backdrop-filter: blur(8px); border: 1px solid rgba(251,191,36,0.3); border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; color: var(--gold); }
  .d-sold-overlay { position: absolute; inset: 0; z-index: 2; background: rgba(8,11,9,0.72); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
  .d-sold-stamp { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 900; font-style: italic; color: #fff; border: 3px solid rgba(255,255,255,0.85); padding: 6px 18px; border-radius: 4px; transform: rotate(-12deg); letter-spacing: 2px; text-transform: uppercase; }
  .d-card-body { padding: 16px 18px 14px; }
  .d-card-name { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* DONOR */
  .d-donor { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 12px; background: var(--lime-dim); border: 1px solid rgba(163,230,53,0.18); border-radius: 10px; }
  .d-donor-ico { font-size: 14px; flex-shrink: 0; }
  .d-donor-info { flex: 1; min-width: 0; }
  .d-donor-name { font-size: 13px; font-weight: 700; color: var(--lime); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .d-donor-meta { display: flex; align-items: center; gap: 8px; margin-top: 2px; flex-wrap: wrap; }
  .d-donor-uid { font-size: 10px; font-weight: 600; color: rgba(163,230,53,0.50); letter-spacing: 0.5px; }
  .d-donor-phone { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: var(--sky); background: var(--sky-dim); border: 1px solid rgba(56,189,248,0.20); border-radius: 20px; padding: 1px 8px; text-decoration: none; transition: background 0.15s; }
  .d-donor-phone:hover { background: rgba(56,189,248,0.18); }

  /* INFO ROWS */
  .d-rows { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
  .d-row { display: flex; align-items: flex-start; gap: 10px; }
  .d-lbl { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); min-width: 66px; flex-shrink: 0; padding-top: 2px; }
  .d-val { font-size: 13px; font-weight: 500; color: var(--t2); line-height: 1.4; }
  .d-chip { display: inline-block; background: var(--lime-dim); color: var(--lime); border: 1px solid rgba(163,230,53,0.2); border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 700; }

  /* SPOTS BAR */
  .d-spots { margin-bottom: 14px; }
  .d-spots-head { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--t3); margin-bottom: 6px; }
  .d-spots-head span:last-child { color: var(--gold); }
  .d-spots-track { height: 5px; border-radius: 99px; background: rgba(255,255,255,0.07); overflow: hidden; }
  .d-spots-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--lime), #7ec820); transition: width 0.6s ease; }
  .d-spots-fill.almost { background: linear-gradient(90deg, var(--gold), #e08000); }
  .d-spots-fill.full { background: linear-gradient(90deg, var(--red), #c0003a); }

  /* FOOTER */
  .d-footer { border-top: 1px solid var(--border); padding: 12px 18px; display: flex; flex-direction: column; gap: 8px; }
  .d-reserve-btn { width: 100%; padding: 12px 16px; background: var(--lime); color: #0c1a06; font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 700; border: none; border-radius: var(--r-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; transition: opacity 0.2s, transform 0.12s; box-shadow: 0 4px 16px rgba(163,230,53,0.28); }
  .d-reserve-btn:hover { opacity: 0.87; transform: translateY(-1px); }
  .d-call-btn { width: 100%; padding: 10px 16px; background: var(--sky-dim); color: var(--sky); border: 1px solid rgba(56,189,248,0.25); font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 700; border-radius: var(--r-sm); cursor: pointer; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s; }
  .d-call-btn:hover { background: rgba(56,189,248,0.18); }
  .d-dir-btn { width: 100%; padding: 9px 16px; background: transparent; border: 1px solid var(--border); color: var(--t2); font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 600; border-radius: var(--r-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s, color 0.2s; }
  .d-dir-btn:hover { background: rgba(255,255,255,0.04); color: var(--text); }
  .d-sold-btn { width: 100%; padding: 11px 16px; background: var(--red-dim); color: var(--red); border: 1px solid rgba(251,113,133,0.2); font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 700; border-radius: var(--r-sm); cursor: default; display: flex; align-items: center; justify-content: center; gap: 6px; }

  /* LIST CARD */
  .d-lcard { background: var(--s1); border: 1px solid var(--border); border-radius: var(--r-sm); display: flex; align-items: stretch; overflow: hidden; transition: border-color 0.18s; }
  .d-lcard:hover { border-color: var(--border2); }
  .d-lcard-img { width: 100px; flex-shrink: 0; background: var(--s2); display: flex; align-items: center; justify-content: center; font-size: 28px; color: var(--t3); overflow: hidden; position: relative; }
  .d-lcard-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .d-lcard-body { flex: 1; padding: 12px 16px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; min-width: 0; }
  .d-lcard-name { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; color: var(--text); min-width: 100px; flex-shrink: 0; }
  .d-lcard-meta { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; }
  .d-ltag { font-size: 11px; font-weight: 600; color: var(--t2); background: var(--s2); border: 1px solid var(--border); border-radius: 20px; padding: 3px 10px; white-space: nowrap; }
  .d-donor-ltag { font-size: 11px; font-weight: 700; color: var(--lime); background: var(--lime-dim); border: 1px solid rgba(163,230,53,0.2); border-radius: 20px; padding: 3px 10px; white-space: nowrap; }
  .d-phone-ltag { font-size: 11px; font-weight: 700; color: var(--sky); background: var(--sky-dim); border: 1px solid rgba(56,189,248,0.2); border-radius: 20px; padding: 3px 10px; white-space: nowrap; text-decoration: none; }
  .d-phone-ltag:hover { background: rgba(56,189,248,0.18); }
  .d-sold-ltag { font-size: 11px; font-weight: 700; color: var(--red); background: var(--red-dim); border: 1px solid rgba(251,113,133,0.2); border-radius: 20px; padding: 3px 10px; white-space: nowrap; }
  .d-lcard-acts { margin-left: auto; flex-shrink: 0; display: flex; gap: 7px; align-items: center; padding-right: 4px; }
  .d-lbtn { padding: 8px 14px; background: var(--lime); color: #0c1a06; font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 700; border: none; border-radius: 7px; cursor: pointer; transition: opacity 0.2s; white-space: nowrap; }
  .d-lbtn:hover { opacity: 0.82; }
  .d-lbtn-dir { padding: 8px 10px; background: transparent; border: 1px solid var(--border); color: var(--t2); font-size: 12px; font-weight: 600; border-radius: 7px; cursor: pointer; transition: background 0.2s; }
  .d-lbtn-dir:hover { background: rgba(255,255,255,0.05); }

  /* STATES */
  .d-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; gap: 16px; color: var(--t2); font-size: 14px; }
  .d-spinner { width: 36px; height: 36px; border: 3px solid rgba(163,230,53,0.15); border-top-color: var(--lime); border-radius: 50%; animation: dspin 0.75s linear infinite; }
  @keyframes dspin { to { transform: rotate(360deg); } }
  .d-empty { max-width: 420px; margin: 80px auto; text-align: center; padding: 48px 32px; background: var(--s1); border: 1px solid var(--border); border-radius: var(--r); color: var(--t2); font-size: 14px; }
  .d-empty-ico { font-size: 48px; margin-bottom: 14px; }
  .d-empty-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .d-err { color: var(--red); }
  .d-gate { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; background: var(--bg); }
  .d-gate-ico { font-size: 52px; }
  .d-gate-txt { font-family: 'Fraunces', serif; font-size: 22px; color: var(--t2); }

  /* RESERVATION MODAL */
  .rm-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.78); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .rm-box { background: #0e1410; border: 1px solid rgba(255,255,255,0.11); border-radius: 20px; width: 100%; max-width: 480px; box-shadow: 0 32px 80px rgba(0,0,0,0.80); overflow: hidden; position: relative; max-height: 90vh; overflow-y: auto; }
  .rm-box::-webkit-scrollbar { width: 4px; } .rm-box::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
  .rm-close { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: var(--t2); font-size: 14px; cursor: pointer; transition: background 0.15s; }
  .rm-close:hover { background: rgba(255,255,255,0.12); color: var(--text); }
  .rm-top { padding: 24px 24px 0; background: linear-gradient(180deg, rgba(163,230,53,0.06) 0%, transparent 100%); }
  .rm-food-name { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 900; color: var(--text); margin-bottom: 8px; padding-right: 40px; }
  .rm-food-meta { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 16px; }
  .rm-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
  .rm-tag-g { background: var(--lime-dim); color: var(--lime); border: 1px solid rgba(163,230,53,0.22); }
  .rm-tag-s { background: var(--sky-dim);  color: var(--sky);  border: 1px solid rgba(56,189,248,0.22); }
  .rm-tag-d { background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(251,191,36,0.22); }
  .rm-spots { padding: 12px 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 20px; }
  .rm-spots-row { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--t3); margin-bottom: 7px; }
  .rm-spots-row span:last-child { color: var(--gold); }
  .rm-spots-track { height: 6px; border-radius: 99px; background: rgba(255,255,255,0.06); overflow: hidden; }
  .rm-spots-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--lime), #7ec820); transition: width 0.5s; }
  .rm-body { padding: 0 24px 24px; }
  .rm-section-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); margin-bottom: 14px; margin-top: 20px; display: flex; align-items: center; gap: 8px; }
  .rm-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .rm-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 13px; }
  .rm-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); }
  .rm-inp { width: 100%; padding: 12px 14px; font-family: 'Instrument Sans', sans-serif; font-size: 14px; color: var(--text); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .rm-inp::placeholder { color: var(--t3); }
  .rm-inp:focus { border-color: rgba(163,230,53,0.45); box-shadow: 0 0 0 3px rgba(163,230,53,0.08); }
  .rm-qty-note { padding: 10px 13px; border-radius: 9px; background: rgba(163,230,53,0.05); border: 1px solid rgba(163,230,53,0.15); font-size: 12px; color: var(--t2); display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .rm-error { padding: 11px 14px; border-radius: 9px; background: var(--red-dim); border: 1px solid rgba(251,113,133,0.25); color: var(--red); font-size: 13px; font-weight: 500; margin-bottom: 14px; display: flex; align-items: flex-start; gap: 8px; }
  .rm-submit { width: 100%; padding: 14px; background: var(--lime); color: #0c1a06; font-family: 'Instrument Sans', sans-serif; font-size: 14px; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 50px; transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 20px rgba(163,230,53,0.30); }
  .rm-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .rm-submit:disabled { opacity: 0.4; cursor: default; transform: none; }
  .rm-spin { width: 18px; height: 18px; border: 2.5px solid rgba(12,26,6,0.25); border-top-color: #0c1a06; border-radius: 50%; animation: rmspin 0.65s linear infinite; }
  @keyframes rmspin { to { transform: rotate(360deg); } }
  .rm-success { padding: 32px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .rm-success-ico { font-size: 52px; }
  .rm-success-title { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 900; color: var(--lime); letter-spacing: -0.5px; }
  .rm-success-sub { font-size: 14px; color: var(--t2); line-height: 1.6; max-width: 320px; }
  .rm-code-box { background: rgba(163,230,53,0.08); border: 2px solid rgba(163,230,53,0.35); border-radius: 16px; padding: 24px 32px; margin: 8px 0; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: background 0.18s; }
  .rm-code-box:hover { background: rgba(163,230,53,0.14); }
  .rm-code-label { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(163,230,53,0.55); }
  .rm-code { font-family: 'Fraunces', serif; font-size: 48px; font-weight: 900; color: var(--lime); letter-spacing: 8px; line-height: 1; }
  .rm-code-hint { font-size: 11px; color: var(--t3); }
  .rm-code-copied { font-size: 11px; font-weight: 700; color: var(--lime); margin-top: -4px; }
  .rm-detail-row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 9px; text-align: left; }
  .rm-detail-ico { font-size: 15px; flex-shrink: 0; }
  .rm-detail-text { font-size: 12px; color: var(--t2); line-height: 1.4; }
  .rm-detail-text strong { display: block; color: var(--text); font-weight: 600; margin-bottom: 1px; }
  .rm-expiry { font-size: 11px; color: var(--t3); font-style: italic; padding: 8px 0; }
  .rm-done-btn { width: 100%; padding: 13px; background: rgba(255,255,255,0.06); border: 1px solid var(--border2); color: var(--t2); font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 600; border-radius: 10px; cursor: pointer; transition: background 0.18s; }
  .rm-done-btn:hover { background: rgba(255,255,255,0.10); color: var(--text); }

  /* DONOR INFO SECTION in success screen */
  .rm-donor-section { width: 100%; background: rgba(163,230,53,0.05); border: 1px solid rgba(163,230,53,0.18); border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; text-align: left; }
  .rm-donor-section-title { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(163,230,53,0.55); margin-bottom: 2px; }
  .rm-donor-row { display: flex; align-items: flex-start; gap: 10px; }
  .rm-donor-row-ico { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .rm-donor-row-body { flex: 1; min-width: 0; }
  .rm-donor-row-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); margin-bottom: 2px; }
  .rm-donor-row-val { font-size: 13px; font-weight: 600; color: var(--text); }
  .rm-donor-row-val a { color: var(--sky); text-decoration: none; }
  .rm-donor-row-val a:hover { text-decoration: underline; }
  .rm-divider { width: 100%; height: 1px; background: var(--border); margin: 2px 0; }
  .rm-call-action { width: 100%; padding: 11px 16px; background: var(--sky-dim); color: var(--sky); border: 1px solid rgba(56,189,248,0.25); font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 700; border-radius: var(--r-sm); cursor: pointer; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s; }
  .rm-call-action:hover { background: rgba(56,189,248,0.18); }
  .rm-dir-action { width: 100%; padding: 10px 16px; background: transparent; border: 1px solid var(--border); color: var(--t2); font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 600; border-radius: var(--r-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s, color 0.2s; }
  .rm-dir-action:hover { background: rgba(255,255,255,0.04); color: var(--text); }

  /* ══ PICKUP VERIFY BANNER ══ */
  .pv-banner { max-width: 1140px; margin: 24px auto 0; padding: 0 16px; }
  .pv-card { background: var(--s1); border: 1px solid rgba(163,230,53,0.18); border-radius: var(--r); padding: 20px 24px; }
  .pv-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
  .pv-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: var(--text); }
  .pv-sub { font-size: 12px; color: var(--t2); margin-bottom: 16px; }
  .pv-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .pv-inp { flex: 1; min-width: 160px; padding: 12px 16px; font-family: 'Instrument Sans', sans-serif; font-size: 18px; font-weight: 700; letter-spacing: 6px; text-transform: uppercase; color: var(--lime); background: rgba(163,230,53,0.06); border: 1.5px solid rgba(163,230,53,0.25); border-radius: var(--r-sm); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .pv-inp::placeholder { color: var(--t3); letter-spacing: 2px; font-size: 14px; font-weight: 400; }
  .pv-inp:focus { border-color: var(--lime); box-shadow: 0 0 0 3px rgba(163,230,53,0.10); }
  .pv-btn { padding: 12px 22px; background: var(--lime); color: #0c1a06; font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 700; border: none; border-radius: var(--r-sm); cursor: pointer; display: flex; align-items: center; gap: 7px; transition: opacity 0.2s; white-space: nowrap; }
  .pv-btn:hover:not(:disabled) { opacity: 0.85; }
  .pv-btn:disabled { opacity: 0.4; cursor: default; }
  .pv-spin { width: 16px; height: 16px; border: 2px solid rgba(12,26,6,0.25); border-top-color: #0c1a06; border-radius: 50%; animation: rmspin 0.65s linear infinite; }
  .pv-result { margin-top: 14px; padding: 14px 16px; border-radius: var(--r-sm); font-size: 13px; font-weight: 500; display: flex; align-items: flex-start; gap: 10px; }
  .pv-result.ok  { background: var(--lime-dim); border: 1px solid rgba(163,230,53,0.2); color: var(--lime); }
  .pv-result.err { background: var(--red-dim);  border: 1px solid rgba(251,113,133,0.2); color: var(--red); }
  .pv-result.warn { background: var(--gold-dim); border: 1px solid rgba(251,191,36,0.2); color: var(--gold); }
  .pv-result-body { flex: 1; }
  .pv-result-title { font-weight: 700; margin-bottom: 3px; }
  .pv-result-sub { font-size: 12px; opacity: 0.8; }

  /* ════════════════════════════════
     RESEND CODE PANEL
  ════════════════════════════════ */
  .rs-trigger { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: var(--t2); background: none; border: none; cursor: pointer; padding: 0; transition: color 0.15s; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 3px; }
  .rs-trigger:hover { color: var(--gold); }
  .rs-overlay { position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.78); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .rs-box { background: #0e1410; border: 1px solid rgba(255,255,255,0.11); border-radius: 20px; width: 100%; max-width: 420px; padding: 32px 28px; display: flex; flex-direction: column; gap: 18px; position: relative; box-shadow: 0 32px 80px rgba(0,0,0,0.80); animation: rs-pop 0.22s cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes rs-pop { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .rs-close { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: var(--t2); font-size: 13px; cursor: pointer; transition: background 0.15s; }
  .rs-close:hover { background: rgba(255,255,255,0.12); color: var(--text); }
  .rs-ico { font-size: 36px; text-align: center; }
  .rs-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 900; color: var(--text); text-align: center; }
  .rs-sub { font-size: 13px; color: var(--t2); text-align: center; line-height: 1.6; }
  .rs-field { display: flex; flex-direction: column; gap: 6px; }
  .rs-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--t3); }
  .rs-inp { width: 100%; padding: 12px 14px; font-family: 'Instrument Sans', sans-serif; font-size: 14px; color: var(--text); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .rs-inp::placeholder { color: var(--t3); }
  .rs-inp:focus { border-color: rgba(251,191,36,0.5); box-shadow: 0 0 0 3px rgba(251,191,36,0.08); }
  .rs-btn { padding: 13px; background: var(--gold); color: #1a0e00; font-family: 'Instrument Sans', sans-serif; font-size: 14px; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: opacity 0.2s; min-height: 48px; box-shadow: 0 4px 20px rgba(251,191,36,0.25); }
  .rs-btn:hover:not(:disabled) { opacity: 0.88; }
  .rs-btn:disabled { opacity: 0.35; cursor: default; box-shadow: none; }
  .rs-spin { width: 16px; height: 16px; border: 2.5px solid rgba(26,14,0,0.2); border-top-color: #1a0e00; border-radius: 50%; animation: rmspin 0.65s linear infinite; }
  .rs-result { padding: 12px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; text-align: center; line-height: 1.5; }
  .rs-result.ok  { background: var(--lime-dim); border: 1px solid rgba(163,230,53,0.20); color: var(--lime); }
  .rs-result.err { background: var(--red-dim);  border: 1px solid rgba(251,113,133,0.20); color: var(--red); }
  .rs-hint { font-size: 11px; color: var(--t3); text-align: center; line-height: 1.6; }
`;

/* ── Image helpers ── */
const buildPaths = (image) => {
  if (!image) return [];
  if (image.startsWith("http")) return [image];
  return [`${API_URL}/uploads/${image}`, `${API_URL}/api/uploads/${image}`, `${RENDER_URL}/uploads/${image}`, `${RENDER_URL}/api/uploads/${image}`];
};
const SmartImg = ({ image, alt }) => {
  const paths = buildPaths(image);
  const [idx, setIdx] = useState(0);
  const [broken, setBroken] = useState(false);
  if (!image || broken) return <div className="d-no-img">🍽️</div>;
  return <img src={paths[idx]} alt={alt} className="d-img" onError={() => { if (idx + 1 < paths.length) setIdx(idx + 1); else setBroken(true); }} />;
};
const ListImg = ({ image, alt }) => {
  const paths = buildPaths(image);
  const [idx, setIdx] = useState(0);
  const [broken, setBroken] = useState(false);
  if (!image || broken) return <span>🍽️</span>;
  return <img src={paths[idx]} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={() => { if (idx + 1 < paths.length) setIdx(idx + 1); else setBroken(true); }} />;
};

/* ── Get Directions ── */
const getDirections = (dest) => {
  if (!dest) return;
  const fallback = () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`, "_blank");
  if (!navigator.geolocation) { fallback(); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => window.open(`https://www.google.com/maps/dir/${pos.coords.latitude},${pos.coords.longitude}/${encodeURIComponent(dest)}`, "_blank"),
    fallback,
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
  );
};

/* ── Spots Bar ── */
const SpotsBar = ({ reserved, total }) => {
  if (!total) return null;
  const pct   = Math.min(100, Math.round((reserved / total) * 100));
  const left  = Math.max(0, total - reserved);
  const cls   = pct >= 100 ? "full" : pct >= 70 ? "almost" : "";
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


/* ── Reservation Modal ── */
const ReservationModal = ({ item, spotsInfo, onClose, onReserved }) => {
  const [form,    setForm]    = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [result,  setResult]  = useState(null);
  const [copied,  setCopied]  = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/api/reservations`,
        { foodItemId: item._id, reserverName: form.name.trim(), reserverPhone: form.phone.trim(), reserverEmail: form.email.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(data);
      onReserved(item._id);
    } catch (err) {
      setError(err?.response?.data?.error || "Reservation failed. Please try again.");
    } finally { setLoading(false); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(result.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const fmtExpiry = (iso) => iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <AnimatePresence>
      <motion.div className="rm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target.classList.contains("rm-overlay")) onClose(); }}>
        <motion.div className="rm-box"
          initial={{ scale: 0.88, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.88, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}>
          <button className="rm-close" onClick={onClose}>✕</button>

          {result ? (
            <div className="rm-success">
              <div className="rm-success-ico">🎉</div>
              <div className="rm-success-title">Reservation Confirmed!</div>
              <div className="rm-success-sub">Show this code to the donor when you arrive. Save the donor's contact details below.</div>

              {/* ── PICKUP CODE ── */}
              <div className="rm-code-box" onClick={copyCode} title="Tap to copy">
                <div className="rm-code-label">Your Pickup Code</div>
                <div className="rm-code">{result.code}</div>
                <div className="rm-code-hint">Tap to copy</div>
              </div>
              {copied && <div className="rm-code-copied">✓ Copied to clipboard!</div>}
              <div className="rm-expiry">⏰ Code expires: {fmtExpiry(result.codeExpiresAt)} (24 hours)</div>

              {/* ── FOOD DETAILS ── */}
              <div className="rm-donor-section">
                <div className="rm-donor-section-title">🍽️ Food Details</div>
                <div className="rm-donor-row">
                  <span className="rm-donor-row-ico">🧺</span>
                  <div className="rm-donor-row-body">
                    <div className="rm-donor-row-label">Item</div>
                    <div className="rm-donor-row-val">{result.foodItem || item.foodItem}</div>
                  </div>
                </div>
                <div className="rm-divider" />
                <div className="rm-donor-row">
                  <span className="rm-donor-row-ico">⚖️</span>
                  <div className="rm-donor-row-body">
                    <div className="rm-donor-row-label">Quantity</div>
                    <div className="rm-donor-row-val">{item.foodQuantity}g</div>
                  </div>
                </div>
                {item.foodReason && (<>
                  <div className="rm-divider" />
                  <div className="rm-donor-row">
                    <span className="rm-donor-row-ico">💬</span>
                    <div className="rm-donor-row-body">
                      <div className="rm-donor-row-label">Reason</div>
                      <div className="rm-donor-row-val">{item.foodReason}</div>
                    </div>
                  </div>
                </>)}
                <div className="rm-divider" />
                <div className="rm-donor-row">
                  <span className="rm-donor-row-ico">📅</span>
                  <div className="rm-donor-row-body">
                    <div className="rm-donor-row-label">Date Listed</div>
                    <div className="rm-donor-row-val">{new Date(item.foodWasteDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                </div>
              </div>

              {/* ── DONOR DETAILS ── */}
              <div className="rm-donor-section">
                <div className="rm-donor-section-title">👤 Donor Details</div>
                <div className="rm-donor-row">
                  <span className="rm-donor-row-ico">🙍</span>
                  <div className="rm-donor-row-body">
                    <div className="rm-donor-row-label">Donor Name</div>
                    <div className="rm-donor-row-val">{item.user?.username || "Anonymous"}</div>
                  </div>
                </div>
                {item.user?.phone && (<>
                  <div className="rm-divider" />
                  <div className="rm-donor-row">
                    <span className="rm-donor-row-ico">📱</span>
                    <div className="rm-donor-row-body">
                      <div className="rm-donor-row-label">Phone</div>
                      <div className="rm-donor-row-val"><a href={`tel:${item.user.phone}`}>{item.user.phone}</a></div>
                    </div>
                  </div>
                </>)}
                {item.user?.email && (<>
                  <div className="rm-divider" />
                  <div className="rm-donor-row">
                    <span className="rm-donor-row-ico">✉️</span>
                    <div className="rm-donor-row-body">
                      <div className="rm-donor-row-label">Email</div>
                      <div className="rm-donor-row-val"><a href={`mailto:${item.user.email}`}>{item.user.email}</a></div>
                    </div>
                  </div>
                </>)}
                {item.user?.userId && (<>
                  <div className="rm-divider" />
                  <div className="rm-donor-row">
                    <span className="rm-donor-row-ico">🪪</span>
                    <div className="rm-donor-row-body">
                      <div className="rm-donor-row-label">Donor ID</div>
                      <div className="rm-donor-row-val" style={{ fontSize: 11, color: "var(--t2)" }}>{item.user.userId}</div>
                    </div>
                  </div>
                </>)}
              </div>

              {/* ── PICKUP LOCATION ── */}
              <div className="rm-donor-section">
                <div className="rm-donor-section-title">📍 Pickup Info</div>
                <div className="rm-donor-row">
                  <span className="rm-donor-row-ico">🗺️</span>
                  <div className="rm-donor-row-body">
                    <div className="rm-donor-row-label">Location</div>
                    <div className="rm-donor-row-val">{result.location || item.location || "See donation details"}</div>
                  </div>
                </div>
                {result.spotsLeft !== undefined && (<>
                  <div className="rm-divider" />
                  <div className="rm-donor-row">
                    <span className="rm-donor-row-ico">👥</span>
                    <div className="rm-donor-row-body">
                      <div className="rm-donor-row-label">Spots Remaining</div>
                      <div className="rm-donor-row-val" style={{ color: result.spotsLeft === 0 ? "var(--red)" : result.spotsLeft <= 3 ? "var(--gold)" : "var(--lime)" }}>
                        {result.spotsLeft === 0 ? "None — fully reserved" : `${result.spotsLeft} spot${result.spotsLeft !== 1 ? "s" : ""} left`}
                      </div>
                    </div>
                  </div>
                </>)}
              </div>

              {/* ── QUICK ACTIONS ── */}
              {item.user?.phone && (
                <a className="rm-call-action" href={`tel:${item.user.phone}`}>
                  📞 Call Donor — {item.user.phone}
                </a>
              )}
              <button className="rm-dir-action" onClick={() => {
                const dest = result.location || item.location;
                if (!dest) return;
                const fallback = () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`, "_blank");
                if (!navigator.geolocation) { fallback(); return; }
                navigator.geolocation.getCurrentPosition(
                  (pos) => window.open(`https://www.google.com/maps/dir/${pos.coords.latitude},${pos.coords.longitude}/${encodeURIComponent(dest)}`, "_blank"),
                  fallback, { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
                );
              }}>📍 Get Directions to Pickup</button>

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
                    <div className="rm-spots-row">
                      <span>Availability</span>
                      <span>{spotsInfo.spotsLeft <= 0 ? "FULL" : `${spotsInfo.spotsLeft} of ${spotsInfo.total} spots left`}</span>
                    </div>
                    <div className="rm-spots-track">
                      <div className="rm-spots-fill" style={{ width: `${Math.min(100, Math.round((spotsInfo.reserved / spotsInfo.total) * 100))}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="rm-body">
                <div className="rm-section-title">Your Details</div>
                {error && <div className="rm-error"><span>⚠️</span> {error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="rm-field">
                    <label className="rm-label">Full Name *</label>
                    <input className="rm-inp" type="text" placeholder="Your full name" value={form.name} onChange={set("name")} required minLength={2} />
                  </div>
                  <div className="rm-field">
                    <label className="rm-label">Phone Number *</label>
                    <input className="rm-inp" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} required />
                  </div>
                  <div className="rm-field">
                    <label className="rm-label">Email Address *</label>
                    <input className="rm-inp" type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} required />
                  </div>
                  <div className="rm-qty-note"><span>📦</span><span>Each person can reserve <strong>1 unit</strong> of this item.</span></div>
                  <div className="rm-section-title">Rules</div>
                  <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.7, marginBottom: 18 }}>
                    • You can only reserve <strong>one item per listing</strong><br />
                    • A <strong>6-character pickup code</strong> will be generated<br />
                    • Code is valid for <strong>24 hours</strong> only<br />
                    • Show the code to the donor when you collect<br />
                    • The donor will scan/enter your code to confirm pickup<br />
                    • Each confirmation decrements remaining spots
                  </div>
                  <button type="submit" className="rm-submit" disabled={loading}>
                    {loading ? <><div className="rm-spin" /> Reserving…</> : "🎯 Reserve This Food"}
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

/* ══════════════════════════════════════════════════
   MAIN DISPLAY COMPONENT
══════════════════════════════════════════════════ */
const Display = ({ newWaste }) => {
  const [wasteData, setWasteData] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [search,    setSearch]    = useState("");
  const [view,      setView]      = useState("grid");
  const [filter,    setFilter]    = useState("all");
  const [spotsMap,  setSpotsMap]  = useState({});
  const [modalItem, setModalItem] = useState(null);

  const fetchAllSpots = useCallback(async (items) => {
    const available = items.filter(i => !i.approved);
    const results   = await Promise.allSettled(
      available.map(i =>
        axios.get(`${API_URL}/api/reservations/food/${i._id}`)
          .then(r => ({ id: i._id, ...r.data }))
          .catch(() => null)
      )
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
      setWasteData(items);
      setError("");
      fetchAllSpots(items);
    } catch (err) {
      console.error(err);
      setError("Failed to load records. Please try again.");
    } finally { setLoading(false); }
  }, [fetchAllSpots]);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);
  useEffect(() => { if (newWaste) setWasteData(p => [newWaste, ...p]); }, [newWaste]);

  const filtered = wasteData.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = (i.location || "").toLowerCase().includes(q) || (i.foodItem || "").toLowerCase().includes(q) || (i.user?.username || "").toLowerCase().includes(q);
    const matchFilter = filter === "all" ? true : filter === "available" ? !i.approved : filter === "soldout" ? i.approved : true;
    return matchSearch && matchFilter;
  });

  const totalWasted  = wasteData.reduce((s, i) => s + (Number(i.foodQuantity) || 0), 0);
  const uniqueDonors = new Set(wasteData.map(i => i.user?._id).filter(Boolean)).size;
  const cv = {
    hidden:  { opacity: 0, y: 22 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" } }),
  };

  if (!localStorage.getItem("token")) return (
    <><style>{css}</style><div className="d-gate"><div className="d-gate-ico">🔒</div><div className="d-gate-txt">Please log in to view donations</div></div></>
  );

  return (
    <>
      <style>{css}</style>
      {modalItem && (
        <ReservationModal item={modalItem} spotsInfo={spotsMap[modalItem._id] || null}
          onClose={() => setModalItem(null)} onReserved={handleReserved} />
      )}
      <div className="d-root">

        {/* Hero */}
        <div className="d-hero">
          <div className="d-hero-inner">
            <div>
              <div className="d-hero-tag">Community Feed</div>
              <h1 className="d-hero-title">All <em>Donations</em><br />From Everyone</h1>
              <p className="d-hero-sub">Browse available food donations. Reserve yours before it's gone.</p>
            </div>
            <div className="d-hero-num">{wasteData.length}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="d-toolbar">
          <div className="d-search-wrap">
            <span className="d-search-ico">🔍</span>
            <input className="d-search" placeholder="Search item, location or donor…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="d-toggle">
            <button className={`d-tbtn ${view === "grid" ? "on" : ""}`} onClick={() => setView("grid")}>⊞</button>
            <button className={`d-tbtn ${view === "list" ? "on" : ""}`} onClick={() => setView("list")}>☰</button>
          </div>
        </div>

        {/* Filters */}
        {!loading && !error && (
          <div className="d-filters">
            {[
              { key: "all",       label: "All",       icon: "📋", count: wasteData.length },
              { key: "available", label: "Available", icon: "✅", count: wasteData.filter(i => !i.approved).length },
              { key: "soldout",   label: "Sold Out",  icon: "🔴", count: wasteData.filter(i => i.approved).length },
            ].map(({ key, label, icon, count }) => (
              <button key={key} className={`d-filter-btn ${filter === key ? `active-${key}` : ""}`} onClick={() => setFilter(key)}>
                {icon} {label} <span className="d-filter-count">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && !error && (
          <div className="d-stats">
            {[{ n: wasteData.length, l: "Total Entries" }, { n: filtered.length, l: "Showing" }, { n: `${totalWasted}g`, l: "Total Food" }, { n: uniqueDonors, l: "Donors" }].map(({ n, l }, i) => (
              <motion.div key={l} className="d-stat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <div className="d-stat-n">{n}</div><div className="d-stat-l">{l}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="d-loading"><div className="d-spinner" />Loading community feed…</div>
        ) : error ? (
          <div className="d-empty"><div className="d-empty-ico">⚠️</div><div className="d-empty-title d-err">Something went wrong</div><div>{error}</div></div>
        ) : filtered.length === 0 ? (
          <div className="d-empty"><div className="d-empty-ico">📭</div><div className="d-empty-title">No records found</div><div>{search ? "Try a different search term." : "No donations yet."}</div></div>
        ) : (
          <div className="d-grid-wrap">
            <AnimatePresence mode="wait">

              {/* GRID */}
              {view === "grid" && (
                <motion.div key="grid" className="d-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {filtered.map((item, i) => {
                    const spots     = spotsMap[item._id];
                    const isSoldOut = item.approved || spots?.isSoldOut;
                    return (
                      <motion.div key={item._id || i} className={`d-card${isSoldOut ? " approved" : ""}`}
                        custom={i} variants={cv} initial="hidden" animate="visible"
                        whileHover={{ y: -4, boxShadow: "0 20px 56px rgba(0,0,0,0.65)" }}>
                        <div className="d-img-wrap">
                          {isSoldOut && <div className="d-sold-overlay"><div className="d-sold-stamp">Sold Out</div></div>}
                          <SmartImg image={item.image} alt={item.foodItem} />
                          {!isSoldOut && <div className="d-img-badge">{item.foodQuantity}g available</div>}
                          {!isSoldOut && spots && spots.spotsLeft <= 3 && spots.spotsLeft > 0 && (
                            <div className="d-spots-badge">🔥 Only {spots.spotsLeft} left!</div>
                          )}
                        </div>
                        <div className="d-card-body">
                          <div className="d-card-name">{item.foodItem}</div>
                          <div className="d-donor">
                            <span className="d-donor-ico">👤</span>
                            <div className="d-donor-info">
                              <div className="d-donor-name">{item.user?.username || "Anonymous"}</div>
                              <div className="d-donor-meta">
                                {item.user?.userId && <span className="d-donor-uid">{item.user.userId}</span>}
                                {item.user?.phone && <a className="d-donor-phone" href={`tel:${item.user.phone}`} onClick={e => e.stopPropagation()}>📱 {item.user.phone}</a>}
                              </div>
                            </div>
                          </div>
                          <div className="d-rows">
                            <div className="d-row"><span className="d-lbl">Qty</span><span className="d-chip">{item.foodQuantity}g</span></div>
                            <div className="d-row"><span className="d-lbl">Reason</span><span className="d-val">{item.foodReason || "—"}</span></div>
                            <div className="d-row"><span className="d-lbl">Date</span><span className="d-val">{new Date(item.foodWasteDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></div>
                            <div className="d-row"><span className="d-lbl">Location</span><span className="d-val">{item.location || "—"}</span></div>
                          </div>
                          {!isSoldOut && spots && <SpotsBar reserved={spots.reserved} total={spots.total} />}
                        </div>
                        <div className="d-footer">
                          {isSoldOut ? (
                            <div className="d-sold-btn">✕ Sold Out — Fully Reserved</div>
                          ) : (
                            <>
                              <button className="d-reserve-btn" onClick={() => setModalItem(item)}>🎯 Reserve This Food</button>
                              {item.user?.phone && <a className="d-call-btn" href={`tel:${item.user.phone}`}>📞 Call Donor — {item.user.phone}</a>}
                              <button className="d-dir-btn" onClick={() => getDirections(item.location)}>📍 Get Directions</button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* LIST */}
              {view === "list" && (
                <motion.div key="list" className="d-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {filtered.map((item, i) => {
                    const spots     = spotsMap[item._id];
                    const isSoldOut = item.approved || spots?.isSoldOut;
                    return (
                      <motion.div key={item._id || i} className="d-lcard" custom={i} variants={cv} initial="hidden" animate="visible" style={isSoldOut ? { opacity: 0.70 } : {}}>
                        <div className="d-lcard-img">
                          <ListImg image={item.image} alt={item.foodItem} />
                          {isSoldOut && <div style={{ position: "absolute", inset: 0, background: "rgba(8,11,9,0.75)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fb7185", letterSpacing: 1, textTransform: "uppercase" }}>SOLD</div>}
                        </div>
                        <div className="d-lcard-body">
                          <div className="d-lcard-name">{item.foodItem}</div>
                          <div className="d-lcard-meta">
                            <span className="d-ltag">🧺 {item.foodQuantity}g</span>
                            <span className="d-ltag" title={item.location}>📍 {(item.location || "—").slice(0, 28)}{(item.location || "").length > 28 ? "…" : ""}</span>
                            <span className="d-ltag">📅 {new Date(item.foodWasteDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                            <span className="d-donor-ltag">👤 {item.user?.username || "Anon"}</span>
                            {item.user?.phone && <a className="d-phone-ltag" href={`tel:${item.user.phone}`}>📱 {item.user.phone}</a>}
                            {spots && !isSoldOut && <span className="d-ltag" style={{ color: spots.spotsLeft <= 3 ? "var(--gold)" : "var(--t2)" }}>👥 {spots.spotsLeft} left</span>}
                            {isSoldOut && <span className="d-sold-ltag">✕ Sold Out</span>}
                          </div>
                          <div className="d-lcard-acts">
                            {isSoldOut ? (
                              <span className="d-sold-ltag" style={{ padding: "8px 14px" }}>✕ Sold Out</span>
                            ) : (
                              <>
                                <button className="d-lbtn" onClick={() => setModalItem(item)}>🎯 Reserve</button>
                                <button className="d-lbtn-dir" onClick={() => getDirections(item.location)}>📍</button>
                              </>
                            )}
                          </div>
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