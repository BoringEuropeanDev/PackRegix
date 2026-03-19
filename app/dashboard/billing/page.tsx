'use client'
import { useState } from 'react'

const plans = [
  {
    name: 'Trial',
    monthlyPrice: '€0',
    yearlyPrice: '€0',
    period: '/14 days',
    desc: 'Full access for 14 days. No card required.',
    features: ['DE + FR + BE', 'AI report generation', 'Deadline alerts', 'Email support'],
    current: true, highlight: false,
  },
  {
    name: 'Compliant',
    monthlyPrice: '€49',
    yearlyPrice: '€400',
    monthlyNum: 49,
    yearlyNum: 400,
    period: '/month',
    desc: 'Everything you need for full EU EPR compliance.',
    features: ['DE + FR + BE', 'AI-formatted CSV + PDF reports', 'Deadline alerts', 'Priority support', 'Company info on all reports'],
    current: false, highlight: true,
  },
  {
    name: 'Enterprise',
    monthlyPrice: 'Custom',
    yearlyPrice: 'Custom',
    period: '',
    desc: 'Multi-entity, API access, dedicated account manager.',
    features: ['Unlimited entities', 'REST API access', 'Custom SLA', 'Dedicated manager', 'White-label reports'],
    current: false, highlight: false,
  },
]

export default function BillingPage() {
  const [annual, setAnnual] = useState(false)

  function upgrade(name: string) {
    const price = name === 'Compliant'
      ? (annual ? '€400/year' : '€49/month')
      : 'Enterprise'
    window.location.href = `mailto:alexis@axara.systems?subject=${encodeURIComponent(`PackRegix ${name} – ${price}`)}`
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .pg {
          height: 100vh; display: flex; flex-direction: column;
          padding: 32px 36px; gap: 22px; overflow: hidden;
          background: #f0ece4;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .pg-head { display: flex; justify-content: space-between; align-items: flex-end; flex-shrink: 0; }
        .pg-title { font-size: 1.3rem; font-weight: 700; color: #1e1810; letter-spacing: -0.02em; }
        .pg-sub { font-size: 0.82rem; color: #9a8a72; margin-top: 3px; }

        /* toggle */
        .toggle-wrap {
          display: flex; align-items: center; gap: 12px;
        }
        .toggle-label { font-size: 0.85rem; color: #7a6a55; font-weight: 500; }
        .toggle-label.active { color: #1e1810; font-weight: 600; }
        .toggle {
          position: relative; width: 46px; height: 26px; cursor: pointer;
        }
        .toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
        .track {
          position: absolute; inset: 0;
          background: rgba(180,160,130,0.3); border-radius: 100px;
          border: 1px solid rgba(180,160,130,0.4);
          transition: background 0.2s;
        }
        .track.on { background: #1e1810; border-color: #1e1810; }
        .thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%;
          background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }
        .thumb.on { transform: translateX(20px); }
        .save-badge {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; background: rgba(61,143,106,0.12);
          color: #2a6048; border: 1px solid rgba(61,143,106,0.25);
          border-radius: 100px; padding: 3px 10px;
          opacity: 0; transition: opacity 0.2s;
        }
        .save-badge.show { opacity: 1; }

        /* grid */
        .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; flex: 1; min-height: 0; }
        .pcard {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.3);
          border-radius: 16px; padding: 26px;
          display: flex; flex-direction: column;
        }
        .pcard.hi { background: #1e1810; border-color: #1e1810; }
        .pname {
          font-size: 10.5px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: #9a8a72; margin-bottom: 12px;
        }
        .pcard.hi .pname { color: #5a4a3a; }
        .curr-tag {
          display: inline-block; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
          background: rgba(61,143,106,0.1); color: #2a6048;
          border: 1px solid rgba(61,143,106,0.25);
          border-radius: 100px; padding: 3px 10px; margin-bottom: 12px; width: fit-content;
        }
        .price-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }
        .price-main { font-size: 2.4rem; font-weight: 800; color: #1e1810; line-height: 1; }
        .pcard.hi .price-main { color: #f5f0e8; }
        .price-per { font-size: 0.85rem; color: #9a8a72; font-weight: 400; }
        .pcard.hi .price-per { color: #5a4a3a; }
        .price-equiv { font-size: 0.75rem; color: #9a8a72; margin-bottom: 14px; min-height: 18px; }
        .pcard.hi .price-equiv { color: #5a4a3a; }
        .pdesc { font-size: 0.84rem; color: #7a6a55; line-height: 1.6; margin-bottom: 18px; }
        .pcard.hi .pdesc { color: #7a6a58; }
        .feats { display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .feat { font-size: 0.84rem; color: #4a3f2f; display: flex; align-items: center; gap: 9px; }
        .feat::before { content: '✓'; color: #3d8f6a; font-weight: 700; font-size: 0.78rem; flex-shrink: 0; }
        .pcard.hi .feat { color: #c0b0a0; }
        .pcard.hi .feat::before { color: #5aaf88; }
        .pbtn {
          width: 100%; padding: 13px; border-radius: 10px;
          font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none;
          transition: background 0.15s; margin-top: 20px; flex-shrink: 0;
        }
        .pbtn-light { background: #f5f0e8; color: #1e1810; }
        .pbtn-light:hover { background: #fff; }
        .pbtn-plain { background: rgba(180,160,130,0.15); color: #4a3f2f; border: 1px solid rgba(180,160,130,0.3); }
        .pbtn-plain:hover { background: rgba(180,160,130,0.28); }
        .pbtn-dis { background: rgba(180,160,130,0.08); color: #c0b0a0; border: 1px solid rgba(180,160,130,0.2); cursor: default; }
      `}</style>

      <div className="pg">
        <div className="pg-head">
          <div>
            <div className="pg-title">Billing & Plans</div>
            <div className="pg-sub">Start free. Upgrade anytime — no surprises.</div>
          </div>
          <div className="toggle-wrap">
            <span className={`toggle-label ${!annual ? 'active' : ''}`}>Monthly</span>
            <label className="toggle">
              <input type="checkbox" checked={annual} onChange={() => setAnnual(a => !a)} />
              <div className={`track ${annual ? 'on' : ''}`} />
              <div className={`thumb ${annual ? 'on' : ''}`} />
            </label>
            <span className={`toggle-label ${annual ? 'active' : ''}`}>Annually</span>
            <div className={`save-badge ${annual ? 'show' : ''}`}>Save ~32%</div>
          </div>
        </div>

        <div className="grid">
          {plans.map(p => {
            const price = annual ? p.yearlyPrice : p.monthlyPrice
            const per = p.name === 'Compliant'
              ? (annual ? '/year' : '/month')
              : p.period
            const equiv = p.name === 'Compliant' && annual
              ? '≈ €33/month' : p.name === 'Compliant' && !annual
              ? '€400/year if billed annually' : ''

            return (
              <div key={p.name} className={`pcard${p.highlight ? ' hi' : ''}`}>
                <div className="pname">{p.name}</div>
                {p.current && <div className="curr-tag">Current plan</div>}
                <div className="price-row">
                  <div className="price-main">{price}</div>
                  <div className="price-per">{per}</div>
                </div>
                <div className="price-equiv">{equiv}</div>
                <div className="pdesc">{p.desc}</div>
                <div className="feats">{p.features.map(f => <div key={f} className="feat">{f}</div>)}</div>
                {p.current
                  ? <button className="pbtn pbtn-dis" disabled>Active</button>
                  : <button
                      className={`pbtn ${p.highlight ? 'pbtn-light' : 'pbtn-plain'}`}
                      onClick={() => upgrade(p.name)}
                    >
                      {p.name === 'Enterprise' ? 'Contact us →' : `Upgrade to Compliant →`}
                    </button>
                }
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
