'use client'
import { useState } from 'react'

const sharedStyles = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ece4; }
  .pg { padding: 32px 36px; max-width: 1100px; }
  .pg-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
  .pg-title { font-size: 1.4rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; }
  .pg-sub { font-size: 0.85rem; color: #9a8a72; margin-top: 3px; }
  .action-btn { background: #1e1810; color: #f5f0e8; font-size: 0.875rem; font-weight: 600; padding: 10px 20px; border: none; border-radius: 9px; cursor: pointer; transition: background 0.15s; }
  .action-btn:hover { background: #3a2e1e; }
  .ghost-btn { background: #faf7f2; color: #4a3f2f; font-size: 0.875rem; font-weight: 500; padding: 10px 20px; border: 1px solid rgba(180,160,130,0.35); border-radius: 9px; cursor: pointer; transition: background 0.15s; }
  .ghost-btn:hover { background: #f0ece4; }
`

const materials = ['Plastic','Paper','Glass','Metal','Wood','Other']
const countries = ['DE','FR','BE']

export default function PackagingPage() {
  const [rows, setRows] = useState([
    { id: 1, country: 'DE', start: '2026-01-01', end: '2026-03-31', vals: Object.fromEntries(materials.map(m=>[m,''])) }
  ])
  const [csv, setCsv] = useState('')

  function addRow() {
    setRows(r => [...r, { id: Date.now(), country: 'DE', start: '2026-01-01', end: '2026-06-30', vals: Object.fromEntries(materials.map(m=>[m,''])) }])
  }
  function updateRow(id: number, field: string, val: string) {
    setRows(r => r.map(row => row.id === id ? { ...row, [field]: val, vals: field in row.vals ? row.vals : row.vals } : row))
  }
  function updateMat(id: number, mat: string, val: string) {
    setRows(r => r.map(row => row.id === id ? { ...row, vals: { ...row.vals, [mat]: val } } : row))
  }
  function exportCsv() {
    const header = ['country','start_date','end_date',...materials].join(',')
    const lines = rows.map(r => [r.country, r.start, r.end, ...materials.map(m=>r.vals[m]||'0')].join(','))
    setCsv([header,...lines].join('\n'))
  }
  function removeRow(id: number) { setRows(r => r.filter(row => row.id !== id)) }

  return (
    <>
      <style>{`
        ${sharedStyles}
        .tbl-wrap { overflow-x: auto; background: #faf7f2; border: 1px solid rgba(180,160,130,0.25); border-radius: 14px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        thead th { padding: 12px 14px; text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.07em; color: #9a8a72; border-bottom: 1px solid rgba(180,160,130,0.2); white-space: nowrap; }
        tbody td { padding: 10px 14px; border-bottom: 1px solid rgba(180,160,130,0.12); }
        tbody tr:last-child td { border-bottom: none; }
        input[type=text], input[type=date], select {
          background: #f0ece4; border: 1px solid rgba(180,160,130,0.3);
          border-radius: 7px; padding: 7px 10px; font-size: 0.85rem;
          color: #1e1810; width: 100%; outline: none; min-width: 70px;
        }
        input[type=text]:focus, input[type=date]:focus, select:focus { border-color: #4a7ab5; }
        .del-btn { background: none; border: none; color: #c0a090; cursor: pointer; font-size: 16px; padding: 4px 8px; border-radius: 6px; }
        .del-btn:hover { background: rgba(180,100,80,0.1); color: #b94040; }
        .csv-box { margin-top: 20px; background: #faf7f2; border: 1px solid rgba(180,160,130,0.25); border-radius: 12px; padding: 16px; }
        .csv-box pre { font-size: 0.78rem; color: #7a6a55; overflow-x: auto; white-space: pre; }
        .row-btns { display: flex; gap: 10px; align-items: center; }
      `}</style>
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-title">Packaging Data</div>
            <div className="pg-sub">Enter material weights per country and period</div>
          </div>
          <div className="row-btns">
            <button className="ghost-btn" onClick={addRow}>+ Add row</button>
            <button className="action-btn" onClick={exportCsv}>Export CSV</button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Start</th>
                <th>End</th>
                {materials.map(m => <th key={m}>{m} (kg)</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>
                    <select value={row.country} onChange={e => updateRow(row.id, 'country', e.target.value)}>
                      {countries.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </td>
                  <td><input type="date" value={row.start} onChange={e => updateRow(row.id, 'start', e.target.value)} /></td>
                  <td><input type="date" value={row.end} onChange={e => updateRow(row.id, 'end', e.target.value)} /></td>
                  {materials.map(m => (
                    <td key={m}><input type="text" placeholder="0" value={row.vals[m]} onChange={e => updateMat(row.id, m, e.target.value)} /></td>
                  ))}
                  <td><button className="del-btn" onClick={() => removeRow(row.id)}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {csv && (
          <div className="csv-box">
            <div style={{fontSize:'11px',color:'#9a8a72',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.07em'}}>CSV Export</div>
            <pre>{csv}</pre>
          </div>
        )}
      </div>
    </>
  )
}
