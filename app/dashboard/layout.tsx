import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .layout { display: flex; height: 100vh; overflow: hidden; }
        .sidebar {
          width: 220px; min-width: 220px; height: 100vh;
          background: #1a2332; display: flex; flex-direction: column;
          padding: 28px 16px 24px; overflow: hidden;
        }
        .sidebar-logo {
          font-size: 1rem; font-weight: 700; color: #f0ece4;
          letter-spacing: -0.01em; margin-bottom: 32px; padding: 0 8px;
        }
        .nav-top { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .nav-bottom { display: flex; flex-direction: column; gap: 2px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .nav-link {
          display: block; padding: 10px 12px; border-radius: 9px;
          color: #6a7d94; font-size: 0.875rem; font-weight: 500;
          text-decoration: none; transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover { background: rgba(255,255,255,0.06); color: #f0ece4; }
        .main { flex: 1; height: 100vh; overflow: hidden; background: #f0ece4; }
      `}</style>
      <div className="layout">
        <div className="sidebar">
          <div className="sidebar-logo">PackRegix</div>
          <div className="nav-top">
            <Link href="/dashboard" className="nav-link">Overview</Link>
            <Link href="/dashboard/packaging" className="nav-link">Packaging</Link>
            <Link href="/dashboard/reports" className="nav-link">Reports</Link>
            <Link href="/dashboard/calendar" className="nav-link">Calendar</Link>
          </div>
          <div className="nav-bottom">
            <Link href="/dashboard/account" className="nav-link">Account</Link>
          </div>
        </div>
        <div className="main">{children}</div>
      </div>
    </>
  )
}
