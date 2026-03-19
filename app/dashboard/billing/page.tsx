'use client'

export default function BillingPage() {
  function emailPro() {
    window.location.href = 'mailto:alexis@axara.systems?subject=PackRegix Pro €49/mo&body=Hi, I would like to upgrade to the Pro plan.'
  }

  const plans = [
    { name: 'Starter', price: '€0', period: '/14 days', desc: 'One country, basic CSV export, manual filing.', features: ['1 country','CSV export','Email support'], current: true, cta: null },
    { name: 'Pro', price: '€49', period: '/month', desc: 'All 3 countries, auto-generated reports, priority support.', features: ['DE + FR + BE','PDF reports','Priority support','Deadline alerts'], current: false, cta: emailPro },
    { name: 'Enterprise', price: 'Custom', period: '', desc: 'Multi-entity, API access, dedicated account manager.', features: ['Unlimited entities','API access','Custom SLA','Dedicated manager'], current: false, cta: () => window.location.href='mailto:alexis@axara.systems?subject=PackRegix Enterprise' },
  ]

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ece4; }
        .pg { padding: 32px 36px; max-width: 1000px; }
        .pg-title { font-size: 1.4rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; margin-bottom: 6px; }
        .pg-sub { font-size: 0.85rem; color: #9a8a72; margin-bottom: 28px; }
        .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media(max-width:768px){ .grid { grid-template-columns: 1fr; } }
        .pcard {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.25);
          border-radius: 16px; padding: 26px; display: flex; flex-direction: column; gap: 14px;
        }
        .pcard.highlight { background: #1e1810; border-color: #1e1810; }
        .pcard-name { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9a8a72; }
        .pcard.highlight .pcard-name { color: #b0a08a; }
        .pcard-price { font-size: 2rem; font-weight: 800; color: #1e1810; line-height: 1; }
        .pcard-price span { font-size: 0.9rem; font-weight: 400; color: #9a8a72; }
        .pcard.highlight .pcard-price { color: #f5f0e8; }
        .pcard.highlight .pcard-price span { color: #7a6a5a; }
        .pcard-desc { font-size: 0.875rem; color: #7a6a55; line-height: 1.6; }
        .pcard.highlight .pcard-desc { color: #a09080; }
        .features { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .feat { font-size: 0.85rem; color: #4a3f2f; display: flex; align-items: center; gap: 8px; }
        .feat::before { content: '✓'; color: #3d8f6a; font-weight: 700; font-size: 0.75rem; }
        .pcard.highlight .feat { color: #d0c8bc; }
        .pcard.highlight .feat::before { color: #7ab59a; }
        .plan-btn {
          width: 100%; padding: 12px; border-radius: 9px; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; border: none; transition: background 0.15s; margin-top: auto;
        }
        .btn-ghost { background: rgba(180,160,130,0.15); color: #4a3f2f; border: 1px solid rgba(180,160,130,0.3); }
        .btn-ghost:hover { background: rgba(180,160,130,0.25); }
        .btn-light { background: #f5f0e8; color: #1e1810; }
        .btn-light:hover { background: #fff; }
        .current-tag { font-size: 10px; background: rgba(61,143,106,0.1); color: #2a6048; border: 1px solid rgba(61,143,106,0.2); border-radius: 100px; padding: 3px 10px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; width: fit-content; }
      `}</style>
      <div className="pg">
        <div className="pg-title">Billing & Plans</div>
        <div className="pg-sub">Start free. Upgrade anytime.</div>
        <div className="grid">
          {plans.map(p => (
            <div key={p.name} className={`pcard${p.name==='Pro' ? ' highlight' : ''}`}>
              <div className="pcard-name">{p.name}</div>
              {p.current && <div className="current-tag">Current plan</div>}
              <div className="pcard-price">{p.price}<span>{p.period}</span></div>
              <div className="pcard-desc">{p.desc}</div>
              <div className="features">
                {p.features.map(f => <div key={f} className="feat">{f}</div>)}
              </div>
              {p.cta ? (
                <button className={`plan-btn ${p.name==='Pro' ? 'btn-light' : 'btn-ghost'}`} onClick={p.cta}>
                  {p.name === 'Enterprise' ? 'Contact us' : 'Upgrade to Pro →'}
                </button>
              ) : (
                <button className="plan-btn btn-ghost" disabled style={{opacity:0.5,cursor:'default'}}>Active</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
