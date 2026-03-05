'use client';

import { CarbonInput } from '@/types';

interface TravelInputProps {
  data: CarbonInput['travel'];
  onChange: (travel: CarbonInput['travel']) => void;
}

export function TravelInput({ data, onChange }: TravelInputProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Travel & Transportation</h3>

      {/* Car Usage */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Car Usage (km/week): {data.carKmWeek}
        </label>
        <input
          type="range"
          min="0"
          max="300"
          value={data.carKmWeek}
          onChange={(e) =>
            onChange({
              ...data,
              carKmWeek: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex gap-2">
          <select
            value={data.carType}
            onChange={(e) =>
              onChange({
                ...data,
                carType: e.target.value as CarbonInput['travel']['carType'],
              })
            }
            className="flex-1 px-3 py-2 border border-input bg-background text-foreground rounded-lg text-sm appearance-none cursor-pointer"
          >
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="ev">Electric</option>
          </select>
        </div>
      </div>

      {/* Public Transit */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Public Transit (km/week): {data.publicTransitKmWeek}
        </label>
        <input
          type="range"
          min="0"
          max="200"
          value={data.publicTransitKmWeek}
          onChange={(e) =>
            onChange({
              ...data,
              publicTransitKmWeek: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Short Flights */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Short Flights/Year: {data.shortFlightsPerYear}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={data.shortFlightsPerYear}
          onChange={(e) =>
            onChange({
              ...data,
              shortFlightsPerYear: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Long Flights */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Long Flights/Year: {data.longFlightsPerYear}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={data.longFlightsPerYear}
          onChange={(e) =>
            onChange({
              ...data,
              longFlightsPerYear: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
}
