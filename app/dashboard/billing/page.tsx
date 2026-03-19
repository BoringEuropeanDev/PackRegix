'use client'

const plans = [
  {
    name: 'Starter', price: '€0', period: '/14 days',
    desc: 'Try PackRegix free. One country, basic CSV export.',
    features: ['1 country','CSV export','Email support'],
    current: true, highlight: false,
  },
  {
    name: 'Pro', price: '€49', period: '/month',
    desc: 'Everything you need for full EU EPR compliance.',
    features: ['DE + FR + BE','PDF report generation','Deadline alerts','Priority support'],
    current: false, highlight: true,
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    desc: 'Multi-entity, API access, dedicated account manager.',
    features: ['Unlimited entities','REST API access','Custom SLA','Dedicated manager'],
    current: false, highlight: false,
  },
]

export default function BillingPage() {
  function upgrade(plan: string) {
    const sub = plan==='Pro' ? 'PackRegix Pro €49/mo' : 'PackRegix Enterprise'
    window.location.href = `mailto:alexis@axara.systems?subject=${encodeURIComponent(sub)}`
  }
  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #__next { height: 100%; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ece4; }
        .pg { height: 100vh; display: flex; flex-direction: column; padding: 28px 32px; gap: 22px; overflow: hidden; }
        .pg-title { font-size: 1.3rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; }
        .pg-sub { font-size: 0.82rem; color: #9a8a72; margin-top: 2px; }
        .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; flex: 1; }
        .pcard { background: #faf7f2; border: 1px solid rgba(180,160,130,0.25); border-radius: 16px; padding: 26px; display: flex; flex-direction: column; gap: 16px; }
        .pcard.hi { background: #1e1810; border-color: #1e1810; }
        .pname { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9a8a72; }
        .pcard.hi .pname { color: #6a5a4a; }
        .price { font-size: 2.2rem; font-weight: 800; color: #1e1810; line-height: 1; }
        .price span { font-size: 0.88rem; font-weight: 400; color: #9a8a72; }
        .pcard.hi .price { color: #f5f0e8; }
        .pcard.hi .price span { color: #6a5a4a; }
        .pdesc { font-size: 0.85rem; color: #7a6a55; line-height: 1.6; }
        .pcard.hi .pdesc { color: #8a7a6a; }
        .feats { display: flex; flex-direction: column; gap: 9px; flex: 1; }
        .feat { font-size: 0.85rem; color: #4a3f2f; display: flex; align-items: center; gap: 9px; }
        .feat::before { content: '✓'; color: #3d8f6a; font-weight: 700; font-size: 0.78rem; flex-shrink: 0; }
        .pcard.hi .feat { color: #c8b8a8; }
        .pcard.hi .feat::before { color: #5aaf88; }
        .plan-btn { width: 100%; padding: 12px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none; transition: background 0.15s; }
        .btn-dark  { background: #f5f0e8; color: #1e1810; }
        .btn-dark:hover { background: #fff; }
        .btn-plain { background: rgba(180,160,130,0.15); color: #4a3f2f; border: 1px solid rgba(180,160,130,0.3); }
        .btn-plain:hover { background: rgba(180,160,130,0.28); }
        .btn-dis { background: rgba(180,160,130,0.1); color: #c0b0a0; border: 1px solid rgba(180,160,130,0.2); cursor: default; opacity: 0.7; }
        .curr-tag { font-size: 10px; background: rgba(61,143,106,0.1); color: #2a6048; border: 1px solid rgba(61,143,106,0.2); border-radius: 100px; padding: 3px 10px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; width: fit-content; }
      `}</style>
      <div className="pg">
        <div>
          <div className="pg-title">Billing & Plans</div>
          <div className="pg-sub">Start free. Upgrade anytime — no surprises.</div>
        </div>
        <div className="grid">
          {plans.map(p=>(
            <div key={p.name} className={`pcard${p.highlight?' hi':''}`}>
              <div className="pname">{p.name}</div>
              {p.current && <div className="curr-tag">Current plan</div>}
              <div className="price">{p.price}<span>{p.period}</span></div>
              <div className="pdesc">{p.desc}</div>
              <div className="feats">{p.features.map(f=><div key={f} className="feat">{f}</div>)}</div>
              {p.current
                ? <button className="plan-btn btn-dis" disabled>Active</button>
                : <button className={`plan-btn ${p.highlight?'btn-dark':'btn-plain'}`} onClick={()=>upgrade(p.name)}>
                    {p.name==='Enterprise'?'Contact us →':'Upgrade to Pro →'}
                  </button>
              }
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
