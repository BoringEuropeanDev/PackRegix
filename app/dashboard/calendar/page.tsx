const deadlines = [
  { date: 'Apr 10, 2026', task: 'FR CITEO declaration', country: 'FR', days: 22, status: 'soon' },
  { date: 'Jun 30, 2026', task: 'DE quarterly packaging report', country: 'DE', days: 103, status: 'upcoming' },
  { date: 'Jul 15, 2026', task: 'BE annual packaging audit prep', country: 'BE', days: 118, status: 'upcoming' },
  { date: 'Sep 30, 2026', task: 'DE LUCID annual report', country: 'DE', days: 195, status: 'future' },
  { date: 'Dec 31, 2026', task: 'FR CITEO year-end summary', country: 'FR', days: 287, status: 'future' },
]
const flag: Record<string,string> = { DE: '🇩🇪', FR: '🇫🇷', BE: '🇧🇪' }

export default function CalendarPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #__next { height: 100%; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ece4; }
        .pg { height: 100vh; display: flex; flex-direction: column; padding: 28px 32px; gap: 18px; overflow: hidden; }
        .pg-title { font-size: 1.3rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; }
        .pg-sub { font-size: 0.82rem; color: #9a8a72; margin-top: 2px; }
        .list { display: flex; flex-direction: column; gap: 10px; flex: 1; justify-content: center; }
        .dl {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.25);
          border-radius: 13px; padding: 16px 20px;
          display: grid; grid-template-columns: 110px 1.5rem 1fr auto auto;
          align-items: center; gap: 14px;
        }
        .dl-date { font-size: 0.8rem; font-weight: 600; color: #9a8a72; }
        .dl-flag { font-size: 1.1rem; }
        .dl-task { font-size: 0.92rem; color: #1e1810; font-weight: 500; }
        .dl-days { font-size: 0.78rem; color: #b0a090; white-space: nowrap; }
        .badge { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; padding: 4px 10px; border-radius: 100px; white-space: nowrap; }
        .badge-soon     { background: rgba(212,162,54,0.12); color: #8a6010; border: 1px solid rgba(212,162,54,0.25); }
        .badge-upcoming { background: rgba(74,122,181,0.1); color: #2d5fa6; border: 1px solid rgba(74,122,181,0.2); }
        .badge-future   { background: rgba(180,160,130,0.1); color: #9a8a72; border: 1px solid rgba(180,160,130,0.2); }
      `}</style>
      <div className="pg">
        <div>
          <div className="pg-title">Filing Calendar</div>
          <div className="pg-sub">All upcoming EPR deadlines across DE, FR, and BE</div>
        </div>
        <div className="list">
          {deadlines.map(d=>(
            <div key={d.date+d.task} className="dl">
              <div className="dl-date">{d.date}</div>
              <div className="dl-flag">{flag[d.country]}</div>
              <div className="dl-task">{d.task}</div>
              <div className="dl-days">in {d.days}d</div>
              <div className={`badge badge-${d.status}`}>{d.status}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
