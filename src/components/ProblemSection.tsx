import React from 'react';

export const ProblemSection: React.FC = () => {
  return (
    <section className="section-padding" style={{ background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
      <div className="container-main">
        {/* Top Header Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
            alignItems: 'center',
            marginBottom: 56,
          }}
        >
          <div>
            <div className="festive-badge" style={{ marginBottom: 16 }}>
              <span>🚩</span>
              <span>Built for Festival Committees</span>
            </div>
            <h2 className="t-h2">
              A Platform Built Around <br />
              <span className="gold-gradient-text">
                Your Mandal's Trust
              </span>
            </h2>
          </div>

          <div style={{ maxWidth: 520 }}>
            <p className="t-body" style={{ color: '#64748b', marginBottom: 20 }}>
              Paper receipt books weren't built for modern festival operations. Every season, committees struggle with handwritten books, cash tracking across multiple collectors, and misplaced donor lists.
            </p>
            <a
              href="#how-it-works"
              className="btn-festive-secondary"
              style={{ padding: '10px 22px', fontSize: 14 }}
            >
              <span>Learn How It Works</span>
              <span style={{ fontSize: 14, color: '#ea580c' }}>➔</span>
            </a>
          </div>
        </div>

        {/* 3 Featured Feature Cards */}
        <div className="grid-responsive-3">
          {/* Card 1 */}
          <div className="festive-card" style={{ padding: 28 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                fontSize: 24
              }}
            >
              📲
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
              Instant WhatsApp Slips
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
              Every contribution generates an authentic digital slip with a unique serial number sent directly to the donor's WhatsApp number.
            </p>
          </div>

          {/* Card 2 */}
          <div className="festive-card" style={{ padding: 28 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                fontSize: 24
              }}
            >
              📊
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
              Real-Time Financial Tally
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
              The president and committee members see live collection totals, member rankings, and area statistics on a single live dashboard.
            </p>
          </div>

          {/* Card 3 */}
          <div className="festive-card" style={{ padding: 28 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                fontSize: 24
              }}
            >
              ⚖️
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
              Auditable Expense Records
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
              Log mandap, prasad, and festival expenses with photos. Always know your live Mandal net balance — total collected minus spent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
