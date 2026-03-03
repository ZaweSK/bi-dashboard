import { NextResponse } from "next/server";
import { getSpreadsheetInfo } from "@/lib/sheets";

export const revalidate = 60;

export async function GET() {
  try {
    const info = await getSpreadsheetInfo();
    return NextResponse.json(info);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
