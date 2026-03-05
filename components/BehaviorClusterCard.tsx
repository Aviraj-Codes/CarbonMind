'use client';

import { BehaviorCluster } from '@/types';
import { motion } from 'framer-motion';

interface BehaviorClusterCardProps {
  cluster: BehaviorCluster;
}

export function BehaviorClusterCard({ cluster }: BehaviorClusterCardProps) {
  const getSustainabilityColor = () => {
    switch (cluster.sustainabilityLevel) {
      case 'Excellent':
        return '#10b981';
      case 'Good':
        return '#06b6d4';
      case 'Moderate':
        return '#f59e0b';
      case 'Concerning':
        return '#ef4444';
      case 'Critical':
        return '#991b1b';
      default:
        return '#6b7280';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Behavioral Profile</h3>

      <div
        className="px-4 py-3 rounded-lg text-white font-semibold mb-4"
        style={{ backgroundColor: getSustainabilityColor() }}
      >
        {cluster.type}
      </div>

      <p className="text-sm text-foreground mb-6 leading-relaxed">{cluster.description}</p>

      <div className="space-y-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Sustainability Level
          </div>
          <div
            className="px-3 py-2 rounded-full text-sm font-semibold text-white w-fit"
            style={{ backgroundColor: getSustainabilityColor() }}
          >
            {cluster.sustainabilityLevel}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Primary Emission Source
          </div>
          <div className="text-sm font-semibold text-foreground capitalize">
            {cluster.dominantSource}
          </div>
        </div>

        {cluster.riskFactors.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">Risk Factors</div>
            <ul className="space-y-1">
              {cluster.riskFactors.map((factor, index) => (
                <li key={index} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
