import React, { useState, useRef } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --bg:#0a0a0f; --surface:#111118; --surface2:#16161f; --surface3:#1c1c28;
    --border:rgba(255,255,255,0.06); --border2:rgba(255,255,255,0.12); --border3:rgba(255,255,255,0.20);
    --accent:#f0c060; --accent2:#e8955a; --accent3:#c45f8a;
    --green:#50c896; --text:#f0ede8;
    --text2:rgba(240,237,232,0.55); --text3:rgba(240,237,232,0.25); --text4:rgba(240,237,232,0.08);
    --r:14px; --r-sm:8px;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  .rs-root{min-height:100vh;background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--text);padding-bottom:120px;position:relative;overflow-x:hidden;}
  .rs-root::before{content:'';position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse 80% 60% at 15% -10%,rgba(240,192,96,0.06) 0%,transparent 55%),radial-gradient(ellipse 60% 80% at 90% 110%,rgba(196,95,138,0.05) 0%,transparent 55%);z-index:0;}

  /* HERO */
  .rs-hero{position:relative;padding:64px 32px 56px;border-bottom:1px solid var(--border);z-index:1;}
  .rs-hero-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr auto;align-items:end;gap:32px;}
  .rs-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:18px;}
  .rs-eyebrow-line{width:32px;height:1px;background:linear-gradient(90deg,var(--accent),transparent);}
  .rs-hero-title{font-family:'Playfair Display',serif;font-size:clamp(38px,6vw,72px);font-weight:900;line-height:1.0;letter-spacing:-2px;}
  .rs-hero-title em{font-style:italic;background:linear-gradient(135deg,var(--accent) 0%,var(--accent2) 50%,var(--accent3) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .rs-hero-sub{margin-top:14px;font-size:15px;font-weight:300;color:var(--text2);max-width:480px;line-height:1.7;}
  .rs-hero-deco{font-family:'Playfair Display',serif;font-size:clamp(80px,14vw,160px);font-weight:900;font-style:italic;line-height:1;letter-spacing:-8px;color:transparent;-webkit-text-stroke:1px rgba(240,192,96,0.12);user-select:none;white-space:nowrap;}

  /* STATS */
  .rs-stats{max-width:1200px;margin:28px auto 0;padding:0 32px;display:flex;gap:1px;position:relative;z-index:1;}
  .rs-stat{flex:1;background:var(--surface);border:1px solid var(--border);padding:16px 22px;display:flex;flex-direction:column;gap:4px;}
  .rs-stat:first-child{border-radius:var(--r-sm) 0 0 var(--r-sm);} .rs-stat:last-child{border-radius:0 var(--r-sm) var(--r-sm) 0;}
  .rs-stat-n{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--accent);line-height:1;}
  .rs-stat-l{font-size:10px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--text3);}

  /* LAYOUT */
  .rs-layout{max-width:1200px;margin:32px auto 0;padding:0 32px;display:grid;grid-template-columns:300px 1fr;gap:24px;align-items:start;position:relative;z-index:1;}
  @media(max-width:900px){.rs-layout{grid-template-columns:1fr;padding:0 16px;}.rs-hero-inner{grid-template-columns:1fr;}.rs-hero-deco{display:none;}.rs-stats{padding:0 16px;}.rs-hero{padding:40px 16px 36px;}}

  /* SIDEBAR */
  .rs-sidebar{position:sticky;top:20px;display:flex;flex-direction:column;gap:14px;}
  .rs-panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;}
  .rs-panel-head{padding:17px 20px 15px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;}
  .rs-panel-icon{width:26px;height:26px;border-radius:6px;background:rgba(240,192,96,0.12);border:1px solid rgba(240,192,96,0.2);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;}
  .rs-panel-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--text);}
  .rs-panel-body{padding:18px 20px;display:flex;flex-direction:column;gap:18px;}

  /* LABELS */
  .rs-lbl{font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--text3);margin-bottom:8px;display:flex;align-items:center;gap:7px;}
  .rs-lbl::after{content:'';flex:1;height:1px;background:var(--border);}

  /* INGREDIENT INPUT */
  .rs-ing-wrap{position:relative;}
  .rs-ing-input{width:100%;padding:11px 13px 11px 40px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text);background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-sm);outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
  .rs-ing-input::placeholder{color:var(--text3);}
  .rs-ing-input:focus{border-color:rgba(240,192,96,0.5);box-shadow:0 0 0 3px rgba(240,192,96,0.08);}
  .rs-ing-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;pointer-events:none;}
  .rs-ing-hint{font-size:11px;color:var(--text3);margin-top:5px;}

  /* ── DIET CHIPS — horizontal wrap ── */
  .rs-diet-wrap{display:flex;flex-wrap:wrap;gap:6px;}
  .rs-diet-chip{display:inline-flex;align-items:center;gap:4px;padding:5px 11px;font-size:12px;font-weight:500;border-radius:20px;cursor:pointer;border:1px solid var(--border2);background:transparent;color:var(--text2);transition:all 0.15s;white-space:nowrap;font-family:'DM Sans',sans-serif;line-height:1;}
  .rs-diet-chip:hover{border-color:var(--border3);color:var(--text);background:var(--surface3);}
  .rs-diet-chip.on{background:rgba(240,192,96,0.12);color:var(--accent);border-color:rgba(240,192,96,0.40);font-weight:600;}

  /* ── CUISINE DROPDOWN ── */
  .rs-sel-wrap{position:relative;}
  .rs-sel-wrap::after{content:'▾';position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none;font-size:12px;}
  .rs-sel{width:100%;padding:11px 34px 11px 13px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--text);background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-sm);outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;transition:border-color 0.2s,box-shadow 0.2s;}
  .rs-sel:focus{border-color:rgba(240,192,96,0.5);box-shadow:0 0 0 3px rgba(240,192,96,0.08);}
  .rs-sel option{background:#16161f;color:var(--text);}

  /* ACTIVE FILTER ROW */
  .rs-actives{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:9px 13px;background:var(--surface2);border-radius:var(--r-sm);border:1px solid var(--border);}
  .rs-actives-lbl{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);flex-shrink:0;}
  .rs-atag{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:var(--accent);background:rgba(240,192,96,0.1);border:1px solid rgba(240,192,96,0.22);border-radius:20px;padding:3px 8px 3px 10px;}
  .rs-atag-x{cursor:pointer;width:14px;height:14px;border-radius:50%;background:rgba(240,192,96,0.15);display:inline-flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;transition:background 0.15s;}
  .rs-atag-x:hover{background:rgba(240,192,96,0.3);}

  /* SUBMIT */
  .rs-btn{width:100%;padding:13px;background:linear-gradient(135deg,var(--accent) 0%,var(--accent2) 100%);color:#1a0f00;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;border:none;border-radius:var(--r-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;transition:opacity 0.2s,transform 0.15s,box-shadow 0.2s;box-shadow:0 4px 20px rgba(240,192,96,0.25);min-height:46px;}
  .rs-btn:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);box-shadow:0 8px 28px rgba(240,192,96,0.3);}
  .rs-btn:disabled{opacity:0.45;cursor:default;box-shadow:none;}
  .rs-spin{width:15px;height:15px;border:2px solid rgba(26,15,0,0.25);border-top-color:#1a0f00;border-radius:50%;animation:spin 0.7s linear infinite;flex-shrink:0;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .rs-err{padding:10px 13px;background:rgba(251,113,133,0.08);border:1px solid rgba(251,113,133,0.2);border-radius:var(--r-sm);color:#fb7185;font-size:13px;font-weight:500;display:flex;align-items:flex-start;gap:7px;line-height:1.5;}

  /* TIP */
  .rs-tip{background:linear-gradient(135deg,rgba(240,192,96,0.06) 0%,rgba(228,149,90,0.04) 100%);border:1px solid rgba(240,192,96,0.15);border-radius:var(--r-sm);padding:12px 14px;display:flex;gap:9px;align-items:flex-start;}
  .rs-tip-ico{font-size:14px;flex-shrink:0;margin-top:1px;}
  .rs-tip-text{font-size:12px;color:var(--text2);line-height:1.6;}
  .rs-tip-text strong{color:var(--accent);font-weight:600;}

  /* RESULTS PANEL */
  .rs-results{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;min-height:400px;}
  .rs-rhead{padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
  .rs-rtitle{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:9px;}
  .rs-rcount{font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:1px;color:var(--accent);background:rgba(240,192,96,0.1);border:1px solid rgba(240,192,96,0.2);border-radius:20px;padding:3px 13px;}

  /* Sort bar */
  .rs-sortbar{padding:10px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none;}
  .rs-sortbar::-webkit-scrollbar{display:none;}
  .rs-sort-lbl{font-size:11px;color:var(--text3);font-weight:500;white-space:nowrap;margin-right:2px;}
  .rs-sort-btn{padding:4px 12px;font-size:12px;font-weight:500;border-radius:20px;border:1px solid var(--border2);background:transparent;color:var(--text2);cursor:pointer;white-space:nowrap;transition:all 0.15s;font-family:'DM Sans',sans-serif;}
  .rs-sort-btn:hover{color:var(--text);border-color:var(--border3);}
  .rs-sort-btn.on{background:var(--surface3);color:var(--text);border-color:var(--border3);}

  /* Recipe grid */
  .rs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));}
  .rs-card{border-right:1px solid var(--border);border-bottom:1px solid var(--border);display:flex;flex-direction:column;transition:background 0.2s;position:relative;overflow:hidden;}
  .rs-card:hover{background:var(--surface2);}
  .rs-card::after{content:'';position:absolute;inset:0;border:2px solid var(--accent);opacity:0;transition:opacity 0.2s;pointer-events:none;}
  .rs-card:hover::after{opacity:0.22;}
  .rs-cimg-wrap{width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--surface3);position:relative;}
  .rs-cimg{width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;display:block;}
  .rs-card:hover .rs-cimg{transform:scale(1.05);}
  .rs-no-img{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:34px;color:var(--text4);}
  .rs-overlay{position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top,rgba(10,10,15,0.85) 0%,transparent 100%);}
  .rs-badges{position:absolute;top:9px;left:9px;display:flex;gap:4px;flex-wrap:wrap;}
  .rs-pill{font-size:9px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;padding:3px 7px;border-radius:20px;backdrop-filter:blur(8px);}
  .rs-pill-t{background:rgba(10,10,15,0.75);color:var(--text2);border:1px solid rgba(255,255,255,0.12);}
  .rs-pill-v{background:rgba(80,200,150,0.2);color:var(--green);border:1px solid rgba(80,200,150,0.3);}
  .rs-pill-vg{background:rgba(80,200,150,0.25);color:#7de8b8;border:1px solid rgba(80,200,150,0.4);}
  .rs-pill-gf{background:rgba(240,192,96,0.18);color:var(--accent);border:1px solid rgba(240,192,96,0.3);}
  .rs-hs{position:absolute;bottom:9px;right:9px;width:32px;height:32px;border-radius:50%;background:rgba(10,10,15,0.8);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);}
  .rs-hs-n{font-family:'DM Mono',monospace;font-size:9px;font-weight:500;color:var(--accent);}
  .rs-cbody{padding:14px 16px 16px;flex:1;display:flex;flex-direction:column;}
  .rs-ctitle{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--text);line-height:1.35;margin-bottom:9px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;flex:1;}
  .rs-cmeta{display:flex;gap:11px;margin-bottom:11px;flex-wrap:wrap;}
  .rs-cm{font-size:11px;font-weight:500;color:var(--text3);display:flex;align-items:center;gap:3px;}
  .rs-cfoot{display:flex;align-items:center;justify-content:space-between;gap:7px;}
  .rs-view-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:rgba(240,192,96,0.1);color:var(--accent);border:1px solid rgba(240,192,96,0.25);border-radius:var(--r-sm);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;text-decoration:none;transition:all 0.18s;white-space:nowrap;}
  .rs-view-btn:hover{background:rgba(240,192,96,0.18);border-color:rgba(240,192,96,0.45);transform:translateY(-1px);}
  .rs-star{width:31px;height:31px;border-radius:var(--r-sm);background:var(--surface3);border:1px solid var(--border2);color:var(--text3);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;flex-shrink:0;}
  .rs-star:hover{color:var(--accent);border-color:rgba(240,192,96,0.3);}
  .rs-star.on{color:var(--accent);background:rgba(240,192,96,0.1);border-color:rgba(240,192,96,0.3);}

  /* PLACEHOLDER */
  .rs-ph{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 32px;gap:14px;text-align:center;min-height:360px;}
  .rs-ph-vis{width:74px;height:74px;border-radius:50%;background:var(--surface2);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:6px;position:relative;}
  .rs-ph-vis::after{content:'';position:absolute;inset:-8px;border-radius:50%;border:1px dashed var(--border2);animation:phspin 12s linear infinite;}
  @keyframes phspin{to{transform:rotate(360deg);}}
  .rs-ph-t{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text);margin-bottom:4px;}
  .rs-ph-s{font-size:14px;color:var(--text2);max-width:260px;line-height:1.6;font-weight:300;}

  /* SKELETON */
  .rs-skels{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));}
  .rs-skel{border-right:1px solid var(--border);border-bottom:1px solid var(--border);overflow:hidden;}
  .rs-skel-img{aspect-ratio:16/9;background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%);background-size:200% 100%;animation:sh 1.5s infinite;}
  .rs-skel-body{padding:14px 16px;}
  .rs-skel-line{height:11px;border-radius:6px;margin-bottom:9px;background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%);background-size:200% 100%;animation:sh 1.5s infinite;}
  .rs-skel-line.w80{width:80%;}.rs-skel-line.w60{width:60%;}.rs-skel-line.w40{width:40%;}
  .rs-skel-btn{height:30px;border-radius:7px;width:88px;margin-top:11px;background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%);background-size:200% 100%;animation:sh 1.5s infinite;}
  @keyframes sh{to{background-position:-200% 0;}}
`;

const DIETS = [
  { id:"vegetarian",  label:"Veg",        icon:"🌿" },
  { id:"vegan",       label:"Vegan",       icon:"🌱" },
  { id:"gluten free", label:"Gluten-Free", icon:"🌾" },
  { id:"ketogenic",   label:"Keto",        icon:"🥑" },
  { id:"paleo",       label:"Paleo",       icon:"🦴" },
  { id:"whole30",     label:"Whole30",     icon:"✨" },
];

const CUISINES = [
  { id:"",             label:"Any Cuisine" },
  { id:"italian",      label:"🍝  Italian" },
  { id:"indian",       label:"🍛  Indian" },
  { id:"mexican",      label:"🌮  Mexican" },
  { id:"chinese",      label:"🥢  Chinese" },
  { id:"japanese",     label:"🍣  Japanese" },
  { id:"thai",         label:"🍜  Thai" },
  { id:"mediterranean",label:"🫒  Mediterranean" },
  { id:"american",     label:"🍔  American" },
  { id:"french",       label:"🥐  French" },
  { id:"greek",        label:"🫙  Greek" },
  { id:"spanish",      label:"🥘  Spanish" },
  { id:"korean",       label:"🍱  Korean" },
];

const SORTS = [
  { id:"default",    label:"Relevance" },
  { id:"healthiest", label:"Healthiest" },
  { id:"fastest",    label:"Quickest" },
  { id:"servings",   label:"Most Servings" },
];

export default function RecipeSearch() {
  const [ingredients, setIngredients] = useState("");
  const [diet,        setDiet]        = useState("");
  const [cuisine,     setCuisine]     = useState("");
  const [recipeList,  setRecipeList]  = useState([]);
  const [sorted,      setSorted]      = useState([]);
  const [sortMode,    setSortMode]    = useState("default");
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [searched,    setSearched]    = useState(false);
  const [saved,       setSaved]       = useState(new Set());
  const resultsRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) { setError("Please enter at least one ingredient."); return; }
    setLoading(true); setError(""); setRecipeList([]); setSorted([]); setSearched(true); setSortMode("default");
    try {
      const res = await axios.get(`${API_BASE}/api/recipes/search`, {
        params: { ingredients, diet: diet||undefined, cuisine: cuisine||undefined },
      });
      if (res.data?.results?.length > 0) {
        setRecipeList(res.data.results); setSorted(res.data.results);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
      } else {
        setError("No recipes found. Try different ingredients or filters.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch recipes.");
    } finally { setLoading(false); }
  };

  const doSort = (mode) => {
    setSortMode(mode);
    const arr = [...recipeList];
    if (mode==="healthiest") arr.sort((a,b)=>(b.healthScore||0)-(a.healthScore||0));
    else if (mode==="fastest") arr.sort((a,b)=>(a.readyInMinutes||999)-(b.readyInMinutes||999));
    else if (mode==="servings") arr.sort((a,b)=>(b.servings||0)-(a.servings||0));
    setSorted(mode==="default" ? recipeList : arr);
  };

  const toggleSave = id => setSaved(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  const displayList = sorted.length > 0 ? sorted : recipeList;
  const hasFilters  = diet || cuisine;
  const dietObj     = DIETS.find(d => d.id === diet);
  const cuisineObj  = CUISINES.find(c => c.id === cuisine);

  return (
    <>
      <style>{css}</style>
      <div className="rs-root">

        {/* HERO */}
        <div className="rs-hero">
          <div className="rs-hero-inner">
            <div>
              <div className="rs-eyebrow"><span className="rs-eyebrow-line"/>Powered by Spoonacular</div>
              <h1 className="rs-hero-title">Discover Your Next<br/><em>Perfect Recipe</em></h1>
              <p className="rs-hero-sub">Enter what's in your kitchen and find the best recipes — filtered by diet, cuisine, and cook time.</p>
            </div>
            <div className="rs-hero-deco">🍽</div>
          </div>
        </div>

        {/* STATS */}
        <div className="rs-stats">
          {[{n:"1M+",l:"Recipes"},{n:"13",l:"Cuisines"},{n:"6",l:"Diet Types"},{n:recipeList.length||"—",l:"Found Now"}].map(({n,l})=>(
            <div key={l} className="rs-stat"><div className="rs-stat-n">{n}</div><div className="rs-stat-l">{l}</div></div>
          ))}
        </div>

        <div className="rs-layout">

          {/* SIDEBAR */}
          <div className="rs-sidebar">
            <div className="rs-panel">
              <div className="rs-panel-head">
                <div className="rs-panel-icon">🔍</div>
                <div className="rs-panel-title">Search Filters</div>
              </div>
              <div className="rs-panel-body">
                <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:18}}>

                  {/* Ingredients */}
                  <div>
                    <div className="rs-lbl">Ingredients</div>
                    <div className="rs-ing-wrap">
                      <span className="rs-ing-ico">🥦</span>
                      <input className="rs-ing-input" type="text" value={ingredients}
                        onChange={e=>setIngredients(e.target.value)}
                        placeholder="chicken, garlic, rice…" required />
                    </div>
                    <div className="rs-ing-hint">Separate with commas</div>
                  </div>

                  {/* Diet — compact inline chips */}
                  <div>
                    <div className="rs-lbl">Dietary Preference</div>
                    <div className="rs-diet-wrap">
                      {DIETS.map(d => (
                        <button key={d.id} type="button"
                          className={`rs-diet-chip${diet===d.id?" on":""}`}
                          onClick={()=>setDiet(p=>p===d.id?"":d.id)}>
                          {d.icon} {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cuisine — dropdown */}
                  <div>
                    <div className="rs-lbl">Cuisine</div>
                    <div className="rs-sel-wrap">
                      <select className="rs-sel" value={cuisine} onChange={e=>setCuisine(e.target.value)}>
                        {CUISINES.map(c=>(
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Active filters */}
                  {hasFilters && (
                    <div className="rs-actives">
                      <span className="rs-actives-lbl">Active</span>
                      {diet && dietObj && (
                        <span className="rs-atag">
                          {dietObj.icon} {dietObj.label}
                          <span className="rs-atag-x" onClick={()=>setDiet("")}>✕</span>
                        </span>
                      )}
                      {cuisine && cuisineObj && (
                        <span className="rs-atag">
                          {cuisineObj.label.replace(/^.{3}/,"")}
                          <span className="rs-atag-x" onClick={()=>setCuisine("")}>✕</span>
                        </span>
                      )}
                    </div>
                  )}

                  <button className="rs-btn" type="submit" disabled={loading}>
                    {loading?<><div className="rs-spin"/>Finding recipes…</>:<><span>Search Recipes</span><span style={{fontSize:16}}>→</span></>}
                  </button>

                  {error && <div className="rs-err"><span>⚠️</span>{error}</div>}
                </form>
              </div>
            </div>

            <div className="rs-tip">
              <span className="rs-tip-ico">💡</span>
              <span className="rs-tip-text"><strong>Pro tip:</strong> Add herbs like "cumin, paprika" for more precise matches.</span>
            </div>
          </div>

          {/* RESULTS */}
          <div className="rs-results" ref={resultsRef}>
            <div className="rs-rhead">
              <div className="rs-rtitle"><div className="rs-panel-icon">✨</div>Results</div>
              {recipeList.length>0&&<span className="rs-rcount">{recipeList.length} recipes found</span>}
            </div>

            {recipeList.length>0&&(
              <div className="rs-sortbar">
                <span className="rs-sort-lbl">Sort:</span>
                {SORTS.map(s=>(
                  <button key={s.id} className={`rs-sort-btn${sortMode===s.id?" on":""}`} onClick={()=>doSort(s.id)}>{s.label}</button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="rs-skels">
                {[1,2,3,4,5,6].map(i=>(
                  <div key={i} className="rs-skel">
                    <div className="rs-skel-img"/>
                    <div className="rs-skel-body">
                      <div className="rs-skel-line w80"/><div className="rs-skel-line w60"/><div className="rs-skel-line w40"/>
                      <div className="rs-skel-btn"/>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayList.length>0 ? (
              <div className="rs-grid">
                {displayList.map(r=>(
                  <div key={r.id} className="rs-card">
                    <div className="rs-cimg-wrap">
                      {r.image?<img className="rs-cimg" src={r.image} alt={r.title} loading="lazy"/>:<div className="rs-no-img">🍳</div>}
                      <div className="rs-overlay"/>
                      <div className="rs-badges">
                        {r.readyInMinutes&&<span className="rs-pill rs-pill-t">⏱ {r.readyInMinutes}m</span>}
                        {r.vegan&&<span className="rs-pill rs-pill-vg">Vegan</span>}
                        {!r.vegan&&r.vegetarian&&<span className="rs-pill rs-pill-v">Veg</span>}
                        {r.glutenFree&&<span className="rs-pill rs-pill-gf">GF</span>}
                      </div>
                      {r.healthScore>0&&<div className="rs-hs"><span className="rs-hs-n">{r.healthScore}</span></div>}
                    </div>
                    <div className="rs-cbody">
                      <div className="rs-ctitle">{r.title}</div>
                      <div className="rs-cmeta">
                        {r.servings&&<span className="rs-cm">🍽 {r.servings} servings</span>}
                        {r.readyInMinutes&&<span className="rs-cm">⏱ {r.readyInMinutes} min</span>}
                        {r.healthScore>0&&<span className="rs-cm">💚 {r.healthScore}%</span>}
                      </div>
                      <div className="rs-cfoot">
                        <a className="rs-view-btn" href={r.sourceUrl||`https://spoonacular.com/recipes/${r.id}`} target="_blank" rel="noopener noreferrer">View Recipe →</a>
                        <button className={`rs-star${saved.has(r.id)?" on":""}`} onClick={()=>toggleSave(r.id)} title={saved.has(r.id)?"Unsave":"Save"}>
                          {saved.has(r.id)?"★":"☆"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rs-ph">
                <div className="rs-ph-vis">{searched?"😕":"🍴"}</div>
                <div className="rs-ph-t">{searched?"No recipes found":"Ready when you are"}</div>
                <div className="rs-ph-s">{searched?"Try different ingredients, or remove a filter.":"Enter your ingredients on the left and hit Search."}</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}