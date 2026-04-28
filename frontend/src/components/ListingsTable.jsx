import React, { useState } from 'react'
import { useListings } from '../hooks/Useapi'

const SOURCE_COLOR = {
  Sulekha: '#F5A623', Justdial: '#4ADE80', IndiaMart: '#60A5FA',
  'Google Maps': '#F87171', TradeIndia: '#C084FC',
}

const badge = color => ({
  display: 'inline-block', padding: '2px 10px', borderRadius: 20,
  fontSize: 11, fontWeight: 600,
  background: color + '1A', color, border: `1px solid ${color}44`,
})

function Input({ placeholder, value, onChange }) {
  return (
    <input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{
        background: 'var(--surface-3)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '7px 14px', color: 'var(--text)',
        fontFamily: 'inherit', fontSize: 13, outline: 'none', width: 148,
        transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--border-gold)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
    />
  )
}

function Th({ children }) {
  return (
    <th style={{
      textAlign: 'left', padding: '10px 14px',
      borderBottom: '1px solid var(--border)',
      color: 'var(--text-muted)', fontSize: 11,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      whiteSpace: 'nowrap', fontWeight: 600,
    }}>{children}</th>
  )
}

export default function ListingsTable() {
  const [search,   setSearch]   = useState('')
  const [city,     setCity]     = useState('')
  const [category, setCategory] = useState('')
  const [source,   setSource]   = useState('')
  const [page,     setPage]     = useState(1)

  const params = {
    search:   search   || undefined,
    city:     city     || undefined,
    category: category || undefined,
    source:   source   || undefined,
    page,
    per_page: 20,
  }

  const { data, loading } = useListings(params)
  const total = data?.total ?? 0
  const pages = data?.pages ?? 1
  const rows  = data?.data  ?? []

  const handleFilter = setter => val => { setter(val); setPage(1) }

  const exportCSV = () => {
    const q = new URLSearchParams()
    if (city)     q.set('city',     city)
    if (category) q.set('category', category)
    if (source)   q.set('source',   source)
    window.open(`http://localhost:8000/api/listings/export?${q}`, '_blank')
  }

  return (
    <div style={{
      background: 'var(--surface-2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: 24,
      animation: 'fadeUp 0.5s ease both',
    }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Input placeholder="🔍 Search name…"   value={search}   onChange={handleFilter(setSearch)} />
          <Input placeholder="City…"              value={city}     onChange={handleFilter(setCity)} />
          <Input placeholder="Category…"          value={category} onChange={handleFilter(setCategory)} />
          <Input placeholder="Source…"            value={source}   onChange={handleFilter(setSource)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {total > 0 && (
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {total.toLocaleString()} results
            </span>
          )}
          <button onClick={exportCSV} style={{
            background: 'transparent', border: '1px solid var(--border-gold)',
            borderRadius: 8, padding: '7px 16px', color: 'var(--honey)',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,166,35,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <Th>#</Th><Th>Business Name</Th><Th>Category</Th>
              <Th>City</Th><Th>Phone</Th><Th>Source</Th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} style={{ padding: '10px 14px' }}>
                        <div style={{
                          height: 12, borderRadius: 6, width: j === 1 ? '70%' : '50%',
                          background: 'linear-gradient(90deg,var(--surface-2) 25%,var(--surface-3) 50%,var(--surface-2) 75%)',
                          backgroundSize: '400px 100%', animation: 'shimmer 1.4s infinite linear',
                        }} />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row, i) => (
                  <tr key={row.id}
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,166,35,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 12 }}>{row.id}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 500 }}>{row.business_name}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-soft)' }}>{row.category}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-soft)' }}>{row.city}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 12 }}>
                      {row.phone || '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={badge(SOURCE_COLOR[row.source] || '#7A7672')}>{row.source}</span>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>

        {!loading && rows.length === 0 && (
          <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            No listings match your filters.
          </p>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
          <PagBtn label="← Prev" disabled={page === 1}    onClick={() => setPage(p => p - 1)} />
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
            const p = pages <= 7 ? i + 1 : page <= 4 ? i + 1 : page + i - 3
            if (p < 1 || p > pages) return null
            return (
              <PagBtn key={p} label={p} active={p === page} onClick={() => setPage(p)} />
            )
          })}
          <PagBtn label="Next →" disabled={page === pages} onClick={() => setPage(p => p + 1)} />
        </div>
      )}
    </div>
  )
}

function PagBtn({ label, onClick, disabled, active }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: active ? 'var(--honey)' : 'var(--surface-3)',
      border: `1px solid ${active ? 'var(--honey)' : 'var(--border)'}`,
      borderRadius: 8, padding: '6px 14px',
      color: active ? '#000' : disabled ? 'var(--text-muted)' : 'var(--text)',
      fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 700 : 400,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
      transition: 'all 0.15s',
    }}>{label}</button>
  )
}