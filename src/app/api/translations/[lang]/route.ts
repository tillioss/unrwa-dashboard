import ar from "@/lib/locales/ar.json";
import en from "@/lib/locales/en.json";
import { NextResponse } from "next/server";

const translations: Record<string, any> = { en, ar };

// CORS headers for third-party integrations
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;

  if (!translations[lang]) {
    return NextResponse.json(
      { error: "Language not supported" },
      { status: 404, headers: corsHeaders }
    );
  }

  return NextResponse.json(translations[lang], { headers: corsHeaders });
}
