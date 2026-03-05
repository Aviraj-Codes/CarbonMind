import { CarbonInput, CarbonResult, BehaviorCluster } from '@/types';
// Fuel emission factors (kg CO₂ per km)
const FUEL_FACTORS = {
  petrol: 0.192,
  diesel: 0.171,
  hybrid: 0.096,
  ev: 0.041,
};
// Diet baseline emissions (kg CO₂ per week)
const DIET_BASELINES = {
  'meat-heavy': 15.0, moderate: 10.0, vegetarian: 5.0, vegan: 2.5,
};
// Grid CO₂ intensity (kg CO₂ per kWh) - global average
const GRID_INTENSITY = 0.475;
export function calculateTravelEmissions(travel: CarbonInput['travel']): number {
  const carEmissions =
    travel.carKmWeek * 52 * FUEL_FACTORS[travel.carType];
  const publicTransitEmissions = travel.publicTransitKmWeek * 52 * 0.105; // kg per km
  const shortFlightEmissions = travel.shortFlightsPerYear * 150; // kg per flight
  const longFlightEmissions = travel.longFlightsPerYear * 600; // kg per flight
  return (
    carEmissions + publicTransitEmissions + shortFlightEmissions + longFlightEmissions
  );
}
export function calculateFoodEmissions(food: CarbonInput['food']): number {
  const baseline = DIET_BASELINES[food.dietType];
  const servingsAdjustment = (food.servingsPerWeek - 3) * 0.5; // 3 servings baseline
  const adjustedBaseline = Math.max(baseline + servingsAdjustment, 0.5);
  const withWaste = adjustedBaseline * food.foodWaste;
  return withWaste * 52; // Convert to annual
}
export function calculateEnergyEmissions(energy: CarbonInput['energy']): number {
  const annualKwh = energy.monthlyKwhUsage * 12;
  const baseEmissions = annualKwh * GRID_INTENSITY;
  const acEmissions = energy.acHoursPerDay * 365 * 0.5 * (1 - energy.renewablePercentage / 100);
  const renewableReduction = (baseEmissions * energy.renewablePercentage) / 100;
  return Math.max(baseEmissions + acEmissions - renewableReduction, 0);
}
export function calculateTotalCarbonScore(result: {
  travelKg: number;
  foodKg: number;
  energyKg: number;
}): { score: number; category: 'Low' | 'Moderate' | 'High'; totalTons: number } {
  const totalKg = result.travelKg + result.foodKg + result.energyKg;
  const totalTons = totalKg / 1000;
  // Normalize to 0-100 scale (15 tons = 100)
  let score = (totalTons / 15) * 100;
  score = Math.min(Math.max(score, 0), 100);
  let category: 'Low' | 'Moderate' | 'High' = 'Moderate';
  if (score < 33) category = 'Low';
  else if (score > 66) category = 'High';
  return { score: Math.round(score), category, totalTons: Math.round(totalTons * 100) / 100 };
}
export function categorizeCarbonScore(
  input: CarbonInput,
  score: number,
): BehaviorCluster {
  const travelKg = calculateTravelEmissions(input.travel);
  const foodKg = calculateFoodEmissions(input.food);
  const energyKg = calculateEnergyEmissions(input.energy);
  const dominantSource =
    travelKg > foodKg && travelKg > energyKg
      ? 'travel'
      : foodKg > energyKg
        ? 'food'
        : energyKg > travelKg
          ? 'energy'
          : 'balanced';
  let type: BehaviorCluster['type'];
  let description: string;
  let sustainabilityLevel: BehaviorCluster['sustainabilityLevel'];
  let riskFactors: string[] = [];
  // Clustering logic
  if (input.food.dietType === 'meat-heavy' && input.travel.longFlightsPerYear > 2) {
    type = 'High Impact Lifestyle';
    description =
      'High meat consumption combined with frequent long-haul flights creates significant emissions.';
    sustainabilityLevel = 'Critical';
    riskFactors.push('Frequent air travel', 'High meat consumption');
  } else if (
    input.travel.carKmWeek > 50 &&
    input.energy.monthlyKwhUsage > 800
  ) {
    type = 'Car Dependent';
    description =
      'Your carbon footprint is heavily influenced by car usage and energy consumption.';
    sustainabilityLevel = 'Concerning';
    riskFactors.push('High car dependency', 'High energy usage');
  } else if (
    input.travel.publicTransitKmWeek > input.travel.carKmWeek &&
    input.energy.renewablePercentage > 50
  ) {
    type = 'Sustainable Urban';
    description =
      'Your sustainable choices in transit and energy align well with environmental goals.';
    sustainabilityLevel = 'Good';
    riskFactors.push('Occasional air travel');
  } else if (
    input.food.dietType === 'vegan' &&
    input.travel.carKmWeek < 20 &&
    input.energy.renewablePercentage > 30
  ) {
    type = 'Eco-Conscious';
    description =
      'Your lifestyle choices demonstrate strong environmental commitment across all categories.';
    sustainabilityLevel = 'Excellent';
    riskFactors = [];
  } else if (input.travel.carKmWeek > 100) {
    type = 'Car Dependent';
    description = 'High car usage is your primary emission driver.';
    sustainabilityLevel = 'Concerning';
    riskFactors.push('Very high car dependency');
  } else if (input.energy.monthlyKwhUsage > 1000) {
    type = 'Energy Intensive';
    description = 'High electricity consumption is your dominant emission source.';
    sustainabilityLevel = 'Concerning';
    riskFactors.push('Very high energy usage');
  } else {
    type = 'Average Consumer';
    description = 'Your carbon footprint reflects typical consumption patterns.';
    sustainabilityLevel = score > 66 ? 'Concerning' : score > 33 ? 'Moderate' : 'Good';
    riskFactors.push('Balanced emissions across categories');
  }
  return {
    type,
    description,
    sustainabilityLevel,
    dominantSource,
    riskFactors,
  };
}