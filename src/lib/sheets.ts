import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

// Lazily create the client so env vars are read at call time, not module load
function getClient() {
  return google.sheets({ version: "v4", auth: process.env.GOOGLE_API_KEY });
}

export interface SheetMeta {
  title: string;
  sheetId: number;
  rowCount: number;
  columnCount: number;
}

/**
 * Fetch metadata about the spreadsheet and all its tabs.
 */
export async function getSpreadsheetInfo(): Promise<{
  title: string;
  sheets: SheetMeta[];
}> {
  const response = await getClient().spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID!,
  });

  const title = response.data.properties?.title ?? "Untitled";
  const sheetList: SheetMeta[] =
    response.data.sheets?.map((s) => ({
      title: s.properties?.title ?? "",
      sheetId: s.properties?.sheetId ?? 0,
      rowCount: s.properties?.gridProperties?.rowCount ?? 0,
      columnCount: s.properties?.gridProperties?.columnCount ?? 0,
    })) ?? [];

  return { title, sheets: sheetList };
}

/**
 * Fetch a range from the configured spreadsheet.
 * @param range - e.g. "Sheet1!A1:Z100" or "Sheet1" for all data
 */
export async function getSheetData(range: string): Promise<string[][]> {
  const response = await getClient().spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID!,
    range,
  });

  return (response.data.values as string[][]) ?? [];
}

/**
 * Convert raw sheet rows into an array of objects using the first row as headers.
 */
export function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length < 2) return [];
  const [headers, ...dataRows] = rows;
  return dataRows.map((row) =>
    Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""]))
  );
}
