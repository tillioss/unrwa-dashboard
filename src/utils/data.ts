export interface CategoryData {
  beginner: number;
  growth: number;
  expert: number;
}

export interface ProcessedAssessmentData {
  overall: CategoryData;
  selfAwareness: CategoryData;
  selfManagement: CategoryData;
  socialAwareness: CategoryData;
  relationshipSkills: CategoryData;
  responsibleDecisionMaking: CategoryData;
  metacognition: CategoryData;
  empathy: CategoryData;
  criticalThinking: CategoryData;
  totalStudents: number;
}

export const sel_importance_belief = {
  "1": "Strongly Disagree",
  "2": "Disagree",
  "3": "Neutral",
  "4": "Agree",
  "5": "Strongly Agree",
};

export const sel_incorporation_frequency = {
  "1": "Never",
  "2": "Rarely",
  "3": "Sometimes",
  "4": "Often",
  "5": "Always",
};

export const sel_confidence_level = {
  "1": "Not at all Confident",
  "2": "Slightly Confident",
  "3": "Moderately Confident",
  "4": "Confident",
  "5": "Very Confident",
};

export const sel_performance_frequency = sel_incorporation_frequency;

export const disciplinary_issues_frequency = {
  "1": "More than 10 times a day",
  "2": "Between 5-10 times a day",
  "3": "Less than 5 times a day",
  "4": "A few times a week",
  "5": "A few times a month",
  "6": "Never",
};

export const student_safety_respect_agreement = sel_importance_belief;

export const student_self_awareness_management = {
  "1": "Not at all",
  "2": "To a small extent",
  "3": "To a moderate extent",
  "4": "To a large extent",
  "5": "To a great extent",
};

export const tilli_curriculum_confidence = sel_confidence_level;

export interface TeacherSurveyCategory {
  sel_importance_belief: Record<string, number>;
  sel_incorporation_frequency: Record<string, number>;
  sel_confidence_level: Record<string, number>;
  sel_performance_frequency: Record<string, number>;
  disciplinary_issues_frequency: Record<string, number>;
  student_safety_respect_agreement: Record<string, number>;
  student_self_awareness_management: Record<string, number>;
  tilli_curriculum_confidence: Record<string, number>;
}

export interface TeacherSurvey {
  preTest: Record<string, TeacherSurveyCategory>;
  postTest: Record<string, TeacherSurveyCategory>;
  post12WeekTest: Record<string, TeacherSurveyCategory>;
  post36WeekTest: Record<string, TeacherSurveyCategory>;
}

// Helper function to get label mapping for each skill
export const getSkillLabels = (
  skillName: keyof TeacherSurveyCategory
): Record<string, string> => {
  const labelMappings: Record<
    keyof TeacherSurveyCategory,
    Record<string, string>
  > = {
    sel_importance_belief: sel_importance_belief,
    sel_incorporation_frequency: sel_incorporation_frequency,
    sel_confidence_level: sel_confidence_level,
    sel_performance_frequency: sel_performance_frequency,
    disciplinary_issues_frequency: disciplinary_issues_frequency,
    student_safety_respect_agreement: student_safety_respect_agreement,
    student_self_awareness_management: student_self_awareness_management,
    tilli_curriculum_confidence: tilli_curriculum_confidence,
  };

  return labelMappings[skillName];
};

export const QUICK_SUMMARY_TEXT = `Assessment 1 shows strong progress in self-awareness skills across Grade 1-3 students. Pre-test completion rate is 80% with post-test ongoing. Key improvement areas identified in emotional regulation and social skills development.`;
