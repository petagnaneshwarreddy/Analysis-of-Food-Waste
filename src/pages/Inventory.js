import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.REACT_APP_API_URL;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  :root {
    --bg:       #080b09;
    --s1:       #0e1410;
    --s2:       #141d16;
    --s3:       #1a261c;
    --border:   rgba(255,255,255,0.06);
    --border2:  rgba(255,255,255,0.11);
    --lime:     #a3e635;
    --lime-dim: rgba(163,230,53,0.1);
    --lime-mid: rgba(163,230,53,0.18);
    --red:      #fb7185;
    --red-dim:  rgba(251,113,133,0.1);
    --amber:    #fbbf24;
    --amber-dim:rgba(251,191,36,0.1);
    --blue:     #60a5fa;
    --blue-dim: rgba(96,165,250,0.1);
    --text:     #e8f0e9;
    --t2:       rgba(232,240,233,0.5);
    --t3:       rgba(232,240,233,0.22);
    --t4:       rgba(232,240,233,0.07);
    --r:        16px;
    --r-sm:     9px;
    --sh:       0 4px 28px rgba(0,0,0,0.5);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .iv-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Instrument Sans', sans-serif;
    color: var(--text);
    padding-bottom: 100px;
  }

  /* ── HERO ── */
  .iv-hero {
    position: relative; overflow: hidden;
    padding: 48px 24px 40px;
    background: linear-gradient(145deg, #0c1f0e 0%, #080b09 65%);
    border-bottom: 1px solid var(--border);
  }
  .iv-hero::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 55% 70% at 90% 15%, rgba(163,230,53,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 30% 40% at 5%  85%, rgba(163,230,53,0.04) 0%, transparent 60%);
  }
  .iv-hero-inner {
    max-width: 1120px; margin: 0 auto;
    display: flex; align-items: center;
    justify-content: space-between; gap: 20px; flex-wrap: wrap;
    position: relative; z-index: 1;
  }
  .iv-badge {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: var(--lime); border: 1px solid rgba(163,230,53,0.3);
    background: var(--lime-dim); padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;
  }
  .iv-badge::before {
    content: ''; width: 5px; height: 5px; border-radius: 50%;
    background: var(--lime); box-shadow: 0 0 8px var(--lime);
    animation: ivblink 2s ease-in-out infinite;
  }
  @keyframes ivblink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  .iv-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(28px, 5vw, 52px); font-weight: 900;
    line-height: 1.05; letter-spacing: -1.5px; color: var(--text);
  }
  .iv-title em { font-style: italic; color: var(--lime); }
  .iv-sub { margin-top: 8px; font-size: 14px; color: var(--t2); max-width: 380px; line-height: 1.6; }
  .iv-hero-num {
    font-family: 'Fraunces', serif;
    font-size: clamp(52px, 9vw, 88px); font-weight: 900;
    color: var(--t4); line-height: 1; letter-spacing: -4px; user-select: none; flex-shrink: 0;
  }

  /* ── STATS ROW ── */
  .iv-stats {
    max-width: 1120px; margin: 24px auto 0; padding: 0 16px;
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  }
  @media (max-width: 480px) { .iv-stats { grid-template-columns: 1fr; } }
  .iv-stat {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 16px 20px;
    position: relative; overflow: hidden;
  }
  .iv-stat::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    border-radius: 0 0 var(--r-sm) var(--r-sm);
  }
  .iv-stat:nth-child(1)::after { background: var(--lime);  }
  .iv-stat:nth-child(2)::after { background: var(--amber); }
  .iv-stat:nth-child(3)::after { background: var(--red);   }
  .iv-stat-n {
    font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700;
    line-height: 1; margin-bottom: 4px;
  }
  .iv-stat:nth-child(1) .iv-stat-n { color: var(--lime);  }
  .iv-stat:nth-child(2) .iv-stat-n { color: var(--amber); }
  .iv-stat:nth-child(3) .iv-stat-n { color: var(--red);   }
  .iv-stat-l { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3); }

  /* ── LAYOUT ── */
  .iv-body {
    max-width: 1120px; margin: 20px auto 0; padding: 0 16px;
    display: grid; grid-template-columns: 340px 1fr;
    gap: 20px; align-items: start;
  }
  @media (max-width: 920px) {
    .iv-body { grid-template-columns: 1fr; padding: 0 12px; }
  }

  /* ── FORM CARD ── */
  .iv-card {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r); padding: 26px; box-shadow: var(--sh);
    position: sticky; top: 20px;
  }
  .iv-card-head {
    font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700;
    color: var(--text); margin-bottom: 22px;
    display: flex; align-items: center; gap: 10px;
  }
  .iv-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--lime); box-shadow: 0 0 10px var(--lime); flex-shrink: 0;
  }

  .iv-form  { display: flex; flex-direction: column; gap: 14px; }
  .iv-field { display: flex; flex-direction: column; gap: 6px; }
  .iv-row   { display: flex; gap: 12px; }
  .iv-row .iv-field { flex: 1; }
  .iv-label {
    font-size: 10px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--t3);
  }
  .iv-input {
    width: 100%; padding: 11px 14px;
    font-family: 'Instrument Sans', sans-serif; font-size: 14px; color: var(--text);
    background: var(--s2); border: 1px solid var(--border);
    border-radius: var(--r-sm); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none;
  }
  .iv-input::placeholder { color: var(--t3); }
  .iv-input:focus { border-color: var(--lime); box-shadow: 0 0 0 3px rgba(163,230,53,0.1); }
  .iv-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }

  .iv-btn {
    padding: 14px; background: var(--lime); color: #0c1a06;
    font-family: 'Instrument Sans', sans-serif; font-size: 14px; font-weight: 700;
    border: none; border-radius: var(--r-sm); cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 48px; box-shadow: 0 4px 20px rgba(163,230,53,0.3);
  }
  .iv-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .iv-btn:disabled { opacity: 0.4; cursor: default; box-shadow: none; }

  .iv-msg {
    padding: 11px 14px; border-radius: var(--r-sm);
    font-size: 13px; font-weight: 500; text-align: center;
  }
  .iv-msg.ok  { background: var(--lime-dim); color: var(--lime); border: 1px solid rgba(163,230,53,0.2); }
  .iv-msg.err { background: var(--red-dim);  color: var(--red);  border: 1px solid rgba(251,113,133,0.2); }

  /* ── TABLE CARD ── */
  .iv-tcard {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r); box-shadow: var(--sh); overflow: hidden;
  }
  .iv-tcard-top {
    padding: 20px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  }
  .iv-pill {
    background: var(--lime-dim); color: var(--lime);
    border: 1px solid rgba(163,230,53,0.2); border-radius: 20px;
    padding: 3px 12px; font-size: 12px; font-weight: 600;
  }

  /* Desktop table */
  .iv-tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table.iv-tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 600px; }
  .iv-tbl th {
    padding: 11px 16px; text-align: left; font-size: 10px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase; color: var(--t3);
    background: var(--s2); border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  .iv-tbl td {
    padding: 13px 16px; color: var(--text);
    border-bottom: 1px solid var(--border); vertical-align: middle;
  }
  .iv-tbl tbody tr:last-child td { border-bottom: none; }
  .iv-tbl tbody tr { transition: background 0.12s; }
  .iv-tbl tbody tr:hover td { background: var(--s2); }
  .iv-iname { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; color: var(--text); }
  .iv-sub { color: var(--t2); font-size: 12.5px; }

  /* Status badges */
  .iv-badge-fresh    { background: var(--lime-dim);  color: var(--lime);  border: 1px solid rgba(163,230,53,0.2); }
  .iv-badge-expiring { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(251,191,36,0.2); }
  .iv-badge-expired  { background: var(--red-dim);   color: var(--red);   border: 1px solid rgba(251,113,133,0.2); }
  .iv-badge-fresh, .iv-badge-expiring, .iv-badge-expired {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 700; white-space: nowrap;
  }

  .iv-del {
    padding: 6px 12px; background: var(--red-dim); color: var(--red);
    border: 1px solid rgba(251,113,133,0.2); border-radius: 6px;
    font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; white-space: nowrap; transition: opacity 0.18s, transform 0.12s;
  }
  .iv-del:hover { opacity: 0.78; transform: translateY(-1px); }

  /* Mobile cards */
  .iv-mcards { display: none; flex-direction: column; gap: 12px; padding: 16px; }
  @media (max-width: 640px) {
    .iv-tbl-wrap { display: none; }
    .iv-mcards   { display: flex;  }
  }
  .iv-mcard {
    background: var(--s2); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 16px;
  }
  .iv-mcard-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 10px; margin-bottom: 10px;
  }
  .iv-mcard-name { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; color: var(--text); }
  .iv-mcard-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .iv-mtag {
    font-size: 11px; font-weight: 600; color: var(--t2);
    background: var(--s1); border: 1px solid var(--border);
    border-radius: 20px; padding: 2px 9px;
  }
  .iv-mtag.exp { color: var(--red); background: var(--red-dim); border-color: rgba(251,113,133,0.2); }
  .iv-mtag.warn { color: var(--amber); background: var(--amber-dim); border-color: rgba(251,191,36,0.2); }

  /* Empty */
  .iv-empty { padding: 60px 24px; text-align: center; }
  .iv-empty-ico { font-size: 44px; margin-bottom: 12px; }
  .iv-empty-txt { color: var(--t2); font-size: 14px; }

  /* Login */
  .iv-login {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 14px; background: var(--bg);
  }
  .iv-login-ico { font-size: 52px; }
  .iv-login-txt { font-family: 'Fraunces', serif; font-size: 22px; color: var(--t2); }

  /* Toast */
  .iv-toast {
    position: fixed; top: 20px; left: 50%;
    transform: translateX(-50%);
    padding: 12px 22px; border-radius: 100px;
    font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    z-index: 999; white-space: nowrap; max-width: 90vw;
    pointer-events: none;
  }
  .iv-toast.ok  { background: var(--lime-dim);  color: var(--lime);  border: 1px solid rgba(163,230,53,0.25);  }
  .iv-toast.err { background: var(--red-dim);   color: var(--red);   border: 1px solid rgba(251,113,133,0.25); }
`;

const Inventory = () => {
  const { loggedIn } = useContext(AuthContext);
  const [itemName,         setItemName]         = useState("");
  const [itemQuantity,     setItemQuantity]      = useState("");
  const [itemCost,         setItemCost]          = useState("");
  const [itemPurchaseDate, setItemPurchaseDate]  = useState("");
  const [itemExpiryDate,   setItemExpiryDate]    = useState("");
  const [inventoryData,    setInventoryData]     = useState([]);
  const [loading,          setLoading]           = useState(false);
  const [toast,            setToast]             = useState(null);

  useEffect(() => { if (loggedIn) fetchInventory(); }, [loggedIn]);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventoryData(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { showToast("You must be logged in.", "err"); setLoading(false); return; }
      const res = await axios.post(
        `${API_URL}/api/inventory`,
        { itemName, itemQuantity, itemCost, itemPurchaseDate, itemExpiryDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Item added!", "ok");
      const item = res.data?.data || res.data;
      if (item?._id) setInventoryData(p => [...p, item]);
      else await fetchInventory();
      setItemName(""); setItemQuantity(""); setItemCost("");
      setItemPurchaseDate(""); setItemExpiryDate("");
    } catch { showToast("Failed to add item.", "err"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventoryData(p => p.filter(i => i._id !== id));
      showToast("Item deleted.", "ok");
    } catch { showToast("Failed to delete.", "err"); }
  };

  const daysUntil = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);
  const isExpired  = (d) => daysUntil(d) < 0;
  const isExpiring = (d) => { const n = daysUntil(d); return n >= 0 && n <= 3; };
  const getStatus  = (d) => isExpired(d) ? "expired" : isExpiring(d) ? "expiring" : "fresh";

  const total    = inventoryData.length;
  const expiring = inventoryData.filter(i => isExpiring(i.itemExpiryDate)).length;
  const expired  = inventoryData.filter(i => isExpired(i.itemExpiryDate)).length;

  if (!loggedIn) return (
    <>
      <style>{css}</style>
      <div className="iv-login">
        <div className="iv-login-ico">🔒</div>
        <div className="iv-login-txt">Please log in to continue</div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className={`iv-toast ${toast.type}`}
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {toast.type === "ok" ? "✓" : "✕"} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="iv-root">

        {/* Hero */}
        <div className="iv-hero">
          <div className="iv-hero-inner">
            <div>
              <div className="iv-badge">Kitchen Manager</div>
              <h1 className="iv-title">Your <em>Inventory</em></h1>
              <p className="iv-sub">Track, manage and reduce food waste effortlessly.</p>
            </div>
            <div className="iv-hero-num">{total}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="iv-stats">
          {[
            { n: total,    l: "Total Items"    },
            { n: expiring, l: "Expiring Soon"  },
            { n: expired,  l: "Expired"        },
          ].map(({ n, l }) => (
            <div className="iv-stat" key={l}>
              <div className="iv-stat-n">{n}</div>
              <div className="iv-stat-l">{l}</div>
            </div>
          ))}
        </div>

        <div className="iv-body">

          {/* Form */}
          <div className="iv-card">
            <div className="iv-card-head"><span className="iv-dot" />Add New Item</div>
            <form onSubmit={handleSubmit} className="iv-form">

              <div className="iv-field">
                <label className="iv-label">Item Name</label>
                <input className="iv-input" type="text" value={itemName}
                  placeholder="e.g. Tomatoes" onChange={e => setItemName(e.target.value)} required />
              </div>

              <div className="iv-row">
                <div className="iv-field">
                  <label className="iv-label">Quantity (g)</label>
                  <input className="iv-input" type="number" value={itemQuantity}
                    placeholder="500" onChange={e => setItemQuantity(e.target.value)} required />
                </div>
                <div className="iv-field">
                  <label className="iv-label">Cost (₹)</label>
                  <input className="iv-input" type="number" value={itemCost}
                    placeholder="80" onChange={e => setItemCost(e.target.value)} required />
                </div>
              </div>

              <div className="iv-field">
                <label className="iv-label">Purchase Date</label>
                <input className="iv-input" type="date" value={itemPurchaseDate}
                  onChange={e => setItemPurchaseDate(e.target.value)} required />
              </div>

              <div className="iv-field">
                <label className="iv-label">Expiry Date</label>
                <input className="iv-input" type="date" value={itemExpiryDate}
                  onChange={e => setItemExpiryDate(e.target.value)} required />
              </div>

              <button className="iv-btn" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={20} style={{ color: "#0c1a06" }} /> : "Add to Inventory →"}
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="iv-tcard">
            <div className="iv-tcard-top">
              <div className="iv-card-head" style={{ margin: 0 }}><span className="iv-dot" />Inventory List</div>
              {inventoryData.length > 0 && <span className="iv-pill">{inventoryData.length} items</span>}
            </div>

            {inventoryData.length === 0 ? (
              <div className="iv-empty">
                <div className="iv-empty-ico">📦</div>
                <div className="iv-empty-txt">No items yet. Add your first inventory item.</div>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="iv-tbl-wrap">
                  <table className="iv-tbl">
                    <thead>
                      <tr>{["Item","Qty","Cost","Purchased","Expires","Status","Action"].map(h => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {inventoryData.map((item, i) => {
                          const st = getStatus(item.itemExpiryDate);
                          return (
                            <motion.tr key={item._id}
                              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.03 }}>
                              <td><span className="iv-iname">{item.itemName}</span></td>
                              <td><span className="iv-sub">{item.itemQuantity}g</span></td>
                              <td><span className="iv-sub">₹{Number(item.itemCost).toFixed(2)}</span></td>
                              <td><span className="iv-sub">{new Date(item.itemPurchaseDate).toLocaleDateString()}</span></td>
                              <td>
                                <span className={`iv-sub ${st === "expired" ? "iv-sub-red" : st === "expiring" ? "iv-sub-amber" : ""}`}
                                  style={{ color: st === "expired" ? "var(--red)" : st === "expiring" ? "var(--amber)" : "var(--t2)" }}>
                                  {new Date(item.itemExpiryDate).toLocaleDateString()}
                                </span>
                              </td>
                              <td>
                                <span className={`iv-badge-${st === "fresh" ? "fresh" : st === "expiring" ? "expiring" : "expired"}`}>
                                  {st === "fresh" ? "✓ Fresh" : st === "expiring" ? "⚠ Expiring" : "✕ Expired"}
                                </span>
                              </td>
                              <td>
                                <button className="iv-del" onClick={() => handleDelete(item._id)}>Delete</button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="iv-mcards">
                  <AnimatePresence>
                    {inventoryData.map((item, i) => {
                      const st = getStatus(item.itemExpiryDate);
                      return (
                        <motion.div key={item._id} className="iv-mcard"
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.03 }}>
                          <div className="iv-mcard-top">
                            <div>
                              <div className="iv-mcard-name">{item.itemName}</div>
                            </div>
                            <span className={`iv-badge-${st === "fresh" ? "fresh" : st === "expiring" ? "expiring" : "expired"}`}>
                              {st === "fresh" ? "✓ Fresh" : st === "expiring" ? "⚠ Expiring" : "✕ Expired"}
                            </span>
                          </div>
                          <div className="iv-mcard-tags">
                            <span className="iv-mtag">📦 {item.itemQuantity}g</span>
                            <span className="iv-mtag">₹{Number(item.itemCost).toFixed(2)}</span>
                            <span className="iv-mtag">🛒 {new Date(item.itemPurchaseDate).toLocaleDateString()}</span>
                            <span className={`iv-mtag ${st === "expired" ? "exp" : st === "expiring" ? "warn" : ""}`}>
                              ⏳ {new Date(item.itemExpiryDate).toLocaleDateString()}
                            </span>
                          </div>
                          <button className="iv-del" onClick={() => handleDelete(item._id)}>Delete</button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Inventory;