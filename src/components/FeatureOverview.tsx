import React from 'react';

export const ProductShowcases: React.FC = () => {
  return (
    <div id="product">
      {/* Showcase 1: Instant Digital Receipts */}
      <section className="section-padding" style={{ background: '#fffdfa' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
            {/* Copy */}
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 12 }}>VARGANI COLLECTION</div>
              <h2 className="t-h2" style={{ marginBottom: 20 }}>
                One tap. One slip.<br />Sent via WhatsApp in 10 seconds.
              </h2>
              <p className="t-body-lg" style={{ marginBottom: 28, maxWidth: 500 }}>
                Your collector enters the donor's name, amount, and payment mode. The system generates a numbered digital receipt with your mandal's logo and sends it directly to the donor's WhatsApp — instantly.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Custom receipt template with mandal branding',
                  'Auto-incrementing serial numbers (#JGM-2026-XXXX)',
                  'Supports UPI, Cash, and Bank Transfer',
                  'Full Marathi and Hindi language support',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155', fontSize: 15, fontWeight: 600 }}>
                    <span style={{ fontSize: 18, color: '#ea580c' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* WhatsApp Mockup */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%', maxWidth: 340, borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.15)', border: '2px solid #fed7aa',
              }}>
                {/* WA Header */}
                <div style={{
                  background: '#075E54', color: 'white', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                  }}>
                    🪔
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>जय गणेश उत्सव मंडळ</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>Verified Mandal Account</div>
                  </div>
                </div>
                {/* WA Body */}
                <div style={{ background: '#EFEAE2', padding: '20px 16px', minHeight: 220 }}>
                  <div style={{
                    background: 'white', padding: '16px', borderRadius: '14px 14px 14px 0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)', maxWidth: '95%',
                  }}>
                    <div style={{ fontSize: 14, color: '#0f172a', lineHeight: 1.6, marginBottom: 10 }}>
                      🙏 **जय गणेश उत्सव मंडळ** कडून हार्दिक आभार! तुमची <strong>₹५,००१</strong> वर्गणी जमा झाली आहे.
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', marginBottom: 12, lineHeight: 1.6 }}>
                      <strong>पावती क्र:</strong> JGM-2026-0342<br />
                      <strong>वर्गणीदार:</strong> सुरेश पाटील<br />
                      <strong>पेमेंट प्रकार:</strong> UPI<br />
                      <strong>दिनांक:</strong> २६ जुलै २०२६
                    </div>
                    <div style={{
                      background: '#fff7ed', border: '1px solid #fed7aa',
                      borderRadius: 10, padding: '10px 12px', textAlign: 'center',
                      fontSize: 13, fontWeight: 700, color: '#c2410c', cursor: 'pointer',
                    }}>
                      📄 डिजिटल पावती पहा (PDF)
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', textAlign: 'right', marginTop: 8 }}>
                      3:42 PM ✓✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase 2: Admin Dashboard */}
      <section className="section-padding" style={{ background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
            {/* Dashboard Mockup */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%', maxWidth: 440, borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(234, 88, 12, 0.12)', border: '1px solid #e2e8f0', background: '#ffffff',
              }}>
                <div style={{
                  padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#fff7ed'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: '#ea580c', color: '#ffffff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 14,
                    }}>J</div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Jai Ganesh Mandal</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ea580c', background: '#ffffff', padding: '4px 10px', borderRadius: 999, border: '1px solid #fed7aa' }}>Live 2026</span>
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Collected</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a' }}>₹ 12.5L</div>
                  </div>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Spent</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626' }}>₹ 4.0L</div>
                  </div>
                </div>

                <div style={{ padding: '20px 24px', background: '#fff7ed', borderBottom: '1px solid #fed7aa' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Net Mandal Balance</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#c2410c' }}>₹ 8,50,000</div>
                </div>

                {/* Member tally */}
                <div style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Top Collectors Today</div>
                  {[
                    { name: 'Amit K. (अमित कदम)', area: 'Shivaji Nagar', amount: '₹ 32,000' },
                    { name: 'Rahul D. (राहुल देशमुख)', area: 'Kothrud', amount: '₹ 24,500' },
                  ].map((m, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0', borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none',
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{m.area}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#ea580c' }}>{m.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Copy */}
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 12 }}>REAL-TIME DASHBOARD</div>
              <h2 className="t-h2" style={{ marginBottom: 20 }}>
                Your president sees every collection the moment it happens.
              </h2>
              <p className="t-body-lg" style={{ marginBottom: 28, maxWidth: 500 }}>
                The admin dashboard shows total collection, member-wise tally, area-wise breakdown, and recent transactions — updated in real time. No more waiting for collectors to bring back physical receipt books.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Live total with collection vs. expense balance',
                  'Member-wise and area-wise drill-down',
                  'Day-over-day and year-over-year trends',
                  'Export to PDF or Excel for committee meetings',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155', fontSize: 15, fontWeight: 600 }}>
                    <span style={{ fontSize: 18, color: '#ea580c' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase 3: Expense Tracking */}
      <section className="section-padding" style={{ background: '#fffdfa', borderTop: '1px solid #f1f5f9' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
            {/* Copy */}
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 12 }}>EXPENSE MANAGEMENT</div>
              <h2 className="t-h2" style={{ marginBottom: 20 }}>
                Track every spend. Know your balance at any moment.
              </h2>
              <p className="t-body-lg" style={{ marginBottom: 28, maxWidth: 500 }}>
                Log mandap decoration, DJ booking, prasad supplies, electricity — every expense, the moment it happens. Your dashboard always shows the live balance: total collected minus total spent.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Category-wise expense logging with bill upload',
                  'Instant receipt attachment for audits',
                  'Instant net surplus calculation',
                  'Exportable expense report for committee meetings',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155', fontSize: 15, fontWeight: 600 }}>
                    <span style={{ fontSize: 18, color: '#ea580c' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Expense Log Mockup */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%', maxWidth: 400, borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.1)', border: '1px solid #e2e8f0', background: '#ffffff',
              }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>Mandal Expense Log</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Ganesh Utsav 2026</div>
                </div>
                {[
                  { item: 'Mandap Decoration & Lighting', amount: '₹ 45,000', icon: '🎪', category: 'Infrastructure' },
                  { item: 'Dhol Tasha & DJ Sound', amount: '₹ 18,000', icon: '🥁', category: 'Entertainment' },
                  { item: 'Prasad & Flower Garlands', amount: '₹ 12,500', icon: '🌺', category: 'Puja' },
                  { item: 'Msedcl Temporary Light Connection', amount: '₹ 8,500', icon: '⚡', category: 'Utilities' },
                ].map((exp, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 24px',
                    borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: '#fef2f2', color: '#dc2626',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18
                      }}>
                        {exp.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{exp.item}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{exp.category}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#dc2626' }}>- {exp.amount}</div>
                  </div>
                ))}
                <div style={{
                  padding: '16px 24px', background: '#fff7ed',
                  borderTop: '1px solid #fed7aa',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Total Mandal Expenses</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#dc2626' }}>₹ 84,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
