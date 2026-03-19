import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const PERKS = {
  household: [
    { icon: "📊", text: "Full food analysis access" },
    { icon: "♻️", text: "Track & reduce waste" },
    { icon: "💰", text: "Cost savings insights" },
    { icon: "🌍", text: "Lower your carbon footprint" },
    { icon: "🎁", text: "Unlimited food donations" },
    { icon: "❤️", text: "Help families in need" },
  ],
  business: [
    { icon: "📊", text: "Full food analysis access" },
    { icon: "📋", text: "Unlimited donation listings" },
    { icon: "💹", text: "Higher profit margins" },
    { icon: "🧾", text: "Tax benefits" },
    { icon: "🏆", text: "Competitive advantage" },
    { icon: "🌱", text: "Minimize carbon emissions" },
  ],
};

/* ── same 4 stats as Login's 2×2 grid ── */
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

  /* ══════════════════════════════
     LEFT — BRAND PANEL
     (identical look to Login left)
  ══════════════════════════════ */
  .su-left {
    background: #0d0d0d;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 44px 52px 48px;
    min-height: 100vh;
    overflow: hidden;
    border-right: 1px solid rgba(255,255,255,0.05);
  }

  /* orange glow top-left — same as Login */
  .su-left::before {
    content: '';
    position: absolute;
    top: -120px; left: -80px;
    width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,53,0.13) 0%, transparent 65%);
    pointer-events: none;
  }
  /* subtle green tint bottom-right */
  .su-left::after {
    content: '';
    position: absolute;
    bottom: -100px; right: -60px;
    width: 360px; height: 360px; border-radius: 50%;
    background: radial-gradient(circle, rgba(92,184,92,0.07) 0%, transparent 65%);
    pointer-events: none;
  }

  /* wordmark — same style as Login */
  .su-wordmark {
    position: relative; z-index: 2;
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; letter-spacing: -0.5px;
  }
  .su-wordmark span { color: #ff6b35; font-style: italic; }

  /* headline block */
  .su-left-content {
    position: relative; z-index: 2;
    margin-top: 60px;
    flex: 1;
    display: flex; flex-direction: column; justify-content: center;
  }

  /* badge — same as Login */
  .su-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 100px; padding: 6px 16px;
    margin-bottom: 28px; width: fit-content;
  }
  .su-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #ff6b35;
    box-shadow: 0 0 8px rgba(255,107,53,0.6);
    animation: bdot 2s ease-in-out infinite;
  }
  @keyframes bdot { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* big headline — matches Login's exact font sizing */
  .su-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 5vw, 64px);
    font-weight: 900; line-height: 1.04;
    letter-spacing: -2.5px; margin-bottom: 22px;
  }
  .su-h1-green {
    color: #5cb85c;
    font-style: italic;
    display: block;
  }

  .su-desc {
    font-size: 15px; font-weight: 300;
    color: rgba(255,255,255,0.38);
    line-height: 1.75; max-width: 380px;
  }

  /* 2×2 stat cards — exactly like Login */
  .su-stats {
    position: relative; z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 52px;
  }
  .su-stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 20px 22px;
    transition: background 0.2s, border-color 0.2s;
  }
  .su-stat-card:hover {
    background: rgba(255,107,53,0.06);
    border-color: rgba(255,107,53,0.18);
  }
  .su-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 3.5vw, 36px);
    font-weight: 900; line-height: 1;
    color: #ff6b35; letter-spacing: -1px;
  }
  .su-stat-lbl {
    font-size: 11px; font-weight: 400;
    color: rgba(255,255,255,0.28);
    margin-top: 6px; letter-spacing: 0.3px;
  }

  /* ══════════════════════════════
     RIGHT — FORM PANEL
     (matches Login right panel)
  ══════════════════════════════ */
  .su-right {
    background: #111411;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 52px;
    position: relative; overflow: hidden;
    min-height: 100vh;
  }
  .su-right::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(circle at 90% 5%,  rgba(255,107,53,0.05) 0%, transparent 45%),
      radial-gradient(circle at 10% 95%, rgba(92,184,92,0.04)  0%, transparent 45%);
  }

  .su-form-wrap {
    width: 100%; max-width: 420px;
    position: relative; z-index: 2;
  }

  /* form heading — matches Login "Welcome back" style */
  .su-form-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.22); margin-bottom: 8px;
  }
  .su-form-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 3.5vw, 38px);
    font-weight: 900; letter-spacing: -1.5px;
    line-height: 1.1; margin-bottom: 24px;
  }
  .su-form-title span { color: #ff6b35; font-style: italic; }

  /* tabs — styled like Login's fields */
  .su-tabs {
    display: flex; gap: 6px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px; padding: 4px;
    margin-bottom: 22px;
  }
  .su-tab {
    flex: 1; padding: 10px 8px;
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer; border: none;
    background: transparent;
    color: rgba(255,255,255,0.30);
    transition: all 0.2s ease; text-align: center;
  }
  .su-tab.active {
    background: #ff6b35;
    color: #fff;
    box-shadow: 0 2px 14px rgba(255,107,53,0.35);
  }

  /* fields — same style as Login inputs */
  .su-field { margin-bottom: 13px; }
  .su-field label {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.25); margin-bottom: 7px;
  }
  .su-input-wrap { position: relative; }
  .su-input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    font-size: 14px; pointer-events: none; opacity: 0.30;
  }
  .su-inp {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 13px 14px 13px 40px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px; color: #fff; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .su-inp::placeholder { color: rgba(255,255,255,0.16); }
  .su-inp:focus {
    border-color: rgba(255,107,53,0.50);
    background: rgba(255,107,53,0.04);
    box-shadow: 0 0 0 3px rgba(255,107,53,0.08);
  }
  .su-pw-hint {
    font-size: 10px; color: rgba(255,255,255,0.20);
    margin-top: 5px; line-height: 1.5;
  }

  /* gender pills */
  .su-gender-group { display: flex; gap: 7px; flex-wrap: wrap; }
  .su-gender-opt   { display: none; }
  .su-gender-label {
    flex: 1; min-width: 80px;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 9px;
    font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.35);
    cursor: pointer; transition: all 0.18s ease; user-select: none;
    text-align: center;
  }
  .su-gender-label:hover {
    background: rgba(255,107,53,0.07);
    border-color: rgba(255,107,53,0.25);
    color: rgba(255,255,255,0.65);
  }
  .su-gender-opt:checked + .su-gender-label {
    background: rgba(255,107,53,0.14);
    border-color: rgba(255,107,53,0.50);
    color: #ff8c5a;
    box-shadow: 0 0 0 3px rgba(255,107,53,0.08);
  }
  .su-gender-emoji { font-size: 14px; }

  /* perks grid */
  .su-perks {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 7px; margin: 16px 0 20px;
  }
  .su-perk {
    display: flex; align-items: center; gap: 8px;
    font-size: 11.5px; color: rgba(255,255,255,0.35);
    padding: 7px 10px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    transition: background 0.15s, border-color 0.15s;
  }
  .su-perk:hover {
    background: rgba(255,107,53,0.06);
    border-color: rgba(255,107,53,0.20);
    color: rgba(255,255,255,0.55);
  }
  .su-perk-emoji { font-size: 13px; flex-shrink: 0; }

  /* CREATE ACCOUNT button — matches Login's LOG IN */
  .su-btn {
    width: 100%; padding: 15px;
    margin-top: 4px;
    border-radius: 10px; border: none;
    background: #ff6b35;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    box-shadow: 0 6px 28px rgba(255,107,53,0.38);
    transition: background 0.2s, transform 0.15s, box-shadow 0.15s, opacity 0.2s;
  }
  .su-btn:hover:not(:disabled) {
    background: #ff7d4d;
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(255,107,53,0.48);
  }
  .su-btn:active:not(:disabled) { transform: translateY(0); opacity: 0.88; }
  .su-btn:disabled { opacity: 0.36; cursor: not-allowed; transform: none; }

  .su-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: #fff; border-radius: 50%;
    animation: suspin 0.65s linear infinite;
  }
  @keyframes suspin { to { transform: rotate(360deg); } }

  /* divider */
  .su-divider {
    display: flex; align-items: center; gap: 14px;
    margin: 18px 0 16px;
  }
  .su-div-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .su-div-txt  { font-size: 11px; color: rgba(255,255,255,0.18); letter-spacing: 2px; }

  /* footer */
  .su-footer-row {
    text-align: center; font-size: 14px; color: rgba(255,255,255,0.26);
  }
  .su-footer-row a {
    color: #ff6b35; text-decoration: none; font-weight: 600;
    transition: color 0.15s;
  }
  .su-footer-row a:hover { color: #ff8c5a; text-decoration: underline; }

  /* countdown */
  .su-countdown {
    text-align: center; font-size: 12px;
    color: rgba(255,255,255,0.22); margin-top: 10px;
  }
  .su-countdown b { color: #ff6b35; }

  /* toast */
  .su-toast {
    position: fixed; top: 22px; left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px; border-radius: 100px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 500;
    z-index: 999; white-space: nowrap; max-width: 90vw;
    animation: toastIn 0.3s ease;
    display: flex; align-items: center; gap: 8px;
  }
  .su-toast.success {
    background: rgba(92,184,92,0.12); border: 1px solid rgba(92,184,92,0.35); color: #6ed46e;
  }
  .su-toast.error {
    background: rgba(255,80,80,0.10); border: 1px solid rgba(255,80,80,0.32); color: #ff7070;
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* ══════════════════════════════
     RESPONSIVE
  ══════════════════════════════ */
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
  }
`;

const FIELD_ICONS = { username: "👤", email: "✉️", password: "🔒", phone: "📱" };

const SignUp = () => {
  const [tab,       setTab]       = useState("household");
  const [form,      setForm]      = useState({ username:"", email:"", password:"", phone:"", gender:"" });
  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState(null);
  const [countdown, setCountdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) { navigate("/login"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/register`, {
        username: form.username,
        email:    form.email,
        password: form.password,
        phone:    form.phone || "",
        gender:   form.gender,
      });
      showToast("success", "Account created! Redirecting…");
      setCountdown(5);
    } catch (err) {
      showToast("error", err?.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        {/* ════ LEFT — BRAND PANEL ════ */}
        <div className="su-left">

          {/* Wordmark — same as Login */}
          <div className="su-wordmark">
            Feed<span>Forward</span>
          </div>

          {/* Headline */}
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

          {/* 2×2 stat grid — same as Login */}
          <div className="su-stats">
            {STATS.map(s => (
              <div className="su-stat-card" key={s.lbl}>
                <div className="su-stat-val">{s.val}</div>
                <div className="su-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

        </div>

        {/* ════ RIGHT — FORM PANEL ════ */}
        <div className="su-right">
          <div className="su-form-wrap">

            <div className="su-form-eyebrow">Get started — it's free</div>
            <h2 className="su-form-title">
              Create your <span>account</span>
            </h2>

            {/* Tabs */}
            <div className="su-tabs">
              <button
                className={`su-tab${tab === "household" ? " active" : ""}`}
                onClick={() => setTab("household")}
              >
                🏠 Household
              </button>
              <button
                className={`su-tab${tab === "business" ? " active" : ""}`}
                onClick={() => setTab("business")}
              >
                🏢 Business
              </button>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit} key={tab}>
              {[
                { name:"username", label: tab === "business" ? "Business Name" : "Full Name",
                  type:"text",     ph: tab === "business" ? "Enter business name" : "Enter your full name" },
                { name:"email",    label:"Email Address", type:"email",    ph:"you@example.com" },
                { name:"password", label:"Password",      type:"password", ph:"Min. 8 chars with symbols" },
                { name:"phone",    label:"Phone (optional)", type:"tel",   ph:"+91 98765 43210" },
              ].map(f => (
                <div className="su-field" key={f.name}>
                  <label>{f.label}</label>
                  <div className="su-input-wrap">
                    <span className="su-input-icon">{FIELD_ICONS[f.name]}</span>
                    <input
                      className="su-inp"
                      type={f.type} name={f.name}
                      placeholder={f.ph} value={form[f.name]}
                      onChange={handleChange}
                      required={f.name !== "phone"}
                      autoComplete={f.name === "password" ? "new-password" : "on"}
                    />
                  </div>
                  {f.name === "password" && (
                    <div className="su-pw-hint">
                      Must include uppercase, lowercase, number & special character (@$!%*?&)
                    </div>
                  )}
                </div>
              ))}

              {/* Gender */}
              <div className="su-field">
                <label>Gender</label>
                <div className="su-gender-group">
                  {[
                    { val:"male",        label:"Male",              emoji:"👨" },
                    { val:"female",      label:"Female",            emoji:"👩" },
                    { val:"other",       label:"Other",             emoji:"🧑" },
                    { val:"prefer_not",  label:"Prefer not to say", emoji:"🔒" },
                  ].map(g => (
                    <React.Fragment key={g.val}>
                      <input
                        className="su-gender-opt"
                        type="radio" id={`gender-${g.val}`}
                        name="gender" value={g.val}
                        checked={form.gender === g.val}
                        onChange={handleChange}
                      />
                      <label className="su-gender-label" htmlFor={`gender-${g.val}`}>
                        <span className="su-gender-emoji">{g.emoji}</span>
                        {g.label}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Perks */}
              <div className="su-perks">
                {PERKS[tab].map(p => (
                  <div className="su-perk" key={p.text}>
                    <span className="su-perk-emoji">{p.icon}</span>
                    {p.text}
                  </div>
                ))}
              </div>

              <button type="submit" className="su-btn" disabled={loading || countdown !== null}>
                {loading
                  ? <><span className="su-spinner" />Creating Account…</>
                  : countdown !== null
                  ? `Redirecting in ${countdown}s…`
                  : "Create Account"
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