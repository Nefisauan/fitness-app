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
    'Maintain consistent sleep and wake times, even on weekends',
    'Keep your bedroom cool (65-68°F / 18-20°C)',
    'Avoid screens 1 hour before bed',
    'Limit caffeine after 2 PM',
  ];

  if (profile.goal === 'bulk' || profile.goal === 'aesthetic') {
    sleepTips.push('Consider a casein protein shake before bed for overnight muscle protein synthesis');
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
    'Practice deep breathing exercises (5 minutes daily)',
    'Consider meditation or mindfulness practice',
    'Limit high-intensity training when life stress is high',
    'Take deload weeks every 4-6 weeks',
    'Track recovery metrics (sleep quality, morning heart rate, energy levels)',
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
