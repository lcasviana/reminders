"use client";

import { useReminders } from "@/context/reminders-context";
import { SMART_LISTS, type SmartList } from "@/schemas/smart-list.schema";

import { AllView } from "./all-view";
import { CompletedView } from "./completed-view";
import { FlaggedView } from "./flagged-view";
import { ListView } from "./list-view";
import { ScheduledView } from "./scheduled-view";
import { TodayView } from "./today-view";

function isSmartList(view: string): view is SmartList {
  return (SMART_LISTS as readonly string[]).includes(view);
}

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
  const { selectedView } = useReminders();

  return (
    <div className="flex-1 overflow-y-auto">
      {isSmartList(selectedView) ? <SmartListView view={selectedView} /> : <ListView listId={selectedView} />}
    </div>
  );
}
