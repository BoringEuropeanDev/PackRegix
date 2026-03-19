const deadlines = [
  { date: '2026-04-10', task: 'FR CITEO declaration', country: 'FR', status: 'upcoming' },
  { date: '2026-06-30', task: 'DE quarterly packaging report', country: 'DE', status: 'upcoming' },
  { date: '2026-07-15', task: 'BE annual packaging audit prep', country: 'BE', status: 'upcoming' },
  { date: '2026-09-30', task: 'DE LUCID annual report', country: 'DE', status: 'future' },
]

const flag: Record<string,string> = { DE: '🇩🇪', FR: '🇫🇷', BE: '🇧🇪' }

export default function CalendarPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ece4; }
        .pg { padding: 32px 36px; max-width: 800px; }
        .pg-title { font-size: 1.4rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; margin-bottom: 6px; }
        .pg-sub { font-size: 0.85rem; color: #9a8a72; margin-bottom: 28px; }
        .timeline { display: flex; flex-direction: column; gap: 12px; }
        .dl-card {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.25);
          border-radius: 14px; padding: 18px 22px;
          display: flex; align-items: center; gap: 18px;
        }
        .dl-date { font-size: 0.78rem; font-weight: 600; color: #9a8a72; min-width: 88px; letter-spacing: 0.03em; }
        .dl-flag { font-size: 1.2rem; }
        .dl-task { font-size: 0.95rem; color: #1e1810; font-weight: 500; flex: 1; }
        .dl-badge {
          font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em;
          padding: 4px 10px; border-radius: 100px;
        }
        .badge-upcoming { background: rgba(74,122,181,0.12); color: #2d5fa6; border: 1px solid rgba(74,122,181,0.2); }
        .badge-future { background: rgba(180,160,130,0.12); color: #9a8a72; border: 1px solid rgba(180,160,130,0.2); }
      `}</style>
      <div className="pg">
        <div className="pg-title">Filing Calendar</div>
        <div className="pg-sub">Upcoming EPR deadlines across all countries</div>
        <div className="timeline">
          {deadlines.map(d => (
            <div key={d.date+d.task} className="dl-card">
              <div className="dl-date">{d.date}</div>
              <div className="dl-flag">{flag[d.country]}</div>
              <div className="dl-task">{d.task}</div>
              <div className={`dl-badge badge-${d.status}`}>{d.status}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
