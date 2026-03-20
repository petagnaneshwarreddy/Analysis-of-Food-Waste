import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.REACT_APP_API_URL || "https://backend-food-fb9g.onrender.com";

/* ─── Resolve role from ANY localStorage key your app might use ─── */
const resolveRole = () => {
  // Check every common key name your app might save role under
  const fromUserRole = localStorage.getItem("userRole");
  if (fromUserRole) return fromUserRole;

  const fromRole = localStorage.getItem("role");
  if (fromRole) return fromRole;

  // Last resort: decode JWT directly and pull role from payload
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.role) return payload.role;
    } catch { /* ignore */ }
  }

  return null;
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&family=Instrument+Sans:wght@400;500;600;700&display=swap');

  :root {
    --bg:#080b09; --s1:#0e1410; --s2:#141d16; --s3:#1a261c;
    --border:rgba(255,255,255,0.06); --border2:rgba(255,255,255,0.11);
    --lime:#a3e635; --lime-dim:rgba(163,230,53,0.10); --lime-mid:rgba(163,230,53,0.20);
    --red:#fb7185; --red-dim:rgba(251,113,133,0.10);
    --gold:#fbbf24; --gold-dim:rgba(251,191,36,0.10);
    --sky:#38bdf8; --sky-dim:rgba(56,189,248,0.10);
    --violet:#a78bfa; --violet-dim:rgba(167,139,250,0.10);
    --text:#e8f0e9; --t2:rgba(232,240,233,0.50); --t3:rgba(232,240,233,0.22); --t4:rgba(232,240,233,0.07);
    --r:16px; --r-sm:9px;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  .fr-root{min-height:100vh;background:var(--bg);font-family:'Instrument Sans',sans-serif;color:var(--text);padding-bottom:120px;}

  /* HERO */
  .fr-hero{position:relative;overflow:hidden;padding:52px 24px 44px;border-bottom:1px solid var(--border);background:linear-gradient(145deg,#0b1a1f 0%,#080b09 65%);}
  .fr-hero::after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 55% 70% at 90% 15%,rgba(56,189,248,0.08) 0%,transparent 60%),radial-gradient(ellipse 30% 40% at 10% 85%,rgba(163,230,53,0.04) 0%,transparent 60%);}
  .fr-hero-inner{max-width:1140px;margin:0 auto;display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;position:relative;z-index:1;}
  .fr-hero-tag{display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--sky);border:1px solid rgba(56,189,248,0.30);background:var(--sky-dim);padding:5px 14px;border-radius:20px;margin-bottom:14px;}
  .fr-hero-tag::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--sky);box-shadow:0 0 8px var(--sky);animation:hblink 2s ease-in-out infinite;}
  @keyframes hblink{0%,100%{opacity:1}50%{opacity:0.3}}
  .fr-hero-title{font-family:'Fraunces',serif;font-size:clamp(34px,5.5vw,60px);font-weight:900;line-height:1.0;letter-spacing:-1.5px;}
  .fr-hero-title em{font-style:italic;color:var(--sky);}
  .fr-hero-sub{margin-top:10px;font-size:14px;color:var(--t2);max-width:420px;line-height:1.6;}
  .fr-hero-num{font-family:'Fraunces',serif;font-size:clamp(60px,10vw,100px);font-weight:900;color:var(--t4);line-height:1;letter-spacing:-6px;user-select:none;}

  /* STATS */
  .fr-stats{max-width:1140px;margin:16px auto 0;padding:0 16px;display:flex;gap:12px;flex-wrap:wrap;}
  .fr-stat{flex:1;min-width:110px;background:var(--s1);border:1px solid var(--border);border-radius:var(--r-sm);padding:16px 20px;position:relative;overflow:hidden;}
  .fr-stat::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;border-radius:0 0 var(--r-sm) var(--r-sm);background:var(--sky);opacity:0.5;}
  .fr-stat:nth-child(2)::after{background:var(--lime);opacity:0.4;}
  .fr-stat:nth-child(3)::after{background:var(--violet);opacity:0.5;}
  .fr-stat:nth-child(4)::after{background:var(--gold);opacity:0.5;}
  .fr-stat-n{font-family:'Fraunces',serif;font-size:28px;font-weight:700;color:var(--text);line-height:1;margin-bottom:4px;}
  .fr-stat-l{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--t3);}

  /* LOCATION BANNER */
  .fr-loc-banner{max-width:1140px;margin:16px auto 0;padding:0 16px;}
  .fr-loc-card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r-sm);padding:12px 18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
  .fr-loc-icon{font-size:16px;flex-shrink:0;}
  .fr-loc-body{flex:1;min-width:0;}
  .fr-loc-label{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--t3);margin-bottom:2px;}
  .fr-loc-text{font-size:13px;font-weight:600;color:var(--text);}
  .fr-loc-text.placeholder{color:var(--t3);font-style:italic;font-weight:400;}
  .fr-loc-btn{flex-shrink:0;display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:var(--sky-dim);color:var(--sky);border:1px solid rgba(56,189,248,0.28);border-radius:var(--r-sm);font-family:'Instrument Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background 0.18s;outline:none;}
  .fr-loc-btn:hover:not(:disabled){background:rgba(56,189,248,0.18);}
  .fr-loc-btn:disabled{opacity:0.5;cursor:default;}
  .fr-loc-spin{width:12px;height:12px;border:2px solid rgba(56,189,248,0.25);border-top-color:var(--sky);border-radius:50%;animation:locspin 0.7s linear infinite;}
  @keyframes locspin{to{transform:rotate(360deg);}}

  /* TOOLBAR */
  .fr-toolbar-wrap{max-width:1140px;margin:22px auto 0;padding:0 16px;}
  .fr-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px 18px;background:var(--s1);border:1px solid var(--border);border-radius:var(--r);}
  .fr-search-wrap{flex:1 1 220px;min-width:0;position:relative;}
  .fr-search-ico{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:13px;color:var(--t3);pointer-events:none;}
  .fr-search{width:100%;padding:9px 14px 9px 38px;font-family:'Instrument Sans',sans-serif;font-size:13px;color:var(--text);background:var(--s2);border:1px solid var(--border);border-radius:var(--r-sm);outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
  .fr-search::placeholder{color:var(--t3);}
  .fr-search:focus{border-color:var(--sky);box-shadow:0 0 0 3px rgba(56,189,248,0.09);}
  .fr-sort{flex:0 0 auto;padding:9px 32px 9px 12px;appearance:none;font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:600;color:var(--text);background:var(--s2);border:1px solid var(--border);border-radius:var(--r-sm);outline:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(232,240,233,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;transition:border-color 0.2s;}
  .fr-sort:focus{border-color:var(--sky);}
  .fr-chips{display:flex;gap:6px;flex-wrap:wrap;}
  .fr-chip{padding:7px 13px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:var(--s2);color:var(--t2);transition:all 0.15s;user-select:none;white-space:nowrap;}
  .fr-chip:hover{border-color:var(--border2);color:var(--text);}
  .fr-chip.active{background:var(--sky-dim);color:var(--sky);border-color:rgba(56,189,248,0.35);}
  .fr-near-btn{display:flex;align-items:center;gap:6px;padding:9px 14px;font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:700;background:var(--s2);border:1px solid var(--border);border-radius:var(--r-sm);cursor:pointer;white-space:nowrap;transition:all 0.18s;color:var(--t2);}
  .fr-near-btn:hover{border-color:var(--border2);color:var(--text);}
  .fr-near-btn.active{background:rgba(56,189,248,0.10);color:var(--sky);border-color:rgba(56,189,248,0.30);}
  .fr-near-btn:disabled{opacity:0.4;cursor:default;}
  .fr-view-toggle{display:flex;align-items:center;gap:2px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r-sm);padding:3px;flex:0 0 auto;}
  .fr-vbtn{width:32px;height:30px;display:flex;align-items:center;justify-content:center;border:none;background:none;color:var(--t3);border-radius:6px;cursor:pointer;font-size:14px;transition:all 0.15s;}
  .fr-vbtn.active{background:var(--s3);color:var(--text);}
  .fr-count{font-size:12px;font-weight:600;color:var(--t3);white-space:nowrap;}
  .fr-count strong{color:var(--sky);}

  /* GRID */
  .fr-grid-wrap{max-width:1140px;margin:22px auto 0;padding:0 16px;}
  .fr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;}
  @media(max-width:480px){.fr-grid{grid-template-columns:1fr;}}

  /* CARD */
  .fr-card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;transition:border-color 0.22s,box-shadow 0.22s,transform 0.22s;display:flex;flex-direction:column;cursor:pointer;}
  .fr-card:hover{border-color:rgba(56,189,248,0.25);box-shadow:0 16px 48px rgba(0,0,0,0.55);transform:translateY(-3px);}
  .fr-card-head{padding:22px 20px 18px;display:flex;align-items:center;gap:16px;background:linear-gradient(135deg,rgba(56,189,248,0.06) 0%,transparent 70%);border-bottom:1px solid var(--border);}
  .fr-avatar{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#0ea5e9);display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:22px;font-weight:900;color:#fff;flex-shrink:0;box-shadow:0 0 0 3px rgba(56,189,248,0.20),0 4px 16px rgba(56,189,248,0.25);}
  .fr-avatar-info{flex:1;min-width:0;}
  .fr-avatar-name{font-family:'Fraunces',serif;font-size:18px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .fr-avatar-uid{font-size:10px;font-weight:700;color:rgba(56,189,248,0.55);letter-spacing:1px;margin-top:3px;}
  .fr-recipient-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:3px 9px;border-radius:20px;background:rgba(56,189,248,0.10);color:var(--sky);border:1px solid rgba(56,189,248,0.22);margin-top:5px;}
  .fr-card-body{padding:16px 20px;flex:1;display:flex;flex-direction:column;gap:9px;}
  .fr-row{display:flex;align-items:flex-start;gap:10px;}
  .fr-lbl{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--t3);min-width:66px;flex-shrink:0;padding-top:2px;}
  .fr-val{font-size:13px;font-weight:500;color:var(--t2);line-height:1.4;}
  .fr-phone-chip{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:var(--sky);background:var(--sky-dim);border:1px solid rgba(56,189,248,0.20);border-radius:20px;padding:2px 9px;text-decoration:none;transition:background 0.15s;}
  .fr-phone-chip:hover{background:rgba(56,189,248,0.18);}
  .fr-gender-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:var(--violet);background:var(--violet-dim);border:1px solid rgba(167,139,250,0.22);border-radius:20px;padding:2px 9px;}
  .fr-dist-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px;background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.20);color:var(--sky);}
  .fr-card-footer{border-top:1px solid var(--border);padding:13px 20px;display:flex;gap:8px;flex-shrink:0;}
  .fr-view-btn{flex:1;padding:10px 12px;background:var(--sky-dim);color:var(--sky);border:1px solid rgba(56,189,248,0.25);font-family:'Instrument Sans',sans-serif;font-size:12px;font-weight:700;border-radius:var(--r-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:background 0.2s;}
  .fr-view-btn:hover{background:rgba(56,189,248,0.18);}
  .fr-call-btn-sm{flex:1;padding:10px 12px;background:var(--lime-dim);color:var(--lime);border:1px solid rgba(163,230,53,0.25);font-family:'Instrument Sans',sans-serif;font-size:12px;font-weight:700;border-radius:var(--r-sm);cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:5px;transition:background 0.2s;}
  .fr-call-btn-sm:hover{background:var(--lime-mid);}
  .fr-dir-btn-sm{padding:10px 12px;background:transparent;border:1px solid var(--border);color:var(--t2);font-family:'Instrument Sans',sans-serif;font-size:12px;font-weight:600;border-radius:var(--r-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:background 0.2s,color 0.2s;}
  .fr-dir-btn-sm:hover{background:rgba(255,255,255,0.04);color:var(--text);}

  /* LIST */
  .fr-list{display:flex;flex-direction:column;gap:10px;}
  .fr-lcard{background:var(--s1);border:1px solid var(--border);border-radius:var(--r-sm);display:flex;align-items:center;gap:14px;padding:14px 18px;overflow:hidden;transition:border-color 0.18s,transform 0.18s;cursor:pointer;}
  .fr-lcard:hover{border-color:rgba(56,189,248,0.20);transform:translateX(3px);}
  .fr-lcard-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#0ea5e9);display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:16px;font-weight:900;color:#fff;flex-shrink:0;box-shadow:0 0 0 2px rgba(56,189,248,0.20);}
  .fr-lcard-body{flex:1;min-width:0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
  .fr-lcard-name{font-family:'Fraunces',serif;font-size:15px;font-weight:700;color:var(--text);min-width:100px;flex-shrink:0;}
  .fr-lcard-meta{display:flex;gap:6px;flex-wrap:wrap;flex:1;}
  .fr-ltag{font-size:11px;font-weight:600;color:var(--t2);background:var(--s2);border:1px solid var(--border);border-radius:20px;padding:3px 10px;white-space:nowrap;}
  .fr-lcard-acts{margin-left:auto;flex-shrink:0;display:flex;gap:7px;align-items:center;}
  .fr-lbtn{padding:8px 14px;background:var(--sky-dim);color:var(--sky);border:1px solid rgba(56,189,248,0.25);font-family:'Instrument Sans',sans-serif;font-size:12px;font-weight:700;border-radius:7px;cursor:pointer;transition:background 0.2s;white-space:nowrap;}
  .fr-lbtn:hover{background:rgba(56,189,248,0.18);}
  .fr-lbtn-call{padding:8px 14px;background:var(--lime-dim);color:var(--lime);border:1px solid rgba(163,230,53,0.25);font-family:'Instrument Sans',sans-serif;font-size:12px;font-weight:700;border-radius:7px;cursor:pointer;text-decoration:none;display:flex;align-items:center;gap:4px;transition:background 0.2s;white-space:nowrap;}
  .fr-lbtn-call:hover{background:var(--lime-mid);}
  .fr-lbtn-dir{padding:8px 10px;background:transparent;border:1px solid var(--border);color:var(--t2);font-size:13px;font-weight:600;border-radius:7px;cursor:pointer;transition:background 0.2s;}
  .fr-lbtn-dir:hover{background:rgba(255,255,255,0.05);}

  /* MODAL */
  .rm-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.80);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;}
  .rm-box{background:#0c1512;border:1px solid rgba(255,255,255,0.11);border-radius:22px;width:100%;max-width:520px;box-shadow:0 32px 80px rgba(0,0,0,0.80);overflow:hidden;position:relative;max-height:90vh;overflow-y:auto;}
  .rm-box::-webkit-scrollbar{width:4px;} .rm-box::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px;}
  .rm-close{position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:var(--t2);font-size:14px;cursor:pointer;transition:background 0.15s;z-index:2;}
  .rm-close:hover{background:rgba(255,255,255,0.12);color:var(--text);}
  .rm-hero{padding:32px 28px 22px;background:linear-gradient(145deg,rgba(56,189,248,0.08) 0%,transparent 60%);display:flex;align-items:center;gap:18px;}
  .rm-big-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#0284c7);display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:28px;font-weight:900;color:#fff;flex-shrink:0;box-shadow:0 0 0 4px rgba(56,189,248,0.20),0 8px 28px rgba(56,189,248,0.25);}
  .rm-hero-info{flex:1;min-width:0;}
  .rm-hero-name{font-family:'Fraunces',serif;font-size:26px;font-weight:900;color:var(--text);line-height:1.1;margin-bottom:8px;padding-right:40px;}
  .rm-hero-tags{display:flex;gap:7px;flex-wrap:wrap;}
  .rm-tag{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;}
  .rm-tag-sky{background:var(--sky-dim);color:var(--sky);border:1px solid rgba(56,189,248,0.22);}
  .rm-tag-lime{background:var(--lime-dim);color:var(--lime);border:1px solid rgba(163,230,53,0.22);}
  .rm-tag-vio{background:var(--violet-dim);color:var(--violet);border:1px solid rgba(167,139,250,0.22);}
  .rm-tag-gold{background:var(--gold-dim);color:var(--gold);border:1px solid rgba(251,191,36,0.22);}
  .rm-body{padding:0 28px 28px;display:flex;flex-direction:column;gap:14px;}
  .rm-section{background:rgba(255,255,255,0.025);border:1px solid var(--border);border-radius:12px;padding:16px 18px;display:flex;flex-direction:column;gap:11px;}
  .rm-section-sky{background:rgba(56,189,248,0.04);border-color:rgba(56,189,248,0.14);}
  .rm-section-lime{background:rgba(163,230,53,0.04);border-color:rgba(163,230,53,0.14);}
  .rm-sec-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--t3);margin-bottom:2px;}
  .rm-sec-title.sky{color:rgba(56,189,248,0.60);}
  .rm-sec-title.lime{color:rgba(163,230,53,0.55);}
  .rm-detail-row{display:flex;align-items:flex-start;gap:11px;}
  .rm-detail-ico{font-size:16px;flex-shrink:0;margin-top:1px;}
  .rm-detail-body{flex:1;min-width:0;}
  .rm-detail-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--t3);margin-bottom:3px;}
  .rm-detail-val{font-size:14px;font-weight:600;color:var(--text);line-height:1.4;}
  .rm-detail-val a{color:var(--sky);text-decoration:none;}
  .rm-detail-val a:hover{text-decoration:underline;}
  .rm-divider{height:1px;background:var(--border);margin:2px 0;}
  .rm-actions{display:flex;flex-direction:column;gap:9px;}
  .rm-call-btn{width:100%;padding:13px 16px;background:var(--lime);color:#0c1a06;font-family:'Instrument Sans',sans-serif;font-size:14px;font-weight:700;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;transition:opacity 0.2s,transform 0.12s;box-shadow:0 4px 16px rgba(163,230,53,0.28);}
  .rm-call-btn:hover{opacity:0.87;transform:translateY(-1px);}
  .rm-dir-btn{width:100%;padding:12px 16px;background:var(--sky-dim);color:var(--sky);border:1px solid rgba(56,189,248,0.25);font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:700;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:background 0.2s;}
  .rm-dir-btn:hover{background:rgba(56,189,248,0.18);}
  .rm-email-btn{width:100%;padding:11px 16px;background:transparent;border:1px solid var(--border);color:var(--t2);font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:600;border-radius:10px;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:7px;transition:background 0.2s,color 0.2s;}
  .rm-email-btn:hover{background:rgba(255,255,255,0.04);color:var(--text);}
  .rm-close-btn{width:100%;padding:11px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:var(--t2);font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:600;border-radius:10px;cursor:pointer;transition:background 0.18s;}
  .rm-close-btn:hover{background:rgba(255,255,255,0.08);color:var(--text);}

  /* STATES */
  .fr-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;gap:16px;color:var(--t2);font-size:14px;}
  .fr-spinner{width:36px;height:36px;border:3px solid rgba(56,189,248,0.15);border-top-color:var(--sky);border-radius:50%;animation:dspin 0.75s linear infinite;}
  @keyframes dspin{to{transform:rotate(360deg);}}
  .fr-empty{max-width:420px;margin:80px auto;text-align:center;padding:48px 32px;background:var(--s1);border:1px solid var(--border);border-radius:var(--r);color:var(--t2);font-size:14px;}
  .fr-empty-ico{font-size:48px;margin-bottom:14px;}
  .fr-empty-title{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:var(--text);margin-bottom:8px;}
  .fr-gate{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:var(--bg);}
  .fr-gate-ico{font-size:52px;}
  .fr-gate-txt{font-family:'Fraunces',serif;font-size:22px;color:var(--t2);text-align:center;max-width:360px;line-height:1.5;}
  .fr-no-results{padding:72px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;grid-column:1/-1;}
  .fr-no-results-ico{font-size:44px;opacity:0.4;}
  .fr-no-results-title{font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:var(--t2);}
  .fr-no-results-sub{font-size:13px;color:var(--t3);}
  .fr-no-results-btn{margin-top:6px;padding:9px 20px;background:var(--sky-dim);border:1px solid rgba(56,189,248,0.25);color:var(--sky);font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:700;border-radius:99px;cursor:pointer;transition:background 0.15s;}
  .fr-no-results-btn:hover{background:rgba(56,189,248,0.18);}
`;

/* ─── Helpers ─── */
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const geocodeLocation = async (locStr) => {
  if (!locStr) return null;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locStr)}&format=json&limit=1`, { headers: { "Accept-Language": "en" } });
    const d = await res.json();
    if (d[0]) return { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon) };
  } catch { /* ignore */ }
  return null;
};

const getDirections = (dest) => {
  if (!dest) return;
  const fb = () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`, "_blank");
  if (!navigator.geolocation) { fb(); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => window.open(`https://www.google.com/maps/dir/${pos.coords.latitude},${pos.coords.longitude}/${encodeURIComponent(dest)}`, "_blank"),
    fb, { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
  );
};

const getInitials = (name = "") =>
  name.trim().split(/\s+/).slice(0,2).map(w => w[0]?.toUpperCase() || "").join("") || "R";

const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  : "—";

const genderLabel = (g) =>
  ({ male: "👨 Male", female: "👩 Female", other: "🧑 Other", prefer_not: "🔒 Private" })[g] || null;

/* ─── DETAIL MODAL ─── */
const RecipientModal = ({ recipient: r, dist, onClose }) => (
  <AnimatePresence>
    <motion.div className="rm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target.classList.contains("rm-overlay")) onClose(); }}>
      <motion.div className="rm-box"
        initial={{ scale: 0.88, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 30 }} transition={{ type: "spring", damping: 22, stiffness: 280 }}>
        <button className="rm-close" onClick={onClose}>✕</button>

        {/* Hero */}
        <div className="rm-hero">
          <div className="rm-big-avatar">{getInitials(r.username)}</div>
          <div className="rm-hero-info">
            <div className="rm-hero-name">{r.username}</div>
            <div className="rm-hero-tags">
              <span className="rm-tag rm-tag-sky">🙏 Recipient</span>
              {r.userId && <span className="rm-tag rm-tag-lime">ID: {r.userId}</span>}
              {r.gender && genderLabel(r.gender) && <span className="rm-tag rm-tag-vio">{genderLabel(r.gender)}</span>}
              {dist !== undefined && (
                <span className="rm-tag rm-tag-gold">
                  📍 {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`} away
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="rm-body">

          {/* Contact */}
          <div className="rm-section rm-section-sky">
            <div className="rm-sec-title sky">📞 Contact Information</div>
            <div className="rm-detail-row">
              <span className="rm-detail-ico">👤</span>
              <div className="rm-detail-body">
                <div className="rm-detail-label">Full Name</div>
                <div className="rm-detail-val">{r.username}</div>
              </div>
            </div>
            {r.phone && (<>
              <div className="rm-divider" />
              <div className="rm-detail-row">
                <span className="rm-detail-ico">📱</span>
                <div className="rm-detail-body">
                  <div className="rm-detail-label">Phone Number</div>
                  <div className="rm-detail-val"><a href={`tel:${r.phone}`}>{r.phone}</a></div>
                </div>
              </div>
            </>)}
            {r.email && (<>
              <div className="rm-divider" />
              <div className="rm-detail-row">
                <span className="rm-detail-ico">✉️</span>
                <div className="rm-detail-body">
                  <div className="rm-detail-label">Email Address</div>
                  <div className="rm-detail-val"><a href={`mailto:${r.email}`}>{r.email}</a></div>
                </div>
              </div>
            </>)}
          </div>

          {/* Location */}
          {r.location && (
            <div className="rm-section rm-section-lime">
              <div className="rm-sec-title lime">📍 Location</div>
              <div className="rm-detail-row">
                <span className="rm-detail-ico">🗺️</span>
                <div className="rm-detail-body">
                  <div className="rm-detail-label">Registered Address</div>
                  <div className="rm-detail-val">{r.location}</div>
                </div>
              </div>
              {dist !== undefined && (<>
                <div className="rm-divider" />
                <div className="rm-detail-row">
                  <span className="rm-detail-ico">📏</span>
                  <div className="rm-detail-body">
                    <div className="rm-detail-label">Distance from You</div>
                    <div className="rm-detail-val" style={{ color: "var(--gold)" }}>
                      {dist < 1 ? `${Math.round(dist * 1000)} meters` : `${dist.toFixed(2)} km away`}
                    </div>
                  </div>
                </div>
              </>)}
            </div>
          )}

          {/* Account */}
          <div className="rm-section">
            <div className="rm-sec-title">📋 Account Details</div>
            {r.userId && (
              <div className="rm-detail-row">
                <span className="rm-detail-ico">🪪</span>
                <div className="rm-detail-body">
                  <div className="rm-detail-label">User ID</div>
                  <div className="rm-detail-val" style={{ color: "var(--sky)", letterSpacing: 1 }}>{r.userId}</div>
                </div>
              </div>
            )}
            <div className="rm-divider" />
            <div className="rm-detail-row">
              <span className="rm-detail-ico">📅</span>
              <div className="rm-detail-body">
                <div className="rm-detail-label">Member Since</div>
                <div className="rm-detail-val">{fmtDate(r.createdAt)}</div>
              </div>
            </div>
            {r.gender && genderLabel(r.gender) && (<>
              <div className="rm-divider" />
              <div className="rm-detail-row">
                <span className="rm-detail-ico">👤</span>
                <div className="rm-detail-body">
                  <div className="rm-detail-label">Gender</div>
                  <div className="rm-detail-val">{genderLabel(r.gender)}</div>
                </div>
              </div>
            </>)}
          </div>

          {/* Actions */}
          <div className="rm-actions">
            {r.phone && (
              <a className="rm-call-btn" href={`tel:${r.phone}`}>
                📞 Call {r.username} — {r.phone}
              </a>
            )}
            {r.location && (
              <button className="rm-dir-btn" onClick={() => getDirections(r.location)}>
                📍 Get Directions to Recipient's Location
              </button>
            )}
            {r.email && (
              <a className="rm-email-btn" href={`mailto:${r.email}`}>
                ✉️ Send Email to {r.email}
              </a>
            )}
            <button className="rm-close-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
const FindRecipients = () => {
  const [recipients,   setRecipients]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [sortBy,       setSortBy]       = useState("name-asc");
  const [genderFilter, setGenderFilter] = useState("all");
  const [view,         setView]         = useState("grid");
  const [nearMeActive, setNearMeActive] = useState(false);
  const [selectedR,    setSelectedR]    = useState(null);
  const [userCoords,   setUserCoords]   = useState(null);
  const [locText,      setLocText]      = useState("");
  const [locating,     setLocating]     = useState(false);
  const [distCache,    setDistCache]    = useState({});

  // ★ FIXED: resolve role from any key + JWT fallback
  const token = localStorage.getItem("token");
  const role  = resolveRole();

  /* Fetch recipients */
  const fetchRecipients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/users/recipients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipients(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load recipients.");
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (token) fetchRecipients(); }, [fetchRecipients, token]);

  /* GPS */
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setUserCoords({ lat, lon });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=14`,
            { headers: { "Accept-Language": "en-IN,en" } }
          );
          const d = await res.json();
          const a = d.address || {};
          const parts = [a.road || a.pedestrian, a.suburb || a.neighbourhood, a.city || a.town || a.village, a.state].filter(Boolean);
          setLocText(parts.join(", ") || d.display_name?.split(",").slice(0,3).join(", "));
        } catch { setLocText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`); }
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  /* Compute distances */
  useEffect(() => {
    if (!userCoords || recipients.length === 0) return;
    const compute = async () => {
      const newCache = { ...distCache };
      for (const r of recipients) {
        if (newCache[r._id] !== undefined || !r.location) continue;
        const geo = await geocodeLocation(r.location);
        if (geo) newCache[r._id] = haversine(userCoords.lat, userCoords.lon, geo.lat, geo.lon);
      }
      setDistCache(newCache);
    };
    compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCoords, recipients]);

  /* Filter + Sort */
  const filtered = (() => {
    let out = [...recipients];
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(r =>
        (r.username || "").toLowerCase().includes(q) ||
        (r.location || "").toLowerCase().includes(q) ||
        (r.email    || "").toLowerCase().includes(q) ||
        (r.phone    || "").toLowerCase().includes(q) ||
        (r.userId   || "").toLowerCase().includes(q)
      );
    }
    if (genderFilter !== "all") out = out.filter(r => r.gender === genderFilter);
    if (nearMeActive && userCoords) out = out.filter(r => distCache[r._id] === undefined || distCache[r._id] <= 25);
    switch (sortBy) {
      case "name-asc":  out.sort((a, b) => (a.username || "").localeCompare(b.username || "")); break;
      case "name-desc": out.sort((a, b) => (b.username || "").localeCompare(a.username || "")); break;
      case "date-desc": out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "date-asc":  out.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case "dist-asc":  if (userCoords) out.sort((a, b) => (distCache[a._id] ?? 9999) - (distCache[b._id] ?? 9999)); break;
      default: break;
    }
    return out;
  })();

  const withPhone    = recipients.filter(r => r.phone).length;
  const withLocation = recipients.filter(r => r.location).length;

  const cv = {
    hidden:  { opacity: 0, y: 22 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.28, ease: "easeOut" } }),
  };

  /* Guards */
  if (!token) return (
    <><style>{css}</style>
      <div className="fr-gate"><div className="fr-gate-ico">🔒</div><div className="fr-gate-txt">Please log in to view this page</div></div>
    </>
  );
  if (role !== "donor") return (
    <><style>{css}</style>
      <div className="fr-gate">
        <div className="fr-gate-ico">🚫</div>
        <div className="fr-gate-txt">This page is only accessible to donors</div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>

      {selectedR && (
        <RecipientModal recipient={selectedR} dist={distCache[selectedR._id]} onClose={() => setSelectedR(null)} />
      )}

      <div className="fr-root">

        {/* HERO */}
        <div className="fr-hero">
          <div className="fr-hero-inner">
            <div>
              <div className="fr-hero-tag">Donor Portal</div>
              <h1 className="fr-hero-title">Find <em>Recipients</em><br />Near You</h1>
              <p className="fr-hero-sub">Browse all registered food recipients. Call, get directions, and coordinate your donation.</p>
            </div>
            <div className="fr-hero-num">{recipients.length}</div>
          </div>
        </div>

        {/* LOCATION BANNER */}
        <div className="fr-loc-banner">
          <div className="fr-loc-card">
            <span className="fr-loc-icon">{locating ? "📡" : userCoords ? "📍" : "🗺️"}</span>
            <div className="fr-loc-body">
              <div className="fr-loc-label">Your Location</div>
              <div className={`fr-loc-text${!locText && !locating ? " placeholder" : ""}`}>
                {locating ? "Detecting your location…" : locText || "Click Locate Me to see distances to recipients"}
              </div>
            </div>
            <button className="fr-loc-btn" onClick={detectLocation} disabled={locating}>
              {locating ? <><div className="fr-loc-spin" /> Locating…</> : userCoords ? <>🔄 Refresh</> : <>📍 Locate Me</>}
            </button>
          </div>
        </div>

        {/* STATS */}
        {!loading && !error && (
          <div className="fr-stats">
            {[
              { n: recipients.length, l: "Total Recipients" },
              { n: filtered.length,   l: "Showing" },
              { n: withPhone,         l: "With Phone" },
              { n: withLocation,      l: "With Location" },
            ].map(({ n, l }, i) => (
              <motion.div key={l} className="fr-stat"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <div className="fr-stat-n">{n}</div><div className="fr-stat-l">{l}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* TOOLBAR */}
        {!loading && !error && (
          <div className="fr-toolbar-wrap">
            <div className="fr-toolbar">
              <div className="fr-search-wrap">
                <span className="fr-search-ico">🔍</span>
                <input className="fr-search" type="text"
                  placeholder="Search name, location, email, phone, User ID…"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="fr-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
                <option value="date-desc">Newest members</option>
                <option value="date-asc">Oldest members</option>
                <option value="dist-asc" disabled={!userCoords}>{!userCoords ? "Nearest (locate first)" : "Nearest first"}</option>
              </select>
              <div className="fr-chips">
                {[{ v: "all", l: "All" }, { v: "male", l: "👨 Male" }, { v: "female", l: "👩 Female" }, { v: "other", l: "🧑 Other" }].map(c => (
                  <button key={c.v} className={`fr-chip${genderFilter === c.v ? " active" : ""}`}
                    onClick={() => setGenderFilter(c.v)}>{c.l}</button>
                ))}
              </div>
              <button className={`fr-near-btn${nearMeActive ? " active" : ""}`}
                onClick={() => setNearMeActive(v => !v)} disabled={!userCoords}
                title={!userCoords ? "Click Locate Me first" : ""}>
                📍 Near Me
              </button>
              <div className="fr-view-toggle">
                <button className={`fr-vbtn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")} title="Grid">⊞</button>
                <button className={`fr-vbtn${view === "list" ? " active" : ""}`} onClick={() => setView("list")} title="List">☰</button>
              </div>
              <span className="fr-count"><strong>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <div className="fr-loading"><div className="fr-spinner" />Loading recipients…</div>
        ) : error ? (
          <div className="fr-empty">
            <div className="fr-empty-ico">⚠️</div>
            <div className="fr-empty-title" style={{ color: "var(--red)" }}>Failed to load</div>
            <div style={{ marginBottom: 16 }}>{error}</div>
            <button onClick={fetchRecipients}
              style={{ padding: "9px 20px", background: "var(--sky-dim)", border: "1px solid rgba(56,189,248,0.25)", color: "var(--sky)", fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, fontWeight: 700, borderRadius: 99, cursor: "pointer" }}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="fr-grid-wrap">
            <AnimatePresence mode="wait">

              {/* GRID VIEW */}
              {view === "grid" && (
                <motion.div key="grid" className="fr-grid"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {filtered.length === 0 ? (
                    <div className="fr-no-results">
                      <div className="fr-no-results-ico">🔍</div>
                      <div className="fr-no-results-title">No recipients match your filters</div>
                      <div className="fr-no-results-sub">Try adjusting your search or gender filter</div>
                      <button className="fr-no-results-btn" onClick={() => { setSearch(""); setGenderFilter("all"); setNearMeActive(false); }}>Clear filters</button>
                    </div>
                  ) : filtered.map((r, i) => {
                    const dist = distCache[r._id];
                    return (
                      <motion.div key={r._id || i} className="fr-card"
                        custom={i} variants={cv} initial="hidden" animate="visible"
                        onClick={() => setSelectedR(r)}>
                        <div className="fr-card-head">
                          <div className="fr-avatar">{getInitials(r.username)}</div>
                          <div className="fr-avatar-info">
                            <div className="fr-avatar-name">{r.username}</div>
                            {r.userId && <div className="fr-avatar-uid">ID: {r.userId}</div>}
                            <div className="fr-recipient-badge">🙏 Recipient</div>
                          </div>
                        </div>
                        <div className="fr-card-body">
                          {r.phone && (
                            <div className="fr-row">
                              <span className="fr-lbl">Phone</span>
                              <a className="fr-phone-chip" href={`tel:${r.phone}`} onClick={e => e.stopPropagation()}>📱 {r.phone}</a>
                            </div>
                          )}
                          {r.email && (
                            <div className="fr-row">
                              <span className="fr-lbl">Email</span>
                              <span className="fr-val" style={{ fontSize: 12, wordBreak: "break-all" }}>{r.email}</span>
                            </div>
                          )}
                          {r.location && (
                            <div className="fr-row">
                              <span className="fr-lbl">Location</span>
                              <span className="fr-val">{r.location.length > 42 ? r.location.slice(0, 42) + "…" : r.location}</span>
                            </div>
                          )}
                          {r.gender && genderLabel(r.gender) && (
                            <div className="fr-row">
                              <span className="fr-lbl">Gender</span>
                              <span className="fr-gender-badge">{genderLabel(r.gender)}</span>
                            </div>
                          )}
                          {dist !== undefined && (
                            <div className="fr-row">
                              <span className="fr-lbl">Distance</span>
                              <span className="fr-dist-badge">📍 {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`} away</span>
                            </div>
                          )}
                          {r.createdAt && (
                            <div className="fr-row">
                              <span className="fr-lbl">Joined</span>
                              <span className="fr-val" style={{ fontSize: 12, color: "var(--t3)" }}>📅 {fmtDate(r.createdAt)}</span>
                            </div>
                          )}
                        </div>
                        <div className="fr-card-footer">
                          <button className="fr-view-btn" onClick={(e) => { e.stopPropagation(); setSelectedR(r); }}>👁 Details</button>
                          {r.phone && <a className="fr-call-btn-sm" href={`tel:${r.phone}`} onClick={e => e.stopPropagation()}>📞 Call</a>}
                          {r.location && <button className="fr-dir-btn-sm" onClick={(e) => { e.stopPropagation(); getDirections(r.location); }}>📍</button>}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* LIST VIEW */}
              {view === "list" && (
                <motion.div key="list" className="fr-list"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {filtered.length === 0 ? (
                    <div className="fr-no-results">
                      <div className="fr-no-results-ico">🔍</div>
                      <div className="fr-no-results-title">No recipients match your filters</div>
                      <button className="fr-no-results-btn" onClick={() => { setSearch(""); setGenderFilter("all"); setNearMeActive(false); }}>Clear filters</button>
                    </div>
                  ) : filtered.map((r, i) => {
                    const dist = distCache[r._id];
                    return (
                      <motion.div key={r._id || i} className="fr-lcard"
                        custom={i} variants={cv} initial="hidden" animate="visible"
                        onClick={() => setSelectedR(r)}>
                        <div className="fr-lcard-avatar">{getInitials(r.username)}</div>
                        <div className="fr-lcard-body">
                          <div className="fr-lcard-name">{r.username}</div>
                          <div className="fr-lcard-meta">
                            {r.userId   && <span className="fr-ltag">🪪 {r.userId}</span>}
                            {r.location && <span className="fr-ltag">📍 {r.location.slice(0, 26)}{r.location.length > 26 ? "…" : ""}</span>}
                            {r.phone    && <span className="fr-ltag" style={{ color: "var(--sky)" }}>📱 {r.phone}</span>}
                            {r.gender && genderLabel(r.gender) && <span className="fr-ltag">{genderLabel(r.gender)}</span>}
                            {dist !== undefined && <span className="fr-ltag" style={{ color: "var(--gold)" }}>📍 {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}</span>}
                          </div>
                        </div>
                        <div className="fr-lcard-acts">
                          <button className="fr-lbtn" onClick={(e) => { e.stopPropagation(); setSelectedR(r); }}>👁 Details</button>
                          {r.phone && <a className="fr-lbtn-call" href={`tel:${r.phone}`} onClick={e => e.stopPropagation()}>📞 Call</a>}
                          {r.location && <button className="fr-lbtn-dir" onClick={(e) => { e.stopPropagation(); getDirections(r.location); }}>📍</button>}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default FindRecipients;