import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const API_BASE = process.env.REACT_APP_API_URL;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Outfit', sans-serif;
    color: #fff;
    background: #0a0a0a;
  }

  /* ══════════════════════════════
     LEFT — BRAND PANEL
  ══════════════════════════════ */
  .lg-left {
    background: #0d0d0d;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 44px 52px 48px;
    min-height: 100vh;
    overflow: hidden;
    border-right: 1px solid rgba(255,255,255,0.05);
  }

  /* warm orange glow top-left */
  .lg-left::before {
    content: '';
    position: absolute;
    top: -120px; left: -80px;
    width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,53,0.13) 0%, transparent 65%);
    pointer-events: none;
  }
  /* subtle bottom-right green tint */
  .lg-left::after {
    content: '';
    position: absolute;
    bottom: -100px; right: -60px;
    width: 360px; height: 360px; border-radius: 50%;
    background: radial-gradient(circle, rgba(92,184,92,0.07) 0%, transparent 65%);
    pointer-events: none;
  }

  /* wordmark */
  .lg-wordmark {
    position: relative; z-index: 2;
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; letter-spacing: -0.5px;
    margin-bottom: auto;
  }
  .lg-wordmark span { color: #ff6b35; font-style: italic; }

  /* main headline block */
  .lg-left-content {
    position: relative; z-index: 2;
    margin-top: 60px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* badge pill */
  .lg-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 100px; padding: 6px 16px;
    margin-bottom: 28px;
    width: fit-content;
  }
  .lg-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #ff6b35;
    box-shadow: 0 0 8px rgba(255,107,53,0.6);
    animation: bdot 2s ease-in-out infinite;
  }
  @keyframes bdot { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* big headline */
  .lg-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 5vw, 64px);
    font-weight: 900; line-height: 1.04;
    letter-spacing: -2.5px; margin-bottom: 22px;
  }
  .lg-h1-orange {
    color: #ff6b35;
    font-style: italic;
    display: block;
  }

  /* description */
  .lg-desc {
    font-size: 15px; font-weight: 300;
    color: rgba(255,255,255,0.38);
    line-height: 1.75; max-width: 380px;
  }

  /* stats 2×2 grid */
  .lg-stats {
    position: relative; z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 52px;
  }
  .lg-stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 20px 22px;
    transition: background 0.2s, border-color 0.2s;
  }
  .lg-stat-card:hover {
    background: rgba(255,107,53,0.06);
    border-color: rgba(255,107,53,0.18);
  }
  .lg-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 3.5vw, 36px);
    font-weight: 900; line-height: 1;
    color: #ff6b35; letter-spacing: -1px;
  }
  .lg-stat-lbl {
    font-size: 11px; font-weight: 400;
    color: rgba(255,255,255,0.28);
    margin-top: 6px; letter-spacing: 0.3px;
  }

  /* ══════════════════════════════
     RIGHT — FORM PANEL
  ══════════════════════════════ */
  .lg-right {
    background: #111411;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 52px 64px;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }
  .lg-right::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(circle at 90% 10%, rgba(255,107,53,0.05) 0%, transparent 45%),
      radial-gradient(circle at 10% 90%, rgba(92,184,92,0.04) 0%, transparent 45%);
  }

  .lg-form-wrap {
    width: 100%; max-width: 400px;
    position: relative; z-index: 2;
  }

  /* form heading */
  .lg-form-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 3.5vw, 44px);
    font-weight: 900; letter-spacing: -1.5px;
    line-height: 1.1; margin-bottom: 8px;
  }
  .lg-form-title span {
    color: #ff6b35; font-style: italic;
  }
  .lg-form-sub {
    font-size: 14px; font-weight: 300;
    color: rgba(255,255,255,0.32);
    margin-bottom: 36px; line-height: 1.6;
  }

  /* field */
  .lg-field { margin-bottom: 16px; }
  .lg-field-label {
    display: block;
    font-size: 10px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.25); margin-bottom: 8px;
  }
  .lg-inp {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 15px 18px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px; color: #fff; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .lg-inp::placeholder { color: rgba(255,255,255,0.16); }
  .lg-inp:focus {
    border-color: rgba(255,107,53,0.50);
    background: rgba(255,107,53,0.04);
    box-shadow: 0 0 0 3px rgba(255,107,53,0.08);
  }

  /* LOGIN button — matches screenshot exactly */
  .lg-btn-login {
    width: 100%; padding: 16px;
    margin-top: 8px;
    border-radius: 10px; border: none;
    background: #ff6b35;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    box-shadow: 0 6px 28px rgba(255,107,53,0.38);
    transition: background 0.2s, transform 0.15s, box-shadow 0.15s, opacity 0.2s;
  }
  .lg-btn-login:hover:not(:disabled) {
    background: #ff7d4d;
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(255,107,53,0.48);
  }
  .lg-btn-login:active:not(:disabled) { transform: translateY(0); opacity: 0.88; }
  .lg-btn-login:disabled { opacity: 0.36; cursor: not-allowed; transform: none; }

  /* forgot password */
  .lg-forgot {
    display: block; width: 100%; margin-top: 14px;
    text-align: center;
    font-size: 13.5px; font-weight: 400;
    color: rgba(255,255,255,0.30);
    background: none; border: none; cursor: pointer;
    transition: color 0.18s;
    font-family: 'Outfit', sans-serif;
  }
  .lg-forgot:hover { color: rgba(255,255,255,0.60); }

  /* OR divider */
  .lg-divider {
    display: flex; align-items: center; gap: 14px;
    margin: 22px 0 18px;
  }
  .lg-div-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .lg-div-txt { font-size: 11px; color: rgba(255,255,255,0.18); letter-spacing: 2px; }

  /* signup row */
  .lg-signup-row {
    text-align: center; font-size: 14px;
    color: rgba(255,255,255,0.26);
  }
  .lg-signup-row a {
    color: #ff6b35; text-decoration: none; font-weight: 600;
    transition: color 0.15s;
  }
  .lg-signup-row a:hover { color: #ff8c5a; text-decoration: underline; }

  /* ghost button (reset / back) */
  .lg-btn-ghost {
    width: 100%; padding: 14px 16px; margin-top: 10px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.09);
    background: transparent; color: rgba(255,255,255,0.30);
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .lg-btn-ghost:hover { border-color: rgba(255,107,53,0.35); color: #ff8c5a; background: rgba(255,107,53,0.05); }

  /* spinner */
  .lg-spin {
    width: 15px; height: 15px; flex-shrink: 0;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* messages */
  .lg-msg {
    margin-top: 14px; padding: 12px 18px; border-radius: 100px;
    font-size: 13px; font-weight: 500; text-align: center;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .lg-msg.ok  { background: rgba(92,184,92,0.09);  border: 1px solid rgba(92,184,92,0.25);  color: #6ed46e; }
  .lg-msg.err { background: rgba(255,90,90,0.08);  border: 1px solid rgba(255,90,90,0.24);  color: #ff7a7a; }

  /* countdown */
  .lg-cd { text-align: center; font-size: 12px; color: rgba(255,255,255,0.22); margin-top: 10px; }
  .lg-cd b { color: #ff6b35; }

  /* wake bar */
  .lg-wake {
    margin-top: 14px;
    background: rgba(255,107,53,0.05);
    border: 1px solid rgba(255,107,53,0.15);
    border-radius: 12px; padding: 14px 16px;
  }
  .lg-wake-title { font-size: 12px; font-weight: 600; color: #ff8c5a; display:flex; align-items:center; gap:7px; margin-bottom:9px; }
  .lg-wake-track { height: 3px; background: rgba(255,107,53,0.10); border-radius:3px; overflow:hidden; }
  .lg-wake-fill  { height:100%; background: linear-gradient(90deg,#ff6b35,#ffb088); border-radius:3px; transition:width 1s linear; }
  .lg-wake-hint  { font-size:10px; color: rgba(255,255,255,0.18); margin-top:7px; }

  /* reset title */
  .lg-reset-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; letter-spacing: -1px;
    margin-bottom: 6px;
  }
  .lg-reset-title i { color: #ff6b35; font-style: italic; }

  /* ══════════════════════════════
     RESPONSIVE
  ══════════════════════════════ */
  @media (max-width: 860px) {
    .lg-root { grid-template-columns: 1fr; }
    .lg-left { padding: 36px 28px 32px; min-height: auto; }
    .lg-right { padding: 40px 28px; min-height: auto; }
    .lg-h1 { font-size: 36px; }
    .lg-left-content { margin-top: 32px; }
    .lg-stats { margin-top: 36px; }
  }
  @media (max-width: 480px) {
    .lg-left  { padding: 28px 20px 24px; }
    .lg-right { padding: 32px 20px; }
    .lg-stats { grid-template-columns: 1fr 1fr; gap: 8px; }
    .lg-form-title { font-size: 28px; }
  }
`;

/* ── WakeBar ── */
const WakeBar = ({ totalSeconds }) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setElapsed(s => {
        if (s >= totalSeconds) { clearInterval(iv); return totalSeconds; }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [totalSeconds]);
  const pct = Math.min((elapsed / totalSeconds) * 100, 92);
  return (
    <div className="lg-wake">
      <div className="lg-wake-title">⏳ Waking up server…</div>
      <div className="lg-wake-track">
        <div className="lg-wake-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="lg-wake-hint">Render free tier takes ~30s to wake. Retrying automatically…</div>
    </div>
  );
};

const STATS = [
  { val: "12K+", lbl: "Meals Saved"   },
  { val: "3.4T", lbl: "CO₂ Reduced"  },
  { val: "840+", lbl: "Donors"        },
  { val: "99%",  lbl: "Satisfaction"  },
];

/* ══════════════════════════════════════════
   LOGIN
══════════════════════════════════════════ */
const Login = () => {
  const [email,               setEmail]               = useState("");
  const [password,            setPassword]            = useState("");
  const [loginMessage,        setLoginMessage]        = useState("");
  const [messageType,         setMessageType]         = useState("error");
  const [countdown,           setCountdown]           = useState(null);
  const [loading,             setLoading]             = useState(false);
  const [waking,              setWaking]              = useState(false);
  const [resetEmail,          setResetEmail]          = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const retryRef    = useRef(0);
  const retryTimer  = useRef(null);
  const emailRef    = useRef(email);
  const passwordRef = useRef(password);

  useEffect(() => { emailRef.current    = email;    }, [email]);
  useEffect(() => { passwordRef.current = password; }, [password]);
  useEffect(() => () => { if (retryTimer.current) clearTimeout(retryTimer.current); }, []);

  const navigate = useNavigate();
  const auth     = useContext(AuthContext);

  const callLogin = (token) => {
    if (auth.login) auth.login(token);
    else if (auth.handleLoginSuccess) {
      localStorage.setItem("token", token);
      auth.handleLoginSuccess();
    }
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) { navigate("/"); return; }
    const t = setTimeout(() => setCountdown(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  const attemptLogin = async (emailVal, passVal) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/login`,
        { email: emailVal, password: passVal },
        { timeout: 35000 }
      );
      retryRef.current = 0;
      setWaking(false); setLoading(false);
      callLogin(res.data.token);
      setMessageType("success");
      setLoginMessage("Login successful! Redirecting…");
      setCountdown(3);
    } catch (err) {
      const status       = err?.response?.status;
      const isNetworkErr = !status || err.code === "ECONNABORTED" || err.code === "ERR_NETWORK";
      if (isNetworkErr && retryRef.current < 3) {
        retryRef.current += 1;
        setWaking(true); setLoading(false);
        retryTimer.current = setTimeout(() => {
          attemptLogin(emailRef.current, passwordRef.current);
        }, 10000);
      } else {
        retryRef.current = 0;
        setWaking(false); setLoading(false);
        setMessageType("error");
        if (isNetworkErr)                        setLoginMessage("Server unavailable. Please try again.");
        else if (status === 400 || status === 401) setLoginMessage("Invalid email or password.");
        else if (status === 429)                 setLoginMessage("Too many requests — wait a moment.");
        else setLoginMessage(err?.response?.data?.error || "Login failed. Try again.");
      }
    }
  };

  const cancelRetry = () => {
    if (retryTimer.current) { clearTimeout(retryTimer.current); retryTimer.current = null; }
    retryRef.current = 0; setWaking(false); setLoading(false);
  };

  const handleLogin          = async (e) => { e.preventDefault(); cancelRetry(); setLoginMessage(""); setLoading(true); localStorage.removeItem("token"); await attemptLogin(email, password); };
  const handleEmailChange    = (e) => { cancelRetry(); setLoginMessage(""); setEmail(e.target.value); };
  const handlePasswordChange = (e) => { cancelRetry(); setLoginMessage(""); setPassword(e.target.value); };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) { setMessageType("error"); setLoginMessage("Please enter your email."); return; }
    try {
      const res = await axios.post(`${API_BASE}/api/forgot-password`, { email: resetEmail });
      setMessageType("success");
      setLoginMessage(res.data.message || "Reset email sent!");
      setIsResettingPassword(false);
    } catch (err) {
      setMessageType("error");
      setLoginMessage(err?.response?.data?.error || "Something went wrong.");
    }
  };

  const btnLabel = waking ? "Retrying…" : loading ? "Signing In…" : "LOG IN";

  return (
    <>
      <style>{css}</style>
      <div className="lg-root">

        {/* ════ LEFT PANEL ════ */}
        <div className="lg-left">

          {/* Wordmark */}
          <div className="lg-wordmark">
            Feed<span>Forward</span>
          </div>

          {/* Headline + desc */}
          <div className="lg-left-content">
            <div className="lg-badge">
              <span className="lg-badge-dot" />
              Making a difference
            </div>

            <h1 className="lg-h1">
              Reduce waste.<br />
              <span className="lg-h1-orange">Feed lives.</span>
            </h1>

            <p className="lg-desc">
              Track your food waste, donate surplus meals,<br />
              and help families in need — all in one place.
            </p>
          </div>

          {/* Stats 2×2 */}
          <div className="lg-stats">
            {STATS.map(s => (
              <div className="lg-stat-card" key={s.lbl}>
                <div className="lg-stat-val">{s.val}</div>
                <div className="lg-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="lg-right">
          <div className="lg-form-wrap">

            {!isResettingPassword ? (
              <>
                <h2 className="lg-form-title">
                  Welcome <span>back</span>
                </h2>
                <p className="lg-form-sub">
                  Sign in to continue making a difference.
                </p>

                <form onSubmit={handleLogin}>
                  <div className="lg-field">
                    <label className="lg-field-label">Email</label>
                    <input
                      className="lg-inp" type="email"
                      placeholder="you@example.com"
                      value={email} onChange={handleEmailChange}
                      required autoComplete="email"
                    />
                  </div>

                  <div className="lg-field">
                    <label className="lg-field-label">Password</label>
                    <input
                      className="lg-inp" type="password"
                      placeholder="••••••••••"
                      value={password} onChange={handlePasswordChange}
                      required autoComplete="current-password"
                    />
                  </div>

                  <button type="submit" className="lg-btn-login" disabled={loading || waking}>
                    {(loading || waking) && <span className="lg-spin" />}
                    {btnLabel}
                  </button>
                </form>

                <button
                  className="lg-forgot"
                  onClick={() => { setIsResettingPassword(true); setLoginMessage(""); }}
                  disabled={loading || waking}
                >
                  Forgot Password?
                </button>

                <div className="lg-divider">
                  <div className="lg-div-line" />
                  <span className="lg-div-txt">OR</span>
                  <div className="lg-div-line" />
                </div>

                <p className="lg-signup-row">
                  Don't have an account?&nbsp;<Link to="/signup">Sign Up</Link>
                </p>
              </>
            ) : (
              <>
                <h2 className="lg-reset-title">
                  Reset your <i>password</i>
                </h2>
                <p className="lg-form-sub" style={{ marginBottom: 28 }}>
                  We'll send a reset link to your inbox.
                </p>

                <form onSubmit={handleForgotPassword}>
                  <div className="lg-field">
                    <label className="lg-field-label">Email Address</label>
                    <input
                      className="lg-inp" type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      required autoComplete="email"
                    />
                  </div>
                  <button type="submit" className="lg-btn-login">
                    Send Reset Email
                  </button>
                  <button
                    type="button" className="lg-btn-ghost"
                    onClick={() => { setIsResettingPassword(false); setLoginMessage(""); }}
                  >
                    ← Back to Sign In
                  </button>
                </form>
              </>
            )}

            {waking && <WakeBar totalSeconds={30} />}

            {loginMessage && !waking && (
              <p className={`lg-msg ${messageType === "success" ? "ok" : "err"}`}>
                {messageType === "success" ? "✓" : "✕"} {loginMessage}
              </p>
            )}

            {countdown !== null && countdown > 0 && (
              <p className="lg-cd">Redirecting in <b>{countdown}</b> seconds…</p>
            )}

          </div>
        </div>

      </div>
    </>
  );
};

export default Login;