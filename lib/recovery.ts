import { UserProfile, RecoveryPlan, PhysiqueAnalysis } from './types';

export function generateRecoveryPlan(
  profile: UserProfile,
  analysis?: PhysiqueAnalysis
): RecoveryPlan {
  // Base sleep recommendation on activity level and goal
  let sleepHours = 7;
  if (profile.goal === 'bulk' || profile.goal === 'aesthetic') {
    sleepHours = 8;
  }
  if (profile.activityLevel === 'very_active') {
    sleepHours = 8.5;
  }

  const sleepTips: string[] = [
    'Sleep is the #1 recovery tool — growth hormone peaks during deep sleep. Prioritize it over any supplement.',
    'Maintain consistent sleep and wake times, even on weekends. Circadian rhythm consistency improves sleep quality.',
    'Keep your bedroom cool (65-68°F / 18-20°C) — core temperature drop is a sleep trigger.',
    'Limit caffeine after 2 PM — caffeine has a half-life of 5-6 hours and disrupts deep sleep even if you fall asleep fine.',
    'Avoid screens 1 hour before bed, or use blue-light blocking glasses. Blue light suppresses melatonin production.',
  ];

  if (profile.goal === 'bulk' || profile.goal === 'aesthetic') {
    sleepTips.push('30-40g casein protein before bed provides a slow amino acid release that supports overnight muscle protein synthesis (Snijders et al. 2015).');
  }

  // Rest days based on training frequency
  let restDays = 2;
  if (profile.trainingHistory === 'beginner') {
    restDays = 4;
  } else if (profile.goal === 'bulk' || profile.goal === 'aesthetic') {
    restDays = 1;
  }

  // Active recovery suggestions
  const activeRecovery = [
    'Light walking (20-30 minutes)',
    'Swimming or water activities',
    'Yoga or gentle stretching',
    'Cycling at low intensity',
  ];

  // Mobility work based on analysis
  const mobilityWork = [
    'Daily 10-minute mobility routine',
    'Foam rolling major muscle groups',
    'Dynamic stretching on training days',
    'Static stretching on rest days',
  ];

  if (analysis?.posture?.overallPosture !== 'good') {
    mobilityWork.push('Dedicated postural correction exercises 3x per week');
    mobilityWork.push('Thoracic spine mobility work daily');
  }

  if (analysis?.movement?.mobilityScore && analysis.movement.mobilityScore < 6) {
    mobilityWork.push('Hip opener routine before lower body days');
    mobilityWork.push('Shoulder mobility complex before upper body days');
  }

  // Stress management
  const stressManagement = [
    'Chronic stress elevates cortisol, which impairs recovery and promotes fat storage. Managing stress is directly tied to training results.',
    'Practice deep breathing or box breathing (4-4-4-4) for 5 min daily — activates parasympathetic nervous system for recovery.',
    'Auto-regulate training intensity based on life stress. High stress weeks = reduce volume by 20-30% rather than pushing through.',
    'Deload every 4-6 weeks — reduce volume 40-50%, keep intensity moderate. Fatigue masking fitness is real; deloads reveal your true progress.',
    'Track recovery metrics: sleep quality, morning resting heart rate, subjective energy. Elevated RHR or persistent fatigue = back off.',
  ];

  if (profile.sleepHours && profile.sleepHours < 7) {
    stressManagement.unshift('Prioritize improving sleep quality and duration');
  }

  return {
    sleepRecommendation: {
      hours: sleepHours,
      tips: sleepTips,
    },
    restDays,
    activeRecovery,
    mobilityWork,
    stressManagement,
  };
}
