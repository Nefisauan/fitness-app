'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import PhotoUpload from '@/components/PhotoUpload';
import UserProfileForm from '@/components/UserProfileForm';
import AnalysisResults from '@/components/AnalysisResults';
import WorkoutPlanComponent from '@/components/WorkoutPlan';
import NutritionPlanComponent from '@/components/NutritionPlan';
import ProgressTracker from '@/components/ProgressTracker';
import DownloadPDF from '@/components/DownloadPDF';
import AuthButton from '@/components/AuthButton';
import { UserProfile, PainDiscomfort, UploadedMedia, PhysiqueAnalysis, WorkoutPlan, NutritionPlan, RecoveryPlan } from '@/lib/types';
import { generateWorkoutPlan } from '@/lib/workout';
import { generateNutritionPlan } from '@/lib/nutrition';
import { generateRecoveryPlan } from '@/lib/recovery';
import { createClient } from '@/lib/supabase/client';
import {
  loadProfile,
  saveProfile,
  loadLatestAssessment,
  saveAssessment,
  loadProgressEntries,
  saveProgressEntry,
} from '@/lib/supabase/database';

type Tab = 'input' | 'analysis' | 'workout' | 'nutrition' | 'progress';

interface ProgressEntry {
  id: string;
  date: string;
  muscleScore: number;
  postureStatus: string;
  movementQuality: string;
  mobilityScore: number;
  stabilityScore: number;
  weight?: number;
}

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<Tab>('input');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState<UploadedMedia[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    activityLevel: 'moderate',
    trainingHistory: 'intermediate',
    goal: 'aesthetic',
    splitPreference: 'recommended',
  });
  const [painAreas, setPainAreas] = useState<PainDiscomfort>({
    lowerBack: false,
    shoulders: false,
    knees: false,
    neck: false,
    hips: false,
    ankles: false,
    wrists: false,
  });

  // Results state
  const [analysis, setAnalysis] = useState<PhysiqueAnalysis | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
  const [progressHistory, setProgressHistory] = useState<ProgressEntry[]>([]);

  // Supabase state
  const [userId, setUserId] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDone = useRef(false);

  // Load data on mount
  useEffect(() => {
    supabaseRef.current = createClient();
    const supabase = supabaseRef.current;

    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      const [profileData, assessmentData, progressData] = await Promise.all([
        loadProfile(supabase, user.id),
        loadLatestAssessment(supabase, user.id),
        loadProgressEntries(supabase, user.id),
      ]);

      if (profileData) {
        setProfile(profileData.profile);
        setPainAreas(profileData.painAreas);
      }

      if (assessmentData) {
        setAssessmentId(assessmentData.id);
        setAnalysis(assessmentData.analysis);
        setWorkoutPlan(assessmentData.workoutPlan);
        setNutritionPlan(assessmentData.nutritionPlan);
        setRecoveryPlan(assessmentData.recoveryPlan);
      }

      if (progressData.length > 0) {
        setProgressHistory(progressData);
      }

      setIsLoading(false);
      initialLoadDone.current = true;
    }

    loadData();
  }, []);

  // Debounced profile auto-save
  useEffect(() => {
    if (!initialLoadDone.current || !userId || !supabaseRef.current) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    const supabase = supabaseRef.current;
    saveTimeoutRef.current = setTimeout(() => {
      saveProfile(supabase, userId, profile, painAreas);
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [profile, painAreas, userId]);

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          painAreas,
          hasPhotos: photos.length > 0,
          photoAngles: photos.map(p => p.angle),
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const analysisResult: PhysiqueAnalysis = await response.json();
      setAnalysis(analysisResult);

      const workout = generateWorkoutPlan(profile, painAreas, analysisResult);
      setWorkoutPlan(workout);

      const nutrition = generateNutritionPlan(profile);
      setNutritionPlan(nutrition);

      const recovery = generateRecoveryPlan(profile, analysisResult);
      setRecoveryPlan(recovery);

      if (userId && supabaseRef.current) {
        const id = await saveAssessment(supabaseRef.current, userId, {
          analysis: analysisResult,
          workoutPlan: workout,
          nutritionPlan: nutrition,
          recoveryPlan: recovery,
          profile,
          painAreas,
        });
        if (id) setAssessmentId(id);
      }

      setActiveTab('analysis');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to generate analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [profile, painAreas, photos, userId]);

  const handleSaveProgress = async (entry: ProgressEntry) => {
    setProgressHistory(prev => [...prev, entry]);
    if (userId && supabaseRef.current) {
      await saveProgressEntry(supabaseRef.current, userId, entry, assessmentId ?? undefined);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; requiresAnalysis: boolean }[] = [
    {
      id: 'input',
      label: 'Assessment',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      requiresAnalysis: false,
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      requiresAnalysis: true,
    },
    {
      id: 'workout',
      label: 'Workout',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      requiresAnalysis: true,
    },
    {
      id: 'nutrition',
      label: 'Nutrition',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      requiresAnalysis: true,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      requiresAnalysis: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FitAI Analyzer</h1>
                <p className="text-xs text-gray-500">AI-Powered Fitness Assessment</p>
              </div>
            </div>

            {/* Navigation Tabs + Auth */}
            <div className="flex items-center gap-2">
              <nav className="hidden md:flex items-center gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.requiresAnalysis && !analysis) return;
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-violet-100 text-violet-700'
                        : tab.requiresAnalysis && !analysis
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    disabled={tab.requiresAnalysis && !analysis}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div className="hidden md:block w-px h-6 bg-gray-200" />
              <AuthButton />
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden pb-3 -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.requiresAnalysis && !analysis) return;
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-violet-100 text-violet-700'
                      : tab.requiresAnalysis && !analysis
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  disabled={tab.requiresAnalysis && !analysis}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'input' && (
          <div className="space-y-6">
            <PhotoUpload photos={photos} onPhotosChange={setPhotos} />
            <UserProfileForm
              profile={profile}
              painAreas={painAreas}
              onProfileChange={setProfile}
              onPainAreasChange={setPainAreas}
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Ready to Analyze</h3>
                  <p className="text-sm text-gray-500">
                    {photos.length > 0
                      ? `${photos.length} photo(s) uploaded`
                      : 'No photos uploaded (analysis will be based on profile data)'}
                    {' • '}{profile.goal.charAt(0).toUpperCase() + profile.goal.slice(1)} goal
                    {' • '}{profile.trainingHistory} level
                  </p>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={`px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                    isAnalyzing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Generate Full Assessment'
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-500 text-center">
              This tool provides fitness performance insights only. It is not a substitute for professional
              medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for
              medical concerns.
            </div>
          </div>
        )}

        {activeTab === 'analysis' && analysis && (
          <AnalysisResults analysis={analysis} />
        )}

        {activeTab === 'workout' && workoutPlan && (
          <div className="space-y-4">
            {nutritionPlan && recoveryPlan && (
              <div className="flex justify-end">
                <DownloadPDF
                  workoutPlan={workoutPlan}
                  nutritionPlan={nutritionPlan}
                  recoveryPlan={recoveryPlan}
                  profile={profile}
                />
              </div>
            )}
            <WorkoutPlanComponent plan={workoutPlan} />
          </div>
        )}

        {activeTab === 'nutrition' && nutritionPlan && recoveryPlan && (
          <div className="space-y-4">
            {workoutPlan && (
              <div className="flex justify-end">
                <DownloadPDF
                  workoutPlan={workoutPlan}
                  nutritionPlan={nutritionPlan}
                  recoveryPlan={recoveryPlan}
                  profile={profile}
                />
              </div>
            )}
            <NutritionPlanComponent nutrition={nutritionPlan} recovery={recoveryPlan} />
          </div>
        )}

        {activeTab === 'progress' && (
          <ProgressTracker
            currentAnalysis={analysis}
            history={progressHistory}
            onSaveEntry={handleSaveProgress}
          />
        )}
      </main>
    </div>
  );
}
