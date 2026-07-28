import React from 'react';

export const TrustStrip: React.FC = () => {
  const items = [
    { icon: '🪔', text: '500+ Active Festival Mandals' },
    { icon: '📜', text: '₹2.5 Cr+ Vargani Collected' },
    { icon: '📲', text: 'Instant WhatsApp Receipts' },
    { icon: '⚡', text: 'Offline-First Pandals App' },
  ];

  return (
    <section style={{
      background: 'linear-gradient(90deg, #fff7ed 0%, #fef3c7 50%, #fff7ed 100%)',
      borderTop: '1px solid #fed7aa',
      borderBottom: '1px solid #fed7aa',
      padding: '20px 0'
    }}>
      <div className="container-main">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px 36px'
        }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: '#0f172a',
              fontSize: '0.925rem',
              fontWeight: 700
            }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
