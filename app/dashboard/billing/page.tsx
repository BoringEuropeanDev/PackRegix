'use client'

const plans = [
  {
    name: 'Starter', price: '€0', period: '/14 days',
    desc: 'Try PackRegix free. One country, basic CSV export.',
    features: ['1 country', 'CSV export', 'Email support'],
    current: true, highlight: false,
  },
  {
    name: 'Pro', price: '€49', period: '/month',
    desc: 'Everything you need for full EU EPR compliance.',
    features: ['DE + FR + BE', 'PDF report generation', 'Deadline alerts', 'Priority support'],
    current: false, highlight: true,
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    desc: 'Multi-entity, API access, dedicated account manager.',
    features: ['Unlimited entities', 'REST API access', 'Custom SLA', 'Dedicated manager'],
    current: false, highlight: false,
  },
]

export default function BillingPage() {
  function upgrade(name: string) {
    const sub = name === 'Pro' ? 'PackRegix Pro €49/mo' : 'PackRegix Enterprise'
    window.location.href = `mailto:alexis@axara.systems?subject=${encodeURIComponent(sub)}`
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
        .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; flex: 1; min-height: 0; }
        .pcard {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.3);
          border-radius: 16px; padding: 26px;
          display: flex; flex-direction: column; gap: 0;
        }
        .pcard.hi { background: #1e1810; border-color: #1e1810; }
        .pname { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9a8a72; margin-bottom: 14px; }
        .pcard.hi .pname { color: #5a4a3a; }
        .curr-tag {
          display: inline-block; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
          background: rgba(61,143,106,0.1); color: #2a6048;
          border: 1px solid rgba(61,143,106,0.25);
          border-radius: 100px; padding: 3px 10px;
          margin-bottom: 14px; width: fit-content;
        }
        .price { font-size: 2.4rem; font-weight: 800; color: #1e1810; line-height: 1; margin-bottom: 4px; }
        .price span { font-size: 0.88rem; font-weight: 400; color: #9a8a72; }
        .pcard.hi .price { color: #f5f0e8; }
        .pcard.hi .price span { color: #5a4a3a; }
        .pdesc { font-size: 0.84rem; color: #7a6a55; line-height: 1.6; margin: 14px 0 18px; }
        .pcard.hi .pdesc { color: #7a6a58; }
        .feats { display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .feat { font-size: 0.85rem; color: #4a3f2f; display: flex; align-items: center; gap: 9px; }
        .feat::before { content: '✓'; color: #3d8f6a; font-weight: 700; font-size: 0.8rem; flex-shrink: 0; }
        .pcard.hi .feat { color: #c0b0a0; }
        .pcard.hi .feat::before { color: #5aaf88; }
        .pbtn {
          width: 100%; padding: 13px; border-radius: 10px;
          font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none;
          transition: background 0.15s; margin-top: 20px;
        }
        .pbtn-light { background: #f5f0e8; color: #1e1810; }
        .pbtn-light:hover { background: #fff; }
        .pbtn-plain { background: rgba(180,160,130,0.15); color: #4a3f2f; border: 1px solid rgba(180,160,130,0.3); }
        .pbtn-plain:hover { background: rgba(180,160,130,0.28); }
        .pbtn-dis { background: rgba(180,160,130,0.08); color: #c0b0a0; border: 1px solid rgba(180,160,130,0.2); cursor: default; }
      `}</style>
      <div className="pg">
        <div>
          <div className="pg-title">Billing & Plans</div>
          <div className="pg-sub">Start free. Upgrade anytime — no surprises.</div>
        </div>
        <div className="grid">
          {plans.map(p => (
            <div key={p.name} className={`pcard${p.highlight ? ' hi' : ''}`}>
              <div className="pname">{p.name}</div>
              {p.current && <div className="curr-tag">Current plan</div>}
              <div className="price">{p.price}<span>{p.period}</span></div>
              <div className="pdesc">{p.desc}</div>
              <div className="feats">{p.features.map(f => <div key={f} className="feat">{f}</div>)}</div>
              {p.current
                ? <button className="pbtn pbtn-dis" disabled>Active</button>
                : <button className={`pbtn ${p.highlight ? 'pbtn-light' : 'pbtn-plain'}`} onClick={() => upgrade(p.name)}>
                    {p.name === 'Enterprise' ? 'Contact us →' : 'Upgrade to Pro →'}
                  </button>
              }
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
