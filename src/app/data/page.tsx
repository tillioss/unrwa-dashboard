"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import {
  CLASS_DATA,
  OVERALL_DATA,
  SELF_AWARENESS_DATA,
  SELF_MANAGEMENT_DATA,
} from "@/utils/data";
import CategoryCircle from "@/components/CategoryCircle";

export default function DataViewPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [selectedGrade, setSelectedGrade] = useState("all");

  const timeframes = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  const grades = ["all", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];

  const getCompletionRate = () => {
    const total = CLASS_DATA.length * 2; // pre and post tests
    const completed = CLASS_DATA.reduce((acc, classItem) => {
      return (
        acc +
        (classItem.preTest === "completed" ? 1 : 0) +
        (classItem.postTest === "completed" ? 1 : 0)
      );
    }, 0);
    return Math.round((completed / total) * 100);
  };

  const getAverageProgress = () => {
    const totalStudents =
      OVERALL_DATA.beginner + OVERALL_DATA.growth + OVERALL_DATA.expert;
    const growthAndExpert = OVERALL_DATA.growth + OVERALL_DATA.expert;
    return Math.round((growthAndExpert / totalStudents) * 100);
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Data Analytics
              </h1>
              <p className="text-sm text-gray-600">
                Detailed insights and metrics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white px-4 py-4 border-b shadow-sm">
        <div className="flex gap-3">
          <div className="flex-1">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
            >
              {timeframes.map((timeframe) => (
                <option key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 shadow-sm"
            >
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade === "all" ? "All Grades" : grade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getCompletionRate()}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getAverageProgress()}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">50</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Assessments</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Overall Performance Distribution
          </h2>
          <div className="flex justify-center gap-8">
            <CategoryCircle
              category="beginner"
              count={OVERALL_DATA.beginner}
              size="lg"
            />
            <CategoryCircle
              category="growth"
              count={OVERALL_DATA.growth}
              size="lg"
            />
            <CategoryCircle
              category="expert"
              count={OVERALL_DATA.expert}
              size="lg"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Total:{" "}
              {OVERALL_DATA.beginner +
                OVERALL_DATA.growth +
                OVERALL_DATA.expert}{" "}
              students
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Skill Area Breakdown
          </h2>

          {/* Self Awareness */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Self Awareness</h3>
            <div className="flex justify-center gap-6">
              <CategoryCircle
                category="beginner"
                count={SELF_AWARENESS_DATA.beginner}
                size="md"
              />
              <CategoryCircle
                category="growth"
                count={SELF_AWARENESS_DATA.growth}
                size="md"
              />
              <CategoryCircle
                category="expert"
                count={SELF_AWARENESS_DATA.expert}
                size="md"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Total:{" "}
                {SELF_AWARENESS_DATA.beginner +
                  SELF_AWARENESS_DATA.growth +
                  SELF_AWARENESS_DATA.expert}{" "}
                students
              </p>
            </div>
          </div>

          {/* Self Management */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Self Management</h3>
            <div className="flex justify-center gap-6">
              <CategoryCircle
                category="beginner"
                count={SELF_MANAGEMENT_DATA.beginner}
                size="md"
              />
              <CategoryCircle
                category="growth"
                count={SELF_MANAGEMENT_DATA.growth}
                size="md"
              />
              <CategoryCircle
                category="expert"
                count={SELF_MANAGEMENT_DATA.expert}
                size="md"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Total:{" "}
                {SELF_MANAGEMENT_DATA.beginner +
                  SELF_MANAGEMENT_DATA.growth +
                  SELF_MANAGEMENT_DATA.expert}{" "}
                students
              </p>
            </div>
          </div>
        </div>

        {/* Assessment Status Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Assessment Status by Class
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-medium text-gray-700">
                    Class
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-gray-700">
                    Pre Test
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-gray-700">
                    Post Test
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-gray-700">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {CLASS_DATA.map((classItem) => {
                  const preTestCompleted = classItem.preTest === "completed";
                  const postTestCompleted = classItem.postTest === "completed";
                  const progress =
                    preTestCompleted && postTestCompleted
                      ? 100
                      : preTestCompleted
                      ? 50
                      : classItem.preTest === "ongoing" ||
                        classItem.postTest === "ongoing"
                      ? 25
                      : 0;

                  return (
                    <tr key={classItem.id} className="border-b border-gray-100">
                      <td className="py-3 px-2 font-medium text-gray-900">
                        {classItem.name}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            classItem.preTest === "completed"
                              ? "bg-success-100 text-success-600"
                              : classItem.preTest === "ongoing"
                              ? "bg-primary-100 text-primary-600"
                              : "bg-secondary-100 text-secondary-600"
                          }`}
                        >
                          {classItem.preTest.charAt(0).toUpperCase() +
                            classItem.preTest.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            classItem.postTest === "completed"
                              ? "bg-success-100 text-success-600"
                              : classItem.postTest === "ongoing"
                              ? "bg-primary-100 text-primary-600"
                              : "bg-secondary-100 text-secondary-600"
                          }`}
                        >
                          {classItem.postTest.charAt(0).toUpperCase() +
                            classItem.postTest.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-8">
                            {progress}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
