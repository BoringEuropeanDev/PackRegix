'use client';

import Papa from 'papaparse';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { emptyMaterials } from '@/lib/utils';

const mockRows = [
  { id: '1', country: 'DE', start_date: '2026-01-01', end_date: '2026-03-31', materials: emptyMaterials() }
];

export default function PackagingPage() {
  const [csv, setCsv] = useState('');

  const exportCsv = () => {
    const parsed = Papa.unparse(mockRows);
    setCsv(parsed);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Packaging Entries</h1>
      <DataTable initialRows={mockRows} />
      <Button onClick={exportCsv}>Export CSV</Button>
      {csv && <pre className="overflow-auto rounded-xl bg-stone-100 p-3 text-xs">{csv}</pre>}
    </div>
  );
}
