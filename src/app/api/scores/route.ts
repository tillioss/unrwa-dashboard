import { NextResponse } from "next/server";
import { getAllScores, getScores } from "@/lib/appwrite";

// CORS headers for third-party integrations
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Check if filter parameters are provided
    const school = searchParams.get("school");
    const grade = searchParams.get("grade");
    const assessment = searchParams.get("assessment") as "child" | "teacher_report" | "parent" | null;
    const section = searchParams.get("section");
    const zone = searchParams.get("zone");

    // If all filter parameters are provided, use filtered query
    if (school && grade && assessment && section && zone) {
      const scores = await getScores({
        school,
        grade,
        assessment,
        section,
        zone,
      });
      return NextResponse.json({ scores }, { headers: corsHeaders });
    }

    // Otherwise, return all scores
    const scores = await getAllScores();
    return NextResponse.json({ scores }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json(
      { error: "Failed to fetch scores", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

