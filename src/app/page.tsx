"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import enData from "@/lib/locales/en.json";
import arData from "@/lib/locales/ar.json";
import {
  ChevronDown,
  ChevronRight,
  Home,
  LogOut,
  MessageCircle,
  Star,
  User,
} from "lucide-react";
import LanguagePicker from "@/components/LanguagePicker";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import StatusBadge from "@/components/StatusBadge";
import CategoryCircle from "@/components/CategoryCircle";
import ComparisonBarChart from "@/components/ComparisonBarChart";
import TeacherSurveyBarChart from "@/components/TeacherSurveyBarChart";
import { getScores, getTeacherSurveys } from "@/lib/appwrite";
import { Score } from "@/types";
import {
  QUICK_SUMMARY_TEXT,
  TeacherSurvey,
  TeacherSurveyCategory,
  type ProcessedAssessmentData,
  getSkillLabels,
} from "@/utils/data";

const defaultLevels = {
  beginner: 0,
  growth: 0,
  expert: 0,
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [selectedZone, setSelectedZone] = useState("irbid");
  const [selectedSchool, setSelectedSchool] = useState("School 1");
  const [selectedGrade, setSelectedGrade] = useState("grade1");
  const [selectedSection, setSelectedSection] = useState("a");
  const [selectedAssessment, setSelectedAssessment] = useState<
    "child" | "teacher_report" | "teacher_survey" | "parent"
  >("teacher_report");
  const [showQuickSummary, setShowQuickSummary] = useState(true);
  const [showOverallInsights, setShowOverallInsights] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [preTestData, setPreTestData] = useState<ProcessedAssessmentData>({
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
  });
  const [postTestData, setPostTestData] =
    useState<ProcessedAssessmentData | null>(null);
  const [hasPostTest, setHasPostTest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Teacher Survey State
  const [aggregatedPreSurvey, setAggregatedPreSurvey] =
    useState<TeacherSurveyCategory | null>(null);
  const [aggregatedPostSurvey, setAggregatedPostSurvey] =
    useState<TeacherSurveyCategory | null>(null);
  const [latestPostTestType, setLatestPostTestType] = useState<string>("");

  const data: any = i18n.language === "ar" ? arData : enData;

  const schools = data.zonesToSchools[selectedZone] || [];
  const gradeOptions = [data.grades.grade1];
  const sectionOptions = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
  ];
  const assessments = [
    t("teacher_report"),
    t("child"),
    t("teacher_survey"),
    t("parent"),
  ];

  // Helper function to aggregate teacher survey data from all schools
  const aggregateTeacherSurveyData = (
    testData: Record<string, TeacherSurveyCategory>
  ): TeacherSurveyCategory => {
    const aggregated: TeacherSurveyCategory = {
      sel_importance_belief: {},
      sel_incorporation_frequency: {},
      sel_confidence_level: {},
      sel_performance_frequency: {},
      disciplinary_issues_frequency: {},
      student_safety_respect_agreement: {},
      student_self_awareness_management: {},
      tilli_curriculum_confidence: {},
    };

    Object.values(testData).forEach((schoolData) => {
      Object.keys(aggregated).forEach((skill) => {
        const skillKey = skill as keyof TeacherSurveyCategory;
        const schoolSkillData = schoolData[skillKey];

        Object.keys(schoolSkillData).forEach((responseKey) => {
          if (!aggregated[skillKey][responseKey]) {
            aggregated[skillKey][responseKey] = 0;
          }
          aggregated[skillKey][responseKey] += schoolSkillData[responseKey];
        });
      });
    });

    return aggregated;
  };

  useEffect(() => {
    const fetchAssessmentData = async () => {
      setLoading(true);
      setError(null);

      if (selectedAssessment === "teacher_survey") {
        try {
          const data: TeacherSurvey = await getTeacherSurveys();

          if (data.preTest && Object.keys(data.preTest).length > 0) {
            const aggPre = aggregateTeacherSurveyData(data.preTest);
            setAggregatedPreSurvey(aggPre);
          }

          let latestPost: TeacherSurveyCategory | null = null;
          let latestType = "";

          if (
            data.post36WeekTest &&
            Object.keys(data.post36WeekTest).length > 0
          ) {
            latestPost = aggregateTeacherSurveyData(data.post36WeekTest);
            latestType = "36-Week Post Test";
          } else if (
            data.post12WeekTest &&
            Object.keys(data.post12WeekTest).length > 0
          ) {
            latestPost = aggregateTeacherSurveyData(data.post12WeekTest);
            latestType = "12-Week Post Test";
          } else if (data.postTest && Object.keys(data.postTest).length > 0) {
            latestPost = aggregateTeacherSurveyData(data.postTest);
            latestType = "Post Test";
          }

          setAggregatedPostSurvey(latestPost);
          setLatestPostTestType(latestType);
        } catch (err) {
          console.error("Error fetching teacher survey data:", err);
          setError("Failed to load teacher survey data");
        }
        setLoading(false);
        return;
      }

      try {
        const data: Score[] = await getScores({
          school: selectedSchool,
          grade: selectedGrade,
          section: selectedSection,
          zone: selectedZone,
          assessment: selectedAssessment as
            | "child"
            | "teacher_report"
            | "parent",
        });

        const preData = data.find((item) => item.testType === "PRE");
        const postData = data.find((item) => item.testType === "POST");

        if (preData) {
          const distributions = preData.category_level_distributions;
          setPreTestData({
            overall: preData.overall_level_distribution || defaultLevels,
            selfAwareness: distributions?.self_awareness || defaultLevels,
            selfManagement: distributions?.social_management || defaultLevels,
            socialAwareness: distributions?.social_awareness || defaultLevels,
            relationshipSkills:
              distributions?.relationship_skills || defaultLevels,
            responsibleDecisionMaking:
              distributions?.responsible_decision_making || defaultLevels,
            metacognition: distributions?.metacognition || defaultLevels,
            empathy: distributions?.empathy || defaultLevels,
            criticalThinking: distributions?.critical_thinking || defaultLevels,
            totalStudents: preData.total_students || 0,
          });
        }

        if (postData) {
          const distributions = postData.category_level_distributions;
          setPostTestData({
            overall: postData.overall_level_distribution || defaultLevels,
            selfManagement: distributions?.social_management || defaultLevels,
            socialAwareness: distributions?.social_awareness || defaultLevels,
            relationshipSkills:
              distributions?.relationship_skills || defaultLevels,
            responsibleDecisionMaking:
              distributions?.responsible_decision_making || defaultLevels,
            metacognition: distributions?.metacognition || defaultLevels,
            empathy: distributions?.empathy || defaultLevels,
            criticalThinking: distributions?.critical_thinking || defaultLevels,
            selfAwareness: distributions?.self_awareness || defaultLevels,
            totalStudents: postData.total_students || 0,
          });
          setHasPostTest(true);
        } else {
          setPostTestData(null);
          setHasPostTest(false);
        }
      } catch (err) {
        console.error("Error fetching assessment data:", err);
        setError("Failed to load assessment data");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [
    selectedZone,
    selectedSection,
    selectedGrade,
    selectedSchool,
    selectedAssessment,
  ]);

  const getAggregatedData = (
    preData: { beginner: number; growth: number; expert: number },
    postData: { beginner: number; growth: number; expert: number } | undefined
  ) => {
    if (postData && hasPostTest) {
      return {
        beginner: preData.beginner + postData.beginner,
        growth: preData.growth + postData.growth,
        expert: preData.expert + postData.expert,
      };
    }
    return preData;
  };

  const overallData = getAggregatedData(
    preTestData.overall,
    postTestData?.overall
  );
  const selfAwarenessData = getAggregatedData(
    preTestData.selfAwareness,
    postTestData?.selfAwareness
  );
  const selfManagementData = getAggregatedData(
    preTestData.selfManagement,
    postTestData?.selfManagement
  );
  const socialAwarenessData = getAggregatedData(
    preTestData.socialAwareness,
    postTestData?.socialAwareness
  );
  const relationshipSkillsData = getAggregatedData(
    preTestData.relationshipSkills,
    postTestData?.relationshipSkills
  );
  const responsibleDecisionMakingData = getAggregatedData(
    preTestData.responsibleDecisionMaking,
    postTestData?.responsibleDecisionMaking
  );
  const metacognitionData = getAggregatedData(
    preTestData.metacognition,
    postTestData?.metacognition
  );
  const empathyData = getAggregatedData(
    preTestData.empathy,
    postTestData?.empathy
  );
  const criticalThinkingData = getAggregatedData(
    preTestData.criticalThinking,
    postTestData?.criticalThinking
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-primary-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <header className="w-full bg-[#82A4DE] shadow-sm border-b flex items-center justify-between px-4 py-2 sm:px-6">
            <div className="flex items-center">
              <Image
                src="/images/logo/logo.png"
                alt="Tilli Assessment Logo"
                width={40}
                height={20}
                priority
                className="h-6 w-auto object-contain"
              />
              <span className="ml-3 text-white font-medium text-lg">
                {t("dashboard.title")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <LanguagePicker />
              {user && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-white">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {user.name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </header>
        </div>

        <div className="bg-white px-4 py-4 border-b shadow-sm">
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("zone")}
                  </label>
                </div>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
                >
                  {Object.keys(data.zones).map((zone: string) => (
                    <option key={zone} value={zone}>
                      {data.zones[zone]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("section")}
                  </label>
                </div>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
                >
                  {sectionOptions.map((section: string) => (
                    <option key={section} value={section}>
                      {t(`sections.${section}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("school")}
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
              >
                {schools.map((school: string) => (
                  <option key={school} value={school}>
                    {data.schools[school]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("grade")}
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
              >
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("data.assessment")}
            </label>
            <select
              value={selectedAssessment}
              onChange={(e) =>
                setSelectedAssessment(
                  e.target.value as
                    | "child"
                    | "teacher_report"
                    | "teacher_survey"
                    | "parent"
                )
              }
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
            >
              {Object.entries(assessments).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-4 py-4 space-y-6">
          <section id="data-section" className="space-y-6">
            {loading && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-gray-600">
                    {t("data.loading")}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {selectedAssessment !== "teacher_survey" && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-medium text-primary-700">
                    {t("data.quickSummary")}
                  </h2>
                  <button
                    onClick={() => setShowQuickSummary(!showQuickSummary)}
                    className="text-primary-700 hover:text-primary-700"
                  >
                    {showQuickSummary ? t("common.hide") : t("common.show")}
                  </button>
                </div>
                {showQuickSummary && (
                  <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {QUICK_SUMMARY_TEXT}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedAssessment === "teacher_survey" && aggregatedPreSurvey && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-primary-700 mb-2">
                    Teacher Survey Results
                  </h2>
                  <p className="text-sm text-gray-600">
                    Comparing Pre-Test{" "}
                    {aggregatedPostSurvey && `to ${latestPostTestType}`}
                  </p>
                </div>

                <div className="space-y-8">
                  {Object.keys(aggregatedPreSurvey).map((skillKey) => {
                    const skill = skillKey as keyof TeacherSurveyCategory;
                    const preData = aggregatedPreSurvey[skill];
                    const postData = aggregatedPostSurvey?.[skill] || {};
                    const labels = getSkillLabels(skill);
                    const displayName = t(`survey.${skill}.title`);
                    const description = t(`survey.${skill}.description`);

                    return (
                      <div key={skill} className="bg-gray-50 rounded-lg p-4">
                        <TeacherSurveyBarChart
                          preData={preData}
                          postData={postData}
                          labels={labels}
                          skillName={displayName}
                          skillDescription={description}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedAssessment !== "teacher_survey" && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-primary-700 mb-4">
                  {t("data.classesProgress")}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 font-medium text-gray-700">
                          Grade
                        </th>
                        <th className="text-left py-2 px-2 font-medium text-gray-700">
                          {t("data.totalStudents")}
                        </th>
                        <th className="text-left py-2 px-2 font-medium text-gray-700">
                          {t("data.assessmentEntries")}
                        </th>
                        <th className="text-left py-2 px-2 font-medium text-gray-700">
                          {t("data.status")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const totalStudents = 76;
                        const entries = 72;

                        const getStatus = (
                          total: number,
                          completed: number
                        ) => {
                          if (completed === 0) return "pending";
                          if (completed === total) return "completed";
                          return "ongoing";
                        };

                        const status = getStatus(totalStudents, entries);

                        return (
                          <tr className="border-b border-gray-100">
                            <td className="py-3 px-2 font-medium text-gray-900">
                              Grade 1
                            </td>
                            <td className="py-3 px-2 text-gray-600">
                              {totalStudents}
                            </td>
                            <td className="py-3 px-2 text-gray-600">
                              {entries}
                            </td>
                            <td className="py-2">
                              <StatusBadge status={status} />
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedAssessment !== "teacher_survey" && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-primary-700 mb-4">
                  {t("data.classAssessmentInsights")}
                </h2>

                <div className="mb-6">
                  <button
                    onClick={() => setShowOverallInsights(!showOverallInsights)}
                    className="flex items-center gap-2 text-primary-600 font-medium mb-3"
                  >
                    {showOverallInsights ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    {t("data.overall")}:
                  </button>
                  {showOverallInsights && (
                    <div className="ml-6 space-y-4">
                      <p className="text-gray-600 text-sm mb-4">
                        {t("data.overallDescription")}
                      </p>
                      <p className="text-gray-700 font-medium">
                        {t("data.totalStudentsOutOf", {
                          count: hasPostTest
                            ? preTestData.totalStudents +
                              postTestData!.totalStudents
                            : preTestData.totalStudents,
                        })}
                        :
                      </p>

                      <div className="flex gap-4">
                        <CategoryCircle
                          category="beginner"
                          count={overallData.beginner}
                          size="md"
                        />
                        <CategoryCircle
                          category="learner"
                          count={overallData.growth}
                          size="md"
                        />
                        <CategoryCircle
                          category="expert"
                          count={overallData.expert}
                          size="md"
                        />
                      </div>

                      {hasPostTest && (
                        <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-600 mb-4">
                            See how your students are doing in the{" "}
                            <strong>2 categories</strong>:
                          </p>
                          <ComparisonBarChart
                            preData={preTestData.overall}
                            postData={postTestData!.overall}
                          />
                        </div>
                      )}

                      <button className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-xl text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors">
                        <Star className="w-4 h-4 text-primary-500" />
                        {t("data.whatDoesThisMean")}
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-2 text-primary-600 font-medium mb-3"
                  >
                    {showDetails ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    {t("data.details")}:
                  </button>
                  {showDetails && (
                    <div className="ml-6 space-y-6">
                      <p className="text-gray-600 text-sm mb-4">
                        {t("data.detailsDescription")}
                      </p>
                      <p className="text-gray-700 font-medium">
                        {t("data.selSkillCategories")}
                      </p>

                      <div className="space-y-8">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-4 text-lg">
                            {t("data.selfAwareness.title")}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4">
                            {t("data.selfAwareness.description")}
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            <CategoryCircle
                              category="beginner"
                              count={selfAwarenessData.beginner}
                              size="md"
                            />
                            <CategoryCircle
                              category="learner"
                              count={selfAwarenessData.growth}
                              size="md"
                            />
                            <CategoryCircle
                              category="expert"
                              count={selfAwarenessData.expert}
                              size="md"
                            />
                          </div>
                          {hasPostTest && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                              <ComparisonBarChart
                                preData={preTestData.selfAwareness}
                                postData={postTestData!.selfAwareness}
                              />
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-4 text-lg">
                            {t("data.selfManagement.title")}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4">
                            {t("data.selfManagement.description")}
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            <CategoryCircle
                              category="beginner"
                              count={selfManagementData.beginner}
                              size="md"
                            />
                            <CategoryCircle
                              category="learner"
                              count={selfManagementData.growth}
                              size="md"
                            />
                            <CategoryCircle
                              category="expert"
                              count={selfManagementData.expert}
                              size="md"
                            />
                          </div>
                          {hasPostTest && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                              <ComparisonBarChart
                                preData={preTestData.selfManagement}
                                postData={postTestData!.selfManagement}
                              />
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-4 text-lg">
                            {t("data.socialAwareness.title")}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4">
                            {t("data.socialAwareness.description")}
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            <CategoryCircle
                              category="beginner"
                              count={socialAwarenessData.beginner}
                              size="md"
                            />
                            <CategoryCircle
                              category="learner"
                              count={socialAwarenessData.growth}
                              size="md"
                            />
                            <CategoryCircle
                              category="expert"
                              count={socialAwarenessData.expert}
                              size="md"
                            />
                          </div>
                          {hasPostTest && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                              <ComparisonBarChart
                                preData={preTestData.socialAwareness}
                                postData={postTestData!.socialAwareness}
                              />
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-4 text-lg">
                            {t("data.relationshipSkills.title")}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4">
                            {t("data.relationshipSkills.description")}
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            <CategoryCircle
                              category="beginner"
                              count={relationshipSkillsData.beginner}
                              size="md"
                            />
                            <CategoryCircle
                              category="learner"
                              count={relationshipSkillsData.growth}
                              size="md"
                            />
                            <CategoryCircle
                              category="expert"
                              count={relationshipSkillsData.expert}
                              size="md"
                            />
                          </div>
                          {hasPostTest && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                              <ComparisonBarChart
                                preData={preTestData.relationshipSkills}
                                postData={postTestData!.relationshipSkills}
                              />
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-4 text-lg">
                            {t("data.responsibleDecisionMaking.title")}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4">
                            {t("data.responsibleDecisionMaking.description")}
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            <CategoryCircle
                              category="beginner"
                              count={responsibleDecisionMakingData.beginner}
                              size="md"
                            />
                            <CategoryCircle
                              category="learner"
                              count={responsibleDecisionMakingData.growth}
                              size="md"
                            />
                            <CategoryCircle
                              category="expert"
                              count={responsibleDecisionMakingData.expert}
                              size="md"
                            />
                          </div>
                          {hasPostTest && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                              <ComparisonBarChart
                                preData={preTestData.responsibleDecisionMaking}
                                postData={
                                  postTestData!.responsibleDecisionMaking
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-4 text-lg">
                            {t("data.metacognition.title")}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4">
                            {t("data.metacognition.description")}
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            <CategoryCircle
                              category="beginner"
                              count={metacognitionData.beginner}
                              size="md"
                            />
                            <CategoryCircle
                              category="learner"
                              count={metacognitionData.growth}
                              size="md"
                            />
                            <CategoryCircle
                              category="expert"
                              count={metacognitionData.expert}
                              size="md"
                            />
                          </div>
                          {hasPostTest && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                              <ComparisonBarChart
                                preData={preTestData.metacognition}
                                postData={postTestData!.metacognition}
                              />
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-4 text-lg">
                            {t("data.empathy.title")}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4">
                            {t("data.empathy.description")}
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            <CategoryCircle
                              category="beginner"
                              count={empathyData.beginner}
                              size="md"
                            />
                            <CategoryCircle
                              category="learner"
                              count={empathyData.growth}
                              size="md"
                            />
                            <CategoryCircle
                              category="expert"
                              count={empathyData.expert}
                              size="md"
                            />
                          </div>
                          {hasPostTest && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                              <ComparisonBarChart
                                preData={preTestData.empathy}
                                postData={postTestData!.empathy}
                              />
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-4 text-lg">
                            {t("data.criticalThinking.title")}
                          </h4>
                          <p className="text-gray-600 text-sm mb-4">
                            {t("data.criticalThinking.description")}
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            <CategoryCircle
                              category="beginner"
                              count={criticalThinkingData.beginner}
                              size="md"
                            />
                            <CategoryCircle
                              category="learner"
                              count={criticalThinkingData.growth}
                              size="md"
                            />
                            <CategoryCircle
                              category="expert"
                              count={criticalThinkingData.expert}
                              size="md"
                            />
                          </div>
                          {hasPostTest && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                              <ComparisonBarChart
                                preData={preTestData.criticalThinking}
                                postData={postTestData!.criticalThinking}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <button className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-xl text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors">
                        <Star className="w-4 h-4 text-primary-500" />
                        {t("data.howCanIMakeItBetter")}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">
                    {t("data.understandingCategories")}:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-[#EF4444]">
                          {t("beginner")}:
                        </strong>{" "}
                        {t("data.beginnerDescription")}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-[#3B82F6]">
                          {t("learner")}:
                        </strong>{" "}
                        {t("data.growthDescription")}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>
                        <strong className="text-[#22C55E]">
                          {t("expert")}:
                        </strong>{" "}
                        {t("data.expertDescription")}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 py-2">
            <Home className="w-6 h-6 text-primary-600" />
            <span className="text-xs text-primary-600 font-medium">
              {t("common.home")}
            </span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 py-2">
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">{t("common.aiChat")}</span>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
