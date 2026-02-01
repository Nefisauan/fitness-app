import jsPDF from 'jspdf';
import type { WorkoutPlan, NutritionPlan, RecoveryPlan, UserProfile } from './types';

interface PDFInput {
  workoutPlan: WorkoutPlan;
  nutritionPlan: NutritionPlan;
  recoveryPlan: RecoveryPlan;
  profile: UserProfile;
}

const PAGE_WIDTH = 210;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const goalLabels: Record<string, string> = {
  lean: 'Get Lean',
  bulk: 'Bulk Up',
  aesthetic: 'Aesthetic',
  recomp: 'Recomp',
  posture: 'Posture & Movement',
};

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 280) {
    doc.addPage();
    return 20;
  }
  return y;
}

export function generatePDF({ workoutPlan, nutritionPlan, recoveryPlan, profile }: PDFInput) {
  const doc = new jsPDF();
  let y = 20;

  // --- Header ---
  doc.setFillColor(109, 40, 217); // violet-600
  doc.rect(0, 0, PAGE_WIDTH, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FitAI', MARGIN, 18);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Goal: ${goalLabels[profile.goal] || profile.goal}`, MARGIN, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, MARGIN, 35);

  y = 50;
  doc.setTextColor(0, 0, 0);

  // --- Workout Plan ---
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${workoutPlan.name} (${workoutPlan.daysPerWeek} days/week)`, MARGIN, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  const descLines = doc.splitTextToSize(workoutPlan.description, CONTENT_WIDTH);
  doc.text(descLines, MARGIN, y);
  y += descLines.length * 4 + 6;
  doc.setTextColor(0, 0, 0);

  for (const day of workoutPlan.schedule) {
    const totalExercises = day.warmup.length + day.mainWorkout.length + day.cooldown.length;
    y = checkPageBreak(doc, y, 20 + totalExercises * 6);

    // Day header
    doc.setFillColor(243, 244, 246);
    doc.rect(MARGIN, y - 4, CONTENT_WIDTH, 8, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(109, 40, 217);
    doc.text(`${day.day} - ${day.focus}`, MARGIN + 2, y + 1);
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`${day.estimatedDuration} min`, MARGIN + CONTENT_WIDTH - 20, y + 1);
    y += 8;

    // Table header
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text('Exercise', MARGIN + 2, y);
    doc.text('Sets', MARGIN + 72, y);
    doc.text('Reps', MARGIN + 88, y);
    doc.text('Rest', MARGIN + 108, y);
    doc.text('Tempo', MARGIN + 128, y);
    doc.text('Notes', MARGIN + 148, y);
    y += 1;
    doc.setDrawColor(229, 231, 235);
    doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
    y += 4;

    const printExercises = (exercises: typeof day.mainWorkout, label?: string) => {
      if (label) {
        y = checkPageBreak(doc, y, 6);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(107, 114, 128);
        doc.text(label, MARGIN + 2, y);
        y += 4;
      }
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      for (const ex of exercises) {
        y = checkPageBreak(doc, y, 5);
        const name = ex.name.length > 28 ? ex.name.slice(0, 25) + '...' : ex.name;
        doc.text(name, MARGIN + 2, y);
        doc.text(String(ex.sets), MARGIN + 72, y);
        doc.text(ex.reps, MARGIN + 88, y);
        doc.text(ex.rest, MARGIN + 108, y);
        doc.text(ex.tempo || '-', MARGIN + 128, y);
        const notes = ex.notes || '-';
        const truncNotes = notes.length > 15 ? notes.slice(0, 12) + '...' : notes;
        doc.text(truncNotes, MARGIN + 148, y);
        y += 5;
      }
    };

    printExercises(day.warmup, 'Warmup');
    printExercises(day.mainWorkout, 'Main Workout');
    printExercises(day.cooldown, 'Cooldown');
    y += 4;
  }

  // Modifications
  if (workoutPlan.modifications.length > 0) {
    y = checkPageBreak(doc, y, 10 + workoutPlan.modifications.length * 5);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text('Modifications', MARGIN, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(146, 64, 14);
    for (const mod of workoutPlan.modifications) {
      y = checkPageBreak(doc, y, 5);
      const lines = doc.splitTextToSize(`• ${mod}`, CONTENT_WIDTH - 4);
      doc.text(lines, MARGIN + 2, y);
      y += lines.length * 4 + 2;
    }
    y += 4;
  }

  // --- Nutrition Plan ---
  y = checkPageBreak(doc, y, 60);
  y += 4;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Nutrition Plan', MARGIN, y);
  y += 10;

  // Macro summary boxes
  const boxW = (CONTENT_WIDTH - 12) / 4;
  const macros = [
    { label: 'Calories', value: String(nutritionPlan.dailyTargets.calories), color: [238, 242, 255] as [number, number, number] },
    { label: 'Protein', value: `${nutritionPlan.dailyTargets.protein}g`, color: [254, 242, 242] as [number, number, number] },
    { label: 'Carbs', value: `${nutritionPlan.dailyTargets.carbs}g`, color: [254, 252, 232] as [number, number, number] },
    { label: 'Fats', value: `${nutritionPlan.dailyTargets.fats}g`, color: [240, 253, 244] as [number, number, number] },
  ];

  for (let i = 0; i < macros.length; i++) {
    const x = MARGIN + i * (boxW + 4);
    doc.setFillColor(macros[i].color[0], macros[i].color[1], macros[i].color[2]);
    doc.roundedRect(x, y, boxW, 18, 2, 2, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(macros[i].value, x + boxW / 2, y + 9, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(macros[i].label, x + boxW / 2, y + 15, { align: 'center' });
  }
  y += 26;

  // Timing
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(107, 114, 128);
  doc.text(nutritionPlan.timing, MARGIN, y);
  y += 7;

  // Meal structure
  const mealLabels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    pre_workout: 'Pre-Workout',
    post_workout: 'Post-Workout',
  };

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Meal Structure', MARGIN, y);
  y += 7;

  for (const meal of nutritionPlan.mealStructure) {
    y = checkPageBreak(doc, y, 12 + meal.options.length * 4.5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(mealLabels[meal.meal] || meal.meal, MARGIN + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.text(`${meal.macros.calories} cal | P: ${meal.macros.protein}g | C: ${meal.macros.carbs}g | F: ${meal.macros.fats}g`, MARGIN + 40, y);
    y += 5;

    doc.setFontSize(8);
    doc.setTextColor(75, 85, 99);
    const mealDescLines = doc.splitTextToSize(meal.description, CONTENT_WIDTH - 4);
    doc.text(mealDescLines, MARGIN + 2, y);
    y += mealDescLines.length * 3.5 + 2;

    for (const option of meal.options) {
      y = checkPageBreak(doc, y, 4.5);
      doc.text(`  - ${option}`, MARGIN + 4, y);
      y += 4;
    }
    y += 3;
  }

  // Nutrition notes
  if (nutritionPlan.notes.length > 0) {
    y = checkPageBreak(doc, y, 10 + nutritionPlan.notes.length * 5);
    y += 2;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Nutrition Notes', MARGIN, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    for (const note of nutritionPlan.notes) {
      y = checkPageBreak(doc, y, 5);
      const lines = doc.splitTextToSize(`• ${note}`, CONTENT_WIDTH - 4);
      doc.text(lines, MARGIN + 2, y);
      y += lines.length * 4 + 2;
    }
  }

  // Supplements
  if (nutritionPlan.supplements && nutritionPlan.supplements.length > 0) {
    y = checkPageBreak(doc, y, 10 + nutritionPlan.supplements.length * 5);
    y += 4;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Optional Supplements', MARGIN, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    for (const supp of nutritionPlan.supplements) {
      y = checkPageBreak(doc, y, 5);
      doc.text(`• ${supp}`, MARGIN + 2, y);
      y += 4.5;
    }
  }

  // --- Recovery Plan ---
  y = checkPageBreak(doc, y, 40);
  y += 8;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Recovery & Lifestyle', MARGIN, y);
  y += 10;

  // Sleep
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(109, 40, 217);
  doc.text(`Sleep Target: ${recoveryPlan.sleepRecommendation.hours} hours/night`, MARGIN + 2, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  for (const tip of recoveryPlan.sleepRecommendation.tips) {
    y = checkPageBreak(doc, y, 5);
    doc.text(`  - ${tip}`, MARGIN + 4, y);
    y += 4.5;
  }
  y += 4;

  // Rest Days
  y = checkPageBreak(doc, y, 12);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(109, 40, 217);
  doc.text(`Rest Days: ${recoveryPlan.restDays} per week`, MARGIN + 2, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  for (const activity of recoveryPlan.activeRecovery) {
    y = checkPageBreak(doc, y, 5);
    doc.text(`  - ${activity}`, MARGIN + 4, y);
    y += 4.5;
  }
  y += 4;

  // Mobility
  y = checkPageBreak(doc, y, 12);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(109, 40, 217);
  doc.text('Mobility Work', MARGIN + 2, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  for (const item of recoveryPlan.mobilityWork) {
    y = checkPageBreak(doc, y, 5);
    doc.text(`  - ${item}`, MARGIN + 4, y);
    y += 4.5;
  }
  y += 4;

  // Stress Management
  y = checkPageBreak(doc, y, 12);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(109, 40, 217);
  doc.text('Stress Management', MARGIN + 2, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  for (const item of recoveryPlan.stressManagement) {
    y = checkPageBreak(doc, y, 5);
    const lines = doc.splitTextToSize(`  - ${item}`, CONTENT_WIDTH - 8);
    doc.text(lines, MARGIN + 4, y);
    y += lines.length * 4.5;
  }

  // --- Footer Disclaimer ---
  y = checkPageBreak(doc, y, 30);
  y += 8;
  doc.setDrawColor(229, 231, 235);
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
  y += 6;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(156, 163, 175);
  const disclaimer = 'Disclaimer: This plan was generated by AI and is for informational purposes only. It is not medical advice. Consult a qualified healthcare professional before starting any new exercise or nutrition program.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, CONTENT_WIDTH);
  doc.text(disclaimerLines, MARGIN, y);

  // Save
  doc.save(`FitAI-Plan-${new Date().toISOString().split('T')[0]}.pdf`);
}
