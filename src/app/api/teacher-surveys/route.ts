import { NextResponse } from "next/server";
import { getTeacherSurveys } from "@/lib/appwrite";

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
  try {
    const surveys = await getTeacherSurveys();
    return NextResponse.json(surveys, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching teacher surveys:", error);
    return NextResponse.json(
      { error: "Failed to fetch teacher surveys", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

