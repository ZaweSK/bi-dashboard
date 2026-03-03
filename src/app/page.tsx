import {
  getSpreadsheetInfo,
  resolveSpreadsheetId,
  SPREADSHEET_IDS,
  SheetMeta,
} from "@/lib/sheets";
import { SpreadsheetTabs } from "@/components/ui/SpreadsheetTabs";
import { TableIcon } from "lucide-react";

export const revalidate = 60;

interface HomeProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { tab } = await searchParams;
  const activeTab = Math.max(
    0,
    Math.min(
      SPREADSHEET_IDS.length - 1,
      parseInt(tab ?? "0", 10) || 0
    )
  );

  // Fetch all tab titles in parallel for the tab bar
  const tabTitles = await Promise.all(
    SPREADSHEET_IDS.map(async (id, i) => {
      try {
        const info = await getSpreadsheetInfo(id);
        return { index: i, title: info.title };
      } catch {
        return { index: i, title: `Spreadsheet ${i + 1}` };
      }
    })
  );

  // Fetch the active spreadsheet's sheet list
  let sheetList: SheetMeta[] = [];
  let error = "";
  try {
    const spreadsheetId = resolveSpreadsheetId(activeTab);
    const info = await getSpreadsheetInfo(spreadsheetId);
    sheetList = info.sheets;
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Failed to connect to Google Sheets";
  }

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">BI Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {tabTitles[activeTab]?.title}
          </span>
        </p>
      </div>

      <SpreadsheetTabs tabs={tabTitles} activeTab={activeTab} />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold mb-1">Connection error</p>
          <p className="text-sm font-mono">{error}</p>
        </div>
      ) : (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
            {sheetList.length} sheet{sheetList.length !== 1 ? "s" : ""} found
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sheetList.map((sheet) => (
              <SheetCard key={sheet.sheetId} sheet={sheet} activeTab={activeTab} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function SheetCard({ sheet, activeTab }: { sheet: SheetMeta; activeTab: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-md bg-blue-50 p-2">
          <TableIcon className="h-4 w-4 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{sheet.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {sheet.rowCount.toLocaleString()} rows &middot;{" "}
            {sheet.columnCount} columns
          </p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex gap-3 text-xs text-gray-400">
        <a
          href={`/api/sheets/${encodeURIComponent(sheet.title)}?spreadsheet=${activeTab}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition-colors"
        >
          View JSON →
        </a>
      </div>
    </div>
  );
}
