import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

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
    --text:     #e8f0e9;
    --t2:       rgba(232,240,233,0.5);
    --t3:       rgba(232,240,233,0.22);
    --t4:       rgba(232,240,233,0.07);
    --r:        16px;
    --r-sm:     9px;
    --sh:       0 4px 28px rgba(0,0,0,0.5);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rf-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Instrument Sans', sans-serif;
    color: var(--text);
    padding-bottom: 100px;
  }

  /* ── HERO ── */
  .rf-hero {
    position: relative; overflow: hidden;
    padding: 48px 24px 40px;
    background: linear-gradient(145deg, #0c1f0e 0%, #080b09 65%);
    border-bottom: 1px solid var(--border);
  }
  .rf-hero::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 55% 70% at 90% 15%, rgba(163,230,53,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 30% 40% at 5% 85%,  rgba(163,230,53,0.04) 0%, transparent 60%);
  }
  .rf-hero-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center;
    justify-content: space-between; gap: 20px; flex-wrap: wrap;
    position: relative; z-index: 1;
  }
  .rf-badge {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: var(--lime); border: 1px solid rgba(163,230,53,0.3);
    background: var(--lime-dim); padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;
  }
  .rf-badge::before {
    content: ''; width: 5px; height: 5px; border-radius: 50%;
    background: var(--lime); box-shadow: 0 0 8px var(--lime);
    animation: rfblink 2s ease-in-out infinite;
  }
  @keyframes rfblink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  .rf-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(28px, 5vw, 52px); font-weight: 900;
    line-height: 1.05; letter-spacing: -1.5px; color: var(--text);
  }
  .rf-title em { font-style: italic; color: var(--lime); }
  .rf-sub { margin-top: 8px; font-size: 14px; color: var(--t2); max-width: 380px; line-height: 1.6; }
  .rf-hero-num {
    font-family: 'Fraunces', serif;
    font-size: clamp(52px, 9vw, 88px); font-weight: 900;
    color: var(--t4); line-height: 1; letter-spacing: -4px; user-select: none; flex-shrink: 0;
  }

  /* ── LAYOUT ── */
  .rf-layout {
    max-width: 1100px; margin: 28px auto 0; padding: 0 16px;
    display: grid; grid-template-columns: 340px 1fr;
    gap: 20px; align-items: start;
  }
  @media (max-width: 860px) {
    .rf-layout { grid-template-columns: 1fr; padding: 0 12px; margin-top: 20px; }
  }

  /* ── FORM CARD ── */
  .rf-card {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r); padding: 26px; box-shadow: var(--sh);
    position: sticky; top: 20px;
  }
  .rf-card-head {
    font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700;
    color: var(--text); margin-bottom: 22px;
    display: flex; align-items: center; gap: 10px;
  }
  .rf-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--lime); box-shadow: 0 0 10px var(--lime); flex-shrink: 0;
  }

  .rf-form { display: flex; flex-direction: column; gap: 14px; }
  .rf-field { display: flex; flex-direction: column; gap: 6px; }
  .rf-label {
    font-size: 10px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--t3);
  }
  .rf-input, .rf-select {
    width: 100%; padding: 11px 14px;
    font-family: 'Instrument Sans', sans-serif; font-size: 14px; color: var(--text);
    background: var(--s2); border: 1px solid var(--border);
    border-radius: var(--r-sm); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none;
  }
  .rf-input::placeholder { color: var(--t3); }
  .rf-input:focus, .rf-select:focus {
    border-color: var(--lime); box-shadow: 0 0 0 3px rgba(163,230,53,0.1);
  }
  .rf-select option { background: #141d16; color: var(--text); }
  .rf-select-wrap { position: relative; }
  .rf-select-wrap::after {
    content: '▾'; position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%); color: var(--t3); pointer-events: none; font-size: 13px;
  }

  .rf-tags {
    display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px;
  }
  .rf-tag {
    padding: 5px 12px; font-size: 12px; font-weight: 600;
    border-radius: 20px; cursor: pointer; border: 1px solid var(--border);
    background: var(--s2); color: var(--t2);
    transition: all 0.15s;
  }
  .rf-tag:hover { border-color: var(--border2); color: var(--text); }
  .rf-tag.active { background: var(--lime-dim); color: var(--lime); border-color: rgba(163,230,53,0.3); }

  .rf-btn {
    padding: 14px; background: var(--lime); color: #0c1a06;
    font-family: 'Instrument Sans', sans-serif; font-size: 14px; font-weight: 700;
    border: none; border-radius: var(--r-sm); cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 48px; box-shadow: 0 4px 20px rgba(163,230,53,0.3);
  }
  .rf-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .rf-btn:disabled { opacity: 0.4; cursor: default; box-shadow: none; }

  .rf-spin {
    width: 15px; height: 15px;
    border: 2px solid rgba(12,26,6,0.25);
    border-top-color: #0c1a06;
    border-radius: 50%; animation: rfspin 0.7s linear infinite; flex-shrink: 0;
  }
  @keyframes rfspin { to { transform: rotate(360deg); } }

  .rf-err {
    padding: 11px 14px; background: var(--red-dim);
    border: 1px solid rgba(251,113,133,0.2); border-radius: var(--r-sm);
    color: var(--red); font-size: 13px; font-weight: 600; text-align: center;
  }

  /* ── RESULTS ── */
  .rf-results {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: var(--r); overflow: hidden; box-shadow: var(--sh);
    min-height: 320px;
  }
  .rf-results-top {
    padding: 20px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  }
  .rf-results-head {
    font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--text);
    display: flex; align-items: center; gap: 10px;
  }
  .rf-count {
    background: var(--lime-dim); color: var(--lime);
    border: 1px solid rgba(163,230,53,0.2); border-radius: 20px;
    padding: 3px 12px; font-size: 12px; font-weight: 600;
  }

  /* Recipe grid */
  .rf-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px; padding: 20px;
  }
  @media (max-width: 600px) { .rf-grid { grid-template-columns: 1fr; padding: 14px; } }

  .rf-recipe {
    background: var(--s2); border: 1px solid var(--border);
    border-radius: var(--r-sm); overflow: hidden;
    transition: border-color 0.18s, transform 0.18s;
    cursor: default;
  }
  .rf-recipe:hover { border-color: var(--border2); transform: translateY(-3px); }

  .rf-recipe-img-wrap {
    width: 100%; height: 160px; overflow: hidden;
    background: var(--s3);
    position: relative;
  }
  .rf-recipe-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.35s ease;
  }
  .rf-recipe:hover .rf-recipe-img { transform: scale(1.06); }
  .rf-recipe-no-img {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 40px; color: var(--t4);
  }

  /* Diet/time badges on image */
  .rf-recipe-badges {
    position: absolute; top: 8px; left: 8px;
    display: flex; gap: 5px; flex-wrap: wrap;
  }
  .rf-rbadge {
    font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
    padding: 3px 8px; border-radius: 20px;
    background: rgba(8,11,9,0.82); backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--text);
  }
  .rf-rbadge.veg   { color: var(--lime); border-color: rgba(163,230,53,0.3); }
  .rf-rbadge.vegan { color: #34d399;     border-color: rgba(52,211,153,0.3); }
  .rf-rbadge.gf    { color: #fbbf24;     border-color: rgba(251,191,36,0.3); }

  .rf-recipe-body { padding: 14px 16px 16px; }
  .rf-recipe-name {
    font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700;
    color: var(--text); margin-bottom: 8px; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .rf-recipe-meta {
    display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;
  }
  .rf-meta-tag {
    font-size: 11px; font-weight: 600; color: var(--t2);
    display: flex; align-items: center; gap: 4px;
  }
  .rf-recipe-link {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 8px 14px; background: var(--lime); color: #0c1a06;
    font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 700;
    border-radius: 7px; text-decoration: none;
    transition: opacity 0.18s, transform 0.12s;
    box-shadow: 0 2px 10px rgba(163,230,53,0.2);
  }
  .rf-recipe-link:hover { opacity: 0.86; transform: translateY(-1px); }

  /* Placeholder / loading */
  .rf-placeholder {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 72px 24px; gap: 12px; text-align: center; min-height: 280px;
  }
  .rf-ph-icon { font-size: 48px; margin-bottom: 4px; }
  .rf-ph-title {
    font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700;
    color: var(--text); margin-bottom: 4px;
  }
  .rf-ph-sub { font-size: 14px; color: var(--t2); max-width: 260px; line-height: 1.6; }

  /* Loading skeleton */
  .rf-skeletons { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; padding: 20px; }
  .rf-skel { background: var(--s2); border: 1px solid var(--border); border-radius: var(--r-sm); overflow: hidden; }
  .rf-skel-img { height: 160px; background: linear-gradient(90deg, var(--s2) 25%, var(--s3) 50%, var(--s2) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
  .rf-skel-body { padding: 14px 16px; }
  .rf-skel-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, var(--s2) 25%, var(--s3) 50%, var(--s2) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; margin-bottom: 8px; }
  .rf-skel-line:last-child { width: 60%; margin-bottom: 0; }
  @keyframes shimmer { to { background-position: -200% 0; } }
`;

const DIETS = ["Vegetarian", "Vegan", "Gluten Free", "Ketogenic", "Paleo", "Whole30"];
const CUISINES = ["Italian", "Indian", "Mexican", "Chinese", "Japanese", "Thai", "Mediterranean", "American"];

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState("");
  const [diet,        setDiet]        = useState("");
  const [cuisine,     setCuisine]     = useState("");
  const [recipeList,  setRecipeList]  = useState([]);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [searched,    setSearched]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) { setError("Please enter at least one ingredient."); return; }
    setLoading(true); setError(""); setRecipeList([]); setSearched(true);
    try {
      const res = await axios.get(`${API_BASE}/api/recipes/search`, {
        params: {
          ingredients,
          diet:    diet    || undefined,
          cuisine: cuisine || undefined,
        },
      });
      if (res.data?.results?.length > 0) {
        setRecipeList(res.data.results);
      } else {
        setError("No recipes found. Try different ingredients or filters.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCuisine = (c) => setCuisine(prev => prev === c.toLowerCase() ? "" : c.toLowerCase());
  const toggleDiet    = (d) => setDiet(prev => prev === d.toLowerCase() ? "" : d.toLowerCase());

  return (
    <>
      <style>{css}</style>
      <div className="rf-root">

        {/* Hero */}
        <div className="rf-hero">
          <div className="rf-hero-inner">
            <div>
              <div className="rf-badge">Recipe Search</div>
              <h1 className="rf-title">Find Your Next <em>Recipe</em></h1>
              <p className="rf-sub">Search by ingredients, diet preference or cuisine type.</p>
            </div>
            <div className="rf-hero-num">🍽</div>
          </div>
        </div>

        <div className="rf-layout">

          {/* Form */}
          <div className="rf-card">
            <div className="rf-card-head"><span className="rf-dot" />Search Filters</div>
            <form onSubmit={handleSubmit} className="rf-form">

              <div className="rf-field">
                <label className="rf-label">Ingredients *</label>
                <input className="rf-input" type="text" required
                  value={ingredients} onChange={e => setIngredients(e.target.value)}
                  placeholder="e.g. chicken, rice, garlic…" />
              </div>

              <div className="rf-field">
                <label className="rf-label">Diet</label>
                <div className="rf-tags">
                  {DIETS.map(d => (
                    <button key={d} type="button"
                      className={`rf-tag ${diet === d.toLowerCase() ? "active" : ""}`}
                      onClick={() => toggleDiet(d)}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rf-field">
                <label className="rf-label">Cuisine</label>
                <div className="rf-tags">
                  {CUISINES.map(c => (
                    <button key={c} type="button"
                      className={`rf-tag ${cuisine === c.toLowerCase() ? "active" : ""}`}
                      onClick={() => toggleCuisine(c)}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {(diet || cuisine) && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {diet && (
                    <span style={{ fontSize: 12, color: "var(--lime)", background: "var(--lime-dim)", border: "1px solid rgba(163,230,53,0.2)", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>
                      ✓ {diet}
                    </span>
                  )}
                  {cuisine && (
                    <span style={{ fontSize: 12, color: "var(--lime)", background: "var(--lime-dim)", border: "1px solid rgba(163,230,53,0.2)", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>
                      ✓ {cuisine}
                    </span>
                  )}
                </div>
              )}

              <button className="rf-btn" type="submit" disabled={loading}>
                {loading ? <><div className="rf-spin" /> Searching…</> : "Search Recipes →"}
              </button>

              {error && <div className="rf-err">{error}</div>}
            </form>
          </div>

          {/* Results */}
          <div className="rf-results">
            <div className="rf-results-top">
              <div className="rf-results-head"><span className="rf-dot" />Results</div>
              {recipeList.length > 0 && (
                <span className="rf-count">{recipeList.length} recipes found</span>
              )}
            </div>

            {loading ? (
              <div className="rf-skeletons">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="rf-skel">
                    <div className="rf-skel-img" />
                    <div className="rf-skel-body">
                      <div className="rf-skel-line" />
                      <div className="rf-skel-line" />
                      <div className="rf-skel-line" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recipeList.length > 0 ? (
              <div className="rf-grid">
                {recipeList.map(recipe => (
                  <div key={recipe.id} className="rf-recipe">
                    <div className="rf-recipe-img-wrap">
                      {recipe.image
                        ? <img className="rf-recipe-img" src={recipe.image} alt={recipe.title} />
                        : <div className="rf-recipe-no-img">🍳</div>
                      }
                      <div className="rf-recipe-badges">
                        {recipe.readyInMinutes && (
                          <span className="rf-rbadge">⏱ {recipe.readyInMinutes}m</span>
                        )}
                        {recipe.vegetarian && <span className="rf-rbadge veg">Veg</span>}
                        {recipe.vegan      && <span className="rf-rbadge vegan">Vegan</span>}
                        {recipe.glutenFree && <span className="rf-rbadge gf">GF</span>}
                      </div>
                    </div>
                    <div className="rf-recipe-body">
                      <div className="rf-recipe-name">{recipe.title}</div>
                      <div className="rf-recipe-meta">
                        {recipe.servings && (
                          <span className="rf-meta-tag">🍽 {recipe.servings} servings</span>
                        )}
                        {recipe.healthScore > 0 && (
                          <span className="rf-meta-tag">💚 {recipe.healthScore}% healthy</span>
                        )}
                      </div>
                      <a className="rf-recipe-link" href={recipe.sourceUrl}
                        target="_blank" rel="noopener noreferrer">
                        View Recipe →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rf-placeholder">
                <div className="rf-ph-icon">
                  {searched ? "😕" : "🔍"}
                </div>
                <div className="rf-ph-title">
                  {searched ? "No recipes found" : "Ready to search"}
                </div>
                <div className="rf-ph-sub">
                  {searched
                    ? "Try different ingredients or remove some filters."
                    : "Enter ingredients on the left and hit Search to discover recipes."}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default RecipeSearch;