// Carbon input data structure
export interface CarbonInput {
  travel: {
    carKmWeek: number;
    carType: 'petrol' | 'diesel' | 'hybrid' | 'ev';
    publicTransitKmWeek: number;
    shortFlightsPerYear: number;
    longFlightsPerYear: number;
  };
  food: {
    dietType: 'meat-heavy' | 'moderate' | 'vegetarian' | 'vegan';
    servingsPerWeek: number;
    foodWaste: number; // 1-2 multiplier
  };
  energy: {
    monthlyKwhUsage: number;
    acHoursPerDay: number;
    renewablePercentage: number; // 0-100
  };
}

// Detailed carbon calculation results
export interface CarbonResult {
  totalTonsPerYear: number;
  carbonScore: number; // 0-100 scale
  category: 'Low' | 'Moderate' | 'High';
  breakdown: {
    travel: {
      value: number;
      percentage: number;
      details: {
        car: number;
        publicTransit: number;
        flights: number;
      };
    };
    food: {
      value: number;
      percentage: number;
    };
    energy: {
      value: number;
      percentage: number;
    };
  };
  behaviorCluster: BehaviorCluster;
  recommendations: ReductionPlan[];
}

// Behavioral classification
export interface BehaviorCluster {
  type:
    | 'High Impact Lifestyle'
    | 'Sustainable Urban'
    | 'Average Consumer'
    | 'Eco-Conscious'
    | 'Car Dependent'
    | 'Energy Intensive';
  description: string;
  sustainabilityLevel: 'Critical' | 'Concerning' | 'Moderate' | 'Good' | 'Excellent';
  dominantSource: 'travel' | 'food' | 'energy' | 'balanced';
  riskFactors: string[];
}

// Reduction plan with specific recommendations
export interface ReductionPlan {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'food' | 'energy';
  estimatedSavings: number; // kg CO₂ per year
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeframe: string;
  icon: string;
}

// Simulation state for before/after comparison
export interface SimulationState {
  beforeScore: number;
  afterScore: number;
  totalReduction: number;
  percentageReduction: number;
  appliedRecommendations: string[];
}
