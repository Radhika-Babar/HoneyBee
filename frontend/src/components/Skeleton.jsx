import React from 'react'

const base = {
  background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%)',
  backgroundSize: '400px 100%',
  animation: 'shimmer 1.4s infinite linear',
  borderRadius: 8,
}

export function SkeletonBox({ w = '100%', h = 20, style = {} }) {
  return <div style={{ ...base, width: w, height: h, ...style }} />
}

export function SkeletonCard() {
  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <SkeletonBox w="60%" h={12} />
      <SkeletonBox w="40%" h={38} />
      <SkeletonBox w="50%" h={10} />
    </div>
  )
}

export function SkeletonChart({ h = 260 }) {
  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
      <SkeletonBox w="40%" h={14} style={{ marginBottom: 20 }} />
      <SkeletonBox w="100%" h={h} />
    </div>
  )
}