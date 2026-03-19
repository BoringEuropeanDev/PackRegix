const reports = [
  { title: 'DE LUCID Q1 2026', desc: 'Bundled German-format export ready for regulator upload.', country: 'DE', ready: true },
  { title: 'FR CITEO Annual', desc: 'Annual recap with material totals and legal references.', country: 'FR', ready: true },
  { title: 'BE Fost Plus Q2', desc: 'Belgium packaging declaration — next period not yet open.', country: 'BE', ready: false },
]
const flag: Record<string,string> = { DE: '🇩🇪', FR: '🇫🇷', BE: '🇧🇪' }

export default function ReportsPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #__next { height: 100%; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ece4; }
        .pg { height: 100vh; display: flex; flex-direction: column; padding: 28px 32px; gap: 18px; overflow: hidden; }
        .pg-title { font-size: 1.3rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; }
        .pg-sub { font-size: 0.82rem; color: #9a8a72; margin-top: 2px; }
        .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; flex: 1; }
        .rcard { background: #faf7f2; border: 1px solid rgba(180,160,130,0.25); border-radius: 14px; padding: 24px; display: flex; flex-direction: column; gap: 12px; }
        .rcard-top { display: flex; justify-content: space-between; align-items: center; }
        .rcard-flag { font-size: 1.5rem; }
        .badge { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; padding: 4px 10px; border-radius: 100px; }
        .badge-ready   { background: rgba(61,143,106,0.1); color: #2a6048; border: 1px solid rgba(61,143,106,0.2); }
        .badge-pending { background: rgba(180,160,130,0.1); color: #9a8a72; border: 1px solid rgba(180,160,130,0.2); }
        .rcard-title { font-size: 1.05rem; font-weight: 700; color: #1e1810; }
        .rcard-desc { font-size: 0.85rem; color: #7a6a55; line-height: 1.65; flex: 1; }
        .meta { display: flex; flex-direction: column; gap: 7px; }
        .meta-row { display: flex; justify-content: space-between; font-size: 0.8rem; color: #9a8a72; }
        .meta-row span { color: #4a3f2f; font-weight: 500; }
        .dl-btn { width: 100%; padding: 11px; border-radius: 9px; font-size: 0.88rem; font-weight: 600; cursor: pointer; border: none; transition: background 0.15s; }
        .dl-btn.active { background: #1e1810; color: #f5f0e8; }
        .dl-btn.active:hover { background: #3a2e1e; }
        .dl-btn.inactive { background: rgba(180,160,130,0.15); color: #b0a090; cursor: not-allowed; border: 1px solid rgba(180,160,130,0.2); }
      `}</style>
      <div className="pg">
        <div>
          <div className="pg-title">Reports</div>
          <div className="pg-sub">Generated EPR compliance reports ready to download</div>
        </div>
        <div className="grid">
          {reports.map(r=>(
            <div key={r.title} className="rcard">
              <div className="rcard-top">
                <div className="rcard-flag">{flag[r.country]}</div>
                <div className={`badge badge-${r.ready?'ready':'pending'}`}>{r.ready?'Ready':'Pending'}</div>
              </div>
              <div className="rcard-title">{r.title}</div>
              <div className="rcard-desc">{r.desc}</div>
              <div className="meta">
                <div className="meta-row">Format <span>{r.country==='DE'?'LUCID XML':r.country==='FR'?'CITEO CSV':'Fost Plus PDF'}</span></div>
                <div className="meta-row">Period <span>Q1 2026</span></div>
                <div className="meta-row">Generated <span>{r.ready?'Mar 19, 2026':'—'}</span></div>
              </div>
              <button className={`dl-btn ${r.ready?'active':'inactive'}`} disabled={!r.ready}>
                {r.ready?'Download report →':'Not yet available'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
