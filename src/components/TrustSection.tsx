import React from 'react';

export const TrustSection: React.FC = () => {
  const points = [
    {
      icon: 'shield_person',
      title: 'Role-based access control',
      desc: 'Collectors only see their own slips. Admins see the full picture. Nobody sees more than they should.',
    },
    {
      icon: 'history',
      title: 'Complete audit trail',
      desc: 'Every slip, every expense, every edit is logged with timestamp and user ID. Full traceability.',
    },
    {
      icon: 'wifi_off',
      title: 'Offline-first architecture',
      desc: 'Generate receipts without internet. Data syncs automatically when connectivity returns.',
    },
    {
      icon: 'database',
      title: 'Your data, your mandal',
      desc: 'All data belongs to your mandal. Export anytime. Delete anytime. No vendor lock-in.',
    },
  ];

  return (
    <section id="trust" className="section-padding" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border-light)' }}>
      <div className="container-main">
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 64px' }}>
          <h2 className="t-h2" style={{ marginBottom: 16 }}>
            Your mandal handles real money.<br />We built for that responsibility.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '48px 64px' }} className="trust-grid">
          {points.map((point, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'var(--saffron-light)', color: 'var(--saffron)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{point.icon}</span>
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>{point.title}</h3>
                <p className="t-body" style={{ maxWidth: 380 }}>{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .trust-grid { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 768px) {
          .trust-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  );
};
