import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { STATUS_META } from '../constants/status';
import type { PieDatum } from '../types';

interface StatusChartProps {
  pieData: PieDatum[];
}

export default function StatusChart({ pieData }: StatusChartProps) {
  if (pieData.length === 0) return null;

  return (
    <div className="vt-panel" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ width: 180, height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
              {pieData.map((d, i) => (
                <Cell key={i} fill={STATUS_META[d.name]?.color || '#999'} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pieData.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_META[d.name]?.color, display: 'inline-block' }} />
            <span style={{ fontWeight: 600 }}>{d.name}</span>
            <span style={{ color: 'var(--slate)' }}>— {d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
