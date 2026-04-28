import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'

const PALETTE = [
  '#F5A623','#FFD166','#E08A00','#CB8200','#B86E00',
  '#FFA500','#CC7A00','#FF9F1C','#FFBF69','#FFD700',
  '#FFC44D','#E6960A','#D4860B','#F0B429','#FFAA33',
]

const TOOLTIP_PROPS = {
  contentStyle: {
    background: '#191919', border: '1px solid rgba(245,166,35,0.3)',
    borderRadius: 10, fontFamily: 'DM Sans, sans-serif',
    fontSize: 13, color: '#F2EDE8',
  },
  itemStyle: { color: '#F5A623' },
  labelStyle: { color: '#7A7672', fontSize: 12 },
  cursor: { fill: 'rgba(245,166,35,0.05)' },
}

const PANEL = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: '22px 24px',
  animation: 'fadeUp 0.45s ease both',
}

function Title({ children }) {
  return (
    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
      {children}
    </h3>
  )
}

export function BarPanel({ title, data, dataKey, labelKey, horizontal = false, delay = 0 }) {
  return (
    <div style={{ ...PANEL, animationDelay: `${delay}ms` }}>
      <Title>{title}</Title>
      <ResponsiveContainer width="100%" height={horizontal ? Math.max(220, data.length * 28) : 250}>
        <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'}
          margin={horizontal ? { left: 90, right: 20, top: 4, bottom: 4 } : { top: 4, right: 8, left: -8, bottom: 56 }}>
          {horizontal
            ? <>
                <XAxis type="number" tick={{ fill: '#7A7672', fontSize: 11 }} />
                <YAxis type="category" dataKey={labelKey} tick={{ fill: 'var(--text-soft)', fontSize: 12 }} width={84} />
              </>
            : <>
                <XAxis dataKey={labelKey} tick={{ fill: '#7A7672', fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: '#7A7672', fontSize: 11 }} />
              </>
          }
          <Tooltip {...TOOLTIP_PROPS} />
          <Bar dataKey={dataKey} radius={horizontal ? [0,4,4,0] : [4,4,0,0]}>
            {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const renderLabel = ({ name, percent }) =>
  percent > 0.04 ? `${(percent * 100).toFixed(0)}%` : ''

export function PiePanel({ title, data, dataKey, labelKey, delay = 0 }) {
  const mapped = data.map(d => ({ name: d[labelKey], value: d[dataKey] }))
  return (
    <div style={{ ...PANEL, animationDelay: `${delay}ms` }}>
      <Title>{title}</Title>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={mapped} cx="50%" cy="46%" outerRadius={95} innerRadius={44}
            dataKey="value" label={renderLabel} labelLine={{ stroke: '#7A7672', strokeWidth: 1 }}>
            {mapped.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip {...TOOLTIP_PROPS} />
          <Legend
            formatter={(val) => <span style={{ color: 'var(--text-soft)', fontSize: 12 }}>{val}</span>}
            iconType="circle" iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}