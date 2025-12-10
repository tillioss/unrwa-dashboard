import { NextResponse } from "next/server";

// CORS headers for third-party integrations
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  // Sample test data matching the API structure
  const sampleScores = [
    {
      $id: "test-123456",
      school: "azmi_mufti_boys_p1",
      grade: "grade1",
      assessment: "child",
      total_students: 25,
      testType: "PRE",
      overall_level_distribution: {
        beginner: 8,
        growth: 12,
        expert: 5,
      },
      category_level_distributions: {
        self_awareness: {
          beginner: 5,
          growth: 15,
          expert: 5,
        },
        social_management: {
          beginner: 6,
          growth: 14,
          expert: 5,
        },
        social_awareness: {
          beginner: 7,
          growth: 13,
          expert: 5,
        },
        relationship_skills: {
          beginner: 8,
          growth: 12,
          expert: 5,
        },
        responsible_decision_making: {
          beginner: 6,
          growth: 14,
          expert: 5,
        },
        metacognition: {
          beginner: 7,
          growth: 13,
          expert: 5,
        },
        empathy: {
          beginner: 5,
          growth: 15,
          expert: 5,
        },
        critical_thinking: {
          beginner: 6,
          growth: 14,
          expert: 5,
        },
      },
    },
  ];

  return NextResponse.json({ scores: sampleScores }, { headers: corsHeaders });
}

