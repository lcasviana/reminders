"use client";

import { useState } from "react";

import { Cancel01Icon, PlusSignIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReminders } from "@/context/reminders-context";
import { ReminderDetail } from "@/features/reminders/reminder-detail";
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
  const { selectedView, setEditingReminderId } = useReminders();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-end gap-1 border-b px-4 py-2">
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
        ) : isSmartList(selectedView) ? (
          <SmartListView view={selectedView} />
        ) : (
          <ListView listId={selectedView} />
        )}
      </div>
      <ReminderDetail />
    </div>
  );
}
