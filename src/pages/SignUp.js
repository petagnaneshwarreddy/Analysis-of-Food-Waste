import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/* ── Role definitions ── */
const ROLES = {
  donor: {
    label:    "Food Donor",
    emoji:    "🤲",
    tagline:  "Share your surplus",
    color:    "#ff6b35",
    colorDim: "rgba(255,107,53,0.12)",
    desc:     "Restaurants, households, caterers — anyone with surplus food to give.",
    perks: [
      { icon: "📦", text: "List unlimited donations" },
      { icon: "📊", text: "Full waste analytics" },
      { icon: "🧾", text: "Tax benefit records" },
      { icon: "🌱", text: "Reduce carbon footprint" },
      { icon: "🏆", text: "Donor recognition badges" },
      { icon: "❤️", text: "Help families in need" },
    ],
  },
  recipient: {
    label:    "Food Recipient",
    emoji:    "🙏",
    tagline:  "Find food near you",
    color:    "#5cb85c",
    colorDim: "rgba(92,184,92,0.12)",
    desc:     "Individuals, families, or NGOs looking to collect available food donations.",
    perks: [
      { icon: "🗺️", text: "Browse local donations" },
      { icon: "🎯", text: "Reserve food instantly" },
      { icon: "📱", text: "Get pickup codes" },
      { icon: "🔔", text: "Real-time availability" },
    ],
  },
};

const STATS = [
  { val: "12K+", lbl: "Members"      },
  { val: "4.2T", lbl: "Food Saved"   },
  { val: "840+", lbl: "Donors"       },
  { val: "98%",  lbl: "Satisfaction" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .su-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Outfit', sans-serif;
    color: #fff;
    background: #0a0a0a;
  }

  /* ── LEFT BRAND PANEL ── */
  .su-left {
    background: #0d0d0d;
    position: relative;
    display: flex; flex-direction: column;
    padding: 44px 52px 48px;
    min-height: 100vh; overflow: hidden;
    border-right: 1px solid rgba(255,255,255,0.05);
  }
  .su-left::before {
    content: ''; position: absolute; top: -120px; left: -80px;
    width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,53,0.13) 0%, transparent 65%);
    pointer-events: none;
  }
  .su-left::after {
    content: ''; position: absolute; bottom: -100px; right: -60px;
    width: 360px; height: 360px; border-radius: 50%;
    background: radial-gradient(circle, rgba(92,184,92,0.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .su-wordmark {
    position: relative; z-index: 2;
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; letter-spacing: -0.5px;
  }
  .su-wordmark span { color: #ff6b35; font-style: italic; }
  .su-left-content { position: relative; z-index: 2; margin-top: 60px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .su-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.12); border-radius: 100px; padding: 6px 16px; margin-bottom: 28px; width: fit-content; }
  .su-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff6b35; box-shadow: 0 0 8px rgba(255,107,53,0.6); animation: bdot 2s ease-in-out infinite; }
  @keyframes bdot { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .su-h1 { font-family: 'Playfair Display', serif; font-size: clamp(42px, 5vw, 64px); font-weight: 900; line-height: 1.04; letter-spacing: -2.5px; margin-bottom: 22px; }
  .su-h1-green { color: #5cb85c; font-style: italic; display: block; }
  .su-desc { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.38); line-height: 1.75; max-width: 380px; }
  .su-stats { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 52px; }
  .su-stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px 22px; transition: background 0.2s, border-color 0.2s; }
  .su-stat-card:hover { background: rgba(255,107,53,0.06); border-color: rgba(255,107,53,0.18); }
  .su-stat-val { font-family: 'Playfair Display', serif; font-size: clamp(28px, 3.5vw, 36px); font-weight: 900; line-height: 1; color: #ff6b35; letter-spacing: -1px; }
  .su-stat-lbl { font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.28); margin-top: 6px; letter-spacing: 0.3px; }

  /* ── RIGHT FORM PANEL ── */
  .su-right {
    background: #111411;
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    padding: 48px 52px;
    position: relative; overflow-y: auto; overflow-x: hidden;
    min-height: 100vh;
  }
  .su-right::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(circle at 90% 5%, rgba(255,107,53,0.05) 0%, transparent 45%), radial-gradient(circle at 10% 95%, rgba(92,184,92,0.04) 0%, transparent 45%);
  }
  .su-form-wrap { width: 100%; max-width: 440px; position: relative; z-index: 2; padding-bottom: 32px; }

  .su-form-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.22); margin-bottom: 8px; }
  .su-form-title { font-family: 'Playfair Display', serif; font-size: clamp(28px, 3.5vw, 38px); font-weight: 900; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 24px; }
  .su-form-title span { color: #ff6b35; font-style: italic; }

  /* ══════════════════════════════════════
     ROLE SELECTOR — the key new element
  ══════════════════════════════════════ */
  .su-role-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 26px; }

  .su-role-card {
    position: relative; padding: 18px 16px;
    background: rgba(255,255,255,0.03);
    border: 2px solid rgba(255,255,255,0.08);
    border-radius: 14px; cursor: pointer;
    transition: all 0.22s ease;
    text-align: center; user-select: none;
    overflow: hidden;
  }
  .su-role-card::before {
    content: ''; position: absolute; inset: 0;
    background: var(--role-color-dim, transparent);
    opacity: 0; transition: opacity 0.22s;
    border-radius: 12px;
  }
  .su-role-card:hover { border-color: rgba(255,255,255,0.18); transform: translateY(-2px); }
  .su-role-card:hover::before { opacity: 0.6; }

  .su-role-card.active {
    border-color: var(--role-color, #ff6b35);
    box-shadow: 0 0 0 4px var(--role-color-dim, rgba(255,107,53,0.12)), 0 8px 32px rgba(0,0,0,0.3);
    transform: translateY(-2px);
  }
  .su-role-card.active::before { opacity: 1; }

  .su-role-check {
    position: absolute; top: 10px; right: 10px;
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; transition: all 0.2s;
  }
  .su-role-card.active .su-role-check {
    background: var(--role-color, #ff6b35);
    border-color: var(--role-color, #ff6b35);
    color: #fff;
  }
  .su-role-emoji { font-size: 28px; margin-bottom: 8px; display: block; position: relative; z-index: 1; }
  .su-role-name { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px; position: relative; z-index: 1; }
  .su-role-tagline { font-size: 11px; color: rgba(255,255,255,0.35); position: relative; z-index: 1; }

  /* Role description bar */
  .su-role-desc {
    padding: 11px 14px; border-radius: 10px; margin-bottom: 20px;
    font-size: 12px; line-height: 1.55; color: rgba(255,255,255,0.45);
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.025);
    transition: all 0.2s;
  }
  .su-role-desc.donor-desc    { border-color: rgba(255,107,53,0.20); background: rgba(255,107,53,0.05); color: rgba(255,180,130,0.8); }
  .su-role-desc.recipient-desc { border-color: rgba(92,184,92,0.20); background: rgba(92,184,92,0.05); color: rgba(140,220,140,0.8); }

  /* ── FIELDS ── */
  .su-field { margin-bottom: 13px; }
  .su-field label { display: block; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 7px; }
  .su-input-wrap { position: relative; }
  .su-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; pointer-events: none; opacity: 0.30; }
  .su-inp {
    width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px; padding: 13px 14px 13px 40px;
    font-family: 'Outfit', sans-serif; font-size: 14px; color: #fff; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .su-inp::placeholder { color: rgba(255,255,255,0.16); }
  .su-inp:focus { border-color: rgba(255,107,53,0.50); background: rgba(255,107,53,0.04); box-shadow: 0 0 0 3px rgba(255,107,53,0.08); }
  .su-pw-hint { font-size: 10px; color: rgba(255,255,255,0.20); margin-top: 5px; line-height: 1.5; }

  /* ── LOCATION FIELD ── */
  .su-loc-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
    width: 100%;
    min-width: 0;
  }
  .su-loc-input-wrap {
    flex: 1 1 0%;
    min-width: 0;
    position: relative;
    overflow: hidden;
  }
  .su-loc-input-wrap .su-inp {
    width: 100%;
    min-width: 0;
    padding-left: 40px;
    padding-right: 34px;
  }
  .su-loc-clear {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: rgba(255,255,255,0.22);
    font-size: 12px; cursor: pointer; padding: 2px 4px;
    transition: color 0.15s; line-height: 1; z-index: 2;
  }
  .su-loc-clear:hover { color: rgba(255,255,255,0.6); }
  .su-loc-auto {
    flex: 0 0 88px;
    width: 88px;
    display: inline-flex; align-items: center; justify-content: center; gap: 5px;
    padding: 0 8px; min-height: 46px;
    background: rgba(255,107,53,0.10); color: #ff8c5a;
    border: 1px solid rgba(255,107,53,0.28); border-radius: 10px;
    font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700;
    cursor: pointer; white-space: nowrap; transition: background 0.18s; outline: none;
    box-sizing: border-box;
  }
  .su-loc-auto:hover:not(:disabled) { background: rgba(255,107,53,0.18); }
  .su-loc-auto:disabled { opacity: 0.4; cursor: default; }
  .su-loc-spin {
    width: 11px; height: 11px; flex-shrink: 0;
    border: 2px solid rgba(255,140,90,0.25); border-top-color: #ff8c5a;
    border-radius: 50%; animation: suspin 0.7s linear infinite;
  }

  /* location dropdown */
  .su-loc-drop { position: absolute; top: calc(100% + 5px); left: 0; right: 0; z-index: 500; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; box-shadow: 0 16px 48px rgba(0,0,0,0.70); overflow: hidden; max-height: 240px; overflow-y: auto; }
  .su-loc-drop::-webkit-scrollbar { width: 4px; }
  .su-loc-drop::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
  .su-loc-drop-head { padding: 7px 14px; font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.07); }
  .su-loc-opt { padding: 10px 14px; cursor: pointer; display: flex; align-items: flex-start; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.12s; }
  .su-loc-opt:last-child { border-bottom: none; }
  .su-loc-opt:hover { background: rgba(255,107,53,0.07); }
  .su-loc-opt-ico { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .su-loc-opt-main { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 2px; }
  .su-loc-opt-sub  { font-size: 11px; color: rgba(255,255,255,0.35); line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .su-loc-searching { padding: 14px; text-align: center; color: rgba(255,255,255,0.35); font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; }

  /* location status line */
  .su-loc-status { margin-top: 5px; font-size: 11px; font-weight: 500; display: flex; align-items: flex-start; gap: 6px; line-height: 1.5; }
  .su-loc-status.ok   { color: #6ed46e; }
  .su-loc-status.err  { color: #ff7070; }
  .su-loc-status.info { color: rgba(255,255,255,0.40); }
  .su-loc-acc { font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 20px; display: inline-flex; align-items: center; gap: 3px; margin-left: 4px; }
  .su-loc-acc.high { background: rgba(92,184,92,0.12); color: #6ed46e; border: 1px solid rgba(92,184,92,0.25); }
  .su-loc-acc.mid  { background: rgba(251,191,36,0.10); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
  .su-loc-acc.low  { background: rgba(251,113,133,0.10); color: #fb7185; border: 1px solid rgba(251,113,133,0.25); }

  /* ── GENDER ── */
  .su-gender-group { display: flex; gap: 7px; flex-wrap: wrap; }
  .su-gender-opt   { display: none; }
  .su-gender-label { flex: 1; min-width: 80px; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 9px; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.35); cursor: pointer; transition: all 0.18s ease; user-select: none; text-align: center; }
  .su-gender-label:hover { background: rgba(255,107,53,0.07); border-color: rgba(255,107,53,0.25); color: rgba(255,255,255,0.65); }
  .su-gender-opt:checked + .su-gender-label { background: rgba(255,107,53,0.14); border-color: rgba(255,107,53,0.50); color: #ff8c5a; box-shadow: 0 0 0 3px rgba(255,107,53,0.08); }
  .su-gender-emoji { font-size: 14px; }

  /* ── PERKS ── */
  .su-perks { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin: 14px 0 20px; }
  .su-perk { display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: rgba(255,255,255,0.35); padding: 7px 10px; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; transition: background 0.15s, border-color 0.15s; }
  .su-perk:hover { background: rgba(255,107,53,0.06); border-color: rgba(255,107,53,0.20); color: rgba(255,255,255,0.55); }
  .su-perk-emoji { font-size: 13px; flex-shrink: 0; }

  /* ── SUBMIT BUTTON ── */
  .su-btn {
    width: 100%; padding: 15px; margin-top: 4px; border-radius: 10px; border: none;
    background: #ff6b35; color: #fff; font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 9px;
    box-shadow: 0 6px 28px rgba(255,107,53,0.38);
    transition: background 0.2s, transform 0.15s, box-shadow 0.15s, opacity 0.2s;
  }
  .su-btn.recipient-btn { background: #5cb85c; box-shadow: 0 6px 28px rgba(92,184,92,0.35); }
  .su-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(255,107,53,0.48); }
  .su-btn.recipient-btn:hover:not(:disabled) { box-shadow: 0 10px 36px rgba(92,184,92,0.45); }
  .su-btn:active:not(:disabled) { transform: translateY(0); opacity: 0.88; }
  .su-btn:disabled { opacity: 0.36; cursor: not-allowed; transform: none; }

  .su-spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff; border-radius: 50%; animation: suspin 0.65s linear infinite; }
  @keyframes suspin { to { transform: rotate(360deg); } }

  .su-divider { display: flex; align-items: center; gap: 14px; margin: 18px 0 16px; }
  .su-div-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .su-div-txt  { font-size: 11px; color: rgba(255,255,255,0.18); letter-spacing: 2px; }
  .su-footer-row { text-align: center; font-size: 14px; color: rgba(255,255,255,0.26); }
  .su-footer-row a { color: #ff6b35; text-decoration: none; font-weight: 600; transition: color 0.15s; }
  .su-footer-row a:hover { color: #ff8c5a; text-decoration: underline; }
  .su-countdown { text-align: center; font-size: 12px; color: rgba(255,255,255,0.22); margin-top: 10px; }
  .su-countdown b { color: #ff6b35; }

  /* ── TOAST ── */
  .su-toast { position: fixed; top: 22px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 100px; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; z-index: 9999; white-space: nowrap; max-width: 90vw; animation: toastIn 0.3s ease; display: flex; align-items: center; gap: 8px; }
  .su-toast.success { background: rgba(92,184,92,0.12); border: 1px solid rgba(92,184,92,0.35); color: #6ed46e; }
  .su-toast.error   { background: rgba(255,80,80,0.10); border: 1px solid rgba(255,80,80,0.32); color: #ff7070; }
  @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 860px) {
    .su-root { grid-template-columns: 1fr; }
    .su-left { padding: 36px 28px 32px; min-height: auto; }
    .su-right { padding: 40px 28px; min-height: auto; }
    .su-h1 { font-size: 36px; }
    .su-left-content { margin-top: 32px; }
    .su-stats { margin-top: 36px; }
  }
  @media (max-width: 480px) {
    .su-left  { padding: 28px 20px 24px; }
    .su-right { padding: 32px 20px; }
    .su-stats { grid-template-columns: 1fr 1fr; gap: 8px; }
    .su-perks { grid-template-columns: 1fr; }
    .su-form-title { font-size: 26px; }
    .su-h1 { font-size: 30px; }
    .su-role-wrap { grid-template-columns: 1fr 1fr; }
  }
`;

/* ─────────────────────────────────────────────────────────────
   SMART LOCATION FIELD
   Features:
   • GPS auto-detect (enableHighAccuracy, 3-provider waterfall)
   • Nominatim type-ahead search (debounced 350ms)
   • Clear button, keyboard accessible
───────────────────────────────────────────────────────────── */
const LocationField = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = React.useState([]);
  const [showDrop,    setShowDrop]    = React.useState(false);
  const [searching,   setSearching]   = React.useState(false);
  const [detecting,   setDetecting]   = React.useState(false);
  const [status,      setStatus]      = React.useState(null);
  const debounceRef = React.useRef(null);
  const wrapRef     = React.useRef(null);
  const inputRef    = React.useRef(null);

  /* Close on outside click */
  React.useEffect(() => {
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* Build clean address from Nominatim addressdetails */
  const buildAddress = (addr, displayName) => {
    if (!addr) return displayName?.split(",").slice(0, 4).join(", ").trim() || "";
    const road = [addr.house_number, addr.road || addr.pedestrian || addr.footway || addr.path]
      .filter(Boolean).join(" ");
    const sub  = addr.suburb || addr.neighbourhood || addr.quarter || addr.hamlet || "";
    const city = addr.city || addr.town || addr.village || addr.municipality
               || addr.county || addr.state_district || "";
    const state   = addr.state || "";
    const country = addr.country || "";
    const parts   = [road, sub, city, state, country].filter(Boolean);
    const seen = new Set();
    return parts
      .filter(p => { const k = p.toLowerCase().trim(); if (seen.has(k)) return false; seen.add(k); return true; })
      .join(", ");
  };

  /* Type-ahead search */
  const handleInput = (e) => {
    const v = e.target.value;
    onChange(v);
    setStatus(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.trim().length < 2) { setSuggestions([]); setShowDrop(false); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true); setShowDrop(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(v)}&format=json&limit=7&addressdetails=1&namedetails=1`,
          { headers: { "Accept-Language": "en-IN,en" } }
        );
        setSuggestions(await res.json());
      } catch { setSuggestions([]); }
      finally { setSearching(false); }
    }, 350);
  };

  const selectSuggestion = (item) => {
    const full = buildAddress(item.address, item.display_name);
    onChange(full);
    setSuggestions([]); setShowDrop(false);
    setStatus({ type: "ok", text: full });
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) { e.preventDefault(); selectSuggestion(suggestions[0]); }
    if (e.key === "Escape") setShowDrop(false);
  };

  /* GPS auto-detect — 3-provider waterfall */
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setStatus({ type: "err", text: "Geolocation not supported by your browser." });
      return;
    }
    setDetecting(true);
    setStatus({ type: "info", text: "📡 Acquiring GPS — please wait…" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon, accuracy } = pos.coords;
        const accLabel = accuracy <= 20 ? "high" : accuracy <= 100 ? "mid" : "low";
        const accText  = `±${Math.round(accuracy)}m`;
        setStatus({ type: "info", text: "📡 GPS locked, resolving address…", acc: { label: accLabel, text: accText } });

        /* Provider 1: Nominatim zoom=18 */
        const tryNominatim = async () => {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=18`,
            { headers: { "Accept-Language": "en-IN,en" } }
          );
          if (!res.ok) throw new Error("nominatim " + res.status);
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          const text = buildAddress(data.address, data.display_name);
          if (!text) throw new Error("empty");
          return text;
        };

        /* Provider 2: BigDataCloud (no key) */
        const tryBigDataCloud = async () => {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          if (!res.ok) throw new Error("bdc " + res.status);
          const d = await res.json();
          const parts = [d.locality || d.city, d.principalSubdivision, d.countryName].filter(Boolean);
          if (!parts.length) throw new Error("empty bdc");
          return parts.join(", ");
        };

        /* Provider 3: coords fallback */
        const coordFallback = () =>
          `${Math.abs(lat).toFixed(5)}°${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(5)}°${lon >= 0 ? "E" : "W"}`;

        try {
          const text = await tryNominatim();
          onChange(text);
          setStatus({ type: "ok", text, acc: { label: accLabel, text: accText } });
        } catch {
          try {
            const text = await tryBigDataCloud();
            onChange(text);
            setStatus({ type: "ok", text, acc: { label: accLabel, text: accText } });
          } catch {
            const fb = coordFallback();
            onChange(fb);
            setStatus({ type: "err", text: `Couldn't resolve address. Using coordinates: ${fb}` });
          }
        }
        setDetecting(false);
      },
      (err) => {
        setDetecting(false);
        const msgs = {
          1: "Permission denied — allow location access in your browser settings.",
          2: "Location unavailable — check device GPS.",
          3: "Timed out — please try again.",
        };
        setStatus({ type: "err", text: msgs[err.code] || "Could not get location." });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const suggestionIcon = (item) => {
    const t = (item.type || "").toLowerCase();
    const c = (item.class || "").toLowerCase();
    if (["city","town","village","administrative"].includes(t)) return "🏙️";
    if (c === "amenity") return "🏬";
    if (c === "highway") return "🛣️";
    if (["house","building","residential"].includes(t)) return "🏠";
    return "📍";
  };

  return (
    <div style={{ position: "relative", width: "100%", minWidth: 0 }} ref={wrapRef}>
      <div className="su-loc-row">
        <div className="su-loc-input-wrap">
          <span className="su-input-icon" style={{ zIndex: 1, pointerEvents: "none" }}>📍</span>
          <input
            ref={inputRef}
            className="su-inp"
            type="text"
            value={value}
            placeholder="Type address or click Auto"
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setShowDrop(true); }}
            autoComplete="off"
            required
          />
          {value && (
            <button
              type="button" className="su-loc-clear"
              onClick={() => { onChange(""); setSuggestions([]); setShowDrop(false); setStatus(null); inputRef.current?.focus(); }}
            >✕</button>
          )}
          {showDrop && (
            <div className="su-loc-drop">
              <div className="su-loc-drop-head">Search Results</div>
              {searching ? (
                <div className="su-loc-searching"><div className="su-loc-spin" /> Searching…</div>
              ) : suggestions.length === 0 ? (
                <div className="su-loc-searching">No results — try a different term</div>
              ) : suggestions.map(s => (
                <div key={s.place_id} className="su-loc-opt" onMouseDown={e => { e.preventDefault(); selectSuggestion(s); }}>
                  <span className="su-loc-opt-ico">{suggestionIcon(s)}</span>
                  <div>
                    <div className="su-loc-opt-main">
                      {(s.address?.city || s.address?.town || s.address?.village || s.address?.road || s.display_name.split(",")[0]).trim()}
                    </div>
                    <div className="su-loc-opt-sub">{buildAddress(s.address, s.display_name)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className={`su-loc-auto${detecting ? " detecting" : ""}`}
          onClick={detectLocation}
          disabled={detecting}
          title="Auto-detect my location using GPS"
        >
          {detecting ? <><div className="su-loc-spin" /> Detecting…</> : <>📍 Auto</>}
        </button>
      </div>

      {status && (
        <div className={`su-loc-status ${status.type}`}>
          {status.type === "ok" ? "✓ " : status.type === "err" ? "✕ " : ""}
          <span style={{ lineHeight: 1.4 }}>{status.text}</span>
          {status.acc && (
            <span className={`su-loc-acc ${status.acc.label}`}>GPS {status.acc.text}</span>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN SIGNUP COMPONENT
───────────────────────────────────────────────────────────── */
const SignUp = () => {
  const [role,      setRole]      = useState("donor");
  const [form,      setForm]      = useState({ username:"", email:"", password:"", phone:"", gender:"", location:"" });
  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState(null);
  const [countdown, setCountdown] = useState(null);
  const navigate = useNavigate();

  const roleData = ROLES[role];

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) { navigate("/login"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const showToast = (type, message) => {
    setToast({ type, message });
    if (type === "error") setTimeout(() => setToast(null), 4500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!PASSWORD_REGEX.test(form.password)) {
      showToast("error", "Password needs uppercase, lowercase, number & special character.");
      return;
    }
    if (!form.gender) {
      showToast("error", "Please select your gender.");
      return;
    }
    if (!form.location.trim()) {
      showToast("error", "Please enter or detect your location.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/register`, {
        username: form.username,
        email:    form.email,
        password: form.password,
        phone:    form.phone || "",
        gender:   form.gender,
        location: form.location,
        role,
      });
      showToast("success", "Account created! Redirecting to login…");
      localStorage.setItem("userRole", role); // cache role for navbar
      setCountdown(5);
    } catch (err) {
      showToast("error", err?.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Donor: all fields. Recipient: name, email, password, phone, gender, location */
  const isDonor = role === "donor";

  return (
    <>
      <style>{css}</style>

      {toast && (
        <div className={`su-toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      <div className="su-root">

        {/* ════ LEFT ════ */}
        <div className="su-left">
          <div className="su-wordmark">Feed<span>Forward</span></div>
          <div className="su-left-content">
            <div className="su-badge">
              <span className="su-badge-dot" />
              Join the movement
            </div>
            <h1 className="su-h1">
              Waste less.<br />
              Give more.<br />
              <span className="su-h1-green">Live better.</span>
            </h1>
            <p className="su-desc">
              Join thousands of households and businesses already making a difference — one meal at a time.
            </p>
          </div>
          <div className="su-stats">
            {STATS.map(s => (
              <div className="su-stat-card" key={s.lbl}>
                <div className="su-stat-val">{s.val}</div>
                <div className="su-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ════ RIGHT ════ */}
        <div className="su-right">
          <div className="su-form-wrap">

            <div className="su-form-eyebrow">Get started — it's free</div>
            <h2 className="su-form-title">
              Create your <span>account</span>
            </h2>

            {/* ── ROLE SELECTOR ── */}
            <div className="su-role-wrap">
              {Object.entries(ROLES).map(([key, r]) => (
                <div
                  key={key}
                  className={`su-role-card${role === key ? " active" : ""}`}
                  style={{ "--role-color": r.color, "--role-color-dim": r.colorDim }}
                  onClick={() => setRole(key)}
                >
                  <div className="su-role-check">{role === key ? "✓" : ""}</div>
                  <span className="su-role-emoji">{r.emoji}</span>
                  <div className="su-role-name">{r.label}</div>
                  <div className="su-role-tagline">{r.tagline}</div>
                </div>
              ))}
            </div>

            {/* Role description */}
            <div className={`su-role-desc ${role}-desc`}>
              {roleData.desc}
            </div>

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit} key={role}>

              {/* Name */}
              <div className="su-field">
                <label>{isDonor ? "Full Name / Business Name" : "Full Name"}</label>
                <div className="su-input-wrap">
                  <span className="su-input-icon">👤</span>
                  <input
                    className="su-inp" type="text" name="username"
                    placeholder={isDonor ? "Your name or business name" : "Your full name"}
                    value={form.username} onChange={handleChange} required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="su-field">
                <label>Email Address</label>
                <div className="su-input-wrap">
                  <span className="su-input-icon">✉️</span>
                  <input className="su-inp" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              {/* Password */}
              <div className="su-field">
                <label>Password</label>
                <div className="su-input-wrap">
                  <span className="su-input-icon">🔒</span>
                  <input className="su-inp" type="password" name="password" placeholder="Min. 8 chars with symbols" value={form.password} onChange={handleChange} required autoComplete="new-password" />
                </div>
                <div className="su-pw-hint">Must include uppercase, lowercase, number & special character (@$!%*?&)</div>
              </div>

              {/* Phone */}
              <div className="su-field">
                <label>Phone {isDonor ? "" : "(optional)"}</label>
                <div className="su-input-wrap">
                  <span className="su-input-icon">📱</span>
                  <input
                    className="su-inp" type="tel" name="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone} onChange={handleChange}
                    required={isDonor}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="su-field">
                <label>Gender</label>
                <div className="su-gender-group">
                  {[
                    { val:"male",       label:"Male",              emoji:"👨" },
                    { val:"female",     label:"Female",            emoji:"👩" },
                    { val:"other",      label:"Other",             emoji:"🧑" },
                    { val:"prefer_not", label:"Prefer not to say", emoji:"🔒" },
                  ].map(g => (
                    <React.Fragment key={g.val}>
                      <input className="su-gender-opt" type="radio" id={`gender-${g.val}`} name="gender" value={g.val} checked={form.gender === g.val} onChange={handleChange} />
                      <label className="su-gender-label" htmlFor={`gender-${g.val}`}>
                        <span className="su-gender-emoji">{g.emoji}</span>{g.label}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Location — smart field with GPS + search */}
              <div className="su-field">
                <label>Location</label>
                <LocationField
                  value={form.location}
                  onChange={(v) => setForm(f => ({ ...f, location: v }))}
                />
              </div>

              {/* Perks */}
              <div className="su-perks">
                {roleData.perks.map(p => (
                  <div className="su-perk" key={p.text}>
                    <span className="su-perk-emoji">{p.icon}</span>{p.text}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className={`su-btn${role === "recipient" ? " recipient-btn" : ""}`}
                disabled={loading || countdown !== null}
              >
                {loading
                  ? <><span className="su-spinner" />Creating Account…</>
                  : countdown !== null
                    ? `Redirecting in ${countdown}s…`
                    : `Join as ${roleData.label}`
                }
              </button>
            </form>

            {countdown !== null && (
              <p className="su-countdown">
                Taking you to login in <b>{countdown}</b> seconds…
              </p>
            )}

            <div className="su-divider">
              <div className="su-div-line" />
              <span className="su-div-txt">OR</span>
              <div className="su-div-line" />
            </div>

            <p className="su-footer-row">
              Already have an account?&nbsp;<a href="/login">Sign in →</a>
            </p>

          </div>
        </div>

      </div>
    </>
  );
};

export default SignUp;