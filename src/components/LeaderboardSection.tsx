import React, { useState } from 'react';

export const LeaderboardSection: React.FC = () => {
  const [filter, setFilter] = useState<'overall' | 'daily'>('overall');

  const topCollectors = [
    { rank: 1, name: 'Amit Kulkarni (अमित कुलकर्णी)', area: 'Shivaji Nagar', amount: '₹ 1,45,000', slips: 142, badge: '🪔 Gold Diya' },
    { rank: 2, name: 'Rahul Deshmukh (राहुल देशमुख)', area: 'Kothrud', amount: '₹ 98,500', slips: 89, badge: '🌼 Silver Garland' },
    { rank: 3, name: 'Suresh Patil (सुरेश पाटील)', area: 'Deccan', amount: '₹ 76,200', slips: 65, badge: '🪙 Bronze Coin' },
    { rank: 4, name: 'Vikram Joshi (विक्रम जोशी)', area: 'Aundh', amount: '₹ 45,000', slips: 41, badge: '⭐ Active Member' },
  ];

  const rankColors = ['#fef3c7', '#f1f5f9', '#ffedd5', '#ffffff'];
  const rankText = ['#92400e', '#475569', '#c2410c', '#64748b'];

  return (
    <section id="leaderboard" className="section-padding" style={{ background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
      <div className="container-main">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>

          {/* Copy */}
          <div>
            <div className="festive-badge" style={{ marginBottom: 16 }}>
              <span>🏆</span>
              <span>Live Transparency & Gamification</span>
            </div>
            <h2 className="t-h2" style={{ marginBottom: 20 }}>
              See who's collecting, where, and how much — in real time.
            </h2>
            <p className="t-body-lg" style={{ marginBottom: 24, maxWidth: 500 }}>
              Motivate your team during peak festival collection days. The leaderboard ranks collectors by total amount and slip count. Automated WhatsApp reports go to the mandal president every evening at 9 PM.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff7ed', padding: '12px 16px', borderRadius: 14, border: '1px solid #fed7aa' }}>
              <span style={{ fontSize: 20 }}>📲</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#c2410c' }}>
                Automated daily WhatsApp summary sent to President & Secretary
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div>
            <div className="festive-card" style={{ padding: 0 }}>
              {/* Header */}
              <div style={{
                padding: '18px 24px', borderBottom: '1px solid #fed7aa',
                background: 'linear-gradient(90deg, #fff7ed 0%, #fef3c7 100%)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 12
              }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Mandal Top Collectors</div>
                  <div style={{ fontSize: 12, color: '#ea580c', fontWeight: 600 }}>Live updates from the field</div>
                </div>
                <div style={{ display: 'flex', background: '#ffffff', borderRadius: 999, border: '1px solid #fed7aa', padding: 3 }}>
                  {(['overall', 'daily'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        padding: '6px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
                        fontSize: 12, fontWeight: 700, transition: 'all 0.2s',
                        background: filter === f ? '#ea580c' : 'transparent',
                        color: filter === f ? '#ffffff' : '#475569',
                      }}
                    >
                      {f === 'overall' ? 'Overall 2026' : 'Today'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table body */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left', background: '#f8fafc' }}>
                      <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rank</th>
                      <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Collector</th>
                      <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Slips</th>
                      <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>Vargani Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCollectors.map((c, i) => (
                      <tr key={c.rank} style={{ borderBottom: i < topCollectors.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            padding: '4px 10px', borderRadius: 999,
                            background: rankColors[i], color: rankText[i],
                            fontSize: 12, fontWeight: 800, border: '1px solid #fed7aa'
                          }}>#{c.rank}</span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: '#ea580c', fontWeight: 600 }}>{c.badge} • {c.area}</div>
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>{c.slips} slips</td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>{c.amount}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
