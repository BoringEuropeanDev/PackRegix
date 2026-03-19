const reports = [
  { title: 'DE LUCID Q1 2026', desc: 'Bundled German-format export ready for regulator upload.', country: 'DE', ready: true },
  { title: 'FR CITEO Annual', desc: 'Annual recap with material totals and legal references.', country: 'FR', ready: true },
  { title: 'BE Fost Plus Q2', desc: 'Belgium packaging declaration — next period.', country: 'BE', ready: false },
]
const flag: Record<string,string> = { DE: '🇩🇪', FR: '🇫🇷', BE: '🇧🇪' }

export default function ReportsPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ece4; }
        .pg { padding: 32px 36px; max-width: 900px; }
        .pg-title { font-size: 1.4rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; margin-bottom: 6px; }
        .pg-sub { font-size: 0.85rem; color: #9a8a72; margin-bottom: 28px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .rcard { background: #faf7f2; border: 1px solid rgba(180,160,130,0.25); border-radius: 14px; padding: 22px; display: flex; flex-direction: column; gap: 10px; }
        .rcard-top { display: flex; justify-content: space-between; align-items: center; }
        .rcard-flag { font-size: 1.3rem; }
        .rcard-badge { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; padding: 4px 10px; border-radius: 100px; }
        .badge-ready { background: rgba(61,143,106,0.1); color: #2a6048; border: 1px solid rgba(61,143,106,0.2); }
        .badge-pending { background: rgba(180,160,130,0.12); color: #9a8a72; border: 1px solid rgba(180,160,130,0.2); }
        .rcard-title { font-size: 1rem; font-weight: 700; color: #1e1810; }
        .rcard-desc { font-size: 0.85rem; color: #7a6a55; line-height: 1.6; flex: 1; }
        .dl-btn { background: #1e1810; color: #f5f0e8; font-size: 0.85rem; font-weight: 600; padding: 10px 16px; border: none; border-radius: 9px; cursor: pointer; transition: background 0.15s; margin-top: 4px; }
        .dl-btn:hover { background: #3a2e1e; }
        .dl-btn:disabled { background: rgba(180,160,130,0.3); color: #b0a090; cursor: not-allowed; }
      `}</style>
      <div className="pg">
        <div className="pg-title">Reports</div>
        <div className="pg-sub">Generated EPR compliance reports ready to download</div>
        <div className="grid">
          {reports.map(r => (
            <div key={r.title} className="rcard">
              <div className="rcard-top">
                <div className="rcard-flag">{flag[r.country]}</div>
                <div className={`rcard-badge ${r.ready ? 'badge-ready' : 'badge-pending'}`}>
                  {r.ready ? 'Ready' : 'Pending'}
                </div>
              </div>
              <div className="rcard-title">{r.title}</div>
              <div className="rcard-desc">{r.desc}</div>
              <button className="dl-btn" disabled={!r.ready}>
                {r.ready ? 'Download PDF' : 'Not yet available'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
