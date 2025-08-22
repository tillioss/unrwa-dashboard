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
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import CategoryCircle from "@/components/CategoryCircle";
import Link from "next/link";
import {
  getTeacherStudentAssessments,
  getParentStudentAssessments,
} from "@/lib/appwrite";
import { TeacherAssessmentRecord, StudentAssessmentRecord } from "@/types";
import {
  GRADES,
  SECTIONS,
  ASSESSMENTS,
  OVERALL_DATA,
  SELF_AWARENESS_DATA,
  SELF_MANAGEMENT_DATA,
  QUICK_SUMMARY_TEXT,
  processAssessmentData,
  type ProcessedAssessmentData,
} from "@/utils/data";

export default function Dashboard() {
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [selectedAssessment, setSelectedAssessment] = useState(
    "Assessment 1: Teacher Report"
  );
  const [showQuickSummary, setShowQuickSummary] = useState(true);
  const [showOverallInsights, setShowOverallInsights] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<"classes" | "assessments">(
    "classes"
  );

  // New state for fetched data
  const [assessmentData, setAssessmentData] = useState<
    TeacherAssessmentRecord[] | StudentAssessmentRecord[]
  >([]);
  const [processedData, setProcessedData] = useState<ProcessedAssessmentData>({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grades = GRADES;
  const sections = SECTIONS;
  const assessments = ASSESSMENTS;

  useEffect(() => {
    const fetchAssessmentData = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: TeacherAssessmentRecord[] | StudentAssessmentRecord[] = [];

        if (selectedAssessment === "Assessment 1: Teacher Report") {
          if (selectedGrade === "All Grades") {
            // Fetch data for all grades
            const allGradesData = await Promise.all([
              getTeacherStudentAssessments("Grade 1"),
            ]);
            data = allGradesData.flat();
          } else {
            data = await getTeacherStudentAssessments(selectedGrade);
          }
        } else if (
          selectedAssessment === "Assessment 2: Student Self-Assessment"
        ) {
          if (selectedGrade === "All Grades") {
            // Fetch data for all grades
            const allGradesData = await Promise.all([
              getParentStudentAssessments("Grade 1"),
            ]);
            data = allGradesData.flat();
          } else {
            data = await getParentStudentAssessments(selectedGrade);
          }
        } else {
          // For other assessment types, use static data for now
          setProcessedData({
            overall: OVERALL_DATA,
            selfAwareness: SELF_AWARENESS_DATA,
            selfManagement: SELF_MANAGEMENT_DATA,
            socialAwareness: { beginner: 0, growth: 0, expert: 0 },
            relationshipSkills: { beginner: 0, growth: 0, expert: 0 },
            responsibleDecisionMaking: { beginner: 0, growth: 0, expert: 0 },
            metacognition: { beginner: 0, growth: 0, expert: 0 },
            empathy: { beginner: 0, growth: 0, expert: 0 },
            criticalThinking: { beginner: 0, growth: 0, expert: 0 },
            totalStudents:
              OVERALL_DATA.beginner + OVERALL_DATA.growth + OVERALL_DATA.expert,
          });
          setLoading(false);
          return;
        }

        // Filter by section if a specific section is selected
        if (selectedSection !== "All Sections") {
          data = data.filter(
            (record) => record.section === selectedSection
          ) as typeof data;
        }

        setAssessmentData(data);
        // Pass the assessment type to the processing function
        const processed = processAssessmentData(data);
        setProcessedData(processed);
      } catch (err) {
        console.error("Error fetching assessment data:", err);
        setError("Failed to fetch assessment data");
        // Fallback to static data
        setProcessedData({
          overall: OVERALL_DATA,
          selfAwareness: SELF_AWARENESS_DATA,
          selfManagement: SELF_MANAGEMENT_DATA,
          socialAwareness: { beginner: 0, growth: 0, expert: 0 },
          relationshipSkills: { beginner: 0, growth: 0, expert: 0 },
          responsibleDecisionMaking: { beginner: 0, growth: 0, expert: 0 },
          metacognition: { beginner: 0, growth: 0, expert: 0 },
          empathy: { beginner: 0, growth: 0, expert: 0 },
          criticalThinking: { beginner: 0, growth: 0, expert: 0 },
          totalStudents:
            OVERALL_DATA.beginner + OVERALL_DATA.growth + OVERALL_DATA.expert,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [selectedGrade, selectedSection, selectedAssessment]);

  // Use processed data or fallback to static data
  const overallData = processedData.overall;
  const selfAwarenessData = processedData.selfAwareness;
  const selfManagementData = processedData.selfManagement;
  const socialAwarenessData = processedData.socialAwareness;
  const relationshipSkillsData = processedData.relationshipSkills;
  const responsibleDecisionMakingData = processedData.responsibleDecisionMaking;
  const metacognitionData = processedData.metacognition;
  const empathyData = processedData.empathy;
  const criticalThinkingData = processedData.criticalThinking;

  return (
    <div className="min-h-screen bg-primary-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <header className="w-full bg-[#82A4DE] shadow-sm border-b flex items-center px-4 py-2 sm:px-6">
          <Image
            src="/images/logo/logo.png"
            alt="Tilli Assessment Logo"
            width={40}
            height={20}
            priority
            className="h-6 w-auto object-contain"
          />
          <span className="ml-3 text-white font-semibold text-lg">
            Tilli Assessment
          </span>
        </header>
      </div>

      {/* Navigation and Filters */}
      <div className="bg-white px-4 py-4 border-b shadow-sm">
        <div className="space-y-3">
          {/* Dropdowns */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
              >
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assessment
            </label>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
            >
              {assessments.map((assessment) => (
                <option key={assessment} value={assessment}>
                  {assessment}
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
              <span className="ml-3 text-gray-600">
                Loading assessment data...
              </span>
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
            <h2 className="text-lg font-semibold text-primary-700">
              Quick Summary
            </h2>
            <button
              onClick={() => setShowQuickSummary(!showQuickSummary)}
              className="text-primary-700 hover:text-primary-700"
            >
              {showQuickSummary ? "Hide" : "Show"}
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
        {selectedGrade === "All Grades" &&
          selectedSection === "All Sections" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-primary-700 mb-4">
                How your classes are doing
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 font-medium text-gray-700">
                        Section
                      </th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700">
                        Total Students
                      </th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700">
                        Assessment Entries
                      </th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Student counts for Grade 1 sections
                      const sectionStudentCounts = {
                        A: 26,
                        B: 24,
                        C: 26,
                      };

                      // Calculate assessment entries for each section
                      const sectionEntries = {
                        A: assessmentData.filter(
                          (record) => record.section === "A"
                        ).length,
                        B: assessmentData.filter(
                          (record) => record.section === "B"
                        ).length,
                        C: assessmentData.filter(
                          (record) => record.section === "C"
                        ).length,
                      };

                      // Determine status for each section
                      const getSectionStatus = (section: string) => {
                        const totalStudents =
                          sectionStudentCounts[
                            section as keyof typeof sectionStudentCounts
                          ];
                        const entries =
                          sectionEntries[
                            section as keyof typeof sectionEntries
                          ];

                        if (entries === 0) return "pending";
                        if (entries === totalStudents) return "completed";
                        return "ongoing";
                      };

                      return Object.keys(sectionStudentCounts).map(
                        (section) => {
                          const totalStudents =
                            sectionStudentCounts[
                              section as keyof typeof sectionStudentCounts
                            ];
                          const entries =
                            sectionEntries[
                              section as keyof typeof sectionEntries
                            ];
                          const status = getSectionStatus(section);

                          return (
                            <tr
                              key={section}
                              className="border-b border-gray-100"
                            >
                              <td className="py-3 px-2 font-medium text-gray-900">
                                Grade 1 {section}
                              </td>
                              <td className="py-3 px-2 text-gray-600">
                                {totalStudents}
                              </td>
                              <td className="py-3 px-2 text-gray-600">
                                {entries}
                              </td>
                              <td className="py-3 px-2">
                                <StatusBadge status={status} />
                              </td>
                            </tr>
                          );
                        }
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Assessment Insights */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-primary-700 mb-4">
            Class Assessment Insights
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
              Over All:
            </button>
            {showOverallInsights && (
              <div className="ml-6 space-y-4">
                <p className="text-gray-600 text-sm">
                  See how the gist of assessment data
                </p>
                <p className="text-gray-700 font-medium">
                  Total number of (out of {processedData.totalStudents}{" "}
                  students):
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

                <button className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-xl text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors">
                  <Star className="w-4 h-4 text-primary-500" />
                  What does this mean?
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
              Details:
            </button>
            {showDetails && (
              <div className="ml-6 space-y-6">
                <p className="text-gray-600 text-sm">See each category data</p>
                <p className="text-gray-700 font-medium">
                  See how your students are doing in the 8 SEL skill categories:
                </p>

                {/* SEL Skill Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Self Awareness */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Self Awareness
                    </h4>
                    <div className="flex gap-4">
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
                  </div>

                  {/* Self Management */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Self Management
                    </h4>
                    <div className="flex gap-4">
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
                  </div>

                  {/* Social Awareness */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Social Awareness
                    </h4>
                    <div className="flex gap-4">
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
                  </div>

                  {/* Relationship Skills */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Relationship Skills
                    </h4>
                    <div className="flex gap-4">
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
                  </div>

                  {/* Responsible Decision Making */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Responsible Decision Making
                    </h4>
                    <div className="flex gap-4">
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
                  </div>

                  {/* Metacognition */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Metacognition
                    </h4>
                    <div className="flex gap-4">
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
                  </div>

                  {/* Empathy */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Empathy</h4>
                    <div className="flex gap-4">
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
                  </div>

                  {/* Critical Thinking */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Critical Thinking
                    </h4>
                    <div className="flex gap-4">
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
                  </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-xl text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors">
                  <Star className="w-4 h-4 text-primary-500" />
                  How can I make it better?
                </button>
              </div>
            )}
          </div>

          {/* Category Definitions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">
              Understanding the categories:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span>
                  <strong className="text-[#EF4444]">Beginner:</strong> Students
                  who are just starting to learn the concepts.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  <strong className="text-[#3B82F6]">Growth:</strong> Students
                  who are showing improvement and growth in their understanding.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  <strong className="text-[#22C55E]">Expert:</strong> Students
                  who have demonstrated a strong grasp of the concepts and are
                  excelling.
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
            <span className="text-xs text-gray-400 font-medium">Home</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 py-2">
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">AI Chat</span>
          </Link>
          <Link href="/data" className="flex flex-col items-center gap-1 py-2">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <span className="text-xs text-primary-600 font-medium">
              Data View
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
