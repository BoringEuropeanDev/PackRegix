const deadlines = [
  { date: '2026-04-10', task: 'FR CITEO declaration' },
  { date: '2026-06-30', task: 'DE quarterly packaging report' },
  { date: '2026-07-15', task: 'BE annual packaging audit prep' }
];

export default function CalendarPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Compliance Calendar</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {deadlines.map((d) => (
          <div key={d.date} className="rounded-xl border border-stone-300 p-4">
            <p className="text-xs uppercase text-accent">Deadline</p>
            <p className="mt-2 text-lg font-semibold">{d.date}</p>
            <p className="text-sm">{d.task}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
