export interface StudentAssessmentRecord {
  $id?: string;
  school: string;
  grade: string;
  section: string;
  studentName: string;
  parentQuestionnaire: string;
  assessment: string;
  createdAt: string;
}

export interface TeacherAssessmentRecord {
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
