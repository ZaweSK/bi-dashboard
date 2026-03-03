import { getSpreadsheetInfo, SheetMeta } from "@/lib/sheets";
import { TableIcon } from "lucide-react";

export const revalidate = 60;

export default async function Home() {
  let title = "";
  let sheetList: SheetMeta[] = [];
  let error = "";

  try {
    const info = await getSpreadsheetInfo();
    title = info.title;
    sheetList = info.sheets;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to connect to Google Sheets";
  }

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">BI Dashboard</h1>
        {title && (
          <p className="text-gray-500 text-sm">
            Connected to:{" "}
            <span className="font-medium text-gray-700">{title}</span>
          </p>
        )}
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold mb-1">Connection error</p>
          <p className="text-sm font-mono">{error}</p>
          <p className="text-sm mt-3 text-red-600">
            Make sure <code className="bg-red-100 px-1 rounded">GOOGLE_API_KEY</code> and{" "}
            <code className="bg-red-100 px-1 rounded">GOOGLE_SPREADSHEET_ID</code> are set in{" "}
            <code className="bg-red-100 px-1 rounded">.env.local</code>.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
            {sheetList.length} sheet{sheetList.length !== 1 ? "s" : ""} found
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sheetList.map((sheet) => (
              <SheetCard key={sheet.sheetId} sheet={sheet} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function SheetCard({ sheet }: { sheet: SheetMeta }) {
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
          href={`/api/sheets/${encodeURIComponent(sheet.title)}`}
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
