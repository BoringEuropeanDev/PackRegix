export default function DashboardPage() {
  const stats = [
    { label: 'Total Packaging', value: '1,540 kg', sub: 'Q1 2026' },
    { label: 'Plastic', value: '892 kg', sub: '57% of total' },
    { label: 'Paper', value: '200 kg', sub: '13% of total' },
    { label: 'Filing Status', value: 'On Track', sub: 'DE · FR · BE' },
  ]
  const activity = [
    { text: 'DE LUCID Q1 report generated', time: '2h ago', dot: 'g' },
    { text: 'FR CITEO data imported', time: '1d ago', dot: 'g' },
    { text: 'BE Fost Plus deadline in 38 days', time: '', dot: 'y' },
    { text: 'Account created', time: 'Mar 19', dot: 'b' },
  ]
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #__next { height: 100%; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ece4; }
        .pg { height: 100vh; display: flex; flex-direction: column; padding: 28px 32px; gap: 20px; overflow: hidden; }
        .pg-title { font-size: 1.3rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; }
        .pg-sub { font-size: 0.82rem; color: #9a8a72; margin-top: 2px; }
        .row4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
        .card { background: #faf7f2; border: 1px solid rgba(180,160,130,0.25); border-radius: 13px; padding: 18px; }
        .card-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.07em; color: #9a8a72; margin-bottom: 8px; }
        .card-val { font-size: 1.55rem; font-weight: 800; color: #1e1810; line-height: 1; }
        .card-sub { font-size: 0.78rem; color: #b0a090; margin-top: 5px; }
        .bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; flex: 1; min-height: 0; }
        .panel { background: #faf7f2; border: 1px solid rgba(180,160,130,0.25); border-radius: 13px; padding: 18px; display: flex; flex-direction: column; overflow: hidden; }
        .panel-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: #9a8a72; margin-bottom: 14px; }
        .alert { background: rgba(61,143,106,0.09); border: 1px solid rgba(61,143,106,0.2); border-radius: 10px; padding: 13px 16px; color: #2a6048; font-size: 0.875rem; line-height: 1.6; }
        .bar-row { display: flex; flex-direction: column; gap: 10px; flex: 1; justify-content: center; }
        .bar-item { display: flex; flex-direction: column; gap: 5px; }
        .bar-meta { display: flex; justify-content: space-between; font-size: 0.8rem; color: #4a3f2f; }
        .bar-track { height: 7px; background: rgba(180,160,130,0.2); border-radius: 100px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 100px; background: #1e1810; }
        .activity-list { display: flex; flex-direction: column; gap: 12px; flex: 1; justify-content: center; }
        .act-item { display: flex; align-items: center; gap: 10px; }
        .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .dot.g { background: #3d8f6a; }
        .dot.y { background: #d4a236; }
        .dot.b { background: #4a7ab5; }
        .act-text { font-size: 0.85rem; color: #1e1810; flex: 1; }
        .act-time { font-size: 0.75rem; color: #b0a090; }
      `}</style>
      <div className="pg">
        <div>
          <div className="pg-title">Overview</div>
          <div className="pg-sub">Q1 2026 · Germany, France, Belgium</div>
        </div>
        <div className="row4">
          {stats.map(s => (
            <div key={s.label} className="card">
              <div className="card-label">{s.label}</div>
              <div className="card-val">{s.value}</div>
              <div className="card-sub">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="bottom">
          <div className="panel">
            <div className="panel-title">Material Breakdown</div>
            <div className="bar-row">
              {[['Plastic','892 kg',58],['Paper','200 kg',13],['Glass','160 kg',10],['Metal','288 kg',19]].map(([m,kg,pct])=>(
                <div key={m as string} className="bar-item">
                  <div className="bar-meta"><span>{m as string}</span><span>{kg as string}</span></div>
                  <div className="bar-track"><div className="bar-fill" style={{width:`${pct}%`}}/></div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">Recent Activity</div>
            <div className="activity-list">
              {activity.map((a,i) => (
                <div key={i} className="act-item">
                  <div className={`dot ${a.dot}`}/>
                  <div className="act-text">{a.text}</div>
                  {a.time && <div className="act-time">{a.time}</div>}
                </div>
              ))}
            </div>
            <div className="alert" style={{marginTop:'14px'}}>
              ✓ All obligations on track. Next deadline: <strong>June 30</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
