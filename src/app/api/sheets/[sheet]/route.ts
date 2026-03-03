import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, resolveSpreadsheetId } from "@/lib/sheets";

export const revalidate = 60;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sheet: string }> }
) {
  try {
    const { sheet } = await params;
    const { searchParams } = new URL(req.url);
    const index = parseInt(searchParams.get("spreadsheet") ?? "0", 10) || 0;
    const spreadsheetId = resolveSpreadsheetId(index);

    const sheetName = decodeURIComponent(sheet);
    const rows = await getSheetData(spreadsheetId, `${sheetName}!A:Z`);
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
