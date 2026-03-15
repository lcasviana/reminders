"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { useReminders } from "@/context/reminders-context";
import { ReminderDetail } from "@/features/reminders/reminder-detail";
import { type SmartList, isSmartList } from "@/schemas/smart-list.schema";

import { AllView } from "./all-view";
import { CompletedView } from "./completed-view";
import { FlaggedView } from "./flagged-view";
import { ListView } from "./list-view";
import { ScheduledView } from "./scheduled-view";
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

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-end border-b px-4 py-2">
        <Button variant="ghost" size="icon" onClick={() => setEditingReminderId("new")} aria-label="New Reminder">
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isSmartList(selectedView) ? <SmartListView view={selectedView} /> : <ListView listId={selectedView} />}
      </div>
      <ReminderDetail />
    </div>
  );
}
