import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Mulish:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dp-root {
    min-height: 100vh;
    background: #f7f4ef;
    font-family: 'Mulish', sans-serif;
    padding: 48px 28px 80px;
  }

  /* Header */
  .dp-header {
    max-width: 1100px;
    margin: 0 auto 36px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }
  .dp-eyebrow {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
    background: #1a1a1a;
    padding: 4px 12px;
    border-radius: 4px;
    margin-bottom: 12px;
  }
  .dp-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 5vw, 50px);
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1;
    letter-spacing: -2px;
  }
  .dp-title em { font-style: normal; color: #c0392b; }
  .dp-ghost {
    font-family: 'Syne', sans-serif;
    font-size: 72px;
    font-weight: 800;
    color: rgba(26,26,26,0.06);
    line-height: 1;
    letter-spacing: -4px;
    user-select: none;
  }

  /* Search */
  .dp-search-wrap {
    max-width: 1100px;
    margin: 0 auto 32px;
    position: relative;
    max-width: 480px;
  }
  /* override for centering under header */
  .dp-search-outer {
    max-width: 1100px;
    margin: 0 auto 36px;
  }
  .dp-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    pointer-events: none;
    color: rgba(26,26,26,0.35);
  }
  .dp-search {
    width: 100%;
    padding: 12px 14px 12px 42px;
    font-family: 'Mulish', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    background: #fff;
    border: 1.5px solid rgba(26,26,26,0.1);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .dp-search::placeholder { color: rgba(26,26,26,0.3); }
  .dp-search:focus {
    border-color: #c0392b;
    box-shadow: 0 0 0 3px rgba(192,57,43,0.08);
  }

  /* Stats row */
  .dp-stats {
    max-width: 1100px;
    margin: 0 auto 32px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .dp-stat {
    background: #fff;
    border: 1.5px solid rgba(26,26,26,0.08);
    border-radius: 12px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .dp-stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: -1px;
  }
  .dp-stat-lbl {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(26,26,26,0.4);
  }

  /* Grid */
  .dp-grid {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    gap: 20px;
  }

  /* Card */
  .dp-card {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid rgba(26,26,26,0.07);
    overflow: hidden;
    cursor: default;
  }
  .dp-card-img {
    width: 100%;
    height: 190px;
    object-fit: cover;
    display: block;
    border-bottom: 1.5px solid rgba(26,26,26,0.06);
  }
  .dp-card-no-img {
    width: 100%;
    height: 80px;
    background: #f0ece6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: rgba(26,26,26,0.15);
    border-bottom: 1.5px solid rgba(26,26,26,0.06);
  }
  .dp-card-body { padding: 18px 20px 20px; }

  .dp-food-name {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 14px;
    letter-spacing: -0.3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dp-info-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .dp-info-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(26,26,26,0.45);
    min-width: 72px;
    flex-shrink: 0;
  }
  .dp-info-value {
    font-size: 13.5px;
    font-weight: 600;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dp-divider {
    height: 1px;
    background: rgba(26,26,26,0.07);
    margin: 14px 0;
  }

  .dp-dir-btn {
    width: 100%;
    padding: 11px;
    background: #1a1a1a;
    color: #f7f4ef;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background 0.18s;
  }
  .dp-dir-btn:hover { background: #c0392b; }

  /* States */
  .dp-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 50vh; gap: 14px;
    color: rgba(26,26,26,0.35);
    font-size: 14px; font-weight: 500;
  }
  .dp-spinner {
    width: 32px; height: 32px;
    border: 3px solid rgba(192,57,43,0.15);
    border-top-color: #c0392b;
    border-radius: 50%;
    animation: dpspin 0.7s linear infinite;
  }
  @keyframes dpspin { to { transform: rotate(360deg); } }

  .dp-empty {
    max-width: 400px;
    margin: 80px auto;
    text-align: center;
    padding: 40px 32px;
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid rgba(26,26,26,0.07);
    color: rgba(26,26,26,0.35);
    font-size: 14px;
    font-weight: 500;
  }
  .dp-empty-icon { font-size: 36px; margin-bottom: 12px; }
  .dp-empty-error { color: #c0392b; }
`;

const InfoRow = ({ label, value }) => (
  <div className="dp-info-row">
    <span className="dp-info-label">{label}</span>
    <span className="dp-info-value">{value}</span>
  </div>
);

const Display = ({ newWaste }) => {
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => { fetchWasteData(); }, []);

  useEffect(() => {
    if (newWaste) setWasteData((prev) => [newWaste, ...prev]);
  }, [newWaste]);

  const fetchWasteData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");
      const response = await axios.get("http://localhost:5000/waste", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWasteData(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch waste data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (destination) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=&destination=${encodeURIComponent(destination)}`;
    window.open(mapsUrl, "_blank");
  };

  const filtered = wasteData.filter((item) =>
    (item.location || "").toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <>
      <style>{cssStyles}</style>
      <div className="dp-root">

        {/* Header */}
        <div className="dp-header">
          <div>
            <div className="dp-eyebrow">Records</div>
            <h1 className="dp-title">Food <em>Waste</em> Records</h1>
          </div>
          <div className="dp-ghost">🗂</div>
        </div>

        {/* Search */}
        <div style={{ maxWidth: "1100px", margin: "0 auto 28px" }}>
          <div className="dp-search-wrap" style={{ maxWidth: "400px" }}>
            <span className="dp-search-icon">🔍</span>
            <input
              className="dp-search"
              placeholder="Search by location…"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="dp-stats">
            <div className="dp-stat">
              <div>
                <div className="dp-stat-num">{wasteData.length}</div>
                <div className="dp-stat-lbl">Total Records</div>
              </div>
            </div>
            <div className="dp-stat">
              <div>
                <div className="dp-stat-num">{filtered.length}</div>
                <div className="dp-stat-lbl">Showing</div>
              </div>
            </div>
            <div className="dp-stat">
              <div>
                <div className="dp-stat-num">
                  {wasteData.reduce((sum, i) => sum + (Number(i.foodQuantity) || 0), 0)}g
                </div>
                <div className="dp-stat-lbl">Total Wasted</div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="dp-loading">
            <div className="dp-spinner" />
            Loading records…
          </div>
        ) : error ? (
          <div className="dp-empty">
            <div className="dp-empty-icon">⚠️</div>
            <div className="dp-empty-error">{error}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dp-empty">
            <div className="dp-empty-icon">📭</div>
            No food waste records found. Start adding now!
          </div>
        ) : (
          <div className="dp-grid">
            {filtered.map((item, index) => (
              <motion.div
                key={index}
                className="dp-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -3, boxShadow: "0 12px 36px rgba(26,26,26,0.1)" }}
              >
                {item.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.foodItem}
                    className="dp-card-img"
                  />
                ) : (
                  <div className="dp-card-no-img">🍽️</div>
                )}

                <div className="dp-card-body">
                  <div className="dp-food-name">{item.foodItem}</div>

                  <InfoRow label="Quantity" value={`${item.foodQuantity}g`} />
                  <InfoRow label="Reason" value={item.foodReason} />
                  <InfoRow label="Date" value={new Date(item.foodWasteDate).toLocaleDateString()} />
                  <InfoRow label="Location" value={item.location} />

                  <div className="dp-divider" />

                  <motion.button
                    className="dp-dir-btn"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleGetDirections(item.location)}
                  >
                    📍 Get Directions
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Display;