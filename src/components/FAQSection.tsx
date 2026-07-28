import React, { useState } from 'react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does it take to set up our mandal?',
      a: 'Under 5 minutes. Register your mandal name, upload your logo, invite your collectors by phone number — and you\'re ready to start generating digital slips.',
    },
    {
      q: 'Do our collectors need smartphones?',
      a: 'Yes, Android or iOS. The app is lightweight and runs well even on budget smartphones costing ₹6,000 or more.',
    },
    {
      q: 'How much does Eksutra cost?',
      a: 'Free during the current season. We\'ll announce transparent pricing well before it changes, and existing mandals will always get advance notice.',
    },
    {
      q: 'How does the receipt reach the donor?',
      a: 'The moment a collector enters the amount and donor details, a branded digital receipt is generated with a unique serial number and sent directly to the donor\'s WhatsApp — in under 10 seconds.',
    },
    {
      q: 'Does the app work offline?',
      a: 'Yes. The app is designed offline-first. You can generate slips without any internet connection — especially useful in crowded pandal areas. Data syncs automatically when connectivity returns.',
    },
    {
      q: 'Can we use Marathi on receipts?',
      a: 'Absolutely. Full Marathi language support for receipt templates, including custom mandal names, header text, and footer messages.',
    },
    {
      q: 'Who can see our mandal\'s data?',
      a: 'Only your authorized admins have full visibility. Collectors see only their own collections. No one outside your mandal has access to your data.',
    },
    {
      q: 'Can we export our data?',
      a: 'Yes. PDF and Excel export is available for collection reports, expense logs, and donor lists — perfect for committee meetings, audits, or yearly handovers.',
    },
  ];

  return (
    <section id="faq" className="section-padding" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border-light)' }}>
      <div className="container-main" style={{ maxWidth: 720 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="t-h2" style={{ marginBottom: 12 }}>Common questions</h2>
          <p className="t-body-lg">Everything you need to know before getting your mandal started.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--white)',
                  border: isOpen ? '1px solid var(--saffron-light)' : '1px solid var(--border)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? 'var(--shadow-rest)' : 'none',
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%', padding: '20px 24px', textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                  }}
                >
                  <span style={{
                    fontSize: 16, fontWeight: 600,
                    color: isOpen ? 'var(--saffron-dark)' : 'var(--ink)',
                  }}>
                    {faq.q}
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 20, color: isOpen ? 'var(--saffron)' : 'var(--muted)',
                      transition: 'transform 0.3s',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0, marginLeft: 16,
                    }}
                  >
                    expand_more
                  </span>
                </button>

                <div style={{
                  maxHeight: isOpen ? 500 : 0,
                  opacity: isOpen ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease, opacity 0.3s ease',
                  padding: isOpen ? '0 24px 20px' : '0 24px',
                }}>
                  <p className="t-body" style={{ lineHeight: 1.7 }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
