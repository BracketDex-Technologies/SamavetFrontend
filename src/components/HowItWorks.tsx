import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Register your mandal',
      desc: 'Enter your mandal name, add your logo, choose your festival. Takes 2 minutes.',
    },
    {
      num: '02',
      title: 'Add your collectors',
      desc: 'Invite committee members by phone number. Assign roles — Admin or Collector.',
    },
    {
      num: '03',
      title: 'Start collecting',
      desc: 'Your members download the app and start generating digital Eksutra slips immediately.',
    },
  ];

  return (
    <section id="how-it-works" className="section-padding" style={{ background: 'var(--white)', borderTop: '1px solid var(--border-light)' }}>
      <div className="container-main">
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 64px' }}>
          <h2 className="t-h2" style={{ marginBottom: 16 }}>
            Go live before your next collection day.
          </h2>
          <p className="t-body-lg">
            Three steps. Five minutes. No technical knowledge required.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }} className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <div style={{
                fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)',
                color: 'var(--saffron-light)', lineHeight: 1, marginBottom: 16,
                letterSpacing: '-0.03em',
              }}>
                {step.num}
              </div>
              <h3 className="t-h3" style={{ marginBottom: 10 }}>{step.title}</h3>
              <p className="t-body" style={{ maxWidth: 300 }}>{step.desc}</p>

              {/* Connector line (not on last) */}
              {i < 2 && (
                <div className="step-connector" style={{
                  position: 'absolute', top: 32, right: -20,
                  width: 40, height: 1, background: 'var(--border)',
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .steps-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .step-connector { display: none !important; }
        }
      `}</style>
    </section>
  );
};
