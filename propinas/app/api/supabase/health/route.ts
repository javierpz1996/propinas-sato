import { NextResponse } from "next/server";

export async function GET() {
  const requiredEnv = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ] as const;

  const missing = requiredEnv.filter((k) => !process.env[k]);

  return NextResponse.json({
    ok: missing.length === 0,
    missing,
  });
}

