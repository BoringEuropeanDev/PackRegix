'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [email, setEmail] = useState('')
  const [showModal, setShowModal] = useState(false)
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
      if (!res.ok) throw new Error(data.error || 'Signup failed')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; overflow: hidden; }

        .scene {
          width: 100vw; height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2744 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }

        /* Animated grid */
        .grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(99,179,237,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,179,237,0.07) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 20s linear infinite;
        }
        @keyframes gridMove {
          0% { transform: perspective(800px) rotateX(20deg) translateY(0); }
          100% { transform: perspective(800px) rotateX(20deg) translateY(60px); }
        }

        /* Glow orbs */
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.25; pointer-events: none;
        }
        .orb-1 { width: 500px; height: 500px; background: #3b82f6; top: -150px; right: -100px; animation: float1 8s ease-in-out infinite; }
        .orb-2 { width: 350px; height: 350px; background: #10b981; bottom: -100px; left: -80px; animation: float2 10s ease-in-out infinite; }
        .orb-3 { width: 250px; height: 250px; background: #6366f1; top: 40%; left: 30%; animation: float3 7s ease-in-out infinite; }
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-30px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(25px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0px) translateX(0px)} 50%{transform:translateY(-20px) translateX(15px)} }

        /* 3D floating cubes */
        .cube { position: absolute; transform-style: preserve-3d; animation: spin 12s linear infinite; }
        .cube-1 { top: 12%; left: 8%; width: 50px; height: 50px; animation-duration: 14s; }
        .cube-2 { top: 20%; right: 10%; width: 35px; height: 35px; animation-duration: 10s; animation-direction: reverse; }
        .cube-3 { bottom: 20%; left: 15%; width: 28px; height: 28px; animation-duration: 18s; }
        .cube-4 { bottom: 15%; right: 12%; width: 42px; height: 42px; animation-duration: 11s; }
        .cube face {
          position: absolute; width: 100%; height: 100%;
          border: 1.5px solid rgba(99,179,237,0.4);
          background: rgba(99,179,237,0.05);
        }
        .cube .front  { transform: translateZ(calc(var(--s)/2)); }
        .cube .back   { transform: rotateY(180deg) translateZ(calc(var(--s)/2)); }
        .cube .left   { transform: rotateY(-90deg) translateZ(calc(var(--s)/2)); }
        .cube .right  { transform: rotateY(90deg) translateZ(calc(var(--s)/2)); }
        .cube .top    { transform: rotateX(90deg) translateZ(calc(var(--s)/2)); }
        .cube .bottom { transform: rotateX(-90deg) translateZ(calc(var(--s)/2)); }
        @keyframes spin {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to   { transform: rotateX(360deg) rotateY(360deg); }
        }

        /* Floating badges */
        .badge {
          position: absolute; background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 10px 16px; color: #e2e8f0; font-size: 13px;
          font-weight: 600; display: flex; align-items: center; gap: 8px;
          animation: badgeFloat 6s ease-in-out infinite;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .badge-1 { top: 18%; left: 5%; animation-delay: 0s; }
        .badge-2 { top: 28%; right: 5%; animation-delay: 1.5s; }
        .badge-3 { bottom: 28%; left: 5%; animation-delay: 3s; }
        .badge-4 { bottom: 18%; right: 5%; animation-delay: 4.5s; }
        .badge-dot { width: 8px; height: 8px; border-radius: 50%; }
        .badge-dot.green { background: #10b981; box-shadow: 0 0 6px #10b981; }
        .badge-dot.blue  { background: #3b82f6; box-shadow: 0 0 6px #3b82f6; }
        @keyframes badgeFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }

        /* Main content */
        .content {
          position: relative; z-index: 10; text-align: center;
          max-width: 680px; padding: 0 24px;
        }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.35);
          border-radius: 100px; padding: 6px 16px; color: #93c5fd;
          font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 28px;
        }
        h1 {
          font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800; line-height: 1.1;
          color: #f8fafc; margin-bottom: 20px; letter-spacing: -0.03em;
        }
        h1 span { background: linear-gradient(135deg, #3b82f6, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .sub {
          font-size: 1.05rem; color: #94a3b8; line-height: 1.7; margin-bottom: 36px; max-width: 520px; margin-left: auto; margin-right: auto;
        }
        .stats {
          display: flex; gap: 20px; justify-content: center; margin-bottom: 36px;
        }
        .stat {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 16px 24px; min-width: 120px;
        }
        .stat-val { font-size: 1.8rem; font-weight: 800; color: #f8fafc; }
        .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
        .cta-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white; font-size: 1rem; font-weight: 700; padding: 16px 36px;
          border: none; border-radius: 12px; cursor: pointer;
          box-shadow: 0 0 40px rgba(59,130,246,0.4);
          transition: all 0.2s; letter-spacing: 0.01em;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(59,130,246,0.6); }

        /* Modal */
        .overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px); z-index: 100;
          display: flex; align-items: center; justify-content: center;
        }
        .modal {
          background: #1e293b; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; padding: 40px; width: 100%; max-width: 400px;
          box-shadow: 0 25px 80px rgba(0,0,0,0.5);
        }
        .modal h2 { color: #f8fafc; font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; }
        .modal p  { color: #64748b; font-size: 0.9rem; margin-bottom: 28px; }
        .modal input {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px; padding: 14px 16px; color: #f8fafc; font-size: 0.95rem;
          margin-bottom: 14px; outline: none; transition: border 0.2s;
        }
        .modal input:focus { border-color: #3b82f6; }
        .modal input::placeholder { color: #475569; }
        .modal-btn {
          width: 100%; background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white; font-size: 0.95rem; font-weight: 700; padding: 14px;
          border: none; border-radius: 10px; cursor: pointer; margin-top: 4px;
          transition: opacity 0.2s;
        }
        .modal-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .modal-error { color: #f87171; font-size: 0.85rem; margin-top: 10px; }
        .modal-close {
          background: none; border: none; color: #64748b; font-size: 1.4rem;
          position: absolute; top: 16px; right: 20px; cursor: pointer; line-height: 1;
        }
      `}</style>

      <div className="scene">
        <div className="grid-bg" />
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

        {/* 3D Cubes */}
        {[['cube-1','50'],['cube-2','35'],['cube-3','28'],['cube-4','42']].map(([cls,s])=>(
          <div key={cls} className={`cube ${cls}`} style={{'--s': `${s}px`} as any}>
            {['front','back','left','right','top','bottom'].map(f=><face key={f} className={f}/>)}
          </div>
        ))}

        {/* Floating badges */}
        <div className="badge badge-1"><div className="badge-dot green"/><span>🇩🇪 LUCID Filed</span></div>
        <div className="badge badge-2"><div className="badge-dot blue"/><span>🇫🇷 CITEO Ready</span></div>
        <div className="badge badge-3"><div className="badge-dot green"/><span>🇧🇪 Fost Plus ✓</span></div>
        <div className="badge badge-4"><div className="badge-dot blue"/><span>Report Generated</span></div>

        {/* Main content */}
        <div className="content">
          <div className="eyebrow">⚡ EU EPR Compliance Platform</div>
          <h1>Automate <span>EU Packaging</span> Compliance</h1>
          <p className="sub">Track packaging waste and file reports across Germany, France, and Belgium — in minutes, not days.</p>

          <div className="stats">
            <div className="stat"><div className="stat-val">32</div><div className="stat-label">Hours Saved/mo</div></div>
            <div className="stat"><div className="stat-val">3</div><div className="stat-label">Countries</div></div>
            <div className="stat"><div className="stat-val">99%</div><div className="stat-label">Accuracy</div></div>
          </div>

          <button className="cta-btn" onClick={() => setShowModal(true)}>
            Start Compliance Trial →
          </button>
        </div>
      </div>

      {/* Signup Modal */}
      {showModal && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{position:'relative'}}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Start Your Free Trial</h2>
            <p>14 days free · No credit card required</p>
            <form onSubmit={handleSignup}>
              <input type="email" placeholder="Work email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <input type="password" placeholder="Create password (8+ chars)" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} />
              <button className="modal-btn" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Free Account →'}
              </button>
              {error && <div className="modal-error">⚠️ {error}</div>}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
