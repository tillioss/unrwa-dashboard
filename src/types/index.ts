export interface LevelDistribution {
  beginner: number;
  growth: number;
  expert: number;
}

export interface Score {
  $id: string;
  school: string;
  grade: string;
  assessment: "child" | "teacher_report" | "parent";
  total_students: number;
  testType: "PRE" | "POST";
  overall_level_distribution: LevelDistribution;
  category_level_distributions: {
    self_awareness: LevelDistribution;
    social_management: LevelDistribution;
    social_awareness: LevelDistribution;
    relationship_skills: LevelDistribution;
    responsible_decision_making: LevelDistribution;
    metacognition: LevelDistribution;
    empathy: LevelDistribution;
    critical_thinking: LevelDistribution;
  };
}

export type SchoolSections = Record<string, number>;

export type SchoolsData = Record<string, SchoolSections>;
