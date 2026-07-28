import React from 'react';
import confetti from 'canvas-confetti';

export const FinalCTA: React.FC = () => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ea580c', '#f59e0b', '#fbbf24', '#059669', '#be123c']
    });
  };

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#ffffff',
      padding: 'clamp(50px, 8vw, 90px) 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Festive warm radial glow */}
      <div style={{
        position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)',
        width: 750, height: 450,
        background: 'radial-gradient(ellipse, rgba(234,88,12,0.25) 0%, rgba(245,158,11,0.15) 50%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-main" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 720 }}>
        <div className="festive-badge" style={{ marginBottom: 20, background: 'rgba(234, 88, 12, 0.2)', border: '1px solid rgba(253, 186, 116, 0.3)', color: '#fdba74' }}>
          <span>🪔</span>
          <span>Ganesh Utsav & Navratri 2026 Ready</span>
        </div>

        <h2 className="t-h2" style={{ color: '#ffffff', marginBottom: 18 }}>
          Ganesh Utsav is Approaching.<br />Is Your Mandal Prepared?
        </h2>
        <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: '#cbd5e1', lineHeight: 1.7, marginBottom: 36 }}>
          Set up your committee on Digital Vargani in under 5 minutes. Replace physical receipt books with digital WhatsApp slips today.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button
            onClick={triggerConfetti}
            className="btn-festive-primary"
            style={{ padding: '16px 36px', fontSize: 16 }}
          >
            <span>🪔 Create Mandal Account Free</span>
            <span>➔</span>
          </button>
        </div>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 24 }}>
          {['Free setup in 5 minutes', 'Instant WhatsApp receipts', '100% Marathi & Hindi support'].map((item, i) => (
            <span key={i} style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#22c55e' }}>✓</span> {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
