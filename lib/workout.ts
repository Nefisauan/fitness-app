import { UserProfile, PainDiscomfort, PhysiqueAnalysis, WorkoutPlan, WorkoutDay, Exercise, WorkoutSplit, MuscleTarget, MusclePriorities } from './types';

// Evidence-based exercise database
// Exercise selection informed by EMG research, biomechanics, and hypertrophy literature
// Volume targets: 10-20 working sets per muscle group per week (Schoenfeld et al.)
// RPE guidance embedded in notes

const exerciseDatabase: Record<string, Exercise[]> = {
  chest: [
    { name: 'Flat Barbell Bench Press', targetMuscles: ['chest', 'triceps', 'front delts'], sets: 4, reps: '6-8', tempo: '2-1-1-0', rest: '2-3 min', purpose: 'strength', notes: 'RPE 8-9. Primary horizontal press. Full ROM, touch chest.' },
    { name: 'Incline Dumbbell Press (30°)', targetMuscles: ['upper chest', 'front delts'], sets: 3, reps: '8-12', tempo: '2-0-1-1', rest: '90 sec', purpose: 'hypertrophy', notes: 'RPE 7-8. 30° angle targets clavicular head best per EMG data.' },
    { name: 'Dumbbell Flat Press', targetMuscles: ['chest', 'triceps'], sets: 3, reps: '8-12', tempo: '2-1-1-1', rest: '90 sec', purpose: 'hypertrophy', notes: 'RPE 7-8. Greater ROM and stretch than barbell.' },
    { name: 'Cable Flyes (Low-to-High)', targetMuscles: ['upper chest'], sets: 3, reps: '12-15', tempo: '2-1-2-1', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 7-8. Constant tension. Focus on the peak contraction.' },
    { name: 'Machine Chest Press', targetMuscles: ['chest', 'triceps'], sets: 3, reps: '10-12', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8-9. Stable path. Good for taking sets closer to failure safely.' },
    { name: 'Pec Deck / Machine Fly', targetMuscles: ['chest'], sets: 3, reps: '12-15', tempo: '2-1-2-2', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8-9. Emphasize deep stretch at the bottom (lengthened partial).' },
  ],
  back: [
    { name: 'Conventional Deadlift', targetMuscles: ['posterior chain', 'back', 'glutes', 'hamstrings'], sets: 3, reps: '5-6', tempo: '2-1-1-0', rest: '3-4 min', purpose: 'strength', notes: 'RPE 7-8. Hinge at hips, brace core. Primary posterior chain builder.' },
    { name: 'Barbell Row (Overhand)', targetMuscles: ['lats', 'rhomboids', 'rear delts', 'biceps'], sets: 4, reps: '6-10', tempo: '1-1-2-0', rest: '2 min', purpose: 'strength', notes: 'RPE 8. ~45° torso angle. Row to lower chest for lat emphasis.' },
    { name: 'Weighted Pull-Ups / Chin-Ups', targetMuscles: ['lats', 'biceps', 'teres major'], sets: 3, reps: '6-10', rest: '2 min', purpose: 'strength', notes: 'RPE 8. Full ROM - dead hang to chin over bar. Add weight when bodyweight is easy.' },
    { name: 'Lat Pulldown (Neutral Grip)', targetMuscles: ['lats', 'biceps'], sets: 3, reps: '10-12', tempo: '2-0-1-2', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8. Lean slightly back. Emphasize the stretch at the top (lengthened position).' },
    { name: 'Chest-Supported Row', targetMuscles: ['mid back', 'rear delts', 'rhomboids'], sets: 3, reps: '10-12', tempo: '1-1-2-1', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8. Removes momentum/cheating. Great for mind-muscle connection.' },
    { name: 'Seated Cable Row (Close Grip)', targetMuscles: ['mid back', 'lats', 'rhomboids'], sets: 3, reps: '10-12', tempo: '2-1-2-1', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8. Squeeze at contraction, control the eccentric.' },
    { name: 'Face Pulls', targetMuscles: ['rear delts', 'external rotators', 'rhomboids'], sets: 3, reps: '15-20', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 7. Essential for shoulder health. Externally rotate at the top.' },
    { name: 'Straight-Arm Pulldown', targetMuscles: ['lats', 'teres major'], sets: 3, reps: '12-15', tempo: '2-1-2-1', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 7-8. Isolates lats without bicep involvement.' },
  ],
  shoulders: [
    { name: 'Seated Dumbbell Overhead Press', targetMuscles: ['front delts', 'side delts', 'triceps'], sets: 4, reps: '8-10', tempo: '2-0-1-1', rest: '2 min', purpose: 'strength', notes: 'RPE 8. Primary overhead compound. Full ROM from shoulder height to lockout.' },
    { name: 'Cable Lateral Raises', targetMuscles: ['side delts'], sets: 4, reps: '12-15', tempo: '2-1-2-0', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 8-9. Behind-the-body cable path for better lengthened tension. Side delts respond to high volume.' },
    { name: 'Dumbbell Lateral Raises', targetMuscles: ['side delts'], sets: 3, reps: '12-20', tempo: '1-0-1-1', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 8-9. Slight lean forward, lead with pinky. Side delts need 15-20+ sets/week.' },
    { name: 'Reverse Pec Deck', targetMuscles: ['rear delts'], sets: 3, reps: '15-20', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 8. Constant tension throughout. Critical for balanced shoulder development.' },
    { name: 'Barbell Overhead Press', targetMuscles: ['shoulders', 'triceps', 'core'], sets: 4, reps: '5-8', tempo: '2-0-1-0', rest: '2-3 min', purpose: 'strength', notes: 'RPE 8. Strict form, no leg drive. Core stabilizer.' },
    { name: 'Machine Lateral Raise', targetMuscles: ['side delts'], sets: 3, reps: '12-15', tempo: '2-1-2-1', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 9. Consistent tension curve. Good for going close to failure.' },
  ],
  legs: [
    { name: 'Barbell Back Squat', targetMuscles: ['quads', 'glutes', 'core'], sets: 4, reps: '6-8', tempo: '3-1-1-0', rest: '3 min', purpose: 'strength', notes: 'RPE 8. Squat to parallel or below. Primary leg builder.' },
    { name: 'Romanian Deadlift', targetMuscles: ['hamstrings', 'glutes', 'erectors'], sets: 3, reps: '8-10', tempo: '3-1-1-0', rest: '2 min', purpose: 'hypertrophy', notes: 'RPE 7-8. Deep stretch at the bottom. Hamstrings grow best in the lengthened position.' },
    { name: 'Leg Press', targetMuscles: ['quads', 'glutes'], sets: 3, reps: '10-12', rest: '90 sec', purpose: 'hypertrophy', notes: 'RPE 8-9. High foot placement for glutes, low for quad emphasis. Deep ROM.' },
    { name: 'Bulgarian Split Squat', targetMuscles: ['quads', 'glutes', 'stabilizers'], sets: 3, reps: '8-10 each', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8. Addresses imbalances. Deep stretch on the working leg.' },
    { name: 'Leg Curl (Seated or Lying)', targetMuscles: ['hamstrings'], sets: 3, reps: '10-12', tempo: '2-1-2-1', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8-9. Slow eccentric, full stretch. Hamstrings need both hip-dominant and knee-dominant work.' },
    { name: 'Leg Extension', targetMuscles: ['quads'], sets: 3, reps: '12-15', tempo: '2-1-2-1', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8-9. Emphasize peak contraction at the top. Partials in shortened position effective.' },
    { name: 'Hip Thrust', targetMuscles: ['glutes', 'hamstrings'], sets: 3, reps: '10-12', tempo: '2-2-1-0', rest: '90 sec', purpose: 'hypertrophy', notes: 'RPE 8. Pause at the top. Best glute activation per EMG research.' },
    { name: 'Standing Calf Raises', targetMuscles: ['gastrocnemius'], sets: 4, reps: '10-15', tempo: '2-2-1-1', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 9. Full stretch at bottom, 2-sec pause at top. Calves respond to slow eccentrics.' },
    { name: 'Seated Calf Raises', targetMuscles: ['soleus'], sets: 3, reps: '15-20', tempo: '2-2-1-0', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 9. Targets soleus (bent knee). Often neglected.' },
    { name: 'Walking Lunges', targetMuscles: ['quads', 'glutes'], sets: 3, reps: '12 each', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 7-8. Long strides for glute emphasis, short strides for quad emphasis.' },
  ],
  arms: [
    { name: 'Incline Dumbbell Curl', targetMuscles: ['biceps (long head)'], sets: 3, reps: '10-12', tempo: '2-0-1-2', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8. Arms behind torso = biceps in stretched position. Best bicep exercise per lengthened-partial research.' },
    { name: 'Barbell Curl', targetMuscles: ['biceps'], sets: 3, reps: '8-10', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8. Strict form, no swinging. EZ-bar or straight bar.' },
    { name: 'Hammer Curls', targetMuscles: ['brachialis', 'brachioradialis', 'biceps'], sets: 3, reps: '10-12', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 8. Targets brachialis for arm thickness. Neutral grip.' },
    { name: 'Overhead Tricep Extension (Cable)', targetMuscles: ['triceps (long head)'], sets: 3, reps: '10-12', tempo: '2-1-1-2', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8. Long head gets max stretch overhead. Most important tricep exercise for size.' },
    { name: 'Tricep Pushdowns', targetMuscles: ['triceps (lateral/medial head)'], sets: 3, reps: '12-15', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 8-9. Good for lateral head. Use rope or V-bar.' },
    { name: 'Close-Grip Bench Press', targetMuscles: ['triceps', 'chest'], sets: 3, reps: '8-10', rest: '90 sec', purpose: 'strength', notes: 'RPE 8. Heavy tricep compound. Hands shoulder-width.' },
    { name: 'Preacher Curl', targetMuscles: ['biceps (short head)'], sets: 3, reps: '10-12', tempo: '2-0-1-2', rest: '60 sec', purpose: 'hypertrophy', notes: 'RPE 8. Eliminates momentum. Emphasizes short head in stretched position.' },
  ],
  core: [
    { name: 'Cable Crunch', targetMuscles: ['rectus abdominis'], sets: 3, reps: '12-15', tempo: '2-1-2-1', rest: '45 sec', purpose: 'hypertrophy', notes: 'RPE 8. Progressively overloadable. Key for visible abs.' },
    { name: 'Hanging Leg Raises', targetMuscles: ['lower abs', 'hip flexors'], sets: 3, reps: '10-15', rest: '60 sec', purpose: 'strength', notes: 'RPE 8. Curl pelvis up, dont just swing legs. Posterior pelvic tilt at top.' },
    { name: 'Ab Wheel Rollout', targetMuscles: ['core', 'serratus'], sets: 3, reps: '8-12', rest: '60 sec', purpose: 'strength', notes: 'RPE 8. Anti-extension exercise. Great for overall core strength.' },
    { name: 'Pallof Press', targetMuscles: ['obliques', 'core'], sets: 3, reps: '12 each side', rest: '45 sec', purpose: 'stability', notes: 'RPE 7. Anti-rotation. Functional core stability.' },
    { name: 'Plank', targetMuscles: ['core', 'stabilizers'], sets: 3, reps: '30-60 sec', rest: '45 sec', purpose: 'stability', notes: 'Brace hard like youre about to get punched. Squeeze glutes.' },
    { name: 'Dead Bug', targetMuscles: ['core', 'stabilizers'], sets: 3, reps: '10 each side', rest: '45 sec', purpose: 'stability', notes: 'Press lower back into floor. Maintain tension. Great for learning bracing.' },
  ],
  mobility: [
    { name: 'Cat-Cow Stretch', targetMuscles: ['spine'], sets: 1, reps: '10 each', rest: '0', purpose: 'mobility' },
    { name: 'World\'s Greatest Stretch', targetMuscles: ['hips', 'thoracic', 'hamstrings'], sets: 1, reps: '5 each side', rest: '0', purpose: 'mobility' },
    { name: 'Hip 90/90 Stretch', targetMuscles: ['hips', 'glutes'], sets: 1, reps: '30 sec each', rest: '0', purpose: 'mobility' },
    { name: 'Shoulder Pass-Throughs', targetMuscles: ['shoulders', 'chest'], sets: 1, reps: '10', rest: '0', purpose: 'mobility' },
    { name: 'Deep Squat Hold', targetMuscles: ['hips', 'ankles', 'thoracic'], sets: 1, reps: '30-60 sec', rest: '0', purpose: 'mobility' },
    { name: 'Thoracic Rotations', targetMuscles: ['thoracic spine'], sets: 1, reps: '10 each side', rest: '0', purpose: 'mobility' },
    { name: 'Ankle Dorsiflexion Stretch', targetMuscles: ['calves', 'ankles'], sets: 1, reps: '30 sec each', rest: '0', purpose: 'mobility' },
  ],
  posture: [
    { name: 'Band Pull-Aparts', targetMuscles: ['rear delts', 'rhomboids'], sets: 3, reps: '15-20', rest: '30 sec', purpose: 'stability', notes: 'Daily prehab. Counters rounded shoulders from desk/phone posture.' },
    { name: 'Wall Angels', targetMuscles: ['shoulders', 'thoracic'], sets: 3, reps: '10', rest: '30 sec', purpose: 'mobility', notes: 'Keep entire back, head, and arms on wall. Improves overhead mobility.' },
    { name: 'Chin Tucks', targetMuscles: ['deep neck flexors'], sets: 3, reps: '10', rest: '30 sec', purpose: 'stability', notes: 'Corrects forward head posture. Hold 5 sec each rep.' },
    { name: 'Glute Bridges', targetMuscles: ['glutes'], sets: 3, reps: '15', rest: '45 sec', purpose: 'stability', notes: 'Activates glutes, corrects anterior pelvic tilt. Squeeze for 2 sec at top.' },
    { name: 'Bird Dog', targetMuscles: ['core', 'glutes', 'erectors'], sets: 3, reps: '10 each side', rest: '45 sec', purpose: 'stability', notes: 'Anti-rotation and anti-extension. Core stability fundamental.' },
  ],
};

function generateWarmup(focus: string, _painAreas: PainDiscomfort): Exercise[] {
  const warmup: Exercise[] = [
    { name: '5 min Light Cardio', targetMuscles: ['cardiovascular'], sets: 1, reps: '5 min', rest: '0', purpose: 'warmup', notes: 'Elevate heart rate. Bike, rowing, or incline walk.' },
  ];

  warmup.push(...exerciseDatabase.mobility.slice(0, 3));

  if (focus.includes('Push') || focus.includes('Chest') || focus.includes('Shoulder') || focus.includes('Upper')) {
    warmup.push(exerciseDatabase.mobility.find(e => e.name === 'Shoulder Pass-Throughs')!);
  }
  if (focus.includes('Leg') || focus.includes('Pull') || focus.includes('Lower') || focus.includes('Full') || focus.includes('Back')) {
    warmup.push(exerciseDatabase.mobility.find(e => e.name === 'Deep Squat Hold')!);
  }

  return warmup.filter(Boolean);
}

function generateCooldown(): Exercise[] {
  return [
    { name: 'Static Stretching', targetMuscles: ['full body'], sets: 1, reps: '5-10 min', rest: '0', purpose: 'mobility', notes: 'Hold each stretch 30-45 sec. Focus on muscles trained.' },
    { name: 'Foam Rolling', targetMuscles: ['full body'], sets: 1, reps: '5 min', rest: '0', purpose: 'mobility', notes: 'Slow rolls on tight areas. 30-60 sec per muscle group.' },
  ];
}

function getExercisesForMuscle(muscle: string, painAreas: PainDiscomfort): Exercise[] {
  let exercises = exerciseDatabase[muscle] || [];

  if (painAreas.lowerBack) {
    exercises = exercises.filter(e => !['Conventional Deadlift', 'Barbell Row (Overhand)'].includes(e.name));
  }
  if (painAreas.shoulders) {
    exercises = exercises.filter(e => !['Barbell Overhead Press', 'Flat Barbell Bench Press'].includes(e.name));
  }
  if (painAreas.knees) {
    exercises = exercises.filter(e => !['Barbell Back Squat', 'Walking Lunges', 'Bulgarian Split Squat'].includes(e.name));
  }

  return exercises;
}

// PPL Split: ~15-20 sets per muscle group/week when run 2x
// Push A (heavy) / Pull A (heavy) / Legs A (quad focus)
// Push B (volume) / Pull B (volume) / Legs B (posterior focus)
function buildPPLSplit(_profile: UserProfile, painAreas: PainDiscomfort, _analysis?: PhysiqueAnalysis): WorkoutDay[] {
  const days: WorkoutDay[] = [];
  const isAdvanced = _profile.trainingHistory === 'advanced';

  // Push Day (Chest emphasis + Shoulders + Triceps)
  const pushExercises: Exercise[] = [];
  const chestExs = getExercisesForMuscle('chest', painAreas);
  const shoulderExs = getExercisesForMuscle('shoulders', painAreas);
  const armExs = getExercisesForMuscle('arms', painAreas);

  pushExercises.push(chestExs[0] || chestExs[1]); // Bench or DB Press
  pushExercises.push(chestExs[1] || chestExs[2]); // Incline DB
  pushExercises.push(chestExs[4] || chestExs[5]); // Machine Press or Pec Deck
  pushExercises.push(shoulderExs[1] || shoulderExs[2]); // Cable or DB Lateral Raises
  pushExercises.push(armExs[3]); // Overhead Tricep Extension
  pushExercises.push(armExs[4]); // Tricep Pushdowns
  if (isAdvanced) {
    pushExercises.push(shoulderExs[2] || shoulderExs[5]); // Extra lateral raise volume
  }

  days.push({
    day: 'Day 1',
    focus: 'Push (Chest, Shoulders, Triceps)',
    warmup: generateWarmup('Push', painAreas),
    mainWorkout: pushExercises.filter(Boolean),
    cooldown: generateCooldown(),
    estimatedDuration: 65,
  });

  // Pull Day (Back + Rear Delts + Biceps)
  const backExs = getExercisesForMuscle('back', painAreas);

  const pullExercises: Exercise[] = [];
  pullExercises.push(backExs[1] || backExs[4]); // Barbell Row or Chest-Supported Row
  pullExercises.push(backExs[2] || backExs[3]); // Pull-Ups or Lat Pulldown
  pullExercises.push(backExs[4] || backExs[5]); // Chest-Supported Row or Cable Row
  pullExercises.push(backExs[6]); // Face Pulls
  pullExercises.push(armExs[0]); // Incline DB Curl
  pullExercises.push(armExs[2]); // Hammer Curl

  days.push({
    day: 'Day 2',
    focus: 'Pull (Back, Rear Delts, Biceps)',
    warmup: generateWarmup('Pull', painAreas),
    mainWorkout: pullExercises.filter(Boolean),
    cooldown: generateCooldown(),
    estimatedDuration: 60,
  });

  // Legs Day (Quads + Hamstrings + Glutes + Calves)
  const legExs = getExercisesForMuscle('legs', painAreas);
  const coreExs = getExercisesForMuscle('core', painAreas);

  const legExercises: Exercise[] = [];
  legExercises.push(legExs[0] || legExs[2]); // Squat or Leg Press
  legExercises.push(legExs[1]); // RDL
  legExercises.push(legExs[2] || legExs[3]); // Leg Press or Bulgarian Split Squat
  legExercises.push(legExs[4]); // Leg Curl
  legExercises.push(legExs[5]); // Leg Extension
  legExercises.push(legExs[7]); // Standing Calf Raises
  legExercises.push(coreExs[0] || coreExs[1]); // Cable Crunch or Hanging Leg Raise

  days.push({
    day: 'Day 3',
    focus: 'Legs (Quads, Hamstrings, Glutes, Calves)',
    warmup: generateWarmup('Legs', painAreas),
    mainWorkout: legExercises.filter(Boolean),
    cooldown: generateCooldown(),
    estimatedDuration: 70,
  });

  return days;
}

// Upper/Lower Split: Each muscle hit 2x/week
function buildUpperLowerSplit(_profile: UserProfile, painAreas: PainDiscomfort): WorkoutDay[] {
  const days: WorkoutDay[] = [];

  // Upper Day (Horizontal push/pull focus + lateral raises + arms)
  const upperExercises: Exercise[] = [];
  const chestExs = getExercisesForMuscle('chest', painAreas);
  const backExs = getExercisesForMuscle('back', painAreas);
  const shoulderExs = getExercisesForMuscle('shoulders', painAreas);
  const armExs = getExercisesForMuscle('arms', painAreas);

  upperExercises.push(chestExs[0] || chestExs[2]); // Bench or DB Press
  upperExercises.push(backExs[1] || backExs[4]); // Row
  upperExercises.push(chestExs[1] || chestExs[3]); // Incline or Cable Flyes
  upperExercises.push(backExs[2] || backExs[3]); // Pull-Ups or Lat Pulldown
  upperExercises.push(shoulderExs[1] || shoulderExs[2]); // Lateral Raises
  upperExercises.push(backExs[6]); // Face Pulls
  upperExercises.push(armExs[0]); // Incline DB Curl
  upperExercises.push(armExs[3]); // Overhead Tricep Extension

  days.push({
    day: 'Day 1',
    focus: 'Upper Body (Push & Pull)',
    warmup: generateWarmup('Upper', painAreas),
    mainWorkout: upperExercises.filter(Boolean),
    cooldown: generateCooldown(),
    estimatedDuration: 65,
  });

  // Lower Day (Quad-dominant + posterior chain + calves + core)
  const lowerExercises: Exercise[] = [];
  const legExs = getExercisesForMuscle('legs', painAreas);
  const coreExs = getExercisesForMuscle('core', painAreas);

  lowerExercises.push(legExs[0] || legExs[2]); // Squat or Leg Press
  lowerExercises.push(legExs[1]); // RDL
  lowerExercises.push(legExs[3] || legExs[9]); // Bulgarian Split Squat or Lunges
  lowerExercises.push(legExs[4]); // Leg Curl
  lowerExercises.push(legExs[5]); // Leg Extension
  lowerExercises.push(legExs[7]); // Standing Calf Raises
  lowerExercises.push(coreExs[0] || coreExs[2]); // Cable Crunch or Ab Wheel

  days.push({
    day: 'Day 2',
    focus: 'Lower Body & Core',
    warmup: generateWarmup('Lower', painAreas),
    mainWorkout: lowerExercises.filter(Boolean),
    cooldown: generateCooldown(),
    estimatedDuration: 65,
  });

  return days;
}

// Full Body: 3x/week, compounds-focused, great for beginners & intermediates
function buildFullBodySplit(_profile: UserProfile, painAreas: PainDiscomfort): WorkoutDay[] {
  const chestExs = getExercisesForMuscle('chest', painAreas);
  const backExs = getExercisesForMuscle('back', painAreas);
  const legExs = getExercisesForMuscle('legs', painAreas);
  const shoulderExs = getExercisesForMuscle('shoulders', painAreas);
  const coreExs = getExercisesForMuscle('core', painAreas);

  const exercises: Exercise[] = [];
  exercises.push(legExs[0] || legExs[2]); // Squat or Leg Press
  exercises.push(chestExs[0] || chestExs[2]); // Bench or DB Press
  exercises.push(backExs[1] || backExs[4]); // Row
  exercises.push(legExs[1]); // RDL
  exercises.push(shoulderExs[1] || shoulderExs[2]); // Lateral Raises
  exercises.push(backExs[6]); // Face Pulls
  exercises.push(coreExs[0] || coreExs[4]); // Cable Crunch or Plank

  return [{
    day: 'Full Body',
    focus: 'Compounds + Accessories',
    warmup: generateWarmup('Full Body', painAreas),
    mainWorkout: exercises.filter(Boolean),
    cooldown: generateCooldown(),
    estimatedDuration: 55,
  }];
}

// Arnold Split: Antagonist pairing, 6 days/week (3-day rotation x2)
// Day 1 & 4: Chest + Back
// Day 2 & 5: Shoulders + Arms
// Day 3 & 6: Legs + Core
function buildArnoldSplit(_profile: UserProfile, painAreas: PainDiscomfort, _analysis?: PhysiqueAnalysis): WorkoutDay[] {
  const days: WorkoutDay[] = [];
  const isAdvanced = _profile.trainingHistory === 'advanced';

  // Chest + Back (Antagonist Supersets)
  const chestExs = getExercisesForMuscle('chest', painAreas);
  const backExs = getExercisesForMuscle('back', painAreas);
  const cbExercises: Exercise[] = [];
  cbExercises.push(chestExs[0] || chestExs[2]); // Bench Press
  cbExercises.push(backExs[2] || backExs[3]);    // Pull-Ups or Lat Pulldown
  cbExercises.push(chestExs[1] || chestExs[3]);  // Incline DB Press
  cbExercises.push(backExs[1] || backExs[4]);    // Barbell Row or Chest-Supported Row
  cbExercises.push(chestExs[5] || chestExs[4]);  // Pec Deck or Machine Press
  cbExercises.push(backExs[5] || backExs[7]);    // Cable Row or Straight-Arm Pulldown
  if (isAdvanced) {
    cbExercises.push(backExs[6]);                 // Face Pulls
  }

  days.push({
    day: 'Day 1',
    focus: 'Chest + Back (Antagonist Supersets)',
    warmup: generateWarmup('Chest + Back', painAreas),
    mainWorkout: cbExercises.filter(Boolean),
    cooldown: generateCooldown(),
    estimatedDuration: 70,
  });

  // Shoulders + Arms
  const shoulderExs = getExercisesForMuscle('shoulders', painAreas);
  const armExs = getExercisesForMuscle('arms', painAreas);
  const saExercises: Exercise[] = [];
  saExercises.push(shoulderExs[0] || shoulderExs[4]); // Seated DB OHP
  saExercises.push(shoulderExs[1] || shoulderExs[2]); // Lateral Raises
  saExercises.push(shoulderExs[3]);                    // Reverse Pec Deck
  saExercises.push(armExs[1] || armExs[0]);            // Barbell Curl
  saExercises.push(armExs[3]);                         // Overhead Tricep Extension
  saExercises.push(armExs[2]);                         // Hammer Curls
  saExercises.push(armExs[4]);                         // Tricep Pushdowns
  if (isAdvanced) {
    saExercises.push(shoulderExs[5] || shoulderExs[2]); // Extra lateral raise
  }

  days.push({
    day: 'Day 2',
    focus: 'Shoulders + Arms',
    warmup: generateWarmup('Shoulder', painAreas),
    mainWorkout: saExercises.filter(Boolean),
    cooldown: generateCooldown(),
    estimatedDuration: 65,
  });

  // Legs + Core
  const legExs = getExercisesForMuscle('legs', painAreas);
  const coreExs = getExercisesForMuscle('core', painAreas);
  const legExercises: Exercise[] = [];
  legExercises.push(legExs[0] || legExs[2]); // Squat or Leg Press
  legExercises.push(legExs[1]);               // RDL
  legExercises.push(legExs[3] || legExs[9]); // Bulgarian Split Squat or Lunges
  legExercises.push(legExs[4]);               // Leg Curl
  legExercises.push(legExs[5]);               // Leg Extension
  legExercises.push(legExs[6]);               // Hip Thrust
  legExercises.push(legExs[7]);               // Standing Calf Raises
  legExercises.push(coreExs[0] || coreExs[1]); // Cable Crunch or Hanging Leg Raise

  days.push({
    day: 'Day 3',
    focus: 'Legs (Quads, Hamstrings, Glutes, Calves) + Core',
    warmup: generateWarmup('Legs', painAreas),
    mainWorkout: legExercises.filter(Boolean),
    cooldown: generateCooldown(),
    estimatedDuration: 75,
  });

  return days;
}

// Add extra isolation volume for user-selected priority muscles
function applyMusclePriorities(
  days: WorkoutDay[],
  priorities: MusclePriorities | undefined,
  painAreas: PainDiscomfort
): WorkoutDay[] {
  if (!priorities || priorities.length === 0) return days;

  const targetToDbKey: Record<MuscleTarget, string> = {
    chest: 'chest', back: 'back', shoulders: 'shoulders',
    quads: 'legs', hamstrings: 'legs', glutes: 'legs',
    arms: 'arms', core: 'core', calves: 'legs',
  };

  return days.map(day => {
    const focusLower = day.focus.toLowerCase();
    const extraExercises: Exercise[] = [];

    for (const target of priorities) {
      const dayTrainsMuscle =
        focusLower.includes(target) ||
        (target === 'quads' && (focusLower.includes('leg') || focusLower.includes('lower') || focusLower.includes('full'))) ||
        (target === 'hamstrings' && (focusLower.includes('leg') || focusLower.includes('lower') || focusLower.includes('pull') || focusLower.includes('full'))) ||
        (target === 'glutes' && (focusLower.includes('leg') || focusLower.includes('lower') || focusLower.includes('full'))) ||
        (target === 'calves' && (focusLower.includes('leg') || focusLower.includes('lower') || focusLower.includes('full'))) ||
        (target === 'chest' && (focusLower.includes('push') || focusLower.includes('upper') || focusLower.includes('full'))) ||
        (target === 'back' && (focusLower.includes('pull') || focusLower.includes('upper') || focusLower.includes('full'))) ||
        (target === 'shoulders' && (focusLower.includes('push') || focusLower.includes('upper') || focusLower.includes('full') || focusLower.includes('shoulder'))) ||
        (target === 'arms' && (focusLower.includes('push') || focusLower.includes('pull') || focusLower.includes('upper') || focusLower.includes('arm'))) ||
        (target === 'core' && (focusLower.includes('leg') || focusLower.includes('lower') || focusLower.includes('full') || focusLower.includes('core')));

      if (!dayTrainsMuscle) continue;

      const dbKey = targetToDbKey[target];
      const available = getExercisesForMuscle(dbKey, painAreas);
      const existingNames = new Set([...day.mainWorkout.map(e => e.name), ...extraExercises.map(e => e.name)]);
      const extra = available.find(e => !existingNames.has(e.name));

      if (extra) {
        extraExercises.push({
          ...extra,
          notes: `[PRIORITY] ${extra.notes || ''}`.trim(),
        });
      }
    }

    if (extraExercises.length === 0) return day;

    return {
      ...day,
      mainWorkout: [...day.mainWorkout, ...extraExercises],
      estimatedDuration: day.estimatedDuration + extraExercises.length * 5,
    };
  });
}

function addPosturalWork(days: WorkoutDay[], analysis?: PhysiqueAnalysis): WorkoutDay[] {
  if (!analysis?.posture || analysis.posture.overallPosture === 'good') {
    return days;
  }

  const posturalExercises = exerciseDatabase.posture;

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
    if (splitPref === 'full_body') {
      schedule = buildFullBodySplit(profile, painAreas);
      daysPerWeek = 3;
      planName = 'Full Body Hypertrophy';
      description = 'Evidence-based full-body program. Each session hits all major muscle groups with compound lifts. 3 days/week with rest days between. Research shows full-body training is equally effective for hypertrophy as splits when volume is equated (Schoenfeld 2015).';
    } else if (splitPref === 'upper_lower') {
      schedule = buildUpperLowerSplit(profile, painAreas);
      daysPerWeek = 4;
      planName = 'Upper / Lower Hypertrophy';
      description = 'Science-based Upper/Lower split. Each muscle group trained 2x/week for optimal muscle protein synthesis frequency (Schoenfeld 2016). 4 sessions per week balances volume with recovery.';
    } else if (splitPref === 'arnold') {
      schedule = buildArnoldSplit(profile, painAreas, analysis);
      daysPerWeek = 6;
      planName = 'Arnold Split';
      description = 'Classic Arnold-style antagonist split. Chest+Back / Shoulders+Arms / Legs, each twice per week. Antagonist supersets increase workout density and may enhance performance through reciprocal inhibition (Robbins et al. 2010). ~15-20 sets per muscle group weekly.';
    } else {
      schedule = buildPPLSplit(profile, painAreas, analysis);
      daysPerWeek = 6;
      planName = 'Push / Pull / Legs';
      description = 'High-volume PPL split run twice per week. ~15-20 sets per muscle group weekly — the evidence-based sweet spot for hypertrophy (Schoenfeld & Krieger 2019). Exercises selected for maximum muscle activation and lengthened-partial emphasis.';
    }
  } else {
    if (profile.trainingHistory === 'beginner') {
      schedule = buildFullBodySplit(profile, painAreas);
      daysPerWeek = 3;
      planName = 'Full Body Foundation';
      description = 'Compound-focused full-body program to build strength and movement literacy. Beginners make rapid gains with 3 days/week — "newbie gains" come from neural adaptations and are maximized with consistent practice of the big lifts.';
    } else if (profile.goal === 'posture' || (analysis?.posture?.overallPosture === 'needs_attention')) {
      schedule = buildUpperLowerSplit(profile, painAreas);
      schedule = addPosturalWork(schedule, analysis);
      daysPerWeek = 4;
      planName = 'Corrective Hypertrophy';
      description = 'Strength building with integrated postural correction. Addresses muscle imbalances (anterior/posterior dominance) while still driving hypertrophy. Corrective exercises are programmed as supersets with main lifts.';
    } else if (profile.goal === 'bulk' || profile.goal === 'aesthetic') {
      if (profile.trainingHistory === 'advanced' && profile.goal === 'aesthetic') {
        schedule = buildArnoldSplit(profile, painAreas, analysis);
        daysPerWeek = 6;
        planName = 'Arnold Aesthetic Split';
        description = 'Advanced antagonist split for proportional development. Chest+Back supersets increase training density. Dedicated shoulder+arm day ensures balanced arm and delt volume. Research supports antagonist-paired training for maintaining strength output (Paz et al. 2017).';
      } else {
        schedule = buildPPLSplit(profile, painAreas, analysis);
        daysPerWeek = 6;
        planName = profile.goal === 'bulk' ? 'Mass Building Program' : 'Aesthetic Development';
        description = profile.goal === 'bulk'
          ? 'High-volume PPL split optimized for maximum muscle growth. 15-20+ sets per muscle group weekly with progressive overload. Emphasis on compound lifts and lengthened-partial training for maximal hypertrophy stimulus.'
          : 'Balanced PPL split focused on proportional development. Extra side delt and rear delt volume for the capped-shoulder look. Emphasis on V-taper (wide back, capped delts, small waist).';
      }
    } else {
      schedule = buildUpperLowerSplit(profile, painAreas);
      daysPerWeek = 4;
      planName = 'Strength & Hypertrophy';
      description = 'Upper/Lower split balancing strength and muscle growth. Heavy compounds in the 5-8 rep range followed by hypertrophy accessories in the 10-15 range. 2x/week frequency per muscle group.';
    }
  }

  if (analysis?.posture && analysis.posture.overallPosture !== 'good') {
    schedule = addPosturalWork(schedule, analysis);
  }

  // Add extra volume for user-selected priority muscles
  schedule = applyMusclePriorities(schedule, profile.musclePriorities, painAreas);

  const modifications: string[] = [];

  if (painAreas.lowerBack) {
    modifications.push('Deadlifts replaced with hip hinges (trap bar DL, single-leg RDL) — lower spinal loading, similar posterior chain stimulus');
    modifications.push('Core bracing drills (dead bugs, Pallof press) added to build spinal stability before loading');
  }
  if (painAreas.shoulders) {
    modifications.push('Overhead pressing replaced with landmine press or high-incline DB press — reduced impingement risk');
    modifications.push('Neutral grip on all pressing. Extra external rotation work (face pulls, band pull-aparts) every session');
  }
  if (painAreas.knees) {
    modifications.push('Barbell squat replaced with leg press or belt squat — reduced axial loading while maintaining quad stimulus');
    modifications.push('Lunges replaced with step-ups. Leg extension with partials in pain-free range of motion');
  }

  return {
    name: planName,
    description,
    daysPerWeek,
    schedule,
    progressionNotes: `
PROGRESSIVE OVERLOAD PROTOCOL:
- Primary goal: add reps within the prescribed range, then add weight
- When you hit the top of the rep range for all sets (e.g. 3x12 when range is 8-12), increase weight by the smallest increment available
- Upper body: increase by 2.5-5 lbs (1-2.5 kg)
- Lower body: increase by 5-10 lbs (2.5-5 kg)
- Track RPE (Rate of Perceived Exertion) — most working sets should be RPE 7-9 (1-3 reps in reserve)
- Never sacrifice form for weight. Ego lifting = injuries, not gains.

DELOAD PROTOCOL (every 4-6 weeks):
- Reduce volume by 40-50% (same exercises, fewer sets)
- Keep intensity at 70-80% of normal working weights
- Focus on form, mind-muscle connection, and recovery
- Deloads are where adaptation happens — they are not wasted weeks

WEEKLY VOLUME TARGETS (working sets per muscle group):
- Large muscles (chest, back, quads): 12-20 sets/week
- Medium muscles (shoulders, hamstrings, glutes): 10-16 sets/week
- Small muscles (biceps, triceps, calves): 8-14 sets/week
- Rear delts/side delts: 15-20+ sets/week for balanced development
    `.trim(),
    modifications,
  };
}
