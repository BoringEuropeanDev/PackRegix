'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FloatingChip {
  id: number;
  text: string;
  x: number;
  y: number;
}

export default function LandingPage() {
  const router = useRouter();
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [chips, setChips] = useState<FloatingChip[]>([]);
  const [nextChipId, setNextChipId] = useState(0);

  // Form states
  const [signupData, setSignupData] = useState({
    company: '',
    vat: '',
    email: '',
    password: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Stats animation
  const [stats, setStats] = useState({ hours: 0, countries: 0, accuracy: 0 });

  useEffect(() => {
    // Animate stats
    const duration = 1500;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setStats({
        hours: Math.round(32 * easeOut),
        countries: Math.round(3 * easeOut),
        accuracy: Math.round(99 * easeOut),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Floating chips
  useEffect(() => {
    const chipTexts = [
      '🇩🇪 LUCID filed',
      '🇫🇷 CITEO ready',
      '🇧🇪 Fost Plus submitted',
      'Q1 report generated',
      'Compliance verified',
      'DE deadline met',
      'FR annual filed',
      'BE packaging logged',
    ];

    const addChip = () => {
      const text = chipTexts[Math.floor(Math.random() * chipTexts.length)];
      const x = 10 + Math.random() * 70;
      const y = 20 + Math.random() * 50;
      
      setChips(prev => [...prev.slice(-4), { id: nextChipId, text, x, y }]);
      setNextChipId(prev => prev + 1);
    };

    addChip();
    const interval = setInterval(addChip, 3500);

    return () => clearInterval(interval);
  }, [nextChipId]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto login after signup
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
        }),
      });

      if (!loginRes.ok) {
        throw new Error('Auto-login failed');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes chipIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes chipOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.9); }
        }
      `}</style>

      {/* Floating Activity Chips */}
      <div style={styles.chipsContainer}>
        {chips.map((chip, index) => (
          <div
            key={chip.id}
            style={{
              ...styles.chip,
              left: `${chip.x}%`,
              top: `${chip.y}%`,
              animation: `chipIn 0.4s ease-out ${index * 0.1}s both, float 4s ease-in-out ${index * 0.5}s infinite`,
            }}
          >
            {chip.text}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logo}>PackRegix</div>

        {/* Hero */}
        <h1 style={styles.title}>
          EU EPR Compliance,
          <br />
          Automated.
        </h1>

        <p style={styles.subtitle}>
          Log packaging. Generate reports. File with confidence.
          <br />
          Germany LUCID, France CITEO, Belgium Fost Plus.
        </p>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statNumber}>{stats.hours}h</div>
            <div style={styles.statLabel}>saved/month</div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.stat}>
            <div style={styles.statNumber}>{stats.countries}</div>
            <div style={styles.statLabel}>countries</div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.stat}>
            <div style={styles.statNumber}>{stats.accuracy}%</div>
            <div style={styles.statLabel}>accuracy</div>
          </div>
        </div>

        {/* CTAs */}
        <div style={styles.ctas}>
          <button
            style={styles.primaryButton}
            onClick={() => setShowSignup(true)}
          >
            Start free trial
          </button>
          <button
            style={styles.secondaryButton}
            onClick={() => setShowLogin(true)}
          >
            Sign in
          </button>
        </div>

        <p style={styles.trialNote}>14-day free trial. No credit card required.</p>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div style={styles.modalOverlay} onClick={() => setShowSignup(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={() => setShowSignup(false)}>
              ×
            </button>
            <h2 style={styles.modalTitle}>Create your account</h2>
            
            {error && <div style={styles.error}>{error}</div>}
            
            <form onSubmit={handleSignup}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Company name</label>
                <input
                  style={styles.input}
                  type="text"
                  value={signupData.company}
                  onChange={e => setSignupData({ ...signupData, company: e.target.value })}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>VAT number</label>
                <input
                  style={styles.input}
                  type="text"
                  value={signupData.vat}
                  onChange={e => setSignupData({ ...signupData, vat: e.target.value })}
                  placeholder="e.g. DE123456789"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  value={signupData.email}
                  onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  value={signupData.password}
                  onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
              
              <button
                style={{ ...styles.primaryButton, width: '100%', marginTop: 8 }}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
            
            <p style={styles.switchText}>
              Already have an account?{' '}
              <button
                style={styles.linkButton}
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                  setError('');
                }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div style={styles.modalOverlay} onClick={() => setShowLogin(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={() => setShowLogin(false)}>
              ×
            </button>
            <h2 style={styles.modalTitle}>Sign in</h2>
            
            {error && <div style={styles.error}>{error}</div>}
            
            <form onSubmit={handleLogin}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              
              <button
                style={{ ...styles.primaryButton, width: '100%', marginTop: 8 }}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            
            <p style={styles.switchText}>
              Don&apos;t have an account?{' '}
              <button
                style={styles.linkButton}
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                  setError('');
                }}
              >
                Start free trial
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#e8e4dc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  chipsContainer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  chip: {
    position: 'absolute',
    backgroundColor: '#faf7f2',
    border: '1px solid rgba(180,160,130,0.28)',
    borderRadius: 20,
    padding: '8px 16px',
    fontSize: '0.8rem',
    color: '#4a3f2f',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    whiteSpace: 'nowrap',
  },
  content: {
    textAlign: 'center',
    zIndex: 1,
    padding: '40px',
    maxWidth: 600,
    animation: 'fadeInUp 0.8s ease-out',
  },
  logo: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1e1810',
    letterSpacing: '-0.02em',
    marginBottom: 48,
  },
  title: {
    fontSize: '3rem',
    fontWeight: 800,
    color: '#1e1810',
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    margin: '0 0 20px 0',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#7a6a55',
    lineHeight: 1.6,
    margin: '0 0 40px 0',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 40,
  },
  stat: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#1e1810',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#9a8a72',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 600,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(180,160,130,0.3)',
  },
  ctas: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#1e1810',
    color: '#f5f0e8',
    border: 'none',
    borderRadius: 8,
    padding: '12px 28px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(180,160,130,0.4)',
    color: '#4a3f2f',
    borderRadius: 8,
    padding: '12px 28px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  trialNote: {
    fontSize: '0.8rem',
    color: '#9a8a72',
    margin: 0,
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(30,24,16,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: '#faf7f2',
    borderRadius: 10,
    padding: '36px',
    width: '100%',
    maxWidth: 400,
    position: 'relative',
    border: '1px solid rgba(180,160,130,0.28)',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#9a8a72',
    cursor: 'pointer',
    padding: 0,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#1e1810',
    margin: '0 0 24px 0',
    letterSpacing: '-0.02em',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: '10px',
    fontWeight: 600,
    color: '#9a8a72',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#f0ece4',
    border: '1px solid rgba(180,160,130,0.35)',
    borderRadius: 8,
    padding: '10px 13px',
    fontSize: '0.9rem',
    color: '#1e1810',
    boxSizing: 'border-box',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  error: {
    backgroundColor: 'rgba(185,64,64,0.08)',
    color: '#b94040',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: '0.85rem',
    marginBottom: 16,
  },
  switchText: {
    fontSize: '0.85rem',
    color: '#7a6a55',
    textAlign: 'center',
    margin: '20px 0 0 0',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#4a7ab5',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  },
};
