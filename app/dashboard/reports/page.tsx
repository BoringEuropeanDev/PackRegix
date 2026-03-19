import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <Card title="Generate DE Quarterly CSV">
        <p className="mb-3 text-sm">Bundled German-format export ready for regulator upload.</p>
        <Button>Generate CSV</Button>
      </Card>
      <Card title="Generate FR Annual PDF">
        <p className="mb-3 text-sm">Annual recap with material totals and legal references.</p>
        <Button variant="outline">Generate PDF</Button>
      </Card>
    </div>
  );
}
