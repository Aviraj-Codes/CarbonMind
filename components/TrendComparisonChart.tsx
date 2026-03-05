'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendComparisonChartProps {
  beforeScore: number;
  afterScore: number;
  isSimulating: boolean;
}

export function TrendComparisonChart({
  beforeScore,
  afterScore,
  isSimulating,
}: TrendComparisonChartProps) {
  const data = [
    {
      name: 'Current',
      score: beforeScore,
    },
    {
      name: 'With Actions',
      score: isSimulating ? afterScore : beforeScore,
    },
  ];

  const reduction = Math.round(((beforeScore - afterScore) / beforeScore) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Potential Impact</h3>
          <p className="text-sm text-muted-foreground mt-1">
            How much you could reduce your emissions
          </p>
        </div>
        {isSimulating && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-sm font-semibold text-green-400"
          >
            {reduction}% Reduction
          </motion.div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" />
          <YAxis stroke="rgba(255, 255, 255, 0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: any) => value}
          />
          <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {isSimulating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
        >
          <p className="text-sm text-green-300">
            💚 By implementing these recommendations, you could reduce your carbon score from{' '}
            <span className="font-bold">{beforeScore}</span> to{' '}
            <span className="font-bold">{afterScore}</span> – a {reduction}% improvement!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
