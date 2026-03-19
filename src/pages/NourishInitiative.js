import React, { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  :root {
    --bg:        #080b09;
    --s1:        #0e1410;
    --s2:        #141d16;
    --border:    rgba(255,255,255,0.06);
    --border2:   rgba(255,255,255,0.11);
    --lime:      #a3e635;
    --lime-dim:  rgba(163,230,53,0.10);
    --lime-mid:  rgba(163,230,53,0.20);
    --red:       #fb7185;
    --gold:      #fbbf24;
    --sky:       #38bdf8;
    --text:      #e8f0e9;
    --t2:        rgba(232,240,233,0.50);
    --t3:        rgba(232,240,233,0.22);
    --t4:        rgba(232,240,233,0.06);
    --r:         16px;
    --r-sm:      9px;
    --sh:        0 4px 28px rgba(0,0,0,0.50);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ni-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Instrument Sans', sans-serif;
    color: var(--text);
    padding-bottom: 100px;
  }

  /* ── HERO ── */
  .ni-hero {
    position: relative; overflow: hidden;
    padding: 64px 24px 56px;
    background: linear-gradient(145deg, #0c1f0e 0%, #080b09 65%);
    border-bottom: 1px solid var(--border);
    text-align: center;
  }
  .ni-hero::after {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(ellipse 60% 80% at 50% 0%, rgba(163,230,53,0.08) 0%, transparent 70%),
      radial-gradient(ellipse 30% 40% at 10% 90%, rgba(163,230,53,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 30% 40% at 90% 90%, rgba(163,230,53,0.04) 0%, transparent 60%);
  }
  .ni-hero-inner { max-width: 720px; margin: 0 auto; position:relative; z-index:1; }
  .ni-badge {
    display: inline-flex; align-items:center; gap:7px;
    font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
    color:var(--lime); border:1px solid rgba(163,230,53,0.30);
    background:var(--lime-dim); padding:5px 14px; border-radius:20px; margin-bottom:20px;
  }
  .ni-badge::before {
    content:''; width:5px; height:5px; border-radius:50%;
    background:var(--lime); box-shadow:0 0 8px var(--lime);
    animation:niblink 2s ease-in-out infinite;
  }
  @keyframes niblink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .ni-hero-title {
    font-family:'Fraunces',serif;
    font-size:clamp(32px,7vw,72px); font-weight:900;
    line-height:1.05; letter-spacing:-2px; color:var(--text); margin-bottom:16px;
  }
  .ni-hero-title em { font-style:italic; color:var(--lime); }
  .ni-hero-sub { font-size:15px; color:var(--t2); line-height:1.7; max-width:520px; margin:0 auto; }

  /* ── MONTH SECTION ── */
  .ni-month-section { max-width:1200px; margin:0 auto; padding:60px 20px 0; }

  .ni-month-header {
    display:flex; align-items:center; gap:20px; margin-bottom:32px;
    position:relative;
  }
  .ni-month-header::after {
    content:''; flex:1; height:1px;
    background:linear-gradient(90deg, var(--border2) 0%, transparent 100%);
  }
  .ni-month-name {
    font-family:'Fraunces',serif;
    font-size:clamp(48px,10vw,96px); font-weight:900;
    color:var(--t4); line-height:1; letter-spacing:-5px;
    user-select:none; flex-shrink:0;
    /* subtle gradient: current month brighter */
  }
  .ni-month-name.current { color:var(--lime); opacity:0.25; }
  .ni-month-count {
    font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
    color:var(--t3); white-space:nowrap;
  }

  /* ── CARD GRID ── */
  .ni-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));
    gap:16px;
    margin-bottom:60px;
  }
  @media(max-width:640px) { .ni-grid { grid-template-columns:1fr; } }

  /* ── MEAL CARD ── */
  .ni-card {
    background:var(--s1); border:1px solid var(--border);
    border-radius:var(--r); padding:22px; box-shadow:var(--sh);
    display:flex; flex-direction:column; gap:12px;
    transition:border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    position:relative; overflow:hidden;
  }
  .ni-card:hover {
    border-color:var(--border2);
    transform:translateY(-3px);
    box-shadow:0 12px 40px rgba(0,0,0,0.6);
  }
  .ni-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, var(--card-accent, var(--lime)), transparent);
    border-radius:var(--r) var(--r) 0 0;
  }

  .ni-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
  .ni-card-date {
    font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
    color:var(--t3);
  }
  .ni-card-tag {
    border-radius:20px; padding:2px 10px; font-size:10px; font-weight:700;
    letter-spacing:0.5px; text-transform:uppercase; white-space:nowrap; flex-shrink:0;
  }

  .ni-card-title {
    font-family:'Fraunces',serif; font-size:17px; font-weight:700;
    color:var(--text); line-height:1.25;
  }
  .ni-card-desc { font-size:13px; color:var(--t2); line-height:1.65; }

  .ni-card-footer {
    margin-top:auto; padding-top:12px; border-top:1px solid var(--border);
    display:flex; align-items:center; gap:8px; flex-wrap:wrap;
  }
  .ni-card-meta {
    font-size:11px; color:var(--t3); display:flex; align-items:center; gap:5px;
  }

  /* ── FILTER BAR ── */
  .ni-filter-bar {
    max-width:1200px; margin:0 auto;
    padding:24px 20px 0;
    display:flex; gap:8px; flex-wrap:wrap; align-items:center;
  }
  .ni-filter-btn {
    padding:6px 16px; border-radius:20px; font-size:12px; font-weight:700;
    letter-spacing:0.3px; cursor:pointer; border:1px solid var(--border2);
    font-family:'Instrument Sans',sans-serif;
    transition:all 0.18s; background:transparent; color:var(--t2);
  }
  .ni-filter-btn:hover   { background:var(--s2); color:var(--text); }
  .ni-filter-btn.active  { background:var(--lime); color:#0c1a06; border-color:var(--lime); }
  .ni-filter-label { font-size:11px; color:var(--t3); letter-spacing:1.5px; text-transform:uppercase; margin-right:4px; }

  /* ── DIVIDER ── */
  .ni-divider { border:none; border-top:1px solid var(--border); margin:0 20px; }

  /* ── STATS ── */
  .ni-stats {
    max-width:1200px; margin:40px auto 0; padding:0 20px;
    display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px;
    margin-bottom:0;
  }
  .ni-stat-tile {
    background:var(--s1); border:1px solid var(--border);
    border-radius:var(--r-sm); padding:18px 16px; text-align:center;
  }
  .ni-stat-num { font-family:'Fraunces',serif; font-size:2rem; font-weight:900; }
  .ni-stat-label { font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:var(--t2); margin-top:5px; }

  @media(max-width:640px) {
    .ni-hero { padding:44px 16px 36px; }
    .ni-month-section { padding:40px 12px 0; }
    .ni-filter-bar, .ni-stats { padding:16px 12px 0; }
    .ni-month-name { font-size:clamp(36px,12vw,72px); letter-spacing:-3px; }
  }
`;

/* ─── DATA ─────────────────────────────────────────────────────── */
const MONTHS = [
  {
    name: "June",
    events: [
      { date: "4 Jun",  title: "Weekly Meal Prep",      tag: "Meal Prep", tagColor: "#a3e635", accent: "#a3e635",
        desc: "Bulk cooking session: grilled chicken, steamed vegetables and brown rice portions distributed to 12 families in the community." },
      { date: "11 Jun", title: "Community Kitchen Day",  tag: "Community", tagColor: "#38bdf8", accent: "#38bdf8",
        desc: "Volunteers came together to cook fresh dal, sabzi and chapati for over 40 guests at the local shelter." },
      { date: "18 Jun", title: "Fresh Produce Drive",    tag: "Donation",  tagColor: "#fbbf24", accent: "#fbbf24",
        desc: "Collected surplus vegetables from local vendors and distributed 80 kg of produce to families in need." },
      { date: "25 Jun", title: "Grand Feast Sunday",     tag: "Feast",     tagColor: "#fb7185", accent: "#fb7185",
        desc: "Monthly grand feast hosted at the community centre — 3-course meal served to 60+ attendees, zero food wasted." },
    ],
  },
  {
    name: "July",
    events: [
      { date: "2 Jul",  title: "Nutrition Workshop",     tag: "Workshop",  tagColor: "#a78bfa", accent: "#a78bfa",
        desc: "Interactive session on balanced diets and reducing household food waste, attended by 25 local families." },
      { date: "9 Jul",  title: "Weekly Meal Prep",       tag: "Meal Prep", tagColor: "#a3e635", accent: "#a3e635",
        desc: "Prepared and packed 50 meal boxes featuring seasonal produce — rajma, paneer curry and jeera rice." },
      { date: "16 Jul", title: "Zero Waste Cook-off",    tag: "Event",     tagColor: "#fb7185", accent: "#fb7185",
        desc: "Cooking competition challenging participants to create full meals from typically discarded vegetable parts." },
      { date: "23 Jul", title: "Grand Feast Sunday",     tag: "Feast",     tagColor: "#fbbf24", accent: "#fbbf24",
        desc: "End-of-month celebration feast — community members brought dishes to share, creating a vibrant potluck." },
    ],
  },
  {
    name: "August",
    events: [
      { date: "6 Aug",  title: "Independence Feast",     tag: "Special",   tagColor: "#fb7185", accent: "#fb7185",
        desc: "Special Independence Day community meal — traditional dishes prepared and shared with 80+ guests." },
      { date: "13 Aug", title: "Weekly Meal Prep",       tag: "Meal Prep", tagColor: "#a3e635", accent: "#a3e635",
        desc: "Volunteers prepped and packed 55 meal boxes with wholesome dal, sabzi, rice and seasonal sides." },
      { date: "20 Aug", title: "Surplus Food Rescue",    tag: "Rescue",    tagColor: "#38bdf8", accent: "#38bdf8",
        desc: "Partnered with local restaurants to rescue surplus cooked food — over 35 kg redirected to shelters." },
      { date: "27 Aug", title: "Grand Feast Sunday",     tag: "Feast",     tagColor: "#fbbf24", accent: "#fbbf24",
        desc: "August finale feast celebrating community milestones — milestone: 500 meals served this month!" },
    ],
  },
  {
    name: "September",
    events: [
      { date: "3 Sep",  title: "Weekly Meal Prep",       tag: "Meal Prep", tagColor: "#a3e635", accent: "#a3e635",
        desc: "Prepared hearty monsoon meals: hot khichdi, vegetable curry and fresh rotis for 15 partner families." },
      { date: "10 Sep", title: "School Lunch Program",   tag: "Schools",   tagColor: "#a78bfa", accent: "#a78bfa",
        desc: "Launched pilot school lunch programme — nutritious meals for 30 underprivileged students daily." },
      { date: "17 Sep", title: "Compost Workshop",       tag: "Workshop",  tagColor: "#34d399", accent: "#34d399",
        desc: "Hands-on workshop teaching households to compost organic kitchen waste and grow kitchen gardens." },
      { date: "24 Sep", title: "Grand Feast Sunday",     tag: "Feast",     tagColor: "#fbbf24", accent: "#fbbf24",
        desc: "Quarterly review feast — celebrating 1,500+ meals served since June with community volunteers." },
    ],
  },
  {
    name: "October",
    events: [
      { date: "1 Oct",  title: "Navratri Special Meals", tag: "Special",   tagColor: "#fb7185", accent: "#fb7185",
        desc: "Festival season special — satvik meals prepared and distributed following traditional Navratri recipes." },
      { date: "8 Oct",  title: "Weekly Meal Prep",       tag: "Meal Prep", tagColor: "#a3e635", accent: "#a3e635",
        desc: "60 meal boxes this week — increased capacity thanks to new volunteer recruits joining the programme." },
      { date: "15 Oct", title: "Dussehra Community Lunch",tag:"Feast",     tagColor: "#fbbf24", accent: "#fbbf24",
        desc: "Celebratory Dussehra lunch at the park — 100+ community members gathered for a shared feast." },
      { date: "22 Oct", title: "Cold Weather Prep Drive", tag:"Donation",  tagColor: "#38bdf8", accent: "#38bdf8",
        desc: "Collected and distributed dry ration kits — rice, dal, oil and spices — to 30 families ahead of winter." },
    ],
  },
  {
    name: "November",
    events: [
      { date: "5 Nov",  title: "Diwali Sweet Distribution",tag:"Special",  tagColor: "#fbbf24", accent: "#fbbf24",
        desc: "Handmade sweets prepared by volunteers distributed to 200+ children and families in partner shelters." },
      { date: "12 Nov", title: "Weekly Meal Prep",        tag: "Meal Prep",tagColor: "#a3e635", accent: "#a3e635",
        desc: "Winter warmers edition — hot soups, thick dals and parathas packed into 65 insulated meal boxes." },
      { date: "19 Nov", title: "Food Rescue Partnership",  tag:"Rescue",   tagColor: "#38bdf8", accent: "#38bdf8",
        desc: "Expanded food rescue to 5 new restaurant partners — now collecting and redistributing daily surplus." },
      { date: "26 Nov", title: "Grand Feast Sunday",      tag: "Feast",    tagColor: "#fb7185", accent: "#fb7185",
        desc: "Pre-winter grand feast — warmest event yet, with live music, 90 guests and not a plate left unfinished." },
    ],
  },
  {
    name: "December",
    events: [
      { date: "3 Dec",  title: "Winter Ration Drive",     tag: "Donation", tagColor: "#38bdf8", accent: "#38bdf8",
        desc: "Distributed 50 winter ration kits including warm food items, blankets and hygiene packs to families." },
      { date: "10 Dec", title: "Weekly Meal Prep",        tag: "Meal Prep",tagColor: "#a3e635", accent: "#a3e635",
        desc: "End-of-year prep push — volunteers hit a record 80 meal boxes in a single session. Community milestone!" },
      { date: "17 Dec", title: "Christmas Community Feast",tag:"Feast",    tagColor: "#fb7185", accent: "#fb7185",
        desc: "Festive feast bringing together all partner shelters, families and volunteers for a joyful year-end meal." },
      { date: "24 Dec", title: "Year-End Reflection",     tag: "Special",  tagColor: "#a78bfa", accent: "#a78bfa",
        desc: "Looking back at 6 months: 2,800+ meals served, 400 kg food rescued, 150 volunteer sessions completed." },
    ],
  },
];

const ALL_TAGS = ["All", ...Array.from(new Set(MONTHS.flatMap(m => m.events.map(e => e.tag))))];
const CURRENT_MONTH = new Date().toLocaleString("en", { month: "long" });

const NourishInitiative = () => {
  const [activeTag, setActiveTag] = useState("All");

  const filtered = MONTHS.map(m => ({
    ...m,
    events: activeTag === "All" ? m.events : m.events.filter(e => e.tag === activeTag),
  })).filter(m => m.events.length > 0);

  const totalEvents  = MONTHS.reduce((a, m) => a + m.events.length, 0);
  const totalMeals   = 2800;
  const totalRescued = 400;
  const volunteers   = 150;

  return (
    <>
      <style>{css}</style>
      <div className="ni-root">

        {/* Hero */}
        <div className="ni-hero">
          <div className="ni-hero-inner">
            <div className="ni-badge">Nourish Initiative</div>
            <h1 className="ni-hero-title">
              Feeding <em>Communities</em>,<br />One Meal at a Time
            </h1>
            <p className="ni-hero-sub">
              A month-by-month record of our community meals, food rescue operations, workshops and celebrations — built on zero food waste.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="ni-stats">
          {[
            { val: `${totalMeals}+`, label: "Meals Served",     color: "#a3e635" },
            { val: `${totalRescued}kg`, label: "Food Rescued",  color: "#38bdf8" },
            { val: `${volunteers}`,  label: "Volunteer Sessions",color: "#fbbf24" },
            { val: totalEvents,      label: "Events Logged",    color: "#fb7185" },
          ].map(s => (
            <div className="ni-stat-tile" key={s.label}
              style={{ borderTop:`2px solid ${s.color}` }}>
              <div className="ni-stat-num" style={{ color: s.color }}>{s.val}</div>
              <div className="ni-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="ni-filter-bar">
          <span className="ni-filter-label">Filter</span>
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              className={`ni-filter-btn${activeTag === tag ? " active" : ""}`}
              onClick={() => setActiveTag(tag)}
            >{tag}</button>
          ))}
        </div>

        {/* Month sections */}
        {filtered.map(month => (
          <div className="ni-month-section" key={month.name}>
            <div className="ni-month-header">
              <div className={`ni-month-name${month.name === CURRENT_MONTH ? " current" : ""}`}>
                {month.name}
              </div>
              <span className="ni-month-count">{month.events.length} event{month.events.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="ni-grid">
              {month.events.map((ev, i) => (
                <div
                  key={i}
                  className="ni-card"
                  style={{ "--card-accent": ev.accent }}
                >
                  <div className="ni-card-top">
                    <span className="ni-card-date">{ev.date}</span>
                    <span
                      className="ni-card-tag"
                      style={{
                        background: `${ev.tagColor}18`,
                        color: ev.tagColor,
                        border: `1px solid ${ev.tagColor}40`,
                      }}
                    >{ev.tag}</span>
                  </div>
                  <div className="ni-card-title">{ev.title}</div>
                  <div className="ni-card-desc">{ev.desc}</div>
                  <div className="ni-card-footer">
                    <span className="ni-card-meta">📅 {ev.date}</span>
                    <span className="ni-card-meta">·</span>
                    <span className="ni-card-meta">🌿 FeedForward</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </>
  );
};

export default NourishInitiative;