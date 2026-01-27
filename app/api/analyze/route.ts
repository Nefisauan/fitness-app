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

    const prompt = `You are an expert fitness coach and movement specialist. Based on the following user profile, generate a detailed physique and movement analysis.

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

IMPORTANT: Frame all observations as fitness and performance insights, NOT medical diagnoses. Use phrases like "potential indicators of" rather than diagnosing conditions.

Generate a JSON response with this EXACT structure (no markdown, just JSON):
{
  "muscle": {
    "groups": [
      {"name": "Chest", "development": "balanced|underdeveloped|well_developed|overdominant", "score": 1-10, "notes": "brief observation"},
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
    "priorityAreas": ["list of muscle groups that need focus"]
  },
  "posture": {
    "indicators": [
      {"area": "area name", "indicator": "what you observe", "severity": "mild|moderate|notable", "recommendation": "corrective action"}
    ],
    "overallPosture": "good|fair|needs_attention",
    "primaryConcerns": ["list of main concerns"]
  },
  "movement": {
    "flags": [
      {"movement": "movement name", "observation": "what you observe", "limitation": "mobility|stability|compensation", "affectedArea": "body area", "recommendation": "corrective action"}
    ],
    "mobilityScore": 1-10,
    "stabilityScore": 1-10,
    "overallMovementQuality": "excellent|good|fair|needs_work"
  },
  "summary": "2-3 sentence overall assessment",
  "disclaimer": "These observations are fitness performance insights based on the information provided, not medical diagnoses. For persistent pain or injuries, consult a qualified healthcare professional."
}

Make realistic assessments based on the training level, activity, and pain areas. For a beginner, scores should be lower. For someone with pain areas, add relevant postural indicators and movement flags. Be specific and actionable.`;

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
    { name: 'Chest', development: beginnerDev, score: baseScore, notes: isBeginnerOrSedentary ? 'Building a foundation here will improve upper body aesthetics' : 'Proportionate development relative to training level' },
    { name: 'Back', development: beginnerDev, score: baseScore - 1, notes: 'Posterior chain development is key for posture and pulling strength' },
    { name: 'Shoulders', development: bal, score: baseScore, notes: 'Shoulder development helps create a balanced upper body frame' },
    { name: 'Arms', development: armsDev, score: baseScore, notes: 'Arms develop well with compound movements' },
    { name: 'Core', development: beginnerDev, score: baseScore - 1, notes: 'Core strength is foundational for all movements' },
    { name: 'Quads', development: bal, score: baseScore, notes: 'Quad development supports knee stability and athletic performance' },
    { name: 'Hamstrings', development: ud, score: baseScore - 2, notes: 'Often undertrained relative to quads - important for balance' },
    { name: 'Glutes', development: beginnerDev, score: baseScore - 1, notes: 'Glute strength is crucial for hip stability and lower back health' },
    { name: 'Calves', development: ud, score: baseScore - 2, notes: 'Commonly undertrained - important for ankle stability' },
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
        ? 'there is significant room for development across all muscle groups. Building a strong foundation with compound movements will be the most effective approach.'
        : 'you have a solid foundation to build upon. Focus on addressing weak points and imbalances to continue progressing.'
    } ${hasPainAreas ? 'The reported discomfort areas suggest some movement limitations that should be addressed through targeted mobility and strengthening work.' : 'No significant limitations reported, allowing for a progressive training approach.'}`,
    disclaimer: 'These observations are fitness performance insights based on the information provided, not medical diagnoses. For persistent pain or injuries, consult a qualified healthcare professional.',
  };
}
