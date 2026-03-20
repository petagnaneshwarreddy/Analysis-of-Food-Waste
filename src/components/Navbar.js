import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  /* ── RESET ── */
  .nb-nav *, .nb-nav *::before, .nb-nav *::after { box-sizing: border-box; }

  /* ── CSS VARS ── */
  .nb-nav {
    --nav-bg: rgba(6, 9, 6, 0.0);
    --nav-bg-scrolled: rgba(7, 11, 8, 0.92);
    --border: rgba(255,255,255,0.06);
    --border-scrolled: rgba(255,255,255,0.09);
    --lime: #a3e635;
    --lime-dim: rgba(163,230,53,0.10);
    --lime-glow: rgba(163,230,53,0.25);
    --orange: #ff6b35;
    --orange-dim: rgba(255,107,53,0.10);
    --sky: #38bdf8;
    --sky-dim: rgba(56,189,248,0.10);
    --red: #fb7185;
    --red-dim: rgba(251,113,133,0.10);
    --gold: #fbbf24;
    --text: #eef3ee;
    --t2: rgba(238,243,238,0.55);
    --t3: rgba(238,243,238,0.28);
    --t4: rgba(238,243,238,0.10);
    --r: 12px;
    --r-sm: 8px;
    --r-pill: 100px;
  }

  /* ── ROOT NAV ── */
  .nb-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    font-family: 'DM Sans', sans-serif;
    background: var(--nav-bg);
    border-bottom: 1px solid transparent;
    transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    -webkit-font-smoothing: antialiased;
  }
  .nb-nav.scrolled {
    background: var(--nav-bg-scrolled);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border-bottom-color: var(--border-scrolled);
    box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 8px 40px rgba(0,0,0,0.55);
  }

  /* ── PROGRESS LINE (top of nav, animated on scroll) ── */
  .nb-progress {
    position: absolute; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, var(--lime), var(--sky));
    border-radius: 0 2px 2px 0;
    transition: width 0.1s linear;
    pointer-events: none;
    opacity: 0;
  }
  .nb-nav.scrolled .nb-progress { opacity: 1; }

  /* ── BAR ── */
  .nb-bar {
    max-width: 1320px; margin: 0 auto;
    padding: 0 20px; height: 68px;
    display: flex; align-items: center; gap: 0;
    position: relative;
  }

  /* ── LOGO ── */
  .nb-logo {
    text-decoration: none;
    display: flex; align-items: center; gap: 8px;
    flex-shrink: 0; margin-right: 20px;
    position: relative;
  }
  .nb-logo-mark {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, #1a2e1c 0%, #0f1f10 100%);
    border: 1px solid rgba(163,230,53,0.22);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; flex-shrink: 0;
    box-shadow: 0 0 0 0 var(--lime-glow);
    transition: box-shadow 0.3s, transform 0.2s;
  }
  .nb-logo:hover .nb-logo-mark {
    box-shadow: 0 0 0 4px var(--lime-glow);
    transform: scale(1.05);
  }
  .nb-logo-mark::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(circle at 30% 30%, rgba(163,230,53,0.18), transparent 65%);
  }
  .nb-logo-leaf {
    font-size: 16px; position: relative; z-index: 1;
    filter: drop-shadow(0 0 4px rgba(163,230,53,0.5));
    animation: leaf-sway 4s ease-in-out infinite;
  }
  @keyframes leaf-sway {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(4deg); }
  }
  .nb-logo-text { display: flex; flex-direction: column; gap: 0; }
  .nb-logo-primary {
    font-family: 'DM Serif Display', serif;
    font-size: 17px; font-weight: 400; line-height: 1;
    color: var(--text); letter-spacing: -0.3px;
  }
  .nb-logo-primary em { font-style: italic; color: var(--lime); }
  .nb-logo-secondary {
    font-size: 9px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--t3); line-height: 1; margin-top: 2px;
  }

  /* ── DESKTOP LINKS ── */
  .nb-links { display: flex; align-items: center; gap: 2px; list-style: none; margin: 0; padding: 0; flex: 1; }

  .nb-link {
    text-decoration: none; font-size: 12.5px; font-weight: 500;
    color: var(--t2); padding: 6px 9px; border-radius: var(--r-sm);
    transition: color 0.18s, background 0.18s; white-space: nowrap;
    position: relative; display: inline-flex; align-items: center; gap: 5px;
    letter-spacing: -0.1px;
  }
  .nb-link:hover { color: var(--text); background: rgba(255,255,255,0.06); }

  .nb-link.nb-active {
    color: var(--lime); background: var(--lime-dim); font-weight: 600;
  }
  .nb-link.nb-active::before {
    content: '';
    position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
    width: 18px; height: 2px; border-radius: 2px;
    background: var(--lime);
    box-shadow: 0 0 8px var(--lime-glow);
  }

  .nb-link.nb-recipients { color: rgba(56,189,248,0.65); }
  .nb-link.nb-recipients:hover { color: var(--sky); background: var(--sky-dim); }
  .nb-link.nb-recipients.nb-active {
    color: var(--sky); background: var(--sky-dim);
  }
  .nb-link.nb-recipients.nb-active::before { background: var(--sky); box-shadow: 0 0 8px rgba(56,189,248,0.4); }

  /* link icons */
  .nb-link-icon { font-size: 13px; opacity: 0.7; flex-shrink: 0; }

  /* ── ROLE BADGE ── */
  .nb-role-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 9.5px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;
    padding: 3px 9px; border-radius: var(--r-pill);
    white-space: nowrap; flex-shrink: 0;
  }
  .nb-role-badge.donor     { background: rgba(163,230,53,0.08); color: #a3e635; border: 1px solid rgba(163,230,53,0.22); }
  .nb-role-badge.recipient { background: rgba(56,189,248,0.08); color: var(--sky); border: 1px solid rgba(56,189,248,0.22); }

  /* ── AUTH CLUSTER ── */
  .nb-auth { flex-shrink: 0; margin-left: 6px; display: flex; align-items: center; gap: 5px; }

  /* ── DIVIDER ── */
  .nb-divider { width: 1px; height: 22px; background: var(--border-scrolled); flex-shrink: 0; margin: 0 4px; }

  /* ══════════════════════════════════════
     BELL
  ══════════════════════════════════════ */
  .bell-wrap { position: relative; display: inline-flex; align-items: center; }
  .bell-btn {
    position: relative; width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; outline: none;
    transition: background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s;
    flex-shrink: 0;
  }
  .bell-btn:hover {
    background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.14);
    transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  .bell-btn.has-notif { border-color: rgba(251,113,133,0.35); background: rgba(251,113,133,0.06); }
  .bell-btn.has-notif:hover { background: rgba(251,113,133,0.12); }

  .bell-ico { width: 15px; height: 15px; color: var(--t2); transition: color 0.15s; flex-shrink: 0; }
  .bell-btn:hover .bell-ico { color: var(--text); }
  .bell-btn.has-notif .bell-ico { color: var(--red); animation: bell-ring 0.6s ease-in-out; }
  @keyframes bell-ring {
    0%{transform:rotate(0)} 15%{transform:rotate(-15deg)} 35%{transform:rotate(15deg)}
    55%{transform:rotate(-10deg)} 75%{transform:rotate(10deg)} 100%{transform:rotate(0)}
  }
  .bell-badge {
    position: absolute; top: -5px; right: -5px;
    min-width: 16px; height: 16px; background: var(--red);
    border: 2px solid #070b07; border-radius: 99px;
    font-size: 8.5px; font-weight: 800; color: #fff;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px; animation: badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
    pointer-events: none; font-family: 'DM Sans', sans-serif;
  }
  @keyframes badge-pop { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }

  /* ── BELL PANEL ── */
  .bell-panel {
    position: absolute; top: calc(100% + 14px); right: 0;
    width: 380px;
    background: linear-gradient(180deg, #0c1210 0%, #0a100d 100%);
    border: 1px solid rgba(255,255,255,0.10); border-radius: 18px;
    box-shadow: 0 28px 72px rgba(0,0,0,0.80), 0 0 0 1px rgba(255,255,255,0.03) inset;
    z-index: 9999; overflow: hidden;
    animation: panel-in 0.2s cubic-bezier(0.34,1.25,0.64,1);
    transform-origin: top right;
  }
  @keyframes panel-in {
    from { opacity:0; transform: scale(0.94) translateY(-6px); }
    to   { opacity:1; transform: scale(1)    translateY(0); }
  }

  .bell-panel-header {
    padding: 16px 18px 14px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
  }
  .bell-panel-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700; color: var(--text);
    display: flex; align-items: center; gap: 8px;
  }
  .bell-panel-title-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--red); box-shadow: 0 0 6px var(--red); flex-shrink: 0;
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  .bell-mark-all {
    font-size: 11px; font-weight: 600; color: var(--t3);
    background: none; border: none; cursor: pointer;
    transition: color 0.15s; padding: 4px 8px; border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s, background 0.15s;
  }
  .bell-mark-all:hover { color: var(--lime); background: var(--lime-dim); }

  .bell-list { max-height: 320px; overflow-y: auto; }
  .bell-list::-webkit-scrollbar { width: 3px; }
  .bell-list::-webkit-scrollbar-track { background: transparent; }
  .bell-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 3px; }

  .bell-item {
    padding: 13px 18px; display: flex; gap: 11px; align-items: flex-start;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.12s; cursor: default;
  }
  .bell-item:last-child { border-bottom: none; }
  .bell-item:hover { background: rgba(255,255,255,0.025); }
  .bell-item.unread { background: rgba(251,113,133,0.03); }
  .bell-item.unread:hover { background: rgba(251,113,133,0.06); }

  .bell-dot-wrap { padding-top: 4px; flex-shrink: 0; }
  .bell-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 5px var(--red); }
  .bell-dot.read { background: rgba(255,255,255,0.10); box-shadow: none; }

  .bell-item-body { flex: 1; min-width: 0; }
  .bell-item-title { font-size: 12.5px; font-weight: 600; color: var(--text); margin-bottom: 3px; line-height: 1.35; }
  .bell-item-sub   { font-size: 11.5px; color: var(--t2); line-height: 1.5; }
  .bell-item-time  { font-size: 10px; color: var(--t3); margin-top: 5px; }

  .bell-code {
    display: inline-flex; align-items: center; gap: 8px; margin-top: 8px;
    background: rgba(163,230,53,0.07); border: 1px solid rgba(163,230,53,0.20);
    border-radius: 10px; padding: 7px 13px;
    font-family: 'DM Serif Display', serif; font-size: 18px; font-weight: 400;
    color: var(--lime); letter-spacing: 6px; cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .bell-code:hover { background: rgba(163,230,53,0.13); border-color: rgba(163,230,53,0.35); }
  .bell-code-hint { font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 700; color: rgba(163,230,53,0.45); letter-spacing: 0.5px; text-transform: uppercase; }

  .bell-empty { padding: 36px 20px; text-align: center; }
  .bell-empty-ico { font-size: 30px; margin-bottom: 10px; opacity: 0.5; }
  .bell-empty-text { font-size: 13px; color: var(--t3); }

  .bell-footer {
    padding: 9px 18px; border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center; gap: 5px;
    font-size: 10px; color: var(--t3);
  }
  .bell-footer-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--lime); opacity: 0.4; }

  /* ══════════════════════════════════════
     PROFILE CHIP
  ══════════════════════════════════════ */
  .nb-profile-chip {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 4px 10px 4px 4px; border-radius: var(--r-pill);
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    text-decoration: none;
    transition: background 0.18s, border-color 0.18s, transform 0.15s, box-shadow 0.15s;
    cursor: pointer;
  }
  .nb-profile-chip:hover {
    background: rgba(163,230,53,0.07); border-color: rgba(163,230,53,0.22);
    transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }
  .nb-profile-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #1c4020, #0e2411);
    border: 1.5px solid rgba(163,230,53,0.30);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif; font-size: 11px; font-weight: 400;
    color: var(--lime); flex-shrink: 0;
    box-shadow: 0 0 0 0 var(--lime-glow);
    transition: box-shadow 0.2s;
  }
  .nb-profile-chip:hover .nb-profile-avatar { box-shadow: 0 0 0 3px var(--lime-glow); }
  .nb-profile-avatar.recipient-av {
    background: linear-gradient(135deg, #0e2233, #07141e);
    border-color: rgba(56,189,248,0.30); color: var(--sky);
  }
  .nb-profile-chip:hover .nb-profile-avatar.recipient-av { box-shadow: 0 0 0 3px rgba(56,189,248,0.20); }

  .nb-profile-info { display: flex; flex-direction: column; gap: 0; }
  .nb-profile-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.80); max-width: 72px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.2; }
  .nb-profile-sub  { font-size: 9px; font-weight: 500; color: var(--t3); letter-spacing: 0.3px; line-height: 1; margin-top: 1px; }
  .nb-profile-chevron { font-size: 9px; color: var(--t3); margin-left: -2px; transition: transform 0.2s; }
  .nb-profile-chip:hover .nb-profile-chevron { transform: translateY(1px); color: var(--t2); }

  /* ── LOG OUT ── */
  .nb-btn-logout {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 600; letter-spacing: 0.3px;
    padding: 7px 12px; border-radius: var(--r-sm);
    border: 1px solid rgba(251,113,133,0.20);
    background: rgba(251,113,133,0.07); color: rgba(251,113,133,0.80);
    cursor: pointer;
    transition: background 0.18s, color 0.18s, transform 0.14s, border-color 0.18s;
    white-space: nowrap; flex-shrink: 0;
  }
  .nb-btn-logout:hover {
    background: rgba(251,113,133,0.14); color: var(--red);
    border-color: rgba(251,113,133,0.35); transform: translateY(-1px);
  }

  /* ── LOG IN ── */
  .nb-btn-login {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 600;
    padding: 8px 20px; border-radius: var(--r-sm);
    border: 1px solid rgba(163,230,53,0.25);
    background: rgba(163,230,53,0.07); color: rgba(163,230,53,0.85);
    text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
    white-space: nowrap;
    transition: background 0.18s, color 0.18s, transform 0.14s, box-shadow 0.18s;
  }
  .nb-btn-login:hover {
    background: rgba(163,230,53,0.14); color: var(--lime);
    border-color: rgba(163,230,53,0.45); transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(163,230,53,0.15);
  }

  /* ══════════════════════════════════════
     HAMBURGER
  ══════════════════════════════════════ */
  .nb-burger {
    display: none; flex-direction: column; justify-content: center; gap: 5px;
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    cursor: pointer; padding: 0; margin-left: auto; border-radius: var(--r-sm);
    width: 38px; height: 38px; transition: background 0.18s, border-color 0.18s;
    flex-shrink: 0; align-items: center;
  }
  .nb-burger:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); }
  .nb-burger span {
    display: block; width: 18px; height: 1.5px;
    background: rgba(255,255,255,0.65); border-radius: 2px;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease, background 0.2s, width 0.2s;
    transform-origin: center;
  }
  .nb-burger.nb-open { background: rgba(163,230,53,0.08); border-color: rgba(163,230,53,0.22); }
  .nb-burger.nb-open span { background: var(--lime); }
  .nb-burger.nb-open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .nb-burger.nb-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nb-burger.nb-open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ══════════════════════════════════════
     MOBILE DRAWER
  ══════════════════════════════════════ */
  .nb-drawer {
    overflow: hidden; max-height: 0;
    background: rgba(6, 9, 6, 0.98);
    backdrop-filter: blur(28px) saturate(160%);
    -webkit-backdrop-filter: blur(28px) saturate(160%);
    border-top: 1px solid rgba(255,255,255,0.06);
    transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1);
  }
  .nb-drawer.nb-open { max-height: 800px; }
  .nb-drawer-inner { padding: 12px 16px 28px; display: flex; flex-direction: column; gap: 2px; }

  /* Drawer profile card */
  .nb-drawer-profile {
    display: flex; align-items: center; gap: 12px; padding: 14px 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(163,230,53,0.06) 0%, rgba(163,230,53,0.02) 100%);
    border: 1px solid rgba(163,230,53,0.14);
    text-decoration: none; margin-bottom: 10px;
    transition: background 0.18s, border-color 0.18s;
  }
  .nb-drawer-profile:hover { background: rgba(163,230,53,0.10); border-color: rgba(163,230,53,0.22); }
  .nb-drawer-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, #1c4020, #0e2411);
    border: 1.5px solid rgba(163,230,53,0.30);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif; font-size: 15px;
    color: var(--lime); flex-shrink: 0;
  }
  .nb-drawer-avatar.recipient-av {
    background: linear-gradient(135deg, #0e2233, #07141e);
    border-color: rgba(56,189,248,0.30); color: var(--sky);
  }
  .nb-drawer-profile-name { font-size: 14px; font-weight: 700; color: var(--text); }
  .nb-drawer-profile-hint { font-size: 11px; color: var(--t3); margin-top: 2px; }

  .nb-drawer .nb-link {
    font-size: 14.5px; font-weight: 500; padding: 11px 14px; border-radius: 10px;
    display: flex; align-items: center; gap: 9px;
    color: var(--t2);
  }
  .nb-drawer .nb-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
  .nb-drawer .nb-link.nb-active { color: var(--lime); background: var(--lime-dim); }
  .nb-drawer .nb-link.nb-active::before { display: none; }
  .nb-drawer .nb-link.nb-recipients { color: rgba(56,189,248,0.60); }
  .nb-drawer .nb-link.nb-recipients:hover { color: var(--sky); background: var(--sky-dim); }
  .nb-drawer .nb-link.nb-recipients.nb-active { color: var(--sky); background: var(--sky-dim); }

  .nb-drawer-sep { height: 1px; background: rgba(255,255,255,0.06); margin: 10px 2px 10px; }
  .nb-drawer-auth { display: flex; flex-direction: column; gap: 8px; padding: 0 2px; }

  /* ── SPACER ── */
  .nb-spacer { height: 68px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) {
    .nb-link { font-size: 12px; padding: 6px 8px; }
    .nb-link-icon { display: none; }
    .nb-role-badge { display: none; }
    .nb-logo-secondary { display: none; }
    .nb-logo { margin-right: 14px; }
  }
  @media (max-width: 900px) {
    .nb-links { display: none; } .nb-auth { display: none; } .nb-burger { display: flex; }
    .nb-bar { padding: 0 20px; height: 62px; } .nb-spacer { height: 62px; }
    .nb-logo { margin-right: 0; }
  }
  @media (max-width: 480px) {
    .nb-bar { padding: 0 16px; height: 58px; } .nb-spacer { height: 58px; }
    .nb-logo-primary { font-size: 15px; } .nb-logo-mark { width: 30px; height: 30px; }
    .bell-panel { width: calc(100vw - 28px); right: -6px; }
    .nb-drawer-inner { padding: 10px 12px 24px; }
    .nb-drawer .nb-link { font-size: 14px; padding: 10px 12px; }
  }
`;

/* ── Nav items ── */
const NAV_ITEMS = [
  { to: "/",                label: "Home",              icon: "⌂",  donorOnly: false, sky: false },
  { to: "/display",         label: "Food Feed",         icon: "🌿", donorOnly: false, sky: false },
  { to: "/find-recipients", label: "Find Recipients",   icon: "🔍", donorOnly: true,  sky: true  },
  { to: "/inventory",       label: "Inventory",         icon: "🍱", donorOnly: true,  sky: false },
  { to: "/recipeSearch",    label: "Recipes",           icon: "🍳", donorOnly: true,  sky: false },
  { to: "/wasteAnalysis",   label: "Donate",    icon: "📦", donorOnly: true,  sky: false },
  { to: "/ecopro",          label: "Kitchen Analytics", icon: "⚡", donorOnly: true,  sky: false },
];

const getInitials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "U";

const relTime = (iso) => {
  if (!iso) return "";
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60)    return "just now";
  if (d < 3600)  return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
};

/* ══ BELL DROPDOWN ══ */
const BellDropdown = () => {
  const [notifs, setNotifs] = useState([]);
  const [copied, setCopied] = useState(null);

  const fetchNotifs = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = async () => {
    setNotifs(p => p.map(n => ({ ...n, read: true })));
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* ignore */ }
  };

  const markRead = async (id) => {
    setNotifs(p => p.map(n => n._id === id ? { ...n, read: true } : n));
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* ignore */ }
  };

  const copyCode = (notif) => {
    if (!notif.code) return;
    navigator.clipboard.writeText(notif.code).then(() => {
      setCopied(notif._id);
      setTimeout(() => setCopied(null), 2000);
      markRead(notif._id);
    });
  };

  return (
    <div className="bell-panel">
      <div className="bell-panel-header">
        <div className="bell-panel-title">
          {unread > 0 && <span className="bell-panel-title-dot" />}
          Notifications
          {unread > 0 && (
            <span style={{
              background: "rgba(251,113,133,0.12)", color: "var(--red)",
              border: "1px solid rgba(251,113,133,0.22)",
              borderRadius: "99px", fontSize: "9px", fontWeight: 800,
              padding: "2px 8px", letterSpacing: "0.5px"
            }}>
              {unread} NEW
            </span>
          )}
        </div>
        {unread > 0 && (
          <button className="bell-mark-all" onClick={markAllRead}>Mark all read</button>
        )}
      </div>

      <div className="bell-list">
        {notifs.length === 0 ? (
          <div className="bell-empty">
            <div className="bell-empty-ico">🔕</div>
            <div className="bell-empty-text">No notifications yet</div>
          </div>
        ) : (
          notifs.map(notif => (
            <div
              key={notif._id}
              className={`bell-item ${notif.read ? "" : "unread"}`}
              onClick={() => markRead(notif._id)}
            >
              <div className="bell-dot-wrap">
                <div className={`bell-dot ${notif.read ? "read" : ""}`} />
              </div>
              <div className="bell-item-body">
                <div className="bell-item-title">{notif.title}</div>
                <div className="bell-item-sub">{notif.message}</div>
                {notif.code && (
                  <div
                    className="bell-code"
                    onClick={e => { e.stopPropagation(); copyCode(notif); }}
                    title="Tap to copy"
                  >
                    {notif.code}
                    <span className="bell-code-hint">
                      {copied === notif._id ? "✓ Copied!" : "tap to copy"}
                    </span>
                  </div>
                )}
                <div className="bell-item-time">{relTime(notif.createdAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bell-footer">
        <span className="bell-footer-dot" />
        Live · auto-refreshes every 20s
      </div>
    </div>
  );
};

/* ══ BELL BUTTON ══ */
const BellButton = () => {
  const [open,   setOpen]   = useState(false);
  const [unread, setUnread] = useState(0);
  const wrapRef  = useRef(null);
  const pollRef  = useRef(null);

  const fetchCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const arr = Array.isArray(data) ? data : [];
      setUnread(arr.filter(n => !n.read).length);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchCount();
    pollRef.current = setInterval(fetchCount, 20000);
    return () => clearInterval(pollRef.current);
  }, [fetchCount]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    setOpen(v => !v);
    if (!open) setUnread(0);
  };

  return (
    <div className="bell-wrap" ref={wrapRef}>
      <button
        className={`bell-btn ${unread > 0 ? "has-notif" : ""}`}
        onClick={handleToggle}
        title={unread > 0 ? `${unread} new notification${unread !== 1 ? "s" : ""}` : "Notifications"}
        aria-label="Notifications"
      >
        <svg className="bell-ico" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="bell-badge">{unread > 99 ? "99+" : unread}</span>
        )}
      </button>
      {open && <BellDropdown />}
    </div>
  );
};

/* ══ SCROLL PROGRESS HOOK ══ */
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 || 0;
      setProgress(pct);
      setScrolled(el.scrollTop > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { progress, scrolled };
};

/* ══ MAIN NAVBAR ══ */
const Navbar = () => {
  const { loggedIn } = useContext(AuthContext);
  const location = useLocation();
  const { progress, scrolled } = useScrollProgress();
  const [open,     setOpen]     = useState(false);
  const [username, setUsername] = useState("");
  const [role,     setRole]     = useState(null);

  useEffect(() => {
    if (!loggedIn) { setUsername(""); setRole(null); return; }

    let foundRole = null;
    let foundName = null;

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.username || payload.name) foundName = payload.username || payload.name;
        if (payload.role) foundRole = payload.role;
      }
    } catch { /* ignore */ }

    if (foundName) setUsername(foundName);

    if (!foundRole) {
      const stored = localStorage.getItem("userRole");
      if (stored === "donor" || stored === "recipient") foundRole = stored;
    }

    if (foundRole) { setRole(foundRole); return; }

    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${API_BASE}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.data?.username && !foundName) setUsername(r.data.username);
        const apiRole = r.data?.role;
        if (apiRole === "donor" || apiRole === "recipient") {
          setRole(apiRole);
          localStorage.setItem("userRole", apiRole);
        } else {
          setRole("donor");
          localStorage.setItem("userRole", "donor");
        }
      })
      .catch(() => { setRole("donor"); });
  }, [loggedIn]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const isRecipient  = role === "recipient";
  const visibleItems = NAV_ITEMS.filter(item => !isRecipient || !item.donorOnly);

  const initials    = getInitials(username);
  const displayName = username || "Profile";

  const roleLabel = role === "donor"
    ? { text: "Donor",     cls: "donor"     }
    : role === "recipient"
    ? { text: "Recipient", cls: "recipient" }
    : null;

  return (
    <>
      <style>{css}</style>

      <nav className={`nb-nav${scrolled ? " scrolled" : ""}`}>

        {/* ── SCROLL PROGRESS LINE ── */}
        <div
          className="nb-progress"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />

        {/* ── TOP BAR ── */}
        <div className="nb-bar">

          {/* LOGO */}
          <Link to="/" className="nb-logo" aria-label="FeedForward home">
            <div className="nb-logo-mark" aria-hidden="true">
              <span className="nb-logo-leaf">🌿</span>
            </div>
            <div className="nb-logo-text">
              <div className="nb-logo-primary">
                Feed<em>Forward</em>
              </div>
              <div className="nb-logo-secondary">Food Donation Network</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="nb-links">
            {visibleItems.map(({ to, label, icon, sky }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={[
                    "nb-link",
                    isActive(to) ? "nb-active" : "",
                    sky ? "nb-recipients" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <span className="nb-link-icon" aria-hidden="true">{icon}</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop auth cluster */}
          <div className="nb-auth">
            {loggedIn ? (
              <>
                <BellButton />
                <div className="nb-divider" aria-hidden="true" />

                {roleLabel && (
                  <span className={`nb-role-badge ${roleLabel.cls}`}>
                    {roleLabel.text}
                  </span>
                )}

                <Link to="/profile" className="nb-profile-chip" title="View profile">
                  <div className={`nb-profile-avatar${isRecipient ? " recipient-av" : ""}`}>
                    {initials}
                  </div>
                  <div className="nb-profile-info">
                    <div className="nb-profile-name">{displayName}</div>
                    <div className="nb-profile-sub">View profile</div>
                  </div>
                  <span className="nb-profile-chevron" aria-hidden="true">▾</span>
                </Link>


              </>
            ) : (
              <Link to="/login" className="nb-btn-login">
                <span>→</span> Sign In
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`nb-burger${open ? " nb-open" : ""}`}
            onClick={() => setOpen(v => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nb-drawer"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* ── MOBILE DRAWER ── */}
        <div
          id="nb-drawer"
          className={`nb-drawer${open ? " nb-open" : ""}`}
          aria-hidden={!open}
        >
          <div className="nb-drawer-inner">

            {loggedIn && (
              <Link to="/profile" className="nb-drawer-profile">
                <div className={`nb-drawer-avatar${isRecipient ? " recipient-av" : ""}`}>
                  {initials}
                </div>
                <div>
                  <div className="nb-drawer-profile-name">
                    {displayName}
                    {roleLabel && (
                      <span
                        className={`nb-role-badge ${roleLabel.cls}`}
                        style={{ marginLeft: 8, fontSize: "9px" }}
                      >
                        {roleLabel.text}
                      </span>
                    )}
                  </div>
                  <div className="nb-drawer-profile-hint">Tap to view profile →</div>
                </div>
              </Link>
            )}

            {visibleItems.map(({ to, label, icon, sky }) => (
              <Link
                key={to}
                to={to}
                className={[
                  "nb-link",
                  isActive(to) ? "nb-active" : "",
                  sky ? "nb-recipients" : "",
                ].filter(Boolean).join(" ")}
              >
                <span aria-hidden="true">{icon}</span>
                {label}
              </Link>
            ))}

            <div className="nb-drawer-sep" aria-hidden="true" />

            <div className="nb-drawer-auth">
              {loggedIn ? (
                <div style={{ padding: "10px 2px 0", fontSize: 11, color: "var(--t3)", textAlign: "center", letterSpacing: "0.5px" }}>
                  Sign out from your <Link to="/profile" style={{ color: "var(--lime)", textDecoration: "none", fontWeight: 600 }}>Profile page</Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="nb-btn-login"
                  style={{
                    width: "100%", justifyContent: "center",
                    padding: "13px", borderRadius: "10px", fontSize: "13px",
                  }}
                >
                  <span>→</span> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

      </nav>

      <div className="nb-spacer" aria-hidden="true" />
    </>
  );
};

export default Navbar;