import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@400;500;600;700&display=swap');

  .nb-nav *, .nb-nav *::before, .nb-nav *::after { box-sizing: border-box; }

  .nb-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    font-family: 'Outfit', sans-serif;
    background: transparent;
    border-bottom: 1px solid transparent;
    transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    -webkit-font-smoothing: antialiased;
  }
  .nb-nav.scrolled {
    background: rgba(5, 8, 5, 0.95);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border-bottom-color: rgba(255,255,255,0.07);
    box-shadow: 0 1px 32px rgba(0,0,0,0.6);
  }

  .nb-bar {
    max-width: 1280px; margin: 0 auto;
    padding: 0 40px; height: 70px;
    display: flex; align-items: center; gap: 0;
  }

  .nb-logo { text-decoration: none; display: flex; align-items: baseline; gap: 0; flex-shrink: 0; margin-right: 36px; }
  .nb-logo-feed { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 800; color: #f0f7f0; letter-spacing: -0.5px; }
  .nb-logo-fwd  { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #ff6b35; font-style: italic; letter-spacing: -0.5px; }
  .nb-logo-dot  { width: 5px; height: 5px; border-radius: 50%; background: #ff6b35; box-shadow: 0 0 7px rgba(255,107,53,0.7); margin-left: 2px; margin-bottom: 3px; align-self: flex-end; flex-shrink: 0; transition: transform 0.2s; }
  .nb-logo:hover .nb-logo-dot { transform: scale(1.4); }

  .nb-links { display: flex; align-items: center; gap: 0; list-style: none; margin: 0; padding: 0; flex: 1; }
  .nb-link { text-decoration: none; font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.48); padding: 7px 12px; border-radius: 8px; transition: color 0.18s, background 0.18s; white-space: nowrap; position: relative; display: inline-block; }
  .nb-link:hover { color: rgba(255,255,255,0.88); background: rgba(255,255,255,0.07); }
  .nb-link.nb-active { color: #ff6b35; background: rgba(255,107,53,0.10); font-weight: 600; }
  .nb-link.nb-active::after { content: ''; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: #ff6b35; box-shadow: 0 0 6px rgba(255,107,53,0.8); }

  .nb-auth { flex-shrink: 0; margin-left: 8px; display: flex; align-items: center; gap: 10px; }

  /* ══════════════════════════════════════════════
     BELL BUTTON
  ══════════════════════════════════════════════ */
  .bell-wrap { position: relative; display: inline-flex; align-items: center; }

  .bell-btn {
    position: relative; width: 38px; height: 38px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; outline: none;
    transition: background 0.15s, border-color 0.15s, transform 0.15s;
    flex-shrink: 0;
  }
  .bell-btn:hover { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.16); transform: translateY(-1px); }
  .bell-btn.has-notif { border-color: rgba(251,113,133,0.40); }
  .bell-btn.has-notif:hover { background: rgba(251,113,133,0.08); }

  .bell-ico { width: 17px; height: 17px; color: rgba(255,255,255,0.45); transition: color 0.15s; flex-shrink: 0; }
  .bell-btn:hover .bell-ico { color: rgba(255,255,255,0.85); }
  .bell-btn.has-notif .bell-ico { color: #fb7185; animation: bell-ring 0.55s ease-in-out; }
  @keyframes bell-ring {
    0%{transform:rotate(0)} 20%{transform:rotate(-14deg)} 40%{transform:rotate(14deg)}
    60%{transform:rotate(-9deg)} 80%{transform:rotate(9deg)} 100%{transform:rotate(0)}
  }

  .bell-badge {
    position: absolute; top: -5px; right: -5px;
    min-width: 17px; height: 17px;
    background: #fb7185; border: 2px solid rgba(5,8,5,0.95);
    border-radius: 99px; font-size: 9px; font-weight: 800; color: #fff;
    display: flex; align-items: center; justify-content: center; padding: 0 3px;
    animation: badge-pop 0.25s cubic-bezier(0.34,1.56,0.64,1); pointer-events: none;
  }
  @keyframes badge-pop { from{transform:scale(0)} to{transform:scale(1)} }

  /* ══════════════════════════════════════════════
     BELL PANEL
  ══════════════════════════════════════════════ */
  .bell-panel {
    position: absolute; top: calc(100% + 12px); right: 0;
    width: 360px; background: #0d1410;
    border: 1px solid rgba(255,255,255,0.11); border-radius: 16px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.75);
    z-index: 9999; overflow: hidden;
    animation: panel-slide 0.18s ease-out;
  }
  @keyframes panel-slide {
    from { opacity:0; transform:translateY(-8px) scale(0.97); }
    to   { opacity:1; transform:translateY(0)    scale(1);    }
  }

  .bell-tab-badge { background:#fb7185; color:#fff; font-size:9px; font-weight:800; padding:1px 5px; border-radius:99px; line-height:1.4; }

  /* notif list */
  .bell-panel-title { padding: 13px 16px 10px; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; color: #e8f0e9; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .bell-head { padding: 10px 16px 4px; display: flex; align-items: center; justify-content: space-between; }
  .bell-head-title { font-size: 12px; font-weight: 700; color: rgba(232,240,233,0.45); letter-spacing: 1px; text-transform: uppercase; }
  .bell-mark-all { font-size: 11px; font-weight: 600; color: rgba(232,240,233,0.30); background: none; border: none; cursor: pointer; transition: color 0.15s; padding: 0; font-family: 'Outfit', sans-serif; }
  .bell-mark-all:hover { color: #a3e635; }

  .bell-list { max-height: 300px; overflow-y: auto; }
  .bell-list::-webkit-scrollbar { width: 3px; }
  .bell-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

  .bell-item { padding: 11px 16px; display: flex; gap: 10px; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.12s; cursor: default; }
  .bell-item:last-child { border-bottom: none; }
  .bell-item:hover { background: rgba(255,255,255,0.03); }
  .bell-item.unread { background: rgba(251,113,133,0.04); }
  .bell-item.unread:hover { background: rgba(251,113,133,0.07); }

  .bell-dot { width: 7px; height: 7px; border-radius: 50%; background: #fb7185; box-shadow: 0 0 5px #fb7185; flex-shrink: 0; margin-top: 5px; }
  .bell-dot.read { background: rgba(255,255,255,0.12); box-shadow: none; }

  .bell-item-body { flex: 1; min-width: 0; }
  .bell-item-title { font-size: 12px; font-weight: 600; color: #e8f0e9; margin-bottom: 2px; line-height: 1.35; }
  .bell-item-sub   { font-size: 11px; color: rgba(232,240,233,0.45); line-height: 1.45; }
  .bell-item-time  { font-size: 10px; color: rgba(232,240,233,0.22); margin-top: 4px; }

  .bell-code {
    display: inline-flex; align-items: center; gap: 6px; margin-top: 7px;
    background: rgba(163,230,53,0.08); border: 1px solid rgba(163,230,53,0.22);
    border-radius: 8px; padding: 5px 11px;
    font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700;
    color: #a3e635; letter-spacing: 5px; cursor: pointer; transition: background 0.15s;
  }
  .bell-code:hover { background: rgba(163,230,53,0.15); }
  .bell-code-hint { font-family: 'Outfit', sans-serif; font-size: 9px; font-weight: 700; color: rgba(163,230,53,0.50); letter-spacing: 0; }

  .bell-empty { padding: 32px 20px; text-align: center; color: rgba(232,240,233,0.28); font-size: 12px; }
  .bell-empty-ico { font-size: 28px; margin-bottom: 8px; }
  .bell-footer { padding: 9px 16px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; font-size: 10px; color: rgba(232,240,233,0.20); }



  /* ── PROFILE CHIP ── */
  .nb-profile-chip { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px 5px 5px; border-radius: 100px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.10); text-decoration: none; transition: background 0.18s, border-color 0.18s, transform 0.14s; cursor: pointer; }
  .nb-profile-chip:hover { background: rgba(255,107,53,0.10); border-color: rgba(255,107,53,0.30); transform: translateY(-1px); }
  .nb-profile-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#ff6b35,#e84e1b); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; box-shadow: 0 0 0 2px rgba(255,107,53,0.25); user-select: none; }
  .nb-profile-name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.75); max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .nb-profile-chevron { font-size: 10px; color: rgba(255,255,255,0.30); margin-left: -2px; }

  /* ── LOGOUT / LOGIN BTN ── */
  .nb-btn-logout { font-family: 'Outfit', sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 9px 18px; border-radius: 9px; border: none; background: rgba(251,113,133,0.12); border: 1px solid rgba(251,113,133,0.22); color: #fb7185; cursor: pointer; transition: background 0.18s, transform 0.14s; white-space: nowrap; }
  .nb-btn-logout:hover { background: rgba(251,113,133,0.22); transform: translateY(-1px); }
  .nb-btn-login { font-family: 'Outfit', sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 9px 22px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.16); background: transparent; color: rgba(255,255,255,0.58); text-decoration: none; display: inline-flex; align-items: center; white-space: nowrap; transition: color 0.18s, border-color 0.18s, background 0.18s, transform 0.14s; }
  .nb-btn-login:hover { color: #fff; border-color: rgba(255,107,53,0.50); background: rgba(255,107,53,0.08); transform: translateY(-1px); }

  /* ── HAMBURGER ── */
  .nb-burger { display: none; flex-direction: column; justify-content: center; gap: 5px; background: none; border: none; cursor: pointer; padding: 8px; margin-left: auto; border-radius: 8px; width: 40px; height: 40px; transition: background 0.18s; flex-shrink: 0; }
  .nb-burger:hover { background: rgba(255,255,255,0.07); }
  .nb-burger span { display: block; width: 22px; height: 2px; background: rgba(255,255,255,0.70); border-radius: 2px; transition: transform 0.25s ease, opacity 0.2s ease, background 0.2s; transform-origin: center; }
  .nb-burger.nb-open span { background: #ff6b35; }
  .nb-burger.nb-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .nb-burger.nb-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nb-burger.nb-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ── MOBILE DRAWER ── */
  .nb-drawer { overflow: hidden; max-height: 0; background: rgba(5,8,5,0.98); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid rgba(255,255,255,0.06); transition: max-height 0.36s cubic-bezier(0.4,0,0.2,1); }
  .nb-drawer.nb-open { max-height: 700px; }
  .nb-drawer-inner { padding: 10px 16px 24px; display: flex; flex-direction: column; gap: 2px; }
  .nb-drawer-profile { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; background: rgba(255,107,53,0.07); border: 1px solid rgba(255,107,53,0.15); text-decoration: none; margin-bottom: 8px; transition: background 0.18s; }
  .nb-drawer-profile:hover { background: rgba(255,107,53,0.12); }
  .nb-drawer-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg,#ff6b35,#e84e1b); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; box-shadow: 0 0 0 2px rgba(255,107,53,0.25); }
  .nb-drawer-profile-name { font-size: 14px; font-weight: 700; color: #f0f7f0; }
  .nb-drawer-profile-hint { font-size: 11px; color: rgba(255,255,255,0.28); margin-top: 2px; }
  .nb-drawer .nb-link { font-size: 15px; padding: 12px 16px; border-radius: 10px; display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.45); }
  .nb-drawer .nb-link:hover { color: rgba(255,255,255,0.88); background: rgba(255,255,255,0.05); }
  .nb-drawer .nb-link.nb-active { color: #ff6b35; background: rgba(255,107,53,0.09); }
  .nb-drawer .nb-link.nb-active::after { display: none; }
  .nb-drawer-sep { height:1px; background:rgba(255,255,255,0.06); margin: 10px 4px 8px; }
  .nb-drawer-auth { display:flex; flex-direction:column; gap:8px; padding: 0 2px; }

  /* ── SPACER ── */
  .nb-spacer { height: 70px; }

  @media (min-width: 1100px) { .nb-link { padding: 7px 14px; font-size: 14px; } }
  @media (max-width: 900px) {
    .nb-links { display: none; } .nb-auth { display: none; } .nb-burger { display: flex; }
    .nb-bar { padding: 0 20px; height: 64px; } .nb-spacer { height: 64px; } .nb-logo { margin-right: 0; }
  }
  @media (max-width: 480px) {
    .nb-bar { padding: 0 16px; height: 60px; } .nb-spacer { height: 60px; }
    .nb-logo-feed, .nb-logo-fwd { font-size: 18px; } .nb-logo-dot { width:4px; height:4px; }
    .nb-drawer-inner { padding: 8px 12px 20px; } .nb-drawer .nb-link { font-size: 14px; padding: 11px 14px; }
    .bell-panel { width: calc(100vw - 32px); right: -10px; }
  }
  @media (max-width: 360px) { .nb-bar { padding: 0 12px; } .nb-logo-feed, .nb-logo-fwd { font-size: 16px; } }
`;

const NAV_ITEMS = [
  { to: "/",              label: "Home"              },
  { to: "/display",       label: "Food"              },
  { to: "/inventory",     label: "Inventory"         },
  { to: "/recipeSearch",  label: "Recipe Search"     },
  { to: "/wasteAnalysis", label: "Waste Analysis"    },
  { to: "/ecopro",        label: "Kitchen Analytics" },
];

const getInitials = (name = "") =>
  name.trim().split(/\s+/).slice(0,2).map(w => w[0]?.toUpperCase() || "").join("") || "U";

const relTime = (iso) => {
  if (!iso) return "";
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60)    return "just now";
  if (d < 3600)  return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
};

/* ══════════════════════════════════════════════════════
   BELL DROPDOWN — Notifications
══════════════════════════════════════════════════════ */
const BellDropdown = () => {
  const [notifs,  setNotifs]  = useState([]);
  const [copied,  setCopied]  = useState(null);

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

      {/* ── TITLE ── */}
      <div className="bell-panel-title">🔔 Notifications</div>

      {/* ── UNREAD HEADER ── */}
      {unread > 0 && (
        <div className="bell-head">
          <div className="bell-head-title">{unread} unread</div>
          <button className="bell-mark-all" onClick={markAllRead}>Mark all read</button>
        </div>
      )}

      {/* ── NOTIFICATIONS LIST ── */}
      <div className="bell-list">
        {notifs.length === 0 ? (
          <div className="bell-empty">
            <div className="bell-empty-ico">🔕</div>
            No notifications yet
          </div>
        ) : (
          notifs.map(notif => (
            <div
              key={notif._id}
              className={`bell-item ${notif.read ? "" : "unread"}`}
              onClick={() => markRead(notif._id)}
            >
              <div className={`bell-dot ${notif.read ? "read" : ""}`} />
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
                      {copied === notif._id ? "✓ copied!" : "tap to copy"}
                    </span>
                  </div>
                )}
                <div className="bell-item-time">{relTime(notif.createdAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bell-footer">Auto-refreshes every 20s</div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   BELL BUTTON — open/close + badge polling
══════════════════════════════════════════════════════ */
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

  /* close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    setOpen(v => !v);
    if (!open) setUnread(0); // optimistic clear on open
  };

  return (
    <div className="bell-wrap" ref={wrapRef}>
      <button
        className={`bell-btn ${unread > 0 ? "has-notif" : ""}`}
        onClick={handleToggle}
        title={unread > 0 ? `${unread} new notification${unread !== 1 ? "s" : ""}` : "Notifications & Forgot Code"}
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

/* ══════════════════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════════════════ */
const Navbar = () => {
  const { loggedIn, handleLogout } = useContext(AuthContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!loggedIn) { setUsername(""); return; }
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.username || payload.name) { setUsername(payload.username || payload.name); return; }
      }
    } catch { /* ignore */ }
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get(`${API_BASE}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setUsername(r.data?.username || ""))
      .catch(() => {});
  }, [loggedIn]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const initials    = getInitials(username);
  const displayName = username || "Profile";

  return (
    <>
      <style>{css}</style>

      <nav className={`nb-nav${scrolled ? " scrolled" : ""}`}>

        {/* ── TOP BAR ── */}
        <div className="nb-bar">

          <Link to="/" className="nb-logo" aria-label="FeedForward home">
            <span className="nb-logo-feed">Feed</span>
            <span className="nb-logo-fwd">Forward</span>
            <span className="nb-logo-dot" aria-hidden="true" />
          </Link>

          {/* Desktop nav links */}
          <ul className="nb-links">
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={`nb-link${isActive(to) ? " nb-active" : ""}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop auth */}
          <div className="nb-auth">
            {loggedIn ? (
              <>
                {/* 🔔 BELL — notifications + forgot code */}
                <BellButton />

                {/* Profile chip */}
                <Link to="/profile" className="nb-profile-chip" title="View your profile">
                  <div className="nb-profile-avatar">{initials}</div>
                  <span className="nb-profile-name">{displayName}</span>
                  <span className="nb-profile-chevron">▾</span>
                </Link>

                <button className="nb-btn-logout" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <Link to="/login" className="nb-btn-login">Log In</Link>
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
            <span /><span /><span />
          </button>
        </div>

        {/* ── MOBILE DRAWER ── */}
        <div id="nb-drawer" className={`nb-drawer${open ? " nb-open" : ""}`} aria-hidden={!open}>
          <div className="nb-drawer-inner">

            {loggedIn && (
              <Link to="/profile" className="nb-drawer-profile">
                <div className="nb-drawer-avatar">{initials}</div>
                <div>
                  <div className="nb-drawer-profile-name">{displayName}</div>
                  <div className="nb-drawer-profile-hint">Tap to view profile →</div>
                </div>
              </Link>
            )}

            {NAV_ITEMS.map(({ to, label }) => (
              <Link key={to} to={to} className={`nb-link${isActive(to) ? " nb-active" : ""}`}>
                {label}
              </Link>
            ))}

            <div className="nb-drawer-sep" />
            <div className="nb-drawer-auth">
              {loggedIn ? (
                <button
                  className="nb-btn-logout"
                  style={{ width:"100%", textAlign:"center", padding:"14px", borderRadius:"10px", fontSize:"13px" }}
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="nb-btn-login"
                  style={{ width:"100%", justifyContent:"center", padding:"14px", borderRadius:"10px", fontSize:"13px" }}
                >
                  Log In
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