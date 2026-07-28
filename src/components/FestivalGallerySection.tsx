import React from 'react';

export const FestivalGallerySection: React.FC = () => {
  return (
    <section id="festivals" className="section-padding" style={{ background: '#fffdfa', borderTop: '1px solid #f1f5f9' }}>
      <div className="container-main">
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 48px' }}>
          <div className="festive-badge" style={{ marginBottom: 16 }}>
            <span>🌺</span>
            <span>Multi-Festival Support</span>
          </div>
          <h2 className="t-h2" style={{ marginBottom: 16 }}>
            Built for Ganesh Utsav.<br />Ready for Every Celebration.
          </h2>
          <p className="t-body-lg">
            Whether managing a 10-day Ganesh Utsav, Navratri Garba, Shiv Jayanti, or Durga Puja — Digital Vargani adapts seamlessly to your committee's workflow.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20
        }}>
          {[
            { title: 'श्री गणेशोत्सव', sub: '10-Day Grand Festival', icon: '🌺', bg: '#ffedd5', color: '#ea580c', primary: true, desc: '8,400+ Mandals Active' },
            { title: 'नवरात्र उत्सव', sub: '9 Nights Garba & Puja', icon: '🪔', bg: '#fef3c7', color: '#d97706', primary: false, desc: '3,200+ Mandals Active' },
            { title: 'दहीहंडी उत्सव', sub: 'Gokulashtami Pathak', icon: '🪴', bg: '#e0f2fe', color: '#0284c7', primary: false, desc: '1,500+ Pathaks Active' },
            { title: 'शिवजयंती उत्सव', sub: 'Social Welfare & Rally', icon: '🚩', bg: '#fff7ed', color: '#ea580c', primary: false, desc: 'Community Drives' },
          ].map((fest, i) => (
            <div key={i} className="festive-card" style={{
              padding: 24, textAlign: 'center',
              border: fest.primary ? '2px solid #ea580c' : '1px solid #fed7aa',
              background: fest.primary ? '#fff7ed' : '#ffffff',
              boxShadow: fest.primary ? '0 12px 28px rgba(234, 88, 12, 0.15)' : 'none',
            }}>
              {fest.primary && (
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  background: '#ea580c', color: '#ffffff', fontSize: 10, fontWeight: 800,
                  padding: '3px 12px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.06em',
                  boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)'
                }}>POPULAR</div>
              )}
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
                background: fest.bg, color: fest.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, border: '1px solid #fed7aa'
              }}>
                {fest.icon}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{fest.title}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#ea580c', marginBottom: 6 }}>{fest.sub}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{fest.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
