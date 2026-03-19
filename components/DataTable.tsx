'use client';

import { useMemo, useState } from 'react';
import { MaterialKey, materialKeys, MaterialsPayload } from '@/lib/utils';

type Entry = {
  id: string;
  country: string;
  start_date: string;
  end_date: string;
  materials: MaterialsPayload;
};

export function DataTable({ initialRows }: { initialRows: Entry[] }) {
  const [rows, setRows] = useState<Entry[]>(initialRows);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => rows.filter((r) => r.country.toLowerCase().includes(query.toLowerCase())), [query, rows]);

  const updateKg = (id: string, material: MaterialKey, kg: number) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, materials: { ...row.materials, [material]: { ...row.materials[material], kg } } } : row)));
  };

  return (
    <div className="space-y-3">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by country" className="w-full rounded-xl border border-stone-300 bg-white p-2 dark:bg-stone-950" />
      <div className="overflow-auto rounded-xl border border-stone-300">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-100 dark:bg-stone-900">
            <tr>
              <th className="p-2 text-left">Country</th>
              <th className="p-2 text-left">Period</th>
              {materialKeys.map((m) => <th key={m} className="p-2 text-left">{m} kg</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-stone-200">
                <td className="p-2">{row.country}</td>
                <td className="p-2">{row.start_date} → {row.end_date}</td>
                {materialKeys.map((m) => (
                  <td key={m} className="p-2">
                    <input type="number" value={row.materials[m].kg} onChange={(e) => updateKg(row.id, m, Number(e.target.value))} className="w-20 rounded border border-stone-300 p-1" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
