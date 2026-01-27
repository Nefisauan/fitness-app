import { UserProfile, PainDiscomfort, PhysiqueAnalysis, WorkoutPlan, WorkoutDay, Exercise, WorkoutSplit } from './types';

// Exercise database by muscle group and purpose
const exerciseDatabase: Record<string, Exercise[]> = {
  // Chest exercises
  chest: [
    { name: 'Barbell Bench Press', targetMuscles: ['chest', 'triceps', 'shoulders'], sets: 4, reps: '6-8', tempo: '3-1-2-0', rest: '2-3 min', purpose: 'strength' },
    { name: 'Incline Dumbbell Press', targetMuscles: ['upper chest', 'shoulders'], sets: 3, reps: '8-12', tempo: '3-0-2-0', rest: '90 sec', purpose: 'hypertrophy' },
    { name: 'Cable Flyes', targetMuscles: ['chest'], sets: 3, reps: '12-15', tempo: '2-1-2-1', rest: '60 sec', purpose: 'hypertrophy' },
    { name: 'Push-Ups', targetMuscles: ['chest', 'triceps'], sets: 3, reps: '10-15', rest: '60 sec', purpose: 'hypertrophy' },
  ],
  // Back exercises
  back: [
    { name: 'Deadlift', targetMuscles: ['back', 'hamstrings', 'glutes'], sets: 4, reps: '5-6', tempo: '2-1-2-0', rest: '3-4 min', purpose: 'strength' },
    { name: 'Barbell Rows', targetMuscles: ['lats', 'rhomboids', 'biceps'], sets: 4, reps: '6-8', tempo: '2-1-2-0', rest: '2 min', purpose: 'strength' },
    { name: 'Pull-Ups', targetMuscles: ['lats', 'biceps'], sets: 3, reps: '6-10', rest: '90 sec', purpose: 'strength' },
    { name: 'Lat Pulldown', targetMuscles: ['lats'], sets: 3, reps: '10-12', tempo: '2-1-3-0', rest: '60 sec', purpose: 'hypertrophy' },
    { name: 'Seated Cable Rows', targetMuscles: ['mid back', 'lats'], sets: 3, reps: '10-12', tempo: '2-1-2-1', rest: '60 sec', purpose: 'hypertrophy' },
    { name: 'Face Pulls', targetMuscles: ['rear delts', 'rhomboids'], sets: 3, reps: '15-20', rest: '45 sec', purpose: 'hypertrophy', notes: 'Great for posture' },
  ],
  // Shoulder exercises
  shoulders: [
    { name: 'Overhead Press', targetMuscles: ['shoulders', 'triceps'], sets: 4, reps: '6-8', tempo: '2-1-2-0', rest: '2 min', purpose: 'strength' },
    { name: 'Lateral Raises', targetMuscles: ['side delts'], sets: 3, reps: '12-15', tempo: '2-1-2-1', rest: '45 sec', purpose: 'hypertrophy' },
    { name: 'Rear Delt Flyes', targetMuscles: ['rear delts'], sets: 3, reps: '12-15', rest: '45 sec', purpose: 'hypertrophy' },
    { name: 'Arnold Press', targetMuscles: ['shoulders'], sets: 3, reps: '10-12', tempo: '3-0-2-0', rest: '60 sec', purpose: 'hypertrophy' },
  ],
  // Leg exercises
  legs: [
    { name: 'Barbell Squat', targetMuscles: ['quads', 'glutes', 'core'], sets: 4, reps: '6-8', tempo: '3-1-2-0', rest: '3 min', purpose: 'strength' },
    { name: 'Romanian Deadlift', targetMuscles: ['hamstrings', 'glutes'], sets: 3, reps: '8-10', tempo: '3-1-2-0', rest: '90 sec', purpose: 'hypertrophy' },
    { name: 'Leg Press', targetMuscles: ['quads', 'glutes'], sets: 3, reps: '10-12', rest: '90 sec', purpose: 'hypertrophy' },
    { name: 'Walking Lunges', targetMuscles: ['quads', 'glutes'], sets: 3, reps: '12 each leg', rest: '60 sec', purpose: 'hypertrophy' },
    { name: 'Leg Curls', targetMuscles: ['hamstrings'], sets: 3, reps: '10-12', rest: '60 sec', purpose: 'hypertrophy' },
    { name: 'Calf Raises', targetMuscles: ['calves'], sets: 4, reps: '12-15', tempo: '2-2-2-0', rest: '45 sec', purpose: 'hypertrophy' },
  ],
  // Arm exercises
  arms: [
    { name: 'Barbell Curls', targetMuscles: ['biceps'], sets: 3, reps: '8-10', rest: '60 sec', purpose: 'hypertrophy' },
    { name: 'Tricep Dips', targetMuscles: ['triceps'], sets: 3, reps: '8-12', rest: '60 sec', purpose: 'hypertrophy' },
    { name: 'Hammer Curls', targetMuscles: ['biceps', 'forearms'], sets: 3, reps: '10-12', rest: '45 sec', purpose: 'hypertrophy' },
    { name: 'Tricep Pushdowns', targetMuscles: ['triceps'], sets: 3, reps: '12-15', rest: '45 sec', purpose: 'hypertrophy' },
    { name: 'Overhead Tricep Extension', targetMuscles: ['triceps'], sets: 3, reps: '10-12', rest: '60 sec', purpose: 'hypertrophy' },
  ],
  // Core exercises
  core: [
    { name: 'Plank', targetMuscles: ['core'], sets: 3, reps: '30-60 sec', rest: '45 sec', purpose: 'stability' },
    { name: 'Dead Bug', targetMuscles: ['core'], sets: 3, reps: '10 each side', rest: '45 sec', purpose: 'stability', notes: 'Excellent for core stability' },
    { name: 'Pallof Press', targetMuscles: ['core', 'obliques'], sets: 3, reps: '12 each side', rest: '45 sec', purpose: 'stability' },
    { name: 'Cable Crunches', targetMuscles: ['abs'], sets: 3, reps: '15-20', rest: '45 sec', purpose: 'hypertrophy' },
    { name: 'Hanging Leg Raises', targetMuscles: ['abs', 'hip flexors'], sets: 3, reps: '10-12', rest: '60 sec', purpose: 'strength' },
  ],
  // Mobility/warmup
  mobility: [
    { name: 'Cat-Cow Stretch', targetMuscles: ['spine'], sets: 1, reps: '10 each', rest: '0', purpose: 'mobility' },
    { name: 'World\'s Greatest Stretch', targetMuscles: ['hips', 'thoracic'], sets: 1, reps: '5 each side', rest: '0', purpose: 'mobility' },
    { name: 'Hip 90/90 Stretch', targetMuscles: ['hips'], sets: 1, reps: '30 sec each', rest: '0', purpose: 'mobility' },
    { name: 'Shoulder Pass-Throughs', targetMuscles: ['shoulders'], sets: 1, reps: '10', rest: '0', purpose: 'mobility' },
    { name: 'Deep Squat Hold', targetMuscles: ['hips', 'ankles'], sets: 1, reps: '30-60 sec', rest: '0', purpose: 'mobility' },
    { name: 'Thoracic Rotations', targetMuscles: ['thoracic spine'], sets: 1, reps: '10 each side', rest: '0', purpose: 'mobility' },
  ],
  // Postural correction exercises
  posture: [
    { name: 'Band Pull-Aparts', targetMuscles: ['rear delts', 'rhomboids'], sets: 3, reps: '15-20', rest: '30 sec', purpose: 'stability', notes: 'Counters rounded shoulders' },
    { name: 'Wall Angels', targetMuscles: ['shoulders', 'thoracic'], sets: 3, reps: '10', rest: '30 sec', purpose: 'mobility', notes: 'Improves shoulder mobility' },
    { name: 'Chin Tucks', targetMuscles: ['neck'], sets: 3, reps: '10', rest: '30 sec', purpose: 'stability', notes: 'Corrects forward head posture' },
    { name: 'Glute Bridges', targetMuscles: ['glutes'], sets: 3, reps: '15', rest: '45 sec', purpose: 'stability', notes: 'Activates glutes, helps with pelvic tilt' },
    { name: 'Bird Dog', targetMuscles: ['core', 'glutes'], sets: 3, reps: '10 each side', rest: '45 sec', purpose: 'stability' },
  ],
};

// Generate warmup based on workout focus
function generateWarmup(focus: string, painAreas: PainDiscomfort): Exercise[] {
  const warmup: Exercise[] = [
    { name: '5 min Light Cardio', targetMuscles: ['full body'], sets: 1, reps: '5 min', rest: '0', purpose: 'warmup', notes: 'Bike, rowing, or brisk walk' },
  ];

  // Add relevant mobility work
  warmup.push(...exerciseDatabase.mobility.slice(0, 3));

  // Add specific warmup based on focus
  if (focus.includes('Push') || focus.includes('Chest') || focus.includes('Shoulder')) {
    warmup.push(exerciseDatabase.mobility.find(e => e.name === 'Shoulder Pass-Throughs')!);
  }
  if (focus.includes('Leg') || focus.includes('Pull')) {
    warmup.push(exerciseDatabase.mobility.find(e => e.name === 'Deep Squat Hold')!);
  }

  return warmup.filter(Boolean);
}

// Generate cooldown
function generateCooldown(): Exercise[] {
  return [
    { name: 'Static Stretching', targetMuscles: ['full body'], sets: 1, reps: '5-10 min', rest: '0', purpose: 'mobility', notes: 'Hold each stretch 30 seconds' },
    { name: 'Foam Rolling', targetMuscles: ['full body'], sets: 1, reps: '5 min', rest: '0', purpose: 'mobility', notes: 'Focus on tight areas' },
  ];
}

// Get exercises avoiding pain areas
function getExercisesForMuscle(muscle: string, painAreas: PainDiscomfort): Exercise[] {
  let exercises = exerciseDatabase[muscle] || [];

  // Filter out exercises that might aggravate pain areas
  if (painAreas.lowerBack) {
    exercises = exercises.filter(e => !['Deadlift', 'Barbell Rows'].includes(e.name));
  }
  if (painAreas.shoulders) {
    exercises = exercises.filter(e => !['Overhead Press', 'Barbell Bench Press'].includes(e.name));
  }
  if (painAreas.knees) {
    exercises = exercises.filter(e => !['Barbell Squat', 'Walking Lunges'].includes(e.name));
  }

  return exercises;
}

// Build a push/pull/legs split
function buildPPLSplit(profile: UserProfile, painAreas: PainDiscomfort, analysis?: PhysiqueAnalysis): WorkoutDay[] {
  const days: WorkoutDay[] = [];

  // Push Day
  const pushExercises: Exercise[] = [];
  pushExercises.push(...getExercisesForMuscle('chest', painAreas).slice(0, 2));
  pushExercises.push(...getExercisesForMuscle('shoulders', painAreas).slice(0, 2));
  pushExercises.push(...getExercisesForMuscle('arms', painAreas).filter(e => e.targetMuscles.includes('triceps')).slice(0, 1));

  days.push({
    day: 'Day 1',
    focus: 'Push (Chest, Shoulders, Triceps)',
    warmup: generateWarmup('Push', painAreas),
    mainWorkout: pushExercises,
    cooldown: generateCooldown(),
    estimatedDuration: 60,
  });

  // Pull Day
  const pullExercises: Exercise[] = [];
  pullExercises.push(...getExercisesForMuscle('back', painAreas).slice(0, 3));
  pullExercises.push(...getExercisesForMuscle('arms', painAreas).filter(e => e.targetMuscles.includes('biceps')).slice(0, 2));

  // Add face pulls for posture
  const facePulls = exerciseDatabase.back.find(e => e.name === 'Face Pulls');
  if (facePulls) pullExercises.push(facePulls);

  days.push({
    day: 'Day 2',
    focus: 'Pull (Back, Biceps)',
    warmup: generateWarmup('Pull', painAreas),
    mainWorkout: pullExercises,
    cooldown: generateCooldown(),
    estimatedDuration: 55,
  });

  // Leg Day
  const legExercises: Exercise[] = [];
  legExercises.push(...getExercisesForMuscle('legs', painAreas).slice(0, 4));
  legExercises.push(...getExercisesForMuscle('core', painAreas).slice(0, 2));

  days.push({
    day: 'Day 3',
    focus: 'Legs & Core',
    warmup: generateWarmup('Legs', painAreas),
    mainWorkout: legExercises,
    cooldown: generateCooldown(),
    estimatedDuration: 65,
  });

  return days;
}

// Build an upper/lower split
function buildUpperLowerSplit(profile: UserProfile, painAreas: PainDiscomfort): WorkoutDay[] {
  const days: WorkoutDay[] = [];

  // Upper Day
  const upperExercises: Exercise[] = [];
  upperExercises.push(...getExercisesForMuscle('chest', painAreas).slice(0, 2));
  upperExercises.push(...getExercisesForMuscle('back', painAreas).slice(0, 2));
  upperExercises.push(...getExercisesForMuscle('shoulders', painAreas).slice(0, 1));
  upperExercises.push(...getExercisesForMuscle('arms', painAreas).slice(0, 2));

  days.push({
    day: 'Day 1',
    focus: 'Upper Body',
    warmup: generateWarmup('Upper', painAreas),
    mainWorkout: upperExercises,
    cooldown: generateCooldown(),
    estimatedDuration: 60,
  });

  // Lower Day
  const lowerExercises: Exercise[] = [];
  lowerExercises.push(...getExercisesForMuscle('legs', painAreas).slice(0, 5));
  lowerExercises.push(...getExercisesForMuscle('core', painAreas).slice(0, 2));

  days.push({
    day: 'Day 2',
    focus: 'Lower Body & Core',
    warmup: generateWarmup('Lower', painAreas),
    mainWorkout: lowerExercises,
    cooldown: generateCooldown(),
    estimatedDuration: 60,
  });

  return days;
}

// Build a full body routine for beginners
function buildFullBodySplit(profile: UserProfile, painAreas: PainDiscomfort): WorkoutDay[] {
  const exercises: Exercise[] = [];

  // One compound movement per major group
  exercises.push(getExercisesForMuscle('legs', painAreas)[0] || exerciseDatabase.legs[2]); // Squat or leg press
  exercises.push(getExercisesForMuscle('chest', painAreas)[0] || exerciseDatabase.chest[3]); // Bench or push-ups
  exercises.push(getExercisesForMuscle('back', painAreas)[1] || exerciseDatabase.back[3]); // Rows or lat pulldown
  exercises.push(getExercisesForMuscle('shoulders', painAreas)[1]); // Lateral raises
  exercises.push(...getExercisesForMuscle('core', painAreas).slice(0, 2));

  return [{
    day: 'Full Body',
    focus: 'Full Body Compound Movements',
    warmup: generateWarmup('Full Body', painAreas),
    mainWorkout: exercises.filter(Boolean),
    cooldown: generateCooldown(),
    estimatedDuration: 50,
  }];
}

// Add postural correction exercises if needed
function addPosturalWork(days: WorkoutDay[], analysis?: PhysiqueAnalysis): WorkoutDay[] {
  if (!analysis?.posture || analysis.posture.overallPosture === 'good') {
    return days;
  }

  const posturalExercises = exerciseDatabase.posture;

  // Add 2-3 postural exercises to each day
  return days.map(day => ({
    ...day,
    mainWorkout: [
      ...day.mainWorkout,
      ...posturalExercises.slice(0, 2),
    ],
    estimatedDuration: day.estimatedDuration + 10,
  }));
}

export function generateWorkoutPlan(
  profile: UserProfile,
  painAreas: PainDiscomfort,
  analysis?: PhysiqueAnalysis
): WorkoutPlan {
  let schedule: WorkoutDay[];
  let daysPerWeek: number;
  let planName: string;
  let description: string;

  const splitPref: WorkoutSplit = profile.splitPreference || 'recommended';

  if (splitPref !== 'recommended') {
    // User explicitly chose a split
    if (splitPref === 'full_body') {
      schedule = buildFullBodySplit(profile, painAreas);
      daysPerWeek = 3;
      planName = 'Full Body Program';
      description = 'A balanced full-body routine hitting all major muscle groups each session. Perform 3 times per week with at least one rest day between sessions.';
    } else if (splitPref === 'upper_lower') {
      schedule = buildUpperLowerSplit(profile, painAreas);
      daysPerWeek = 4;
      planName = 'Upper / Lower Split';
      description = 'Upper/Lower split for balanced volume and recovery. Alternate upper and lower days, 4 sessions per week.';
    } else {
      schedule = buildPPLSplit(profile, painAreas, analysis);
      daysPerWeek = 6;
      planName = 'Push / Pull / Legs';
      description = 'Push/Pull/Legs split for high training volume. Run through twice per week for optimal muscle development.';
    }
  } else {
    // Auto-select split based on experience and goal (existing logic)
    if (profile.trainingHistory === 'beginner') {
      schedule = buildFullBodySplit(profile, painAreas);
      daysPerWeek = 3;
      planName = 'Full Body Foundation';
      description = 'A balanced full-body routine to build strength and movement patterns. Perform 3 times per week with at least one rest day between sessions.';
    } else if (profile.goal === 'posture' || (analysis?.posture?.overallPosture === 'needs_attention')) {
      schedule = buildUpperLowerSplit(profile, painAreas);
      schedule = addPosturalWork(schedule, analysis);
      daysPerWeek = 4;
      planName = 'Posture & Balance Program';
      description = 'Focused on correcting imbalances and improving posture while building strength. Includes dedicated mobility and corrective exercises.';
    } else if (profile.goal === 'bulk' || profile.goal === 'aesthetic') {
      schedule = buildPPLSplit(profile, painAreas, analysis);
      daysPerWeek = 6;
      planName = profile.goal === 'bulk' ? 'Muscle Building Program' : 'Aesthetic Development';
      description = 'Push/Pull/Legs split for maximum muscle development. Run through twice per week for optimal growth.';
    } else {
      schedule = buildUpperLowerSplit(profile, painAreas);
      daysPerWeek = 4;
      planName = 'Strength & Conditioning';
      description = 'Upper/Lower split for balanced strength development. Allows adequate recovery while maintaining training frequency.';
    }
  }

  // Add postural work if needed
  if (analysis?.posture && analysis.posture.overallPosture !== 'good') {
    schedule = addPosturalWork(schedule, analysis);
  }

  const modifications: string[] = [];

  if (painAreas.lowerBack) {
    modifications.push('Substitute deadlifts with hip hinges using lighter weight or single-leg variations');
    modifications.push('Focus on core stability exercises before loading the spine');
  }
  if (painAreas.shoulders) {
    modifications.push('Use neutral grip variations for pressing movements');
    modifications.push('Reduce overhead work and increase rear delt/rotator cuff exercises');
  }
  if (painAreas.knees) {
    modifications.push('Replace deep squats with box squats or leg press with controlled range');
    modifications.push('Focus on glute activation and hamstring strength');
  }

  return {
    name: planName,
    description,
    daysPerWeek,
    schedule,
    progressionNotes: `
- Increase weight when you can complete all sets and reps with good form
- Add 2.5-5 lbs for upper body movements, 5-10 lbs for lower body
- Track your weights and reps in a training log
- Deload every 4-6 weeks by reducing weight 40-50%
- Prioritize form over weight, especially on compound movements
    `.trim(),
    modifications,
  };
}
