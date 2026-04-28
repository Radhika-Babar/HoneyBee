import React, { useState } from 'react'
import { useDashboardStats } from './hooks/Useapi'
import StatCard from './components/StartCard'
import { BarPanel, PiePanel } from './components/ChartPanels'
import { SkeletonCard, SkeletonChart } from './components/Skeleton'
import ListingsTable from './components/ListingsTable'

const TABS = [
  { id: 'overview',   label: '📊 Overview' },
  { id: 'cities',     label: '🏙 Cities' },
  { id: 'categories', label: '📦 Categories' },
  { id: 'sources',    label: '🌐 Sources' },
  { id: 'listings',   label: '📋 Listings' },
]

function ErrorBanner({ message }) {
  return (
    <div style={{
      background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)',
      borderRadius: 'var(--radius)', padding: '20px 24px',
    }}>
      <div style={{ color: '#F87171', fontWeight: 700, marginBottom: 6 }}>⚠️ API Connection Error</div>
      <div style={{ color: '#F87171', opacity: 0.8, fontSize: 13 }}>{message}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>
        Ensure FastAPI is running on port 8000 and MySQL is connected. Run:{' '}
        <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>
          uvicorn app.main:app --reload
        </code>
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[0,1,2,3].map(i => <SkeletonCard key={i} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
        <SkeletonChart h={250} />
        <SkeletonChart h={250} />
      </div>
    </>
  )
}

export default function App() {
  const [tab, setTab] = useState('overview')
  const { data, loading, error, refetch } = useDashboardStats()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      {/* ── Header ── */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 36px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 62,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🐝</span>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 800, color: 'var(--honey)', lineHeight: 1.1 }}>
              Honeybee Digital
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Business Listings Dashboard
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? 'rgba(245,166,35,0.12)' : 'transparent',
              border: `1px solid ${tab === t.id ? 'rgba(245,166,35,0.35)' : 'transparent'}`,
              borderRadius: 8, padding: '6px 14px',
              color: tab === t.id ? 'var(--honey)' : 'var(--text-muted)',
              fontFamily: 'inherit', fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = 'var(--text-muted)' }}
            >{t.label}</button>
          ))}
        </nav>

        <button onClick={refetch} style={{
          background: 'var(--honey)', color: '#000',
          border: 'none', borderRadius: 8, padding: '8px 18px',
          fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700,
          cursor: 'pointer', transition: 'background 0.15s',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--honey-deep)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--honey)'}
        >
          {loading ? <span style={{ display:'inline-block', width:14, height:14, border:'2px solid #000', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /> : '↻'}
          Refresh
        </button>
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 36px' }}>

        {error && <ErrorBanner message={error} />}

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>Overview</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
                Aggregated insights across all scraped business listings.
              </p>
            </div>

            {loading
              ? <LoadingGrid />
              : data && <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                    <StatCard label="Total Listings"  value={data.total_listings}     sub="All sources combined"   icon="📍" accent delay={0}   />
                    <StatCard label="Cities Covered"  value={data.city_wise.length}   sub="Unique Indian cities"  icon="🏙" delay={80}  />
                    <StatCard label="Categories"      value={data.category_wise.length} sub="Business types"     icon="📦" delay={160} />
                    <StatCard label="Data Sources"    value={data.source_wise.length} sub="Scraped platforms"     icon="🌐" delay={240} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 18 }}>
                    <BarPanel title="🏙 Top Cities by Listings"
                      data={data.city_wise.slice(0, 12)} dataKey="count" labelKey="label" delay={100} />
                    <PiePanel title="🌐 Source Distribution"
                      data={data.source_wise} dataKey="count" labelKey="label" delay={180} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                    <BarPanel title="📦 Top Categories"
                      data={data.category_wise.slice(0, 8)} dataKey="count" labelKey="label" delay={220} />
                    <div style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)', padding: '22px 24px',
                      animation: 'fadeUp 0.5s ease both', animationDelay: '260ms',
                    }}>
                      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
                        📊 Source Breakdown
                      </h3>
                      {data.source_wise.map((s, i) => {
                        const pct = ((s.count / data.total_listings) * 100).toFixed(1)
                        return (
                          <div key={s.label} style={{ marginBottom: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                              <span style={{ color: 'var(--text-soft)' }}>{s.label}</span>
                              <span style={{ color: 'var(--honey)', fontWeight: 600 }}>{s.count.toLocaleString()}</span>
                            </div>
                            <div style={{ background: 'var(--surface-3)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                              <div style={{
                                height: '100%', borderRadius: 4,
                                width: `${pct}%`,
                                background: `linear-gradient(90deg, var(--honey), var(--honey-light))`,
                                transition: 'width 0.8s ease',
                              }} />
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, textAlign: 'right' }}>{pct}%</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
            }
          </section>
        )}

        {/* CITIES */}
        {tab === 'cities' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>City Analysis</h2>
            {loading ? <><SkeletonChart /><div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>{Array(10).fill(0).map((_,i)=><SkeletonCard key={i}/>)}</div></> : data && <>
              <BarPanel title="🏙 City-wise Business Count (All Cities)"
                data={data.city_wise} dataKey="count" labelKey="label" horizontal />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
                {data.city_wise.map((c, i) => (
                  <div key={c.label} style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '16px 18px',
                    animation: 'fadeUp 0.3s ease both', animationDelay: `${i * 25}ms`,
                    display: 'flex', flexDirection: 'column', gap: 4,
                  }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.label}</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--honey)' }}>{c.count}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {((c.count / data.total_listings) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                ))}
              </div>
            </>}
          </section>
        )}

        {/* CATEGORIES */}
        {tab === 'categories' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>Categories</h2>
            {loading ? <><SkeletonChart /><SkeletonChart /></> : data && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <BarPanel title="📦 Category-wise Count" data={data.category_wise} dataKey="count" labelKey="label" horizontal />
                <PiePanel title="🍕 Category Distribution" data={data.category_wise} dataKey="count" labelKey="label" delay={100} />
              </div>
            )}
          </section>
        )}

        {/* SOURCES */}
        {tab === 'sources' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>Data Sources</h2>
            {loading ? <><SkeletonChart /></> : data && <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
                {data.source_wise.map((s, i) => (
                  <div key={s.label} style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '20px 22px',
                    animation: 'fadeUp 0.3s ease both', animationDelay: `${i * 60}ms`,
                  }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 38, fontWeight: 800, color: 'var(--honey)' }}>{s.count}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                      {((s.count / data.total_listings) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <PiePanel title="🌐 Source Distribution" data={data.source_wise} dataKey="count" labelKey="label" />
                <BarPanel title="📈 Source-wise Count" data={data.source_wise} dataKey="count" labelKey="label" />
              </div>
            </>}
          </section>
        )}

        {/* LISTINGS */}
        {tab === 'listings' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>All Listings</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
                Search, filter, and export your scraped business data.
              </p>
            </div>
            <ListingsTable />
          </section>
        )}

      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 0 24px', color: 'var(--text-muted)', fontSize: 12, borderTop: '1px solid var(--border)', marginTop: 40 }}>
        🐝 Honeybee Digital Business Listings Dashboard · Built with React + FastAPI + MySQL
      </footer>
    </div>
  )
}