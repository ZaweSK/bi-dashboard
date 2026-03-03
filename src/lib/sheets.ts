import { google } from "googleapis";

/** All configured spreadsheets in index order. */
export const SPREADSHEET_IDS: string[] = [
  process.env.GOOGLE_SPREADSHEET_ID!,
  process.env.GOOGLE_SPREADSHEET_ID_2!,
];

/** Resolve a 0-based tab index to a spreadsheet ID. Throws on out-of-range. */
export function resolveSpreadsheetId(index: number): string {
  const id = SPREADSHEET_IDS[index];
  if (!id) throw new Error(`No spreadsheet configured for index ${index}`);
  return id;
}

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
 * Fetch metadata about a spreadsheet and all its tabs.
 */
export async function getSpreadsheetInfo(
  spreadsheetId: string
): Promise<{ title: string; sheets: SheetMeta[] }> {
  const response = await getClient().spreadsheets.get({ spreadsheetId });

  const title = response.data.properties?.title ?? "Untitled";
  const sheets: SheetMeta[] =
    response.data.sheets?.map((s) => ({
      title: s.properties?.title ?? "",
      sheetId: s.properties?.sheetId ?? 0,
      rowCount: s.properties?.gridProperties?.rowCount ?? 0,
      columnCount: s.properties?.gridProperties?.columnCount ?? 0,
    })) ?? [];

  return { title, sheets };
}

/**
 * Fetch a range from a specific spreadsheet.
 * @param spreadsheetId - The Google Spreadsheet ID
 * @param range - e.g. "Sheet1!A1:Z100" or "Sheet1" for all data
 */
export async function getSheetData(
  spreadsheetId: string,
  range: string
): Promise<string[][]> {
  const response = await getClient().spreadsheets.values.get({
    spreadsheetId,
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
