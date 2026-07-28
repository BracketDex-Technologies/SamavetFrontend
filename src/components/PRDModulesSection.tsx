import React, { useState } from 'react';

export const RoleWorkflow: React.FC = () => {
  const [active, setActive] = useState<'admin' | 'collector' | 'donor'>('admin');

  const roles = {
    admin: {
      label: 'Mandal Admin',
      icon: 'dashboard',
      desc: 'Full visibility. Manage members, configure receipts, track expenses, and monitor collection in real time. Export reports for committee meetings.',
      features: [
        'Real-time collection tally & expense tracking',
        'Member management & role assignments',
        'Receipt template configuration',
        'Data export (PDF/Excel) for local authorities',
      ],
      mockup: (
        <div style={{
          background: 'var(--white)', borderRadius: 16, padding: 20,
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-elevated)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--saffron-light)', color: 'var(--saffron)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>J</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Jai Ganesh Mandal</span>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--muted)' }}>settings</span>
          </div>
          <div style={{ background: 'var(--saffron-bg)', borderRadius: 12, padding: 20, border: '1px solid var(--saffron-light)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--saffron-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Net Balance</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--saffron-dark)', fontFamily: 'var(--font-display)', marginBottom: 10 }}>₹ 8,45,000</div>
            <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
              <div><span style={{ color: 'var(--muted)' }}>In:</span> <span style={{ fontWeight: 600, color: 'var(--ink)' }}>12.5L</span></div>
              <div><span style={{ color: 'var(--muted)' }}>Out:</span> <span style={{ fontWeight: 600, color: 'var(--ink)' }}>4.0L</span></div>
            </div>
          </div>
        </div>
      ),
    },
    collector: {
      label: 'Field Collector',
      icon: 'badge',
      desc: 'One-tap slip generation. Works offline. Automatic WhatsApp delivery. Personal collection history and rank on the mandal leaderboard.',
      features: [
        'Rapid slip generation (under 10 seconds)',
        'Automatic WhatsApp receipt sharing',
        'Offline mode with auto-sync',
        'Personal collection history & leaderboard rank',
      ],
      mockup: (
        <div style={{
          width: 240, margin: '0 auto', background: 'var(--cream)', borderRadius: 28, padding: 10,
          border: '4px solid var(--border)', boxShadow: 'var(--shadow-elevated)',
        }}>
          <div style={{ background: 'var(--white)', borderRadius: 20, padding: 20, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e8f5e9', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '12px auto 14px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>check_circle</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>Slip Generated!</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Sent to 98xxxxxx45 via WhatsApp</div>
            <div style={{ background: 'var(--cream)', border: '1px solid var(--border-light)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Amount Collected</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>₹ 5,001</div>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '12px 16px', fontSize: 14 }}>
              New Collection
            </button>
          </div>
        </div>
      ),
    },
    donor: {
      label: 'Donor View',
      icon: 'visibility',
      desc: 'Instant digital receipt via WhatsApp. A "thank you" message with your mandal\'s branding. Trust that their contribution is recorded and accounted for.',
      features: [
        'Instant digital receipts via WhatsApp/SMS',
        'Public dashboard for total mandal collections',
        'Expense visibility (optional by admin)',
        'Easy past-receipt lookup',
      ],
      mockup: (
        <div style={{
          borderRadius: 16, overflow: 'hidden',
          boxShadow: 'var(--shadow-elevated)', border: '1px solid var(--border)', maxWidth: 300, margin: '0 auto',
        }}>
          <div style={{ background: '#075E54', color: 'white', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>temple_hindu</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Jai Ganesh Mandal</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>Verified Business</div>
            </div>
          </div>
          <div style={{ background: '#EFEAE2', padding: '16px', minHeight: 140 }}>
            <div style={{ background: 'white', padding: '12px 14px', borderRadius: '10px 10px 10px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', maxWidth: '88%' }}>
              <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, marginBottom: 8 }}>
                🙏 Thank you for your vargani of <strong>₹5,001</strong>!
              </div>
              <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--saffron-dark)' }}>
                📄 View Digital Receipt
              </div>
            </div>
          </div>
        </div>
      ),
    },
  };

  const current = roles[active];

  return (
    <section className="section-padding" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border-light)' }}>
      <div className="container-main">
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 48px' }}>
          <h2 className="t-h2">One platform, every role.</h2>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 48, background: 'var(--white)', borderRadius: 12, padding: 4, maxWidth: 480, margin: '0 auto 48px', border: '1px solid var(--border)' }}>
          {(Object.keys(roles) as (keyof typeof roles)[]).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                background: active === key ? 'var(--ink)' : 'transparent',
                color: active === key ? 'white' : 'var(--body)',
              }}
            >
              {roles[key].label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="role-content-grid" style={{ display: 'grid', gap: 48, alignItems: 'center', maxWidth: 960, margin: '0 auto' }}>
          <div>
            <p className="t-body-lg" style={{ marginBottom: 24, maxWidth: 460 }}>{current.desc}</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {current.features.map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--body)', fontSize: 15 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--saffron)' }}>done</span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
          <div>{current.mockup}</div>
        </div>
      </div>

      <style>{`
        .role-content-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .role-content-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};
