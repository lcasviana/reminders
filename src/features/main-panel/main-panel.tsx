"use client";

import { useReminders } from "@/context/reminders-context";
import type { SmartList } from "@/schemas/smart-list.schema";

import { AllView } from "./all-view";
import { CompletedView } from "./completed-view";
import { FlaggedView } from "./flagged-view";
import { ScheduledView } from "./scheduled-view";
import { TodayView } from "./today-view";

const SMART_LIST_VIEWS: Record<SmartList, React.ReactNode> = {
  Today: <TodayView />,
  Scheduled: <ScheduledView />,
  All: <AllView />,
  Flagged: <FlaggedView />,
  Completed: <CompletedView />,
};

export function MainPanel() {
  const { selectedView } = useReminders();
  return <div className="flex-1 overflow-y-auto">{SMART_LIST_VIEWS[selectedView as SmartList] ?? null}</div>;
}
