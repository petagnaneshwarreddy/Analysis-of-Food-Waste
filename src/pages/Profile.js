import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Cabinet+Grotesk:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:      #09110a;
    --ink2:     #0f1a10;
    --ink3:     #162018;
    --glass:    rgba(255,255,255,0.035);
    --glass2:   rgba(255,255,255,0.06);
    --rim:      rgba(255,255,255,0.07);
    --rim2:     rgba(255,255,255,0.12);
    --txt:      #dfeee0;
    --txt2:     rgba(223,238,224,0.52);
    --txt3:     rgba(223,238,224,0.24);
    --txt4:     rgba(223,238,224,0.08);
    --jade:     #3ecf6e;
    --jade2:    rgba(62,207,110,0.12);
    --jade3:    rgba(62,207,110,0.22);
    --jade4:    rgba(62,207,110,0.06);
    --coral:    #ff6b6b;
    --coral2:   rgba(255,107,107,0.10);
    --amber:    #f5a623;
    --amber2:   rgba(245,166,35,0.10);
    --sky:      #5eb8f5;
    --sky2:     rgba(94,184,245,0.10);
    --lilac:    #b98cf5;
    --lilac2:   rgba(185,140,245,0.10);
    --mono:     'DM Mono', monospace;
    --sans:     'Cabinet Grotesk', sans-serif;
    --serif:    'DM Serif Display', serif;
    --ease:     cubic-bezier(0.22, 1, 0.36, 1);
  }

  .p-root {
    min-height: 100vh;
    background: var(--ink);
    font-family: var(--sans);
    color: var(--txt);
    overflow-x: hidden;
  }

  /* ─────────────────────────────
     COVER — full-width cinematic top
  ───────────────────────────────*/
  .p-cover {
    position: relative;
    height: 260px;
    background: var(--ink2);
    overflow: hidden;
  }
  /* animated mesh gradient */
  .p-cover-mesh {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 120% at 10% 60%,  rgba(62,207,110,0.14) 0%, transparent 55%),
      radial-gradient(ellipse 60% 100% at 90% -10%, rgba(94,184,245,0.09) 0%, transparent 50%),
      radial-gradient(ellipse 50% 80%  at 50% 120%, rgba(185,140,245,0.07) 0%, transparent 55%);
    animation: meshShift 12s ease-in-out infinite alternate;
  }
  @keyframes meshShift {
    from { transform: scale(1) translateX(0); }
    to   { transform: scale(1.06) translateX(12px); }
  }
  /* scan line texture */
  .p-cover-lines {
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,0.08) 3px,
      rgba(0,0,0,0.08) 4px
    );
    pointer-events: none;
  }
  .p-cover-bottom {
    position: absolute; bottom: 0; left: 0; right: 0; height: 80px;
    background: linear-gradient(to bottom, transparent, var(--ink));
  }

  /* ─────────────────────────────
     IDENTITY — avatar row, overlaps cover
  ───────────────────────────────*/
  .p-identity {
    max-width: 1040px; margin: 0 auto;
    padding: 0 28px;
    position: relative;
    margin-top: -72px;
    z-index: 10;
  }
  .p-identity-row {
    display: flex; align-items: flex-end;
    gap: 24px; flex-wrap: wrap;
  }

  /* avatar */
  .p-avatar-shell {
    position: relative; flex-shrink: 0;
  }
  .p-avatar {
    width: 120px; height: 120px; border-radius: 28px;
    background: linear-gradient(145deg, #2aad52, #1a7a38);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--serif); font-size: 44px; font-weight: 400;
    color: #fff; letter-spacing: -1px;
    box-shadow:
      0 0 0 3px var(--ink),
      0 0 0 5px rgba(62,207,110,0.30),
      0 20px 60px rgba(0,0,0,0.60);
    user-select: none;
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
    cursor: default;
  }
  .p-avatar:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow:
      0 0 0 3px var(--ink),
      0 0 0 5px rgba(62,207,110,0.45),
      0 28px 72px rgba(0,0,0,0.70);
  }
  .p-avatar-ring {
    position: absolute; inset: -7px; border-radius: 34px;
    border: 1.5px solid rgba(62,207,110,0.20);
    animation: ringPulse 4s ease-in-out infinite;
  }
  @keyframes ringPulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50%       { opacity: 0.8; transform: scale(1.02); }
  }
  .p-online {
    position: absolute; bottom: 6px; right: 6px;
    width: 16px; height: 16px; border-radius: 6px;
    background: var(--jade);
    border: 2.5px solid var(--ink);
    box-shadow: 0 0 10px rgba(62,207,110,0.6);
  }

  /* name block */
  .p-name-block { flex: 1; min-width: 200px; padding-bottom: 8px; }
  .p-name-pre {
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--jade); margin-bottom: 8px;
    display: flex; align-items: center; gap: 9px;
  }
  .p-name-pre::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--jade3), transparent);
    max-width: 80px;
  }
  .p-name {
    font-family: var(--serif);
    font-size: clamp(30px, 4vw, 46px);
    font-weight: 400; line-height: 1.0;
    letter-spacing: -0.5px; color: #f0f8f0;
    margin-bottom: 6px;
  }
  .p-email {
    font-family: var(--mono); font-size: 12px;
    color: var(--txt3); letter-spacing: 0.3px;
  }

  /* action row */
  .p-action-row {
    padding-bottom: 8px; display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0;
  }

  /* UID pill */
  .p-uid {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 10px;
    background: var(--jade4); border: 1px solid var(--jade3);
    font-family: var(--mono); font-size: 13px; font-weight: 500;
    color: var(--jade); cursor: pointer; user-select: none;
    transition: all 0.2s var(--ease);
    position: relative; overflow: hidden;
  }
  .p-uid::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(62,207,110,0.06), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s var(--ease);
  }
  .p-uid:hover::before { transform: translateX(100%); }
  .p-uid:hover { background: var(--jade2); border-color: rgba(62,207,110,0.40); }
  .p-uid-label {
    font-size: 8px; font-weight: 700; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--txt3);
  }
  .p-uid-copy { font-size: 12px; opacity: 0.4; }

  /* logout */
  .p-logout {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 10px;
    background: var(--coral2); border: 1px solid rgba(255,107,107,0.20);
    color: var(--coral); font-family: var(--sans);
    font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
    cursor: pointer; transition: all 0.2s var(--ease);
  }
  .p-logout:hover {
    background: rgba(255,107,107,0.17);
    border-color: rgba(255,107,107,0.38);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(255,107,107,0.15);
  }

  /* tags row */
  .p-tags {
    display: flex; gap: 7px; flex-wrap: wrap;
    margin-top: 14px;
  }
  .p-tag {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 8px;
    transition: all 0.18s;
  }
  .p-tag-g  { background: var(--jade4);  border: 1px solid var(--jade3);  color: var(--jade); }
  .p-tag-s  { background: var(--sky2);   border: 1px solid rgba(94,184,245,0.22); color: var(--sky); }
  .p-tag-l  { background: var(--lilac2); border: 1px solid rgba(185,140,245,0.22); color: var(--lilac); }
  .p-tag-d  { background: var(--glass);  border: 1px solid var(--rim);  color: var(--txt3); font-size: 10px; }

  /* ─────────────────────────────
     DIVIDER
  ───────────────────────────────*/
  .p-divider {
    max-width: 1040px; margin: 28px auto 0; padding: 0 28px;
  }
  .p-divider-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--rim2), var(--rim), transparent);
  }

  /* ─────────────────────────────
     BODY GRID
  ───────────────────────────────*/
  .p-body {
    max-width: 1040px; margin: 28px auto 60px; padding: 0 28px;
    display: grid;
    grid-template-columns: 340px 1fr;
    grid-template-rows: auto auto auto;
    gap: 16px;
  }
  @media (max-width: 800px) {
    .p-body { grid-template-columns: 1fr; }
    .p-full { grid-column: 1 !important; }
  }
  .p-full { grid-column: 1 / -1; }

  /* ─────────────────────────────
     CARD BASE
  ───────────────────────────────*/
  .p-card {
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    transition: border-color 0.25s var(--ease), box-shadow 0.25s var(--ease);
  }
  .p-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.04) 100%);
  }
  .p-card:hover {
    border-color: var(--rim2);
    box-shadow: 0 12px 48px rgba(0,0,0,0.30);
  }

  .p-card-head {
    padding: 20px 24px 0;
    display: flex; align-items: center; justify-content: space-between;
  }
  .p-card-title-group { display: flex; align-items: center; gap: 11px; }
  .p-card-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .p-card-title {
    font-family: var(--sans); font-size: 13px; font-weight: 700;
    letter-spacing: 0.2px; color: var(--txt2);
  }
  .p-badge {
    font-family: var(--mono); font-size: 8px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--txt3); padding: 3px 9px; border-radius: 5px;
    background: var(--txt4); border: 1px solid var(--rim);
  }
  .p-card-body { padding: 18px 24px 24px; }

  /* ─────────────────────────────
     INFO ROWS
  ───────────────────────────────*/
  .p-rows { display: flex; flex-direction: column; }
  .p-row {
    display: flex; align-items: center;
    justify-content: space-between; gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.045);
  }
  .p-row:first-child { padding-top: 0; }
  .p-row:last-child  { border-bottom: none; padding-bottom: 0; }
  .p-row-left { display: flex; align-items: center; gap: 10px; }
  .p-row-ico {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }
  .p-row-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--txt3);
  }
  .p-row-val {
    font-family: var(--mono); font-size: 12.5px;
    font-weight: 500; color: var(--txt);
    text-align: right; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap;
    max-width: 175px;
  }
  .p-row-val.name { font-family: var(--sans); font-size: 14px; font-weight: 700; }
  .p-row-val.muted { color: var(--txt3); font-style: italic; font-family: var(--sans); font-size: 12px; }
  .p-row-val.id {
    color: var(--jade); font-size: 13px; font-weight: 600;
    background: var(--jade4); padding: 3px 10px; border-radius: 6px;
    border: 1px solid var(--jade3);
  }

  /* ─────────────────────────────
     STAT TILES
  ───────────────────────────────*/
  .p-tiles {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }
  .p-tile {
    border-radius: 14px; padding: 18px 16px 16px;
    position: relative; overflow: hidden;
    transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
    cursor: default;
  }
  .p-tile:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(0,0,0,0.40); }
  .p-tile-glow {
    position: absolute; top: -24px; right: -24px;
    width: 80px; height: 80px; border-radius: 50%;
    filter: blur(28px); opacity: 0.5; pointer-events: none;
  }
  .p-tile-emoji { font-size: 20px; margin-bottom: 10px; position: relative; }
  .p-tile-val {
    font-family: var(--serif);
    font-size: 32px; font-weight: 400;
    line-height: 1; letter-spacing: -1px;
    position: relative;
  }
  .p-tile-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(223,238,224,0.30);
    margin-top: 7px; position: relative;
  }

  /* approval bar */
  .p-bar-wrap { margin-top: 18px; }
  .p-bar-head {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 8px;
    font-family: var(--mono); font-size: 10px;
    letter-spacing: 1.5px; text-transform: uppercase; color: var(--txt3);
  }
  .p-bar-head span:last-child { color: var(--jade); font-weight: 600; }
  .p-bar-track {
    height: 5px; border-radius: 99px;
    background: rgba(255,255,255,0.06); overflow: hidden;
  }
  .p-bar-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, #2aad52, #3ecf6e);
    transition: width 1s var(--ease);
    position: relative;
  }
  .p-bar-fill::after {
    content: '';
    position: absolute; top: 0; right: 0; bottom: 0; width: 30px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25));
  }

  /* ─────────────────────────────
     EDIT SECTION
  ───────────────────────────────*/
  .p-edit-cta {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 12px 22px; border-radius: 12px;
    background: var(--lilac2); border: 1px dashed rgba(185,140,245,0.30);
    color: var(--lilac); font-family: var(--sans);
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s var(--ease);
    letter-spacing: 0.3px;
  }
  .p-edit-cta:hover {
    background: rgba(185,140,245,0.16);
    border-color: rgba(185,140,245,0.50);
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(185,140,245,0.12);
  }
  .p-edit-cta-icon { font-size: 16px; }

  /* form grid */
  .p-form-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px 22px;
  }
  @media (max-width: 700px) { .p-form-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .p-form-grid { grid-template-columns: 1fr; } }

  .p-field { display: flex; flex-direction: column; gap: 8px; }
  .p-field-label {
    font-family: var(--mono); font-size: 9px; font-weight: 600;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--txt3); display: flex; align-items: center; gap: 6px;
  }
  .p-inp {
    width: 100%;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 12px 15px;
    font-family: var(--sans); font-size: 14px; font-weight: 500;
    color: var(--txt); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .p-inp::placeholder { color: rgba(223,238,224,0.16); }
  .p-inp:focus {
    border-color: rgba(62,207,110,0.40);
    box-shadow: 0 0 0 3px rgba(62,207,110,0.07);
    background: rgba(62,207,110,0.03);
  }
  .p-inp:disabled {
    opacity: 0.22; cursor: not-allowed;
  }

  /* gender pills */
  .p-gender-group { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 2px; }
  .p-g-opt { display: none; }
  .p-g-lbl {
    flex: 1; min-width: 72px;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 10px 8px; border-radius: 10px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    font-size: 12px; font-weight: 600; color: var(--txt3);
    cursor: pointer; transition: all 0.18s var(--ease);
    user-select: none; text-align: center;
  }
  .p-g-lbl:hover {
    background: rgba(62,207,110,0.07);
    border-color: rgba(62,207,110,0.22);
    color: var(--txt2);
  }
  .p-g-opt:checked + .p-g-lbl {
    background: var(--jade4);
    border-color: rgba(62,207,110,0.40);
    color: var(--jade);
    box-shadow: 0 0 0 3px rgba(62,207,110,0.07);
  }

  /* form note + divider */
  .p-form-note {
    font-family: var(--mono); font-size: 9px;
    letter-spacing: 1px; color: var(--txt3); margin-top: 4px;
  }
  .p-form-sep {
    height: 1px; margin: 18px 0;
    background: linear-gradient(90deg, transparent, var(--rim2), transparent);
  }

  /* save / cancel */
  .p-form-btns { display: flex; gap: 10px; flex-wrap: wrap; }
  .p-btn-save {
    padding: 13px 30px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #2aad52, #3ecf6e);
    color: #05120a; font-family: var(--sans);
    font-size: 13px; font-weight: 800; letter-spacing: 0.5px;
    cursor: pointer; transition: all 0.2s var(--ease);
    box-shadow: 0 6px 24px rgba(62,207,110,0.28);
  }
  .p-btn-save:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(62,207,110,0.38);
  }
  .p-btn-save:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .p-btn-cancel {
    padding: 13px 24px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.09);
    background: transparent; color: var(--txt2);
    font-family: var(--sans); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s var(--ease);
  }
  .p-btn-cancel:hover { border-color: var(--rim2); color: var(--txt); }

  /* ─────────────────────────────
     TOAST
  ───────────────────────────────*/
  .p-toast {
    position: fixed; top: 22px; left: 50%;
    transform: translateX(-50%);
    padding: 12px 22px; border-radius: 12px;
    font-family: var(--sans); font-size: 13px; font-weight: 600;
    z-index: 9999; white-space: nowrap; max-width: 90vw;
    display: flex; align-items: center; gap: 9px;
    backdrop-filter: blur(16px);
    animation: toastPop 0.35s var(--ease);
  }
  .p-toast.ok  { background: rgba(62,207,110,0.10); border: 1px solid rgba(62,207,110,0.28); color: var(--jade); box-shadow: 0 8px 32px rgba(62,207,110,0.12); }
  .p-toast.err { background: rgba(255,107,107,0.10); border: 1px solid rgba(255,107,107,0.28); color: var(--coral); box-shadow: 0 8px 32px rgba(255,107,107,0.12); }
  @keyframes toastPop {
    from { opacity: 0; transform: translateX(-50%) translateY(-16px) scale(0.92); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }

  /* ─────────────────────────────
     SPINNER / LOGIN
  ───────────────────────────────*/
  .p-spin {
    width: 36px; height: 36px;
    border: 2px solid rgba(255,255,255,0.06);
    border-top-color: var(--jade);
    border-radius: 50%; animation: spin 0.75s linear infinite;
    margin: 120px auto; display: block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .p-login {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    background: var(--ink); font-family: var(--serif);
    font-size: 22px; color: var(--txt3); text-align: center; padding: 24px;
  }

  /* ─────────────────────────────
     RESPONSIVE
  ───────────────────────────────*/
  @media (max-width: 640px) {
    .p-cover { height: 180px; }
    .p-identity { margin-top: -52px; padding: 0 16px; }
    .p-avatar { width: 90px; height: 90px; font-size: 32px; border-radius: 20px; }
    .p-name { font-size: 28px; }
    .p-body { padding: 0 16px; margin-top: 20px; gap: 12px; }
    .p-card-head { padding: 16px 18px 0; }
    .p-card-body { padding: 14px 18px 18px; }
    .p-identity-row { gap: 16px; }
    .p-action-row { padding-bottom: 4px; }
    .p-tiles { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 400px) {
    .p-action-row { flex-direction: column; align-items: flex-start; }
    .p-tiles { grid-template-columns: 1fr; }
  }

  /* entry animation */
  .p-fade-up {
    animation: fadeUp 0.5s var(--ease) both;
  }
  .p-fade-up:nth-child(2) { animation-delay: 0.07s; }
  .p-fade-up:nth-child(3) { animation-delay: 0.14s; }
  .p-fade-up:nth-child(4) { animation-delay: 0.21s; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

/* ── helpers ── */
const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "?";

const fmtDate = (iso) => {
  if (!iso) return null;
  try { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return null; }
};

const GENDER_META = {
  male:       { emoji: "👨", label: "Male"              },
  female:     { emoji: "👩", label: "Female"            },
  other:      { emoji: "🧑", label: "Other"             },
  prefer_not: { emoji: "🔒", label: "Prefer not to say" },
};

/* ════════════════════════════════════════ */

const Profile = () => {
  const { loggedIn, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [copied,  setCopied]  = useState(false);
  const [stats,   setStats]   = useState({ total: 0, approved: 0 });
  const [form,    setForm]    = useState({ username: "", phone: "", gender: "" });

  useEffect(() => {
    if (!loggedIn) { setLoading(false); return; }
    fetchUser();
    fetchStats();
  }, [loggedIn]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      setForm({ username: data.username || "", phone: data.phone || "", gender: data.gender || "" });
    } catch {
      try {
        const token = localStorage.getItem("token");
        const p = JSON.parse(atob(token.split(".")[1]));
        const u = { username: p.username || p.name || "User", email: p.email || "", phone: "", gender: "" };
        setUser(u); setForm({ username: u.username, phone: "", gender: "" });
      } catch { setUser({ username: "User", email: "", phone: "", gender: "" }); }
    } finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/api/waste`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setStats({ total: list.length, approved: list.filter(r => r.approved).length });
    } catch { /* non-critical */ }
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3200);
  };

  const copyId = () => {
    if (!user?.userId) return;
    navigator.clipboard.writeText(user.userId).then(() => {
      setCopied(true);
      showToast("ok", `ID "${user.userId}" copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${API_BASE}/api/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(prev => ({ ...prev, ...data }));
      setForm({ username: data.username || form.username, phone: data.phone ?? form.phone, gender: data.gender ?? form.gender });
      showToast("ok", "Profile saved successfully");
      setEditing(false);
    } catch (err) {
      showToast("err", err?.response?.data?.error || "Failed to save changes");
    } finally { setSaving(false); }
  };

  /* gates */
  if (!loggedIn) return (
    <>
      <style>{css}</style>
      <div className="p-login">
        <span style={{ fontSize: 52 }}>🔒</span>
        Please sign in to view your profile.
      </div>
    </>
  );
  if (loading) return (
    <>
      <style>{css}</style>
      <div className="p-root"><div className="p-spin" /></div>
    </>
  );

  /* derived */
  const ini         = initials(user?.username);
  const memberSince = fmtDate(user?.createdAt);
  const pending     = stats.total - stats.approved;
  const pct         = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
  const gMeta       = GENDER_META[user?.gender] || null;

  return (
    <>
      <style>{css}</style>

      {toast && (
        <div className={`p-toast ${toast.type}`}>
          {toast.type === "ok" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="p-root">

        {/* ══ COVER ══ */}
        <div className="p-cover">
          <div className="p-cover-mesh" />
          <div className="p-cover-lines" />
          <div className="p-cover-bottom" />
        </div>

        {/* ══ IDENTITY ══ */}
        <div className="p-identity">
          <div className="p-identity-row">

            {/* Avatar */}
            <div className="p-avatar-shell">
              <div className="p-avatar-ring" />
              <div className="p-avatar">{ini}</div>
              <div className="p-online" title="Online" />
            </div>

            {/* Name block */}
            <div className="p-name-block">
              <div className="p-name-pre">Member Profile</div>
              <div className="p-name" title={user?.username}>{user?.username || "User"}</div>
              <div className="p-email">{user?.email || "—"}</div>
            </div>

            {/* Actions */}
            <div className="p-action-row">
              {user?.userId && (
                <div className="p-uid" onClick={copyId} title="Click to copy">
                  <span className="p-uid-label">ID</span>
                  <span style={{ letterSpacing: "1px" }}>{user.userId}</span>
                  <span className="p-uid-copy">{copied ? "✓" : "⎘"}</span>
                </div>
              )}
              <button className="p-logout" onClick={() => { handleLogout(); navigate("/login"); }}>
                <span>↩</span> Sign Out
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="p-tags">
            <span className="p-tag p-tag-g">● Active Member</span>
            {gMeta && <span className="p-tag p-tag-s">{gMeta.emoji} {gMeta.label}</span>}
            {user?.phone && <span className="p-tag p-tag-l">📱 {user.phone}</span>}
            {memberSince && <span className="p-tag p-tag-d">🗓 Joined {memberSince}</span>}
          </div>
        </div>

        {/* ══ DIVIDER ══ */}
        <div className="p-divider"><div className="p-divider-line" /></div>

        {/* ══ BODY ══ */}
        <div className="p-body">

          {/* ── Account Info ── */}
          <div className="p-card p-fade-up">
            <div className="p-card-head">
              <div className="p-card-title-group">
                <div className="p-card-icon" style={{ background: "rgba(62,207,110,0.10)" }}>👤</div>
                <span className="p-card-title">Account Info</span>
              </div>
              <span className="p-badge">DETAILS</span>
            </div>
            <div className="p-card-body">
              <div className="p-rows">
                {[
                  { ico: "🪪",  bg: "rgba(62,207,110,0.08)",   label: "User ID",      val: user?.userId,  type: "id"   },
                  { ico: "👤",  bg: "rgba(62,207,110,0.06)",   label: "Username",     val: user?.username, type: "name" },
                  { ico: "📧",  bg: "rgba(94,184,245,0.08)",   label: "Email",        val: user?.email              },
                  { ico: "📱",  bg: "rgba(185,140,245,0.08)",  label: "Phone",        val: user?.phone || null       },
                  { ico: "⚧️", bg: "rgba(245,166,35,0.08)",   label: "Gender",       val: gMeta ? `${gMeta.emoji} ${gMeta.label}` : null, type: "name" },
                  { ico: "🗓️", bg: "rgba(255,255,255,0.04)",  label: "Member Since", val: memberSince              },
                ].map(r => (
                  <div className="p-row" key={r.label}>
                    <div className="p-row-left">
                      <div className="p-row-ico" style={{ background: r.bg }}>{r.ico}</div>
                      <span className="p-row-label">{r.label}</span>
                    </div>
                    <span
                      className={`p-row-val ${r.type === "name" ? "name" : r.type === "id" ? "id" : ""} ${!r.val ? "muted" : ""}`}
                      title={r.val || ""}
                    >
                      {r.val || "Not set"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Waste Stats ── */}
          <div className="p-card p-fade-up">
            <div className="p-card-head">
              <div className="p-card-title-group">
                <div className="p-card-icon" style={{ background: "rgba(245,166,35,0.10)" }}>📊</div>
                <span className="p-card-title">Waste Statistics</span>
              </div>
              <span className="p-badge" style={{ color: "var(--jade)", borderColor: "var(--jade3)", background: "var(--jade4)" }}>LIVE</span>
            </div>
            <div className="p-card-body">
              <div className="p-tiles">
                {[
                  { emoji: "🗑️", val: stats.total,    lbl: "Total Logged",  color: "#ff6b6b", bg: "rgba(255,107,107,0.07)", border: "rgba(255,107,107,0.14)", glow: "#ff6b6b" },
                  { emoji: "✅",  val: stats.approved, lbl: "Approved",      color: "#3ecf6e", bg: "rgba(62,207,110,0.07)",  border: "rgba(62,207,110,0.14)",  glow: "#3ecf6e" },
                  { emoji: "⏳",  val: pending,        lbl: "Pending",       color: "#f5a623", bg: "rgba(245,166,35,0.07)",  border: "rgba(245,166,35,0.14)",  glow: "#f5a623" },
                  { emoji: "📈",  val: `${pct}%`,      lbl: "Approval Rate", color: "#5eb8f5", bg: "rgba(94,184,245,0.07)",  border: "rgba(94,184,245,0.14)",  glow: "#5eb8f5" },
                ].map(t => (
                  <div key={t.lbl} className="p-tile"
                    style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                    <div className="p-tile-glow" style={{ background: t.glow }} />
                    <div className="p-tile-emoji">{t.emoji}</div>
                    <div className="p-tile-val" style={{ color: t.color }}>{t.val}</div>
                    <div className="p-tile-label">{t.lbl}</div>
                  </div>
                ))}
              </div>

              {stats.total > 0 && (
                <div className="p-bar-wrap">
                  <div className="p-bar-head">
                    <span>Approval Progress</span>
                    <span>{stats.approved} of {stats.total} approved</span>
                  </div>
                  <div className="p-bar-track">
                    <div className="p-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Edit Profile ── */}
          <div className="p-card p-full p-fade-up">
            <div className="p-card-head">
              <div className="p-card-title-group">
                <div className="p-card-icon" style={{ background: "rgba(185,140,245,0.10)" }}>✏️</div>
                <span className="p-card-title">Edit Profile</span>
              </div>
              <span className="p-badge" style={!user?.gender ? { color: "var(--amber)", borderColor: "var(--amber2)", background: "var(--amber2)" } : {}}>
                {!user?.gender ? "INCOMPLETE" : "EDITABLE"}
              </span>
            </div>
            <div className="p-card-body">
              {!editing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {!user?.gender && (
                    <div style={{
                      display: "flex", alignItems: "flex-start", gap: 11,
                      padding: "13px 16px", borderRadius: 12,
                      background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.16)",
                      fontSize: 13, color: "rgba(245,166,35,0.80)",
                    }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                      <span><strong style={{ fontWeight: 700 }}>Your profile is incomplete.</strong> Add your gender and phone number to complete it.</span>
                    </div>
                  )}
                  <button className="p-edit-cta" onClick={() => setEditing(true)}>
                    <span className="p-edit-cta-icon">✏️</span>
                    Edit Your Details
                    <span style={{ opacity: 0.40, fontSize: 12, marginLeft: 4 }}>→</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSave}>
                  <div className="p-form-grid">

                    <div className="p-field">
                      <label className="p-field-label">👤 &nbsp;Username</label>
                      <input className="p-inp" value={form.username}
                        onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                        placeholder="Your display name" required minLength={2} />
                    </div>

                    <div className="p-field">
                      <label className="p-field-label">📧 &nbsp;Email</label>
                      <input className="p-inp" value={user?.email || ""} disabled placeholder="Cannot be changed" />
                    </div>

                    <div className="p-field">
                      <label className="p-field-label">📱 &nbsp;Phone</label>
                      <input className="p-inp" type="tel" value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 98765 43210" maxLength={15} />
                    </div>

                  </div>

                  {/* Gender — full row */}
                  <div className="p-field" style={{ marginTop: 16 }}>
                    <label className="p-field-label">⚧️ &nbsp;Gender</label>
                    <div className="p-gender-group">
                      {[
                        { val: "male",       label: "Male",              emoji: "👨" },
                        { val: "female",     label: "Female",            emoji: "👩" },
                        { val: "other",      label: "Other",             emoji: "🧑" },
                        { val: "prefer_not", label: "Prefer not to say", emoji: "🔒" },
                      ].map(g => (
                        <React.Fragment key={g.val}>
                          <input className="p-g-opt" type="radio"
                            id={`g-${g.val}`} name="gender" value={g.val}
                            checked={form.gender === g.val}
                            onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} />
                          <label className="p-g-lbl" htmlFor={`g-${g.val}`}>
                            {g.emoji} {g.label}
                          </label>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="p-form-sep" />
                  <p className="p-form-note">* Email and User ID are permanent and cannot be changed · Phone and gender are optional</p>

                  <div className="p-form-btns" style={{ marginTop: 18 }}>
                    <button type="submit" className="p-btn-save" disabled={saving}>
                      {saving ? "Saving…" : "✓  Save Changes"}
                    </button>
                    <button type="button" className="p-btn-cancel"
                      onClick={() => {
                        setEditing(false);
                        setForm({ username: user?.username || "", phone: user?.phone || "", gender: user?.gender || "" });
                      }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;