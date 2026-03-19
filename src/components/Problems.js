import React, { useEffect, useRef, useState } from "react";

import OverBuying  from "../assets/Problems.jpeg";
import Wastemoney  from "../assets/wasted-money.jpg";
import Envimpact   from "../assets/environment-impact.jpg";
import Hunger      from "../assets/hunger.jpg";
import Resources   from "../assets/resources.jpg";
import Community   from "../assets/community.jpg";
import Sustainable from "../assets/sustainable.jpg";
import underline1  from "../assets/underline-heading.png";
import Arrow1      from "../assets/arrow1.png";
import Sun         from "../assets/Highlight_05.png";

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

  /* ── SECTION SHELL ── */
  #problems {
    background: #080b08;
    font-family: 'Outfit', sans-serif;
    color: #e8f0e9;
    overflow: hidden;
  }

  .pb-wrap {
    max-width: 1280px;
    margin: 0 auto;
    padding: 96px 24px 112px;
    position: relative;
  }

  /* faint dot grid */
  .pb-wrap::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 100%);
  }

  /* ── HEADER ── */
  .pb-header {
    text-align: center;
    margin-bottom: 72px;
    position: relative; z-index: 2;
  }

  .pb-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 700; letter-spacing: 3.5px; text-transform: uppercase;
    color: rgba(163,230,53,0.75);
    border: 1px solid rgba(163,230,53,0.22);
    background: rgba(163,230,53,0.06);
    padding: 6px 18px; border-radius: 100px;
    margin-bottom: 24px;
  }
  .pb-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #a3e635;
    box-shadow: 0 0 8px rgba(163,230,53,0.7);
    animation: pbdot 2s ease-in-out infinite;
  }
  @keyframes pbdot { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .pb-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5.5vw, 62px);
    font-weight: 900; line-height: 1.06;
    letter-spacing: -2px;
    color: #f0f7f0;
    margin-bottom: 0;
    position: relative; display: inline-block;
  }
  .pb-title-accent {
    color: #ff6b35;
    font-style: italic;
    position: relative; display: inline-block;
  }
  .pb-title-accent img {
    position: absolute;
    bottom: -12px; left: 0; right: 0;
    width: 100%;
    opacity: 0.7;
    pointer-events: none;
  }

  .pb-sun {
    position: absolute;
    top: -36px; left: -44px;
    width: 80px; opacity: 0.5;
    pointer-events: none;
    animation: pbspin 14s linear infinite;
  }
  @keyframes pbspin { to { transform: rotate(360deg); } }

  .pb-arrow {
    display: block;
    margin: 20px auto 0;
    width: 44px; opacity: 0.35;
    animation: pbbounce 2.2s ease-in-out infinite;
  }
  @keyframes pbbounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }

  .pb-subtitle {
    font-size: 16px; font-weight: 300;
    color: rgba(232,240,233,0.40);
    max-width: 520px; margin: 20px auto 0; line-height: 1.75;
  }

  /* ── HERO IMAGE BANNER ── */
  .pb-hero-img {
    position: relative; z-index: 2;
    border-radius: 20px; overflow: hidden;
    margin-bottom: 72px;
    height: clamp(200px, 32vw, 400px);
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 24px 80px rgba(0,0,0,0.55);
  }
  .pb-hero-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.55) saturate(0.8);
  }
  .pb-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255,107,53,0.18) 0%,
      transparent 50%,
      rgba(8,11,8,0.80) 100%
    );
  }
  .pb-hero-label {
    position: absolute;
    bottom: 28px; left: 32px;
    font-family: 'Playfair Display', serif;
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 900; letter-spacing: -1px;
    color: #fff; line-height: 1.15;
  }
  .pb-hero-label span { color: #ff6b35; font-style: italic; }
  .pb-hero-tag {
    position: absolute;
    top: 24px; right: 24px;
    background: rgba(255,107,53,0.15);
    border: 1px solid rgba(255,107,53,0.35);
    color: #ff8c5a;
    padding: 6px 14px; border-radius: 100px;
    font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  }

  /* ── CARDS GRID ── */
  .pb-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    position: relative; z-index: 2;
  }

  /* ── SINGLE CARD ── */
  .pb-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.065);
    border-radius: 18px;
    overflow: hidden;
    display: flex; flex-direction: column;
    transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
    cursor: default;
    opacity: 0;
    transform: translateY(28px);
  }
  .pb-card.visible {
    animation: cardIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes cardIn {
    to { opacity: 1; transform: translateY(0); }
  }
  .pb-card:hover {
    transform: translateY(-6px) scale(1.015);
    box-shadow: 0 20px 56px rgba(0,0,0,0.55);
    border-color: rgba(255,107,53,0.28);
  }

  /* image */
  .pb-card-img {
    width: 100%;
    height: 180px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }
  .pb-card-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease, filter 0.4s ease;
    filter: brightness(0.70) saturate(0.75);
  }
  .pb-card:hover .pb-card-img img {
    transform: scale(1.07);
    filter: brightness(0.85) saturate(0.9);
  }
  .pb-card-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(8,11,8,0.85) 100%);
  }
  /* numbered badge */
  .pb-card-num {
    position: absolute; top: 14px; left: 14px;
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(8,11,8,0.7);
    border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; font-family: 'Outfit', sans-serif;
    color: rgba(255,255,255,0.6);
  }
  /* category tag on image */
  .pb-card-tag {
    position: absolute; bottom: 12px; right: 12px;
    padding: 3px 10px; border-radius: 100px;
    font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    background: rgba(255,107,53,0.18);
    border: 1px solid rgba(255,107,53,0.32);
    color: #ff8c5a;
  }

  /* body */
  .pb-card-body {
    padding: 20px 22px 24px;
    display: flex; flex-direction: column; flex: 1;
  }
  .pb-card-icon {
    font-size: 22px; margin-bottom: 10px; line-height: 1;
  }
  .pb-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px; font-weight: 700; letter-spacing: -0.4px;
    color: #f0f7f0; margin-bottom: 10px; line-height: 1.25;
  }
  .pb-card-text {
    font-size: 13px; font-weight: 300;
    color: rgba(232,240,233,0.42);
    line-height: 1.72; flex: 1;
  }
  .pb-card-text strong {
    color: rgba(255,180,100,0.85);
    font-weight: 500;
  }

  /* accent bottom bar */
  .pb-card-bar {
    height: 2px; border-radius: 0 0 18px 18px;
    margin-top: 18px;
    opacity: 0;
    transition: opacity 0.28s ease;
  }
  .pb-card:hover .pb-card-bar { opacity: 1; }

  /* ── BOTTOM STAT STRIP ── */
  .pb-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border: 1px solid rgba(255,255,255,0.065);
    border-radius: 16px; overflow: hidden;
    margin-top: 60px;
    position: relative; z-index: 2;
  }
  .pb-stat {
    padding: 28px 20px; text-align: center;
    border-right: 1px solid rgba(255,255,255,0.065);
    background: rgba(255,255,255,0.02);
    transition: background 0.2s;
  }
  .pb-stat:last-child { border-right: none; }
  .pb-stat:hover { background: rgba(255,107,53,0.05); }
  .pb-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: clamp(24px, 3vw, 36px);
    font-weight: 900; line-height: 1; letter-spacing: -1px;
    color: #ff6b35;
  }
  .pb-stat-lbl {
    font-size: 11px; font-weight: 500; letter-spacing: 1.5px;
    text-transform: uppercase; color: rgba(232,240,233,0.28); margin-top: 7px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .pb-grid { grid-template-columns: repeat(2, 1fr); }
    .pb-stats { grid-template-columns: repeat(2, 1fr); }
    .pb-stats .pb-stat:nth-child(2) { border-right: none; }
    .pb-stats .pb-stat:nth-child(3) { border-top: 1px solid rgba(255,255,255,0.065); }
    .pb-stats .pb-stat:nth-child(4) { border-top: 1px solid rgba(255,255,255,0.065); }
  }
  @media (max-width: 640px) {
    .pb-wrap { padding: 64px 16px 80px; }
    .pb-grid { grid-template-columns: 1fr; gap: 12px; }
    .pb-card-img { height: 200px; }
    .pb-stats { grid-template-columns: repeat(2, 1fr); }
    .pb-hero-img { height: 200px; }
    .pb-hero-label { font-size: 18px; bottom: 20px; left: 20px; }
    .pb-header { margin-bottom: 48px; }
  }
  @media (max-width: 380px) {
    .pb-stats { grid-template-columns: 1fr 1fr; }
    .pb-stat { padding: 20px 12px; }
  }
`;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const CARDS = [
  {
    img: Wastemoney, tag: "Economy",
    icon: "💸", title: "Wasted Money",
    color: "#fbbf24",
    text: <>Food waste causes massive financial losses. Globally, we discard an estimated <strong>₹92,000 crores</strong> worth of food every year — money that could feed millions.</>
  },
  {
    img: Envimpact, tag: "Climate",
    icon: "🌍", title: "Environmental Impact",
    color: "#34d399",
    text: "Food waste contributes heavily to CO₂ and methane emissions. Reducing what we discard is one of the single most impactful climate actions we can take."
  },
  {
    img: Hunger, tag: "Hunger",
    icon: "🍽️", title: "Fighting Hunger",
    color: "#fb7185",
    text: "While food is wasted, millions face hunger every night. Redirecting surplus meals to those in need can close this gap — one plate at a time."
  },
  {
    img: Resources, tag: "Resources",
    icon: "💧", title: "Efficient Resource Use",
    color: "#38bdf8",
    text: "Every wasted meal wastes the water, energy and land used to grow it. Minimising food waste conserves the precious resources our planet depends on."
  },
  {
    img: Community, tag: "Society",
    icon: "🤝", title: "Community Responsibility",
    color: "#a78bfa",
    text: "Reducing food waste strengthens communities, builds trust, and promotes a culture of shared responsibility for our collective wellbeing."
  },
  {
    img: Sustainable, tag: "Future",
    icon: "🌱", title: "Sustainable Future",
    color: "#a3e635",
    text: "Addressing food waste helps build a more resilient, efficient and equitable food system — one that works for people and planet alike."
  },
];

const STATS = [
  { val: "₹92k Cr", lbl: "Wasted Annually" },
  { val: "8%",      lbl: "Global Emissions" },
  { val: "1 in 9",  lbl: "People Hungry"   },
  { val: "3×",      lbl: "Land Wasted"     },
];

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const Problems = () => {
  const cardRefs = useRef([]);
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(v => [...v, i]), i * 80);
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <>
      <style>{css}</style>
      <section id="problems">
        <div className="pb-wrap">

          {/* ── HEADER ── */}
          <div className="pb-header">
            <div className="pb-eyebrow">
              <span className="pb-eyebrow-dot" />
              Our Mission
            </div>

            <h1 className="pb-title">
              <img className="pb-sun" src={Sun} alt="" aria-hidden="true" />
              Why Was FeedForward{" "}
              <span className="pb-title-accent">
                Created?
                <img src={underline1} alt="" aria-hidden="true" />
              </span>
            </h1>

            <p className="pb-subtitle">
              Food waste is one of the world's most solvable crises.
              Here's why we built FeedForward — and why it matters.
            </p>

            <img className="pb-arrow" src={Arrow1} alt="" aria-hidden="true" />
          </div>

          {/* ── HERO BANNER ── */}
          <div className="pb-hero-img">
            <img src={OverBuying} alt="The problem of over-buying food" />
            <div className="pb-hero-overlay" />
            <div className="pb-hero-label">
              The problem starts<br />
              <span>at home.</span>
            </div>
            <div className="pb-hero-tag">The Root Cause</div>
          </div>

          {/* ── CARDS GRID ── */}
          <div className="pb-grid">
            {CARDS.map((c, i) => (
              <div
                key={i}
                className={`pb-card${visible.includes(i) ? " visible" : ""}`}
                ref={el => cardRefs.current[i] = el}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div className="pb-card-img">
                  <img src={c.img} alt={c.title} />
                  <div className="pb-card-img-overlay" />
                  <div className="pb-card-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="pb-card-tag">{c.tag}</div>
                </div>

                {/* Body */}
                <div className="pb-card-body">
                  <div className="pb-card-icon">{c.icon}</div>
                  <div className="pb-card-title">{c.title}</div>
                  <p className="pb-card-text">{c.text}</p>
                  <div
                    className="pb-card-bar"
                    style={{ background: `linear-gradient(90deg, ${c.color}, transparent)` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── STAT STRIP ── */}
          <div className="pb-stats">
            {STATS.map(s => (
              <div className="pb-stat" key={s.lbl}>
                <div className="pb-stat-val">{s.val}</div>
                <div className="pb-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Problems;