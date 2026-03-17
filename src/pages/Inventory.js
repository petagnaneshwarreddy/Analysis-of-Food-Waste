import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { CircularProgress, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const Inventory = () => {
  const { loggedIn } = useContext(AuthContext);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemPurchaseDate, setItemPurchaseDate] = useState("");
  const [itemExpiryDate, setItemExpiryDate] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (loggedIn) fetchInventoryData();
  }, [loggedIn]);

  const fetchInventoryData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const response = await axios.get("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventoryData(response.data);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newItem = { itemName, itemQuantity, itemCost, itemPurchaseDate, itemExpiryDate };
    try {
      const token = localStorage.getItem("token");
      if (!token) { showMessage("You must be logged in.", "error"); setLoading(false); return; }
      const response = await axios.post("http://localhost:5000/inventory", newItem, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      showMessage("Item added successfully!", "success");
      setInventoryData([...inventoryData, response.data.data]);
      setItemName(""); setItemQuantity(""); setItemCost(""); setItemPurchaseDate(""); setItemExpiryDate("");
    } catch {
      showMessage("Failed to add item.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      await axios.delete(`http://localhost:5000/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventoryData(inventoryData.filter((item) => item._id !== id));
      showMessage("Item deleted successfully!", "success");
    } catch {
      showMessage("Failed to delete item.", "error");
    }
  };

  const isExpiringSoon = (expiryDate) => {
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 3 && days >= 0;
  };

  const isExpired = (expiryDate) => new Date(expiryDate) < new Date();

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        input:focus { outline: none; border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f0ff; }
        ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 10px; }
        table tr:hover td { background: #f5f3ff !important; }
      `}</style>

      {loggedIn ? (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            style={s.header}
          >
            <div style={s.headerAccent} />
            <h1 style={s.title}>Your <span style={s.titleHighlight}>Inventory</span></h1>
            <p style={s.subtitle}>Track, manage, and reduce food waste effortlessly</p>
          </motion.div>

          {/* Toast Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ ...s.toast, background: messageType === "success" ? "#d1fae5" : "#fee2e2", color: messageType === "success" ? "#065f46" : "#991b1b", borderLeft: `4px solid ${messageType === "success" ? "#10b981" : "#ef4444"}` }}
              >
                {messageType === "success" ? "✅" : "❌"} {message}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={s.layout}>
            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={s.formCard}
            >
              <div style={s.formHeader}>
                <span style={s.formIcon}>➕</span>
                <h2 style={s.formTitle}>Add New Item</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Item Name</label>
                  <input style={s.input} type="text" value={itemName} placeholder="e.g. Tomatoes" onChange={(e) => setItemName(e.target.value)} required />
                </div>
                <div style={s.row}>
                  <div style={{ ...s.fieldGroup, flex: 1 }}>
                    <label style={s.label}>Quantity (g)</label>
                    <input style={s.input} type="number" value={itemQuantity} placeholder="500" onChange={(e) => setItemQuantity(e.target.value)} required />
                  </div>
                  <div style={{ ...s.fieldGroup, flex: 1 }}>
                    <label style={s.label}>Cost (₹)</label>
                    <input style={s.input} type="number" value={itemCost} placeholder="80" onChange={(e) => setItemCost(e.target.value)} required />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>📅 Purchase Date</label>
                  <input style={s.input} type="date" value={itemPurchaseDate} onChange={(e) => setItemPurchaseDate(e.target.value)} required />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>⏳ Expiry Date</label>
                  <input style={s.input} type="date" value={itemExpiryDate} onChange={(e) => setItemExpiryDate(e.target.value)} required />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={s.submitBtn}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} style={{ color: "white" }} /> : "Add to Inventory"}
                </motion.button>
              </form>

              {/* Summary */}
              <div style={s.summary}>
                <div style={s.statBox}>
                  <span style={s.statNum}>{inventoryData.length}</span>
                  <span style={s.statLabel}>Total Items</span>
                </div>
                <div style={s.statBox}>
                  <span style={{ ...s.statNum, color: "#f59e0b" }}>{inventoryData.filter(i => isExpiringSoon(i.itemExpiryDate)).length}</span>
                  <span style={s.statLabel}>Expiring Soon</span>
                </div>
                <div style={s.statBox}>
                  <span style={{ ...s.statNum, color: "#ef4444" }}>{inventoryData.filter(i => isExpired(i.itemExpiryDate)).length}</span>
                  <span style={s.statLabel}>Expired</span>
                </div>
              </div>
            </motion.div>

            {/* Table Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={s.tableCard}
            >
              <div style={s.tableTopBar}>
                <h2 style={s.tableTitle}>📦 Inventory List</h2>
                <span style={s.tableCount}>{inventoryData.length} items</span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {["Item Name", "Qty (g)", "Cost (₹)", "Purchase Date", "Expiry Date", "Status", "Action"].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {inventoryData.length > 0 ? inventoryData.map((item, i) => {
                        const expired = isExpired(item.itemExpiryDate);
                        const expiring = isExpiringSoon(item.itemExpiryDate);
                        const status = expired ? { label: "Expired", color: "#fef2f2", badge: "#fee2e2", text: "#dc2626" }
                          : expiring ? { label: "Expiring Soon", color: "#fffbeb", badge: "#fef3c7", text: "#d97706" }
                          : { label: "Fresh", color: "#fff", badge: "#d1fae5", text: "#059669" };
                        return (
                          <motion.tr
                            key={item._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <td style={{ ...s.td, fontWeight: 600, color: "#1e1b4b" }}>{item.itemName}</td>
                            <td style={s.td}>{item.itemQuantity}g</td>
                            <td style={s.td}>₹{Number(item.itemCost).toFixed(2)}</td>
                            <td style={s.td}>{new Date(item.itemPurchaseDate).toLocaleDateString()}</td>
                            <td style={{ ...s.td, color: expired ? "#dc2626" : expiring ? "#d97706" : "#374151" }}>
                              {new Date(item.itemExpiryDate).toLocaleDateString()}
                            </td>
                            <td style={s.td}>
                              <span style={{ ...s.badge, background: status.badge, color: status.text }}>
                                {status.label}
                              </span>
                            </td>
                            <td style={s.td}>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={s.deleteBtn}
                                onClick={() => handleDelete(item._id)}
                              >
                                🗑 Delete
                              </motion.button>
                            </td>
                          </motion.tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan="7" style={s.noData}>
                            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📭</div>
                            <div>No items in inventory yet. Add your first item!</div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔒</div>
          <Typography style={{ color: "#6b7280", fontSize: "1.2rem" }}>Please log in to view your Inventory.</Typography>
        </div>
      )}
    </div>
  );
};

export default Inventory;

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #f5f3ff 0%, #ede9fe 40%, #fdf4ff 100%)",
    padding: "40px 24px 60px",
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    position: "relative",
  },
  headerAccent: {
    width: "80px",
    height: "5px",
    background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
    borderRadius: "10px",
    margin: "0 auto 20px",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    fontWeight: 800,
    color: "#1e1b4b",
    margin: "0 0 8px",
  },
  titleHighlight: {
    background: "linear-gradient(135deg, #7c3aed, #c026d3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "1rem",
    margin: 0,
  },
  toast: {
    maxWidth: "500px",
    margin: "0 auto 24px",
    padding: "14px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
  },
  layout: {
    display: "flex",
    flexWrap: "wrap",
    gap: "28px",
    maxWidth: "1400px",
    margin: "0 auto",
    alignItems: "flex-start",
  },
  formCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 4px 30px rgba(124,58,237,0.1)",
    width: "340px",
    flexShrink: 0,
    border: "1px solid #ede9fe",
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "24px",
  },
  formIcon: {
    width: "36px",
    height: "36px",
    background: "#f5f3ff",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  formTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#1e1b4b",
    margin: 0,
  },
  fieldGroup: {
    marginBottom: "16px",
  },
  row: {
    display: "flex",
    gap: "12px",
    marginBottom: "0",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#4b5563",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    fontSize: "14px",
    color: "#1f2937",
    background: "#fafafa",
    transition: "all 0.2s",
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 4px 15px rgba(124,58,237,0.3)",
  },
  summary: {
    display: "flex",
    gap: "10px",
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid #f3f4f6",
  },
  statBox: {
    flex: 1,
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "12px 8px",
    textAlign: "center",
    border: "1px solid #f3f4f6",
  },
  statNum: {
    display: "block",
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#7c3aed",
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: "11px",
    color: "#9ca3af",
    fontWeight: 500,
  },
  tableCard: {
    flex: 1,
    minWidth: "300px",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 4px 30px rgba(124,58,237,0.1)",
    border: "1px solid #ede9fe",
    overflow: "hidden",
  },
  tableTopBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "22px 28px",
    borderBottom: "1px solid #f3f4f6",
  },
  tableTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#1e1b4b",
    margin: 0,
  },
  tableCount: {
    background: "#f5f3ff",
    color: "#7c3aed",
    fontWeight: 700,
    fontSize: "13px",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    background: "#fafafa",
    borderBottom: "2px solid #f3f4f6",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "16px 20px",
    borderBottom: "1px solid #f9fafb",
    color: "#374151",
    transition: "background 0.15s",
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  deleteBtn: {
    background: "transparent",
    color: "#ef4444",
    border: "1.5px solid #fecaca",
    padding: "6px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  noData: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#9ca3af",
    fontSize: "15px",
  },
};