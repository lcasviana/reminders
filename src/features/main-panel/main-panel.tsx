"use client";

import { useState } from "react";

import { Cancel01Icon, PlusSignIcon, Search01Icon, Share05Icon, SlidersHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReminders } from "@/context/reminders-context";
import { ReminderDetail } from "@/features/reminders/reminder-detail";
import { LIST_TEXT_COLOR_MAP, SMART_LIST_TEXT_COLOR_MAP } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { type SmartList, isSmartList } from "@/schemas/smart-list.schema";

import { AllView } from "./all-view";
import { CompletedView } from "./completed-view";
import { FlaggedView } from "./flagged-view";
import { ListView } from "./list-view";
import { ScheduledView } from "./scheduled-view";
import { SearchView } from "./search-view";
import { TodayView } from "./today-view";

function SmartListView({ view }: { view: SmartList }) {
  switch (view) {
    case "Today":
      return <TodayView />;
    case "Scheduled":
      return <ScheduledView />;
    case "All":
      return <AllView />;
    case "Flagged":
      return <FlaggedView />;
    case "Completed":
      return <CompletedView />;
  }
}

export function MainPanel() {
  const { selectedView, lists, setEditingReminderId } = useReminders();

  const smartList = isSmartList(selectedView) ? selectedView : null;
  const currentList = smartList ? null : lists.find((l) => l.id === selectedView);
  const viewTitle = smartList ?? currentList?.name ?? "";
  const viewTitleColor = smartList ? SMART_LIST_TEXT_COLOR_MAP[smartList] : (LIST_TEXT_COLOR_MAP[currentList?.color ?? ""] ?? "text-gray-500");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between gap-1 border-b px-4 py-2">
        <span className={cn("text-lg font-bold", viewTitleColor)}>{viewTitle}</span>
        {searchOpen && (
          <Input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reminders…"
            className="mr-1 h-7 w-48"
            onKeyDown={(e) => e.key === "Escape" && closeSearch()}
          />
        )}
        {currentList && (
          <>
            <Button variant="ghost" size="icon" aria-label="Share list">
              <HugeiconsIcon icon={Share05Icon} strokeWidth={2} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="View options">
              <HugeiconsIcon icon={SlidersHorizontalIcon} strokeWidth={2} />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={searchOpen ? closeSearch : () => setSearchOpen(true)}
          aria-label={searchOpen ? "Close search" : "Search"}
        >
          <HugeiconsIcon icon={searchOpen ? Cancel01Icon : Search01Icon} strokeWidth={2} />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setEditingReminderId("new")} aria-label="New Reminder">
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {searchQuery.trim() ? (
          <SearchView query={searchQuery.trim()} />
        ) : smartList ? (
          <SmartListView view={smartList} />
        ) : (
          <ListView listId={selectedView} />
        )}
      </div>
      <ReminderDetail />
    </div>
  );
}
