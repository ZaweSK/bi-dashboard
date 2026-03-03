import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 60;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sheet: string }> }
) {
  try {
    const { sheet } = await params;
    const sheetName = decodeURIComponent(sheet);
    const rows = await getSheetData(`${sheetName}!A:Z`);
    const objects = rowsToObjects(rows);
    const headers = rows[0] ?? [];

    return NextResponse.json({
      headers,
      rows: objects,
      total: objects.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
