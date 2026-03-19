'use client'
import { useState } from 'react'

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
    setRows(r => r.map(row => row.id===id ? {...row,[field]:val} : row))
  }
  function updateMat(id: number, mat: string, val: string) {
    setRows(r => r.map(row => row.id===id ? {...row,vals:{...row.vals,[mat]:val}} : row))
  }
  function removeRow(id: number) { setRows(r => r.filter(row=>row.id!==id)) }
  function exportCsv() {
    const header = ['country','start_date','end_date',...materials].join(',')
    const lines = rows.map(r=>[r.country,r.start,r.end,...materials.map(m=>r.vals[m]||'0')].join(','))
    setCsv([header,...lines].join('\n'))
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #__next { height: 100%; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ece4; }
        .pg { height: 100vh; display: flex; flex-direction: column; padding: 28px 32px; gap: 18px; overflow: hidden; }
        .pg-head { display: flex; justify-content: space-between; align-items: flex-end; }
        .pg-title { font-size: 1.3rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; }
        .pg-sub { font-size: 0.82rem; color: #9a8a72; margin-top: 2px; }
        .btns { display: flex; gap: 10px; }
        .btn-p { background: #1e1810; color: #f5f0e8; font-size: 0.85rem; font-weight: 600; padding: 9px 18px; border: none; border-radius: 8px; cursor: pointer; }
        .btn-p:hover { background: #3a2e1e; }
        .btn-g { background: #faf7f2; color: #4a3f2f; font-size: 0.85rem; font-weight: 500; padding: 9px 18px; border: 1px solid rgba(180,160,130,0.35); border-radius: 8px; cursor: pointer; }
        .btn-g:hover { background: #f0ece4; }
        .tbl-wrap { flex: 1; min-height: 0; overflow: auto; background: #faf7f2; border: 1px solid rgba(180,160,130,0.25); border-radius: 13px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        thead { position: sticky; top: 0; background: #faf7f2; z-index: 1; }
        thead th { padding: 11px 13px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; color: #9a8a72; border-bottom: 1px solid rgba(180,160,130,0.2); white-space: nowrap; }
        tbody td { padding: 9px 13px; border-bottom: 1px solid rgba(180,160,130,0.1); }
        tbody tr:last-child td { border-bottom: none; }
        input[type=text], input[type=date] { background: #f0ece4; border: 1px solid rgba(180,160,130,0.3); border-radius: 6px; padding: 6px 9px; font-size: 0.82rem; color: #1e1810; width: 100%; outline: none; min-width: 65px; }
        select { background: #f0ece4; border: 1px solid rgba(180,160,130,0.3); border-radius: 6px; padding: 6px 9px; font-size: 0.82rem; color: #1e1810; outline: none; }
        input:focus, select:focus { border-color: #4a7ab5; }
        .del { background: none; border: none; color: #c0a090; cursor: pointer; font-size: 15px; padding: 3px 7px; border-radius: 5px; }
        .del:hover { background: rgba(180,100,80,0.1); color: #b94040; }
        .csv-box { background: #faf7f2; border: 1px solid rgba(180,160,130,0.25); border-radius: 11px; padding: 12px 16px; max-height: 90px; overflow: auto; }
        .csv-box pre { font-size: 0.75rem; color: #7a6a55; white-space: pre; }
        .csv-label { font-size: 10px; color: #9a8a72; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; }
      `}</style>
      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-title">Packaging Data</div>
            <div className="pg-sub">Enter material weights per country and period</div>
          </div>
          <div className="btns">
            <button className="btn-g" onClick={addRow}>+ Add row</button>
            <button className="btn-p" onClick={exportCsv}>Export CSV</button>
          </div>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Country</th><th>Start</th><th>End</th>
                {materials.map(m=><th key={m}>{m} (kg)</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row=>(
                <tr key={row.id}>
                  <td>
                    <select value={row.country} onChange={e=>updateRow(row.id,'country',e.target.value)}>
                      {countries.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </td>
                  <td><input type="date" value={row.start} onChange={e=>updateRow(row.id,'start',e.target.value)}/></td>
                  <td><input type="date" value={row.end} onChange={e=>updateRow(row.id,'end',e.target.value)}/></td>
                  {materials.map(m=>(
                    <td key={m}><input type="text" placeholder="0" value={row.vals[m]} onChange={e=>updateMat(row.id,m,e.target.value)}/></td>
                  ))}
                  <td><button className="del" onClick={()=>removeRow(row.id)}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {csv && (
          <div className="csv-box">
            <div className="csv-label">CSV Export</div>
            <pre>{csv}</pre>
          </div>
        )}
      </div>
    </>
  )
}
