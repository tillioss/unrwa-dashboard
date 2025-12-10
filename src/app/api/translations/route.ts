import { NextResponse } from "next/server";

const supportedLanguages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
  },
];

// CORS headers for third-party integrations
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({ languages: supportedLanguages }, { headers: corsHeaders });
}

