import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

/* ─────────────────────────────────────────────────────────────
   NOTIFICATION BELL
   Shows a bell icon in the navbar with a red badge count.
   Donors receive notifications when a collector requests a
   code resend (forgot their code). The notification shows:
     • Collector's name
     • Food item they reserved
     • Their pickup code (so donor can tell them verbally)
───────────────────────────────────────────────────────────── */

const css = `
  /* ── BELL WRAPPER ── */
  .nb-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  /* ── BELL BUTTON ── */
  .nb-btn {
    position: relative;
    width: 40px; height: 40px;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    outline: none;
  }
  .nb-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.14); }
  .nb-btn.has-notif { border-color: rgba(251,113,133,0.35); }

  /* bell icon svg */
  .nb-bell { width: 18px; height: 18px; color: #a0a8a1; transition: color 0.15s; }
  .nb-btn:hover .nb-bell { color: #e8f0e9; }
  .nb-btn.has-notif .nb-bell { color: #fb7185; animation: nb-ring 0.5s ease-in-out; }
  @keyframes nb-ring {
    0%  { transform: rotate(0); }
    20% { transform: rotate(-15deg); }
    40% { transform: rotate(15deg); }
    60% { transform: rotate(-10deg); }
    80% { transform: rotate(10deg); }
    100%{ transform: rotate(0); }
  }

  /* ── BADGE ── */
  .nb-badge {
    position: absolute;
    top: -4px; right: -4px;
    min-width: 17px; height: 17px;
    background: #fb7185;
    border: 2px solid #080b09;
    border-radius: 99px;
    font-size: 9px; font-weight: 800;
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px;
    animation: nb-pop 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes nb-pop { from { transform: scale(0); } to { transform: scale(1); } }

  /* ── DROPDOWN PANEL ── */
  .nb-panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 340px;
    background: #0e1410;
    border: 1px solid rgba(255,255,255,0.11);
    border-radius: 14px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.70);
    z-index: 9999;
    overflow: hidden;
    animation: nb-slide 0.18s ease-out;
  }
  @keyframes nb-slide { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform: translateY(0); } }

  .nb-panel-head {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: space-between;
  }
  .nb-panel-title {
    font-family: 'Fraunces', serif;
    font-size: 15px; font-weight: 700;
    color: #e8f0e9;
  }
  .nb-mark-all {
    font-size: 11px; font-weight: 600;
    color: rgba(232,240,233,0.40);
    background: none; border: none; cursor: pointer;
    transition: color 0.15s;
    padding: 0;
  }
  .nb-mark-all:hover { color: #a3e635; }

  /* ── NOTIFICATION LIST ── */
  .nb-list { max-height: 360px; overflow-y: auto; }
  .nb-list::-webkit-scrollbar { width: 4px; }
  .nb-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

  .nb-item {
    padding: 13px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; gap: 12px; align-items: flex-start;
    transition: background 0.12s;
    cursor: default;
  }
  .nb-item:last-child { border-bottom: none; }
  .nb-item:hover { background: rgba(255,255,255,0.03); }
  .nb-item.unread { background: rgba(251,113,133,0.04); }
  .nb-item.unread:hover { background: rgba(251,113,133,0.07); }

  .nb-item-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #fb7185; flex-shrink: 0; margin-top: 5px;
    box-shadow: 0 0 6px #fb7185;
  }
  .nb-item-dot.read { background: rgba(255,255,255,0.12); box-shadow: none; }

  .nb-item-body { flex: 1; min-width: 0; }
  .nb-item-title {
    font-size: 13px; font-weight: 600;
    color: #e8f0e9; margin-bottom: 3px; line-height: 1.35;
  }
  .nb-item-sub {
    font-size: 12px; color: rgba(232,240,233,0.50); line-height: 1.4;
  }

  /* code pill inside notification */
  .nb-code {
    display: inline-flex; align-items: center; gap: 5px;
    margin-top: 7px;
    background: rgba(163,230,53,0.08);
    border: 1px solid rgba(163,230,53,0.22);
    border-radius: 8px;
    padding: 5px 10px;
    font-family: 'Fraunces', serif;
    font-size: 16px; font-weight: 900;
    color: #a3e635; letter-spacing: 4px;
    cursor: pointer; transition: background 0.15s;
  }
  .nb-code:hover { background: rgba(163,230,53,0.15); }
  .nb-code-copy { font-size: 10px; font-weight: 700; color: rgba(163,230,53,0.55); letter-spacing: 0; margin-left: 2px; }

  .nb-item-time {
    font-size: 10px; color: rgba(232,240,233,0.25);
    margin-top: 5px;
  }

  /* ── EMPTY STATE ── */
  .nb-empty {
    padding: 36px 20px;
    text-align: center;
    color: rgba(232,240,233,0.30);
    font-size: 13px;
  }
  .nb-empty-ico { font-size: 32px; margin-bottom: 8px; }

  /* ── FOOTER ── */
  .nb-footer {
    padding: 10px 16px;
    border-top: 1px solid rgba(255,255,255,0.07);
    text-align: center;
    font-size: 11px; color: rgba(232,240,233,0.28);
  }
`;

/* ── Format relative time ── */
const relTime = (iso) => {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)  return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = () => {
  const [open,    setOpen]    = useState(false);
  const [notifs,  setNotifs]  = useState([]);   // array of notification objects
  const [copied,  setCopied]  = useState(null); // id of the just-copied notif
  const wrapRef  = useRef(null);
  const pollRef  = useRef(null);

  const unread = notifs.filter(n => !n.read).length;

  /* ── Fetch notifications from backend ── */
  const fetchNotifs = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs(Array.isArray(data) ? data : []);
    } catch { /* ignore if endpoint not ready */ }
  }, []);

  /* ── Poll every 20s ── */
  useEffect(() => {
    fetchNotifs();
    pollRef.current = setInterval(fetchNotifs, 20000);
    return () => clearInterval(pollRef.current);
  }, [fetchNotifs]);

  /* ── Close panel when clicking outside ── */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Mark all as read when panel opens ── */
  const handleOpen = async () => {
    setOpen(o => !o);
    if (!open && unread > 0) {
      // optimistic
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
      try {
        const token = localStorage.getItem("token");
        await axios.patch(`${API_URL}/api/notifications/read-all`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch { /* ignore */ }
    }
  };

  /* ── Mark single notification read ── */
  const markRead = async (id) => {
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* ignore */ }
  };

  /* ── Copy code to clipboard ── */
  const copyCode = (notif) => {
    if (!notif.code) return;
    navigator.clipboard.writeText(notif.code).then(() => {
      setCopied(notif._id);
      setTimeout(() => setCopied(null), 2000);
      markRead(notif._id);
    });
  };

  return (
    <>
      <style>{css}</style>
      <div className="nb-wrap" ref={wrapRef}>

        {/* Bell button */}
        <button
          className={`nb-btn ${unread > 0 ? "has-notif" : ""}`}
          onClick={handleOpen}
          title={unread > 0 ? `${unread} new notification${unread !== 1 ? "s" : ""}` : "Notifications"}
        >
          {/* Bell SVG */}
          <svg className="nb-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unread > 0 && (
            <span className="nb-badge">{unread > 99 ? "99+" : unread}</span>
          )}
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="nb-panel">
            <div className="nb-panel-head">
              <div className="nb-panel-title">🔔 Notifications</div>
              {unread > 0 && (
                <button className="nb-mark-all" onClick={async () => {
                  setNotifs(prev => prev.map(n => ({ ...n, read: true })));
                  try {
                    const token = localStorage.getItem("token");
                    await axios.patch(`${API_URL}/api/notifications/read-all`, {}, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                  } catch { /* ignore */ }
                }}>
                  Mark all read
                </button>
              )}
            </div>

            <div className="nb-list">
              {notifs.length === 0 ? (
                <div className="nb-empty">
                  <div className="nb-empty-ico">🔕</div>
                  No notifications yet
                </div>
              ) : (
                notifs.map(notif => (
                  <div
                    key={notif._id}
                    className={`nb-item ${notif.read ? "" : "unread"}`}
                    onClick={() => markRead(notif._id)}
                  >
                    <div className={`nb-item-dot ${notif.read ? "read" : ""}`} />
                    <div className="nb-item-body">
                      <div className="nb-item-title">{notif.title}</div>
                      <div className="nb-item-sub">{notif.message}</div>
                      {/* Show code pill if this is a code-resend notification */}
                      {notif.code && (
                        <div
                          className="nb-code"
                          onClick={(e) => { e.stopPropagation(); copyCode(notif); }}
                          title="Tap to copy code"
                        >
                          {notif.code}
                          <span className="nb-code-copy">
                            {copied === notif._id ? "✓ copied!" : "tap to copy"}
                          </span>
                        </div>
                      )}
                      <div className="nb-item-time">{relTime(notif.createdAt)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="nb-footer">
              Notifications auto-refresh every 20 seconds
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationBell;