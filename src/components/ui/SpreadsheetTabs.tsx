import { cn } from "@/lib/utils";

interface Tab {
  index: number;
  title: string;
}

interface SpreadsheetTabsProps {
  tabs: Tab[];
  activeTab: number;
}

export function SpreadsheetTabs({ tabs, activeTab }: SpreadsheetTabsProps) {
  return (
    <div className="flex gap-1 border-b border-border mb-6">
      {tabs.map((tab) => {
        const isActive = tab.index === activeTab;
        return (
          <a
            key={tab.index}
            href={`/?tab=${tab.index}`}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-md -mb-px border border-b-0 transition-colors",
              isActive
                ? "border-border bg-background text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {tab.title}
          </a>
        );
      })}
    </div>
  );
}
