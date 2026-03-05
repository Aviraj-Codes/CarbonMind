import { NextRequest, NextResponse } from 'next/server';
import { CarbonInput, CarbonResult } from '@/types';
import {
  calculateTravelEmissions,
  calculateFoodEmissions,
  calculateEnergyEmissions,
  calculateTotalCarbonScore,
  categorizeCarbonScore,
} from '@/utils/carbonCalculator';
import { generateRecommendations } from '@/utils/reductionPlanner';

export async function POST(request: NextRequest) {
  try {
    const input: CarbonInput = await request.json();

    // Validate input
    if (
      !input.travel ||
      !input.food ||
      !input.energy
    ) {
      return NextResponse.json(
        { error: 'Missing required fields in input' },
        { status: 400 },
      );
    }

    // Calculate emissions by category
    const travelKg = calculateTravelEmissions(input.travel);
    const foodKg = calculateFoodEmissions(input.food);
    const energyKg = calculateEnergyEmissions(input.energy);

    // Calculate total score
    const { score, category, totalTons } = calculateTotalCarbonScore({
      travelKg,
      foodKg,
      energyKg,
    });

    // Calculate percentages
    const total = travelKg + foodKg + energyKg;
    const travelPercentage = (travelKg / total) * 100;
    const foodPercentage = (foodKg / total) * 100;
    const energyPercentage = (energyKg / total) * 100;

    // Get behavioral cluster
    const behaviorCluster = categorizeCarbonScore(input, score);

    // Generate recommendations
    const recommendations = generateRecommendations(input);

    // Calculate travel details breakdown
    const carEmissions = input.travel.carKmWeek * 52 * 
      { petrol: 0.192, diesel: 0.171, hybrid: 0.096, ev: 0.041 }[input.travel.carType];
    const publicTransitEmissions = input.travel.publicTransitKmWeek * 52 * 0.105;
    const flightEmissions =
      input.travel.shortFlightsPerYear * 150 +
      input.travel.longFlightsPerYear * 600;

    const result: CarbonResult = {
      totalTonsPerYear: totalTons,
      carbonScore: score,
      category,
      breakdown: {
        travel: {
          value: Math.round(travelKg),
          percentage: Math.round(travelPercentage),
          details: {
            car: Math.round(carEmissions),
            publicTransit: Math.round(publicTransitEmissions),
            flights: Math.round(flightEmissions),
          },
        },
        food: {
          value: Math.round(foodKg),
          percentage: Math.round(foodPercentage),
        },
        energy: {
          value: Math.round(energyKg),
          percentage: Math.round(energyPercentage),
        },
      },
      behaviorCluster,
      recommendations,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Carbon calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate carbon footprint' },
      { status: 500 },
    );
  }
}
