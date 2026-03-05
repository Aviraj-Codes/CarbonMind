'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CarbonScoreCardProps {
  score: number;
  category: 'Low' | 'Moderate' | 'High';
}

export function CarbonScoreCard({ score, category }: CarbonScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayScore((prev) => {
          if (prev < score) {
            return Math.min(prev + 2, score);
          }
          clearInterval(interval);
          return prev;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const getCategoryColor = () => {
    switch (category) {
      case 'Low':
        return '#10b981';
      case 'Moderate':
        return '#f59e0b';
      case 'High':
        return '#ef4444';
      default:
        return '#10b981';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Carbon Score</h3>

      <div className="relative w-40 h-40 mb-6">
        <svg width="160" height="160" className="transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="45"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.2"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="45"
            fill="none"
            stroke={getCategoryColor()}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">{displayScore}</div>
            <div className="text-xs text-muted-foreground mt-1">out of 100</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div
          className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: getCategoryColor() }}
        >
          {category} Emissions
        </div>
        <p className="text-xs text-muted-foreground mt-3 max-w-xs">
          {category === 'Low'
            ? 'Your carbon footprint is below average. Keep it up!'
            : category === 'Moderate'
              ? 'Your carbon footprint is moderate. There is room for improvement.'
              : 'Your carbon footprint is high. Consider the recommendations to reduce it.'}
        </p>
      </div>
    </motion.div>
  );
}
