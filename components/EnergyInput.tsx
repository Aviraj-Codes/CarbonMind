'use client';

import { CarbonInput } from '@/types';

interface EnergyInputProps {
  data: CarbonInput['energy'];
  onChange: (energy: CarbonInput['energy']) => void;
}

export function EnergyInput({ data, onChange }: EnergyInputProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Energy & Electricity</h3>

      {/* Monthly Usage */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Monthly Usage (kWh): {data.monthlyKwhUsage}
        </label>
        <input
          type="range"
          min="100"
          max="1500"
          value={data.monthlyKwhUsage}
          onChange={(e) =>
            onChange({
              ...data,
              monthlyKwhUsage: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <p className="text-xs text-muted-foreground">
          {data.monthlyKwhUsage < 300 ? 'Below average' : data.monthlyKwhUsage < 800 ? 'Average' : 'Above average'}
        </p>
      </div>

      {/* AC Hours */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          AC Usage (hours/day): {data.acHoursPerDay}
        </label>
        <input
          type="range"
          min="0"
          max="24"
          value={data.acHoursPerDay}
          onChange={(e) =>
            onChange({
              ...data,
              acHoursPerDay: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Renewable Percentage */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Renewable Energy: {data.renewablePercentage}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={data.renewablePercentage}
          onChange={(e) =>
            onChange({
              ...data,
              renewablePercentage: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <p className="text-xs text-muted-foreground">
          {data.renewablePercentage === 0 ? 'Using grid electricity' : data.renewablePercentage < 50 ? 'Partial green energy' : 'Mostly renewable'}
        </p>
      </div>
    </div>
  );
}
