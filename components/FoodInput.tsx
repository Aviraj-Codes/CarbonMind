'use client';

import { CarbonInput } from '@/types';

interface FoodInputProps {
  data: CarbonInput['food'];
  onChange: (food: CarbonInput['food']) => void;
}

export function FoodInput({ data, onChange }: FoodInputProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Diet & Food</h3>

      {/* Diet Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Diet Type</label>
        <select
          value={data.dietType}
          onChange={(e) =>
            onChange({
              ...data,
              dietType: e.target.value as CarbonInput['food']['dietType'],
            })
          }
          className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg text-sm appearance-none cursor-pointer"
        >
          <option value="meat-heavy">Meat-Heavy (Daily)</option>
          <option value="moderate">Moderate (3-4x/week)</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
      </div>

      {/* Servings Per Week */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Food Servings Per Week: {data.servingsPerWeek}
        </label>
        <input
          type="range"
          min="3"
          max="21"
          value={data.servingsPerWeek}
          onChange={(e) =>
            onChange({
              ...data,
              servingsPerWeek: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <p className="text-xs text-muted-foreground">
          {data.servingsPerWeek <= 7 ? 'Low' : data.servingsPerWeek <= 14 ? 'Moderate' : 'High'} consumption
        </p>
      </div>

      {/* Food Waste */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Food Waste Multiplier: {data.foodWaste.toFixed(1)}x
        </label>
        <input
          type="range"
          min="1"
          max="2"
          step="0.1"
          value={data.foodWaste}
          onChange={(e) =>
            onChange({
              ...data,
              foodWaste: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <p className="text-xs text-muted-foreground">
          {data.foodWaste <= 1.2 ? 'Low waste' : data.foodWaste <= 1.5 ? 'Moderate waste' : 'High waste'}
        </p>
      </div>
    </div>
  );
}
