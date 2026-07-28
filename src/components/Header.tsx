import React, { useState, useEffect } from 'react';
import { EksutraLogo } from './EksutraLogo';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Features');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#product' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Leaderboard', href: '#leaderboard' },
    { label: 'Festivals', href: '#festivals' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Festive Top Ribbon */}
      <div style={{
        background: 'linear-gradient(90deg, #ea580c 0%, #d97706 50%, #b91c1c 100%)',
        color: '#ffffff',
        fontSize: '0.825rem',
        fontWeight: 700,
        padding: '6px 16px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        letterSpacing: '0.02em',
      }}>
        <span>🪔</span>
        <span>Shubh Utsav 2026: Digital Vargani Slips & Instant WhatsApp Receipts for Mandals</span>
        <span style={{
          background: 'rgba(255,255,255,0.25)',
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '0.75rem',
          marginLeft: '4px'
        }}>FREE DEMO</span>
      </div>

      <header
        style={{
          position: 'sticky', top: 0, width: '100%', zIndex: 50,
          padding: scrolled ? '10px 0' : '14px 0',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 253, 250, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(234, 88, 12, 0.12)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 20px rgba(234, 88, 12, 0.06)' : 'none',
        }}
      >
        <div className="container-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <EksutraLogo size={36} />
          </a>

          {/* Floating Pill Nav for Desktop */}
          <nav
            className="desktop-nav"
            style={{
              alignItems: 'center', gap: 6,
              background: '#0f172a',
              padding: '5px 8px',
              borderRadius: 999,
              boxShadow: '0 12px 30px -6px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeTab === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveTab(link.label)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 999,
                    fontSize: 13.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    background: isActive ? 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)' : 'transparent',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    boxShadow: isActive ? '0 4px 12px rgba(234, 88, 12, 0.3)' : 'none',
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Primary Action CTA Button */}
          <div style={{ alignItems: 'center', gap: 12 }} className="desktop-nav">
            <a
              href="#how-it-works"
              className="btn-festive-primary"
              style={{
                padding: '9px 20px',
                fontSize: 14,
                borderRadius: 999,
              }}
            >
              <span>🪔 Create Mandal Vargani</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-toggle"
            style={{
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: '10px',
              padding: '8px 12px',
              cursor: 'pointer',
              color: '#ea580c',
              alignItems: 'center',
              gap: 6
            }}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
              {mobileOpen ? 'close' : 'menu'}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Menu</span>
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            style={{
              position: 'absolute', top: '100%', left: 0, width: '100%',
              background: '#ffffff',
              borderBottom: '2px solid #fed7aa',
              boxShadow: '0 24px 48px rgba(234, 88, 12, 0.15)',
              zIndex: 100,
              paddingBottom: 24
            }}
          >
            <nav className="container-main" style={{ display: 'flex', flexDirection: 'column', padding: '20px 24px' }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: '#0f172a', textDecoration: 'none',
                    padding: '14px 0', fontSize: 16, fontWeight: 700,
                    borderBottom: '1px solid #f8fafc',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}
                >
                  <span>{link.label}</span>
                  <span style={{ color: '#ea580c', fontSize: 14 }}>➔</span>
                </a>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileOpen(false)}
                  className="btn-festive-primary"
                  style={{ width: '100%', textAlign: 'center', borderRadius: 999 }}
                >
                  🪔 Create Mandal Vargani
                </a>
              </div>
            </nav>
          </div>
        )}

        <style>{`
          .desktop-nav { display: flex; }
          .mobile-toggle { display: none; }
          @media (max-width: 840px) {
            .desktop-nav { display: none !important; }
            .mobile-toggle { display: flex !important; }
          }
        `}</style>
      </header>
    </>
  );
};
