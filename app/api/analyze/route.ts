import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { UserProfile, PainDiscomfort, PhysiqueAnalysis } from '@/lib/types';

interface AnalyzeRequest {
  profile: UserProfile;
  painAreas: PainDiscomfort;
  hasPhotos: boolean;
  photoAngles: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { profile, painAreas, hasPhotos, photoAngles } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return a structured demo analysis when no API key
      return NextResponse.json(generateDemoAnalysis(profile, painAreas));
    }

    const client = new Anthropic({ apiKey });

    const painList = Object.entries(painAreas)
      .filter(([, v]) => v)
      .map(([k]) => k.replace(/([A-Z])/g, ' $1').trim());

    const prompt = `You are a science-based hypertrophy and strength coach — think Jeff Nippard meets Dr. Mike Israetel. Your approach is grounded in peer-reviewed exercise science research (Schoenfeld, Krieger, Helms, Israetel). You prioritize evidence-based training principles: progressive overload, optimal volume (10-20 sets/muscle/week), training to appropriate RPE (7-9), lengthened-partial training for maximal hypertrophy, proper frequency (2x/week per muscle), and intelligent exercise selection based on EMG and biomechanics research.

Based on the following user profile, generate a detailed physique and movement analysis.

USER PROFILE:
- Age: ${profile.age || 'Not provided'}
- Gender: ${profile.gender || 'Not provided'}
- Height: ${profile.height ? profile.height + 'cm' : 'Not provided'}
- Weight: ${profile.weight ? profile.weight + 'kg' : 'Not provided'}
- Activity Level: ${profile.activityLevel}
- Training Experience: ${profile.trainingHistory}
- Goal: ${profile.goal}
- Sleep: ${profile.sleepHours || 'Not provided'} hours/night
- Pain/Discomfort Areas: ${painList.length > 0 ? painList.join(', ') : 'None reported'}
- Photos provided: ${hasPhotos ? `Yes (${photoAngles.join(', ')})` : 'No'}

ANALYSIS GUIDELINES:
- Frame all observations as fitness performance insights, NOT medical diagnoses
- Reference evidence-based concepts: muscle protein synthesis windows, volume landmarks (MEV, MAV, MRV), progressive overload, and hypertrophy mechanisms (mechanical tension, metabolic stress)
- For muscle assessments, consider typical imbalances: anterior dominance, quad-to-hamstring ratio, upper vs lower development
- Be honest and direct — real coaching, not motivational fluff
- Notes should include actionable hypertrophy-specific advice (e.g. "prioritize lengthened-position exercises" or "increase weekly volume to 15+ sets")

Generate a JSON response with this EXACT structure (no markdown, just JSON):
{
  "muscle": {
    "groups": [
      {"name": "Chest", "development": "balanced|underdeveloped|well_developed|overdominant", "score": 1-10, "notes": "brief observation with science-based training insight"},
      {"name": "Back", "development": "...", "score": 1-10, "notes": "..."},
      {"name": "Shoulders", "development": "...", "score": 1-10, "notes": "..."},
      {"name": "Arms", "development": "...", "score": 1-10, "notes": "..."},
      {"name": "Core", "development": "...", "score": 1-10, "notes": "..."},
      {"name": "Quads", "development": "...", "score": 1-10, "notes": "..."},
      {"name": "Hamstrings", "development": "...", "score": 1-10, "notes": "..."},
      {"name": "Glutes", "development": "...", "score": 1-10, "notes": "..."},
      {"name": "Calves", "development": "...", "score": 1-10, "notes": "..."}
    ],
    "symmetry": {
      "leftRight": "balanced|left_dominant|right_dominant",
      "upperLower": "balanced|upper_dominant|lower_dominant",
      "frontBack": "balanced|anterior_dominant|posterior_dominant"
    },
    "overallScore": 1-10,
    "priorityAreas": ["list of muscle groups that need focus based on development gaps and symmetry"]
  },
  "posture": {
    "indicators": [
      {"area": "area name", "indicator": "what you observe and the biomechanical implication", "severity": "mild|moderate|notable", "recommendation": "corrective action with specific exercises"}
    ],
    "overallPosture": "good|fair|needs_attention",
    "primaryConcerns": ["list of main concerns"]
  },
  "movement": {
    "flags": [
      {"movement": "movement pattern", "observation": "what you observe", "limitation": "mobility|stability|compensation", "affectedArea": "body area", "recommendation": "specific corrective strategy"}
    ],
    "mobilityScore": 1-10,
    "stabilityScore": 1-10,
    "overallMovementQuality": "excellent|good|fair|needs_work"
  },
  "summary": "2-3 sentence assessment that sounds like a knowledgeable coach — direct, evidence-based, and actionable. Reference specific training principles where relevant.",
  "disclaimer": "These observations are fitness performance insights based on the information provided, not medical diagnoses. For persistent pain or injuries, consult a qualified healthcare professional."
}

Be realistic. Beginners should score 3-5. Intermediates 5-7. Only advanced lifters with years of consistent training should score 7+. Most people have anterior dominance and undertrained posterior chain. Be specific and actionable — this should read like advice from a coach who actually knows the research.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = message.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json(generateDemoAnalysis(profile, painAreas));
    }

    try {
      const analysis: PhysiqueAnalysis = JSON.parse(textContent.text);
      return NextResponse.json(analysis);
    } catch {
      // If JSON parsing fails, return demo analysis
      return NextResponse.json(generateDemoAnalysis(profile, painAreas));
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    );
  }
}

function generateDemoAnalysis(profile: UserProfile, painAreas: PainDiscomfort): PhysiqueAnalysis {
  const isBeginnerOrSedentary =
    profile.trainingHistory === 'beginner' || profile.activityLevel === 'sedentary';

  const baseScore = isBeginnerOrSedentary ? 4 : profile.trainingHistory === 'advanced' ? 7 : 5;

  type Dev = 'underdeveloped' | 'balanced' | 'well_developed' | 'overdominant';
  const ud: Dev = 'underdeveloped';
  const bal: Dev = 'balanced';
  const beginnerDev: Dev = isBeginnerOrSedentary ? ud : bal;
  const armsDev: Dev = profile.trainingHistory === 'beginner' ? ud : bal;

  const groups: { name: string; development: Dev; score: number; notes: string }[] = [
    { name: 'Chest', development: beginnerDev, score: baseScore, notes: isBeginnerOrSedentary ? 'Low baseline — focus on bench press and incline DB press as primary drivers. Target 12-16 sets/week to establish MEV.' : 'Solid foundation. Prioritize incline work (30°) for clavicular head and pec deck for lengthened-partial stimulus.' },
    { name: 'Back', development: beginnerDev, score: baseScore - 1, notes: 'Posterior chain is typically underdeveloped relative to anterior. Prioritize horizontal rows and vertical pulls. Target 15-20 sets/week — back can handle high volume.' },
    { name: 'Shoulders', development: bal, score: baseScore, notes: 'Front delts get plenty of work from pressing. Focus on lateral raises (cable preferred for lengthened tension) and rear delts. Side delts respond to 15-20+ weekly sets.' },
    { name: 'Arms', development: armsDev, score: baseScore, notes: 'Biceps: incline curls for long head stretch. Triceps: overhead extensions for long head. 8-14 sets/week each. Arms grow from compounds + targeted isolation.' },
    { name: 'Core', development: beginnerDev, score: baseScore - 1, notes: 'Core stability enables progressive overload on compounds. Prioritize anti-extension (ab wheel) and anti-rotation (Pallof press). Cable crunches for rectus abdominis hypertrophy.' },
    { name: 'Quads', development: bal, score: baseScore, notes: 'Squats and leg press as primary drivers. Leg extension for isolation. Research supports training quads at longer muscle lengths (deep squats, full ROM leg press) for maximal growth.' },
    { name: 'Hamstrings', development: ud, score: baseScore - 2, notes: 'Commonly undertrained — most people have a quad-dominant imbalance. RDLs (hip-dominant) + leg curls (knee-dominant) = complete hamstring development. Both movement patterns needed.' },
    { name: 'Glutes', development: beginnerDev, score: baseScore - 1, notes: 'Hip thrusts show highest glute EMG activation. RDLs and deep squats also contribute. Glute strength is foundational for hip stability and athletic performance.' },
    { name: 'Calves', development: ud, score: baseScore - 2, notes: 'Calves respond to slow eccentrics and full ROM. Standing raises for gastrocnemius, seated for soleus. Train 3-4x/week with 8-12 sets total. Most people need higher frequency here.' },
  ];

  type Severity = 'mild' | 'moderate' | 'notable';
  type Limitation = 'mobility' | 'stability' | 'compensation';

  const posturalIndicators: { area: string; indicator: string; severity: Severity; recommendation: string }[] = [];
  if (painAreas.neck || painAreas.shoulders) {
    posturalIndicators.push({
      area: 'Upper Cross',
      indicator: 'Potential indicators of forward head position and rounded shoulders, common with desk work',
      severity: 'moderate',
      recommendation: 'Focus on thoracic extension, chin tucks, and rear delt work to counter forward posture',
    });
  }
  if (painAreas.lowerBack || painAreas.hips) {
    posturalIndicators.push({
      area: 'Lower Cross',
      indicator: 'Potential indicators of anterior pelvic tilt with tight hip flexors',
      severity: 'moderate',
      recommendation: 'Incorporate hip flexor stretching, glute activation, and core bracing exercises',
    });
  }
  if (isBeginnerOrSedentary) {
    posturalIndicators.push({
      area: 'General Alignment',
      indicator: 'Limited muscular development may contribute to postural deviations over time',
      severity: 'mild',
      recommendation: 'Building overall strength with proper form will naturally improve posture',
    });
  }

  const movementFlags: { movement: string; observation: string; limitation: Limitation; affectedArea: string; recommendation: string }[] = [];
  if (painAreas.knees || painAreas.ankles) {
    movementFlags.push({
      movement: 'Squat Pattern',
      observation: 'Potential limitation in squat depth or knee tracking based on reported discomfort areas',
      limitation: 'mobility',
      affectedArea: 'Hips and ankles',
      recommendation: 'Work on ankle mobility and hip openers before squatting. Use box squats to build confidence.',
    });
  }
  if (painAreas.shoulders) {
    movementFlags.push({
      movement: 'Overhead Reach',
      observation: 'Shoulder discomfort may indicate limited overhead mobility or rotator cuff imbalance',
      limitation: 'mobility',
      affectedArea: 'Shoulder complex',
      recommendation: 'Incorporate shoulder pass-throughs, wall slides, and external rotation work',
    });
  }
  if (painAreas.lowerBack) {
    movementFlags.push({
      movement: 'Hip Hinge',
      observation: 'Lower back sensitivity may indicate compensation for weak glutes or hamstrings during hip hinge movements',
      limitation: 'compensation',
      affectedArea: 'Posterior chain',
      recommendation: 'Build glute and hamstring strength with glute bridges and RDLs at light weight before progressing',
    });
  }
  if (movementFlags.length === 0) {
    movementFlags.push({
      movement: 'General Movement',
      observation: 'No specific discomfort reported - focus on building movement quality with progressive loading',
      limitation: 'stability',
      affectedArea: 'Full body',
      recommendation: 'Practice fundamental movement patterns (squat, hinge, push, pull) with controlled tempo',
    });
  }

  const hasPainAreas = Object.values(painAreas).some(v => v);
  const mobilityScore = hasPainAreas ? 5 : isBeginnerOrSedentary ? 6 : 7;
  const stabilityScore = isBeginnerOrSedentary ? 5 : 7;

  const priorityAreas = ['Hamstrings', 'Glutes', 'Calves'];
  if (isBeginnerOrSedentary) {
    priorityAreas.unshift('Core');
  }
  if (painAreas.shoulders || painAreas.neck) {
    priorityAreas.push('Rear Delts & Upper Back');
  }

  return {
    muscle: {
      groups,
      symmetry: {
        leftRight: 'balanced',
        upperLower: isBeginnerOrSedentary ? 'upper_dominant' : 'balanced',
        frontBack: 'anterior_dominant',
      },
      overallScore: baseScore,
      priorityAreas,
    },
    posture: {
      indicators: posturalIndicators,
      overallPosture: hasPainAreas ? 'needs_attention' : isBeginnerOrSedentary ? 'fair' : 'good',
      primaryConcerns: posturalIndicators.map(i => i.area),
    },
    movement: {
      flags: movementFlags,
      mobilityScore,
      stabilityScore,
      overallMovementQuality: hasPainAreas ? 'fair' : isBeginnerOrSedentary ? 'fair' : 'good',
    },
    summary: `Based on your ${profile.trainingHistory} training background and ${profile.activityLevel} activity level, ${
      isBeginnerOrSedentary
        ? 'you\'re in the highest-potential phase of training. Beginners can add weight to the bar almost every session through neural adaptations. Focus on mastering compound movement patterns (squat, bench, row, RDL) and progressive overload. Consistency beats optimization at this stage.'
        : 'you have a solid base to build on. The focus now should shift to intelligent volume management, hitting 10-20 sets per muscle group per week, training to RPE 7-9, and prioritizing lengthened-position exercises for maximal hypertrophy.'
    } ${hasPainAreas ? 'The reported discomfort areas indicate movement limitations that need corrective work — address these with targeted mobility and strengthening before pushing intensity.' : 'No significant movement limitations reported, so progressive overload can be pursued aggressively.'}`,
    disclaimer: 'These observations are fitness performance insights based on the information provided, not medical diagnoses. For persistent pain or injuries, consult a qualified healthcare professional.',
  };
}
