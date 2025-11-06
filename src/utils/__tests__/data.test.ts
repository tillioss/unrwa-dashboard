import {
  sel_importance_belief,
  sel_incorporation_frequency,
  sel_confidence_level,
  sel_performance_frequency,
  disciplinary_issues_frequency,
  student_safety_respect_agreement,
  student_self_awareness_management,
  tilli_curriculum_confidence,
  getSkillLabels,
  SKILL_DISPLAY_NAMES,
  ASSESSMENTS,
  GRADES,
  QUICK_SUMMARY_TEXT,
} from "../data";

describe("data utilities", () => {
  describe("label mappings", () => {
    it("has correct sel_importance_belief labels", () => {
      expect(sel_importance_belief["1"]).toBe("Strongly Disagree");
      expect(sel_importance_belief["2"]).toBe("Disagree");
      expect(sel_importance_belief["3"]).toBe("Neutral");
      expect(sel_importance_belief["4"]).toBe("Agree");
      expect(sel_importance_belief["5"]).toBe("Strongly Agree");
    });

    it("has correct sel_incorporation_frequency labels", () => {
      expect(sel_incorporation_frequency["1"]).toBe("Never");
      expect(sel_incorporation_frequency["2"]).toBe("Rarely");
      expect(sel_incorporation_frequency["3"]).toBe("Sometimes");
      expect(sel_incorporation_frequency["4"]).toBe("Often");
      expect(sel_incorporation_frequency["5"]).toBe("Always");
    });

    it("has correct sel_confidence_level labels", () => {
      expect(sel_confidence_level["1"]).toBe("Not at all Confident");
      expect(sel_confidence_level["2"]).toBe("Slightly Confident");
      expect(sel_confidence_level["3"]).toBe("Moderately Confident");
      expect(sel_confidence_level["4"]).toBe("Confident");
      expect(sel_confidence_level["5"]).toBe("Very Confident");
    });

    it("has correct disciplinary_issues_frequency labels", () => {
      expect(disciplinary_issues_frequency["1"]).toBe(
        "More than 10 times a day"
      );
      expect(disciplinary_issues_frequency["2"]).toBe(
        "Between 5-10 times a day"
      );
      expect(disciplinary_issues_frequency["3"]).toBe(
        "Less than 5 times a day"
      );
      expect(disciplinary_issues_frequency["4"]).toBe("A few times a week");
      expect(disciplinary_issues_frequency["5"]).toBe("A few times a month");
      expect(disciplinary_issues_frequency["6"]).toBe("Never");
    });

    it("has correct student_self_awareness_management labels", () => {
      expect(student_self_awareness_management["1"]).toBe("Not at all");
      expect(student_self_awareness_management["2"]).toBe("To a small extent");
      expect(student_self_awareness_management["3"]).toBe(
        "To a moderate extent"
      );
      expect(student_self_awareness_management["4"]).toBe("To a large extent");
      expect(student_self_awareness_management["5"]).toBe("To a great extent");
    });
  });

  describe("getSkillLabels", () => {
    it("returns correct labels for sel_importance_belief", () => {
      const labels = getSkillLabels("sel_importance_belief");
      expect(labels).toEqual(sel_importance_belief);
    });

    it("returns correct labels for sel_incorporation_frequency", () => {
      const labels = getSkillLabels("sel_incorporation_frequency");
      expect(labels).toEqual(sel_incorporation_frequency);
    });

    it("returns correct labels for sel_confidence_level", () => {
      const labels = getSkillLabels("sel_confidence_level");
      expect(labels).toEqual(sel_confidence_level);
    });

    it("returns correct labels for sel_performance_frequency", () => {
      const labels = getSkillLabels("sel_performance_frequency");
      expect(labels).toEqual(sel_performance_frequency);
    });

    it("returns correct labels for disciplinary_issues_frequency", () => {
      const labels = getSkillLabels("disciplinary_issues_frequency");
      expect(labels).toEqual(disciplinary_issues_frequency);
    });

    it("returns correct labels for student_safety_respect_agreement", () => {
      const labels = getSkillLabels("student_safety_respect_agreement");
      expect(labels).toEqual(student_safety_respect_agreement);
    });

    it("returns correct labels for student_self_awareness_management", () => {
      const labels = getSkillLabels("student_self_awareness_management");
      expect(labels).toEqual(student_self_awareness_management);
    });

    it("returns correct labels for tilli_curriculum_confidence", () => {
      const labels = getSkillLabels("tilli_curriculum_confidence");
      expect(labels).toEqual(tilli_curriculum_confidence);
    });
  });

  describe("SKILL_DISPLAY_NAMES", () => {
    it("has display names for all skills", () => {
      expect(SKILL_DISPLAY_NAMES.sel_importance_belief).toBeDefined();
      expect(SKILL_DISPLAY_NAMES.sel_incorporation_frequency).toBeDefined();
      expect(SKILL_DISPLAY_NAMES.sel_confidence_level).toBeDefined();
      expect(SKILL_DISPLAY_NAMES.sel_performance_frequency).toBeDefined();
      expect(SKILL_DISPLAY_NAMES.disciplinary_issues_frequency).toBeDefined();
      expect(
        SKILL_DISPLAY_NAMES.student_safety_respect_agreement
      ).toBeDefined();
      expect(
        SKILL_DISPLAY_NAMES.student_self_awareness_management
      ).toBeDefined();
      expect(SKILL_DISPLAY_NAMES.tilli_curriculum_confidence).toBeDefined();
    });

    it("has meaningful display names", () => {
      expect(SKILL_DISPLAY_NAMES.sel_importance_belief).toContain(
        "Social-Emotional Learning"
      );
      expect(SKILL_DISPLAY_NAMES.sel_incorporation_frequency).toContain(
        "incorporated"
      );
    });
  });

  describe("ASSESSMENTS", () => {
    it("has all assessment types", () => {
      expect(ASSESSMENTS.teacher_report).toBeDefined();
      expect(ASSESSMENTS.child).toBeDefined();
      expect(ASSESSMENTS.teacher_survey).toBeDefined();
      expect(ASSESSMENTS.parent).toBeDefined();
    });

    it("has correct assessment names", () => {
      expect(ASSESSMENTS.teacher_report).toBe("Assessment 1: Teacher Report");
      expect(ASSESSMENTS.child).toBe("Assessment 2: Student Self-Assessment");
      expect(ASSESSMENTS.teacher_survey).toBe("Assessment 3: Teacher Survey");
      expect(ASSESSMENTS.parent).toBe("Assessment 4: Parent Questionnaire");
    });
  });

  describe("GRADES", () => {
    it("has grade options", () => {
      expect(GRADES).toContain("All Grades");
      expect(GRADES).toContain("Grade 1");
    });
  });

  describe("QUICK_SUMMARY_TEXT", () => {
    it("has summary text", () => {
      expect(QUICK_SUMMARY_TEXT).toBeDefined();
      expect(QUICK_SUMMARY_TEXT.length).toBeGreaterThan(0);
    });
  });
});
