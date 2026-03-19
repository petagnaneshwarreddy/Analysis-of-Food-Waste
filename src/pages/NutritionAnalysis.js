import React, { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  :root {
    --bg:       #080b09;
    --s1:       #0e1410;
    --s2:       #141d16;
    --border:   rgba(255,255,255,0.06);
    --border2:  rgba(255,255,255,0.11);
    --lime:     #a3e635;
    --lime-dim: rgba(163,230,53,0.10);
    --lime-mid: rgba(163,230,53,0.20);
    --red:      #fb7185;
    --red-dim:  rgba(251,113,133,0.10);
    --text:     #e8f0e9;
    --t2:       rgba(232,240,233,0.50);
    --t3:       rgba(232,240,233,0.22);
    --t4:       rgba(232,240,233,0.06);
    --r:        16px;
    --r-sm:     9px;
    --sh:       0 4px 28px rgba(0,0,0,0.50);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .na-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Instrument Sans', sans-serif;
    color: var(--text);
    padding-bottom: 80px;
  }

  /* ── HERO ── */
  .na-hero {
    position: relative; overflow: hidden;
    padding: 52px 24px 44px;
    background: linear-gradient(145deg, #0c1f0e 0%, #080b09 65%);
    border-bottom: 1px solid var(--border);
  }
  .na-hero::after {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(ellipse 55% 70% at 90% 15%, rgba(163,230,53,0.09) 0%, transparent 60%),
      radial-gradient(ellipse 30% 50% at 10% 85%, rgba(163,230,53,0.04) 0%, transparent 60%);
  }
  .na-hero-inner {
    max-width: 860px; margin: 0 auto;
    position: relative; z-index: 1;
  }
  .na-badge {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: var(--lime); border: 1px solid rgba(163,230,53,0.30);
    background: var(--lime-dim); padding: 5px 14px; border-radius: 20px; margin-bottom: 16px;
  }
  .na-badge::before {
    content:''; width:5px; height:5px; border-radius:50%;
    background:var(--lime); box-shadow:0 0 8px var(--lime);
    animation: nablink 2s ease-in-out infinite;
  }
  @keyframes nablink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .na-title {
    font-family:'Fraunces',serif;
    font-size: clamp(28px,5vw,52px); font-weight:900;
    line-height:1.05; letter-spacing:-1.5px; color:var(--text);
  }
  .na-title em { font-style:italic; color:var(--lime); }
  .na-sub { margin-top:10px; font-size:15px; color:var(--t2); max-width:520px; line-height:1.6; }

  /* ── BODY ── */
  .na-body {
    max-width: 860px; margin: 32px auto 0; padding: 0 20px;
  }

  /* ── FORM CARD ── */
  .na-card {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r); padding: 28px; box-shadow: var(--sh);
    margin-bottom: 20px;
  }
  .na-card-title {
    font-family:'Fraunces',serif; font-size:18px; font-weight:700;
    display:flex; align-items:center; gap:10px; margin-bottom:20px;
  }
  .na-dot {
    width:8px; height:8px; border-radius:50%;
    background:var(--lime); box-shadow:0 0 10px var(--lime); flex-shrink:0;
  }
  .na-label {
    font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
    color:var(--t3); display:block; margin-bottom:8px;
  }
  .na-textarea {
    width:100%; padding:14px 16px;
    font-family:'Instrument Sans',sans-serif; font-size:14px; color:var(--text);
    background:var(--s2); border:1px solid var(--border);
    border-radius:var(--r-sm); outline:none; resize:vertical; min-height:110px;
    transition:border-color 0.2s, box-shadow 0.2s; line-height:1.6;
  }
  .na-textarea::placeholder { color:var(--t3); }
  .na-textarea:focus { border-color:var(--lime); box-shadow:0 0 0 3px rgba(163,230,53,0.1); }

  .na-btn {
    margin-top:16px; width:100%; padding:14px;
    background:var(--lime); color:#0c1a06;
    font-family:'Instrument Sans',sans-serif; font-size:14px; font-weight:700;
    border:none; border-radius:var(--r-sm); cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:8px;
    min-height:48px; box-shadow:0 4px 20px rgba(163,230,53,0.3);
    transition:opacity 0.2s, transform 0.15s;
  }
  .na-btn:hover:not(:disabled) { opacity:0.88; transform:translateY(-1px); }
  .na-btn:disabled { opacity:0.4; cursor:default; box-shadow:none; }

  .na-spin {
    width:16px; height:16px;
    border:2px solid rgba(12,26,6,0.3); border-top-color:#0c1a06;
    border-radius:50%; animation:naspin 0.7s linear infinite;
  }
  @keyframes naspin { to{transform:rotate(360deg)} }

  .na-error {
    margin-top:12px; padding:12px 16px;
    background:var(--red-dim); color:var(--red);
    border:1px solid rgba(251,113,133,0.2); border-radius:var(--r-sm);
    font-size:13px; font-weight:500;
  }

  /* ── RESULTS ── */
  .na-result-card {
    background:var(--s1); border:1px solid var(--border);
    border-radius:var(--r); overflow:hidden; box-shadow:var(--sh);
  }
  .na-result-top {
    padding:18px 24px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;
  }
  .na-result-title {
    font-family:'Fraunces',serif; font-size:17px; font-weight:700;
    display:flex; align-items:center; gap:9px;
  }
  .na-pill {
    background:var(--lime-dim); color:var(--lime);
    border:1px solid rgba(163,230,53,0.2); border-radius:20px;
    padding:3px 12px; font-size:12px; font-weight:600;
  }

  /* calorie big stat */
  .na-cal-row {
    padding:20px 24px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; gap:24px; flex-wrap:wrap;
  }
  .na-cal-num {
    font-family:'Fraunces',serif;
    font-size: clamp(40px,8vw,72px); font-weight:900;
    color:var(--lime); line-height:1; letter-spacing:-3px;
  }
  .na-cal-label { font-size:13px; color:var(--t2); margin-top:4px; }

  /* macros mini tiles */
  .na-macros {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr));
    gap:12px; padding:0 24px 20px;
  }
  .na-macro-tile {
    background:var(--s2); border:1px solid var(--border2);
    border-radius:var(--r-sm); padding:14px 12px; text-align:center;
  }
  .na-macro-val { font-size:1.2rem; font-weight:800; font-family:'Fraunces',serif; }
  .na-macro-name { font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--t2); margin-top:4px; }

  /* full nutrients table */
  .na-tbl-wrap { overflow-x:auto; border-top:1px solid var(--border); }
  table.na-tbl { width:100%; border-collapse:collapse; min-width:320px; }
  .na-tbl th {
    padding:10px 16px; text-align:left; font-size:10px; font-weight:700;
    letter-spacing:1.5px; text-transform:uppercase; color:var(--t3);
    background:var(--s2); border-bottom:1px solid var(--border); white-space:nowrap;
  }
  .na-tbl td {
    padding:11px 16px; border-bottom:1px solid var(--border);
    font-size:13px; color:var(--text); vertical-align:middle;
  }
  .na-tbl tbody tr:last-child td { border-bottom:none; }
  .na-tbl tbody tr:hover td { background:var(--s2); transition:background 0.12s; }
  .na-tbl-val { font-weight:700; color:var(--lime); }
  .na-tbl-bar {
    display:flex; align-items:center; gap:8px;
  }
  .na-tbl-track {
    flex:1; height:5px; background:var(--t4); border-radius:5px; overflow:hidden; min-width:60px;
  }
  .na-tbl-fill { height:100%; border-radius:5px; background:var(--lime); }

  @media (max-width: 640px) {
    .na-hero { padding:36px 16px 32px; }
    .na-body { padding:0 12px; }
    .na-card { padding:18px 16px; }
    .na-cal-row { padding:16px; }
    .na-macros { padding:0 16px 16px; grid-template-columns:repeat(2,1fr); }
    .na-tbl th, .na-tbl td { padding:9px 12px; }
  }
`;

const safe = (obj, key) => obj?.[key]?.quantity ?? null;
const fmt  = (v) => (v !== null ? v.toFixed(1) : "—");

const NUTRIENTS = [
  { label: "Total Fat",         key: "FAT",    color: "#fb923c" },
  { label: "Saturated Fat",     key: "FASAT",  color: "#f87171" },
  { label: "Trans Fat",         key: "FATRN",  color: "#f43f5e" },
  { label: "Cholesterol",       key: "CHOLE",  color: "#fbbf24" },
  { label: "Sodium",            key: "NA",     color: "#38bdf8" },
  { label: "Total Carbohydrate",key: "CHOCDF", color: "#a78bfa" },
  { label: "Dietary Fiber",     key: "FIBTG",  color: "#34d399" },
  { label: "Total Sugars",      key: "SUGAR",  color: "#f472b6" },
  { label: "Protein",           key: "PROCNT", color: "#a3e635" },
  { label: "Vitamin D",         key: "VITD",   color: "#fde68a" },
  { label: "Calcium",           key: "CA",     color: "#93c5fd" },
  { label: "Iron",              key: "FE",     color: "#fb7185" },
  { label: "Potassium",         key: "K",      color: "#6ee7b7" },
];

const NutritionAnalysis = () => {
  const [ingredients, setIngredients] = useState("");
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const analyze = async () => {
    if (!ingredients.trim()) { setError("Please enter at least one ingredient."); return; }
    setLoading(true); setError(""); setData(null);
    try {
      const res = await fetch(
        `https://api.edamam.com/api/nutrition-data?app_id=100fcc68&app_key=c9f82907b76776cdab2cb96c7a8fa2b6&ingr=${encodeURIComponent(ingredients)}`
      );
      const json = await res.json();
      if (json?.totalNutrients && Object.keys(json.totalNutrients).length > 0) {
        setData(json);
      } else {
        setError("No nutrition data found. Try a more specific ingredient (e.g. \"200g chicken breast\").");
      }
    } catch {
      setError("Network error — please check your connection and try again.");
    }
    setLoading(false);
  };

  const n       = data?.totalNutrients || {};
  const kcal    = safe(n, "ENERC_KCAL");
  const protein = safe(n, "PROCNT");
  const fat     = safe(n, "FAT");
  const carbs   = safe(n, "CHOCDF");

  // percentage bars relative to typical daily values
  const DV = { FAT:78, FASAT:20, FATRN:2, CHOLE:300, NA:2300, CHOCDF:275, FIBTG:28, SUGAR:50, PROCNT:50, VITD:20, CA:1300, FE:18, K:4700 };
  const pct = (key) => {
    const v = safe(n, key);
    if (v === null || !DV[key]) return 0;
    return Math.min(Math.round((v / DV[key]) * 100), 100);
  };

  return (
    <>
      <style>{css}</style>
      <div className="na-root">

        {/* Hero */}
        <div className="na-hero">
          <div className="na-hero-inner">
            <div className="na-badge">Nutrition Tool</div>
            <h1 className="na-title">Analyse Your <em>Ingredients</em></h1>
            <p className="na-sub">
              Enter any ingredient with quantity to get a full nutritional breakdown — calories, macros, vitamins and minerals.
            </p>
          </div>
        </div>

        <div className="na-body">

          {/* Form */}
          <div className="na-card" style={{ marginTop: 28 }}>
            <div className="na-card-title"><span className="na-dot" />Enter Ingredients</div>
            <label className="na-label" htmlFor="na-ingr">Ingredients with quantities</label>
            <textarea
              className="na-textarea"
              id="na-ingr"
              placeholder="e.g. 1 cup of rice, 200g chicken breast, 2 boiled eggs"
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) analyze(); }}
            />
            <div style={{ fontSize:11, color:"var(--t3)", marginTop:6 }}>Tip: Ctrl+Enter to analyze</div>
            <button className="na-btn" onClick={analyze} disabled={loading}>
              {loading ? <><div className="na-spin" /> Analysing…</> : "Analyse Nutrition →"}
            </button>
            {error && <div className="na-error">⚠ {error}</div>}
          </div>

          {/* Results */}
          {data && (
            <div className="na-result-card">
              <div className="na-result-top">
                <div className="na-result-title"><span className="na-dot" />Nutrition Facts</div>
                <span className="na-pill">{data.totalWeight ? `${Math.round(data.totalWeight)}g total` : "Per serving"}</span>
              </div>

              {/* Calories */}
              <div className="na-cal-row">
                <div>
                  <div className="na-cal-num">{kcal !== null ? Math.round(kcal) : "—"}</div>
                  <div className="na-cal-label">kcal · Calories</div>
                </div>
                <div style={{ flex:1, height:1, background:"var(--border)", alignSelf:"stretch", display:"flex", alignItems:"center" }}>
                  <div style={{ height:1, width:"100%", background:"var(--border)" }} />
                </div>
                <div style={{ textAlign:"right", fontSize:12, color:"var(--t2)", lineHeight:1.7 }}>
                  <div>From fat: <strong style={{color:"var(--text)"}}>{fat !== null ? Math.round(fat * 9) : "—"} kcal</strong></div>
                  <div>From protein: <strong style={{color:"var(--text)"}}>{protein !== null ? Math.round(protein * 4) : "—"} kcal</strong></div>
                  <div>From carbs: <strong style={{color:"var(--text)"}}>{carbs !== null ? Math.round(carbs * 4) : "—"} kcal</strong></div>
                </div>
              </div>

              {/* Macros tiles */}
              <div className="na-macros">
                {[
                  { label:"Protein",      val: protein, unit:"g",  color:"#a3e635" },
                  { label:"Total Fat",    val: fat,     unit:"g",  color:"#fb923c" },
                  { label:"Carbs",        val: carbs,   unit:"g",  color:"#a78bfa" },
                  { label:"Fiber",        val: safe(n,"FIBTG"), unit:"g",  color:"#34d399" },
                  { label:"Sugars",       val: safe(n,"SUGAR"), unit:"g",  color:"#f472b6" },
                  { label:"Sodium",       val: safe(n,"NA"),    unit:"mg", color:"#38bdf8" },
                ].map(m => (
                  <div className="na-macro-tile" key={m.label}
                    style={{ borderTop:`2px solid ${m.color}` }}>
                    <div className="na-macro-val" style={{ color:m.color }}>
                      {m.val !== null ? `${fmt(m.val)}${m.unit}` : "—"}
                    </div>
                    <div className="na-macro-name">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Full table */}
              <div className="na-tbl-wrap">
                <table className="na-tbl">
                  <thead>
                    <tr>
                      <th>Nutrient</th>
                      <th>Amount</th>
                      <th>% Daily Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NUTRIENTS.map(({ label, key, color }) => {
                      const v = safe(n, key);
                      const u = n[key]?.unit || "";
                      const p = pct(key);
                      return (
                        <tr key={key}>
                          <td>{label}</td>
                          <td><span className="na-tbl-val" style={{ color }}>{v !== null ? `${fmt(v)} ${u}` : "—"}</span></td>
                          <td>
                            <div className="na-tbl-bar">
                              <div className="na-tbl-track">
                                <div className="na-tbl-fill" style={{ width:`${p}%`, background:color }} />
                              </div>
                              <span style={{ fontSize:11, color:"var(--t2)", width:34, textAlign:"right" }}>{p}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NutritionAnalysis;