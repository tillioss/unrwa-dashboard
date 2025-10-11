"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  MessageCircle,
  BarChart3,
  Star,
  LogOut,
  User,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import CategoryCircle from "@/components/CategoryCircle";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguagePicker from "../../components/LanguagePicker";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import { getScores, getTeacherSurveys } from "@/lib/appwrite";
import { Score } from "@/types";
import {
  ASSESSMENTS,
  QUICK_SUMMARY_TEXT,
  TeacherSurvey,
  type ProcessedAssessmentData,
} from "@/utils/data";
import ComparisonBarChart from "@/components/ComparisonBarChart";

const defaultLevels = {
  beginner: 0,
  growth: 0,
  expert: 0,
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [selectedSchool, setSelectedSchool] = useState("School 1");
  const [selectedGrade, setSelectedGrade] = useState("Grade 1");
  const [selectedAssessment, setSelectedAssessment] = useState<
    "child" | "teacher_report" | "teacher_survey"
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

  const schools = ["School 1", "School 2", "School 3"];
  const grades = ["Grade 1"];
  const assessments = ASSESSMENTS;

  useEffect(() => {
    const fetchAssessmentData = async () => {
      setLoading(true);
      setError(null);

      if (selectedAssessment === "teacher_survey") {
        const data: TeacherSurvey = await getTeacherSurveys();
        console.log(data);
        setLoading(false);
        return;
      }

      const data: Score[] = await getScores({
        school: selectedSchool,
        grade: selectedGrade,
        assessment: selectedAssessment,
      });

      // Separate PRE and POST data
      const preData = data.find((item) => item.testType === "PRE");
      const postData = data.find((item) => item.testType === "POST");

      // Process PRE data
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

      // Process POST data if available
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

      setLoading(false);
    };
    fetchAssessmentData();
  }, [selectedGrade, selectedSchool, selectedAssessment]);

  // Calculate aggregated data: sum of PRE and POST if both available, otherwise use available data
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
      <div className="min-h-screen bg-primary-50 pb-20">
        {/* Header */}
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

        {/* Navigation and Filters */}
        <div className="bg-white px-4 py-4 border-b shadow-sm">
          <div className="space-y-3">
            {/* Dropdowns */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
                >
                  {schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
                >
                  {grades.map((grade) => (
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
                    e.target.value as "child" | "teacher_report"
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
        </div>

        {/* Main Content */}
        <div className="px-4 py-4 space-y-6">
          {/* Loading and Error States */}
          {loading && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600">{t("data.loading")}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Quick Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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

          {/* Assessment Tracker */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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

                    const getStatus = (total: number, completed: number) => {
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
                        <td className="py-3 px-2 text-gray-600">{entries}</td>
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

          {/* Assessment Insights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-primary-700 mb-4">
              {t("data.classAssessmentInsights")}
            </h2>

            {/* Overall Section */}
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
                  <p className="text-gray-600 text-sm">
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
                      category="growth"
                      count={overallData.growth}
                      size="md"
                    />
                    <CategoryCircle
                      category="expert"
                      count={overallData.expert}
                      size="md"
                    />
                  </div>

                  {/* Show comparison chart if POST data is available */}
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

            {/* Details Section */}
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
                  <p className="text-gray-600 text-sm">
                    {t("data.detailsDescription")}
                  </p>
                  <p className="text-gray-700 font-medium">
                    {t("data.selSkillCategories")}
                  </p>

                  {/* SEL Skill Categories Grid */}
                  <div className="space-y-8">
                    {/* Self Awareness */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 text-lg">
                        {t("data.selfAwareness")}
                      </h4>
                      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                        <CategoryCircle
                          category="beginner"
                          count={selfAwarenessData.beginner}
                          size="md"
                        />
                        <CategoryCircle
                          category="growth"
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

                    {/* Self Management */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 text-lg">
                        {t("data.selfManagement")}
                      </h4>
                      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                        <CategoryCircle
                          category="beginner"
                          count={selfManagementData.beginner}
                          size="md"
                        />
                        <CategoryCircle
                          category="growth"
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

                    {/* Social Awareness */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 text-lg">
                        {t("data.socialAwareness")}
                      </h4>
                      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                        <CategoryCircle
                          category="beginner"
                          count={socialAwarenessData.beginner}
                          size="md"
                        />
                        <CategoryCircle
                          category="growth"
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

                    {/* Relationship Skills */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 text-lg">
                        {t("data.relationshipSkills")}
                      </h4>
                      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                        <CategoryCircle
                          category="beginner"
                          count={relationshipSkillsData.beginner}
                          size="md"
                        />
                        <CategoryCircle
                          category="growth"
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

                    {/* Responsible Decision Making */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 text-lg">
                        {t("data.responsibleDecisionMaking")}
                      </h4>
                      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                        <CategoryCircle
                          category="beginner"
                          count={responsibleDecisionMakingData.beginner}
                          size="md"
                        />
                        <CategoryCircle
                          category="growth"
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
                            postData={postTestData!.responsibleDecisionMaking}
                          />
                        </div>
                      )}
                    </div>

                    {/* Metacognition */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 text-lg">
                        {t("data.metacognition")}
                      </h4>
                      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                        <CategoryCircle
                          category="beginner"
                          count={metacognitionData.beginner}
                          size="md"
                        />
                        <CategoryCircle
                          category="growth"
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

                    {/* Empathy */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 text-lg">
                        {t("data.empathy")}
                      </h4>
                      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                        <CategoryCircle
                          category="beginner"
                          count={empathyData.beginner}
                          size="md"
                        />
                        <CategoryCircle
                          category="growth"
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

                    {/* Critical Thinking */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-4 text-lg">
                        {t("data.criticalThinking")}
                      </h4>
                      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                        <CategoryCircle
                          category="beginner"
                          count={criticalThinkingData.beginner}
                          size="md"
                        />
                        <CategoryCircle
                          category="growth"
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

            {/* Category Definitions */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">
                {t("data.understandingCategories")}:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span>
                    <strong className="text-[#EF4444]">
                      {t("data.beginner")}:
                    </strong>{" "}
                    {t("data.beginnerDescription")}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>
                    <strong className="text-[#3B82F6]">
                      {t("data.growth")}:
                    </strong>{" "}
                    {t("data.growthDescription")}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>
                    <strong className="text-[#22C55E]">
                      {t("data.expert")}:
                    </strong>{" "}
                    {t("data.expertDescription")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
          <div className="flex justify-around">
            <Link href="/" className="flex flex-col items-center gap-1 py-2">
              <Home className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400 font-medium">
                {t("common.home")}
              </span>
            </Link>
            <Link
              href="/chat"
              className="flex flex-col items-center gap-1 py-2"
            >
              <MessageCircle className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">
                {t("common.aiChat")}
              </span>
            </Link>
            <Link
              href="/data"
              className="flex flex-col items-center gap-1 py-2"
            >
              <BarChart3 className="w-6 h-6 text-primary-600" />
              <span className="text-xs text-primary-600 font-medium">
                {t("common.dataView")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
