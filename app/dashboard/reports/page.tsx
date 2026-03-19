'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Report {
  id: string
  country: 'DE' | 'FR' | 'BE'
  total_weight: number
  entries: number
  last_updated: string
  status: 'on-track' | 'urgent' | 'filed'
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)

  const reports: Report[] = [
    {
      id: 'de-q1',
      country: 'DE',
      total_weight: 1540,
      entries: 24,
      last_updated: '2h ago',
      status: 'on-track',
    },
    {
      id: 'fr-q1',
      country: 'FR',
      total_weight: 892,
      entries: 18,
      last_updated: '1d ago',
      status: 'on-track',
    },
    {
      id: 'be-q1',
      country: 'BE',
      total_weight: 348,
      entries: 12,
      last_updated: '3d ago',
      status: 'urgent',
    },
  ]

  async function exportReport(country: string, format: 'csv' | 'pdf') {
    setExporting(`${country}-${format}`)
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, format }),
      })

      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = res.headers.get('content-disposition')?.split('filename=')[1]?.replaceAll('"', '') || `report-${country}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
      alert('Failed to export report')
    } finally {
      setExporting(null)
    }
  }

  const statusColor = (s: string) => s === 'on-track' ? '#3d8f6a' : s === 'urgent' ? '#b94040' : '#4a7ab5'
  const statusLabel = (s: string) => s === 'on-track' ? 'On Track' : s === 'urgent' ? 'Urgent' : 'Filed'

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

        .report-grid { display: grid; gap: 16px; flex: 1; min-height: 0; overflow-y: auto; }
        .rcard {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.3);
          border-radius: 14px; padding: 20px; display: grid;
          grid-template-columns: 1fr auto; gap: 16px; align-items: start;
        }
        .rcard-left { display: flex; flex-direction: column; gap: 12px; }
        .rcard-header { display: flex; align-items: center; gap: 12px; }
        .country-badge {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 8px;
          background: #e0dcd2; color: #1e1810; font-weight: 700; font-size: 0.85rem;
        }
        .rcard-title { font-size: 0.95rem; font-weight: 700; color: #1e1810; }
        .rcard-info { display: flex; gap: 20px; font-size: 0.85rem; }
        .rcard-stat { color: #7a6a55; }
        .rcard-stat strong { color: #1e1810; font-weight: 600; }
        .rcard-status { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 500; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .rcard-actions { display: flex; gap: 8px; flex-direction: column; }
        .rbtn {
          padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 500;
          border: none; cursor: pointer; white-space: nowrap; transition: all 0.15s;
        }
        .rbtn-primary {
          background: #1e1810; color: #f5f0e8;
        }
        .rbtn-primary:hover { background: #3a2e1e; }
        .rbtn-secondary {
          background: rgba(180,160,130,0.15); color: #4a3f2f; border: 1px solid rgba(180,160,130,0.3);
        }
        .rbtn-secondary:hover { background: rgba(180,160,130,0.28); }
        .rbtn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="pg">
        <div>
          <div className="pg-title">Reports</div>
          <div className="pg-sub">View and export your EPR compliance reports</div>
        </div>

        <div className="report-grid">
          {reports.map((report) => (
            <div key={report.id} className="rcard">
              <div className="rcard-left">
                <div className="rcard-header">
                  <div className="country-badge">🇩🇪 {report.country === 'DE' ? 'DE' : report.country === 'FR' ? 'FR' : 'BE'}</div>
                  <div>
                    <div className="rcard-title">
                      {report.country === 'DE' ? 'Germany LUCID' : report.country === 'FR' ? 'France CITEO' : 'Belgium Fost Plus'}
                    </div>
                  </div>
                </div>
                <div className="rcard-info">
                  <div className="rcard-stat"><strong>{report.total_weight.toLocaleString()}</strong> kg packaging</div>
                  <div className="rcard-stat"><strong>{report.entries}</strong> entries</div>
                  <div className="rcard-stat">Updated {report.last_updated}</div>
                </div>
                <div className="rcard-status">
                  <div className="status-dot" style={{ background: statusColor(report.status) }} />
                  {statusLabel(report.status)}
                </div>
              </div>

              <div className="rcard-actions">
                <button
                  className="rbtn rbtn-primary"
                  onClick={() => exportReport(report.country, 'csv')}
                  disabled={exporting === `${report.country}-csv`}
                >
                  {exporting === `${report.country}-csv` ? '⊙' : '↓'} CSV
                </button>
                <button
                  className="rbtn rbtn-secondary"
                  onClick={() => exportReport(report.country, 'pdf')}
                  disabled={exporting === `${report.country}-pdf`}
                >
                  {exporting === `${report.country}-pdf` ? '⊙' : '↓'} PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
