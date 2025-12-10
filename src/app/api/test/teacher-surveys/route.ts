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
  const sampleSurveys = {
    preTest: {
      "2024-01": {
        sel_importance_belief: {
          "1": 2,
          "2": 5,
          "3": 10,
          "4": 15,
          "5": 8,
        },
        sel_incorporation_frequency: {
          "1": 3,
          "2": 7,
          "3": 12,
          "4": 13,
          "5": 5,
        },
        sel_confidence_level: {
          "1": 1,
          "2": 4,
          "3": 11,
          "4": 16,
          "5": 8,
        },
        sel_performance_frequency: {
          "1": 2,
          "2": 6,
          "3": 13,
          "4": 14,
          "5": 5,
        },
        disciplinary_issues_frequency: {
          "1": 1,
          "2": 3,
          "3": 5,
          "4": 8,
          "5": 12,
          "6": 11,
        },
        student_safety_respect_agreement: {
          "1": 1,
          "2": 3,
          "3": 8,
          "4": 18,
          "5": 10,
        },
        student_self_awareness_management: {
          "1": 2,
          "2": 5,
          "3": 12,
          "4": 15,
          "5": 6,
        },
        tilli_curriculum_confidence: {
          "1": 1,
          "2": 4,
          "3": 10,
          "4": 17,
          "5": 8,
        },
      },
    },
    postTest: {
      "2024-06": {
        sel_importance_belief: {
          "1": 1,
          "2": 3,
          "3": 8,
          "4": 18,
          "5": 10,
        },
        sel_incorporation_frequency: {
          "1": 2,
          "2": 5,
          "3": 10,
          "4": 16,
          "5": 7,
        },
        sel_confidence_level: {
          "1": 0,
          "2": 2,
          "3": 9,
          "4": 19,
          "5": 10,
        },
        sel_performance_frequency: {
          "1": 1,
          "2": 4,
          "3": 11,
          "4": 17,
          "5": 7,
        },
        disciplinary_issues_frequency: {
          "1": 0,
          "2": 2,
          "3": 4,
          "4": 10,
          "5": 14,
          "6": 10,
        },
        student_safety_respect_agreement: {
          "1": 0,
          "2": 2,
          "3": 6,
          "4": 20,
          "5": 12,
        },
        student_self_awareness_management: {
          "1": 1,
          "2": 3,
          "3": 10,
          "4": 18,
          "5": 8,
        },
        tilli_curriculum_confidence: {
          "1": 0,
          "2": 2,
          "3": 8,
          "4": 20,
          "5": 10,
        },
      },
    },
    post12WeekTest: {},
    post36WeekTest: {},
  };

  return NextResponse.json(sampleSurveys, { headers: corsHeaders });
}

