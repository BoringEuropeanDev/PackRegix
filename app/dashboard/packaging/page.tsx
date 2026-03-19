'use client'
import { useState, useEffect } from 'react'

const MATERIAL_LIST = ['plastic', 'paper', 'glass', 'metal', 'wood', 'mixed']

const COUNTRY_LABELS: Record<string, string> = {
  DE: '🇩🇪 Germany',
  FR: '🇫🇷 France',
  BE: '🇧🇪 Belgium',
}

type MaterialRow = { kg: string; units: string }
type MaterialMap = Record<string, MaterialRow>

export default function PackagingPage() {
  const [country, setCountry] = useState('DE')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [materials, setMaterials] = useState<MaterialMap>({
    plastic: { kg: '', units: '' },
    paper: { kg: '', units: '' },
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [entries, setEntries] = useState<any[]>([])
  const [loadingEntries, setLoadingEntries] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    setLoadingEntries(true)
    try {
      const res = await fetch('/api/packaging/list')
      const data = await res.json()
      setEntries(Array.isArray(data) ? data : [])
    } catch {
      setEntries([])
    } finally {
      setLoadingEntries(false)
    }
  }

  function setMaterialField(mat: string, field: 'kg' | 'units', value: string) {
    setMaterials(prev => ({ ...prev, [mat]: { ...prev[mat], [field]: value } }))
  }

  function addMaterial(mat: string) {
    if (materials[mat]) return
    setMaterials(prev => ({ ...prev, [mat]: { kg: '', units: '' } }))
  }

  function removeMaterial(mat: string) {
    setMaterials(prev => {
      const next = { ...prev }
      delete next[mat]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Build JSONB payload — only include materials that have kg filled
    const builtMaterials: Record<string, { kg: number; units?: number }> = {}
    for (const [mat, vals] of Object.entries(materials)) {
      if (vals.kg && parseFloat(vals.kg) > 0) {
        builtMaterials[mat] = {
          kg: parseFloat(vals.kg),
          ...(vals.units ? { units: parseInt(vals.units) } : {}),
        }
      }
    }

    if (!Object.keys(builtMaterials).length) {
      setError('Add at least one material with a weight')
      return
    }
    if (!periodStart || !periodEnd) {
      setError('Please set both period start and end dates')
      return
    }
    if (new Date(periodEnd) < new Date(periodStart)) {
      setError('Period end must be after period start')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/packaging/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          period_start: periodStart,
          period_end: periodEnd,
          materials: builtMaterials,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      // Reset form
      setMaterials({ plastic: { kg: '', units: '' }, paper: { kg: '', units: '' } })
      setPeriodStart('')
      setPeriodEnd('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      await fetchEntries()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function totalKg(entry: any): number {
    return Object.values(entry.materials || {}).reduce((sum: number, v: any) => sum + (v.kg || 0), 0)
  }

  const activeMats = Object.keys(materials)
  const remainingMats = MATERIAL_LIST.filter(m => !materials[m])

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

        .grid-2 {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 20px; flex: 1; min-height: 0;
        }

        /* Form card */
        .form-card {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.28);
          border-radius: 16px; padding: 24px 28px;
          display: flex; flex-direction: column; gap: 16px;
          overflow-y: auto;
        }
        .card-title { font-size: 0.95rem; font-weight: 700; color: #1e1810; }
        .card-sub { font-size: 0.8rem; color: #9a8a72; margin-top: 2px; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: #9a8a72; }
        .field input, .field select {
          background: #f0ece4; border: 1px solid rgba(180,160,130,0.35);
          border-radius: 9px; padding: 10px 13px; font-size: 0.875rem;
          color: #1e1810; outline: none; transition: border-color 0.15s; width: 100%;
          font-family: inherit;
        }
        .field input:focus, .field select:focus { border-color: #4a7ab5; }
        .field input::placeholder { color: #c0b09a; }

        .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* Materials section */
        .mats-label {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.07em; color: #9a8a72; margin-bottom: 8px;
        }
        .mat-row {
          display: grid; grid-template-columns: 100px 1fr 1fr auto;
          gap: 8px; align-items: center; margin-bottom: 8px;
        }
        .mat-name {
          font-size: 0.875rem; font-weight: 600; color: #4a3f2f;
          text-transform: capitalize;
        }
        .mat-input {
          background: #f0ece4; border: 1px solid rgba(180,160,130,0.35);
          border-radius: 8px; padding: 9px 12px; font-size: 0.85rem;
          color: #1e1810; outline: none; font-family: inherit; width: 100%;
          transition: border-color 0.15s;
        }
        .mat-input:focus { border-color: #4a7ab5; }
        .mat-input::placeholder { color: #c0b09a; }
        .remove-btn {
          background: none; border: none; color: #c0b09a; cursor: pointer;
          font-size: 16px; line-height: 1; padding: 4px;
          transition: color 0.15s; flex-shrink: 0;
        }
        .remove-btn:hover { color: #b94040; }

        .add-mat-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .add-mat-chip {
          padding: 5px 12px; border-radius: 100px;
          border: 1px dashed rgba(180,160,130,0.5); background: transparent;
          color: #9a8a72; font-size: 0.78rem; cursor: pointer;
          transition: all 0.15s; font-family: inherit; text-transform: capitalize;
        }
        .add-mat-chip:hover { background: rgba(180,160,130,0.15); color: #4a3f2f; border-color: rgba(180,160,130,0.8); }

        .form-error { color: #b94040; font-size: 0.82rem; }
        .save-row { display: flex; align-items: center; gap: 12px; }
        .save-btn {
          background: #1e1810; color: #f5f0e8; font-size: 0.9rem; font-weight: 600;
          padding: 11px 26px; border: none; border-radius: 9px; cursor: pointer;
          transition: background 0.15s;
        }
        .save-btn:hover:not(:disabled) { background: #3a2e1e; }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .saved-msg { font-size: 0.85rem; color: #3d8f6a; font-weight: 500; }

        /* List card */
        .list-card {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.28);
          border-radius: 16px; padding: 24px 28px;
          display: flex; flex-direction: column; gap: 14px;
          overflow: hidden;
        }
        .entries-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }

        .entry {
          background: #f5f2ed; border-radius: 10px;
          border-left: 3px solid #4a7ab5;
          padding: 12px 14px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .entry-header { display: flex; justify-content: space-between; align-items: center; }
        .entry-country { font-size: 0.8rem; font-weight: 700; color: #1e1810; }
        .entry-total { font-size: 0.95rem; font-weight: 700; color: #1e1810; }
        .entry-period { font-size: 0.75rem; color: #9a8a72; }
        .entry-mats { display: flex; flex-wrap: wrap; gap: 6px; }
        .entry-mat-tag {
          padding: 3px 10px; border-radius: 100px;
          background: rgba(180,160,130,0.18); border: 1px solid rgba(180,160,130,0.3);
          font-size: 0.75rem; color: #4a3f2f; text-transform: capitalize;
        }
        .empty-state { color: #9a8a72; font-size: 0.85rem; text-align: center; padding: 30px 0; }
      `}</style>

      <div className="pg">
        <div>
          <div className="pg-title">Packaging Data</div>
          <div className="pg-sub">Log your packaging entries per country and period</div>
        </div>

        <div className="grid-2">

          {/* ── ADD ENTRY FORM ── */}
          <div className="form-card">
            <div>
              <div className="card-title">Add Entry</div>
              <div className="card-sub">One entry = one reporting period per country</div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Country */}
              <div className="field">
                <label>Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                  {Object.entries(COUNTRY_LABELS).map(([code, label]) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Period */}
              <div className="row-2">
                <div className="field">
                  <label>Period Start</label>
                  <input
                    type="date" value={periodStart}
                    onChange={e => setPeriodStart(e.target.value)} required
                  />
                </div>
                <div className="field">
                  <label>Period End</label>
                  <input
                    type="date" value={periodEnd}
                    onChange={e => setPeriodEnd(e.target.value)} required
                  />
                </div>
              </div>

              {/* Materials */}
              <div>
                <div className="mats-label">Materials</div>
                {activeMats.map(mat => (
                  <div key={mat} className="mat-row">
                    <div className="mat-name">{mat}</div>
                    <input
                      className="mat-input"
                      type="number" step="0.01" min="0"
                      placeholder="kg"
                      value={materials[mat].kg}
                      onChange={e => setMaterialField(mat, 'kg', e.target.value)}
                    />
                    <input
                      className="mat-input"
                      type="number" min="0"
                      placeholder="units (opt.)"
                      value={materials[mat].units}
                      onChange={e => setMaterialField(mat, 'units', e.target.value)}
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeMaterial(mat)}
                      title="Remove"
                    >×</button>
                  </div>
                ))}

                {remainingMats.length > 0 && (
                  <div className="add-mat-row">
                    {remainingMats.map(mat => (
                      <button
                        key={mat} type="button"
                        className="add-mat-chip"
                        onClick={() => addMaterial(mat)}
                      >+ {mat}</button>
                    ))}
                  </div>
                )}
              </div>

              {error && <div className="form-error">⚠ {error}</div>}

              <div className="save-row">
                <button className="save-btn" type="submit" disabled={loading}>
                  {loading ? 'Saving…' : 'Save Entry'}
                </button>
                {saved && <div className="saved-msg">✓ Saved</div>}
              </div>
            </form>
          </div>

          {/* ── ENTRIES LIST ── */}
          <div className="list-card">
            <div>
              <div className="card-title">Entries ({entries.length})</div>
              <div className="card-sub">Most recent first</div>
            </div>

            <div className="entries-list">
              {loadingEntries ? (
                <div className="empty-state">Loading…</div>
              ) : entries.length === 0 ? (
                <div className="empty-state">No entries yet — add your first entry</div>
              ) : (
                entries.map((entry, i) => (
                  <div key={entry.id || i} className="entry">
                    <div className="entry-header">
                      <div>
                        <div className="entry-country">{COUNTRY_LABELS[entry.country] || entry.country}</div>
                        <div className="entry-period">
                          {new Date(entry.period_start).toLocaleDateString('en-GB')} →{' '}
                          {new Date(entry.period_end).toLocaleDateString('en-GB')}
                        </div>
                      </div>
                      <div className="entry-total">{totalKg(entry).toFixed(1)} kg</div>
                    </div>
                    <div className="entry-mats">
                      {Object.entries(entry.materials || {}).map(([mat, vals]: any) => (
                        <div key={mat} className="entry-mat-tag">
                          {mat} · {vals.kg} kg
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
