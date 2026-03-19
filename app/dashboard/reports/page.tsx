const reports = [
  { title: 'DE LUCID Q1 2026', desc: 'Bundled German-format export ready for regulator upload.', country: 'DE', ready: true, format: 'LUCID XML' },
  { title: 'FR CITEO Annual',  desc: 'Annual recap with material totals and legal references.', country: 'FR', ready: true, format: 'CITEO CSV' },
  { title: 'BE Fost Plus Q2',  desc: 'Belgium packaging declaration — next period not yet open.', country: 'BE', ready: false, format: 'Fost Plus PDF' },
]
const flag: Record<string,string> = { DE: '🇩🇪', FR: '🇫🇷', BE: '🇧🇪' }

export default function ReportsPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .pg {
          height: 100vh; display: flex; flex-direction: column;
          padding: 32px 36px; gap: 24px; overflow: hidden;
          background: #f0ece4;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .pg-title { font-size: 1.3rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; }
        .pg-sub { font-size: 0.82rem; color: #9a8a72; margin-top: 3px; }
        .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; flex: 1; min-height: 0; }
        .rcard {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.3);
          border-radius: 16px; padding: 24px;
          display: flex; flex-direction: column; gap: 0;
        }
        .rcard-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .rflag { font-size: 1.6rem; line-height: 1; }
        .badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 100px; }
        .b-ready   { background: rgba(61,143,106,0.1); color: #2a6048; border: 1px solid rgba(61,143,106,0.25); }
        .b-pending { background: rgba(180,160,130,0.15); color: #9a8a72; border: 1px solid rgba(180,160,130,0.3); }
        .rtitle { font-size: 1.1rem; font-weight: 700; color: #1e1810; margin-bottom: 10px; }
        .rdesc  { font-size: 0.84rem; color: #7a6a55; line-height: 1.65; flex: 1; margin-bottom: 20px; }
        .rmeta  { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .rmeta-row { display: flex; justify-content: space-between; }
        .rmeta-key { font-size: 0.78rem; color: #b0a090; }
        .rmeta-val { font-size: 0.78rem; color: #4a3f2f; font-weight: 600; }
        .rbtn {
          width: 100%; padding: 12px; border-radius: 10px;
          font-size: 0.88rem; font-weight: 600; cursor: pointer; border: none;
          transition: background 0.15s;
        }
        .rbtn-active { background: #1e1810; color: #f5f0e8; }
        .rbtn-active:hover { background: #3a2e1e; }
        .rbtn-off { background: rgba(180,160,130,0.15); color: #b0a090; cursor: not-allowed; border: 1px solid rgba(180,160,130,0.2); }
      `}</style>
      <div className="pg">
        <div>
          <div className="pg-title">Reports</div>
          <div className="pg-sub">Generated EPR compliance reports ready to download</div>
        </div>
        <div className="grid">
          {reports.map(r => (
            <div key={r.title} className="rcard">
              <div className="rcard-top">
                <div className="rflag">{flag[r.country]}</div>
                <div className={`badge ${r.ready ? 'b-ready' : 'b-pending'}`}>{r.ready ? 'Ready' : 'Pending'}</div>
              </div>
              <div className="rtitle">{r.title}</div>
              <div className="rdesc">{r.desc}</div>
              <div className="rmeta">
                <div className="rmeta-row"><span className="rmeta-key">Format</span><span className="rmeta-val">{r.format}</span></div>
                <div className="rmeta-row"><span className="rmeta-key">Period</span><span className="rmeta-val">Q1 2026</span></div>
                <div className="rmeta-row"><span className="rmeta-key">Generated</span><span className="rmeta-val">{r.ready ? 'Mar 19, 2026' : '—'}</span></div>
              </div>
              <button className={`rbtn ${r.ready ? 'rbtn-active' : 'rbtn-off'}`} disabled={!r.ready}>
                {r.ready ? 'Download report →' : 'Not yet available'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
