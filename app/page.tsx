'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [showSignup, setShowSignup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [vat, setVat] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function resetModal() {
    setEmail(''); setPassword(''); setCompany(''); setVat(''); setError(''); setLoading(false)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, company, vat }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const faces = ['front','back','left','right','top','bottom']
  const cubes = [
    { cls: 'c1', s: 48, top: '11%', left: '7%', dur: '14s' },
    { cls: 'c2', s: 32, top: '18%', right: '9%', dur: '10s', dir: 'reverse' },
    { cls: 'c3', s: 24, bottom: '22%', left: '12%', dur: '18s' },
    { cls: 'c4', s: 40, bottom: '14%', right: '10%', dur: '12s', dir: 'reverse' },
  ]

  function faceTransform(f: string, s: number) {
    const h = `${s / 2}px`
    if (f === 'front')  return `translateZ(${h})`
    if (f === 'back')   return `rotateY(180deg) translateZ(${h})`
    if (f === 'left')   return `rotateY(-90deg) translateZ(${h})`
    if (f === 'right')  return `rotateY(90deg) translateZ(${h})`
    if (f === 'top')    return `rotateX(90deg) translateZ(${h})`
    return `rotateX(-90deg) translateZ(${h})`
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        .wrap {
          width: 100vw; height: 100vh; overflow: hidden;
          background: #e8e4dc;
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .wrap::before {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          opacity: 0.5; pointer-events: none; z-index: 1;
        }
        .grid {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(60,50,30,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(60,50,30,0.07) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px); }
        .o1 { width: 560px; height: 560px; background: #b5a898; opacity: 0.35; top: -200px; right: -120px; }
        .o2 { width: 420px; height: 420px; background: #9db5a0; opacity: 0.3; bottom: -140px; left: -100px; }
        .o3 { width: 280px; height: 280px; background: #c4b49a; opacity: 0.25; top: 38%; left: 32%; }

        .cube { position: absolute; transform-style: preserve-3d; animation: rotateCube linear infinite; }
        @keyframes rotateCube {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to   { transform: rotateX(360deg) rotateY(360deg); }
        }

        .chip {
          position: absolute; z-index: 5;
          display: flex; align-items: center; gap: 9px;
          background: rgba(255,252,245,0.55);
          border: 1px solid rgba(180,160,130,0.3);
          border-radius: 10px; padding: 9px 15px;
          color: #4a3f2f; font-size: 12.5px; font-weight: 500;
          backdrop-filter: blur(16px);
          animation: chipFloat ease-in-out infinite;
          box-shadow: 0 4px 20px rgba(100,80,40,0.1);
        }
        .chip-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .chip-dot.g { background: #3d8f6a; box-shadow: 0 0 6px #3d8f6a; }
        .chip-dot.b { background: #4a7ab5; box-shadow: 0 0 6px #4a7ab5; }
        .ch1 { top: 16%; left: 4%; animation-duration: 7s; animation-delay: 0s; }
        .ch2 { top: 24%; right: 4%; animation-duration: 8s; animation-delay: 1s; }
        .ch3 { bottom: 24%; left: 4%; animation-duration: 6.5s; animation-delay: 2s; }
        .ch4 { bottom: 16%; right: 4%; animation-duration: 9s; animation-delay: 3s; }
        @keyframes chipFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }

        .content {
          position: relative; z-index: 10;
          text-align: center; max-width: 660px; padding: 0 24px;
        }
        .tag {
          display: inline-block;
          border: 1px solid rgba(100,80,40,0.2); color: #6b5230;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 5px 14px; border-radius: 100px;
          background: rgba(180,150,100,0.12); margin-bottom: 26px;
        }
        h1 {
          font-size: clamp(2.2rem, 4.5vw, 3.6rem); font-weight: 800;
          line-height: 1.08; letter-spacing: -0.04em; color: #1e1810; margin-bottom: 18px;
        }
        h1 em {
          font-style: normal;
          background: linear-gradient(90deg, #2d5fa6 0%, #1e8c6e 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .desc {
          color: #7a6a55; font-size: 1rem; line-height: 1.75;
          max-width: 480px; margin: 0 auto 32px;
        }
        .stats { display: flex; gap: 12px; justify-content: center; margin-bottom: 36px; }
        .stat {
          flex: 1; max-width: 130px;
          background: rgba(255,252,245,0.5); border: 1px solid rgba(180,160,130,0.25);
          border-radius: 12px; padding: 14px 10px; backdrop-filter: blur(8px);
        }
        .sv { font-size: 1.65rem; font-weight: 800; color: #1e1810; line-height: 1; }
        .sl { font-size: 10.5px; color: #9a8a72; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 5px; }

        .cta-row { display: flex; gap: 12px; justify-content: center; align-items: center; }
        .btn-primary {
          background: #1e1810; color: #f5f0e8; font-size: 0.95rem; font-weight: 600;
          padding: 14px 30px; border: none; border-radius: 10px; cursor: pointer;
          box-shadow: 0 4px 20px rgba(30,24,16,0.25);
          transition: background 0.15s, transform 0.1s; white-space: nowrap;
        }
        .btn-primary:hover { background: #3a2e1e; transform: translateY(-1px); }
        .btn-secondary {
          background: rgba(255,252,245,0.6); color: #4a3f2f; font-size: 0.95rem; font-weight: 500;
          padding: 14px 26px; border: 1px solid rgba(180,160,130,0.35); border-radius: 10px;
          cursor: pointer; backdrop-filter: blur(8px);
          transition: background 0.15s, transform 0.1s; white-space: nowrap;
        }
        .btn-secondary:hover { background: rgba(255,252,245,0.85); transform: translateY(-1px); }

        .overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(20,15,8,0.5); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .modal {
          background: #faf7f2; border: 1px solid rgba(180,160,130,0.3);
          border-radius: 18px; padding: 36px 32px; width: 100%; max-width: 400px;
          box-shadow: 0 32px 80px rgba(20,15,8,0.25); position: relative;
        }
        .modal-close {
          position: absolute; top: 14px; right: 18px;
          background: none; border: none; color: #a09080;
          font-size: 20px; cursor: pointer; line-height: 1; transition: color 0.15s;
        }
        .modal-close:hover { color: #4a3f2f; }
        .modal h2 { color: #1e1810; font-size: 1.25rem; font-weight: 700; margin-bottom: 6px; }
        .modal-sub { color: #9a8a72; font-size: 0.875rem; margin-bottom: 24px; }
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
        .modal input {
          display: block; width: 100%;
          background: #fff; border: 1px solid rgba(180,160,130,0.35);
          border-radius: 9px; padding: 12px 14px; color: #1e1810; font-size: 0.9rem;
          margin-bottom: 10px; outline: none; transition: border-color 0.15s;
        }
        .input-row input { margin-bottom: 0; }
        .modal input:focus { border-color: #4a7ab5; }
        .modal input::placeholder { color: #c0b09a; }
        .modal-btn {
          width: 100%; background: #1e1810; color: #f5f0e8;
          font-size: 0.9rem; font-weight: 600; padding: 13px;
          border: none; border-radius: 9px; cursor: pointer;
          transition: background 0.15s, opacity 0.15s; margin-top: 4px;
        }
        .modal-btn:hover:not(:disabled) { background: #3a2e1e; }
        .modal-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .modal-err { color: #b94040; font-size: 0.82rem; margin-top: 10px; }
        .modal-note { color: #b0a090; font-size: 0.78rem; text-align: center; margin-top: 14px; }
        .modal-switch { color: #7a6a55; font-size: 0.82rem; text-align: center; margin-top: 10px; }
        .modal-switch button {
          background: none; border: none; color: #2d5fa6;
          font-size: 0.82rem; cursor: pointer; padding: 0; text-decoration: underline;
        }
      `}</style>

      <div className="wrap">
        <div className="grid" />
        <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />

        {cubes.map(({ cls, s, top, left, right, bottom, dur, dir }: any) => (
          <div key={cls} className="cube" style={{
            width: s, height: s, top, left, right, bottom,
            animationDuration: dur, animationDirection: dir || 'normal',
          }}>
            {faces.map(f => (
              <div key={f} style={{
                position: 'absolute', width: '100%', height: '100%',
                border: '1px solid rgba(100,80,40,0.2)',
                background: 'rgba(180,150,100,0.04)',
                transform: faceTransform(f, s),
              }}/>
            ))}
          </div>
        ))}

        <div className="chip ch1"><div className="chip-dot g"/>🇩🇪 LUCID filed</div>
        <div className="chip ch2"><div className="chip-dot b"/>🇫🇷 CITEO ready</div>
        <div className="chip ch3"><div className="chip-dot g"/>🇧🇪 Fost Plus ✓</div>
        <div className="chip ch4"><div className="chip-dot b"/>Report exported</div>

        <div className="content">
          <div className="tag">EU EPR Compliance</div>
          <h1>Stop doing<br/>compliance <em>manually</em></h1>
          <p className="desc">
            PackRegix tracks your packaging data and auto-generates EPR reports
            for Germany, France, and Belgium — ready to submit in minutes.
          </p>
          <div className="stats">
            <div className="stat"><div className="sv">32h</div><div className="sl">saved / month</div></div>
            <div className="stat"><div className="sv">3</div><div className="sl">countries</div></div>
            <div className="stat"><div className="sv">99%</div><div className="sl">accuracy</div></div>
          </div>
          <div className="cta-row">
            <button className="btn-primary" onClick={() => { resetModal(); setShowSignup(true) }}>
              Get compliant today →
            </button>
            <button className="btn-secondary" onClick={() => { resetModal(); setShowLogin(true) }}>
              Sign in
            </button>
          </div>
        </div>
      </div>

      {showSignup && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setShowSignup(false) }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowSignup(false)}>×</button>
            <h2>Create your account</h2>
            <p className="modal-sub">14-day free trial · full access · no card needed</p>
            <form onSubmit={handleSignup}>
              <div className="input-row">
                <input type="text" placeholder="Company name" value={company} onChange={e => setCompany(e.target.value)} required />
                <input type="text" placeholder="VAT number" value={vat} onChange={e => setVat(e.target.value)} required />
              </div>
              <input type="email" placeholder="Work email" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password (8+ characters)" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
              <button className="modal-btn" type="submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Start free trial →'}
              </button>
              {error && <div className="modal-err">⚠ {error}</div>}
            </form>
            <p className="modal-note">By signing up you agree to our terms of service.</p>
            <p className="modal-switch">
              Already have an account?{' '}
              <button onClick={() => { resetModal(); setShowSignup(false); setShowLogin(true) }}>Sign in</button>
            </p>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setShowLogin(false) }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowLogin(false)}>×</button>
            <h2>Welcome back</h2>
            <p className="modal-sub">Sign in to your workspace</p>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              <button className="modal-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in →'}
              </button>
              {error && <div className="modal-err">⚠ {error}</div>}
            </form>
            <p className="modal-switch">
              No account yet?{' '}
              <button onClick={() => { resetModal(); setShowLogin(false); setShowSignup(true) }}>Start free trial</button>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
