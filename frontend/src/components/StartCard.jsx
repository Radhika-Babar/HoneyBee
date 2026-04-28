import React from 'react'

export default function StatCard({ label, value, sub, icon, delay = 0, accent = false }) {
  return (
    <div style={{
      background: accent ? 'linear-gradient(135deg,rgba(245,166,35,0.12),rgba(245,166,35,0.04))' : 'var(--surface-2)',
      border: `1px solid ${accent ? 'var(--border-gold)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '22px 24px',
      display: 'flex', flexDirection: 'column', gap: 6,
      animation: 'fadeUp 0.4s ease both',
      animationDelay: `${delay}ms`,
      transition: 'transform 0.18s, border-color 0.18s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-3px)'
      e.currentTarget.style.borderColor = 'var(--border-gold)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.borderColor = accent ? 'var(--border-gold)' : 'var(--border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
          {label}
        </span>
        {icon && <span style={{ fontSize: 18, opacity: 0.7 }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, color: 'var(--honey)', lineHeight: 1 }}>
        {typeof value === 'number' ? value.toLocaleString() : (value ?? '—')}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  )
}