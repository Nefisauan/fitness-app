'use client';

import { NutritionPlan as NutritionPlanType, RecoveryPlan } from '@/lib/types';

interface NutritionPlanProps {
  nutrition: NutritionPlanType;
  recovery: RecoveryPlan;
}

function MacroCard({ label, value, unit, color, percentage }: {
  label: string;
  value: number;
  unit: string;
  color: string;
  percentage: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-xs text-gray-400">{percentage}%</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value}<span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </p>
      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function MealCard({ meal }: { meal: NutritionPlanType['mealStructure'][0] }) {
  const mealIcons: Record<string, string> = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎',
    pre_workout: '⚡',
    post_workout: '💪',
  };

  const mealLabels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    pre_workout: 'Pre-Workout',
    post_workout: 'Post-Workout',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{mealIcons[meal.meal]}</span>
        <div>
          <h4 className="font-medium text-gray-900">{mealLabels[meal.meal]}</h4>
          <p className="text-xs text-gray-500">{meal.macros.calories} cal</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{meal.description}</p>

      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600">Protein</p>
          <p className="font-medium text-blue-700">{meal.macros.protein}g</p>
        </div>
        <div className="p-2 bg-orange-50 rounded-lg">
          <p className="text-xs text-orange-600">Carbs</p>
          <p className="font-medium text-orange-700">{meal.macros.carbs}g</p>
        </div>
        <div className="p-2 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-600">Fats</p>
          <p className="font-medium text-yellow-700">{meal.macros.fats}g</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500 mb-2">Meal Ideas:</p>
        <ul className="text-sm text-gray-600 space-y-1">
          {meal.options.map((option, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-emerald-500">•</span>
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function NutritionPlan({ nutrition, recovery }: NutritionPlanProps) {
  const totalMacroCalories =
    (nutrition.dailyTargets.protein * 4) +
    (nutrition.dailyTargets.carbs * 4) +
    (nutrition.dailyTargets.fats * 9);

  const proteinPercent = Math.round((nutrition.dailyTargets.protein * 4 / totalMacroCalories) * 100);
  const carbsPercent = Math.round((nutrition.dailyTargets.carbs * 4 / totalMacroCalories) * 100);
  const fatsPercent = Math.round((nutrition.dailyTargets.fats * 9 / totalMacroCalories) * 100);

  return (
    <div className="space-y-6">
      {/* Daily Targets */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Daily Nutrition Targets</h2>
        <p className="text-orange-100 mb-6">{nutrition.timing}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{nutrition.dailyTargets.calories}</p>
            <p className="text-sm text-orange-100">Calories</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{nutrition.dailyTargets.protein}g</p>
            <p className="text-sm text-orange-100">Protein</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{nutrition.dailyTargets.carbs}g</p>
            <p className="text-sm text-orange-100">Carbs</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{nutrition.dailyTargets.fats}g</p>
            <p className="text-sm text-orange-100">Fats</p>
          </div>
        </div>
      </div>

      {/* Macro Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MacroCard
          label="Protein"
          value={nutrition.dailyTargets.protein}
          unit="g"
          color="bg-blue-500"
          percentage={proteinPercent}
        />
        <MacroCard
          label="Carbohydrates"
          value={nutrition.dailyTargets.carbs}
          unit="g"
          color="bg-orange-500"
          percentage={carbsPercent}
        />
        <MacroCard
          label="Fats"
          value={nutrition.dailyTargets.fats}
          unit="g"
          color="bg-yellow-500"
          percentage={fatsPercent}
        />
      </div>

      {/* Meal Structure */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Meal Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nutrition.mealStructure.map((meal, index) => (
            <MealCard key={index} meal={meal} />
          ))}
        </div>
      </div>

      {/* Hydration & Supplements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Hydration Target</h3>
              <p className="text-sm text-gray-500">Daily water intake</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-blue-600 mb-2">{nutrition.hydrationTarget}L</p>
          <p className="text-sm text-gray-600">
            Aim to drink consistently throughout the day. Increase intake during workouts and hot weather.
          </p>
        </div>

        {nutrition.supplements && (
          <div className="bg-purple-50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Optional Supplements</h3>
                <p className="text-sm text-gray-500">Consider based on your needs</p>
              </div>
            </div>
            <ul className="space-y-2">
              {nutrition.supplements.map((supp, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-purple-500">•</span>
                  {supp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recovery Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Recovery & Lifestyle
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sleep */}
          <div className="p-4 bg-indigo-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Sleep Target</h4>
              <span className="text-2xl font-bold text-indigo-600">{recovery.sleepRecommendation.hours}h</span>
            </div>
            <ul className="space-y-1">
              {recovery.sleepRecommendation.tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Rest Days */}
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Rest Days per Week</h4>
              <span className="text-2xl font-bold text-green-600">{recovery.restDays}</span>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-2">Active Recovery Options:</p>
            <ul className="space-y-1">
              {recovery.activeRecovery.map((activity, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  {activity}
                </li>
              ))}
            </ul>
          </div>

          {/* Mobility */}
          <div className="p-4 bg-orange-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-3">Mobility Work</h4>
            <ul className="space-y-1">
              {recovery.mobilityWork.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-orange-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Stress Management */}
          <div className="p-4 bg-pink-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-3">Stress Management</h4>
            <ul className="space-y-1">
              {recovery.stressManagement.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Notes */}
      {nutrition.notes.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">Additional Notes</h4>
          <ul className="space-y-2">
            {nutrition.notes.map((note, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
