import { CarbonInput, ReductionPlan } from '@/types';
import {
  calculateTravelEmissions,
  calculateFoodEmissions,
  calculateEnergyEmissions,
} from './carbonCalculator';

export function generateRecommendations(input: CarbonInput): ReductionPlan[] {
  const travelKg = calculateTravelEmissions(input.travel);
  const foodKg = calculateFoodEmissions(input.food);
  const energyKg = calculateEnergyEmissions(input.energy);

  const recommendations: ReductionPlan[] = [];

  // Travel recommendations
  if (input.travel.carKmWeek > 30) {
    recommendations.push({
      id: 'carpool',
      title: 'Start Carpooling',
      description: 'Share rides with colleagues or friends to reduce per-person emissions.',
      category: 'travel',
      estimatedSavings: Math.round(travelKg * 0.4),
      difficulty: 'Easy',
      timeframe: 'Immediate',
      icon: '🚗',
    });
  }

  if (input.travel.carType !== 'ev' && input.travel.carKmWeek > 20) {
    recommendations.push({
      id: 'switch-ev',
      title: 'Switch to Electric Vehicle',
      description: 'Electric vehicles reduce emissions by up to 80% compared to petrol cars.',
      category: 'travel',
      estimatedSavings: Math.round(travelKg * 0.8),
      difficulty: 'Hard',
      timeframe: '6-12 months',
      icon: '⚡',
    });
  }

  if (input.travel.longFlightsPerYear > 2) {
    recommendations.push({
      id: 'reduce-flights',
      title: 'Reduce Air Travel',
      description: 'Consider virtual meetings or train alternatives for shorter distances.',
      category: 'travel',
      estimatedSavings: Math.round(input.travel.longFlightsPerYear * 400),
      difficulty: 'Medium',
      timeframe: 'Ongoing',
      icon: '✈️',
    });
  }

  if (input.travel.publicTransitKmWeek < input.travel.carKmWeek * 0.5) {
    recommendations.push({
      id: 'public-transit',
      title: 'Use Public Transportation',
      description:
        'Public transit produces 50% less emissions per passenger-km than cars.',
      category: 'travel',
      estimatedSavings: Math.round(travelKg * 0.5),
      difficulty: 'Easy',
      timeframe: 'Immediate',
      icon: '🚌',
    });
  }

  // Food recommendations
  if (input.food.dietType === 'meat-heavy') {
    recommendations.push({
      id: 'reduce-meat',
      title: 'Reduce Meat Consumption',
      description: 'Switch to 2-3 vegetarian days per week to significantly lower emissions.',
      category: 'food',
      estimatedSavings: Math.round(foodKg * 0.4),
      difficulty: 'Medium',
      timeframe: '1-2 weeks',
      icon: '🥗',
    });

    recommendations.push({
      id: 'vegan-meals',
      title: 'Adopt Plant-Based Meals',
      description:
        'Plant-based diets have 75% lower carbon footprint than meat-heavy diets.',
      category: 'food',
      estimatedSavings: Math.round(foodKg * 0.75),
      difficulty: 'Hard',
      timeframe: '1-3 months',
      icon: '🌱',
    });
  }

  if (input.food.dietType === 'moderate') {
    recommendations.push({
      id: 'go-vegetarian',
      title: 'Go Vegetarian',
      description: 'Eliminate meat to reduce food emissions by approximately 50%.',
      category: 'food',
      estimatedSavings: Math.round(foodKg * 0.5),
      difficulty: 'Medium',
      timeframe: '2-4 weeks',
      icon: '🥕',
    });
  }

  if (input.food.foodWaste > 1.2) {
    recommendations.push({
      id: 'reduce-waste',
      title: 'Reduce Food Waste',
      description:
        'Better meal planning and storage can reduce waste from 40% to 10%.',
      category: 'food',
      estimatedSavings: Math.round(foodKg * 0.3),
      difficulty: 'Easy',
      timeframe: 'Immediate',
      icon: '♻️',
    });
  }

  // Energy recommendations
  if (input.energy.renewablePercentage < 50) {
    recommendations.push({
      id: 'renewable-energy',
      title: 'Switch to Renewable Energy',
      description: 'Choose a green energy provider or install solar panels.',
      category: 'energy',
      estimatedSavings: Math.round(energyKg * 0.6),
      difficulty: 'Medium',
      timeframe: '1-3 months',
      icon: '☀️',
    });
  }

  if (input.energy.monthlyKwhUsage > 500) {
    recommendations.push({
      id: 'energy-efficiency',
      title: 'Improve Energy Efficiency',
      description: 'LED bulbs, better insulation, and smart thermostats reduce usage by 20-30%.',
      category: 'energy',
      estimatedSavings: Math.round(energyKg * 0.25),
      difficulty: 'Easy',
      timeframe: '1-2 weeks',
      icon: '💡',
    });
  }

  if (input.energy.acHoursPerDay > 6) {
    recommendations.push({
      id: 'ac-optimization',
      title: 'Optimize AC Usage',
      description: 'Smart thermostat settings and natural ventilation reduce cooling needs.',
      category: 'energy',
      estimatedSavings: Math.round((input.energy.acHoursPerDay - 4) * 365 * 0.5 * 0.4),
      difficulty: 'Easy',
      timeframe: 'Immediate',
      icon: '❄️',
    });
  }

  // Sort by potential savings (descending) and limit to top 8
  return recommendations
    .sort((a, b) => b.estimatedSavings - a.estimatedSavings)
    .slice(0, 8);
}

export function calculateSavings(recommendations: ReductionPlan[]): number {
  return recommendations.reduce((sum, rec) => sum + rec.estimatedSavings, 0);
}

export function simulateAppliedReductions(
  originalScore: number,
  recommendations: ReductionPlan[],
): { afterScore: number; totalReduction: number; percentageReduction: number } {
  const originalTons = (originalScore / 100) * 15; // Reverse normalize
  const totalReductionKg = calculateSavings(recommendations);
  const totalReductionTons = totalReductionKg / 1000;
  const newTons = Math.max(originalTons - totalReductionTons, 0);
  const newScore = (newTons / 15) * 100;

  return {
    afterScore: Math.round(newScore),
    totalReduction: Math.round(totalReductionKg),
    percentageReduction: Math.round((totalReductionTons / originalTons) * 100),
  };
}
