'use client'
import { useState } from 'react'

const euCountries = ['Austria','Belgium','Bulgaria','Croatia','Cyprus','Czech Republic','Denmark','Estonia','Finland','France','Germany','Greece','Hungary','Ireland','Italy','Latvia','Lithuania','Luxembourg','Malta','Netherlands','Poland','Portugal','Romania','Slovakia','Slovenia','Spain','Sweden']

const plans = [
  {
    name: 'Trial', price: { monthly: '€0', annual: '€0' }, period: { monthly: '/14 days', annual: '/14 days' },
    desc: 'Full access for 14 days. No card required.',
    features: ['DE + FR + BE', 'AI report generation', 'Deadline alerts', 'Email support'],
    current: true, highlight: false,
  },
  {
    name: 'Compliant', price: { monthly: '€49', annual: '€400' }, period: { monthly: '/month', annual: '/year' },
    desc: 'Everything you need for full EU EPR compliance.',
    features: ['DE + FR + BE', 'AI-formatted CSV + PDF', 'Deadline alerts', 'Priority support', 'Company info on reports'],
    current: false, highlight: true,
  },
  {
    name: 'Enterprise', price: { monthly: 'Custom', annual: 'Custom' }, period: { monthly: '', annual: '' },
    desc: 'Multi-entity, API access, dedicated account manager.',
    features: ['Unlimited entities', 'REST API access', 'Custom SLA', 'Dedicated manager', 'White-label reports'],
    current: false, highlight: false,
  },
]

export default function AccountPage() {
  const [tab, setTab] = useState<'profile'|'company'|'billing'>('profile')
  const [annual, setAnnual] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({ name: '', email: '' })
  const [company, setCompany] = useState({ name: '', vat: '', country: '', address: '' })

  function saveCompany(e: React.FormEvent) {
    e.preventDefault()
    // TODO: POST to /api/account/company
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function upgrade(name: string) {
    const price = name === 'Compliant' ? (annual ? '€400/year' : '€49/month') : 'Enterprise'
    window.location.href = `mailto:alexis@axara.systems?subject=${encodeURIComponent(`PackRegix ${name} – ${price}`)}`
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

        /* tabs */
        .tabs { display: flex; gap: 4px; flex-shrink: 0; }
        .tab {
          padding: 8px 18px; border-radius: 9px; font-size: 0.875rem;
          font-weight: 500; cursor: pointer; border: none;
          background: transparent; color: #9a8a72;
          transition: background 0.15s, color 0.15s;
        }
        .tab:hover { background: rgba(180,160,130,0.15); color: #4a3f2f; }
        .tab.active { background: #faf7f2; color: #1e1810; font-weight: 600; border: 1px solid rgba(180,160,130,0.3); }

        /* panel */
        .panel { flex: 1; min-height: 0; overflow: hidden; }

        /* form */
        .form-card {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.28);
          border-radius: 16px; padding: 28px 32px;
          display: flex; flex-direction: column; gap: 18px;
          height: 100%;
        }
        .form-section-title { font-size: 0.95rem; font-weight: 700; color: #1e1810; margin-bottom: 2px; }
        .form-section-sub { font-size: 0.82rem; color: #9a8a72; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: #9a8a72; }
        .field input, .field select {
          background: #f0ece4; border: 1px solid rgba(180,160,130,0.35);
          border-radius: 9px; padding: 11px 14px; font-size: 0.9rem;
          color: #1e1810; outline: none; transition: border-color 0.15s;
          width: 100%;
        }
        .field input:focus, .field select:focus { border-color: #4a7ab5; }
        .field input::placeholder { color: #c0b09a; }
        .form-note { font-size: 0.8rem; color: #9a8a72; line-height: 1.6; }
        .form-note strong { color: #4a3f2f; }
        .save-row { display: flex; align-items: center; gap: 14px; }
        .save-btn {
          background: #1e1810; color: #f5f0e8; font-size: 0.9rem; font-weight: 600;
          padding: 11px 26px; border: none; border-radius: 9px; cursor: pointer;
          transition: background 0.15s;
        }
        .save-btn:hover { background: #3a2e1e; }
        .saved-msg { font-size: 0.85rem; color: #3d8f6a; font-weight: 500; }

        /* billing inside account */
        .billing-wrap {
          height: 100%; display: flex; flex-direction: column; gap: 18px;
        }
        .toggle-row { display: flex; align-items: center; gap: 12px; justify-content: flex-end; }
        .toggle-label { font-size: 0.85rem; color: #7a6a55; font-weight: 500; }
        .toggle-label.on { color: #1e1810; font-weight: 600; }
        .toggle { position: relative; width: 44px; height: 24px; cursor: pointer; }
        .toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
        .track { position: absolute; inset: 0; background: rgba(180,160,130,0.3); border-radius: 100px; border: 1px solid rgba(180,160,130,0.4); transition: background 0.2s; }
        .track.on { background: #1e1810; border-color: #1e1810; }
        .thumb { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.2s; }
        .thumb.on { transform: translateX(20px); }
        .save-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; background: rgba(61,143,106,0.12); color: #2a6048; border: 1px solid rgba(61,143,106,0.25); border-radius: 100px; padding: 3px 10px; opacity: 0; transition: opacity 0.2s; }
        .save-badge.show { opacity: 1; }
        .plan-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; flex: 1; min-height: 0; }
        .pcard { background: #faf7f2; border: 1px solid rgba(180,160,130,0.3); border-radius: 16px; padding: 22px; display: flex; flex-direction: column; }
        .pcard.hi { background: #1e1810; border-color: #1e1810; }
        .pname { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9a8a72; margin-bottom: 10px; }
        .pcard.hi .pname { color: #5a4a3a; }
        .curr-tag { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; background: rgba(61,143,106,0.1); color: #2a6048; border: 1px solid rgba(61,143,106,0.25); border-radius: 100px; padding: 3px 10px; margin-bottom: 10px; width: fit-content; }
        .p-price { font-size: 2rem; font-weight: 800; color: #1e1810; line-height: 1; }
        .p-price span { font-size: 0.82rem; font-weight: 400; color: #9a8a72; }
        .pcard.hi .p-price { color: #f5f0e8; }
        .pcard.hi .p-price span { color: #5a4a3a; }
        .p-equiv { font-size: 0.73rem; color: #9a8a72; margin: 4px 0 12px; min-height: 16px; }
        .pcard.hi .p-equiv { color: #5a4a3a; }
        .p-desc { font-size: 0.82rem; color: #7a6a55; line-height: 1.6; margin-bottom: 14px; }
        .pcard.hi .p-desc { color: #7a6a58; }
        .feats { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .feat { font-size: 0.82rem; color: #4a3f2f; display: flex; align-items: center; gap: 8px; }
        .feat::before { content: '✓'; color: #3d8f6a; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; }
        .pcard.hi .feat { color: #c0b0a0; }
        .pcard.hi .feat::before { color: #5aaf88; }
        .pbtn { width: 100%; padding: 11px; border-radius: 9px; font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; transition: background 0.15s; margin-top: 16px; flex-shrink: 0; }
        .pbtn-light { background: #f5f0e8; color: #1e1810; }
        .pbtn-light:hover { background: #fff; }
        .pbtn-plain { background: rgba(180,160,130,0.15); color: #4a3f2f; border: 1px solid rgba(180,160,130,0.3); }
        .pbtn-plain:hover { background: rgba(180,160,130,0.28); }
        .pbtn-dis { background: rgba(180,160,130,0.08); color: #c0b0a0; border: 1px solid rgba(180,160,130,0.2); cursor: default; }
      `}</style>

      <div className="pg">
        <div>
          <div className="pg-title">Account</div>
          <div className="pg-sub">Manage your profile, company details, and billing</div>
        </div>

        <div className="tabs">
          {(['profile','company','billing'] as const).map(t => (
            <button key={t} className={`tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        <div className="panel">

          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <div className="form-card">
              <div>
                <div className="form-section-title">Profile</div>
                <div className="form-section-sub">Your personal login details</div>
              </div>
              <div className="field-grid">
                <div className="field">
                  <label>Full name</label>
                  <input type="text" placeholder="Jane Dupont" value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))}/>
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="jane@company.com" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))}/>
                </div>
                <div className="field">
                  <label>New password</label>
                  <input type="password" placeholder="Leave blank to keep current"/>
                </div>
                <div className="field">
                  <label>Confirm password</label>
                  <input type="password" placeholder="Repeat new password"/>
                </div>
              </div>
              <div className="save-row">
                <button className="save-btn">Save changes</button>
              </div>
            </div>
          )}

          {/* COMPANY TAB */}
          {tab === 'company' && (
            <div className="form-card">
              <div>
                <div className="form-section-title">Company Information</div>
                <div className="form-section-sub">This information appears on all generated EPR reports</div>
              </div>
              <form onSubmit={saveCompany} style={{display:'flex',flexDirection:'column',gap:'18px',flex:1}}>
                <div className="field-grid">
                  <div className="field">
                    <label>Company name</label>
                    <input type="text" placeholder="Acme GmbH" value={company.name} onChange={e=>setCompany(c=>({...c,name:e.target.value}))} required/>
                  </div>
                  <div className="field">
                    <label>VAT number</label>
                    <input type="text" placeholder="DE123456789" value={company.vat} onChange={e=>setCompany(c=>({...c,vat:e.target.value}))} required/>
                  </div>
                  <div className="field">
                    <label>Registration country</label>
                    <select value={company.country} onChange={e=>setCompany(c=>({...c,country:e.target.value}))} required>
                      <option value="">Select country</option>
                      {euCountries.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Business address</label>
                    <input type="text" placeholder="123 Hauptstraße, Berlin" value={company.address} onChange={e=>setCompany(c=>({...c,address:e.target.value}))}/>
                  </div>
                </div>
                <div className="form-note">
                  <strong>Why this matters:</strong> Your company name, VAT number, and country are embedded into every AI-generated EPR report to ensure regulatory compliance across DE, FR, and BE.
                </div>
                <div className="save-row">
                  <button className="save-btn" type="submit">Save company info</button>
                  {saved && <div className="saved-msg">✓ Saved</div>}
                </div>
              </form>
            </div>
          )}

          {/* BILLING TAB */}
          {tab === 'billing' && (
            <div className="billing-wrap">
              <div className="toggle-row">
                <span className={`toggle-label${!annual?' on':''}`}>Monthly</span>
                <label className="toggle">
                  <input type="checkbox" checked={annual} onChange={()=>setAnnual(a=>!a)}/>
                  <div className={`track${annual?' on':''}`}/>
                  <div className={`thumb${annual?' on':''}`}/>
                </label>
                <span className={`toggle-label${annual?' on':''}`}>Annually</span>
                <div className={`save-badge${annual?' show':''}`}>Save ~32%</div>
              </div>
              <div className="plan-grid">
                {plans.map(p => {
                  const price = annual ? p.price.annual : p.price.monthly
                  const per = annual ? p.period.annual : p.period.monthly
                  const equiv = p.name==='Compliant' && annual ? '≈ €33/month'
                    : p.name==='Compliant' && !annual ? '€400/year if billed annually' : ''
                  return (
                    <div key={p.name} className={`pcard${p.highlight?' hi':''}`}>
                      <div className="pname">{p.name}</div>
                      {p.current && <div className="curr-tag">Current plan</div>}
                      <div className="p-price">{price}<span>{per}</span></div>
                      <div className="p-equiv">{equiv}</div>
                      <div className="p-desc">{p.desc}</div>
                      <div className="feats">{p.features.map(f=><div key={f} className="feat">{f}</div>)}</div>
                      {p.current
                        ? <button className="pbtn pbtn-dis" disabled>Active</button>
                        : <button className={`pbtn ${p.highlight?'pbtn-light':'pbtn-plain'}`} onClick={()=>upgrade(p.name)}>
                            {p.name==='Enterprise' ? 'Contact us →' : 'Upgrade to Compliant →'}
                          </button>
                      }
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
