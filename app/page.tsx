'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
          background: #080d14;
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }

        /* subtle noise texture overlay */
        .wrap::before {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.35; pointer-events: none; z-index: 1;
        }

        /* grid */
        .grid {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        /* orbs */
        .orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(100px);
        }
        .o1 { width: 560px; height: 560px; background: #1d4ed8; opacity: 0.12; top: -180px; right: -120px; }
        .o2 { width: 420px; height: 420px; background: #065f46; opacity: 0.14; bottom: -140px; left: -100px; }
        .o3 { width: 280px; height: 280px; background: #4338ca; opacity: 0.1; top: 38%; left: 32%; }

        /* cubes */
        .cube {
          position: absolute; transform-style: preserve-3d;
          animation: rotateCube linear infinite;
        }
        @keyframes rotateCube {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to   { transform: rotateX(360deg) rotateY(360deg); }
        }

        /* floating chips */
        .chip {
          position: absolute; z-index: 5;
          display: flex; align-items: center; gap: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px; padding: 9px 15px;
          color: #cbd5e1; font-size: 12.5px; font-weight: 500;
          backdrop-filter: blur(16px);
          animation: chipFloat ease-in-out infinite;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .chip-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .chip-dot.g { background: #10b981; box-shadow: 0 0 8px #10b981; }
        .chip-dot.b { background: #3b82f6; box-shadow: 0 0 8px #3b82f6; }
        .ch1 { top: 16%; left: 4%; animation-duration: 7s; animation-delay: 0s; }
        .ch2 { top: 24%; right: 4%; animation-duration: 8s; animation-delay: 1s; }
        .ch3 { bottom: 24%; left: 4%; animation-duration: 6.5s; animation-delay: 2s; }
        .ch4 { bottom: 16%; right: 4%; animation-duration: 9s; animation-delay: 3s; }
        @keyframes chipFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }

        /* main content */
        .content {
          position: relative; z-index: 10;
          text-align: center; max-width: 660px; padding: 0 24px;
        }

        .tag {
          display: inline-block;
          border: 1px solid rgba(59,130,246,0.3);
          color: #60a5fa; font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px;
          background: rgba(59,130,246,0.08);
          margin-bottom: 26px;
        }

        h1 {
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          font-weight: 800; line-height: 1.08;
          letter-spacing: -0.04em; color: #f1f5f9;
          margin-bottom: 18px;
        }
        h1 em {
          font-style: normal;
          background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .desc {
          color: #64748b; font-size: 1rem; line-height: 1.75;
          max-width: 480px; margin: 0 auto 32px;
        }

        .stats {
          display: flex; gap: 12px; justify-content: center; margin-bottom: 32px;
        }
        .stat {
          flex: 1; max-width: 130px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 14px 10px;
        }
        .sv { font-size: 1.65rem; font-weight: 800; color: #e2e8f0; line-height: 1; }
        .sl { font-size: 10.5px; color: #475569; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 5px; }

        .btn {
          display: inline-block;
          background: #2563eb;
          color: #fff; font-size: 0.95rem; font-weight: 600;
          padding: 14px 34px; border: none; border-radius: 10px;
          cursor: pointer; letter-spacing: 0.01em;
          box-shadow: 0 0 0 1px rgba(37,99,235,0.5), 0 8px 32px rgba(37,99,235,0.35);
          transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
        }
        .btn:hover {
          background: #1d4ed8;
          box-shadow: 0 0 0 1px rgba(37,99,235,0.7), 0 12px 40px rgba(37,99,235,0.5);
          transform: translateY(-1px);
        }
        .btn:active { transform: translateY(0); }

        /* modal */
        .overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .modal {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 36px 32px;
          width: 100%; max-width: 380px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          position: relative;
        }
        .modal-close {
          position: absolute; top: 14px; right: 18px;
          background: none; border: none; color: #475569;
          font-size: 20px; cursor: pointer; line-height: 1;
          transition: color 0.15s;
        }
        .modal-close:hover { color: #94a3b8; }
        .modal h2 { color: #f1f5f9; font-size: 1.25rem; font-weight: 700; margin-bottom: 6px; }
        .modal-sub { color: #475569; font-size: 0.875rem; margin-bottom: 26px; }
        .modal input {
          display: block; width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 9px; padding: 13px 14px;
          color: #e2e8f0; font-size: 0.9rem;
          margin-bottom: 12px; outline: none;
          transition: border-color 0.15s;
        }
        .modal input:focus { border-color: rgba(59,130,246,0.6); }
        .modal input::placeholder { color: #334155; }
        .modal-btn {
          width: 100%; background: #2563eb; color: #fff;
          font-size: 0.9rem; font-weight: 600; padding: 13px;
          border: none; border-radius: 9px; cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          margin-top: 4px;
        }
        .modal-btn:hover:not(:disabled) { background: #1d4ed8; }
        .modal-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .modal-err { color: #f87171; font-size: 0.82rem; margin-top: 12px; }
        .modal-note { color: #334155; font-size: 0.78rem; text-align: center; margin-top: 14px; }
      `}</style>

      <div className="wrap">
        <div className="grid" />
        <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />

        {/* 3D cubes */}
        {cubes.map(({ cls, s, top, left, right, bottom, dur, dir }) => (
          <div
            key={cls}
            className="cube"
            style={{
              width: s, height: s,
              top, left, right, bottom,
              animationDuration: dur,
              animationDirection: (dir as any) || 'normal',
            }}
          >
            {faces.map(f => (
              <div
                key={f}
                style={{
                  position: 'absolute', width: '100%', height: '100%',
                  border: '1px solid rgba(148,163,184,0.18)',
                  background: 'rgba(148,163,184,0.03)',
                  transform: faceTransform(f, s),
                }}
              />
            ))}
          </div>
        ))}

        {/* chips */}
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

          <button className="btn" onClick={() => setShowModal(true)}>
            Start free trial
          </button>
        </div>
      </div>

      {showModal && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Create your account</h2>
            <p className="modal-sub">14-day free trial · no card needed</p>
            <form onSubmit={handleSignup}>
              <input
                type="email" placeholder="Work email"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
              <input
                type="password" placeholder="Password (8+ characters)"
                value={password} onChange={e => setPassword(e.target.value)}
                required minLength={8}
              />
              <button className="modal-btn" type="submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Get started →'}
              </button>
              {error && <div className="modal-err">⚠ {error}</div>}
            </form>
            <p className="modal-note">By signing up you agree to our terms of service.</p>
          </div>
        </div>
      )}
    </>
  )
}
