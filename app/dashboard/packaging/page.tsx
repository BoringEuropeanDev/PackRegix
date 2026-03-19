'use client'
import { useState, useEffect } from 'react'

export default function PackagingPage() {
  const [material, setMaterial] = useState('')
  const [weight, setWeight] = useState('')
  const [country, setCountry] = useState('DE')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [entries, setEntries] = useState<any[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load packaging data
    fetchEntries()
  }, [])

  async function fetchEntries() {
    try {
      const res = await fetch('/api/packaging/list')
      const data = await res.json()
      setEntries(data || [])
    } catch (err) {
      console.error('Failed to fetch entries:', err)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!material || !weight) return

    setLoading(true)
    try {
      const res = await fetch('/api/packaging/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_type: material,
          weight_kg: parseFloat(weight),
          country,
          notes,
        }),
      })

      if (!res.ok) throw new Error('Failed to add entry')

      setMaterial('')
      setWeight('')
      setNotes('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      await fetchEntries()
    } catch (err) {
      console.error('Add error:', err)
      alert('Failed to add entry')
    } finally {
      setLoading(false)
    }
  }

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

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; flex: 1; min-height: 0; }
        .form-card, .list-card {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.28);
          border-radius: 16px; padding: 28px 32px;
          display: flex; flex-direction: column; gap: 18px;
        }
        .list-card { overflow-y: auto; }
        .form-title { font-size: 0.95rem; font-weight: 700; color: #1e1810; margin-bottom: 6px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: #9a8a72; }
        .field input, .field select {
          background: #f0ece4; border: 1px solid rgba(180,160,130,0.35);
          border-radius: 9px; padding: 11px 14px; font-size: 0.9rem;
          color: #1e1810; outline: none; transition: border-color 0.15s;
          width: 100%;
        }
        .field input:focus, .field select:focus { border-color: #4a7ab5; }
        .field textarea {
          background: #f0ece4; border: 1px solid rgba(180,160,130,0.35);
          border-radius: 9px; padding: 11px 14px; font-size: 0.9rem;
          color: #1e1810; outline: none; font-family: inherit; resize: vertical;
          min-height: 70px;
        }
        .save-btn {
          background: #1e1810; color: #f5f0e8; font-size: 0.9rem; font-weight: 600;
          padding: 11px 26px; border: none; border-radius: 9px; cursor: pointer;
          transition: background 0.15s;
        }
        .save-btn:hover { background: #3a2e1e; }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .saved-msg { font-size: 0.85rem; color: #3d8f6a; font-weight: 500; }

        .entry {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px; background: #f5f2ed; border-radius: 8px;
          border-left: 3px solid #3d8f6a;
        }
        .entry-info { display: flex; flex-direction: column; gap: 3px; }
        .entry-material { font-size: 0.9rem; font-weight: 600; color: #1e1810; }
        .entry-meta { font-size: 0.8rem; color: #9a8a72; }
        .entry-weight { font-size: 1rem; font-weight: 700; color: #1e1810; }
      `}</style>

      <div className="pg">
        <div>
          <div className="pg-title">Packaging Data</div>
          <div className="pg-sub">Track and manage your packaging entries</div>
        </div>

        <div className="grid-2">
          {/* Form */}
          <div className="form-card">
            <div className="form-title">Add New Entry</div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="field">
                <label>Material Type</label>
                <select value={material} onChange={e => setMaterial(e.target.value)} required>
                  <option value="">Select material</option>
                  <option value="Plastic">Plastic</option>
                  <option value="Paper">Paper</option>
                  <option value="Glass">Glass</option>
                  <option value="Metal">Metal</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <div className="field">
                <label>Weight (kg)</label>
                <input type="number" step="0.01" placeholder="0.00" value={weight} onChange={e => setWeight(e.target.value)} required />
              </div>
              <div className="field">
                <label>Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="BE">Belgium</option>
                </select>
              </div>
              <div className="field">
                <label>Notes (optional)</label>
                <textarea placeholder="Add any notes..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <button className="save-btn" type="submit" disabled={loading}>
                {loading ? 'Adding...' : '+ Add Entry'}
              </button>
              {saved && <div className="saved-msg">✓ Entry saved</div>}
            </form>
          </div>

          {/* List */}
          <div className="list-card">
            <div className="form-title">Recent Entries ({entries.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {entries.length === 0 ? (
                <div style={{ color: '#9a8a72', fontSize: '0.85rem', textAlign: 'center', paddingTop: '20px' }}>
                  No entries yet
                </div>
              ) : (
                entries.slice(0, 20).map((e, i) => (
                  <div key={i} className="entry">
                    <div className="entry-info">
                      <div className="entry-material">{e.material_type}</div>
                      <div className="entry-meta">{e.country} · {new Date(e.date).toLocaleDateString()}</div>
                    </div>
                    <div className="entry-weight">{e.weight_kg} kg</div>
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
