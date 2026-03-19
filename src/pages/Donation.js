// import React, { useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { AuthContext } from "../AuthContext";
// import { CircularProgress } from "@mui/material";

// const API_URL   = process.env.REACT_APP_API_URL;
// const RENDER_URL = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

//   :root {
//     --bg:       #080b09;
//     --s1:       #0e1410;
//     --s2:       #141d16;
//     --s3:       #1a261c;
//     --border:   rgba(255,255,255,0.06);
//     --border2:  rgba(255,255,255,0.11);
//     --lime:     #a3e635;
//     --lime-dim: rgba(163,230,53,0.1);
//     --lime-mid: rgba(163,230,53,0.2);
//     --red:      #fb7185;
//     --red-dim:  rgba(251,113,133,0.1);
//     --gold:     #fbbf24;
//     --gold-dim: rgba(251,191,36,0.1);
//     --text:     #e8f0e9;
//     --t2:       rgba(232,240,233,0.5);
//     --t3:       rgba(232,240,233,0.22);
//     --t4:       rgba(232,240,233,0.07);
//     --r:        16px;
//     --r-sm:     9px;
//     --sh:       0 4px 28px rgba(0,0,0,0.5);
//   }

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   .w-root {
//     min-height: 100vh;
//     background: var(--bg);
//     font-family: 'Instrument Sans', sans-serif;
//     color: var(--text);
//     padding-bottom: 100px;
//   }

//   /* ── HERO ── */
//   .w-hero {
//     position: relative; overflow: hidden;
//     padding: 48px 24px 40px;
//     background: linear-gradient(145deg, #0c1f0e 0%, #080b09 65%);
//     border-bottom: 1px solid var(--border);
//   }
//   .w-hero::after {
//     content: '';
//     position: absolute; inset: 0; pointer-events: none;
//     background:
//       radial-gradient(ellipse 55% 70% at 95% 20%, rgba(163,230,53,0.08) 0%, transparent 60%),
//       radial-gradient(ellipse 35% 50% at 5% 90%, rgba(163,230,53,0.04) 0%, transparent 60%);
//   }
//   .w-hero-inner {
//     max-width: 1120px; margin: 0 auto;
//     display: flex; align-items: center;
//     justify-content: space-between; gap: 20px; flex-wrap: wrap;
//     position: relative; z-index: 1;
//   }
//   .w-hero-badge {
//     display: inline-flex; align-items: center; gap: 7px;
//     font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
//     color: var(--lime); border: 1px solid rgba(163,230,53,0.3);
//     background: var(--lime-dim); padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;
//   }
//   .w-hero-badge::before {
//     content: ''; width: 5px; height: 5px; border-radius: 50%;
//     background: var(--lime); box-shadow: 0 0 8px var(--lime);
//     animation: blink 2s ease-in-out infinite;
//   }
//   @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
//   .w-hero-title {
//     font-family: 'Fraunces', serif;
//     font-size: clamp(30px, 5vw, 52px); font-weight: 900;
//     line-height: 1.05; letter-spacing: -1px; color: var(--text);
//   }
//   .w-hero-title em { font-style: italic; color: var(--lime); }
//   .w-hero-right { text-align: right; flex-shrink: 0; }
//   .w-hero-count {
//     font-family: 'Fraunces', serif;
//     font-size: clamp(52px, 9vw, 88px); font-weight: 900;
//     color: var(--t4); line-height: 1; letter-spacing: -5px; user-select: none;
//   }
//   .w-hero-label {
//     font-size: 10px; font-weight: 600; letter-spacing: 2px;
//     text-transform: uppercase; color: var(--t3); margin-top: 4px;
//   }

//   /* ── BODY ── */
//   .w-body {
//     max-width: 1120px; margin: 28px auto 0; padding: 0 16px;
//     display: grid; grid-template-columns: 360px 1fr;
//     gap: 20px; align-items: start;
//   }
//   @media (max-width: 920px) {
//     .w-body { grid-template-columns: 1fr; padding: 0 12px; margin-top: 20px; }
//   }

//   /* ── FORM CARD ── */
//   .w-card {
//     background: var(--s1); border: 1px solid var(--border);
//     border-radius: var(--r); padding: 26px; box-shadow: var(--sh);
//   }
//   .w-card-head {
//     font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700;
//     color: var(--text); margin-bottom: 22px;
//     display: flex; align-items: center; gap: 10px;
//   }
//   .w-dot {
//     width: 8px; height: 8px; border-radius: 50%;
//     background: var(--lime); box-shadow: 0 0 10px var(--lime); flex-shrink: 0;
//   }

//   .w-form { display: flex; flex-direction: column; gap: 14px; }
//   .w-field { display: flex; flex-direction: column; gap: 6px; }
//   .w-label {
//     font-size: 10px; font-weight: 700; letter-spacing: 2px;
//     text-transform: uppercase; color: var(--t3);
//   }
//   .w-input {
//     width: 100%; padding: 11px 14px;
//     font-family: 'Instrument Sans', sans-serif; font-size: 14px; color: var(--text);
//     background: var(--s2); border: 1px solid var(--border);
//     border-radius: var(--r-sm); outline: none;
//     transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none;
//   }
//   .w-input::placeholder { color: var(--t3); }
//   .w-input:focus { border-color: var(--lime); box-shadow: 0 0 0 3px rgba(163,230,53,0.1); }
//   .w-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
//   .w-input[type="file"] { padding: 9px 14px; cursor: pointer; font-size: 13px; color: var(--t2); }
//   .w-input[type="file"]::file-selector-button {
//     font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 700;
//     background: var(--lime-dim); color: var(--lime);
//     border: 1px solid rgba(163,230,53,0.25); padding: 5px 12px;
//     border-radius: 6px; cursor: pointer; margin-right: 10px;
//   }

//   .w-btn {
//     margin-top: 4px; padding: 14px; background: var(--lime); color: #0c1a06;
//     font-family: 'Instrument Sans', sans-serif; font-size: 14px; font-weight: 700;
//     letter-spacing: 0.3px; border: none; border-radius: var(--r-sm); cursor: pointer;
//     transition: opacity 0.2s, transform 0.15s;
//     display: flex; align-items: center; justify-content: center; min-height: 48px;
//     box-shadow: 0 4px 20px rgba(163,230,53,0.3);
//   }
//   .w-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
//   .w-btn:disabled { opacity: 0.4; cursor: default; box-shadow: none; }

//   .w-msg {
//     padding: 11px 14px; border-radius: var(--r-sm);
//     font-size: 13px; font-weight: 500; text-align: center;
//   }
//   .w-msg.ok { background: var(--lime-dim); color: var(--lime); border: 1px solid rgba(163,230,53,0.2); }
//   .w-msg.err { background: var(--red-dim); color: var(--red); border: 1px solid rgba(251,113,133,0.2); }

//   /* ── LOCATION ── */
//   .w-loc-wrap { position: relative; }
//   .w-loc-row { display: flex; gap: 8px; }
//   .w-loc-input-wrap { position: relative; flex: 1; }
//   .w-loc-btn {
//     flex-shrink: 0; padding: 11px 14px;
//     background: var(--lime-dim); color: var(--lime);
//     border: 1px solid rgba(163,230,53,0.25); border-radius: var(--r-sm);
//     font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 700;
//     cursor: pointer; white-space: nowrap;
//     display: flex; align-items: center; gap: 5px;
//     transition: background 0.2s; outline: none;
//   }
//   .w-loc-btn:hover { background: var(--lime-mid); }
//   .w-loc-btn:disabled { opacity: 0.5; cursor: default; }
//   .w-loc-spin {
//     width: 11px; height: 11px;
//     border: 2px solid rgba(163,230,53,0.25);
//     border-top-color: var(--lime); border-radius: 50%;
//     animation: locspin 0.7s linear infinite;
//   }
//   @keyframes locspin { to { transform: rotate(360deg); } }
//   .w-loc-drop {
//     position: absolute; top: calc(100% + 5px); left: 0; right: 0;
//     background: var(--s1); border: 1px solid var(--border2);
//     border-radius: var(--r-sm); box-shadow: 0 12px 40px rgba(0,0,0,0.6);
//     z-index: 200; overflow: hidden; max-height: 230px; overflow-y: auto;
//   }
//   .w-loc-drop::-webkit-scrollbar { width: 4px; }
//   .w-loc-drop::-webkit-scrollbar-track { background: var(--s2); }
//   .w-loc-drop::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
//   .w-loc-opt {
//     padding: 11px 14px; cursor: pointer;
//     display: flex; align-items: flex-start; gap: 10px;
//     border-bottom: 1px solid var(--border);
//     transition: background 0.12s;
//   }
//   .w-loc-opt:last-child { border-bottom: none; }
//   .w-loc-opt:hover { background: var(--s2); }
//   .w-loc-ico { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
//   .w-loc-main { font-size: 13px; font-weight: 600; color: var(--text); }
//   .w-loc-sec { font-size: 11px; color: var(--t2); margin-top: 2px; line-height: 1.4; }
//   .w-loc-searching {
//     padding: 14px 16px; text-align: center; color: var(--t2); font-size: 13px;
//     display: flex; align-items: center; justify-content: center; gap: 8px;
//   }
//   .w-loc-empty { padding: 14px 16px; text-align: center; color: var(--t3); font-size: 13px; }
//   .w-loc-status {
//     font-size: 11px; color: var(--t2); margin-top: 5px;
//     display: flex; align-items: center; gap: 5px;
//   }
//   .w-loc-status.ok { color: var(--lime); }
//   .w-loc-status.err { color: var(--red); }

//   /* ── TABLE CARD ── */
//   .w-tcard {
//     background: var(--s1); border: 1px solid var(--border);
//     border-radius: var(--r); box-shadow: var(--sh); overflow: hidden;
//   }
//   .w-tcard-top {
//     padding: 20px 24px; border-bottom: 1px solid var(--border);
//     display: flex; align-items: center; justify-content: space-between;
//     gap: 12px; flex-wrap: wrap;
//   }
//   .w-pill {
//     background: var(--lime-dim); color: var(--lime);
//     border: 1px solid rgba(163,230,53,0.2); border-radius: 20px;
//     padding: 3px 12px; font-size: 12px; font-weight: 600;
//   }

//   .w-tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
//   table.w-tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 580px; }
//   .w-tbl th {
//     padding: 11px 16px; text-align: left; font-size: 10px; font-weight: 700;
//     letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3);
//     background: var(--s2); border-bottom: 1px solid var(--border); white-space: nowrap;
//   }
//   .w-tbl td {
//     padding: 13px 16px; color: var(--text);
//     border-bottom: 1px solid var(--border); vertical-align: middle;
//   }
//   .w-tbl tbody tr:last-child td { border-bottom: none; }
//   .w-tbl tbody tr { transition: background 0.12s; }
//   .w-tbl tbody tr:hover td { background: var(--s2); }
//   .w-tbl tr.sold-row td { opacity: 0.55; }

//   .w-name { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; }
//   .w-qty {
//     display: inline-block; background: var(--lime-dim); color: var(--lime);
//     border: 1px solid rgba(163,230,53,0.18); border-radius: 20px;
//     padding: 3px 10px; font-size: 12px; font-weight: 700; white-space: nowrap;
//   }
//   .w-sub { color: var(--t2); font-size: 12.5px; }
//   .w-thumb { width: 42px; height: 42px; border-radius: var(--r-sm); object-fit: cover; border: 1px solid var(--border); }
//   .w-no-img {
//     width: 42px; height: 42px; border-radius: var(--r-sm);
//     background: var(--s2); border: 1px solid var(--border);
//     display: flex; align-items: center; justify-content: center;
//     font-size: 16px; color: var(--t3);
//   }
//   .w-sold-badge {
//     display: inline-block; background: var(--gold-dim); color: var(--gold);
//     border: 1px solid rgba(251,191,36,0.25); border-radius: 20px;
//     padding: 2px 9px; font-size: 10px; font-weight: 700;
//     letter-spacing: 0.5px; text-transform: uppercase;
//   }

//   .w-acts { display: flex; gap: 6px; }
//   .w-act {
//     padding: 6px 12px; font-family: 'Instrument Sans', sans-serif; font-size: 12px;
//     font-weight: 700; border-radius: 6px; cursor: pointer; white-space: nowrap;
//     border: none; transition: opacity 0.18s, transform 0.12s;
//   }
//   .w-act:hover { opacity: 0.78; transform: translateY(-1px); }
//   .w-del  { background: var(--red-dim);  color: var(--red);  border: 1px solid rgba(251,113,133,0.2); }
//   .w-appr { background: var(--lime-dim); color: var(--lime); border: 1px solid rgba(163,230,53,0.2); }

//   /* ── MOBILE CARDS ── */
//   .w-mcards { display: none; flex-direction: column; gap: 12px; padding: 16px; }
//   @media (max-width: 640px) {
//     .w-tbl-wrap { display: none; }
//     .w-mcards { display: flex; }
//   }
//   .w-mcard {
//     background: var(--s2); border: 1px solid var(--border);
//     border-radius: var(--r-sm); padding: 14px 16px;
//     display: flex; gap: 14px; align-items: flex-start;
//   }
//   .w-mcard-body { flex: 1; min-width: 0; }
//   .w-mcard-name {
//     font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700;
//     color: var(--text); margin-bottom: 8px;
//     display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
//   }
//   .w-mcard-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
//   .w-mtag {
//     font-size: 11px; font-weight: 500; color: var(--t2);
//     background: var(--s1); border: 1px solid var(--border);
//     border-radius: 20px; padding: 2px 9px;
//   }
//   .w-mcard-reason { font-size: 12px; color: var(--t2); margin-bottom: 12px; font-style: italic; }
//   .w-mcard-acts { display: flex; gap: 8px; }

//   /* ── EMPTY / LOG ── */
//   .w-empty { padding: 60px 24px; text-align: center; }
//   .w-empty-ico { font-size: 44px; margin-bottom: 12px; }
//   .w-empty-txt { color: var(--t2); font-size: 14px; }

//   .w-log { max-width: 1120px; margin: 20px auto 0; padding: 0 16px; }
//   .w-log-inner {
//     background: var(--s1); border: 1px solid var(--border);
//     border-radius: var(--r); padding: 20px 24px; box-shadow: var(--sh);
//   }
//   .w-log-list { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
//   .w-log-item {
//     padding: 10px 14px; background: var(--lime-dim);
//     border: 1px solid rgba(163,230,53,0.15); border-radius: var(--r-sm);
//     font-size: 13px; font-weight: 500; color: var(--lime);
//   }

//   /* ── LOGIN ── */
//   .w-login {
//     min-height: 100vh; display: flex; flex-direction: column;
//     align-items: center; justify-content: center; gap: 14px; background: var(--bg);
//   }
//   .w-login-ico { font-size: 52px; }
//   .w-login-txt { font-family: 'Fraunces', serif; font-size: 22px; color: var(--t2); }
// `;

// /* ── Smart Photo ── */
// const Photo = ({ item, size = 42 }) => {
//   const paths = item.image?.startsWith("http")
//     ? [item.image]
//     : [`${API_URL}/uploads/${item.image}`, `${API_URL}/api/uploads/${item.image}`,
//        `${RENDER_URL}/uploads/${item.image}`, `${RENDER_URL}/api/uploads/${item.image}`].filter(Boolean);
//   const [idx, setIdx] = React.useState(0);
//   const [broken, setBroken] = React.useState(false);
//   if (!item.image || broken)
//     return <div className="w-no-img" style={{ width: size, height: size }}>📷</div>;
//   return (
//     <img src={paths[idx]} alt={item.foodItem} className="w-thumb"
//       style={{ width: size, height: size }}
//       onError={() => { if (idx + 1 < paths.length) setIdx(idx + 1); else setBroken(true); }} />
//   );
// };

// /* ── Location Field ── */
// const LocationField = ({ value, onChange }) => {
//   const [suggestions, setSuggestions] = React.useState([]);
//   const [showDrop, setShowDrop]       = React.useState(false);
//   const [searching, setSearching]     = React.useState(false);
//   const [detecting, setDetecting]     = React.useState(false);
//   const [status, setStatus]           = React.useState(null);
//   const debounce = React.useRef(null);
//   const wrap     = React.useRef(null);

//   React.useEffect(() => {
//     const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setShowDrop(false); };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);

//   const handleInput = (e) => {
//     const v = e.target.value;
//     onChange(v); setStatus(null);
//     if (debounce.current) clearTimeout(debounce.current);
//     if (v.trim().length < 3) { setSuggestions([]); setShowDrop(false); return; }
//     debounce.current = setTimeout(async () => {
//       setSearching(true); setShowDrop(true);
//       try {
//         const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(v)}&format=json&limit=6&addressdetails=1`, { headers: { "Accept-Language": "en" } });
//         setSuggestions(await r.json());
//       } catch { setSuggestions([]); }
//       finally { setSearching(false); }
//     }, 400);
//   };

//   const select = (item) => {
//     const a = item.address || {};
//     const parts = [a.city || a.town || a.village || a.county || a.state_district, a.state, a.country].filter(Boolean);
//     onChange(parts.length ? parts.join(", ") : item.display_name.split(",").slice(0,3).join(",").trim());
//     setSuggestions([]); setShowDrop(false);
//     setStatus({ type: "ok", text: "Location selected ✓" });
//   };

//   const detect = () => {
//     if (!navigator.geolocation) { setStatus({ type: "err", text: "Geolocation not supported" }); return; }
//     setDetecting(true); setStatus(null);
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         try {
//           const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&addressdetails=1`, { headers: { "Accept-Language": "en" } });
//           const d = await r.json();
//           const a = d.address || {};
//           const parts = [a.city || a.town || a.village || a.county || a.state_district, a.state, a.country].filter(Boolean);
//           const name = parts.length ? parts.join(", ") : d.display_name.split(",").slice(0,3).join(",").trim();
//           onChange(name);
//           setStatus({ type: "ok", text: `📍 ${name}` });
//         } catch { setStatus({ type: "err", text: "Reverse geocoding failed" }); }
//         setDetecting(false);
//       },
//       (err) => {
//         setDetecting(false);
//         setStatus({ type: "err", text: err.code === 1 ? "Location permission denied" : "Could not get location" });
//       },
//       { timeout: 12000, maximumAge: 60000 }
//     );
//   };

//   const icon = (item) => {
//     const t = item.type || item.class || "";
//     if (["city","town","village","municipality"].includes(t)) return "🏙️";
//     if (["restaurant","cafe","food"].includes(t)) return "🍽️";
//     if (["hospital","clinic"].includes(t)) return "🏥";
//     if (["school","university"].includes(t)) return "🎓";
//     return "📍";
//   };

//   return (
//     <div className="w-loc-wrap" ref={wrap}>
//       <div className="w-loc-row">
//         <div className="w-loc-input-wrap">
//           <input className="w-input" type="text" value={value}
//             placeholder="Type city or click Auto…"
//             onChange={handleInput}
//             onFocus={() => { if (suggestions.length) setShowDrop(true); }}
//             autoComplete="off" required />
//           {showDrop && (
//             <div className="w-loc-drop">
//               {searching
//                 ? <div className="w-loc-searching"><div className="w-loc-spin" /> Searching…</div>
//                 : suggestions.length === 0
//                 ? <div className="w-loc-empty">No results found</div>
//                 : suggestions.map(s => (
//                   <div key={s.place_id} className="w-loc-opt" onMouseDown={() => select(s)}>
//                     <span className="w-loc-ico">{icon(s)}</span>
//                     <div>
//                       <div className="w-loc-main">{s.address?.city || s.address?.town || s.address?.village || s.address?.county || s.display_name.split(",")[0]}</div>
//                       <div className="w-loc-sec">{s.display_name.split(",").slice(1,4).join(",").trim()}</div>
//                     </div>
//                   </div>
//                 ))
//               }
//             </div>
//           )}
//         </div>
//         <button type="button" className="w-loc-btn" onClick={detect} disabled={detecting}>
//           {detecting ? <div className="w-loc-spin" /> : "📍"}
//           {detecting ? "Getting…" : "Auto"}
//         </button>
//       </div>
//       {status && <div className={`w-loc-status ${status.type}`}>{status.text}</div>}
//     </div>
//   );
// };

// /* ── Main Waste Component ── */
// const Waste = () => {
//   const { loggedIn } = useContext(AuthContext);
//   const [foodItem,      setFoodItem]      = useState("");
//   const [foodQuantity,  setFoodQuantity]  = useState("");
//   const [foodReason,    setFoodReason]    = useState("");
//   const [foodWasteDate, setFoodWasteDate] = useState("");
//   const [location,      setLocation]      = useState("");
//   const [image,         setImage]         = useState(null);
//   const [wasteData,     setWasteData]     = useState([]);
//   const [loading,       setLoading]       = useState(false);
//   const [message,       setMessage]       = useState("");
//   const [messageType,   setMessageType]   = useState("ok");
//   const [approvalMsgs,  setApprovalMsgs]  = useState([]);

//   useEffect(() => { if (loggedIn) fetchWasteData(); }, [loggedIn]);

//   const fetchWasteData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const res = await axios.get(`${API_URL}/api/waste`, { headers: { Authorization: `Bearer ${token}` } });
//       const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
//       setWasteData(data.filter(Boolean));
//     } catch (e) { console.error(e); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); setMessage("");
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) { setMessage("You must be logged in."); setMessageType("err"); setLoading(false); return; }
//       const fd = new FormData();
//       fd.append("foodItem", foodItem); fd.append("foodQuantity", foodQuantity);
//       fd.append("foodReason", foodReason); fd.append("foodWasteDate", foodWasteDate);
//       fd.append("location", location);
//       if (image) fd.append("image", image);
//       const res = await axios.post(`${API_URL}/api/waste`, fd, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//       });
//       setMessage("Entry added!"); setMessageType("ok");
//       const item = res.data;
//       if (item?._id) setWasteData(p => [item, ...p]);
//       else await fetchWasteData();
//       setFoodItem(""); setFoodQuantity(""); setFoodReason("");
//       setFoodWasteDate(""); setLocation(""); setImage(null);
//     } catch { setMessage("Failed to add entry."); setMessageType("err"); }
//     finally { setLoading(false); }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this entry?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API_URL}/api/waste/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       setWasteData(p => p.filter(i => i._id !== id));
//     } catch (e) {
//       const s = e?.response?.status;
//       if (s === 404) setWasteData(p => p.filter(i => i._id !== id));
//       else alert(`Delete failed (${s ?? "network error"})`);
//     }
//   };

//   const handleApprove = async (id, quantity, name) => {
//     try {
//       const token = localStorage.getItem("token");
//       const qty = Math.floor(quantity * 0.9);
//       await axios.patch(`${API_URL}/api/waste/approve/${id}`, { foodQuantity: qty }, { headers: { Authorization: `Bearer ${token}` } });
//       setWasteData(p => p.map(i => i._id === id ? { ...i, approved: true, foodQuantity: qty } : i));
//       setApprovalMsgs(p => [...p, `${name} → Sold Out (qty: ${qty}g)`]);
//     } catch (e) {
//       const status = e?.response?.status;
//       if (status === 400) {
//         // Backend says already approved — sync the UI to show Sold Out
//         setWasteData(p => p.map(i => i._id === id ? { ...i, approved: true } : i));
//       } else {
//         alert(`Approve failed (${status ?? "network error"})`);
//       }
//     }
//   };

//   if (!loggedIn) return (
//     <>
//       <style>{css}</style>
//       <div className="w-login">
//         <div className="w-login-ico">🔒</div>
//         <div className="w-login-txt">Please log in to continue</div>
//       </div>
//     </>
//   );

//   const fields = [
//     { label: "Food Item",        val: foodItem,      set: setFoodItem,      type: "text",   ph: "e.g. Rice, Bread…" },
//     { label: "Quantity (grams)", val: foodQuantity,  set: setFoodQuantity,  type: "number", ph: "e.g. 250" },
//     { label: "Reason for Waste", val: foodReason,    set: setFoodReason,    type: "text",   ph: "e.g. Expired, Overcooked…" },
//     { label: "Date",             val: foodWasteDate, set: setFoodWasteDate, type: "date",   ph: "" },
//   ];

//   return (
//     <>
//       <style>{css}</style>
//       <div className="w-root">

//         {/* Hero */}
//         <div className="w-hero">
//           <div className="w-hero-inner">
//             <div>
//               <div className="w-hero-badge">Food Tracker</div>
//               <h1 className="w-hero-title">Log Your <em>Food Waste</em></h1>
//             </div>
//             <div className="w-hero-right">
//               <div className="w-hero-count">{wasteData.length}</div>
//               <div className="w-hero-label">Total Entries</div>
//             </div>
//           </div>
//         </div>

//         <div className="w-body">

//           {/* Form */}
//           <div className="w-card">
//             <div className="w-card-head"><span className="w-dot" />Add Waste Entry</div>
//             <form onSubmit={handleSubmit} className="w-form">
//               {fields.map(({ label, val, set, type, ph }) => (
//                 <div className="w-field" key={label}>
//                   <label className="w-label">{label}</label>
//                   <input className="w-input" type={type} value={val} placeholder={ph}
//                     onChange={e => set(e.target.value)} required />
//                 </div>
//               ))}
//               <div className="w-field">
//                 <label className="w-label">Location</label>
//                 <LocationField value={location} onChange={setLocation} />
//               </div>
//               <div className="w-field">
//                 <label className="w-label">Photo (optional)</label>
//                 <input className="w-input" type="file" accept="image/*"
//                   onChange={e => setImage(e.target.files[0])} />
//               </div>
//               <button type="submit" className="w-btn" disabled={loading}>
//                 {loading ? <CircularProgress size={20} style={{ color: "#0c1a06" }} /> : "Add Entry →"}
//               </button>
//               {message && <div className={`w-msg ${messageType}`}>{message}</div>}
//             </form>
//           </div>

//           {/* Records */}
//           <div className="w-tcard">
//             <div className="w-tcard-top">
//               <div className="w-card-head" style={{ margin: 0 }}><span className="w-dot" />Waste Records</div>
//               {wasteData.length > 0 && <span className="w-pill">{wasteData.length} entries</span>}
//             </div>

//             {wasteData.length === 0 ? (
//               <div className="w-empty">
//                 <div className="w-empty-ico">🗒️</div>
//                 <div className="w-empty-txt">No waste records yet. Add your first entry.</div>
//               </div>
//             ) : (
//               <>
//                 {/* Desktop */}
//                 <div className="w-tbl-wrap">
//                   <table className="w-tbl">
//                     <thead>
//                       <tr>{["Item","Qty","Reason","Date","Location","Photo","Actions"].map(h => <th key={h}>{h}</th>)}</tr>
//                     </thead>
//                     <tbody>
//                       {wasteData.filter(Boolean).map(item => (
//                         <tr key={item._id} className={item.approved ? "sold-row" : ""}>
//                           <td>
//                             <span className="w-name">{item.foodItem}</span>
//                             {item.approved && <span className="w-sold-badge" style={{ marginLeft: 8 }}>Sold Out</span>}
//                           </td>
//                           <td><span className="w-qty">{item.foodQuantity}g</span></td>
//                           <td><span className="w-sub">{item.foodReason}</span></td>
//                           <td><span className="w-sub">{new Date(item.foodWasteDate).toLocaleDateString()}</span></td>
//                           <td><span className="w-sub">{item.location}</span></td>
//                           <td><Photo item={item} /></td>
//                           <td>
//                             <div className="w-acts">
//                               <button className="w-act w-del" onClick={() => handleDelete(item._id)}>Delete</button>
//                               <button className="w-act w-appr"
//                                 onClick={() => handleApprove(item._id, item.foodQuantity, item.foodItem)}
//                                 disabled={item.approved}
//                                 style={item.approved ? { opacity: 0.35, cursor: "default" } : {}}
//                               >{item.approved ? "✔ Done" : "Approve"}</button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Mobile */}
//                 <div className="w-mcards">
//                   {wasteData.filter(Boolean).map(item => (
//                     <div className="w-mcard" key={item._id} style={item.approved ? { opacity: 0.65 } : {}}>
//                       <Photo item={item} size={52} />
//                       <div className="w-mcard-body">
//                         <div className="w-mcard-name">
//                           {item.foodItem}
//                           {item.approved && <span className="w-sold-badge">Sold Out</span>}
//                         </div>
//                         <div className="w-mcard-meta">
//                           <span className="w-qty">{item.foodQuantity}g</span>
//                           <span className="w-mtag">📅 {new Date(item.foodWasteDate).toLocaleDateString()}</span>
//                           <span className="w-mtag">📍 {item.location}</span>
//                         </div>
//                         <div className="w-mcard-reason">"{item.foodReason}"</div>
//                         <div className="w-mcard-acts">
//                           <button className="w-act w-del" onClick={() => handleDelete(item._id)}>Delete</button>
//                           <button className="w-act w-appr"
//                             onClick={() => handleApprove(item._id, item.foodQuantity, item.foodItem)}
//                             disabled={item.approved}
//                             style={item.approved ? { opacity: 0.35, cursor: "default" } : {}}
//                           >{item.approved ? "✔ Done" : "Approve"}</button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {approvalMsgs.length > 0 && (
//           <div className="w-log">
//             <div className="w-log-inner">
//               <div className="w-card-head" style={{ margin: 0 }}><span className="w-dot" />Approval Log</div>
//               <ul className="w-log-list">
//                 {approvalMsgs.map((m, i) => <li className="w-log-item" key={i}>✔ {m}</li>)}
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Waste;