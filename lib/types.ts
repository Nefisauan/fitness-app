// Unit system
export type UnitSystem = 'metric' | 'imperial';

// User profile and input types
export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // always stored in cm
  weight?: number; // always stored in kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  sleepHours?: number;
  trainingHistory: 'beginner' | 'intermediate' | 'advanced';
  goal: FitnessGoal;
  splitPreference: WorkoutSplit;
  musclePriorities?: MusclePriorities;
  unitPreference: UnitSystem;
}

export type FitnessGoal = 'lean' | 'bulk' | 'aesthetic' | 'recomp' | 'posture';
export type WorkoutSplit = 'full_body' | 'upper_lower' | 'ppl' | 'ppl_ul' | 'arnold' | 'recommended';

export type MuscleTarget =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'arms'
  | 'core'
  | 'calves';

export type MusclePriorities = MuscleTarget[];

export interface PainDiscomfort {
  lowerBack: boolean;
  shoulders: boolean;
  knees: boolean;
  neck: boolean;
  hips: boolean;
  ankles: boolean;
  wrists: boolean;
}

export interface UploadedMedia {
  id: string;
  type: 'photo' | 'video';
  angle: 'front' | 'side' | 'back' | 'movement';
  dataUrl: string;
  timestamp: Date;
}

// Analysis result types
export interface MuscleGroup {
  name: string;
  development: 'underdeveloped' | 'balanced' | 'well_developed' | 'overdominant';
  score: number; // 1-10
  notes: string;
}

export interface MuscleAnalysis {
  groups: MuscleGroup[];
  symmetry: {
    leftRight: 'balanced' | 'left_dominant' | 'right_dominant';
    upperLower: 'balanced' | 'upper_dominant' | 'lower_dominant';
    frontBack: 'balanced' | 'anterior_dominant' | 'posterior_dominant';
  };
  overallScore: number;
  priorityAreas: string[];
}

export interface PosturalIndicator {
  area: string;
  indicator: string;
  severity: 'mild' | 'moderate' | 'notable';
  recommendation: string;
}

export interface PosturalAnalysis {
  indicators: PosturalIndicator[];
  overallPosture: 'good' | 'fair' | 'needs_attention';
  primaryConcerns: string[];
}

export interface MovementFlag {
  movement: string;
  observation: string;
  limitation: 'mobility' | 'stability' | 'compensation';
  affectedArea: string;
  recommendation: string;
}

export interface MovementAnalysis {
  flags: MovementFlag[];
  mobilityScore: number;
  stabilityScore: number;
  overallMovementQuality: 'excellent' | 'good' | 'fair' | 'needs_work';
}

export interface BodyFatEstimate {
  percentage: number;
  range: string;
  category: 'essential' | 'athletic' | 'fitness' | 'acceptable' | 'elevated';
  confidence: 'low' | 'moderate' | 'high';
  notes: string;
}

export interface Weakness {
  area: string;
  description: string;
  impact: string;
}

export interface NextStep {
  action: string;
  rationale: string;
  priority: 'high' | 'medium';
}

export interface PhysiqueAnalysis {
  fitnessScore: number;
  bodyFat: BodyFatEstimate;
  muscle: MuscleAnalysis;
  posture: PosturalAnalysis;
  movement: MovementAnalysis;
  weaknesses: Weakness[];
  nextSteps: NextStep[];
  summary: string;
  disclaimer: string;
}

// Workout types
export interface Exercise {
  name: string;
  targetMuscles: string[];
  sets: number;
  reps: string; // e.g., "8-12" or "30 sec"
  tempo?: string; // e.g., "3-1-2-0"
  rest: string; // e.g., "60-90 sec"
  notes?: string;
  purpose: 'strength' | 'hypertrophy' | 'mobility' | 'stability' | 'warmup';
}

export interface WorkoutDay {
  day: string;
  focus: string;
  warmup: Exercise[];
  mainWorkout: Exercise[];
  cooldown: Exercise[];
  estimatedDuration: number; // minutes
}

export interface WorkoutPlan {
  name: string;
  description: string;
  daysPerWeek: number;
  schedule: WorkoutDay[];
  progressionNotes: string;
  modifications: string[];
}

// Nutrition types
export interface MacroTargets {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
}

export interface MealSuggestion {
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  description: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  options: string[];
}

export interface NutritionPlan {
  dailyTargets: MacroTargets;
  mealStructure: MealSuggestion[];
  hydrationTarget: number; // liters
  supplements?: string[];
  timing: string;
  notes: string[];
}

// Recovery types
export interface RecoveryPlan {
  sleepRecommendation: {
    hours: number;
    tips: string[];
  };
  restDays: number;
  activeRecovery: string[];
  mobilityWork: string[];
  stressManagement: string[];
}

// Progress tracking types
export interface ProgressEntry {
  date: Date;
  photos?: UploadedMedia[];
  weight?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  muscleScore?: number;
  postureScore?: number;
  movementScore?: number;
  notes?: string;
}

export interface ProgressTracker {
  entries: ProgressEntry[];
  startDate: Date;
  improvements: {
    area: string;
    change: 'improved' | 'maintained' | 'declined';
    details: string;
  }[];
}

// Complete assessment result
export interface AssessmentResult {
  id: string;
  timestamp: Date;
  userProfile: UserProfile;
  media: UploadedMedia[];
  painAreas: PainDiscomfort;
  analysis: PhysiqueAnalysis;
  workoutPlan: WorkoutPlan;
  nutritionPlan: NutritionPlan;
  recoveryPlan: RecoveryPlan;
}

// ── Workout Tracking Types ─────────────────────────────────────────────

export interface SetLog {
  setNumber: number;
  reps: number | null;
  weight: number | null;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseName: string;
  section: 'warmup' | 'main' | 'cooldown';
  planned: { sets: number; reps: string };
  actual: SetLog[];
  completed: boolean;
  skipped: boolean;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  assessmentId?: string;
  workoutDayIndex: number;
  workoutDayLabel: string;
  workoutFocus: string;
  exercises: ExerciseLog[];
  startedAt: string;
  completedAt?: string;
  durationMinutes?: number;
  notes?: string;
  createdAt: string;
}

export interface WorkoutStreak {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  thisWeekCount: number;
  lastWorkoutDate: string | null;
}

// ── Weekly Check-in Types ──────────────────────────────────────────────

export interface BodyMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
}

export interface WeeklyCheckin {
  id: string;
  checkinDate: string;
  weight?: number;
  measurements: BodyMeasurements;
  energyRating?: number;
  sorenessRating?: number;
  sleepRating?: number;
  motivationRating?: number;
  notes?: string;
  createdAt: string;
}

// ── Progress Photo Types ───────────────────────────────────────────────

export type PhotoAngle = 'front' | 'side' | 'back';

export interface ProgressPhoto {
  id: string;
  checkinId?: string;
  angle: PhotoAngle;
  storagePath: string;
  signedUrl?: string;
  photoDate: string;
  createdAt: string;
}
