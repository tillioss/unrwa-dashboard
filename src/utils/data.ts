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

// Utility function to process assessment data and calculate categories
export const processAssessmentData = (
  assessments: any[],
  assessmentType?: string
): ProcessedAssessmentData => {
  if (!assessments || assessments.length === 0) {
    return {
      overall: { beginner: 0, growth: 0, expert: 0 },
      selfAwareness: { beginner: 0, growth: 0, expert: 0 },
      selfManagement: { beginner: 0, growth: 0, expert: 0 },
      socialAwareness: { beginner: 0, growth: 0, expert: 0 },
      relationshipSkills: { beginner: 0, growth: 0, expert: 0 },
      responsibleDecisionMaking: { beginner: 0, growth: 0, expert: 0 },
      metacognition: { beginner: 0, growth: 0, expert: 0 },
      empathy: { beginner: 0, growth: 0, expert: 0 },
      criticalThinking: { beginner: 0, growth: 0, expert: 0 },
      totalStudents: 0,
    };
  }

  let beginnerCount = 0;
  let growthCount = 0;
  let expertCount = 0;
  let selfAwarenessBeginner = 0;
  let selfAwarenessGrowth = 0;
  let selfAwarenessExpert = 0;
  let selfManagementBeginner = 0;
  let selfManagementGrowth = 0;
  let selfManagementExpert = 0;
  let socialAwarenessBeginner = 0;
  let socialAwarenessGrowth = 0;
  let socialAwarenessExpert = 0;
  let relationshipSkillsBeginner = 0;
  let relationshipSkillsGrowth = 0;
  let relationshipSkillsExpert = 0;
  let responsibleDecisionMakingBeginner = 0;
  let responsibleDecisionMakingGrowth = 0;
  let responsibleDecisionMakingExpert = 0;
  let metacognitionBeginner = 0;
  let metacognitionGrowth = 0;
  let metacognitionExpert = 0;
  let empathyBeginner = 0;
  let empathyGrowth = 0;
  let empathyExpert = 0;
  let criticalThinkingBeginner = 0;
  let criticalThinkingGrowth = 0;
  let criticalThinkingExpert = 0;

  assessments.forEach((record) => {
    try {
      // Parse the assessment data
      let assessmentData;
      if (typeof record.assessment === "string") {
        try {
          assessmentData = JSON.parse(record.assessment);
        } catch {
          assessmentData = { rawData: record.assessment };
        }
      } else {
        assessmentData = record.assessment;
      }

      // Determine assessment type and calculate scores
      let totalScore = 0;
      let categoryAverages: any = {};

      if (assessmentData && typeof assessmentData === "object") {
        // Check if it's Assessment 1 (array format) or Assessment 2 (object format)
        const isAssessment1 = Array.isArray(assessmentData);

        if (isAssessment1) {
          // Assessment 1: Teacher Report - Array format
          const questionScores = calculateAssessment1Scores(assessmentData);
          totalScore = questionScores.total;
          categoryAverages =
            calculateAssessment1CategoryAverages(questionScores);
        } else {
          // Assessment 2: Student Self-Assessment - Object format
          const questionScores = calculateAssessment2Scores(assessmentData);
          totalScore = questionScores.total;
          categoryAverages =
            calculateAssessment2CategoryAverages(questionScores);
        }
      }

      // Categorize overall performance based on assessment type
      const totalQuestions = Array.isArray(assessmentData) ? 11 : 12; // Assessment 1 has 11 questions, Assessment 2 has 12
      const totalAverage = totalScore / totalQuestions;

      // Use different categorization ranges based on assessment type
      const isAssessment1 = Array.isArray(assessmentData);
      if (isAssessment1) {
        // Assessment 1 categorization: 0–1.0 → Beginner, 1.1–2.4 → Learner, 2.5–3.0 → Expert
        if (totalAverage <= 1.0) {
          beginnerCount++;
        } else if (totalAverage <= 2.4) {
          growthCount++;
        } else {
          expertCount++;
        }
      } else {
        // Assessment 2 categorization: 0–1.5 → Beginner, 1.6–2.4 → Learner, 2.5–3.0 → Expert
        if (totalAverage <= 1.5) {
          beginnerCount++;
        } else if (totalAverage <= 2.4) {
          growthCount++;
        } else {
          expertCount++;
        }
      }

      // Categorize each SEL skill category based on assessment type
      const categorizeByAssessmentType = (
        average: number,
        beginnerFn: () => void,
        growthFn: () => void,
        expertFn: () => void
      ) => {
        if (isAssessment1) {
          // Assessment 1 ranges
          if (average <= 1.0) {
            beginnerFn();
          } else if (average <= 2.4) {
            growthFn();
          } else {
            expertFn();
          }
        } else {
          // Assessment 2 ranges
          if (average <= 1.5) {
            beginnerFn();
          } else if (average <= 2.4) {
            growthFn();
          } else {
            expertFn();
          }
        }
      };

      // Categorize each SEL skill category
      categorizeByAssessmentType(
        categoryAverages.selfAwareness,
        () => selfAwarenessBeginner++,
        () => selfAwarenessGrowth++,
        () => selfAwarenessExpert++
      );

      categorizeByAssessmentType(
        categoryAverages.selfManagement,
        () => selfManagementBeginner++,
        () => selfManagementGrowth++,
        () => selfManagementExpert++
      );

      categorizeByAssessmentType(
        categoryAverages.socialAwareness,
        () => socialAwarenessBeginner++,
        () => socialAwarenessGrowth++,
        () => socialAwarenessExpert++
      );

      categorizeByAssessmentType(
        categoryAverages.relationshipSkills,
        () => relationshipSkillsBeginner++,
        () => relationshipSkillsGrowth++,
        () => relationshipSkillsExpert++
      );

      categorizeByAssessmentType(
        categoryAverages.responsibleDecisionMaking,
        () => responsibleDecisionMakingBeginner++,
        () => responsibleDecisionMakingGrowth++,
        () => responsibleDecisionMakingExpert++
      );

      categorizeByAssessmentType(
        categoryAverages.metacognition,
        () => metacognitionBeginner++,
        () => metacognitionGrowth++,
        () => metacognitionExpert++
      );

      categorizeByAssessmentType(
        categoryAverages.empathy,
        () => empathyBeginner++,
        () => empathyGrowth++,
        () => empathyExpert++
      );

      categorizeByAssessmentType(
        categoryAverages.criticalThinking,
        () => criticalThinkingBeginner++,
        () => criticalThinkingGrowth++,
        () => criticalThinkingExpert++
      );
    } catch (error) {
      console.error("Error processing assessment data:", error);
      // Default to beginner category if processing fails
      beginnerCount++;
      selfAwarenessBeginner++;
      selfManagementBeginner++;
      socialAwarenessBeginner++;
      relationshipSkillsBeginner++;
      responsibleDecisionMakingBeginner++;
      metacognitionBeginner++;
      empathyBeginner++;
      criticalThinkingBeginner++;
    }
  });

  return {
    overall: {
      beginner: beginnerCount,
      growth: growthCount,
      expert: expertCount,
    },
    selfAwareness: {
      beginner: selfAwarenessBeginner,
      growth: selfAwarenessGrowth,
      expert: selfAwarenessExpert,
    },
    selfManagement: {
      beginner: selfManagementBeginner,
      growth: selfManagementGrowth,
      expert: selfManagementExpert,
    },
    socialAwareness: {
      beginner: socialAwarenessBeginner,
      growth: socialAwarenessGrowth,
      expert: socialAwarenessExpert,
    },
    relationshipSkills: {
      beginner: relationshipSkillsBeginner,
      growth: relationshipSkillsGrowth,
      expert: relationshipSkillsExpert,
    },
    responsibleDecisionMaking: {
      beginner: responsibleDecisionMakingBeginner,
      growth: responsibleDecisionMakingGrowth,
      expert: responsibleDecisionMakingExpert,
    },
    metacognition: {
      beginner: metacognitionBeginner,
      growth: metacognitionGrowth,
      expert: metacognitionExpert,
    },
    empathy: {
      beginner: empathyBeginner,
      growth: empathyGrowth,
      expert: empathyExpert,
    },
    criticalThinking: {
      beginner: criticalThinkingBeginner,
      growth: criticalThinkingGrowth,
      expert: criticalThinkingExpert,
    },
    totalStudents: assessments.length,
  };
};

// Function to calculate scores for Assessment 1 (Teacher Report) - Array format
const calculateAssessment1Scores = (assessmentData: string[]) => {
  const questionScores: any = {};

  // Assessment 1 scoring: 1=0, 2=1, 3=2, 4=3
  const scoringMatrix = {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3,
  };

  // Calculate scores for each question (0-10, 11 questions total)
  for (let i = 0; i < assessmentData.length; i++) {
    const answer = assessmentData[i];
    const score = scoringMatrix[answer as keyof typeof scoringMatrix] || 0;
    questionScores[i.toString()] = score;
  }

  // Calculate total score
  const total = Object.values(questionScores).reduce(
    (sum: any, score: any) => sum + score,
    0
  );

  return {
    ...questionScores,
    total,
  };
};

// Function to calculate category averages for Assessment 1
const calculateAssessment1CategoryAverages = (questionScores: any) => {
  // Assessment 1 SEL skill categories mapping
  const categoryMapping = {
    selfAwareness: [0, 1], // Q1, Q2
    selfManagement: [7, 8], // Q8, Q9
    socialAwareness: [4, 5], // Q5, Q6
    relationshipSkills: [6], // Q7
    responsibleDecisionMaking: [8], // Q9
    metacognition: [3, 9, 10], // Q4, Q10, Q11
    empathy: [4, 5, 6], // Q5, Q6, Q7
    criticalThinking: [2, 3, 8], // Q3, Q4, Q9
  };

  const categoryAverages: any = {};

  // Calculate average for each category
  Object.entries(categoryMapping).forEach(([category, questionIndices]) => {
    let categoryScore = 0;
    questionIndices.forEach((questionIndex) => {
      const questionKey = questionIndex.toString();
      if (questionScores[questionKey] !== undefined) {
        categoryScore += questionScores[questionKey];
      }
    });
    categoryAverages[category] = categoryScore / questionIndices.length;
  });

  return categoryAverages;
};

// Function to calculate scores for Assessment 2 (Student Self-Assessment) - Object format
const calculateAssessment2Scores = (assessmentData: any) => {
  const questionScores: any = {};

  // Assessment 2 scoring matrix based on the provided rules
  const scoringMatrix = {
    "0": (answer: string) => (answer === "3" ? 3 : 1), // Q1: answer 3 gets 3 marks rest 1 mark
    "1": (answer: string) => (["1", "2", "3"].includes(answer) ? 3 : 1), // Q2: answers 1,2,3 gets 3 marks rest 1 mark
    "2": (answer: string) => (answer === "1" ? 3 : answer === "3" ? 2 : 0), // Q3: answer 1 gets 3 marks, answer 3 gets 2 marks rest gets 0
    "3": (answer: string) => (answer === "1" ? 3 : 0), // Q4: answer 1 gets 3 marks rest 0 mark
    "4": (answer: string) => (["1", "2"].includes(answer) ? 3 : 0), // Q5: answers 1,2 gets 3 marks rest 0 mark
    "5": (answer: string) => (answer === "1" ? 3 : 0), // Q6: answer 1 gets 3 marks rest 0 mark
    "6": (answer: string) => (answer === "1" ? 3 : answer === "2" ? 2 : 0), // Q7: answer 1 gets 3 marks, answer 2 gets 2 marks rest gets 0
    "7": (answer: string) => (answer === "1" ? 3 : answer === "2" ? 2 : 0), // Q8: answer 1 gets 3 marks, answer 2 gets 2 marks rest gets 0
    "8": (answer: string) => (answer === "1" ? 3 : 0), // Q9: answer 1 gets 3 marks rest 0 mark
    "9": (answer: string) => (answer === "1" ? 3 : 0), // Q10: answer 1 gets 3 marks rest 0 mark
    "10": (answer: string) => (["1", "2", "3", "4"].includes(answer) ? 3 : 0), // Q11: answers 1,2,3,4 gets 3 marks rest 0 mark
    "11": (answer: string) => (["1", "2", "3", "4"].includes(answer) ? 3 : 0), // Q12: answers 1,2,3,4 gets 3 marks rest 0 mark
  };

  // Calculate scores for each question
  for (let i = 0; i <= 11; i++) {
    const questionKey = i.toString();
    const answer = assessmentData[questionKey];

    if (answer && scoringMatrix[questionKey as keyof typeof scoringMatrix]) {
      const score =
        scoringMatrix[questionKey as keyof typeof scoringMatrix](answer);
      questionScores[questionKey] = score;
    } else {
      questionScores[questionKey] = 0;
    }
  }

  // Calculate total score
  const total = Object.values(questionScores).reduce(
    (sum: any, score: any) => sum + score,
    0
  );

  return {
    ...questionScores,
    total,
  };
};

// Function to calculate category averages for Assessment 2
const calculateAssessment2CategoryAverages = (questionScores: any) => {
  // Assessment 2 SEL skill categories mapping
  const categoryMapping = {
    selfAwareness: [0, 1, 10], // Q1, Q2, Q11
    selfManagement: [2, 8, 9], // Q3, Q9, Q10
    socialAwareness: [0, 5], // Q1, Q6
    relationshipSkills: [4, 6], // Q5, Q7
    responsibleDecisionMaking: [7, 9], // Q8, Q10
    metacognition: [2, 3, 10, 11], // Q3, Q4, Q11, Q12
    empathy: [4, 5, 6], // Q5, Q6, Q7
    criticalThinking: [3, 7], // Q4, Q8
  };

  const categoryAverages: any = {};

  // Calculate average for each category
  Object.entries(categoryMapping).forEach(([category, questionIndices]) => {
    let categoryScore = 0;
    questionIndices.forEach((questionIndex) => {
      const questionKey = questionIndex.toString();
      if (questionScores[questionKey] !== undefined) {
        categoryScore += questionScores[questionKey];
      }
    });
    categoryAverages[category] = categoryScore / questionIndices.length;
  });

  return categoryAverages;
};

// Helper function to generate a score from assessment data (fallback)
const generateScoreFromData = (data: any): number => {
  // This is a placeholder implementation
  // In a real scenario, you would implement logic based on the actual data structure

  // Try to find numeric values in the data
  const numericValues: number[] = [];

  const extractNumbers = (obj: any) => {
    if (typeof obj === "number") {
      numericValues.push(obj);
    } else if (typeof obj === "string") {
      const num = parseFloat(obj);
      if (!isNaN(num)) {
        numericValues.push(num);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(extractNumbers);
    } else if (typeof obj === "object" && obj !== null) {
      Object.values(obj).forEach(extractNumbers);
    }
  };

  extractNumbers(data);

  if (numericValues.length > 0) {
    // Calculate average of all numeric values
    const average =
      numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
    // Normalize to 0-100 range
    return Math.min(100, Math.max(0, average * 10));
  }

  // Fallback to a random score if no numeric data found
  return Math.random() * 100;
};

export const GRADES = [
  "all grades",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
];

export const ASSESSMENTS = [
  "Assessment 1: Teacher Report",
  "Assessment 2: Student Self-Assessment",
];

export const CLASS_DATA: ClassData[] = [
  { id: "1", name: "Grade 1", preTest: "pending", postTest: "ongoing" },
  { id: "2", name: "Grade 2", preTest: "completed", postTest: "ongoing" },
  { id: "3", name: "Grade 3", preTest: "completed", postTest: "completed" },
  { id: "4", name: "Grade 4", preTest: "completed", postTest: "completed" },
  { id: "5", name: "Grade 5", preTest: "completed", postTest: "completed" },
];

export const OVERALL_DATA: CategoryData = {
  beginner: 14,
  growth: 25,
  expert: 11,
};

export const SELF_AWARENESS_DATA: CategoryData = {
  beginner: 15,
  growth: 20,
  expert: 15,
};

export const SELF_MANAGEMENT_DATA: CategoryData = {
  beginner: 14,
  growth: 30,
  expert: 6,
};

export const QUICK_SUMMARY_TEXT = `Assessment 1 shows strong progress in self-awareness skills across Grade 1-3 students. Pre-test completion rate is 80% with post-test ongoing. Key improvement areas identified in emotional regulation and social skills development.`;
