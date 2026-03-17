import React, { useState } from "react";
import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://backend-food-analysis.onrender.com";

const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Mulish:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rf-root {
    min-height: 100vh;
    background: #f7f4ef;
    font-family: 'Mulish', sans-serif;
    padding: 48px 28px 80px;
  }

  /* Header */
  .rf-header {
    max-width: 1100px;
    margin: 0 auto 40px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }
  .rf-eyebrow {
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
  .rf-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 5vw, 50px);
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1;
    letter-spacing: -2px;
  }
  .rf-title em { font-style: normal; color: #c0392b; }
  .rf-ghost {
    font-family: 'Syne', sans-serif;
    font-size: 72px;
    font-weight: 800;
    color: rgba(26,26,26,0.06);
    line-height: 1;
    letter-spacing: -4px;
    user-select: none;
  }

  /* Layout */
  .rf-layout {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 820px) { .rf-layout { grid-template-columns: 1fr; } }

  /* Form card */
  .rf-card {
    background: #fff;
    border: 1.5px solid rgba(26,26,26,0.08);
    border-radius: 16px;
    padding: 26px;
  }
  .rf-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rf-card-title::before {
    content: '';
    display: inline-block;
    width: 5px; height: 17px;
    background: #c0392b;
    border-radius: 3px;
    flex-shrink: 0;
  }

  /* Fields */
  .rf-form { display: flex; flex-direction: column; gap: 14px; }
  .rf-field { display: flex; flex-direction: column; gap: 5px; }
  .rf-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(26,26,26,0.45);
  }
  .rf-input, .rf-select {
    padding: 11px 14px;
    font-family: 'Mulish', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    background: #f7f4ef;
    border: 1.5px solid transparent;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
  }
  .rf-input::placeholder { color: rgba(26,26,26,0.28); }
  .rf-input:focus, .rf-select:focus {
    border-color: #c0392b;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(192,57,43,0.07);
  }
  .rf-select-wrap { position: relative; }
  .rf-select-wrap::after {
    content: '▾';
    position: absolute;
    right: 12px; top: 50%;
    transform: translateY(-50%);
    color: rgba(26,26,26,0.35);
    pointer-events: none;
    font-size: 13px;
  }
  .rf-select option { background: #fff; color: #1a1a1a; }

  /* Button */
  .rf-btn {
    padding: 13px;
    background: #1a1a1a;
    color: #f7f4ef;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.18s, transform 0.14s;
    min-height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .rf-btn:hover:not(:disabled) { background: #c0392b; transform: translateY(-1px); }
  .rf-btn:disabled { opacity: 0.5; cursor: default; }

  .rf-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(247,244,239,0.3);
    border-top-color: #f7f4ef;
    border-radius: 50%;
    animation: rfspin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes rfspin { to { transform: rotate(360deg); } }

  .rf-error {
    padding: 11px 14px;
    background: rgba(192,57,43,0.07);
    border: 1px solid rgba(192,57,43,0.2);
    border-radius: 8px;
    color: #c0392b;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
  }

  /* Results panel */
  .rf-results-card {
    background: #fff;
    border: 1.5px solid rgba(26,26,26,0.08);
    border-radius: 16px;
    overflow: hidden;
    min-height: 320px;
  }
  .rf-results-header {
    padding: 20px 22px 16px;
    border-bottom: 1.5px solid rgba(26,26,26,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .rf-results-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rf-results-title::before {
    content: '';
    display: inline-block;
    width: 5px; height: 16px;
    background: #c0392b;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .rf-count-badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
    background: rgba(192,57,43,0.09);
    color: #c0392b;
  }

  /* Recipe list */
  .rf-recipe-list { padding: 10px 14px 14px; }
  .rf-recipe-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    border-radius: 10px;
    margin-bottom: 4px;
    transition: background 0.15s, transform 0.15s;
    cursor: default;
  }
  .rf-recipe-card:last-child { margin-bottom: 0; }
  .rf-recipe-card:hover { background: #f7f4ef; transform: translateX(3px); }
  .rf-recipe-img {
    width: 68px; height: 68px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    border: 1.5px solid rgba(26,26,26,0.07);
  }
  .rf-recipe-info { flex: 1; min-width: 0; }
  .rf-recipe-name {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.2px;
  }
  .rf-recipe-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #c0392b;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    transition: gap 0.15s, opacity 0.15s;
  }
  .rf-recipe-link:hover { gap: 7px; opacity: 0.8; }

  /* Placeholder */
  .rf-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
    color: rgba(26,26,26,0.25);
    gap: 10px;
    text-align: center;
    min-height: 280px;
  }
  .rf-placeholder-icon { font-size: 38px; }
  .rf-placeholder-text { font-size: 14px; font-weight: 500; max-width: 240px; line-height: 1.5; }
`;

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState("");
  const [diet, setDiet] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [recipeList, setRecipeList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!ingredients.trim()) { setErrorMessage("Please enter ingredients."); return; }

    setLoading(true);
    setErrorMessage("");
    setRecipeList([]);
    setSearched(true);

    try {
      const response = await axios.get(`${API_BASE}/api/recipes/search`, {
        params: {
          ingredients,
          diet: diet || undefined,
          cuisine: cuisineType || undefined,
        },
      });

      if (response.data?.results?.length > 0) {
        setRecipeList(response.data.results);
      } else {
        setErrorMessage("No recipes found for these ingredients.");
      }
    } catch (error) {
      console.error("Recipe fetch error:", error);
      setErrorMessage(error.response?.data?.error || "Error occurred while fetching recipes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{cssStyles}</style>
      <div className="rf-root">

        {/* Header */}
        <div className="rf-header">
          <div>
            <div className="rf-eyebrow">Culinary</div>
            <h1 className="rf-title">Find Your Next <em>Recipe</em></h1>
          </div>
          <div className="rf-ghost">🍽</div>
        </div>

        <div className="rf-layout">

          {/* Form */}
          <div className="rf-card">
            <div className="rf-card-title">Search Filters</div>
            <form onSubmit={handleSubmit} className="rf-form">
              <div className="rf-field">
                <label className="rf-label">Ingredients</label>
                <input
                  className="rf-input"
                  type="text"
                  required
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. chicken, rice, garlic…"
                />
              </div>

              <div className="rf-field">
                <label className="rf-label">Diet</label>
                <div className="rf-select-wrap">
                  <select className="rf-select" value={diet} onChange={(e) => setDiet(e.target.value)}>
                    <option value="">Any Diet</option>
                    <option value="balanced">Balanced</option>
                    <option value="high-protein">High Protein</option>
                    <option value="low-carb">Low Carb</option>
                    <option value="low-fat">Low Fat</option>
                    <option value="vegetarian">Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className="rf-field">
                <label className="rf-label">Cuisine</label>
                <input
                  className="rf-input"
                  type="text"
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  placeholder="e.g. Italian, Indian…"
                />
              </div>

              <button className="rf-btn" type="submit" disabled={loading}>
                {loading ? <><div className="rf-spinner" />Searching…</> : "Search Recipes →"}
              </button>

              {errorMessage && <div className="rf-error">{errorMessage}</div>}
            </form>
          </div>

          {/* Results */}
          <div className="rf-results-card">
            <div className="rf-results-header">
              <div className="rf-results-title">Results</div>
              {recipeList.length > 0 && (
                <div className="rf-count-badge">{recipeList.length} found</div>
              )}
            </div>

            {recipeList.length > 0 ? (
              <div className="rf-recipe-list">
                {recipeList.map((recipe) => (
                  <div key={recipe.id} className="rf-recipe-card">
                    <img className="rf-recipe-img" src={recipe.image} alt={recipe.title} />
                    <div className="rf-recipe-info">
                      <div className="rf-recipe-name">{recipe.title}</div>
                      <a className="rf-recipe-link" href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                        View Full Recipe →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rf-placeholder">
                <div className="rf-placeholder-icon">
                  {loading ? "⏳" : searched ? "😕" : "🔍"}
                </div>
                <div className="rf-placeholder-text">
                  {loading
                    ? "Finding the best recipes for you…"
                    : searched
                    ? "No results. Try different ingredients."
                    : "Enter ingredients and hit search to discover recipes."}
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