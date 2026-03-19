import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  /* ── RESET ── */
  .ct-root *, .ct-root *::before, .ct-root *::after { box-sizing: border-box; }

  /* ══════════════════════════════════
     HERO SHELL
  ══════════════════════════════════ */
  .ct-root {
    position: relative;
    min-height: 100svh;           /* safe viewport height on mobile */
    display: flex;
    align-items: center;
    justify-content: center;
    background: #080b08;
    overflow: hidden;
    font-family: 'Outfit', sans-serif;
    color: #fff;
    padding: 80px 24px 60px;     /* top pad accounts for fixed nav */
  }

  /* ── ANIMATED MESH ── */
  .ct-mesh {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 70% 55% at 12% 18%, rgba(255,107,53,0.15) 0%, transparent 55%),
      radial-gradient(ellipse 60% 65% at 88% 82%, rgba(92,184,92,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 45% 45% at 50% 50%, rgba(92,184,92,0.04) 0%, transparent 70%);
    animation: meshPulse 10s ease-in-out infinite alternate;
  }
  @keyframes meshPulse {
    0%   { transform: scale(1) rotate(0deg); opacity: 0.85; }
    100% { transform: scale(1.06) rotate(1.5deg); opacity: 1; }
  }

  /* ── DOT GRID ── */
  .ct-grid {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 20%, transparent 100%);
  }

  /* ── FLOATING ORBS ── */
  .ct-orb {
    position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
  }
  .ct-orb1 {
    width: clamp(280px, 45vw, 520px);
    height: clamp(280px, 45vw, 520px);
    top: -15%; left: -8%;
    background: radial-gradient(circle, rgba(255,107,53,0.11) 0%, transparent 65%);
    animation: float1 9s ease-in-out infinite;
  }
  .ct-orb2 {
    width: clamp(220px, 38vw, 430px);
    height: clamp(220px, 38vw, 430px);
    bottom: -10%; right: -5%;
    background: radial-gradient(circle, rgba(92,184,92,0.09) 0%, transparent 65%);
    animation: float2 11s ease-in-out infinite;
  }
  .ct-orb3 {
    width: clamp(160px, 22vw, 280px);
    height: clamp(160px, 22vw, 280px);
    top: 25%; right: 10%;
    background: radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 65%);
    animation: float1 13s ease-in-out infinite reverse;
  }
  @keyframes float1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(18px,-16px) scale(1.04); }
  }
  @keyframes float2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-14px,12px) scale(0.97); }
  }

  /* ── CORNER ACCENTS ── */
  .ct-corner {
    position: absolute; pointer-events: none; z-index: 1;
    opacity: 0; animation: fadeIn 1s ease 1.2s forwards;
  }
  .ct-corner-tl {
    top: 28px; left: 28px;
    width: 36px; height: 36px;
    border-top: 1px solid rgba(255,107,53,0.22);
    border-left: 1px solid rgba(255,107,53,0.22);
  }
  .ct-corner-br {
    bottom: 80px; right: 28px;
    width: 36px; height: 36px;
    border-bottom: 1px solid rgba(92,184,92,0.22);
    border-right: 1px solid rgba(92,184,92,0.22);
  }

  /* ══════════════════════════════════
     MAIN CONTENT
  ══════════════════════════════════ */
  .ct-inner {
    position: relative; z-index: 2;
    width: 100%;
    max-width: 900px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ── BADGE ── */
  .ct-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 3.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 100px; padding: 7px 18px;
    margin-bottom: clamp(24px, 4vw, 40px);
    opacity: 0; animation: fadeUp 0.6s ease 0.1s forwards;
  }
  .ct-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #ff6b35;
    box-shadow: 0 0 8px rgba(255,107,53,0.7);
    animation: blink 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* ── HEADLINE ── */
  .ct-h1 {
    font-family: 'Playfair Display', serif;
    line-height: 1.04;
    letter-spacing: -2px;
    margin-bottom: clamp(16px, 3vw, 28px);
    width: 100%;
  }

  .ct-h1-line1 {
    display: block;
    font-size: clamp(38px, 8vw, 88px);
    font-weight: 900;
    color: #f0f7f0;
    opacity: 0; animation: fadeUp 0.65s ease 0.25s forwards;
  }
  .ct-h1-line1 .orange { color: #ff6b35; }

  .ct-h1-line2 {
    display: block;
    font-size: clamp(36px, 7.5vw, 82px);
    font-weight: 900;
    font-style: italic;
    color: #5cb85c;
    opacity: 0; animation: fadeUp 0.65s ease 0.38s forwards;
  }

  .ct-h1-line3 {
    display: block;
    font-size: clamp(26px, 5vw, 56px);
    font-weight: 700;
    font-style: normal;
    color: rgba(240,247,240,0.65);
    margin-top: clamp(4px, 1vw, 8px);
    opacity: 0; animation: fadeUp 0.65s ease 0.51s forwards;
  }

  /* ── DESCRIPTION ── */
  .ct-desc {
    font-size: clamp(14px, 2vw, 17px);
    font-weight: 300;
    line-height: 1.80;
    color: rgba(255,255,255,0.38);
    max-width: 580px;
    margin: 0 auto clamp(32px, 5vw, 52px);
    padding: 0 8px;
    opacity: 0; animation: fadeUp 0.65s ease 0.65s forwards;
  }
  .ct-desc strong {
    color: rgba(255,180,100,0.82); font-weight: 500;
  }

  /* ── CTA BUTTONS ── */
  .ct-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: clamp(40px, 7vw, 68px);
    opacity: 0; animation: fadeUp 0.65s ease 0.78s forwards;
  }

  .ct-btn-primary {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px;
    padding: 15px clamp(24px, 4vw, 38px);
    background: #ff6b35; color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: clamp(13px, 1.5vw, 15px); font-weight: 700;
    letter-spacing: 1.2px; text-transform: uppercase;
    text-decoration: none; border-radius: 10px;
    box-shadow: 0 5px 24px rgba(255,107,53,0.36);
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    white-space: nowrap;
    min-width: 160px;
  }
  .ct-btn-primary:hover {
    background: #ff7d4d;
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(255,107,53,0.48);
  }
  .ct-btn-primary:active { transform: translateY(0); opacity: 0.9; }

  .ct-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px;
    padding: 14px clamp(20px, 3.5vw, 32px);
    background: transparent; color: rgba(255,255,255,0.50);
    font-family: 'Outfit', sans-serif;
    font-size: clamp(13px, 1.5vw, 15px); font-weight: 500;
    text-decoration: none; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.14);
    transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s;
    white-space: nowrap;
    min-width: 140px;
  }
  .ct-btn-ghost:hover {
    border-color: rgba(255,107,53,0.40);
    color: #ff8c5a;
    background: rgba(255,107,53,0.06);
    transform: translateY(-2px);
  }

  /* ── WELCOME BACK ── */
  .ct-welcome {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 13px 26px;
    background: rgba(92,184,92,0.10);
    border: 1px solid rgba(92,184,92,0.28);
    border-radius: 100px;
    font-size: clamp(13px, 1.5vw, 15px); font-weight: 600;
    color: #6ed46e;
    margin-bottom: clamp(40px, 7vw, 68px);
    opacity: 0; animation: fadeUp 0.65s ease 0.78s forwards;
  }
  .ct-welcome-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #5cb85c;
    box-shadow: 0 0 10px rgba(92,184,92,0.7);
    animation: blink 1.8s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* ── STATS STRIP ── */
  .ct-stats {
    display: flex;
    width: 100%; max-width: 620px;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; overflow: hidden;
    opacity: 0; animation: fadeUp 0.65s ease 0.92s forwards;
  }
  .ct-stat {
    flex: 1; padding: clamp(14px, 2vw, 22px) 8px;
    text-align: center;
    border-right: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.02);
    transition: background 0.2s;
  }
  .ct-stat:last-child { border-right: none; }
  .ct-stat:hover { background: rgba(255,107,53,0.05); }
  .ct-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: clamp(18px, 3vw, 28px);
    font-weight: 900; line-height: 1; letter-spacing: -1px;
    color: #ff6b35;
  }
  .ct-stat-lbl {
    font-size: clamp(8px, 1vw, 10px);
    font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.22); margin-top: 5px;
  }

  /* ── SCROLL INDICATOR ── */
  .ct-scroll {
    position: absolute;
    bottom: clamp(20px, 4vw, 36px);
    left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    opacity: 0; animation: fadeIn 0.8s ease 1.4s forwards;
    z-index: 2;
  }
  .ct-scroll-txt {
    font-size: 9px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.18);
  }
  .ct-scroll-line {
    width: 1px; height: 36px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.20), transparent);
    animation: scrollBounce 2s ease-in-out infinite;
  }
  @keyframes scrollBounce {
    0%,100% { opacity: 0.3; transform: scaleY(1); }
    50%      { opacity: 1; transform: scaleY(1.25); }
  }

  /* ── KEYFRAMES ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ══════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════ */

  /* Tablet */
  @media (max-width: 768px) {
    .ct-root { padding: 72px 20px 56px; }
    .ct-h1   { letter-spacing: -1.5px; }
    .ct-corner-tl, .ct-corner-br { display: none; }
    .ct-orb3 { display: none; }
  }

  /* Mobile */
  @media (max-width: 540px) {
    .ct-root  { padding: 64px 16px 52px; min-height: 100svh; }
    .ct-badge { font-size: 9px; letter-spacing: 2.5px; padding: 6px 14px; }
    .ct-cta   { flex-direction: column; align-items: stretch; gap: 10px; }
    .ct-btn-primary,
    .ct-btn-ghost { min-width: unset; width: 100%; padding: 15px 20px; }
    .ct-welcome { width: 100%; justify-content: center; }
    .ct-stats { max-width: 100%; }
    .ct-stat  { padding: 14px 4px; }
    .ct-stat-val { font-size: 20px; }
    .ct-h1 { letter-spacing: -1px; }
    .ct-desc { font-size: 14px; padding: 0; }
    .ct-scroll { display: none; }
  }

  /* Small phones */
  @media (max-width: 380px) {
    .ct-root { padding: 56px 12px 48px; }
    .ct-h1-line1 { font-size: 34px; }
    .ct-h1-line2 { font-size: 32px; }
    .ct-h1-line3 { font-size: 22px; }
    .ct-stat-lbl { letter-spacing: 0.5px; font-size: 8px; }
  }

  /* Wide desktop */
  @media (min-width: 1400px) {
    .ct-root { padding: 100px 40px 80px; }
  }
`;

const STATS = [
  { val: "12K+", lbl: "Members"      },
  { val: "4.2T", lbl: "Food Saved"   },
  { val: "840+", lbl: "Donors"       },
  { val: "99%",  lbl: "Satisfaction" },
];

const Content = () => {
  const { loggedIn } = useContext(AuthContext);

  return (
    <>
      <style>{css}</style>
      <div className="ct-root">

        {/* Backgrounds */}
        <div className="ct-mesh"   aria-hidden="true" />
        <div className="ct-grid"   aria-hidden="true" />
        <div className="ct-orb ct-orb1" aria-hidden="true" />
        <div className="ct-orb ct-orb2" aria-hidden="true" />
        <div className="ct-orb ct-orb3" aria-hidden="true" />
        <div className="ct-corner ct-corner-tl" aria-hidden="true" />
        <div className="ct-corner ct-corner-br" aria-hidden="true" />

        {/* Content */}
        <div className="ct-inner">

          {/* Badge */}
          <div className="ct-badge">
            <span className="ct-badge-dot" aria-hidden="true" />
            Making a Difference
          </div>

          {/* Headline */}
          <h1 className="ct-h1">
            <span className="ct-h1-line1">
              <span className="orange">Reduce</span> Food Waste
            </span>
            <span className="ct-h1-line2">Feed Lives.</span>
            <span className="ct-h1-line3">One Meal at a Time.</span>
          </h1>

          {/* Description */}
          <p className="ct-desc">
            FeedForward's technology empowers{" "}
            <strong>businesses &amp; communities</strong> to revolutionise
            food donation, reduce waste, and build a more sustainable future —
            starting with your next meal.
          </p>

          {/* CTA — logged in vs logged out */}
          {loggedIn ? (
            <div className="ct-welcome">
              <span className="ct-welcome-dot" aria-hidden="true" />
              Welcome back! You're making a difference.
            </div>
          ) : (
            <div className="ct-cta">
              <Link className="ct-btn-primary" to="/signup">
                Sign Up to Save →
              </Link>
              <Link className="ct-btn-ghost" to="/wasteAnalysis">
                Log Food Waste
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="ct-stats">
            {STATS.map(s => (
              <div className="ct-stat" key={s.lbl}>
                <div className="ct-stat-val">{s.val}</div>
                <div className="ct-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="ct-scroll" aria-hidden="true">
          <span className="ct-scroll-txt">Scroll</span>
          <div className="ct-scroll-line" />
        </div>

      </div>
    </>
  );
};

export default Content;