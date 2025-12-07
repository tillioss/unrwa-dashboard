import ar from "@/lib/locales/ar.json";
import en from "@/lib/locales/en.json";
import { NextResponse } from "next/server";

const translations: Record<string, any> = { en, ar };

export async function GET(
  req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;

  if (!translations[lang]) {
    return NextResponse.json(
      { error: "Language not supported" },
      { status: 404 }
    );
  }

  return NextResponse.json(translations[lang]);
}
