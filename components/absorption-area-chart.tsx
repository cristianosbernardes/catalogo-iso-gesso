'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export interface AbsorptionChartDatum {
  freq: string
  alpha: number
  rawFreq: string
}

export default function AbsorptionAreaChart({
  data,
}: {
  data: AbsorptionChartDatum[]
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="alphaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#006daa" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#006daa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
        <XAxis dataKey="freq" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value) => [`α = ${Number(value).toFixed(2)}`, '']} />
        <Area
          type="monotone"
          dataKey="alpha"
          stroke="#006daa"
          strokeWidth={2}
          fill="url(#alphaGradient)"
          fillOpacity={1}
          dot={false}
          activeDot={{ r: 5, fill: '#006daa', strokeWidth: 2, stroke: '#fff' }}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
