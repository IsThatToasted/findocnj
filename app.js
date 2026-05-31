:root {
  --ocean: #087ea4;
  --ocean-dark: #075985;
  --deep: #083344;
  --sky: #e0f7ff;
  --sand: #fff4d6;
  --sun: #fbbf24;
  --coral: #fb7185;
  --mint: #99f6e4;
  --green: #16a34a;
  --yellow: #ca8a04;
  --red: #dc2626;
  --ink: #12313f;
  --muted: #607884;
  --line: rgba(8, 126, 164, 0.14);
  --card: rgba(255, 255, 255, 0.92);
  --shadow: 0 22px 70px rgba(7, 89, 133, 0.16);
  --radius: 26px;
}

* { box-sizing: border-box; scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--ink);
  background: radial-gradient(circle at top left, rgba(251,191,36,.28), transparent 30rem), radial-gradient(circle at top right, rgba(20,184,166,.22), transparent 32rem), linear-gradient(180deg, #dff7ff 0%, #fff8e7 35%, #f7fbff 100%);
  min-height: 100vh;
}
a { color: inherit; }
.topbar { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.84); backdrop-filter: blur(18px); border-bottom: 1px solid var(--line); }
.topbar-inner { max-width: 1220px; margin: 0 auto; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 950; color: var(--ocean-dark); letter-spacing: -.04em; white-space: nowrap; text-decoration: none; }
.brand-icon { width: 40px; height: 40px; border-radius: 15px; display: grid; place-items: center; color: white; background: linear-gradient(135deg, var(--ocean), #38bdf8); box-shadow: 0 12px 28px rgba(8,126,164,.28); }
.navlinks { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 7px; }
.navlinks a { text-decoration: none; font-weight: 850; color: var(--ocean-dark); font-size: .88rem; padding: 9px 11px; border-radius: 999px; transition: .18s ease; }
.navlinks a:hover { background: rgba(8,126,164,.1); transform: translateY(-1px); }
.menu-btn { display: none; border: 1px solid var(--line); background: white; border-radius: 14px; padding: 8px 12px; font-size: 1.1rem; cursor: pointer; color: var(--ocean-dark); }
.hero { max-width: 1220px; margin: 0 auto; padding: 58px 20px 24px; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(310px, .95fr); gap: 28px; align-items: center; }
.eyebrow { display: inline-flex; align-items: center; gap: 9px; padding: 9px 14px; border-radius: 999px; background: rgba(255,255,255,.82); border: 1px solid var(--line); color: var(--ocean-dark); font-weight: 950; box-shadow: 0 12px 35px rgba(7,89,133,.09); }
h1 { margin: 22px 0 16px; font-size: clamp(2.55rem, 6vw, 5.7rem); line-height: .92; letter-spacing: -.08em; color: var(--deep); }
.hero p { font-size: 1.13rem; line-height: 1.7; color: var(--muted); max-width: 690px; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 16px; padding: 13px 17px; text-decoration: none; font-weight: 950; border: 1px solid transparent; transition: .2s ease; cursor: pointer; font: inherit; }
.btn:hover { transform: translateY(-2px); }
.btn-primary { background: linear-gradient(135deg, var(--ocean), #0ea5e9); color: white; box-shadow: 0 16px 35px rgba(14,165,233,.28); }
.btn-secondary { background: rgba(255,255,255,.84); color: var(--ocean-dark); border-color: var(--line); }
.hero-card { position: relative; min-height: 430px; border-radius: 34px; overflow: hidden; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,.8); background: linear-gradient(rgba(4,47,64,.08), rgba(4,47,64,.24)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80") center/cover; }
.hero-float { position: absolute; left: 18px; right: 18px; bottom: 18px; padding: 18px; border-radius: 22px; background: rgba(255,255,255,.9); backdrop-filter: blur(16px); display: grid; grid-template-columns: auto 1fr; gap: 13px; align-items: center; }
.float-icon { font-size: 2rem; }
.hero-float strong { display: block; color: var(--deep); }
.hero-float span { display: block; color: var(--muted); margin-top: 3px; font-size: .95rem; }
.section { max-width: 1220px; margin: 0 auto; padding: 32px 20px; }
.section-head { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
h2 { margin: 0; font-size: clamp(1.8rem, 3vw, 3.05rem); letter-spacing: -.055em; color: var(--deep); }
.section-head p { margin: 0; color: var(--muted); max-width: 560px; line-height: 1.6; }
.grid { display: grid; gap: 15px; }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.card, .activity, .planner-shell, .day-panel, .tip-card, .gas-card { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: 0 16px 45px rgba(8,126,164,.09); }
.card { padding: 21px; }
.card .icon { width: 46px; height: 46px; border-radius: 17px; display: grid; place-items: center; background: rgba(8,126,164,.1); font-size: 1.35rem; margin-bottom: 13px; }
.card h3, .tip-card h3 { margin: 0 0 8px; letter-spacing: -.035em; color: var(--deep); }
.card p, .tip-card p { margin: 0; color: var(--muted); line-height: 1.55; }
.planner-shell { padding: 18px; }
.tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
.tab { border: 1px solid var(--line); background: rgba(255,255,255,.76); color: var(--ocean-dark); font-weight: 950; border-radius: 999px; padding: 10px 13px; cursor: pointer; transition: .18s ease; }
.tab:hover { transform: translateY(-1px); }
.tab.active { background: var(--ocean); color: white; box-shadow: 0 12px 28px rgba(8,126,164,.2); }
.day-panel { display: none; overflow: hidden; }
.day-panel.active { display: block; }
.day-title { padding: 22px; background: linear-gradient(135deg, var(--ocean-dark), var(--ocean)); color: white; display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
.day-title h3 { margin: 0; font-size: 1.8rem; letter-spacing: -.05em; }
.day-title p { margin: 6px 0 0; opacity: .9; }
.day-meta { display: flex; gap: 8px; flex-wrap: wrap; }
.day-meta span { display: inline-flex; padding: 7px 10px; border-radius: 999px; font-size: .82rem; font-weight: 950; background: rgba(255,255,255,.16); }
.timeline { padding: 18px; display: grid; gap: 12px; }
.timeblock { display: grid; grid-template-columns: 126px 1fr; gap: 14px; padding: 14px; border-radius: 20px; background: rgba(224,247,255,.54); border: 1px solid rgba(8,126,164,.09); }
.time { color: var(--ocean-dark); font-weight: 950; line-height: 1.25; }
.time small { display: block; color: var(--muted); font-weight: 800; margin-top: 4px; }
.timebody h4 { margin: 0 0 5px; font-size: 1.08rem; color: var(--deep); }
.timebody p { margin: 0; color: #244653; line-height: 1.55; }
.links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.links a { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 999px; text-decoration: none; font-weight: 900; font-size: .82rem; color: var(--ocean-dark); background: rgba(255,255,255,.82); border: 1px solid rgba(8,126,164,.14); }
.links a:hover { background: white; }
.ratings { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; }
.rating { font-size: .78rem; font-weight: 950; padding: 6px 9px; border-radius: 999px; }
.good { color: #166534; background: rgba(22,163,74,.14); }
.maybe { color: #854d0e; background: rgba(202,138,4,.16); }
.skip { color: #991b1b; background: rgba(220,38,38,.12); }
details.activity { padding: 0; overflow: hidden; }
details.activity summary { list-style: none; cursor: pointer; padding: 18px 20px; display: flex; justify-content: space-between; gap: 14px; align-items: center; }
details.activity summary::-webkit-details-marker { display: none; }
.activity h3 { margin: 0; color: var(--deep); letter-spacing: -.035em; }
.summary-note { color: var(--muted); font-size: .92rem; margin-top: 5px; }
.chev { color: var(--ocean-dark); font-weight: 950; transition: .15s ease; }
details[open] .chev { transform: rotate(180deg); }
.activity-content { padding: 0 20px 20px; color: var(--muted); line-height: 1.6; }
.facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 14px 0; }
.fact { background: rgba(224,247,255,.55); border: 1px solid rgba(8,126,164,.1); border-radius: 16px; padding: 12px; }
.fact strong { display: block; color: var(--ocean-dark); font-size: .82rem; margin-bottom: 4px; }
.fact span { color: var(--ink); font-weight: 750; }
.gas-card { padding: 22px; }
.gas-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; align-items: end; }
.gas-grid label { color: var(--ocean-dark); font-weight: 900; font-size: .88rem; display: grid; gap: 7px; }
.gas-grid input[type="number"] { width: 100%; border: 1px solid var(--line); border-radius: 14px; padding: 12px; font: inherit; background: rgba(255,255,255,.88); color: var(--deep); }
.checkbox-line { display: flex !important; align-items: center; gap: 9px !important; background: rgba(224,247,255,.55); border: 1px solid rgba(8,126,164,.1); padding: 12px; border-radius: 14px; min-height: 48px; }
.checkbox-line input { accent-color: var(--ocean); transform: scale(1.15); }
.gas-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px; }
.gas-results div { background: linear-gradient(135deg, rgba(8,126,164,.1), rgba(251,191,36,.14)); border: 1px solid rgba(8,126,164,.1); border-radius: 18px; padding: 16px; }
.gas-results span { display: block; color: var(--muted); font-weight: 850; font-size: .88rem; }
.gas-results strong { display: block; color: var(--deep); font-size: 1.55rem; margin-top: 5px; letter-spacing: -.04em; }
.tip-card { padding: 22px; }
.tip-card ul { margin: 10px 0 0; padding-left: 20px; color: var(--muted); line-height: 1.75; }
.checklist label { display: flex; gap: 10px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid rgba(8,126,164,.09); color: var(--muted); line-height: 1.4; }
.checklist label:last-child { border-bottom: 0; }
.checklist input { margin-top: 2px; transform: scale(1.18); accent-color: var(--ocean); }
.source-note { font-size: .86rem; color: var(--muted); line-height: 1.55; margin-top: 12px; }
.footer { text-align: center; color: var(--muted); padding: 36px 20px 62px; }
.footer strong { color: var(--ocean-dark); }
@media (max-width: 950px) {
  .hero { grid-template-columns: 1fr; padding-top: 38px; }
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .facts { grid-template-columns: repeat(2, 1fr); }
  .gas-grid, .gas-results { grid-template-columns: 1fr; }
  .topbar-inner { align-items: stretch; flex-direction: column; }
  .brand { justify-content: space-between; }
  .menu-btn { display: block; position: absolute; top: 13px; right: 20px; }
  .navlinks { display: none; justify-content: flex-start; }
  .navlinks.open { display: flex; }
}
@media (max-width: 620px) {
  .hero-card { min-height: 350px; }
  .hero-float { grid-template-columns: 1fr; }
  .grid-4 { grid-template-columns: 1fr; }
  .timeblock { grid-template-columns: 1fr; }
  .facts { grid-template-columns: 1fr; }
  .navlinks a { font-size: .8rem; padding: 7px 8px; }
  .day-title h3 { font-size: 1.45rem; }
}
@media print {
  .topbar, .hero-actions, .tabs, .links, .chev, .menu-btn { display: none !important; }
  body { background: white; }
  .hero, .section { max-width: 100%; padding: 16px; }
  .hero { display: block; }
  .hero-card { min-height: auto; box-shadow: none; background: none; border: 1px solid #ddd; }
  .hero-float { position: static; }
  .day-panel { display: block !important; break-inside: avoid; margin-bottom: 16px; }
  .card, .activity, .planner-shell, .day-panel, .tip-card, .gas-card { box-shadow: none; }
}
