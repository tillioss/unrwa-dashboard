export interface AssessmentData {
  id: string;
  name: string;
  status: "completed" | "ongoing" | "pending";
}

export interface ClassData {
  id: string;
  name: string;
  preTest: "completed" | "ongoing" | "pending";
  postTest: "completed" | "ongoing" | "pending";
}

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

interface TeacherSurveyCategory {
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

export const GRADES = ["All Grades", "Grade 1"];

export const SECTIONS = ["All Sections", "A", "B", "C"];

export const ASSESSMENTS = {
  teacher_report: "Assessment 1: Teacher Report",
  child: "Assessment 2: Student Self-Assessment",
  teacher_survey: "Assessment 3: Teacher Survey",
};

export const QUICK_SUMMARY_TEXT = `Assessment 1 shows strong progress in self-awareness skills across Grade 1-3 students. Pre-test completion rate is 80% with post-test ongoing. Key improvement areas identified in emotional regulation and social skills development.`;
