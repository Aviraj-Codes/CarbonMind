'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface EmissionsBreakdownChartProps {
  travel: number;
  food: number;
  energy: number;
}

export function EmissionsBreakdownChart({
  travel,
  food,
  energy,
}: EmissionsBreakdownChartProps) {
  const total = travel + food + energy;
  const data = [
    {
      name: 'Travel',
      value: Math.round((travel / total) * 100),
      kg: travel,
    },
    {
      name: 'Food',
      value: Math.round((food / total) * 100),
      kg: food,
    },
    {
      name: 'Energy',
      value: Math.round((energy / total) * 100),
      kg: energy,
    },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Emissions Breakdown</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: any) => `${value}%`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {data.map((item, index) => (
          <div key={item.name} className="text-center">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-2"
              style={{ backgroundColor: COLORS[index] }}
            />
            <div className="text-xs font-medium text-muted-foreground">{item.name}</div>
            <div className="text-sm font-semibold text-foreground">{item.value}%</div>
            <div className="text-xs text-muted-foreground">{Math.round(item.kg)} kg</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
