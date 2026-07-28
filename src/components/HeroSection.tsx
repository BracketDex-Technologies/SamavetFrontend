import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section
      style={{
        paddingTop: 'clamp(40px, 6vw, 90px)',
        paddingBottom: 'clamp(40px, 6vw, 80px)',
        background: 'linear-gradient(180deg, #fffdfa 0%, #fff7ed 100%)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Warm festival radial glow & mandala watermark */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 1000,
          height: 650,
          background: 'radial-gradient(ellipse at center, rgba(254, 215, 170, 0.45) 0%, rgba(253, 230, 138, 0.25) 50%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Festival Pill Badge */}
        <div
          className="anim-fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)',
            color: '#ea580c',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            marginBottom: 20,
            border: '1px solid #fed7aa',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.12)'
          }}
        >
          <span style={{ fontSize: 16 }}>🪔</span>
          <span>श्री उत्सव व्यवस्थापन सिस्टीम · Festival OS</span>
        </div>

        {/* Hero Title */}
        <h1
          className="t-display anim-fade-up anim-delay-1"
          style={{
            margin: '0 auto 20px',
            maxWidth: 900,
          }}
        >
          Effortless Festival <br />
          Collection{' '}
          <span className="gold-gradient-text">
            Simplified & Transparent
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p
          className="t-body-lg anim-fade-up anim-delay-2"
          style={{
            maxWidth: 680,
            margin: '0 auto 36px',
          }}
        >
          Replace lost paper receipt books with authentic digital Vargani slips, instant WhatsApp receipt sharing, and real-time committee financial tracking.
        </p>

        {/* Action CTAs */}
        <div
          className="anim-fade-up anim-delay-3"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            marginBottom: 56,
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#how-it-works"
            className="btn-festive-primary"
          >
            <span>🪔 Get Started Free</span>
            <span style={{ fontSize: 16 }}>➔</span>
          </a>

          <a
            href="#product"
            className="btn-festive-secondary"
          >
            <span>Explore Features ↓</span>
          </a>
        </div>

        {/* Main Interactive Phone Showcase with Authentic Festival Graphic Cards */}
        <div
          className="anim-fade-up anim-delay-4"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            maxWidth: 980,
            margin: '0 auto',
          }}
        >
          {/* Left Festival Graphics - Responsive Desktop Only */}
          <div
            className="desktop-nav"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              position: 'absolute',
              left: 0,
              top: '48%',
              transform: 'translateY(-50%)',
              zIndex: 10
            }}
          >
            {/* Ganesh Utsav Graphic Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 18px',
                borderRadius: 20,
                background: '#ffffff',
                border: '2px solid #fed7aa',
                boxShadow: '0 12px 30px rgba(249,115,22,0.15)',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 14,
                background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
                color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: 22 }}>🌺</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>श्री गणेशोत्सव</div>
                <div style={{ fontSize: 11, color: '#ea580c', fontWeight: 700 }}>8,400+ मंडळे</div>
              </div>
            </div>

            {/* Navratri Garba Graphic Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 18px',
                borderRadius: 20,
                background: '#ffffff',
                border: '1px solid #fef3c7',
                boxShadow: '0 12px 30px rgba(217,119,6,0.1)',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 14,
                background: '#fef3c7', color: '#d97706',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: 22 }}>🪔</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>नवरात्र उत्सव</div>
                <div style={{ fontSize: 11, color: '#d97706', fontWeight: 600 }}>3,200+ मंडळे</div>
              </div>
            </div>
          </div>

          {/* CENTERED PHONE FRAME */}
          <div
            style={{
              width: '100%',
              maxWidth: 340,
              height: 590,
              background: '#0f172a',
              borderRadius: 44,
              border: '8px solid #1e293b',
              boxShadow: '0 30px 70px -15px rgba(15,23,42,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
              overflow: 'hidden',
              position: 'relative',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Notch */}
            <div
              style={{
                width: 110,
                height: 20,
                background: '#1e293b',
                borderRadius: '0 0 14px 14px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 10,
              }}
            />

            {/* Status bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 20px',
                color: '#94a3b8',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <span>9:41</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>signal_cellular_4_bar</span>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>wifi</span>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>battery_full</span>
              </div>
            </div>

            {/* App Header inside Phone */}
            <div style={{ padding: '12px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: '#ea580c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  R
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>राहुल देशमुख (Collector)</div>
                  <div style={{ fontSize: 10, color: '#fb923c', fontWeight: 600 }}>जय गणेश उत्सव मंडळ, पुणे</div>
                </div>
              </div>

              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>notifications</span>
              </div>
            </div>

            {/* AUTHENTIC VARGANI SLIP CARD */}
            <div style={{ padding: '8px 14px', position: 'relative' }}>
              <div
                style={{
                  background: '#fff7ed',
                  border: '2px solid #fed7aa',
                  borderRadius: 20,
                  padding: '14px 14px 12px',
                  color: '#0f172a',
                  boxShadow: '0 12px 30px rgba(234, 88, 12, 0.25)',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                  background: 'linear-gradient(90deg, #ea580c, #f59e0b, #ea580c)'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#ea580c', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      🚩 श्री गणेशोत्सव २०२६
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                      जय गणेश मंडळ
                    </div>
                  </div>
                  <div style={{
                    background: '#ffedd5', color: '#c2410c',
                    padding: '3px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700,
                    border: '1px solid #fed7aa'
                  }}>
                    अधिकृत पावती
                  </div>
                </div>

                <div style={{
                  background: '#ffffff', borderRadius: 10, padding: '6px 10px',
                  border: '1px solid #ffedd5', marginBottom: 10,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>पावती क्रमांक</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>#JGM-2026-0342</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>दिनांक</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a' }}>२६ जुलै २०२६</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div style={{ background: '#ffffff', padding: '6px 8px', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>वर्गणीदार</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>सुरेश पाटील</div>
                    <div style={{ fontSize: 9, color: '#94a3b8' }}>कोथरुड, पुणे</div>
                  </div>

                  <div style={{ background: '#ffedd5', padding: '6px 8px', borderRadius: 10, border: '1px solid #fed7aa' }}>
                    <div style={{ fontSize: 9, color: '#ea580c', fontWeight: 700 }}>रक्कम (Vargani)</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#c2410c', marginTop: 2 }}>₹ ११,००१</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: 6, borderTop: '1px dashed #fed7aa', fontSize: 9
                }}>
                  <span style={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    ✓ WhatsApp पावती पाठवली
                  </span>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>प्रकार: UPI</span>
                </div>
              </div>
            </div>

            {/* Action Bar inside Phone */}
            <div style={{ padding: '8px 14px', marginTop: 'auto', marginBottom: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  background: '#1e293b',
                  padding: '8px 10px',
                  borderRadius: 999,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#ffffff' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#ea580c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white' }}>➕</span>
                  नवीन पावती
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#ffffff' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#22c55e', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white' }}>💬</span>
                  WhatsApp
                </div>
              </div>
            </div>
          </div>

          {/* Right Festival Graphics - Responsive Desktop Only */}
          <div
            className="desktop-nav"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              position: 'absolute',
              right: 0,
              top: '48%',
              transform: 'translateY(-50%)',
              zIndex: 10
            }}
          >
            {/* Dahi Handi Graphic Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 18px',
                borderRadius: 20,
                background: '#ffffff',
                border: '1px solid #e0f2fe',
                boxShadow: '0 12px 30px rgba(2,132,199,0.1)',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 14,
                background: '#e0f2fe', color: '#0284c7',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: 22 }}>🪴</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>दहीहंडी उत्सव</div>
                <div style={{ fontSize: 11, color: '#0284c7', fontWeight: 600 }}>1,500+ पथके</div>
              </div>
            </div>

            {/* Shiv Jayanti Graphic Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 18px',
                borderRadius: 20,
                background: '#ffffff',
                border: '2px solid #fed7aa',
                boxShadow: '0 12px 30px rgba(249,115,22,0.15)',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 14,
                background: '#ffedd5', color: '#ea580c',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: 22 }}>🚩</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>शिवजयंती उत्सव</div>
                <div style={{ fontSize: 11, color: '#ea580c', fontWeight: 700 }}>सामाजिक उपक्रम</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
