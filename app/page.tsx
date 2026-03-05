'use client';

import { useState, useEffect } from 'react';
import { CarbonInput, CarbonResult } from '@/types';
import { Navbar } from '@/components/Navbar';
import { TravelInput } from '@/components/TravelInput';
import { FoodInput } from '@/components/FoodInput';
import { EnergyInput } from '@/components/EnergyInput';
import { CarbonScoreCard } from '@/components/CarbonScoreCard';
import { EmissionsBreakdownChart } from '@/components/EmissionsBreakdownChart';
import { BehaviorClusterCard } from '@/components/BehaviorClusterCard';
import { ReductionPlanCard } from '@/components/ReductionPlanCard';
import { TrendComparisonChart } from '@/components/TrendComparisonChart';

const DEFAULT_INPUT: CarbonInput = {
  travel: {
    carKmWeek: 50,
    carType: 'petrol',
    publicTransitKmWeek: 20,
    shortFlightsPerYear: 2,
    longFlightsPerYear: 1,
  },
  food: {
    dietType: 'moderate',
    servingsPerWeek: 10,
    foodWaste: 1.2,
  },
  energy: {
    monthlyKwhUsage: 500,
    acHoursPerDay: 4,
    renewablePercentage: 20,
  },
};

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [input, setInput] = useState<CarbonInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationScore, setSimulationScore] = useState(0);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculateEmissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data: CarbonResult = await response.json();
      setResult(data);
      setSimulationScore(data.carbonScore);
      setHasCalculated(true);
    } catch (error) {
      console.error('Failed to calculate carbon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update simulation score when recommendations change or simulation toggles
  useEffect(() => {
    if (result && isSimulating) {
      const totalSavings = result.recommendations.reduce((sum, rec) => sum + rec.estimatedSavings, 0);
      const originalTons = (result.carbonScore / 100) * 15;
      const newTons = Math.max(originalTons - totalSavings / 1000, 0);
      const newScore = (newTons / 15) * 100;
      setSimulationScore(Math.round(newScore));
    } else if (result) {
      setSimulationScore(result.carbonScore);
    }
  }, [isSimulating, result]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen transition-colors ${
        darkMode ? 'bg-black' : 'bg-white'
      }`}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Inputs */}
            <div className="space-y-6">
              <div className={`rounded-2xl p-6 ${
                darkMode
                  ? 'bg-slate-900 border border-slate-700'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <TravelInput
                  data={input.travel}
                  onChange={(travel) => setInput({ ...input, travel })}
                />
              </div>

              <div className={`rounded-2xl p-6 ${
                darkMode
                  ? 'bg-slate-900 border border-slate-700'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <FoodInput
                  data={input.food}
                  onChange={(food) => setInput({ ...input, food })}
                />
              </div>

              <div className={`rounded-2xl p-6 ${
                darkMode
                  ? 'bg-slate-900 border border-slate-700'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <EnergyInput
                  data={input.energy}
                  onChange={(energy) => setInput({ ...input, energy })}
                />
              </div>

              <button
                onClick={handleCalculateEmissions}
                disabled={isLoading}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                  darkMode
                    ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600'
                    : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400'
                } disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Calculating...' : 'Calculate Emissions'}
              </button>
            </div>

            {/* Right Column: Analytics */}
            {hasCalculated && (
              <div className="lg:col-span-2 space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : result ? (
                  <>
                    <CarbonScoreCard
                      score={result.carbonScore}
                      category={result.category}
                    />

                    <EmissionsBreakdownChart
                      travel={result.breakdown.travel.value}
                      food={result.breakdown.food.value}
                      energy={result.breakdown.energy.value}
                    />

                    <BehaviorClusterCard cluster={result.behaviorCluster} />
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Full Width: Recommendations and Simulation */}
          {hasCalculated && result && (
            <div className="mt-8 space-y-6">
              <ReductionPlanCard recommendations={result.recommendations} />

              <div className={`rounded-2xl p-6 ${
                darkMode
                  ? 'bg-slate-900 border border-slate-700'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Apply Recommendations</h3>
                  <button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isSimulating
                        ? darkMode
                          ? 'bg-green-600 text-white'
                          : 'bg-green-500 text-white'
                        : darkMode
                        ? 'bg-slate-700 border border-slate-600 text-foreground hover:bg-slate-600'
                        : 'bg-gray-200 border border-gray-300 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {isSimulating ? '✓ Simulation Active' : 'Run Simulation'}
                  </button>
                </div>
                <TrendComparisonChart
                  beforeScore={result.carbonScore}
                  afterScore={simulationScore}
                  isSimulating={isSimulating}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
