import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { CircularProgress } from "@mui/material";

const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Mulish:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .wt-root {
    min-height: 100vh;
    background: #f7f4ef;
    font-family: 'Mulish', sans-serif;
    padding: 48px 24px 80px;
  }

  /* Header */
  .wt-header {
    max-width: 1100px;
    margin: 0 auto 40px;
    display: flex;
    align-items: flex-end;
    gap: 20px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
  }
  .wt-header-tag {
    font-family: 'Mulish', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
    background: #1a1a1a;
    padding: 4px 12px;
    border-radius: 4px;
    margin-bottom: 10px;
    display: inline-block;
  }
  .wt-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1;
    letter-spacing: -2px;
    flex: 1;
  }
  .wt-title em {
    font-style: normal;
    color: #c0392b;
  }
  .wt-counter {
    font-family: 'Syne', sans-serif;
    font-size: 64px;
    font-weight: 800;
    color: rgba(26,26,26,0.08);
    line-height: 1;
    letter-spacing: -4px;
  }

  /* Layout */
  .wt-layout {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 860px) {
    .wt-layout { grid-template-columns: 1fr; }
  }

  /* Cards */
  .wt-card {
    background: #fff;
    border-radius: 16px;
    padding: 28px;
    border: 1.5px solid rgba(26,26,26,0.08);
  }
  .wt-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .wt-card-title::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 18px;
    background: #c0392b;
    border-radius: 3px;
  }

  /* Form */
  .wt-form { display: flex; flex-direction: column; gap: 12px; }
  .wt-field { display: flex; flex-direction: column; gap: 5px; }
  .wt-field-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(26,26,26,0.45);
  }
  .wt-input {
    padding: 11px 14px;
    font-family: 'Mulish', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    background: #f7f4ef;
    border: 1.5px solid transparent;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    width: 100%;
  }
  .wt-input::placeholder { color: rgba(26,26,26,0.3); }
  .wt-input:focus {
    border-color: #c0392b;
    background: #fff;
  }
  .wt-input[type="file"] {
    padding: 8px 14px;
    cursor: pointer;
    font-size: 13px;
  }
  .wt-input[type="file"]::file-selector-button {
    font-family: 'Mulish', sans-serif;
    font-size: 12px;
    font-weight: 600;
    background: #1a1a1a;
    color: #fff;
    border: none;
    padding: 5px 12px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
  }

  .wt-btn {
    margin-top: 6px;
    padding: 14px;
    background: #1a1a1a;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
  }
  .wt-btn:hover:not(:disabled) {
    background: #c0392b;
    transform: translateY(-1px);
  }
  .wt-btn:disabled { opacity: 0.5; cursor: default; }

  /* Message */
  .wt-message {
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    margin-top: 4px;
  }
  .wt-message.success { background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf; }
  .wt-message.error { background: #fdf2f2; color: #c0392b; border: 1px solid #f5c6c6; }

  /* Table card */
  .wt-table-card {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid rgba(26,26,26,0.08);
    overflow: hidden;
  }
  .wt-table-header {
    padding: 24px 28px 20px;
    border-bottom: 1.5px solid rgba(26,26,26,0.07);
  }

  .wt-table-wrap { overflow-x: auto; }
  table.wt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }
  .wt-table thead tr {
    background: #f7f4ef;
  }
  .wt-table th {
    padding: 12px 16px;
    text-align: left;
    font-family: 'Mulish', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(26,26,26,0.45);
    white-space: nowrap;
    border-bottom: 1.5px solid rgba(26,26,26,0.07);
  }
  .wt-table td {
    padding: 13px 16px;
    color: #1a1a1a;
    font-weight: 500;
    border-bottom: 1px solid rgba(26,26,26,0.05);
    vertical-align: middle;
  }
  .wt-table tbody tr:last-child td { border-bottom: none; }
  .wt-table tbody tr:hover td { background: #fdf9f5; }

  .wt-food-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #1a1a1a;
  }

  .wt-qty-badge {
    display: inline-block;
    background: #f7f4ef;
    border: 1px solid rgba(26,26,26,0.1);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 12px;
    font-weight: 700;
    color: #1a1a1a;
    white-space: nowrap;
  }

  .wt-thumb {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    object-fit: cover;
    border: 1.5px solid rgba(26,26,26,0.08);
  }
  .wt-no-img {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: #f0ece6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: rgba(26,26,26,0.2);
  }

  .wt-actions { display: flex; gap: 6px; flex-wrap: nowrap; }
  .wt-action-btn {
    padding: 6px 12px;
    font-family: 'Mulish', sans-serif;
    font-size: 12px;
    font-weight: 700;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.2s, transform 0.15s;
  }
  .wt-action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .wt-del { background: #fdf2f2; color: #c0392b; border: 1px solid #f5c6c6; }
  .wt-approve { background: #eafaf1; color: #1e8449; border: 1px solid #a9dfbf; }

  /* Empty state */
  .wt-empty {
    padding: 48px 24px;
    text-align: center;
    color: rgba(26,26,26,0.3);
    font-size: 14px;
  }
  .wt-empty-icon { font-size: 36px; margin-bottom: 10px; }

  /* Approval messages */
  .wt-approvals {
    max-width: 1100px;
    margin: 24px auto 0;
    background: #fff;
    border-radius: 16px;
    padding: 24px 28px;
    border: 1.5px solid rgba(26,26,26,0.08);
  }
  .wt-approvals ul { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
  .wt-approvals li {
    padding: 10px 14px;
    background: #eafaf1;
    border: 1px solid #a9dfbf;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #1e8449;
  }

  /* Not logged in */
  .wt-login-prompt {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: rgba(26,26,26,0.35);
    gap: 12px;
  }
  .wt-login-prompt span { font-size: 48px; }
`;

const Waste = () => {
  const { loggedIn } = useContext(AuthContext);
  const [foodItem, setFoodItem] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [foodReason, setFoodReason] = useState("");
  const [foodWasteDate, setFoodWasteDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [approvalMessages, setApprovalMessages] = useState([]);

  useEffect(() => {
    if (loggedIn) fetchWasteData();
  }, [loggedIn]);

  const fetchWasteData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get("http://localhost:5000/waste", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWasteData(response.data);
    } catch (error) {
      console.error("Error fetching waste data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("foodItem", foodItem);
      formData.append("foodQuantity", foodQuantity);
      formData.append("foodReason", foodReason);
      formData.append("foodWasteDate", foodWasteDate);
      formData.append("location", location);
      if (image) formData.append("image", image);

      const response = await axios.post("http://localhost:5000/waste", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Waste item added successfully!");
      setMessageType("success");
      setWasteData([...wasteData, response.data.data]);
      setFoodItem(""); setFoodQuantity(""); setFoodReason("");
      setFoodWasteDate(""); setLocation(""); setImage(null);
    } catch (error) {
      setMessage("Failed to add waste item.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("You must be logged in."); return; }
      await axios.delete(`http://localhost:5000/waste/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWasteData(wasteData.filter((item) => item._id !== id));
      alert("Waste item deleted successfully!");
    } catch (error) {
      alert("Failed to delete waste item.");
    }
  };

  const handleApprove = async (id, quantity, foodItem) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("You must be logged in."); return; }

      const updatedQuantity = Math.floor(quantity * 0.9);

      const response = await axios.patch(
        `http://localhost:5000/waste/approve/${id}`,
        { foodQuantity: updatedQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApprovalMessages([
        ...approvalMessages,
        `${foodItem} approved. New quantity: ${updatedQuantity}g.`,
      ]);

      alert("Food approved successfully!");
      fetchWasteData();
    } catch (error) {
      alert("Failed to approve food.");
      console.error(error);
    }
  };

  if (!loggedIn) {
    return (
      <>
        <style>{cssStyles}</style>
        <div className="wt-login-prompt">
          <span>🔒</span>
          Please log in to access this page.
        </div>
      </>
    );
  }

  return (
    <>
      <style>{cssStyles}</style>
      <div className="wt-root">

        {/* Header */}
        <div className="wt-header">
          <div>
            <div className="wt-header-tag">Food Tracker</div>
            <h1 className="wt-title">Log Your <em>Food Waste</em></h1>
          </div>
          <div className="wt-counter">{wasteData.length}</div>
        </div>

        {/* Two-column layout */}
        <div className="wt-layout">

          {/* Form */}
          <div className="wt-card">
            <div className="wt-card-title">Add Waste Entry</div>
            <form onSubmit={handleSubmit} className="wt-form">

              <div className="wt-field">
                <label className="wt-field-label">Food Item</label>
                <input className="wt-input" type="text" value={foodItem}
                  placeholder="e.g. Rice, Bread…" onChange={(e) => setFoodItem(e.target.value)} required />
              </div>

              <div className="wt-field">
                <label className="wt-field-label">Quantity Wasted (grams)</label>
                <input className="wt-input" type="number" value={foodQuantity}
                  placeholder="e.g. 250" onChange={(e) => setFoodQuantity(e.target.value)} required />
              </div>

              <div className="wt-field">
                <label className="wt-field-label">Reason for Waste</label>
                <input className="wt-input" type="text" value={foodReason}
                  placeholder="e.g. Expired, Overcooked…" onChange={(e) => setFoodReason(e.target.value)} required />
              </div>

              <div className="wt-field">
                <label className="wt-field-label">Date</label>
                <input className="wt-input" type="date" value={foodWasteDate}
                  onChange={(e) => setFoodWasteDate(e.target.value)} required />
              </div>

              <div className="wt-field">
                <label className="wt-field-label">Location</label>
                <input className="wt-input" type="text" value={location}
                  placeholder="e.g. Kitchen, Canteen…" onChange={(e) => setLocation(e.target.value)} required />
              </div>

              <div className="wt-field">
                <label className="wt-field-label">Photo (optional)</label>
                <input className="wt-input" type="file" onChange={(e) => setImage(e.target.files[0])} />
              </div>

              <button type="submit" disabled={loading} className="wt-btn">
                {loading ? <CircularProgress size={20} style={{ color: "white" }} /> : "Add Entry"}
              </button>

              {message && (
                <div className={`wt-message ${messageType}`}>{message}</div>
              )}
            </form>
          </div>

          {/* Table */}
          <div className="wt-table-card">
            <div className="wt-table-header">
              <div className="wt-card-title" style={{ marginBottom: 0 }}>Waste Records</div>
            </div>
            <div className="wt-table-wrap">
              {wasteData.length === 0 ? (
                <div className="wt-empty">
                  <div className="wt-empty-icon">🗒️</div>
                  No waste records yet. Add your first entry.
                </div>
              ) : (
                <table className="wt-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Reason</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Photo</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wasteData.map((item) => (
                      <tr key={item._id}>
                        <td><span className="wt-food-name">{item.foodItem}</span></td>
                        <td><span className="wt-qty-badge">{item.foodQuantity}g</span></td>
                        <td>{item.foodReason}</td>
                        <td>{item.foodWasteDate}</td>
                        <td>{item.location}</td>
                        <td>
                          {item.image
                            ? <img src={`http://localhost:5000/uploads/${item.image}`} alt="Waste" className="wt-thumb" />
                            : <div className="wt-no-img">📷</div>
                          }
                        </td>
                        <td>
                          <div className="wt-actions">
                            <button className="wt-action-btn wt-del" onClick={() => handleDelete(item._id)}>Delete</button>
                            <button className="wt-action-btn wt-approve" onClick={() => handleApprove(item._id, item.foodQuantity, item.foodItem)}>Approve</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Approval messages */}
        {approvalMessages.length > 0 && (
          <div className="wt-approvals">
            <div className="wt-card-title">Approval Log</div>
            <ul>
              {approvalMessages.map((msg, index) => (
                <li key={index}>✔ {msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Waste;