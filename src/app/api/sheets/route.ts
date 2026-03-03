import { NextResponse } from "next/server";
import { getSpreadsheetInfo, resolveSpreadsheetId } from "@/lib/sheets";

export const revalidate = 60;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const index = parseInt(searchParams.get("spreadsheet") ?? "0", 10) || 0;
    const spreadsheetId = resolveSpreadsheetId(index);
    const info = await getSpreadsheetInfo(spreadsheetId);
    return NextResponse.json(info);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
