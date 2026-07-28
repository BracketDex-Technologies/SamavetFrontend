import React from 'react';
import { EksutraLogo } from './EksutraLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', paddingTop: 64, paddingBottom: 32, borderTop: '2px solid #fed7aa' }}>
      <div className="container-main">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          marginBottom: 48
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <a href="#" style={{ textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>
              <EksutraLogo size={32} textColor="#ffffff" />
            </a>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginTop: 8, color: '#cbd5e1' }}>
              The complete financial & Vargani operating system for India's festival committees and Mandals.
            </p>
            <div style={{ marginTop: 14, fontSize: 13, color: '#fb923c', fontWeight: 700 }}>
              🚩 गणपती बाप्पा मोरया!
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Product</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Vargani Collection', 'Expense Management', 'Admin Dashboard', 'Digital Receipts', 'WhatsApp Integration'].map((link, i) => (
                <li key={i}><a href="#product" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}>{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Mandal Setup Guide', 'Marathi Help Video', 'Auditing Best Practices', 'Collector Training'].map((link, i) => (
                <li key={i}><a href="#faq" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}>{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Festivals</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Ganesh Utsav 2026', 'Navratri Garba', 'Dahi Handi Pathak', 'Shiv Jayanti'].map((link, i) => (
                <li key={i}><a href="#festivals" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}>{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
            Made with <span style={{ color: '#ea580c', fontSize: 16 }}>🪔</span> in Maharashtra for Mandals
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>
            © {new Date().getFullYear()} Digital Vargani / Eksutra. All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: '#1e293b', border: '1px solid #fed7aa', cursor: 'pointer',
              color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            aria-label="Scroll to top"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
