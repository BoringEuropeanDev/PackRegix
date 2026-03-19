import { Card } from '@/components/Card';

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Compliance Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Paper (Q1)"><p className="text-3xl font-bold">1,540 kg</p></Card>
        <Card title="Plastic (Q1)"><p className="text-3xl font-bold">892 kg</p></Card>
        <Card title="Metal (Q1)"><p className="text-3xl font-bold">200 kg</p></Card>
      </div>
      <Card title="Regulatory posture"><p>All obligations are on-track for DE and FR. Next filing deadline: June 30.</p></Card>
    </div>
  );
}
