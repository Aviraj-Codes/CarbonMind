'use client';

import { ReductionPlan } from '@/types';
import { motion } from 'framer-motion';

interface ReductionPlanCardProps {
  recommendations: ReductionPlan[];
}

export function ReductionPlanCard({ recommendations }: ReductionPlanCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#10b981';
      case 'Medium':
        return '#f59e0b';
      case 'Hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'travel':
        return '#3b82f6';
      case 'food':
        return '#10b981';
      case 'energy':
        return '#fbbf24';
      default:
        return '#6b7280';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Recommended Actions ({recommendations.length})
      </h3>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
            className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{rec.icon}</span>
                  <div>
                    <h4 className="font-semibold text-foreground">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-primary">
                  {rec.estimatedSavings.toLocaleString()} kg CO₂
                </div>
                <div className="text-xs text-muted-foreground">per year</div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
              <div
                className="px-2 py-1 rounded text-xs font-semibold text-white"
                style={{ backgroundColor: getDifficultyColor(rec.difficulty) }}
              >
                {rec.difficulty}
              </div>
              <div
                className="px-2 py-1 rounded text-xs font-semibold text-white"
                style={{ backgroundColor: getCategoryColor(rec.category) }}
              >
                {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
              </div>
              <div className="text-xs text-muted-foreground ml-auto">{rec.timeframe}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
