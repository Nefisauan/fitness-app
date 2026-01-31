import { SupabaseClient } from '@supabase/supabase-js'
import {
  UserProfile,
  PainDiscomfort,
  PhysiqueAnalysis,
  WorkoutPlan,
  NutritionPlan,
  RecoveryPlan,
} from '@/lib/types'

export interface ProgressEntry {
  id: string
  date: string
  muscleScore: number
  postureStatus: string
  movementQuality: string
  mobilityScore: number
  stabilityScore: number
  weight?: number
}

// ── Profile ─────────────────────────────────────────────────────────────────

export async function loadProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<{ profile: UserProfile; painAreas: PainDiscomfort } | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    profile: {
      age: data.age ?? undefined,
      gender: data.gender ?? undefined,
      height: data.height ?? undefined,
      weight: data.weight ?? undefined,
      activityLevel: data.activity_level || 'moderate',
      sleepHours: data.sleep_hours ?? undefined,
      trainingHistory: data.training_history || 'intermediate',
      goal: data.goal || 'aesthetic',
      splitPreference: data.split_preference || 'recommended',
    },
    painAreas: data.pain_areas || {
      lowerBack: false,
      shoulders: false,
      knees: false,
      neck: false,
      hips: false,
      ankles: false,
      wrists: false,
    },
  }
}

export async function saveProfile(
  supabase: SupabaseClient,
  userId: string,
  profile: UserProfile,
  painAreas: PainDiscomfort
): Promise<void> {
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    age: profile.age ?? null,
    gender: profile.gender ?? null,
    height: profile.height ?? null,
    weight: profile.weight ?? null,
    activity_level: profile.activityLevel,
    sleep_hours: profile.sleepHours ?? null,
    training_history: profile.trainingHistory,
    goal: profile.goal,
    split_preference: profile.splitPreference,
    pain_areas: painAreas,
    updated_at: new Date().toISOString(),
  })

  if (error) console.error('Failed to save profile:', error)
}

// ── Assessments ─────────────────────────────────────────────────────────────

export async function loadLatestAssessment(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  id: string
  analysis: PhysiqueAnalysis
  workoutPlan: WorkoutPlan
  nutritionPlan: NutritionPlan
  recoveryPlan: RecoveryPlan
} | null> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    analysis: data.analysis as PhysiqueAnalysis,
    workoutPlan: data.workout_plan as WorkoutPlan,
    nutritionPlan: data.nutrition_plan as NutritionPlan,
    recoveryPlan: data.recovery_plan as RecoveryPlan,
  }
}

export async function saveAssessment(
  supabase: SupabaseClient,
  userId: string,
  payload: {
    analysis: PhysiqueAnalysis
    workoutPlan: WorkoutPlan
    nutritionPlan: NutritionPlan
    recoveryPlan: RecoveryPlan
    profile: UserProfile
    painAreas: PainDiscomfort
  }
): Promise<string | null> {
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      user_id: userId,
      analysis: payload.analysis,
      workout_plan: payload.workoutPlan,
      nutrition_plan: payload.nutritionPlan,
      recovery_plan: payload.recoveryPlan,
      profile_snapshot: payload.profile,
      pain_snapshot: payload.painAreas,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to save assessment:', error)
    return null
  }

  return data.id
}

// ── Progress Entries ────────────────────────────────────────────────────────

export async function loadProgressEntries(
  supabase: SupabaseClient,
  userId: string
): Promise<ProgressEntry[]> {
  const { data, error } = await supabase
    .from('progress_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error || !data) return []

  return data.map((row) => ({
    id: row.id,
    date: row.created_at.split('T')[0],
    muscleScore: row.muscle_score,
    postureStatus: row.posture_status,
    movementQuality: row.movement_quality,
    mobilityScore: row.mobility_score,
    stabilityScore: row.stability_score,
    weight: row.weight ?? undefined,
  }))
}

export async function saveProgressEntry(
  supabase: SupabaseClient,
  userId: string,
  entry: ProgressEntry,
  assessmentId?: string
): Promise<void> {
  const { error } = await supabase.from('progress_entries').insert({
    user_id: userId,
    assessment_id: assessmentId ?? null,
    muscle_score: entry.muscleScore,
    posture_status: entry.postureStatus,
    movement_quality: entry.movementQuality,
    mobility_score: entry.mobilityScore,
    stability_score: entry.stabilityScore,
    weight: entry.weight ?? null,
  })

  if (error) console.error('Failed to save progress entry:', error)
}
