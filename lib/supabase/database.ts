import { SupabaseClient } from '@supabase/supabase-js'
import {
  UserProfile,
  PainDiscomfort,
  PhysiqueAnalysis,
  WorkoutPlan,
  NutritionPlan,
  RecoveryPlan,
  WorkoutLog,
  ExerciseLog,
  WeeklyCheckin,
  BodyMeasurements,
  ProgressPhoto,
  PhotoAngle,
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
      musclePriorities: data.muscle_priorities || [],
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
    muscle_priorities: profile.musclePriorities || [],
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

// ── Workout Logs ──────────────────────────────────────────────────────

export async function loadWorkoutLogs(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 50
): Promise<WorkoutLog[]> {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map((row) => ({
    id: row.id,
    assessmentId: row.assessment_id ?? undefined,
    workoutDayIndex: row.workout_day_index,
    workoutDayLabel: row.workout_day_label,
    workoutFocus: row.workout_focus,
    exercises: row.exercises as ExerciseLog[],
    startedAt: row.started_at,
    completedAt: row.completed_at ?? undefined,
    durationMinutes: row.duration_minutes ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  }))
}

export async function saveWorkoutLog(
  supabase: SupabaseClient,
  userId: string,
  log: Omit<WorkoutLog, 'id' | 'createdAt'>
): Promise<string | null> {
  const { data, error } = await supabase
    .from('workout_logs')
    .insert({
      user_id: userId,
      assessment_id: log.assessmentId ?? null,
      workout_day_index: log.workoutDayIndex,
      workout_day_label: log.workoutDayLabel,
      workout_focus: log.workoutFocus,
      exercises: log.exercises,
      started_at: log.startedAt,
      completed_at: log.completedAt ?? null,
      duration_minutes: log.durationMinutes ?? null,
      notes: log.notes ?? null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to save workout log:', error)
    return null
  }
  return data.id
}

export async function updateWorkoutLog(
  supabase: SupabaseClient,
  logId: string,
  updates: {
    exercises?: ExerciseLog[]
    completedAt?: string
    durationMinutes?: number
    notes?: string
  }
): Promise<void> {
  const payload: Record<string, unknown> = {}
  if (updates.exercises !== undefined) payload.exercises = updates.exercises
  if (updates.completedAt !== undefined) payload.completed_at = updates.completedAt
  if (updates.durationMinutes !== undefined) payload.duration_minutes = updates.durationMinutes
  if (updates.notes !== undefined) payload.notes = updates.notes

  const { error } = await supabase
    .from('workout_logs')
    .update(payload)
    .eq('id', logId)

  if (error) console.error('Failed to update workout log:', error)
}

// ── Weekly Check-ins ──────────────────────────────────────────────────

export async function loadWeeklyCheckins(
  supabase: SupabaseClient,
  userId: string
): Promise<WeeklyCheckin[]> {
  const { data, error } = await supabase
    .from('weekly_checkins')
    .select('*')
    .eq('user_id', userId)
    .order('checkin_date', { ascending: true })

  if (error || !data) return []

  return data.map((row) => ({
    id: row.id,
    checkinDate: row.checkin_date,
    weight: row.weight != null ? Number(row.weight) : undefined,
    measurements: (row.measurements as BodyMeasurements) || {},
    energyRating: row.energy_rating ?? undefined,
    sorenessRating: row.soreness_rating ?? undefined,
    sleepRating: row.sleep_rating ?? undefined,
    motivationRating: row.motivation_rating ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  }))
}

export async function saveWeeklyCheckin(
  supabase: SupabaseClient,
  userId: string,
  checkin: Omit<WeeklyCheckin, 'id' | 'createdAt'>
): Promise<string | null> {
  const { data, error } = await supabase
    .from('weekly_checkins')
    .upsert(
      {
        user_id: userId,
        checkin_date: checkin.checkinDate,
        weight: checkin.weight ?? null,
        measurements: checkin.measurements,
        energy_rating: checkin.energyRating ?? null,
        soreness_rating: checkin.sorenessRating ?? null,
        sleep_rating: checkin.sleepRating ?? null,
        motivation_rating: checkin.motivationRating ?? null,
        notes: checkin.notes ?? null,
      },
      { onConflict: 'user_id,checkin_date' }
    )
    .select('id')
    .single()

  if (error) {
    console.error('Failed to save weekly checkin:', error)
    return null
  }
  return data.id
}

// ── Progress Photos ───────────────────────────────────────────────────

export async function uploadProgressPhoto(
  supabase: SupabaseClient,
  userId: string,
  file: File,
  angle: PhotoAngle,
  checkinId?: string,
  photoDate?: string
): Promise<ProgressPhoto | null> {
  const date = photoDate || new Date().toISOString().split('T')[0]
  const ext = file.name.split('.').pop() || 'jpg'
  const filePath = `${userId}/${date}/${angle}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('progress-photos')
    .upload(filePath, file, { contentType: file.type, upsert: false })

  if (uploadError) {
    console.error('Failed to upload photo:', uploadError)
    return null
  }

  const { data, error: dbError } = await supabase
    .from('progress_photos')
    .insert({
      user_id: userId,
      checkin_id: checkinId ?? null,
      angle,
      storage_path: filePath,
      photo_date: date,
    })
    .select('*')
    .single()

  if (dbError) {
    console.error('Failed to save photo record:', dbError)
    return null
  }

  return {
    id: data.id,
    checkinId: data.checkin_id ?? undefined,
    angle: data.angle as PhotoAngle,
    storagePath: data.storage_path,
    photoDate: data.photo_date,
    createdAt: data.created_at,
  }
}

export async function loadProgressPhotos(
  supabase: SupabaseClient,
  userId: string
): Promise<ProgressPhoto[]> {
  const { data, error } = await supabase
    .from('progress_photos')
    .select('*')
    .eq('user_id', userId)
    .order('photo_date', { ascending: true })

  if (error || !data) return []

  return data.map((row) => ({
    id: row.id,
    checkinId: row.checkin_id ?? undefined,
    angle: row.angle as PhotoAngle,
    storagePath: row.storage_path,
    photoDate: row.photo_date,
    createdAt: row.created_at,
  }))
}

export async function getPhotoSignedUrl(
  supabase: SupabaseClient,
  storagePath: string
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('progress-photos')
    .createSignedUrl(storagePath, 3600)

  if (error) {
    console.error('Failed to get signed URL:', error)
    return null
  }
  return data.signedUrl
}

export async function deleteProgressPhoto(
  supabase: SupabaseClient,
  photoId: string,
  storagePath: string
): Promise<void> {
  await supabase.storage.from('progress-photos').remove([storagePath])
  const { error } = await supabase
    .from('progress_photos')
    .delete()
    .eq('id', photoId)
  if (error) console.error('Failed to delete photo record:', error)
}
