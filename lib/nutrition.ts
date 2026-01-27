import { UserProfile, FitnessGoal, MacroTargets, NutritionPlan, MealSuggestion } from './types';

// Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Activity multipliers for TDEE
const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Goal-based calorie adjustments
const goalAdjustments: Record<FitnessGoal, number> = {
  lean: -500, // Deficit
  bulk: 400, // Surplus
  aesthetic: 200, // Slight surplus
  recomp: 0, // Maintenance
  posture: 0, // Maintenance
};

export function calculateMacros(profile: UserProfile): MacroTargets {
  const weight = profile.weight || 70;
  const height = profile.height || 170;
  const age = profile.age || 30;
  const gender = profile.gender || 'male';

  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = bmr * activityMultipliers[profile.activityLevel];
  const targetCalories = Math.round(tdee + goalAdjustments[profile.goal]);

  // Protein: 1.6-2.2g per kg for active individuals
  let proteinMultiplier = 1.8;
  if (profile.goal === 'bulk' || profile.goal === 'aesthetic') {
    proteinMultiplier = 2.0;
  } else if (profile.goal === 'lean') {
    proteinMultiplier = 2.2; // Higher during deficit
  }

  const protein = Math.round(weight * proteinMultiplier);
  const proteinCalories = protein * 4;

  // Fats: 25-35% of calories
  let fatPercent = 0.28;
  if (profile.goal === 'lean') {
    fatPercent = 0.25;
  } else if (profile.goal === 'bulk') {
    fatPercent = 0.30;
  }

  const fatCalories = targetCalories * fatPercent;
  const fats = Math.round(fatCalories / 9);

  // Carbs: remaining calories
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.round(carbCalories / 4);

  return {
    calories: targetCalories,
    protein,
    carbs: Math.max(carbs, 50), // Minimum carbs
    fats,
  };
}

function generateMealStructure(macros: MacroTargets, goal: FitnessGoal): MealSuggestion[] {
  const meals: MealSuggestion[] = [];

  // Breakfast - 25% of daily intake
  meals.push({
    meal: 'breakfast',
    description: 'Start your day with protein and complex carbs for sustained energy',
    macros: {
      calories: Math.round(macros.calories * 0.25),
      protein: Math.round(macros.protein * 0.25),
      carbs: Math.round(macros.carbs * 0.25),
      fats: Math.round(macros.fats * 0.25),
    },
    options: [
      'Eggs with whole grain toast and avocado',
      'Greek yogurt with berries and granola',
      'Protein oatmeal with banana and nut butter',
      'Egg white omelet with vegetables and cheese',
    ],
  });

  // Lunch - 30% of daily intake
  meals.push({
    meal: 'lunch',
    description: 'Balanced meal with lean protein, vegetables, and complex carbs',
    macros: {
      calories: Math.round(macros.calories * 0.30),
      protein: Math.round(macros.protein * 0.30),
      carbs: Math.round(macros.carbs * 0.30),
      fats: Math.round(macros.fats * 0.25),
    },
    options: [
      'Grilled chicken salad with quinoa',
      'Turkey and vegetable wrap',
      'Salmon with sweet potato and broccoli',
      'Lean beef stir-fry with rice',
    ],
  });

  // Pre-workout snack - 10%
  meals.push({
    meal: 'pre_workout',
    description: 'Light, easily digestible carbs and protein 1-2 hours before training',
    macros: {
      calories: Math.round(macros.calories * 0.10),
      protein: Math.round(macros.protein * 0.10),
      carbs: Math.round(macros.carbs * 0.15),
      fats: Math.round(macros.fats * 0.05),
    },
    options: [
      'Banana with almond butter',
      'Rice cakes with honey',
      'Small protein shake with fruit',
      'Greek yogurt with berries',
    ],
  });

  // Post-workout - 15%
  meals.push({
    meal: 'post_workout',
    description: 'Fast-digesting protein and carbs within 30-60 minutes after training',
    macros: {
      calories: Math.round(macros.calories * 0.15),
      protein: Math.round(macros.protein * 0.20),
      carbs: Math.round(macros.carbs * 0.20),
      fats: Math.round(macros.fats * 0.10),
    },
    options: [
      'Protein shake with banana',
      'Chocolate milk and protein bar',
      'Chicken with white rice',
      'Tuna sandwich on white bread',
    ],
  });

  // Dinner - 20%
  meals.push({
    meal: 'dinner',
    description: 'Lean protein with vegetables, moderate carbs',
    macros: {
      calories: Math.round(macros.calories * 0.20),
      protein: Math.round(macros.protein * 0.15),
      carbs: Math.round(macros.carbs * 0.10),
      fats: Math.round(macros.fats * 0.35),
    },
    options: [
      'Grilled fish with roasted vegetables',
      'Lean steak with asparagus',
      'Chicken breast with mixed greens',
      'Shrimp and vegetable stir-fry',
    ],
  });

  return meals;
}

export function generateNutritionPlan(profile: UserProfile): NutritionPlan {
  const macros = calculateMacros(profile);
  const mealStructure = generateMealStructure(macros, profile.goal);

  // Hydration: ~35ml per kg body weight
  const weight = profile.weight || 70;
  const hydrationTarget = Math.round((weight * 35) / 1000 * 10) / 10;

  const notes: string[] = [];

  if (profile.goal === 'lean') {
    notes.push('High protein during a deficit is critical — it preserves lean mass and increases satiety (Helms et al. 2014). Aim for 2.0-2.4g/kg.');
    notes.push('Rate of loss should be 0.5-1% bodyweight per week to minimize muscle loss. Slower cuts preserve more muscle.');
    notes.push('Prioritize high-volume, low-calorie foods (vegetables, lean protein, berries) for satiety. Fiber slows digestion and keeps you fuller.');
    notes.push('Refeed days (eating at maintenance 1-2x/week) can help with adherence and hormone regulation during extended deficits.');
  } else if (profile.goal === 'bulk') {
    notes.push('A 200-400 calorie surplus is optimal for muscle gain while minimizing fat. Larger surpluses don\'t build more muscle — just more fat (Iraki et al. 2019).');
    notes.push('Protein timing matters less than total daily intake, but spreading 4-5 protein feedings across the day maximizes muscle protein synthesis peaks (Schoenfeld & Aragon 2018).');
    notes.push('Carbs fuel training performance. Prioritize carbs around workouts — pre-workout for energy, post-workout for glycogen replenishment.');
    notes.push('Track weekly weight trends, not daily fluctuations. Aim for 0.25-0.5% bodyweight gain per week.');
  } else if (profile.goal === 'aesthetic') {
    notes.push('Lean bulking — slight surplus (200-300 cal) maximizes the muscle-to-fat gain ratio. Body recomposition is possible for intermediates at maintenance.');
    notes.push('Nutrient timing can provide a small edge: 20-40g protein within 2 hours of training supports MPS (muscle protein synthesis).');
  }

  notes.push('Weigh yourself at the same time daily (morning, post-bathroom). Use the weekly average to track trends — daily weight fluctuates 1-3 lbs from water alone.');
  notes.push('Adherence > perfection. Hitting 80-90% of your targets consistently beats hitting 100% sporadically.');

  const supplements = [
    'Creatine monohydrate (5g daily) — most researched supplement in sports science. 5-10% strength increase, aids recovery. No need to load or cycle.',
    'Vitamin D3 (2000-5000 IU daily if sun exposure is limited) — most people are deficient. Supports testosterone, immune function, and bone health.',
    'Omega-3 fatty acids (2-3g EPA/DHA daily if fish intake is low) — anti-inflammatory, supports joint health and recovery.',
  ];

  if (profile.goal === 'lean' || profile.goal === 'recomp') {
    supplements.push('Caffeine (200-400mg pre-workout) — improves performance by 3-5%, increases fat oxidation. Time it 30-60 min before training.');
  }

  return {
    dailyTargets: macros,
    mealStructure,
    hydrationTarget,
    supplements,
    timing: profile.goal === 'bulk'
      ? 'Eat every 3-4 hours, 5-6 meals per day'
      : 'Focus on 3-4 main meals with strategic snacks around workouts',
    notes,
  };
}
