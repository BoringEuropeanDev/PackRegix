export default function DashboardPage() {
  const stats = [
    { label: 'Total Packaging', value: '1,540 kg', sub: 'Q1 2026' },
    { label: 'Plastic', value: '892 kg', sub: '57% of total' },
    { label: 'Paper', value: '200 kg', sub: '13% of total' },
    { label: 'Filing Status', value: 'On Track', sub: 'DE · FR · BE' },
  ]
  return (
    <>
      <style>{`
        ${sharedStyles}
        .grid4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 28px; }
        @media(max-width:900px){ .grid4 { grid-template-columns: repeat(2,1fr); } }
        .alert { background: rgba(61,143,106,0.1); border: 1px solid rgba(61,143,106,0.25); border-radius: 12px; padding: 16px 20px; color: #2a6048; font-size: 0.9rem; line-height: 1.6; }
        .alert strong { font-weight: 600; }
      `}</style>
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-title">Overview</div>
            <div className="pg-sub">Q1 2026 · Germany, France, Belgium</div>
          </div>
        </div>
        <div className="grid4">
          {stats.map(s => (
            <div key={s.label} className="card">
              <div className="card-label">{s.label}</div>
              <div className="card-val">{s.value}</div>
              <div className="card-sub">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="alert">
          <strong>✓ All obligations on track</strong> for DE and FR. Next filing deadline: <strong>June 30, 2026</strong>.
        </div>
      </div>
    </>
  )
}

const sharedStyles = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ece4; }
  .pg { padding: 32px 36px; max-width: 1100px; }
  .pg-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
  .pg-title { font-size: 1.4rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; }
  .pg-sub { font-size: 0.85rem; color: #9a8a72; margin-top: 3px; }
  .card { background: #faf7f2; border: 1px solid rgba(180,160,130,0.25); border-radius: 14px; padding: 20px; }
  .card-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: #9a8a72; margin-bottom: 10px; }
  .card-val { font-size: 1.6rem; font-weight: 800; color: #1e1810; line-height: 1; margin-bottom: 6px; }
  .card-sub { font-size: 0.8rem; color: #b0a090; }
  .action-btn { background: #1e1810; color: #f5f0e8; font-size: 0.875rem; font-weight: 600; padding: 10px 20px; border: none; border-radius: 9px; cursor: pointer; transition: background 0.15s; white-space: nowrap; }
  .action-btn:hover { background: #3a2e1e; }
  .ghost-btn { background: #faf7f2; color: #4a3f2f; font-size: 0.875rem; font-weight: 500; padding: 10px 20px; border: 1px solid rgba(180,160,130,0.35); border-radius: 9px; cursor: pointer; transition: background 0.15s; white-space: nowrap; }
  .ghost-btn:hover { background: #f0ece4; }
`
