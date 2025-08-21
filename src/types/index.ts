export interface Student {
  studentName: string;
  emoji: string;
  q1Answer: string;
  q2Answer: string;
  q3Answer: string;
  q4Answer: string;
  q5Answer: string;
  q6Answer: string;
  q7Answer: string;
  q8Answer: string;
  q9Answer: string;
  q10Answer: string;
  q11Answer: string;
}

export interface RubricScanResponse {
  teacherName: string;
  school: string;
  grade: string;
  date: string;
  students: Student[];
}

export interface RatingLevels {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
}

export interface Criterion {
  id: string;
  text: string;
  example: string;
}

export interface SkillCategory {
  categoryName: string;
  criteria: Criterion[];
}

export interface RubricData {
  ratingLevels: RatingLevels;
  skillCategories: SkillCategory[];
}

export interface AssessmentRecord {
  $id?: string;
  teacherId: string;
  teacherName: string;
  school: string;
  grade: string;
  section: string;
  studentName: string;
  assessment: string;
  isManualEntry: boolean;
  createdAt: string;
}
